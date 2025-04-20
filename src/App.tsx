import React, { useState, useRef, useEffect } from "react";
import Curtain from "./components/Curtain";
import Webcam from "react-webcam";

function App() {
  const [showCurtain, setShowCurtain] = useState(true);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [isFreezing, setIsFreezing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Check camera permissions when component mounts
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Always request camera access, even if previously granted
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream after checking
        setHasPermission(true);
      } catch (err) {
        console.error("Camera permission denied:", err);
        setHasPermission(false);
        setWebcamError("Camera access denied. Please allow camera access to use this feature.");
      }
    };

    checkPermissions();
  }, []);

  const handleButtonClick = () => {
    if (isFreezing) return; // Prevent multiple clicks while processing
    
    setIsFreezing(true);
    setButtonPressed(true);
    
    if (showCurtain) {
      setShowCurtain(false);
    }
    
    // Take the photo after a very short delay to ensure curtain state is updated
    setTimeout(() => {
      if (!webcamRef.current) return;
      
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPhoto(imageSrc);
      } else {
        setWebcamError("Failed to capture photo. Please try again.");
      }
      
      // Reset button state after a short delay
      setTimeout(() => {
        setButtonPressed(false);
        setIsFreezing(false);
      }, 150);
    }, 50);
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <Curtain 
        onFinish={() => {}} 
        onClose={() => {}} 
        isOpen={showCurtain}
      />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative w-80 h-80 bg-black rounded-lg overflow-hidden flex items-center justify-center shadow-lg">
          {webcamError ? (
            <span className="text-white text-center px-4">
              Unable to access webcam.<br />{webcamError}
            </span>
          ) : photo ? (
            <img src={photo} alt="Captured" className="object-cover w-full h-full" />
          ) : (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              width={320}
              height={320}
              videoConstraints={{
                width: 320,
                height: 320,
                facingMode: "user"
              }}
              className={`object-cover w-full h-full ${isFreezing ? 'opacity-50' : ''}`}
              onUserMediaError={(err) => {
                console.error("Webcam error:", err);
                setWebcamError("Webcam access denied or unavailable. Please check your camera permissions.");
              }}
              onUserMedia={() => {
                console.log("Webcam initialized successfully");
                setWebcamError(null);
              }}
            />
          )}
        </div>
        <div className="mt-2">
          {!webcamError && hasPermission && (
            <button
              className={`px-6 py-2 bg-blue-600 text-white rounded shadow transition-all duration-150
                hover:bg-blue-700 active:bg-blue-800 
                ${buttonPressed ? 'scale-95 bg-blue-800 opacity-75' : ''}`}
              onClick={handleButtonClick}
              disabled={isFreezing}
            >
              Take Picture
            </button>
          )}
          {!hasPermission && !webcamError && (
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Allow Camera Access
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
