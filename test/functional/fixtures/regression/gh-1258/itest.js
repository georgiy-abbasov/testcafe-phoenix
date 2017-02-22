describe('[Regression](GH-1258)', function () {
    it('Should type in empty input with "time" type', function () {
        return runTests('testcafe-fixtures/empty-input.test.js', 'Type in empty input');
    });

    it('Should not type in ranged input, if text does not meet the time range', function () {
        return runTests('testcafe-fixtures/input-with-range.test.js', 'Type incorrect time');
    });

    it('Should type in ranged input, if text meets the time range', function () {
        return runTests('testcafe-fixtures/input-with-range.test.js', 'Type correct time');
    });

    it('Should raise "input" and "change" while we replace existen value', function () {
        return runTests('testcafe-fixtures/filled-input.test.js', 'Type in filled input');
    });

    it('Should raise "input" and "change" while we replace existen value with wrong value', function () {
        return runTests('testcafe-fixtures/filled-input.test.js', 'Type incorrect value');
    });
});
