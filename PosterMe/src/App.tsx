import React from "react";
import CustomWebcam from "./CustomWeb"; // Adjust the path if necessary
import "./index.tsx"; // Import global styles (including Tailwind CSS)

const App: React.FC = () => {
  return (
    <div className="App">
      test
      <CustomWebcam />
    </div>
  );
};

export default App;