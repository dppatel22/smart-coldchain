/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Root layout component.
 *  • Wraps the entire app in <ToastProvider> (global notification system)
 *  • Provides client-side routing via react-router-dom v7
 *  • Renders <Navbar> + a full-height <main> content area
 *
 * Adding a new page:
 *   1. Create /src/pages/YourPage.jsx
 *   2. Add a <Route path="/your-path" element={<YourPage />} /> below
 *   3. Add the link to NAV_LINKS in Navbar.jsx
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider }  from './context/ToastContext';
import Navbar             from './components/Navbar/Navbar';
import DashboardPage      from './pages/DashboardPage';
import ClinicsPage        from './pages/ClinicsPage';
import styles             from './App.module.css';

// ── Placeholder pages (replace with real implementations as you build out) ────
function ShipmentsPage() {
  return (
    <main className={styles.placeholder}>
      <h1>Shipments</h1>
      <p>Shipment tracking module coming soon.</p>
    </main>
  );
}

function MonitorPage() {
  return (
    <main className={styles.placeholder}>
      <h1>Temperature Monitor</h1>
      <p>Live IoT temperature feed coming soon.</p>
    </main>
  );
}

// ── Root app ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className={styles.appShell}>
          {/* ── Persistent top navigation ──────────────────────────────────── */}
          <Navbar />

          {/* ── Page-level content area ────────────────────────────────────── */}
          <div className={styles.contentArea}>
            <Routes>
              <Route path="/"          element={<DashboardPage />} />
              <Route path="/clinics"   element={<ClinicsPage   />} />
              <Route path="/shipments" element={<ShipmentsPage />} />
              <Route path="/monitor"   element={<MonitorPage   />} />

              {/* 404 fallback */}
              <Route
                path="*"
                element={
                  <main className={styles.placeholder}>
                    <h1>404 — Page not found</h1>
                    <p>The route you requested does not exist.</p>
                  </main>
                }
              />
            </Routes>
          </div>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}