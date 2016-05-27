fixture `Drag`
    .page `http://localhost:3000/download/pages/index.html`;

test('Simple download', async t => {
    await t
        .click('#download-link')
        .click('#div');
});

test('Download after redirect', async t => {
    await t
        .click('#download-page-link')
        .click('#div');
});

test('Delayed download', async t => {
    await t
        .click('#delayed-download')
        .wait(6000)
        .click('#div');
});
