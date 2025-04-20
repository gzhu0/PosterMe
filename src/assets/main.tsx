// filepath: /Users/armaniegonzalez/Downloads/Citrus/PosterMe/src/assets/main.tsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App"; // Ensure App is imported correctly

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);