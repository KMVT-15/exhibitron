import { clamp, map } from "./util.js";

export class Control {
    constructor(handler, { default: d = 0 } = {}) {
        this.handler = handler;
        this.default = d;
        this.value = d;
    }

    set(value) {
        this.value = value;
        this.handler(value);
        console.log(value);
    }

    reset() {
        this.set(this.default);
    }
}

export class Encoder extends Control {
    constructor(
        handler,
        { default: d = 0, sensitivity = 100, clamp = true } = {},
    ) {
        super(handler, { default: d });
        this.sensitivity = sensitivity;
        this.raw_value = null;
        this.clamp = clamp;
    }

    input(raw) {
        if (this.raw_value === null) this.raw_value = raw;

        const delta = raw - this.raw_value;
        this.raw_value = raw;

        const new_val = this.value + map(delta, 0, this.sensitivity, 0, 1);

        if (this.clamp) {
            this.set(clamp(new_val, 0, 1));
        } else {
            this.set(new_val);
        }
    }
}

export class Analog extends Control {
    constructor(handler, { min = 0, max = 255, default: d = 0 } = {}) {
        super(handler, { default: d });
        this.min = min;
        this.max = max;
    }

    input(raw) {
        this.set(clamp(map(raw, this.min, this.max, 0, 1), 0, 1));
    }
}

export class Digital extends Control {
    constructor(handler, { default: d = false } = {}) {
        super(handler, { default: d });
    }

    input(raw) {
        this.set(raw !== 0);
    }
}

export class Toggle extends Control {
    constructor(handler, { default: d = false } = {}) {
        super(handler, { default: d });
        this.raw_previous = 0;
    }

    input(raw) {
        if (raw !== 0 && this.raw_previous === 0) {
            this.set(!this.value);
        }
        this.raw_previous = raw;
    }
}

export class Hold extends Control {
    constructor(handler, { interval = 5 } = {}) {
        super(handler, { default: false });

        this.timer = null;
        this.pressed_at = null;
        this.interval = interval;
    }

    input(raw) {
        if (raw !== 0 && !this.timer) {
            this.handler(0);
            this.pressed_at = Date.now();
            this.timer = setInterval(() => {
                var should_exit = this.handler(Date.now() - this.pressed_at);
                if (should_exit) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
            }, this.interval);
        } else {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

export class EncoderGroup {
    constructor(handler, opts = {}) {
        this.control = new Control(handler, opts);
        this.sensitivity = opts.sensitivity ?? 100;
    }

    get value() {
        return this.control.value;
    }

    reset() {
        this.control.reset();
    }

    channel() {
        const control = this.control;
        const sensitivity = this.sensitivity;
        let raw_value = null;

        return {
            input(raw) {
                if (raw_value === null) raw_value = raw;
                const delta = raw - raw_value;
                raw_value = raw;
                control.set(
                    clamp(
                        control.value + map(delta, 0, sensitivity, 0, 1),
                        0,
                        1,
                    ),
                );
            },
        };
    }
}
