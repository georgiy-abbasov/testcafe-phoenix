import { ClientFunction, Selector } from 'testcafe';

fixture `gh-1258`
    .page `http://localhost:3000/fixtures/regression/gh-1258/pages/empty-input.html`;

const input                   = Selector('input');
const getRaisedEventsCounters = ClientFunction(()=> {
    return {
        inputCount:  window.inputEventRaisedCount,
        changeCount: window.changeEventRaisedCount
    };
});

test('Type in empty input', async t => {
    await t
        .typeText(input, '12:12')
        .expect(input.value).eql('12:12');

    const eventCounters = await getRaisedEventsCounters();

    await t
        .expect(eventCounters.inputCount).eql(1)
        .expect(eventCounters.changeCount).eql(1);
});
