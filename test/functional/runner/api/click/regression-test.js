var TestCafe   = require('../../../../../../lib/');
var ERROR_TYPE = require('../../../../../../lib/test-error/type');
var expect     = require('chai').expect;


describe('regression click api tests', function () {
    var REGRESSION_CLICK_API_TEST_SRC = './test/functional/tests/runner/api/click/regression.test.js';

    var testCafe = null;
    var runner   = null;
    var errors   = [];

    function formatError (err) {
        errors.push(err);

        return err.stepName + ': ' + err.code + ' (actual:' + err.actual + ', expected: ' + err.expected + ')';
    }

    var silentStream = {
        write: function () {
        },
        end:   function () {
        }
    };

    // Fixture setup/teardown
    before(function () {
        testCafe = new TestCafe(1335, 1336);
    });

    after(function () {
        testCafe.close();
    });


    // Test setup/teardown
    beforeEach(function () {
        errors   = [];
        runner = testCafe.createRunner();
        runner.browsers('chrome');
    });

    it('Should successfully run tests with regression click functionality', function (done) {
        var run = runner
            .reporter('list', process.stdout, formatError)
            .src(REGRESSION_CLICK_API_TEST_SRC)
            .filter(function (testName) {
                return testName.indexOf('SHOULD FAIL:') < 0;
            })
            .run()
            .then(function (passed) {
                expect(passed).eql(true);
            });

        run
            .then(done)
            .catch(function (err) {
                done(err);
            });
    });
});
