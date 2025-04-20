import React, { useState, useRef, useEffect } from "react";
import Curtain from "./components/Curtain";
import ClapperBoard from "./components/ClapperBoard";
import Webcam from "react-webcam";
import { imageStorageService } from "./services/imageStorage";

function App() {
  const [showCurtain, setShowCurtain] = useState(true);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [isFreezing, setIsFreezing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showClapper, setShowClapper] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showWebcam, setShowWebcam] = useState(true);
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);

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

  const handleButtonClick = async () => {
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
    setTimeout(async () => {
      if (showCurtain) {
        setShowCurtain(false);
      }
      
      // Take the photo immediately after curtain closes
      setTimeout(async () => {
        if (!webcamRef.current) return;
        
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          setPhoto(imageSrc);
          // Store the image using the imageStorageService
          const result = await imageStorageService.storeImage(imageSrc);
          if (!result.success) {
            console.error('Failed to store image:', result.error);
          }
          // Show clapper board after photo is taken
          setShowClapper(true);
          // Hide clapper board and close curtain after a delay
          setTimeout(() => {
            setShowClapper(false);
            setShowCurtain(true);
            setShowTitle(false); // Hide title after first photo
            setShowWebcam(false); // Hide webcam after second curtain opens
          }, 2000); // Show clapper board for 2 seconds
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

  const handlePrevPoster = () => {
    setCurrentPosterIndex(prevIndex => {
      if (prevIndex === 0) {
        return 4; // Wrap around to the last poster
      } else {
        return prevIndex - 1;
      }
    });
  };

  const handleNextPoster = () => {
    setCurrentPosterIndex(prevIndex => {
      if (prevIndex === 4) {
        return 0; // Wrap around to the first poster
      } else {
        return prevIndex + 1;
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-amber-50">
      <Curtain 
        onFinish={() => {}} 
        onClose={() => {}} 
        isOpen={showCurtain}
        showTitle={showTitle}
      />
      <ClapperBoard isVisible={showClapper} />
      {showWebcam ? (
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
      ) : photo && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="relative w-full max-w-4xl">
            {/* Navigation Arrows */}
            <button
              onClick={handlePrevPoster}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors z-10"
            >
              ←
            </button>
            <button
              onClick={handleNextPoster}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors z-10"
            >
              →
            </button>

            {/* Poster Carousel */}
            <div className="flex justify-center items-center gap-4">
              {[...Array(5)].map((_, index) => {
                // Calculate the position relative to the current poster
                let position = index - currentPosterIndex;
                // Normalize position to be between -2 and 2
                if (position > 2) position -= 5;
                if (position < -2) position += 5;

                let scale = 1;
                let opacity = 1;
                let zIndex = 0;

                if (position === 0) {
                  scale = 1.1;
                  zIndex = 2;
                } else if (position === 1 || position === -1) {
                  scale = 0.9;
                  opacity = 0.7;
                  zIndex = 1;
                } else {
                  scale = 0.8;
                  opacity = 0.5;
                }

                return (
                  <div
                    key={index}
                    className={`absolute transition-all duration-300 ease-in-out`}
                    style={{
                      transform: `translateX(${position * 100}%) scale(${scale})`,
                      opacity: opacity,
                      zIndex: zIndex,
                      width: '20%',
                    }}
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">Poster {index + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
