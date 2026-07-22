/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Root component: routing + global context + Layout shell.
 *
 * Adding a new page:
 *   1. Create /src/pages/YourPage.jsx
 *   2. Add a <Route path="/your-path" element={<YourPage />} /> below
 *   3. Add the link to NAV_LINKS in Layout.jsx
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Layout            from './components/Layout/Layout';
import DashboardPage     from './pages/DashboardPage';
import ClinicsPage       from './pages/ClinicsPage';
import styles            from './App.module.css';

// ── Placeholder pages ─────────────────────────────────────────────────────────
function ShipmentsPage() {
  return (
    <div className={styles.placeholder}>
      <h1 className={styles.placeholderTitle}>Shipments</h1>
      <p className={styles.placeholderText}>
        Batch shipment tracking is coming. Connect <code>/api/shipments</code> to enable.
      </p>
    </div>
  );
}

function MonitorPage() {
  return (
    <div className={styles.placeholder}>
      <h1 className={styles.placeholderTitle}>Live Sensor Feed</h1>
      <p className={styles.placeholderText}>
        Connect <code>/api/temperatures</code> to see real-time cold-box readings.
      </p>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/"          element={<DashboardPage />} />
            <Route path="/clinics"   element={<ClinicsPage   />} />
            <Route path="/shipments" element={<ShipmentsPage />} />
            <Route path="/monitor"   element={<MonitorPage   />} />
            <Route
              path="*"
              element={
                <div className={styles.placeholder}>
                  <h1 className={styles.placeholderTitle}>404 — Route not found</h1>
                  <p className={styles.placeholderText}>This path doesn't exist in the network.</p>
                </div>
              }
            />
          </Routes>
        </Layout>
      </ToastProvider>
    </BrowserRouter>
  );
}