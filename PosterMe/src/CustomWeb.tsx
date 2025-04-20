import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import "./Background.css";

function CustomWebcam() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isClapping, setIsClapping] = useState(false);
  const [isOpening, setIsOpening] = useState(true); // Curtain opening state

  const captureScreenshot = () => {
    setIsClapping(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const webcamWidth = 600;
    const webcamHeight = 500;

    let angle = 0;
    let direction = 1;
    let animationFrameId: number;

    const drawClapperboard = (angle: number) => {
      ctx.clearRect(0, 0, webcamWidth, webcamHeight);

      // Bottom base (matching webcam size)
      ctx.fillStyle = "#2c2c2c";
      ctx.fillRect(0, webcamHeight / 2, webcamWidth, webcamHeight / 3);

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 5;
      ctx.strokeRect(0, webcamHeight / 2, webcamWidth, webcamHeight / 3);

      // Top clapper bar (matching webcam size)
      ctx.save();
      ctx.translate(0, webcamHeight / 2);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.fillStyle = "#555";
      ctx.fillRect(0, -webcamHeight / 3, webcamWidth, webcamHeight / 3);

      const stripeWidth = 80;
      for (let i = 0; i < webcamWidth / stripeWidth; i++) {
        ctx.fillStyle = i % 2 === 0 ? "#fff" : "#000";
        ctx.fillRect(i * stripeWidth, -webcamHeight / 3, stripeWidth, webcamHeight / 3);
      }

      ctx.restore();
    };

    const animateClap = () => {
      drawClapperboard(angle);
      angle += direction * 2; // Slower speed

      if (angle >= 45) direction = -1;

      if (angle <= 0 && direction === -1) {
        cancelAnimationFrame(animationFrameId);
        setIsClapping(false);

        // Capture screenshot after clap finishes
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          setScreenshot(imageSrc);
        }

        return;
      }

      animationFrameId = requestAnimationFrame(animateClap);
    };

    if (isClapping) {
      angle = 0;
      direction = 1;
      animateClap();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isClapping]);

  useEffect(() => {
    // Curtain open/close effect triggered on mount
    const timeout = setTimeout(() => {
      setIsOpening(false); // After opening, close the curtains
    }, 3000); // Curtain stays open for 3 seconds
    return () => clearTimeout(timeout);
  }, []);

  const webcamHeight = 500;

  return (
    <div className="webcam-container widescreen-container">
      {/* Curtain animation elements */}
      <div className={`curtain left ${isOpening ? "open" : ""}`}></div>
      <div className={`curtain right ${isOpening ? "open" : ""}`}></div>

      <header className="header">
        <h1>PosterMe</h1>
      </header>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Webcam feed centered within the screen */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Webcam
            audio={false}
            height={500} // Webcam height
            width={600} // Webcam width
            ref={webcamRef}
            screenshotFormat="image/png"
            className="rounded-lg shadow-xl border-4 border-white"
            videoConstraints={{
              width: 600,
              height: 500,
              facingMode: "user",
            }} />
        </div>

        {/* Fullscreen Canvas Overlay (only when clapping) */}
        {isClapping && (
          <canvas
            ref={canvasRef}
            width={600} // Webcam width
            height={webcamHeight}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 10,
              pointerEvents: "none",
              borderRadius: "12px",
            }} />
        )}
      </div>

      <button
        onClick={captureScreenshot}
        disabled={isClapping}
        className={`mt-4 px-6 py-2 ${isClapping ? "bg-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-200"} text-red-700 font-semibold rounded-lg transition`}
      >
        {isClapping ? "Clapping..." : "Capture Photo"}
      </button>

      {screenshot && (
        <div className="mt-6 flex flex-col items-center">
          <p className="text-white text-sm mb-2">Captured Photo:</p>
          <img
            src={screenshot}
            alt="Screenshot"
            className="rounded-lg shadow-md border-2 border-white"
            style={{ maxWidth: "100%", maxHeight: "500px", objectFit: "cover" }} />
          <button
            onClick={() => setScreenshot(null)}
            className="mt-2 px-3 py-1 text-sm bg-white text-red-700 rounded hover:bg-gray-100"
          >
            Retake Photo
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomWebcam;
