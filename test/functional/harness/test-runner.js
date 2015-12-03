var testCafe     = require('./index').testCafe;
var browsersInfo = require('./index').browsersInfo;


function checkTestCafeReport (testCafeReport) {
    var testResults = testCafeReport ? JSON.parse(testCafeReport).fixtures[0].tests : [];

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

    function checkBrowserByTestOptions (testName, browserAlias) {
        return checkTestByBrowserAlias(testName, browserAlias);
    }

    function filterTestErrorsByTestOptions (testName, errors) {
        return errors.filter(function (error) {
            var browserAlias = browsersInfo.filter(function (browserInfo) {
                return browserInfo.connection.userAgent === error.match(/([^]*?)[\r\n]/)[1];
            })[0].settings.alias;

            return checkTestByBrowserAlias(testName, browserAlias);
        });
    }

    var results = {};
    testResults
        .filter(function (test) {
            return test.errs.length > 0;
        })
        .forEach(function (test) {
            var browserAliases = browsersInfo.map(function (browserInfo) {
                return browserInfo.settings.alias
            });

            var actualUserAgents = browserAliases.filter(function (alias) {
                return checkBrowserByTestOptions(test.name, alias);
            });

            var actualBrowsersLength = actualUserAgents.length;
            var actualTestErrorsLength = filterTestErrorsByTestOptions(test.name, test.errs).length;

            if (actualTestErrorsLength) {
                if (actualTestErrorsLength !== actualBrowsersLength)
                    results[test.name] = test.errs;
                else
                    results[test.name] = test.errs[0].replace(/([^]*?[\r\n])/, '');
            }
        });

    if (Object.keys(results).length > 0)
        throw results;
}

exports.runTests = function (fixture, targetTestName) {
    var testCafeReport = '';
    var runner         = testCafe.createRunner();
    var connections    = browsersInfo.map(function (browserInfo) {
        return browserInfo.connection;
    });

    runner.browsers(connections);

    runner.filter(function (testName) {
        return targetTestName ? testName === targetTestName : true;
    });

    return runner
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
            checkTestCafeReport(testCafeReport);
        });
};
