'@fixture handler returns true';
'@page ./handler-returns-true/index.html';

'@test'['handler returns true test'] = {
    '1.Wait error': function () {
        act.wait(0);
    }
};
