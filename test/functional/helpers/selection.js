function set ($el, startSelection, endSelection, inverse) {
    var el            = $el[0];
    var start         = startSelection || 0;
    var end           = endSelection || start;
    var startPosition = inverse ? end : start; //NOTE: set to start position

    el.focus();

    if (el.setSelectionRange)
        el.setSelectionRange(startPosition, startPosition);
    else {
        el.selectionStart = startPosition;
        el.selectionEnd   = startPosition;
    }

    //NOTE: select
    if (el.setSelectionRange)
        el.setSelectionRange(start, end, inverse ? 'backward' : 'forward');
    else {
        el.selectionStart = start;
        el.selectionEnd   = end;
    }
}

function compareWithActiveElementSelection ($el, startNode, startOffset, endNode, endOffset) {
    var curDocument = findDocument($el[0]);
    var selection   = curDocument.getSelection();

    eq(getActiveElement(), $el[0]);
    ok(isTheSameNode(startNode, selection.anchorNode));
    eq(selection.anchorOffset, startOffset);
    ok(isTheSameNode(endNode, selection.focusNode));
    eq(selection.focusOffset, endOffset);
}

function findDocument (el) {
    if (el.documentElement) return el;

    if (el.ownerDocument && el.ownerDocument.defaultView) return el.ownerDocument;

    return el.parentNode ? findDocument(el.parentNode) : document;
}

function hasInverseSelection (el) {
    return (el.selectionDirection || el.dataset.selectionDirection) === 'backward';
}

function hasInverseSelectionContentEditable (el) {
    var curDocument = el ? findDocument(el) : document;
    var selection   = curDocument.getSelection();
    var range       = null;
    var backward    = false;

    if (selection) {
        if (!selection.isCollapsed) {
            range    = curDocument.createRange();
            range.setStart(selection.anchorNode, selection.anchorOffset);
            range.setEnd(selection.focusNode, selection.focusOffset);
            backward = range.collapsed;
            range.detach();
        }
    }

    return backward;
}

function isTheSameNode (node1, node2) {
    //NOTE: Mozilla has not isSameNode method
    var result = null;

    if (node1 && node2 && node1.isSameNode)
        result = node1.isSameNode(node2);
    else
        result = node1 === node2;

    return result;
}

function getActiveElement () {
    return document.activeElement;
}

function getRealCaretPosition ($el, node, offset) {
    var currentOffset = 0;
    var find          = false;

    function checkChildNodes (target) {
        var childNodes = target.childNodes;

        if (find)
            return currentOffset;

        if (isTheSameNode(node, target)) {
            find = true;
            return currentOffset + offset;
        }

        if (!childNodes.length && target.nodeValue && target.nodeValue.length)
            currentOffset += target.nodeValue.length;

        $.each(childNodes, function (index, value) {
            currentOffset = checkChildNodes(value);
        });

        return currentOffset;
    }

    return checkChildNodes($el[0]);
}

function getSelectionByElement (el) {
    var currentDocument = findDocument(el);

    return currentDocument ? currentDocument.getSelection() : window.getSelection();
}

function getSelection (el, selection, inverseSelection) {
    var correctedStart = _getSelectionStart(el, selection, inverseSelection);
    var correctedEnd   = _getSelectionEnd(el, selection, inverseSelection);

    return {
        startNode:   correctedStart.node,
        startOffset: correctedStart.offset,
        endNode:     correctedEnd.node,
        endOffset:   correctedEnd.offset
    };
}

function getSelectionStart (el) {
    return el.selectionStart;
}

function getSelectionEnd (el) {
    return el.selectionEnd;
}

function _getSelectionStart (el, selection, inverseSelection) {
    var startNode              = inverseSelection ? selection.focusNode : selection.anchorNode;
    var startOffset            = inverseSelection ? selection.focusOffset : selection.anchorOffset;
    var correctedStartPosition = {
        node:   startNode,
        offset: startOffset
    };

    //NOTE: window.getSelection() can't returns not rendered node like selected node, so we shouldn't check it
    if ((isTheSameNode(el, startNode) || startNode.nodeType === 1) && startNode.childNodes &&
        startNode.childNodes.length) correctedStartPosition = getSelectedPositionInParentByOffset(startNode, startOffset);

    return {
        node:   correctedStartPosition.node,
        offset: correctedStartPosition.offset
    };
}

function _getSelectionEnd (el, selection, inverseSelection) {
    var endNode              = inverseSelection ? selection.anchorNode : selection.focusNode;
    var endOffset            = inverseSelection ? selection.anchorOffset : selection.focusOffset;
    var correctedEndPosition = {
        node:   endNode,
        offset: endOffset
    };

    //NOTE: window.getSelection() can't returns not rendered node like selected node, so we shouldn't check it
    if ((isTheSameNode(el, endNode) || endNode.nodeType === 1) && endNode.childNodes &&
        endNode.childNodes.length) correctedEndPosition = getSelectedPositionInParentByOffset(endNode, endOffset);

    return {
        node:   correctedEndPosition.node,
        offset: correctedEndPosition.offset
    };
}

function getSelectedPositionInParentByOffset (node, offset) {
    var currentNode          = null;
    var currentOffset        = null;
    var isSearchForLastChild = offset >= node.childNodes.length;

    //NOTE: IE behavior
    if (isSearchForLastChild) currentNode = node.childNodes[node.childNodes.length - 1];
    else {
        currentNode   = node.childNodes[offset];
        currentOffset = 0;
    }

    while (isRenderedNode(currentNode) && currentNode.nodeType === 1) {
        if (currentNode.childNodes &&
            currentNode.childNodes.length) {
            currentNode = currentNode.childNodes[isSearchForLastChild ? currentNode.childNodes.length -
                                                                        1 : 0];
        }
        else {
            //NOTE: if we didn't find a text node then always set offset to zero
            currentOffset = 0;
            break;
        }
    }

    if (currentOffset !== 0 &&
        isRenderedNode(currentNode)) currentOffset = currentNode.nodeValue ? currentNode.nodeValue.length : 0;

    return {
        node:   currentNode,
        offset: currentOffset
    };
}

function isRenderedNode (node) {
    return !(node.nodeType === 7 || node.nodeType === 8 || /^(script|style)$/i.test(node.nodeName));
}

/*eslint-disable no-unused-vars */
var selectionUtil = {
    compareWithActiveElementSelection:  compareWithActiveElementSelection,
    getRealCaretPosition:               getRealCaretPosition,
    getSelection:                       getSelection,
    getSelectionByElement:              getSelectionByElement,
    getSelectionStart:                  getSelectionStart,
    getSelectionEnd:                    getSelectionEnd,
    hasInverseSelection:                hasInverseSelection,
    hasInverseSelectionContentEditable: hasInverseSelectionContentEditable,
    set:                                set
};
/*eslint-disable no-unused-vars */
