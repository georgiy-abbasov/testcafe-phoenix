'@fixture cross domain iframe';
'@page ./cross-domain-iframe/index.html';

'@test'['cross domain iframe test'] = {
    '1.Wait error': inIFrame('#iframe', function () {
        act.wait(0);
    })
};
