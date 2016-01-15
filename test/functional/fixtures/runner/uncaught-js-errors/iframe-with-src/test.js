'@fixture iframe with src';
'@page ./iframe-with-src/index.html';

'@test'['iframe with src test'] = {
    '1.Wait error': inIFrame('#iframe', function () {
        act.wait(0);
    })
};
