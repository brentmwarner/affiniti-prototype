import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Members } from "./pages/Members";
import { Renewals } from "./pages/Renewals";
import { Billing } from "./pages/Billing";
import { Marketing } from "./pages/Marketing";
import { ToastProvider } from "./components/ui/toast";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/renewals" element={<Renewals />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/marketing" element={<Marketing />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>,
);