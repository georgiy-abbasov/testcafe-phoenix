import { ClientFunction } from 'testcafe';

const increaseHookCounter = ClientFunction(()=> {
    window.hookCounter = window.hookCounter || 0;

    window.hookCounter++;
});

const getHookCounter = ClientFunction(() => window.hookCounter);

fixture `fixture.onEachPage test`
    .page `http://localhost:3000/fixtures/api/es-next/hooks/pages/index.html`
    .onEachPage(async () => {
        await increaseHookCounter();
    });


test('Execute hook on first page load', async (t) => {
    await t.expect(getHookCounter()).eql(1);
});


fixture `fail in hook`
    .page `http://localhost:3000/fixtures/api/es-next/hooks/pages/index.html`
    .onEachPage(async t => {
        await t
            .click('#onEachPage')
            .click('#failAndReport');
    });


test('fail hook on first page load', async (t) => {
    await t.click('fakeSelector');
});


/*

test('Some test 2 ', async (t) => {
    console.log(onEachPageExecuted);
    await t
        .navigateTo('http://google.com');
    console.log(onEachPageExecuted);

    await t.wait(3000);
    console.log(onEachPageExecuted);

    await t
        .navigateTo('http://example.com');
    console.log(onEachPageExecuted);
});
*/
