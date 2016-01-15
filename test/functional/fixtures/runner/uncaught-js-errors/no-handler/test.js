'@fixture no handler';
'@page ./no-handler/index.html';

'@test'['no handler test'] = {
    '1.Wait error': function () {
        act.wait(0);
    }
};
