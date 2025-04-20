import React, { useState, useEffect } from "react";

interface CurtainProps {
  onFinish: () => void;
  onClose: () => void;
  isOpen: boolean;
  onAnimationStart?: () => void;
}

const Curtain: React.FC<CurtainProps> = ({ onFinish, onClose, isOpen, onAnimationStart }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Open curtain after a delay
      const openTimer = setTimeout(() => {
        setOpen(true);
        onAnimationStart?.();
        onFinish();
      }, 800);
      
      return () => clearTimeout(openTimer);
    } else {
      // Close curtain immediately
      setOpen(false);
      onClose();
    }
  }, [isOpen, onFinish, onClose, onAnimationStart]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Falling Title */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 text-white text-6xl font-bold"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translate(-50%, 20vh)' : 'translate(-50%, -100%)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          zIndex: 51
        }}
      >
        POSTERME
      </div>
      
      {/* Both panels start at center and slide outward to edges */}
      <>
        {/* Left panel */}
        <div
          className="absolute top-0 left-1/2 h-full"
          style={{
            width: `50vw`,
            marginLeft: -0.5 * window.innerWidth,
            transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            background: "repeating-linear-gradient(90deg, #b91c1c 0px, #b91c1c 20px, #991b1b 30px, #b91c1c 40px)",
            boxShadow: "4px 0 16px rgba(0,0,0,0.2) inset",
            transform: open ? `translateX(calc(-50vw))` : "translateX(0)"
          }}
        />
        {/* Right panel */}
        <div
          className="absolute top-0 left-1/2 h-full"
          style={{
            width: `50vw`,
            transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            background: "repeating-linear-gradient(90deg, #b91c1c 0px, #b91c1c 20px, #991b1b 30px, #b91c1c 40px)",
            boxShadow: "-4px 0 16px rgba(0,0,0,0.2) inset",
            transform: open ? `translateX(calc(50vw))` : "translateX(0)"
          }}
        />
      </>
    </div>
  );
};

export default Curtain;
