import { clsx } from "clsx";
import { useEffect } from "react";

export default function Fader({
    angle = 0,
    x = 0,
    y = 0,
    width = 100,
    style = "fader",
    defaultValue = 0,
    uid,
    onChange,
}) {
    useEffect(() => {
        onChange(uid, defaultValue);
    }, []);

    return (
        <input
            type="range"
            min="0"
            max="100"
            defaultValue={defaultValue}
            className={clsx(
                "absolute origin-top-left",
                style == "fader" && "accent-amber-500",
                style == "lever" && "accent-purple-400",
            )}
            style={{
                left: x,
                top: y,
                width: width,
                transform: `rotate(${angle}deg)`,
            }}
            onChange={(e) => {
                onChange(uid, parseFloat(e.target.value));
            }}
        />
    );
}
