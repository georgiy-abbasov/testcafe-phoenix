'@fixture loaded';
'@page ./loaded/index.html';

'@test'['loaded test'] = {
    '1.Wait error': function () {
        act.wait(0);
    }
};
