import { ClientFunction, Selector } from 'testcafe';

fixture `gh-1258`
    .page `http://localhost:3000/fixtures/regression/gh-1258/pages/input-with-range.html`;

const input                   = Selector('input');
const getRaisedEventsCounters = ClientFunction(()=> {
    return {
        inputCount:  window.inputEventRaisedCount,
        changeCount: window.changeEventRaisedCount
    };
});


test('Type incorrect time', async t => {
    await t
        .typeText(input, '13:12')
        .expect(input.value).eql('');

    const eventCounters = await getRaisedEventsCounters();

    await t
        .expect(eventCounters.inputCount).eql(0)
        .expect(eventCounters.changeCount).eql(0);
});

test('Type correct time', async t => {
    await t
        .typeText(input, '12:12')
        .expect(input.value).eql('12:12');

    const eventCounters = await getRaisedEventsCounters();

    await t
        .expect(eventCounters.inputCount).eql(1)
        .expect(eventCounters.changeCount).eql(1);
});
