var DRAGGABLE_BIND_FLAG      = 'tests|draggable-bind-flag';
var CURSOR_POSITION_PROPERTY = 'tc-cpp-ac4a65d4';
var SCROLL_POSITION_PROPERTY = 'tc-spp-ac4a65d4';
var DRAGGABLE_CLASS          = 'draggable';
var DRAG_STARTED_PROPERTY    = 'dragStarted';
var hasTouchEvents           = !!('ontouchstart' in window);

/*eslint-disable no-unused-vars */
var initDraggable = function (win, doc, $el) {
    var $doc = $(doc);
    var $win = $(win);

    if (!$doc.data(DRAGGABLE_BIND_FLAG)) {
        $doc.data(DRAGGABLE_BIND_FLAG, true);
        $doc.data(CURSOR_POSITION_PROPERTY, null);

        $doc.bind(hasTouchEvents ? 'touchmove' : 'mousemove', function (e) {
            var curMousePos = hasTouchEvents ? {
                x: e.originalEvent.targetTouches[0].pageX || e.originalEvent.touches[0].pageX,
                y: e.originalEvent.targetTouches[0].pageY || e.originalEvent.touches[0].pageY
            } : {
                x: e.clientX,
                y: e.clientY
            };

            $.each($doc.find('.' + DRAGGABLE_CLASS), function () {
                var $this = $(this);

                if ($(this).data(DRAG_STARTED_PROPERTY)) {
                    $this.css({
                        left: Math.round($this.position().left) + curMousePos.x -
                              $doc.data(CURSOR_POSITION_PROPERTY).x,

                        top: Math.round($this.position().top) + curMousePos.y -
                             $doc.data(CURSOR_POSITION_PROPERTY).y
                    });
                    return false;
                }
            });

            $doc.data(CURSOR_POSITION_PROPERTY, curMousePos);
        });
    }

    if (!$win.data(DRAGGABLE_BIND_FLAG)) {
        $win.data(DRAGGABLE_BIND_FLAG, true);
        $win.data(SCROLL_POSITION_PROPERTY, {
            x: 0,
            y: 0
        });

        $win.scroll(function () {
            var x = $win.scrollLeft() - $win.data(SCROLL_POSITION_PROPERTY).x;
            var y = $win.scrollTop() - $win.data(SCROLL_POSITION_PROPERTY).y;

            $win.data(SCROLL_POSITION_PROPERTY).x = $win.scrollLeft();
            $win.data(SCROLL_POSITION_PROPERTY).y = $win.scrollTop();

            $.each($doc.find('.' + DRAGGABLE_CLASS), function () {
                var $this = $(this);

                if ($(this).data(DRAG_STARTED_PROPERTY)) {
                    $this.css({
                        left: $this.position().left + x,
                        top:  $this.position().top + y
                    });
                    return false;
                }
            });
        });
    }

    $el.addClass(DRAGGABLE_CLASS);

    $el.bind(hasTouchEvents ? 'touchstart' : 'mousedown', function (e) {
        doc[CURSOR_POSITION_PROPERTY] = hasTouchEvents ? {
            x: e.originalEvent.targetTouches[0].pageX || e.originalEvent.touches[0].pageX,
            y: e.originalEvent.targetTouches[0].pageY || e.originalEvent.touches[0].pageY
        } : {
            x: e.clientX,
            y: e.clientY
        };

        $doc.data(CURSOR_POSITION_PROPERTY, doc[CURSOR_POSITION_PROPERTY]);

        $(this).data(DRAG_STARTED_PROPERTY, true);
    });

    $el.bind(hasTouchEvents ? 'touchend' : 'mouseup', function () {
        doc[CURSOR_POSITION_PROPERTY] = null;
        $(this).data(DRAG_STARTED_PROPERTY, false);
    });
};
/*eslint-disable no-unused-vars */
