import { useState, useRef, useEffect } from "react";

const SCROLL_SPEED = 2;
const DRAG_SPEED = 1;

export default function Knob({ size = 15, x = 0, y = 0, uid, onChange }) {
    const [angle, setAngle] = useState(0);
    const ref = useRef(null);
    const dragging = useRef(false);
    const lastY = useRef(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleWheel = (e) => {
            e.preventDefault();
            setAngle((prev) => {
                const next = Math.min(
                    360,
                    Math.max(
                        0,
                        prev + (e.deltaY > 0 ? SCROLL_SPEED : -SCROLL_SPEED),
                    ),
                );
                onChange(uid, Math.round((next / 360) * 100));
                return next;
            });
        };

        const handleMouseDown = (e) => {
            dragging.current = true;
            lastY.current = e.clientY;
        };

        const handleMouseMove = (e) => {
            if (!dragging.current) return;
            const delta = lastY.current - e.clientY;
            lastY.current = e.clientY;
            setAngle((prev) => {
                const next = Math.min(
                    360,
                    Math.max(0, prev + delta * DRAG_SPEED),
                );
                onChange(uid, Math.round((next / 360) * 100));
                return next;
            });
        };

        const handleMouseUp = () => {
            dragging.current = false;
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        el.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            el.removeEventListener("wheel", handleWheel);
            el.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [onChange]);

    return (
        <button
            ref={ref}
            className="absolute rounded-full bg-green-400"
            style={{
                top: y,
                left: x,
                width: size,
                height: size,
                transform: `rotate(${angle}deg)`,
            }}
        >
            <div
                className="absolute bg-black"
                style={{
                    top: 1,
                    left: "50%",
                    width: 1,
                    height: size / 2 - 1,
                    transform: "translateX(-50%)",
                }}
            />
        </button>
    );
}
