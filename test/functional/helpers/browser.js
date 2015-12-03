var userAgent           = window.navigator.userAgent.toLowerCase();
var isIE11              = !!(navigator.appCodeName === 'Mozilla' && /trident\/7.0/.test(userAgent));
var isIOS               = /(iphone|ipod|ipad)/.test(userAgent);
var isSafari            = isIOS || /safari/.test(userAgent) && !/chrome/.test(userAgent);
var isMSEdge            = !!/edge\//.test(userAgent);
var majorBrowserVersion = isIE11 ? 11 : parseInt($.browser.version, 10);

function getMSEdgeVersion () {
    var edgeStrIndex = userAgent.indexOf('edge/');

    return parseInt(userAgent.substring(edgeStrIndex + 5, userAgent.indexOf('.', edgeStrIndex)), 10);
}

/*eslint-disable no-unused-vars */
var browser = {
    hasTouchEvents: !!('ontouchstart' in window),
    isIE:           !!$.browser.msie || isIE11,
    isIE11:         isIE11,
    isMozilla:      !!$.browser.mozilla && !isIE11,
    isWebKit:       /webkit/.test(userAgent) && !isSafari && !isMSEdge,
    isOpera:        !!$.browser.opera,
    version:        isMSEdge ? getMSEdgeVersion() : majorBrowserVersion
};
/*eslint-enable no-unused-vars */
