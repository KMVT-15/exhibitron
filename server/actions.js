import fs from "fs";
import path from "path";

function TODO(o, v, b) {}

function map_range(v, b0, b1, b2, b3) {
    return b2 + ((v - b0) * (b3 - b2)) / (b1 - b0);
}

function map(v, b0, b1) {
    return map_range(v, 0, 100, b0, b1);
}

function rgba_to_decimal(r, g, b, a = 255) {
    return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
}

function hsl_to_rgb(h, s, l) {
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

function on_press(f) {
    return (o, v, b) => {
        if (v == 1) {
            return f(o, v, b);
        }
    };
}

function toggle(f) {
    var state = false;

    return (o, v, b) => {
        if (v == 1) {
            state = !state;
            f(o, state, b);
        }
    };
}

function on_hold(f, interval = 100) {
    var timer = null;

    return (o, v, b) => {
        if (v == 1 && !timer) {
            f(o, v, b);
            timer = setInterval(() => f(o, v, b), interval);
        } else {
            clearInterval(timer);
            timer = null;
        }
    };
}

function set_cam(scene, cam) {
    return (o) => {
        for (var i = 1; i <= 6; i++) {
            if (i == cam) {
                o.setVisibility(scene, `Camera ${i}`, true);
            } else {
                o.setVisibility(scene, `Camera ${i}`, false);
            }
        }
    };
}

function set_overlay(idx) {
    return (o) => {
        // pass
    };
}

const bg_img_dir = "../assets/backgrounds";
const bg_img_list = fs.readdirSync(bg_img_dir).map((f) => path.parse(f).name);
var bg_img_spinner_running = false;

function set_random_bg(o) {
    if (bg_img_spinner_running) return;
    bg_img_spinner_running = true;

    const steps = 40;
    const final_img =
        bg_img_list[Math.floor(Math.random() * bg_img_list.length)];

    let i = 0;
    function tick() {
        const img =
            i === steps - 1
                ? final_img
                : bg_img_list[Math.floor(Math.random() * bg_img_list.length)];

        console.log(img);
        set_bg_img(img)(o);

        i++;
        if (i < steps) {
            const delay = 40 + Math.pow(i / steps, 3) * 400;
            setTimeout(tick, delay);
        } else {
            bg_img_spinner_running = false;
        }
    }

    tick();
}
var fg_rotation = 0;
var fg_posn_x = 1920 / 2;
var fg_posn_y = 1080 / 2;

function set_fg_rotation(obs, val) {
    fg_rotation = val;

    obs.setItemTransform("BLEND", "Foreground", {
        rotation: fg_rotation,
    });
}

function set_fg_posn(obs, x, y) {
    fg_posn_x = x;
    fg_posn_y = y;

    obs.setItemTransform("BLEND", "Foreground", {
        positionX: fg_posn_x,
        positionY: fg_posn_y,
    });
}

function reset_fg_translation(o) {
    set_fg_rotation(o, 0);
    set_fg_posn(o, 1920 / 2, 1080 / 2);
}

function change_fg_rotation(delta) {
    return (o) => {
        set_fg_rotation(o, fg_rotation + delta);
    };
}

function change_fg_posn(dx, dy) {
    return (o) => {
        set_fg_posn(o, fg_posn_x + dx, fg_posn_y + dy);
    };
}

function set_fg_mask(path) {
    return (o) => {
        o.setFilterSettings("Foreground", "Image Mask", {
            image_path: `/Users/counter/exhibitron/assets/masks/${path}.png`,
        });
    };
}

function set_mosaic(divs) {
    return (o) => {
        o.setFilterSettings("Foreground", "Mosaic", {
            divisions: divs,
        });
    };
}

function set_pfxo_visibility(index) {
    return (o, v) => {
        o.setVisibility("Pre-FX Overlays", `Overlay ${index}`, v == 1);
    };
}

function set_bg_img(path) {
    return (o, v) => {
        set_cam("Background", 5)(o);
        o.setInputSettings("Camera 5", {
            file: `/Users/counter/exhibitron/assets/backgrounds/${path}.jpg`,
        });
    };
}

function set_hue(o, v) {
    o.setFilterSettings("BLEND", "Color Correction", {
        hue_shift: map(v, -180, 180),
    });
}

function set_gamma(o, v) {
    o.setFilterSettings("BLEND", "Color Correction", {
        gamma: map(v, -3, 3),
    });
}

function set_bloom(o, v) {
    o.setFilterSettings("BLEND", "Bloom", {
        ampFactor: map(v, 0, 10),
    });
}

function set_rgb(o, v, b) {
    var r = map(b.get("L1"), 0, 255);
    var g = map(b.get("L2"), 0, 255);
    var b = map(b.get("L3"), 0, 255);

    o.setFilterSettings("BLEND", "Color Correction", {
        color_multiply: rgba_to_decimal(r, g, b),
    });
}

function set_contrast(o, v) {
    o.setFilterSettings("BLEND", "Color Correction", {
        contrast: map(v, -4, 4),
    });
}

function set_global_sat(o, v) {
    o.setFilterSettings("BLEND", "Color Correction", {
        saturation: map(v, -1, 5),
    });
}

function set_red_sat(o, v) {
    o.setFilterSettings("BLEND", "Hue Saturation", {
        saturation_r: map(v, -1, 1),
        saturation_m: map(v, -1, 1),
    });
}

function set_green_sat(o, v, b) {
    o.setFilterSettings("BLEND", "Hue Saturation", {
        saturation_g: map(v, -1, 1),
        saturation_y: map(v, -1, 1),
    });
}

function set_blue_sat(o, v) {
    o.setFilterSettings("BLEND", "Hue Saturation", {
        saturation_b: map(v, -1, 1),
        saturation_c: map(v, -1, 1),
    });
}

function set_fg_blend_opacity(o, v) {
    o.setFilterSettings("Foreground", "Opacity", {
        opacity: map(v, 1, 0),
    });
}

function set_fg_blend_circle(o, v) {
    o.setFilterSettings("Foreground", "Circle", {
        Radius: map(v, 110, 20),
    });
}

function set_fg_blend_crt(o, v) {
    o.setFilterSettings("Foreground", "CRT", {
        strength: map(v, 0, 400),
        feathering: map(v, 0, 200),
    });
}

function set_pfxo_blend_opacity(o, v) {
    o.setFilterSettings("Pre-FX Overlays", "Color Correction", {
        opacity: map(v, 1, 0),
    });
}

function set_twist(o, v) {
    o.setFilterSettings("BLEND", "Twist", {
        rotation: map(v, 0, 5),
    });
}

function set_fracture(o, v) {
    o.setFilterSettings("Foreground", "Fracture", {
        blur: map(v, 0, 500),
    });
}

function set_blur(o, v) {
    o.setFilterSettings("BLEND", "Blur", {
        Strength: map(v, 0, 9),
    });
}

function set_bg_blur(o, v) {
    o.setFilterSettings("Background", "Blur", {
        Strength: map(v, 0, 15),
    });
}

function set_bg_gamma(o, v) {
    o.setFilterSettings("Background", "Color Correction", {
        gamma: map(v, -3, 3),
    });
}

function set_bg_hue(o, v) {
    o.setFilterSettings("Background", "Color Correction", {
        hue_shift: map(v, -180, 180),
    });
}

function set_fg_gamma(o, v) {
    o.setFilterSettings("Foreground", "Color Correction", {
        gamma: map(v, -3, 3),
    });
}

function set_fg_hue(o, v) {
    o.setFilterSettings("Foreground", "Color Correction", {
        hue_shift: map(v, -180, 180),
    });
}

function set_fg_bloom(o, v) {
    o.setFilterSettings("Foreground", "Bloom", {
        ampFactor: map(v, 0, 10),
    });
}

function set_invert(o, v) {
    o.setFilterSettings("BLEND", "Invert", {
        clut_amount: map(v, 0, 1),
    });
}

function set_fg_zoom(o, v, b) {
    var g = map(b.get("P21"), 0.1, 4);
    var x = map(b.get("F4"), 0, 3);
    var y = map(b.get("F5"), 0, 3);

    o.setItemTransform("BLEND", "Foreground", {
        scaleX: g + x,
        scaleY: g + y,
    });
}

function set_bulge(o, v) {
    o.setFilterSettings("BLEND", "Bulge", {
        magnitude: map(v, 0, 0.9),
    });
}

function set_bg_pixelate(o, v) {
    var Target_Width = 1920;
    var Target_Height = 1080;

    if (map(v, 0, 100) > 5) {
        Target_Width = Math.pow(100, (map(v, 100, 1) - 1) / 99);
        Target_Height = Target_Width;
    }

    o.setFilterSettings("Background", "Pixelate", {
        Target_Height,
        Target_Width,
    });
}

function set_fg_pixelate(o, v) {
    var Target_Width = 1920;
    var Target_Height = 1080;

    if (map(v, 0, 100) > 5) {
        Target_Width = Math.pow(100, (map(v, 100, 1) - 1) / 99);
        Target_Height = Target_Width;
    }

    o.setFilterSettings("Foreground", "Pixelate", {
        Target_Height,
        Target_Width,
    });
}

function set_fg_heat_wave(o, v) {
    o.setFilterSettings("Foreground", "Heat Wave", {
        Strength: map(v, 0, 25),
    });
}

function set_frosted_glass(o, v) {
    o.setFilterSettings("BLEND", "Frosted Glass", {
        Amount: map(v, 0, 0.03),
    });
}

function set_bg_solid_color(o, v) {
    set_cam("Background", 6)(o);
    o.setFilterSettings("Camera 6", "Fill Color", {
        Fill_Color: rgba_to_decimal(...hsl_to_rgb(map(v, 0, 360), 1, 0.5)),
    });
}

function set_ascii(o, v) {
    o.setFilterEnabled("BLEND", "ASCII", v == 1);
}

function set_cartoon(o, v) {
    o.setFilterEnabled("BLEND", "Cartoon", v == 1);
}

function set_rain(o, v) {
    o.setFilterEnabled("BLEND", "Rain", v == 1);
}

function set_matrix(o, v) {
    o.setFilterEnabled("BLEND", "Matrix", v == 1);
}

function set_fire(o, v) {
    o.setFilterEnabled("BLEND", "Fire", v == 1);
}

function set_matrix2(o, v) {
    o.setFilterEnabled("BLEND", "Matrix 2", v == 1);
}

function set_vhs(o, v) {
    o.setFilterEnabled("BLEND", "VHS", v == 1);
}

function print() {}

export const actions = {
    P1: set_hue,
    P2: set_bg_gamma,
    P3: set_bg_hue,
    P4: set_fg_gamma,
    P5: set_fg_hue,
    P6: set_fg_bloom,
    P7: set_bloom,
    P8: set_gamma,
    P9: set_global_sat,
    P10: set_red_sat,
    P11: set_green_sat,
    P12: set_blue_sat,
    P13: TODO, // DIGITAL
    P14: TODO, // DIGITAL
    P15: TODO, // DIGITAL
    P16: set_invert,
    P17: set_fracture,
    P18: set_fg_heat_wave,
    P19: TODO,
    P20: TODO,
    P21: set_fg_zoom,
    P22: set_fg_blend_opacity,
    P23: TODO,
    P24: set_bg_blur,
    P25: set_bg_pixelate,
    P26: TODO,
    P27: on_press(set_overlay(1)), // DIGITAL
    P28: on_press(set_overlay(2)), // DIGITAL
    P29: on_press(set_overlay(3)), // DIGITAL
    P30: on_press(set_overlay(4)), // DIGITAL
    P31: set_twist,
    P32: set_bg_solid_color,

    // L1: set_rgb,
    // L2: set_rgb,
    // L3: set_rgb,
    // L4: set_twist,
    // L5: set_bulge,
    // L6: TODO,

    F1: set_contrast,
    F2: set_bulge,
    // F3: set_pfxo_blend_opacity,
    F4: set_fg_zoom,
    F5: set_fg_zoom,
    // F6: set_bg_solid_color,
    // F7: set_fg_blend_opacity,
    // F8: set_fg_blend_circle,
    // F9: set_fg_blend_crt,
    // F10: TODO,
    // F11: TODO,
    F12: set_fg_blend_circle,
    F13: set_fg_blend_crt,
    F14: set_fg_pixelate,
    F15: set_frosted_glass,

    B1: on_press(set_cam("Foreground", 1)),
    B2: on_press(set_cam("Foreground", 2)),
    B3: on_press(set_cam("Foreground", 3)),
    B4: on_press(set_cam("Foreground", 4)),
    B5: TODO,
    B6: TODO,
    B7: TODO,
    B8: TODO,
    B9: TODO,
    B10: TODO,
    B11: set_matrix2,
    B12: set_rain,
    B13: set_vhs,
    B14: set_matrix,
    B15: set_fire,
    B16: TODO,
    B17: TODO,
    B18: TODO,
    B19: set_fg_mask("blank"),
    B20: set_fg_mask("star"),
    B21: set_fg_mask("heart"),
    B22: set_fg_mask("pacman_3"),
    B23: TODO,
    B24: on_press(set_random_bg),
    B25: on_press(set_bg_img("Subway Car")),
    B26: on_press(set_bg_img("Sunset Beach")),
    B27: on_press(set_bg_img("Theatre")),
    B28: on_press(change_fg_rotation(10)),
    B29: on_press(change_fg_rotation(1)),
    B30: on_press(reset_fg_translation),
    B31: on_press(change_fg_rotation(-1)),
    B32: on_press(change_fg_rotation(-10)),
    B33: on_press(print),
    B34: on_press(set_cam("Background", 1)),
    B35: on_press(set_cam("Background", 2)),
    B36: on_press(set_cam("Background", 3)),
    B37: on_press(set_cam("Background", 4)),
    B38: TODO,
    B39: TODO,
    B40: TODO,
    B41: TODO,
    B42: TODO,
    B43: TODO,
    B44: TODO,
    B45: TODO,
    B46: on_press(set_overlay(5)),
    B47: on_press(set_overlay(6)),
    B48: on_press(set_overlay(7)),
    B49: TODO,
    B50: TODO,
    B51: TODO,
    B52: toggle(set_ascii),
    B53: toggle(set_cartoon),
    B54: set_mosaic(1),
    B55: set_mosaic(2),
    B56: set_mosaic(3),
    B57: set_mosaic(4),
    B58: set_mosaic(5),
    B59: set_mosaic(6),
    B60: set_mosaic(7),
    B61: set_mosaic(8),

    S1: set_pfxo_visibility(1),
    S2: set_pfxo_visibility(2),
    S3: set_pfxo_visibility(3),
    S4: set_pfxo_visibility(4),
    S5: set_pfxo_visibility(5),
    S6: set_pfxo_visibility(6),
    S7: set_pfxo_visibility(7),
    S8: set_pfxo_visibility(8),
    S9: TODO,
    S10: TODO,
    S11: TODO,
    S12: TODO,
    S13: TODO,
    // S14: TODO,
    // S15: TODO,
    // S16: TODO,
    // S17: TODO,

    J1: on_hold(change_fg_posn(-15, 0)),
    J2: on_hold(change_fg_posn(0, -15)),
    J3: on_hold(change_fg_posn(15, 0)),
    J4: on_hold(change_fg_posn(0, 15)),
};
