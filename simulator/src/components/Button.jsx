import { clsx } from "clsx";
import { useState } from "react";

export default function Button({
    style = "round",
    size = 15,
    x = 0,
    y = 0,
    angle = 0,
    uid,
    onChange,
}) {
    const [pressed, setPressed] = useState(false);

    return (
        <button
            onMouseDown={() => {
                setPressed(true);
                onChange(uid, 1);
            }}
            onMouseUp={() => {
                setPressed(false);
                onChange(uid, 0);
            }}
            className={clsx(
                "absolute",
                pressed && "bg-blue-700",
                !pressed && "bg-blue-400",
                style == "round" && "rounded-full",
            )}
            style={{
                top: y,
                left: x,
                width: size,
                height: size,
                transform: `rotate(${angle}deg)`,
            }}
        ></button>
    );
}
