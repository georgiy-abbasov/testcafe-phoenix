'@fixture regression click';
'@page ./tests/runner/api/click/regression.html';

'@require :eventTracker';
'@require :browser';

var timeoutCalled = false;

'@test'['Q558721 - Test running hangs if element is hidden in non-scrollable container'] = {
    '1.Click on button inside container with negative offset': function () {
        var $div = $('#hiddenDiv');

        eventTracker.track($div, 'click');

        act.click($div);
    },

    '2.Check that button is clicked': function () {
        eq(eventTracker.getCount($('#hiddenDiv'), 'click'), 1, 'hidden div clicked');
    }
};

'@test'['B253520 - Blur event is not raised during click playback if previous active element becomes invisible via css on mousedown handler in IE9'] = {
    '1.Bind required handlers and call click for button': function () {
        var $input  = $('#inputText');
        var $button = $('#input');

        eventTracker.track($input, 'blur');

        $button.mousedown(function () {
            //NOTE: in IE we should call window.focus() to be sure that after set 'display = none'
            //blur event will raise
            if (browser.isIE)
                window.focus();

            $input.css('display', 'none');
            //sometimes (in IE9 for example) element becomes invisible not immediately
            // after css set, we should stop our code and wait
            waitUntilCssApply($input);
        });

        $input[0].focus();

        act.click($button);
    },

    '2.Check that input blur event was raised': function () {
        //NOTE: in IE if browser is in focus two 'blur' event is raised for element
        //and if browser isn't in focus only one 'blur' event
        ok(eventTracker.getCount($('#inputText'), 'blur'), browser.isIE ? 2 : 1);
    }
};

'@test'['Mouseup should be called asynchronously after mousedown'] = {
    '1.Bind required handlers and call click for input': function () {
        var $input = $('#input');
        var shared = this;

        $input.bind('mousedown', mousedownHandlerWithTimeout);

        $input.bind('mouseup', function () {
            shared.mouseupRaised = true;
            ok(timeoutCalled, 'check that timeout was set and mousedown handler was called before mouseup');
        });

        act.click($input);
    },

    '2.Check that mouseup event was raised': function () {
        ok(this.mouseupRaised);
    }
};

'@test'['Click on link with line break'] = {
    '@testCases': [
        { '@name': 'T163678 - A Click action on a link with a line break does not work', elementSelector: '#link1' },
        {
            '@name':         'T224332 - TestCafe problem with click on links in popup menu (click on link with span inside without offset)',
            elementSelector: '#link2'
        },
        {
            '@name':         'T224332 - TestCafe problem with click on links in popup menu (click on span inside the link without offset)',
            elementSelector: '#link2 > span'
        }
    ],

    '1.Bind required handlers and call click': function () {
        var $link = $(this.elementSelector);

        eventTracker.track($link, 'click');

        act.click($link);
    },

    '2.Check that link was clicked': function () {
        eq(eventTracker.getCount($(this.elementSelector), 'click'), 1);
    }
};

'@test'['T253883 - Playback - It is impossible to type a password'] = {
    '1.Click input element inside label': function () {
        act.click('#inputInLabel');
    },

    '2.Check that active element on page is input': function () {
        eq(document.activeElement, $('#inputInLabel')[0]);
    }
};

//ONLY: touch devices
'@test'['T170088 - Touch events raises with correct touch lists (only for touch devices)'] = {
    '1.Bind touch event handlers and call click': function () {
        var $input = $('#input');
        var shared = this;

        var touchEventHandler = function (e) {
            shared[e.type] = true;

            eq(e.touches.length, e.type === 'touchend' ? 0 : 1);
            eq(e.targetTouches.length, e.type === 'touchend' ? 0 : 1);
            eq(e.changedTouches.length, 1);
        };

        $input.on({
            touchstart: touchEventHandler,
            touchend:   touchEventHandler,
            touchmove:  touchEventHandler
        });

        act.click($input);
    },

    '2.Check that handlers were called': function () {
        if (browser.hasTouchEvents)
            ok(this.touchstart && this.touchend && this.touchmove);
    }
};

//utils
function waitUntilCssApply ($el) {
    if ($el[0].getBoundingClientRect().width > 0) {
        var timeout      = 2;
        var startSeconds = (new Date()).getSeconds();
        var endSeconds   = (startSeconds + timeout) % 60;

        while ($el[0].getBoundingClientRect().width > 0) {
            if ((new Date()).getSeconds() > endSeconds)
                break;
        }
    }
}

function mousedownHandlerWithTimeout () {
    window.setTimeout(function () {
        timeoutCalled = true;
    }, 0);
}
