const DEFAULTS = {
    L1: 100,
    L2: 100,
    L3: 100,
};

export class Board {
    constructor() {
        this._state = {};
        this._onChange = (changes) => {};
    }

    onChange(func) {
        this._onChange = func;
    }

    set(data) {
        const changed = {};
        for (const key in data) {
            if (this._state[key] !== data[key]) {
                changed[key] = data[key];
            }
        }
        Object.assign(this._state, data);
        if (Object.keys(changed).length) {
            this._onChange(changed);
        }
    }

    get(btn) {
        if (!(btn in this._state)) {
            this._state[btn] = DEFAULTS[btn] || 0;
        }
        return this._state[btn];
    }
}
