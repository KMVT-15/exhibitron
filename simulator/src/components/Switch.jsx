import { clsx } from "clsx";
import { useState } from "react";

export default function Switch({
    size = 25,
    x = 0,
    y = 0,
    angle = 0,
    onChange,
    uid,
}) {
    const [active, setActive] = useState(false);

    return (
        <button
            onClick={() => {
                setActive(!active);
                onChange(uid, active ? 0 : 1);
            }}
            className={clsx(
                "absolute",
                active && "bg-red-700",
                !active && "bg-red-400",
            )}
            style={{
                top: y,
                left: x,
                width: size,
                height: size * 1.5,
                transform: `rotate(${angle}deg)`,
            }}
        ></button>
    );
}
