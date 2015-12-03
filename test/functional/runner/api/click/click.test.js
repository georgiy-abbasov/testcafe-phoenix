'@fixture click';
'@page ./runner/api/click/index.html';

'@require :eventTracker';
'@require :browser';
'@require :event';

var clickCount  = 0;
var errorScroll = false;

'@test'['Call click with different arguments'] = {
    '1.Call click for dom element as a parameter': function () {
        var $input = $('#input');

        eventTracker.track($input, 'click');

        act.click($input[0]);
    },

    '2.Check clicked state and call click for jQuery object as a parameter': function () {
        var $input = $('#input');

        checkThatElementClicked($input);

        act.click($input);
    },

    '3.Check clicked state and call click for jQuery object with two elements as a parameter': function () {
        var $input = $('#input');

        checkThatElementClicked($input);

        eventTracker.track($('#input1'), 'click');

        act.click($('[type="button"]'));
    },

    '4.Check click count and call click for dom elements array as a parameter': function () {
        var $firstInput  = $('#input');
        var $secondInput = $('#input1');

        checkThatElementClicked($firstInput);
        checkThatElementClicked($secondInput);

        act.click([$firstInput[0], $secondInput[0]]);
    },

    '5.Check click count and call click for jQuery objects array as a parameter': function () {
        var $firstInput  = $('#input');
        var $secondInput = $('#input1');
        var $thirdInput  = $('#inputText');

        checkThatElementClicked($firstInput);
        checkThatElementClicked($secondInput);

        eventTracker.track($thirdInput, 'click');

        act.click([$('[type="button"]'), $thirdInput]);
    },

    '6.Check click count': function () {
        var $firstInput  = $('#input');
        var $secondInput = $('#input1');
        var $thirdInput  = $('#inputText');

        checkThatElementClicked($firstInput);
        checkThatElementClicked($secondInput);
        checkThatElementClicked($thirdInput);
    },

    '7.Call click for function as s first parameter': function () {
        var $input = $('#input');

        $input.click(function () {
            var $tempButton = $('<button class="tempButton">button</button>')
                .css({
                    position:   'absolute',
                    marginLeft: '210px',
                    marginTop:  '210px'
                })
                .appendTo('body');

            eventTracker.track($tempButton, 'click');
        });

        function getArguments () {
            return ['#input', '.tempButton'];
        }

        act.click(getArguments);
    },

    '8.Check click count': function () {
        checkThatElementClicked($('#input'));
        checkThatElementClicked($('.tempButton'));
    }
};

'@test'['Call click with options keys'] = {
    '1.Call click with option keys': function () {
        var $input = $('#input');
        var shared = this;

        $input.click(function (e) {
            shared.alt   = e.altKey;
            shared.ctrl  = e.ctrlKey;
            shared.shift = e.shiftKey;
            shared.meta  = e.metaKey;
        });

        act.click($input, {
            alt:   true,
            ctrl:  true,
            shift: true,
            meta:  true
        });
    },

    '2.Check click event options': function () {
        ok(this.alt, 'alt key is pressed');
        ok(this.shift, 'shift key is pressed');
        ok(this.ctrl, 'ctrl key is pressed');
        ok(this.meta, 'meta key is pressed');
    }
};

'@test'['Check mouse events raised correctly'] = {
    '1.Bind mouse event handlers and call click': function () {
        var $input = $('#input');
        var shared = this;

        shared.events = [];

        //B234358
        if (!browser.hasTouchEvents)
            eventTracker.track($input, ['mousemove', 'mouseover', 'mouseenter']);

        $input.on('mousedown mouseup click', function (e) {
            shared.events.push(e.type);

            eq(e.button, 0);

            if (browser.isIE || browser.isMozilla)
                eq(e.buttons, 1);
        });

        act.click($input);
    },

    '2.Check that handlers were called': function () {
        var $input = $('#input');

        if (!browser.hasTouchEvents) {
            ok(eventTracker.getCount($input, 'mousemove') > 0);
            eq(eventTracker.getCount($input, 'mouseover'), 1);
            eq(eventTracker.getCount($input, 'mouseenter'), 1);
        }

        eq(this.events, ['mousedown', 'mouseup', 'click']);
    }
};

'@test'['Pointer events test (T191183) [ONLY:IE]'] = {
    'Bind pointer event handlers and call click': function () {
        var $input = $('#input');
        var shared = this;

        shared.events = [];

        function pointerEventHandler (e) {
            shared.events.push(e.type.toLowerCase().replace('ms', ''));

            eq(e.pointerType, browser.version > 10 ? 'mouse' : 4);
            eq(e.button, 0);
            eq(e.buttons, 1);
        }

        if (browser.isIE) {
            if (browser.version > 11)
                $input.on('pointerdown pointerup', pointerEventHandler);
            else {
                $input[0].onmspointerdown = pointerEventHandler;
                $input[0].onmspointerup   = pointerEventHandler;
            }
        }

        act.click($input);
    },

    '2.Check that handlers were called': function () {
        if (browser.isIE)
            eq(this.events, ['pointerdown', 'pointerup']);
    }
};

//ONLY: touch devices
'@test'['Touch event test (only for touch devices)'] = {
    '1.Bind touch event handlers and call click': function () {
        var $input = $('#input');

        eventTracker.track($input, ['touchstart', 'touchend', 'mousedown', 'mouseup', 'click']);

        act.click($input);
    },

    '2.Check that handlers were called': function () {
        var $input = $('#input');

        if (browser.hasTouchEvents) {
            eq(eventTracker.getCount($input, 'touchstart'), 1);
            eq(eventTracker.getCount($input, 'touchend'), 1);
            eq(eventTracker.getCount($input, 'mousedown'), 1);
            eq(eventTracker.getCount($input, 'mouseup'), 1);
            eq(eventTracker.getCount($input, 'click'), 1);
        }
    }
};

'@test'['Click with scrolling'] = {
    '1.Call click action with offset (scroll down)': function () {
        var $aimDiv = $('#aim').css('marginTop', '2344px');

        eventTracker.track($aimDiv, 'click');

        act.click('#div4', { offsetX: 100, offsetY: 2350 });
    },

    '2.Check clicked state and call click action again (scroll up)': function () {
        var $aimDiv = $('#aim');

        checkThatElementClicked($aimDiv);

        $aimDiv.css('marginTop', '44px');
        $('#div1').scrollTop(322);
        $('#div2').scrollTop(322);
        $('#div3').scrollTop(322);
        $('#div4').scrollTop(1186);

        act.click('#div4', { offsetX: 100, offsetY: 50 });
    },

    '3.Check clicked state and call click for element (scroll container is require)': function () {
        checkThatElementClicked($('#aim'));

        var $div = $('#div5');

        eventTracker.track($div, 'click');

        act.click($div);
    },

    '4.Check clicked state and call click for element (scroll page is require)': function () {
        checkThatElementClicked($('#div5'));

        var $input = $('#input');

        $input.css('marginTop', '1000px');
        eventTracker.track($input, 'click');

        act.click($input);
    },

    '5.Check clicked state': function () {
        checkThatElementClicked($('#input'));
    }
};

'@test'['Check element is focused on click'] = {
    '1.Bind handler and call click': function () {
        var $input = $('#inputText');

        eventTracker.track($input, 'focus');

        act.click($input);
    },

    '2.Check focus event raised': function () {
        var $input = $('#inputText');

        eq(eventTracker.getCount($input, 'focus'), 1, 'clicked element focused');
        eq(document.activeElement, $input[0]);
    }
};

'@test'['Click twice on the same position'] = {
    '1.Bind handler and call click': function () {
        var $input = $('#input');

        eventTracker.track($input, 'click');

        act.click($input);
    },

    '2.Call click second time': function () {
        act.click('#input');
    },

    '3.Check click event count': function () {
        eq(eventTracker.getCount($('#input'), 'click'), 2, 'click event was raised twice');
    }
};

'@test'['Cancel bubbling'] = {
    '1.Bind handlers and call click for element in container': function () {
        var $container = $('#div1');
        var $child     = $('#div2');
        var shared     = this;

        $child[0].onclick = function (e) {
            shared.childClick = true;

            (e || window.event).cancelBubble = true;
        };

        eventTracker.track($container, 'click');

        act.click($child);
    },

    '2.Check that bubbling canceled': function () {
        ok(this.childClick);
        ok(!eventTracker.getCount($('#div1'), 'click'), 'bubble canceled');
    }
};

'@test'['Click on outer element raises event for inner element'] = {
    '1.Bind handlers and call focus for element\'s container': function () {
        var $div       = $('#div2');
        var $container = $('#div1');

        eventTracker.track($div, 'click');
        eventTracker.track($container, 'click');

        act.click($container);
    },

    '2.Check that element was clicked': function () {
        eq(eventTracker.getCount($('#div2'), 'click'), 1, 'element clicked');
        eq(eventTracker.getCount($('#div1'), 'click'), 1, 'element container clicked');
    }
};

'@test'['Focus event doesn\'t raised on click if mousedown event prevented'] = {
    '1.Click on input which prevent mousedown event': function () {
        var input  = $('#inputText')[0];
        var shared = this;

        input.onmousedown = event.preventDefault;
        input.onfocus     = function () {
            shared.focusRaised = true;
        };

        act.click(input);
    },

    '2.Check input is not active element': function () {
        notOk(this.focusRaised);
        eq(document.activeElement, document.body);
    }
};

'@test'['Click element with scroll then click body near to first click does not raise scroll again'] = {
    '1. Click on element first time': function () {
        var $div = $('#div5');

        $div.click(function () {
            clickCount++;
        });

        $div.bind('mousedown', function () {
            unbindScrollHandlers();
        });

        bindScrollHandlers();

        act.click($div);
    },

    '2.Click on element second time': function () {
        eq(clickCount, 1);

        bindScrollHandlers();

        act.click($('#div5'));
    },

    '3.Check scrolling': function () {
        eq(clickCount, 2);
        notOk(errorScroll);
    }
};

'@test'['[SHOULD FAIL] when the first argument is empty'] = {
    '1.Click on an nonexistent element': function () {
        act.click('#nonexistentElement');
    }
};

'@test'['[SHOULD FAIL] when the first argument is invisible'] = {
    '1.Click on an nonexistent element': function () {
        var $input = $('#input').css('visibility', 'hidden');

        act.click($input);
    }
};

//utils
function checkThatElementClicked ($el) {
    eq(eventTracker.getCount($el, 'click'), 1, 'element clicked');
    eventTracker.reset($el, 'click');
}

function scrollHandler () {
    if (clickCount === 1)
        errorScroll = true;
}

function bindScrollHandlers () {
    var $container = $('#div1');

    $container.bind('scroll', scrollHandler);
    $(window).bind('scroll', scrollHandler);
}

function unbindScrollHandlers () {
    var $container = $('#div1');

    $container.unbind('scroll', scrollHandler);
    $(window).unbind('scroll', scrollHandler);
}
