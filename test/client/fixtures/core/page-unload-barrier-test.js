var hammerhead    = window.getTestCafeModule('hammerhead');
var testCafeCore  = window.getTestCafeModule('testCafeCore');
var Promise       = hammerhead.Promise;
var iframeSandbox = hammerhead.sandbox.iframe;

var iframe                  = null;
var iframePageUnloadBarrier = null;
var waitIframeLoad          = null;
var waitBeforeUnload        = null;

QUnit.testStart(function () {
    iframeSandbox.on(iframeSandbox.RUN_TASK_SCRIPT, window.initIFrameTestHandler);
    iframeSandbox.off(iframeSandbox.RUN_TASK_SCRIPT, iframeSandbox.iframeReadyToInitHandler);

    iframe = $('<iframe id="test2">')[0];

    QUnit.stop();

    //NOTE: we need this to wait while iframe is initialized (it is done with some timeout in Firefox)
    iframe.onload = function () {
        var iframeHammerhead = iframe.contentWindow.eval("window['%hammerhead%']");

        iframePageUnloadBarrier = iframe.contentWindow.eval("window['%testCafeCore%'].pageUnloadBarrier");
        iframePageUnloadBarrier.init();

        waitIframeLoad = function () {
            return new Promise(function (resolve) {
                iframe.onload = resolve;
            });
        };

        waitBeforeUnload = function () {
            return new Promise(function (resolve) {
                iframeHammerhead.on(iframeHammerhead.EVENTS.beforeBeforeUnload, resolve);
            });
        };


        iframeHammerhead.on(iframeHammerhead.EVENTS.unload, function () {
            console.log('r');
        });


        QUnit.start();
    };

    document.body.appendChild(iframe);
});

QUnit.testDone(function () {
    iframeSandbox.off(iframeSandbox.RUN_TASK_SCRIPT, window.initIFrameTestHandler);
    document.body.removeChild(iframe);
});

$(document).ready(function () {
    asyncTest('Should resolve wait promise if there is no page redirect', function () {
        iframePageUnloadBarrier
            .wait()
            .then(function () {
                ok(true, 'just check promise is resolved');
                start();
            });
    });

    asyncTest('Should wait for timeout for a possible page redirect', function () {
        var pageUnloadBarrierResolved = false;

        iframe.contentWindow.location = '/xhr-test/600';    // delay should be greater then page load barrier timeout

        waitBeforeUnload()
            .then(function () {
                return iframePageUnloadBarrier.wait();
            })
            .then(function () {
                pageUnloadBarrierResolved = true;
            });

        waitIframeLoad()
            .then(function () {
                ok(!pageUnloadBarrierResolved);
                start();
            });
    });

    asyncTest('Should not resolve waiting promise if page is unloading after click on a link', function () {
        var iframeDocument = iframe.contentDocument;
        var link           = iframeDocument.createElement('a');

        link.href        = 'http://example.com';
        link.textContent = 'link';
        iframeDocument.body.appendChild(link);

        link.click();

        var pageUnloadBarrierResolved = false;

        waitBeforeUnload()
            .then(function () {
                return iframePageUnloadBarrier.wait();
            })
            .then(function () {
                pageUnloadBarrierResolved = true;
            });

        waitIframeLoad()
            .then(function () {
                ok(!pageUnloadBarrierResolved);
                start();
            });
    });

    asyncTest('Should not resolve waiting promise if page is unloading after click on a link (5000)', function () {
        console.log('our test');
        var iframeDocument = iframe.contentDocument;
        var link           = iframeDocument.createElement('a');

        link.href        = '/xhr-test/5000';
        link.textContent = 'link';
        iframeDocument.body.appendChild(link);

        link.click();

        var pageUnloadBarrierResolved = false;

        waitBeforeUnload()
            .then(function () {
                return iframePageUnloadBarrier.wait();
            })
            .then(function () {
                pageUnloadBarrierResolved = true;
            });

        iframe.contentWindow.addEventListener('unload', function (event) {
            console.log('I am the 4th and last one…');
        });

        waitIframeLoad()
            .then(function () {
                ok(!pageUnloadBarrierResolved);
                start();
            });
    });
});
