import Pride from "react-canvas-confetti/dist/presets/pride";
import { useRef, useEffect } from "react";

export default function Confetti() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Once the canvas is injected, find it and override its style
    const canvas = wrapperRef.current?.querySelector("canvas");
    if (canvas) {
      canvas.style.position = "absolute";
      canvas.style.inset = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "absolute",
        pointerEvents: "none",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      <Pride
        autorun={{ speed: 10 }}
        decorateOptions={(options) => ({
          ...options,
          origin: {
            x: Math.random(),
            y: 0,
          },
          angle: 270,
          gravity: 1,
          startVelocity: 5,
          colors: ["#3d80ba", "#FFD700", "#FFFFFF"],
        })}
      />
    </div>
  );
}
