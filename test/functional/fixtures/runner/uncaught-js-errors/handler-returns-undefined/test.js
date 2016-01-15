'@fixture handler returns undefined';
'@page ./handler-returns-undefined/index.html';

'@test'['handler returns undefined test'] = {
    '1.Wait error': function () {
        act.wait(0);
    }
};
