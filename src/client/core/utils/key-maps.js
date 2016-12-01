import hammerhead from '../deps/hammerhead';

var browserUtils = hammerhead.utils.browser;


const MODIFIERS = {
    alt:   18,
    ctrl:  17,
    meta:  91,
    shift: 16
};

const SHIFT_MAP = {
    '~': '`',
    '!': '1',
    '@': '2',
    '#': '3',
    '$': '4',
    '%': '5',
    '^': '6',
    '&': '7',
    '*': '8',
    '(': '9',
    ')': '0',
    '_': '-',
    '+': '=',
    '{': '[',
    '}': ']',
    ':': ';',
    '"': '\'',
    '|': '\\',
    '<': ',',
    '>': '.',
    '?': '/'
};

const SPECIAL_KEYS = {
    backspace: 8,
    capslock:  20,
    delete:    46,
    down:      40,
    end:       35,
    enter:     13,
    esc:       27,
    home:      36,
    ins:       45,
    left:      37,
    pagedown:  34,
    pageup:    33,
    right:     39,
    space:     32,
    tab:       9,
    up:        38
};

function reverseMap (map) {
    var reversed = {};

    for (var key in map) {
        if (map.hasOwnProperty(key))
            reversed[map[key]] = key;
    }

    return reversed;
}

export default {
    modifiers: MODIFIERS,

    shiftMap: SHIFT_MAP,

    specialKeys: SPECIAL_KEYS,

    reversedModifiers: reverseMap(MODIFIERS),

    reversedShiftMap: reverseMap(SHIFT_MAP),

    reversedSpecialKeys: reverseMap(SPECIAL_KEYS),

    modifiersMap: {
        option: 'alt'
    },

    keyProperty: {
        backspace: 'Backspace',
        capslock:  'CapsLock',
        delete:    'Delete',
        down:      'ArrowDown',
        end:       'End',
        enter:     'Enter',
        esc:       'Escape',
        home:      'Home',
        ins:       'Insert',
        left:      'ArrowLeft',
        pagedown:  'PageDown',
        pageup:    'PageUp',
        right:     'ArrowRight',
        space:     ' ',
        tab:       'Tab',
        up:        'ArrowUp',
        alt:       'Alt',
        ctrl:      'Control',
        meta:      'Meta',
        shift:     'Shift'
    },

    keyIdentifierProperty: {
        backspace: 'U+0008',
        capslock:  'CapsLock',
        delete:    'U+007F',
        down:      'Down',
        end:       'End',
        enter:     'Enter',
        esc:       'U+001B',
        home:      'Home',
        ins:       'Insert',
        left:      'Left',
        pagedown:  'PageDown',
        pageup:    'PageUp',
        right:     'Right',
        space:     'U+0020',
        tab:       'Tab',
        up:        'Up',
        alt:       'Alt',
        ctrl:      'Control',
        meta:      'Meta',
        shift:     'Shift',
        a:         'U+0041',
        b:         'U+0042',
        c:         'U+0043',
        d:         'U+0044',
        e:         'U+0045',
        f:         'U+0046',
        g:         'U+0047',
        h:         'U+0048',
        i:         'U+0049',
        j:         'U+004A',
        k:         'U+004B',
        l:         'U+004C',
        m:         'U+004D',
        n:         'U+004E',
        o:         'U+004F',
        p:         'U+0050',
        q:         'U+0051',
        r:         'U+0052',
        s:         'U+0053',
        t:         'U+0054',
        u:         'U+0055',
        v:         'U+0056',
        w:         'U+0057',
        x:         'U+0058',
        y:         'U+0059',
        z:         'U+005A'
    },

    symbolCharCodeToKeyCode: {
        96: 192,    // `
        91: 219,    // [
        93: 221,    // ]
        92: 220,    // \
        59: 186,    // ;
        39: 222,    // '
        44: 188,    // ,
        45: browserUtils.isFirefox ? 173 : 189,    // -
        46: 190,    // .
        47: 191     // /
    },

    symbolKeysCharCodes: {
        109: 45,
        173: 45,
        186: 59,
        187: 61,
        188: 44,
        189: 45,
        190: 46,
        191: 47,
        192: 96,
        219: 91,
        220: 92,
        221: 93,
        222: 39,

        110: 46,
        96:  48,
        97:  49,
        98:  50,
        99:  51,
        100: 52,
        101: 53,
        102: 54,
        103: 55,
        104: 56,
        105: 57,
        107: 43,
        106: 42,
        111: 47
    }
};
