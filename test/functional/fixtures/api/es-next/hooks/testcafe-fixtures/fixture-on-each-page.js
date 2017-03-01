import { Selector, ClientFunction } from 'testcafe';

fixture `fixture.onEachPage test`
    .page `http://example.com`
    .onEachPage(async t => {
        console.log('on each page executed');
        await t.click(Selector(() => document.body));

        onEachPageExecuted++;
    })
    .beforeEach(() => {
        console.log('fixture before each executed');
    });

let onEachPageExecuted = 0;

test('Some test 1', async (t) => {

    await t
        .navigateTo('http://google.com')
        .click(Selector(() => document.body));

    await ClientFunction(()=>document.querySelector('a').click())();

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
