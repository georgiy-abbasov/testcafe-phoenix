var SaucelabsConnector = require('saucelabs-connector');
var browserNatives     = require('testcafe-browser-natives');
var Promise            = require('es6-promise').Promise;

var getInstallations = browserNatives.getInstallations;
var openBrowser      = browserNatives.open;
var closeBrowser     = browserNatives.close;


var BrowserHelper = module.exports = function (browsersInfo, sauceLabsSettings) {
    this.browsersInfo = browsersInfo;
    this.slSettings   = sauceLabsSettings;

    this.slConnector = sauceLabsSettings ?
                       new SaucelabsConnector(sauceLabsSettings.username, sauceLabsSettings.accessKey) : null;

    this.slBrowsers    = [];
    this.localBrowsers = [];
};

BrowserHelper.prototype.openBrowsers = function () {
    var helper               = this;
    var startBrowserPromises = [];

    if (this.slConnector) {
        return this.slConnector
            .connect()
            .then(function () {
                startBrowserPromises = helper.browsersInfo.map(function (browserInfo) {
                    return helper.slConnector.startBrowser(browserInfo.settings, browserInfo.connection.url, helper.slSettings.jobName);
                });

                return Promise.all(startBrowserPromises);
            })
            .then(function (sauceLabsBrowsers) {
                helper.slBrowsers = sauceLabsBrowsers;
            });
    }

    return getInstallations()
        .then(function (installations) {
            startBrowserPromises = helper.browsersInfo.map(function (browserInfo) {
                return openBrowser(installations[browserInfo.settings.alias], browserInfo.connection.url);
            });

            return Promise.all(startBrowserPromises);
        })
        .then(function () {
            helper.localBrowsers = helper.browsersInfo;
        });
};

BrowserHelper.prototype.closeBrowsers = function () {
    var helper               = this;
    var closeBrowserPromises = null;

    if (this.slConnector) {
        closeBrowserPromises = this.slBrowsers.map(function (browser) {
            return helper.slConnector.stopBrowser(browser);
        });

        return Promise.all(closeBrowserPromises)
            .then(function () {
                return helper.slConnector.disconnect();
            });
    }

    closeBrowserPromises = this.localBrowsers.map(function (browser) {
        return closeBrowser(browser.connection.getStatus().url);
    });

    return Promise.all(closeBrowserPromises);
};
