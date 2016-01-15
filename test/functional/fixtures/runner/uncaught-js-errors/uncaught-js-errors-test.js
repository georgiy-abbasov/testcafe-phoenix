var expect    = require('chai').expect;
var errorType = 'Uncaught JavaScript error Uncaught Error:';

describe('Uncaught js errors.', function () {
    it('Should fail when are no handler', function () {
        return runTests('no-handler/test.js', null, { shouldFail: true })
            .catch(function (err) {
                expect(err).to.contains(errorType);
            });
    });
    it('Should fail when handler returns undefined', function () {
        return runTests('handler-returns-undefined/test.js', null, { shouldFail: true })
            .catch(function (err) {
                expect(err).to.contains(errorType);
            });
    });

    it('Should fail when iframe\'s source is a page with handler which returns undefined', function () {
        return runTests('iframe-with-src/test.js', null, { shouldFail: true })
            .catch(function (err) {
                expect(err).to.contains(errorType);
            });
    });

    it('Should fail when loaded page throws error', function () {
        return runTests('loaded/test.js', null, { shouldFail: true })
            .catch(function (err) {
                expect(err).to.contains(errorType);
            });
    });

    it('Should success cross domain iframe', function () {
        return runTests('cross-domain-iframe/test.js', null)
            .then(function (err) {
                expect(err).eql('');
            });
    });

    it('Should success when handler returns true', function () {
        return runTests('handler-returns-true/test.js', null)
            .then(function (err) {
                expect(err).eql('');
            });
    });

    it('Should success when are no handler (skipJsErrors enabled)', function () {
        return runTests('no-handler/test.js', null, { skipJsErrors: true })
            .then(function (err) {
                expect(err).eql('');
            });
    });

    it('Should success when handler returns undefined (skipJsErrors enabled)', function () {
        return runTests('handler-returns-undefined/test.js', null, { skipJsErrors: true })
            .then(function (err) {
                expect(err).eql('');
            });
    });

    it('Should success when iframe\'s source is a page with handler which returns undefined (skipJsErrors enabled)', function () {
        return runTests('iframe-with-src/test.js', null, { skipJsErrors: true })
            .then(function (err) {
                expect(err).eql('');
            });
    });

    it('Should success when loaded page throws error (skipJsErrors enabled)', function () {
        return runTests('loaded/test.js', null, { skipJsErrors: true })
            .then(function (err) {
                expect(err).eql('');
            });
    });
});
