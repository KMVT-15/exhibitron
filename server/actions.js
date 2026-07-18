function map_range(v, b0, b1, b2, b3) {
    return b2 + ((v - b0) * (b3 - b2)) / (b1 - b0);
}

function map_input(v, b0, b1) {
    return map_range(v, 0, 100, b0, b1);
}

function rgba_to_decimal(r, g, b, a = 255) {
    return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
}

function on_press(f) {
    return (o, v, b) => {
        if (v == 1) {
            return f(o, v, b);
        }
    };
}

function set_cam(scene, cam) {
    return (o, v, b) => {
        for (var i = 1; i <= 4; i++) {
            if (i == cam) {
                o.setVisibility(scene, `Camera ${i}`, true);
            } else {
                o.setVisibility(scene, `Camera ${i}`, false);
            }
        }
    };
}

var fg_rotation = 0;

function set_fg_rotation(obs, val) {
    fg_rotation = val;

    obs.setItemTransform("BLEND", "Foreground", {
        rotation: fg_rotation,
    });
}

function change_fg_rotation(delta) {
    return (o) => {
        set_fg_rotation(o, fg_rotation + delta);
    };
}

function set_fg_mask(path) {
    return (o) => {
        o.setFilterSettings("Foreground", "Image Mask", {
            image_path: `/Users/william/Desktop/K-15 Exhibitron/assets/masks/${path}.png`,
        });
    };
}

function set_hue(o, v) {
    o.setFilterSettings("BLEND", "Color Correction", {
        hue_shift: map_input(v, -180, 180),
    });
}

function set_gamma(o, v) {
    o.setFilterSettings("BLEND", "Color Correction", {
        gamma: map_input(v, -3, 3),
    });
}

function set_bloom(o, v) {
    o.setFilterSettings("BLEND", "Bloom", {
        ampFactor: map_input(v, 0, 10),
    });
}

function set_rgb(o, v, b) {
    var r = map_input(b.get("L1"), 0, 255);
    var g = map_input(b.get("L2"), 0, 255);
    var b = map_input(b.get("L3"), 0, 255);

    o.setFilterSettings("BLEND", "Color Correction", {
        color_multiply: rgba_to_decimal(r, g, b),
    });
}

function set_fg_posn(o, v, b) {
    var f1 = map_input(b.get("F1"), -500, 500);
    var f2 = map_input(b.get("F2"), -500, 500);

    var x = f1 + f2;
    var y = f2 - f1;

    o.setItemTransform("BLEND", "Foreground", {
        positionX: x,
        positionY: y,
    });
}

function set_fg_scale_x(o, v) {
    o.setItemTransform("BLEND", "Foreground", {
        scaleX: map_input(v, 0.5, 1.5),
    });
}

function set_fg_scale_y(o, v) {
    o.setItemTransform("BLEND", "Foreground", {
        scaleY: map_input(v, 0.5, 1.5),
    });
}

function set_global_sat(o, v) {
    o.setFilterSettings("BLEND", "Color Correction", {
        saturation: map_input(v, -1, 5),
    });
}

function set_red_sat(o, v) {
    o.setFilterSettings("BLEND", "Hue Saturation", {
        saturation_r: map_input(v, -1, 1),
        saturation_m: map_input(v, -1, 1),
    });
}

function set_green_sat(o, v, b) {
    o.setFilterSettings("BLEND", "Hue Saturation", {
        saturation_g: map_input(v, -1, 1),
        saturation_y: map_input(v, -1, 1),
    });
}

function set_blue_sat(o, v) {
    o.setFilterSettings("BLEND", "Hue Saturation", {
        saturation_b: map_input(v, -1, 1),
        saturation_c: map_input(v, -1, 1),
    });
}

function set_fg_blend_opacity(o, v) {
    o.setFilterSettings("Foreground", "Opacity", {
        opacity: map_input(v, 1, 0),
    });
}

function set_fg_blend_circle(o, v) {
    o.setFilterSettings("Foreground", "Circle", {
        Radius: map_input(v, 110, 0),
    });
}

function set_fg_blend_crt(o, v) {
    o.setFilterSettings("Foreground", "CRT", {
        strength: map_input(v, 0, 200),
        feathering: map_input(v, 0, 100),
    });
}

export const actions = {
    P1: set_hue,
    P7: set_bloom,
    P8: set_gamma,
    P9: set_global_sat,
    P10: set_red_sat,
    P11: set_green_sat,
    P12: set_blue_sat,
    L1: set_rgb,
    L2: set_rgb,
    L3: set_rgb,
    B1: on_press(set_cam("Foreground", 1)),
    B2: on_press(set_cam("Foreground", 2)),
    B3: on_press(set_cam("Foreground", 3)),
    B4: on_press(set_cam("Foreground", 4)),

    B34: on_press(set_cam("Background", 1)),
    B35: on_press(set_cam("Background", 2)),
    B36: on_press(set_cam("Background", 3)),
    B37: on_press(set_cam("Background", 4)),

    F1: set_fg_scale_x,
    F2: set_fg_scale_y,
    F7: set_fg_blend_opacity,
    F8: set_fg_blend_circle,
    F9: set_fg_blend_crt,

    B28: on_press(change_fg_rotation(10)),
    B29: on_press(change_fg_rotation(1)),
    B30: on_press((o) => set_fg_rotation(o, 0)),
    B31: on_press(change_fg_rotation(-1)),
    B32: on_press(change_fg_rotation(-10)),

    B19: set_fg_mask("blank"),
    B20: set_fg_mask("star"),
    B21: set_fg_mask("heart"),
    B22: set_fg_mask("pacman_3"),
};
