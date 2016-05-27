it('Should resume test after downloading started', function () {
    return runTests('testcafe-fixtures/index.test.js', 'Simple download');
});

it('Should resume test after redirect to the download page ( page with iframe with binary as src attribute)', function () {
    return runTests('testcafe-fixtures/index.test.js', 'Download after redirect');
});

it('Should resume test after started delayed download', function () {
    return runTests('testcafe-fixtures/index.test.js', 'Delayed download');
});
