import { useState, useRef } from "react";

export const useResizeableSidebar = (initialWidth = 300, minWidth = 150) => {
    const [width, setWidth] = useState(initialWidth);
    const isDragging = useRef(false);

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging.current) {
            setWidth(prev => Math.max(prev + e.movementX, minWidth));
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

    const startDragging = () => {
        isDragging.current = true;
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    return { width, startDragging };
};