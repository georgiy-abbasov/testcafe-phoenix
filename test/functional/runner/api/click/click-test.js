var TestCafe   = require('../../../../../../lib/');
var ERROR_TYPE = require('../../../../../../lib/test-error/type');
var expect     = require('chai').expect;


describe('click api tests', function () {
    var CLICK_API_TEST_SRC = './test/functional/tests/runner/api/click/click.test.js';

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

    it('Should successfully run tests with base click functionality', function (done) {
        var run = runner
            .reporter('list', process.stdout, formatError)
            .src(CLICK_API_TEST_SRC)
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

    it('Should fail when the first argument is empty', function (done) {
        var run = runner
            .reporter('list', silentStream, formatError)
            .src(CLICK_API_TEST_SRC)
            .filter(function (testName) {
                return testName === 'SHOULD FAIL: when the first argument is empty';
            })
            .run()
            .then(function (passed) {
                expect(passed).eql(false);
                expect(errors.length).eql(1);
                expect(errors[0].code).eql(ERROR_TYPE.emptyFirstArgument);
            });

        run
            .then(done)
            .catch(function (err) {
                done(err);
            });
    });

    it('Should fail when the first argument is invisible', function (done) {
        var run = runner
            .reporter('list', silentStream, formatError)
            .src(CLICK_API_TEST_SRC)
            .filter(function (testName) {
                return testName === 'SHOULD FAIL: when the first argument is invisible';
            })
            .run()
            .then(function (passed) {
                expect(passed).eql(false);
                expect(errors.length).eql(1);
                expect(errors[0].code).eql(ERROR_TYPE.invisibleActionElement);
            });

        run
            .then(done)
            .catch(function (err) {
                done(err);
            });
    });
});
