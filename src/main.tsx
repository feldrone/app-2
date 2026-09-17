import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Lexend 700 (latin) — the approved wordmark typeface. Self-hosted through the
// bundler, so the lockup never depends on a font CDN being reachable.
import "@fontsource/lexend/latin-700.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
