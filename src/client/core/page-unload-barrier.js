import hammerhead from './deps/hammerhead';
import { asyncServiceMsg } from './transport';
import * as eventUtils from './utils/event';
import * as COMMAND from '../../legacy/test-run/command';
import delay from './utils/delay';

var Promise       = hammerhead.Promise;
var browserUtils  = hammerhead.utils.browser;
var nativeMethods = hammerhead.nativeMethods;


const DEFAULT_BARRIER_TIMEOUT       = 1500;
const WAIT_FOR_UNLOAD_TIMEOUT       = 3000;
const SHORT_WAIT_FOR_UNLOAD_TIMEOUT = 30;
const CHECK_FILE_DOWNLOADING_DELAY  = 500;


var waitingForUnload          = null;
var waitingForUnloadTimeoutId = null;
var waitingPromiseResolvers   = [];
var beforeUnloadRaised        = false;
var unloadRaised                 = false;
var fileDownloadInterval      = null;

function overrideFormSubmit (form) {
    var submit = form.submit;

    form.submit = () => {
        prolongUnloadWaiting(WAIT_FOR_UNLOAD_TIMEOUT);
        submit.apply(form, arguments);
    };
}

function handleSubmit () {
    eventUtils.bind(document, 'submit', e => {
        if (e.target.tagName.toLowerCase() === 'form')
            prolongUnloadWaiting(WAIT_FOR_UNLOAD_TIMEOUT);
    });

    var forms = document.getElementsByTagName('form');

    for (var i = 0; i < forms.length; i++)
        overrideFormSubmit(forms[i]);
}

function onBeforeUnload (e) {
    if (e.isFakeIEBeforeUnloadEvent)
        return;

    if (!browserUtils.isIE) {
        beforeUnloadRaised = true;

        return;
    }

    prolongUnloadWaiting(SHORT_WAIT_FOR_UNLOAD_TIMEOUT);

    delay(0)
        .then(() => {
            // NOTE: except file downloading
            if (document.readyState === 'loading' &&
                !(document.activeElement && document.activeElement.tagName.toLowerCase() === 'a' &&
                document.activeElement.hasAttribute('download')))
                beforeUnloadRaised = true;
        });
}

function handleBeforeUnload () {
    hammerhead.on(hammerhead.EVENTS.beforeUnload, onBeforeUnload);
    eventUtils.bind(window, 'unload', () => {
        unloadRaised = true;
    });
}

function prolongUnloadWaiting (timeout) {
    if (waitingForUnloadTimeoutId)
        window.clearTimeout(waitingForUnloadTimeoutId);

    waitingForUnload = true;

    waitingForUnloadTimeoutId = nativeMethods.setTimeout.call(window, () => {
        waitingForUnloadTimeoutId = null;
        waitingForUnload          = false;

        waitingPromiseResolvers.forEach(resolve => resolve());
        waitingPromiseResolvers = [];
    }, timeout);
}

function waitForFile () {
    return new Promise(resolve => {
        fileDownloadInterval = nativeMethods.setInterval.call(window, () => {
            asyncServiceMsg({ cmd: COMMAND.getAndUncheckFileDownloadingFlag }, res => {
                if (res) {
                    stopWaitingForFile();
                    resolve();
                }
            });
        }, CHECK_FILE_DOWNLOADING_DELAY);
    });
}

function stopWaitingForFile () {
    if (fileDownloadInterval) {
        nativeMethods.clearInterval.call(window, fileDownloadInterval);
        fileDownloadInterval = null;
    }

    unloadRaised = false;
}


// API
export function init () {
    handleSubmit();
    handleBeforeUnload();
}

export function wait () {
    return new Promise(resolve => {
        delay(DEFAULT_BARRIER_TIMEOUT)
            .then(() => {
                if (beforeUnloadRaised && !unloadRaised) {
                    if (waitingForUnload)
                        waitingPromiseResolvers.push(resolve);
                    else {
                        waitForFile()
                            .then(() => {
                                beforeUnloadRaised = false;
                                resolve();
                            });
                    }
                }
                else
                    resolve();
            });
    });
}
