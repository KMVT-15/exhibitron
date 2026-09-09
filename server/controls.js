import { clamp, map, wrap, reflect } from "./util.js";

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
        { default: d = 0, sensitivity = 100, clamp = true, loop = true } = {},
    ) {
        super(handler, { default: d });
        this.sensitivity = sensitivity;
        this.raw_value = null;
        this.clamp = clamp;
        this.loop = loop;
        this.direction = 1;
    }

    input(raw) {
        if (this.raw_value === null) this.raw_value = raw;

        const delta = raw - this.raw_value;
        this.raw_value = raw;
        const step = map(delta, 0, this.sensitivity / 2, 0, 1);

        if (this.loop) {
            const attempted = this.value + step * this.direction;
            const [new_val, new_dir] = reflect(attempted, this.direction);
            this.direction = new_dir;
            this.set(new_val);
        } else if (this.clamp) {
            this.set(clamp(this.value + step, 0, 1));
        } else {
            this.set(this.value + step);
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

// export class EncoderGroup {
//     constructor(handler, opts = {}) {
//         this.control = new Control(handler, opts);
//         this.sensitivity = opts.sensitivity ?? 100;
//     }

//     get value() {
//         return this.control.value;
//     }

//     reset() {
//         this.control.reset();
//     }

//     channel() {
//         const control = this.control;
//         const sensitivity = this.sensitivity;
//         let raw_value = null;

//         return {
//             input(raw) {
//                 if (raw_value === null) raw_value = raw;
//                 const delta = raw - raw_value;
//                 raw_value = raw;
//                 control.set(
//                     clamp(
//                         control.value + map(delta, 0, sensitivity, 0, 1),
//                         0,
//                         1,
//                     ),
//                 );
//             },
//         };
//     }
// }

export class EncoderGroup {
    constructor(handler, opts = {}) {
        this.control = new Control(handler, opts);
        this.sensitivity = opts.sensitivity ?? 100;
        this.loop = opts.loop ?? true;
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
        const loop = this.loop;
        let raw_value = null;
        let direction = 1;

        return {
            input(raw) {
                if (raw_value === null) raw_value = raw;
                const delta = raw - raw_value;
                raw_value = raw;
                const step = map(delta, 0, sensitivity / 2, 0, 1);

                if (loop) {
                    const attempted = control.value + step * direction;
                    const [new_val, new_dir] = reflect(attempted, direction);
                    direction = new_dir;
                    control.set(new_val);
                } else {
                    control.set(clamp(control.value + step, 0, 1));
                }
            },
        };
    }
}
