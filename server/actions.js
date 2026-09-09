import { map, rgba_to_decimal } from "./util.js";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();

console.log(process.env.ASSET_PATH);

function vmap(v, min, max) {
    return map(v, 0, 1, min, max);
}

export function set_rgb(obs, r, g, b) {
    obs.setFilterSettings("Mix", "Color Multiply", {
        color_multiply: rgba_to_decimal(r, g, b),
    });
}

export function set_sharpness(obs, value) {
    obs.setFilterSettings("Mix", "Sharpen", {
        sharpness: vmap(value, 0, 10),
    });
}

export function set_pre_saturation(obs, value) {
    obs.setFilterSettings("Mix", "Pre Saturate", {
        saturation: vmap(value, 0, 10),
    });
}

export function set_camera(obs, value) {
    for (var i = 1; i <= 4; i++) {
        obs.setVisibility("Cameras", `Camera ${i}`, i == value);
    }
}

export function set_background(obs, value) {
    for (var i = 1; i <= 2; i++) {
        obs.setVisibility("Background", `Background ${i}`, i == value);
    }
}

export function set_twist(obs, value) {
    obs.setFilterSettings("Mix", "Twist", {
        rotation: vmap(value, 5, -5),
    });
}

export function set_position(obs, posn) {
    obs.setItemTransform("Mix", "Cameras", {
        positionX: posn.x,
        positionY: posn.y,
        alignment: 0,
    });
}

export function set_rotation(obs, value) {
    obs.setItemTransform("Mix", "Cameras", {
        rotation: vmap(value, -180, 180),
        alignment: 0,
    });
}

export function set_scale_x(obs, value) {
    obs.setItemTransform("Mix", "Cameras", {
        scaleX: vmap(value, 0, 1) * 2,
    });
}

export function set_scale_y(obs, value) {
    obs.setItemTransform("Mix", "Cameras", {
        scaleY: vmap(value, 0, 1) * 2,
    });
}

export function set_mask(obs, value) {
    obs.setFilterSettings("Cameras", "Image Mask", {
        image_path: `${process.env.ASSET_PATH}/assets/masks/${value}.png`,
    });
}

export function set_hue(obs, value) {
    obs.setFilterSettings("Mix", "Color Correction", {
        hue_shift: vmap(value, -180, 180),
    });
}

export function set_contrast(obs, value) {
    obs.setFilterSettings("Mix", "Color Correction", {
        contrast: vmap(value, -4, 4),
    });
}

export function set_crt_strength(obs, value) {
    obs.setFilterSettings("Cameras", "CRT", {
        strength: vmap(value, 0, 400),
    });
}

export function set_crt_feathering(obs, value) {
    obs.setFilterSettings("Cameras", "CRT", {
        feathering: vmap(value, 0, 200),
    });
}

export function set_gamma(obs, value) {
    obs.setFilterSettings("Mix", "Color Correction", {
        gamma: vmap(value, -2, 2),
    });
}

export function set_global_sat(obs, value) {
    obs.setFilterSettings("Mix", "Color Correction", {
        saturation: vmap(value, -1, 5),
    });
}

export function set_red_sat(obs, value) {
    obs.setFilterSettings("Mix", "Hue Saturation", {
        saturation_r: vmap(value, -1, 1),
        saturation_m: vmap(value, -1, 1),
    });
}

export function set_green_sat(obs, value) {
    obs.setFilterSettings("Mix", "Hue Saturation", {
        saturation_g: vmap(value, -1, 1),
        saturation_y: vmap(value, -1, 1),
    });
}

export function set_blue_sat(obs, value) {
    obs.setFilterSettings("Mix", "Hue Saturation", {
        saturation_b: vmap(value, -1, 1),
        saturation_c: vmap(value, -1, 1),
    });
}

export function set_bloom(obs, value) {
    obs.setFilterSettings("Mix", "Bloom", {
        ampFactor: vmap(value, 0, 10),
    });
}

export function set_invert(obs, value) {
    obs.setFilterSettings("Mix", "Invert", {
        clut_amount: vmap(value, 0, 1),
    });
}

export function set_bulge(obs, value) {
    obs.setFilterSettings("Mix", "Bulge", {
        magnitude: vmap(value, 0, 0.9),
    });
}

export function set_mosaic(obs, value) {
    obs.setFilterSettings("Cameras", "Mosaic", {
        divisions: value,
    });
}

export function set_pixelate(obs, value) {
    value = vmap(value, 0, 0.5);

    var Target_Width = 1920;
    var Target_Height = 1080;

    if (value > 0.05) {
        Target_Width = Math.pow(100, (vmap(value, 100, 1) - 1) / 99);
        Target_Height = Target_Width;
    }

    obs.setFilterSettings("Mix", "Pixelate", {
        Target_Height,
        Target_Width,
    });
}

export function set_heat_wave(obs, value) {
    obs.setFilterSettings("Cameras", "Heat Wave", {
        Strength: vmap(value, 0, 25),
    });
}

export function set_ripple(obs, value) {
    obs.setFilterEnabled("Mix", "Ripple", value);
}

export function set_big_glitch(obs, value) {
    obs.setFilterEnabled("Viewport", "Glitch", value);
}

export function set_frosted_glass(obs, value) {
    obs.setFilterSettings("Mix", "Frosted Glass", {
        Amount: vmap(value, 0, 0.03),
    });
}

export function set_bg_fill_color(obs, value) {
    var hue = vmap(value, 0, 360);
    set_background(obs, 6);
    obs.setFilterSettings("Camera 6", "Fill Color", {
        Fill_Color: rgba_to_decimal(...hsl_to_rgb(hue, 1, 0.5)),
    });
}

export function set_ascii_filter(obs, value) {
    obs.setFilterEnabled("Mix", "ASCII", value);
}

export function set_cartoon_filter(obs, value) {
    obs.setFilterEnabled("Mix", "Cartoon", value);
}

export function set_rain_filter(obs, value) {
    obs.setFilterEnabled("Mix", "Rain", value);
}

export function set_matrix_filter(obs, value) {
    obs.setFilterEnabled("Mix", "Matrix", value);
}

export function set_fire_filter(obs, value) {
    obs.setFilterEnabled("Mix", "Fire", value);
}

export function set_rotating_cube(obs, value) {
    obs.setFilterEnabled("Cameras", "Rotating Cube", value);
}

export function set_glitch(obs, value) {
    obs.setFilterEnabled("Mix", "Glitch", value);
}

export function set_thermal(obs, value) {
    obs.setFilterEnabled("Mix", "Thermal", value);
}

export function set_matrix2_filter(obs, value) {
    obs.setFilterEnabled("Mix", "Matrix 2", value);
}

export function set_vhs_filter(obs, value) {
    obs.setFilterEnabled("Mix", "VHS", value);
}

export function set_scopes_overlay(obs, value) {
    obs.setVisibility("Viewport", "Scopes", value);
}

export function set_pfxo_visibility(obs, index, value) {
    obs.setVisibility("Pre-FX Overlays", `Overlay ${index}`, value);
}

export function set_bg_img(obs, path) {
    obs.setInputSettings("Background 1", {
        file: `${process.env.ASSET_PATH}/assets/backgrounds/${path}.jpg`,
    });
}

export function set_viewport_bg(obs, color) {
    obs.setInputSettings("Viewport Background", {
        file: `${process.env.ASSET_PATH}/assets/viewport/viewport_${color}bg.png`,
    });
}

export function set_viewport_fg(obs, color) {
    obs.setInputSettings("Viewport Foreground", {
        file: `${process.env.ASSET_PATH}/assets/viewport/viewport_${color}tv.png`,
    });
}

// Funky ones
const bg_img_dir = "../assets/backgrounds";
const bg_img_list = fs.readdirSync(bg_img_dir).map((f) => path.parse(f).name);
var bg_img_spinner_running = false;

export function set_random_bg(obs) {
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
        set_bg_img(obs, img);

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

var viewport_color_list = ["orange", "green", "blue", "purple"];
var viewport_spinner_running = false;

export function set_random_viewport(obs) {
    if (viewport_spinner_running) return;
    viewport_spinner_running = true;

    const steps = 20;
    const final_bg =
        viewport_color_list[
            Math.floor(Math.random() * viewport_color_list.length)
        ];
    const final_fg =
        viewport_color_list[
            Math.floor(Math.random() * viewport_color_list.length)
        ];

    let i = 0;
    function tick() {
        const bg =
            i === steps - 1
                ? final_bg
                : viewport_color_list[
                      Math.floor(Math.random() * viewport_color_list.length)
                  ];

        const fg =
            i === steps - 1
                ? final_fg
                : viewport_color_list[
                      Math.floor(Math.random() * viewport_color_list.length)
                  ];

        set_viewport_bg(obs, bg);

        i++;
        if (i < steps) {
            const delay = 40 + Math.pow(i / steps, 3) * 400;
            setTimeout(tick, delay);
            setTimeout(() => {
                set_viewport_fg(obs, fg);
            }, delay / 2);
        } else {
            viewport_spinner_running = false;
        }
    }

    tick();
}
