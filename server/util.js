export function map(v, b0, b1, b2, b3) {
    return b2 + ((v - b0) * (b3 - b2)) / (b1 - b0);
}

export function clamp(v, b0, b1) {
    if (v < b0) return b0;
    else if (v > b1) return b1;
    else return v;
}

export function wrap(value, min, max) {
    const range = max - min;
    return ((((value - min) % range) + range) % range) + min;
}

export function reflect(value, dir) {
    while (value > 1 || value < 0) {
        if (value > 1) {
            value = 2 - value;
            dir = -dir;
        } else if (value < 0) {
            value = -value;
            dir = -dir;
        }
    }
    return [value, dir];
}

export function rgba_to_decimal(r, g, b, a = 255) {
    return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
}

export function hsl_to_rgb(h, s, l) {
    let r, g, b;
    h /= 360;

    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        const f = (t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        r = f(h + 1 / 3);
        g = f(h);
        b = f(h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
