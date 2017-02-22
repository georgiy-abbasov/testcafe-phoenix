import { Selector } from 'testcafe';

fixture `gh-1258`
    .page `http://localhost:3000/fixtures/regression/gh-1258/pages/filled-input.html`;

const input = Selector('input');
/*const getRaisedEventsCounters = ClientFunction(()=> {
    return {
        inputCount:  window.inputEventRaisedCount,
        changeCount: window.changeEventRaisedCount
    };
});*/

test('Type in filled input', async t => {
    await t
        .typeText(input, '110000')
        .expect(input.value).eql('11:00:00.452');

    await t
        .typeText(input, '22', { caretPos: 0 })
        .expect(input.value).eql('22:00:00.452');

    await t
        .typeText(input, '33', { caretPos: 1 })
        .expect(input.value).eql('23:30:00.452');

    await t
        .typeText(input, '11:33', { caretPos: 1 })
        .expect(input.value).eql('21:13:30.452');

    await t
        .typeText(input, '22:22', { caretPos: 3 })
        .expect(input.value).eql('21:22:22.452');
});

test('Type incorrect value', async t=> {
    await t
        .typeText(input, '21:22:22.452', { caretPos: 0 })
        .typeText(input, '92:29', { caretPos: 2 })
        .expect(input.value).eql('21:09:22.952');
});
