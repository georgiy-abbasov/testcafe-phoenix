var harness      = require('./harness/index');
var testCafe     = harness.testCafe;
var browsersInfo = harness.browsersInfo;


function checkTestByBrowserAlias (testName, browserAlias) {
    var matchesOnly = testName.match(/\[ONLY\:([,\w]*)\]/);
    var matchesSkip = testName.match(/\[SKIP\:([,\w]*)\]/);

    var only = true;
    var skip = false;

    if (matchesOnly !== null) {
        only = matchesOnly[1].indexOf(browserAlias) > -1;
    }

    if (matchesSkip !== null)
        skip = matchesSkip[1].indexOf(browserAlias) > -1;

    return only && !skip;
}

function filterTestErrorsByTestOptions (testName, errors) {
    return errors.filter(function (error) {
        var browserAlias = browsersInfo.filter(function (browserInfo) {
            return browserInfo.connection.userAgent === error.match(/([^]*?)[\r\n]/)[1];
        })[0].settings.alias;

        return checkTestByBrowserAlias(testName, browserAlias);
    });
}

function getFailedTests (testCafeReport) {
    if (!testCafeReport)
        return {};

    var testResults    = JSON.parse(testCafeReport).fixtures[0].tests;
    var failedTests    = {};

    var browserAliases = browsersInfo.map(function (browserInfo) {
        return browserInfo.settings.alias
    });

    testResults
        .filter(function (test) {
            return test.errs.length > 0;
        })
        .forEach(function (test) {
            var actualUserAgents = browserAliases.filter(function (alias) {
                return checkTestByBrowserAlias(test.name, alias);
            });

            var actualBrowsersLength = actualUserAgents.length;
            var actualTestErrorsLength = filterTestErrorsByTestOptions(test.name, test.errs).length;

            if (actualTestErrorsLength) {
                if (actualTestErrorsLength !== actualBrowsersLength)
                    failedTests[test.name] = test.errs;
                else {
                    failedTests[test.name] = test.errs[0]
                        .replace(/([^]*?[\r\n])/, '')
                        .split('\n')
                        .map(function (str) {
                            return str.trim();
                        })
                        .join(' ');
                }
            }
        });

    return failedTests;
}

exports.runTests = function (fixture, testName) {
    var testCafeReport = '';
    var runner         = testCafe.createRunner();
    var connections    = browsersInfo.map(function (browserInfo) {
        return browserInfo.connection;
    });

    return runner
        .browsers(connections)
        .filter(function (test) {
            return testName ? test === testName : true;
        })
        .reporter('json', {
            write: function (data) {
                testCafeReport += data;
            },

            end: function (data) {
                testCafeReport += data;
            }
        })
        .src(fixture)
        .run()
        .then(function () {
            var failedTests = getFailedTests(testCafeReport);

            if (Object.keys(failedTests).length > 0)
                throw failedTests;
        });
};
