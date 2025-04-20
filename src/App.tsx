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
  const [countdown, setCountdown] = useState<number | null>(null);

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
    
    // Start countdown from 3
    setCountdown(3);
    
    // Countdown sequence
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Add delay before closing curtain
    setTimeout(() => {
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
    }, 3000); // 3 second delay before curtain closes
  };

  return (
    <div className="relative min-h-screen bg-amber-50">
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
              width={640}
              height={480}
              videoConstraints={{
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user"
              }}
              className={`object-cover w-full h-full ${isFreezing && countdown === null ? 'opacity-50' : ''}`}
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
        <div className="fixed bottom-16">
          {!webcamError && hasPermission && (
            <button
              className={`w-24 h-24 rounded-full bg-emerald-400 text-white shadow transition-all duration-150
                hover:bg-emerald-500 active:bg-emerald-600 text-2xl font-bold flex items-center justify-center
                ${buttonPressed ? 'scale-95 bg-emerald-600 opacity-75' : ''}`}
              onClick={handleButtonClick}
              disabled={isFreezing}
            >
              {countdown !== null ? countdown : 'START'}
            </button>
          )}
          {!hasPermission && !webcamError && (
            <button
              className="w-24 h-24 rounded-full bg-emerald-400 text-white shadow hover:bg-emerald-500 text-2xl font-bold flex items-center justify-center"
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
