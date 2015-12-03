function preventDefault (e) {
    var ev = e || window.event;

    if (ev.preventDefault)
        ev.preventDefault();
    else
        ev.returnValue = false;
}

/*eslint-disable no-unused-vars */
var event = {
    preventDefault: preventDefault
};
/*eslint-disable no-unused-vars */
