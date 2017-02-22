import { ClientFunction, Selector } from 'testcafe';

fixture `gh-1258`
    .page `http://localhost:3000/fixtures/regression/gh-1258/pages/filled-input.html`;

const input                   = Selector('input');
const getRaisedEventsCounters = ClientFunction(()=> {
    return {
        inputCount:  window.inputEventRaisedCount,
        changeCount: window.changeEventRaisedCount
    };
});

test('Type in filled input', async t => {
    await t
        .typeText(input, '15:05:05.500')
        .expect(input.value).eql('15:05:05.500');

    const eventCounters = await getRaisedEventsCounters();

    await t
        .expect(eventCounters.inputCount).eql(10)
        .expect(eventCounters.changeCount).eql(10);
});
