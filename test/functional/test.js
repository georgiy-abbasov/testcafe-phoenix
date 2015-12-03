var runTest = require('./harness/test-runner.js').runTests;
var expect  = require('chai').expect;


describe('api click test', function () {
    it('Should fail when the first argument is invisible', function (done) {
        runTest('test/functional/runner/api/click/click.test.js', '[SHOULD FAIL] when the first argument is invisible')
            .then(function () {
                done('test should fail but was succeed');
            })
            .catch(function (errs) {
                var expectedError = [
                    'Error at step "1.Click on an nonexistent element":',
                    '',
                    'act.click($input);',
                    '',
                    'A target element \<input id="input"\> of the click action is not visible.',
                    'If this element should appear when you are hovering over another',
                    'element, make sure that you properly recorded the hover action.'
                ].join(' ');

                expect(errs['[SHOULD FAIL] when the first argument is invisible']).eql(expectedError);
            })
            .then(done)
            .catch(function (err) {
                done(err);
            });
    });
});
