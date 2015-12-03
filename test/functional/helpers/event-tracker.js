var EVENT_DATA_PREFIX = 'et-';


function track ($el, events) {
    if (typeof events === 'string')
        events = [events];

    $el.on(events.join(' '), function (e) {
        $el.data(EVENT_DATA_PREFIX + e.type, ($el.data(EVENT_DATA_PREFIX + e.type) || 0) + 1);
    });
}

function reset ($el, events) {
    if (typeof events === 'undefined') {
        var data = $el.data();

        for (var key in data) {
            if (data.hasOwnProperty(key) && key.indexOf(EVENT_DATA_PREFIX) === 0)
                $el.data(key, 0);
        }
    }
    else {
        if (typeof events === 'string')
            events = [events];

        events.forEach(function (event) {
            $el.data(EVENT_DATA_PREFIX + event, 0);
        });
    }
}

function getCount ($el, event) {
    return $el.data(EVENT_DATA_PREFIX + event) || 0;
}

/*eslint-disable no-unused-vars */
var eventTracker = {
    track:    track,
    reset:    reset,
    getCount: getCount
};
/*eslint-enable no-unused-vars */
