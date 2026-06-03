import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import { OfflineBanner } from "./components/OfflineBanner/OfflineBanner.tsx";
import { Toaster } from "sonner";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ScrollToTop />
      <App />

      <Toaster position="top-center" />
      <OfflineBanner />
    </HashRouter>
  </StrictMode>,
);