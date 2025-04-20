import { useState, useEffect } from "react";

const CURTAIN_SLIVER = 0; // Set to 0 to fully cover the screen

const Curtain = ({ onFinish }: { onFinish?: () => void }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Trigger curtain opening on mount
    setOpen(true);

    const timeout = setTimeout(() => {
      onFinish?.(); // Notify when open animation is done
    }, 1600); // Match transition duration

    return () => clearTimeout(timeout);
  }, [onFinish]);

  const panelStyle = (side: "left" | "right"): React.CSSProperties => ({
    width: "50vw",
    height: "100vh", // Full height of the viewport
    position: "absolute",
    top: 0,
    transition: "transform 1.5s ease-in-out",
    background:
      "repeating-linear-gradient(90deg, #b91c1c 0px, #b91c1c 20px, #991b1b 30px, #b91c1c 40px)",
    boxShadow:
      side === "left"
        ? "4px 0 16px rgba(0,0,0,0.3) inset"
        : "-4px 0 16px rgba(0,0,0,0.3) inset",
    transform: open
      ? side === "left"
        ? `translateX(calc(-50vw + ${CURTAIN_SLIVER}px))`
        : `translateX(calc(50vw - ${CURTAIN_SLIVER}px))`
      : "translateX(0)",
    left: side === "left" ? "0" : "50vw",
    zIndex: 9999, // Ensure it stays on top
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div style={panelStyle("left")} />
      <div style={panelStyle("right")} />
    </div>
  );
};

export default Curtain;