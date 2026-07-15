/**
 * pages/DashboardPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Overview / landing page with KPI stat cards and a placeholder temperature
 * chart area. Data is fetched from the backend on mount.
 */

import { useEffect, useState } from 'react';
import {
  Thermometer,
  Building2,
  Package,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { checkHealth, getClinics } from '../services/api';
import styles from './DashboardPage.module.css';

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, hint }) {
  return (
    <div className={styles.statCard} style={{ '--accent': color }}>
      <div className={styles.statIcon} style={{ background: `${color}18`, color }}>
        <Icon size={20} />
      </div>
      <div className={styles.statBody}>
        <p className={styles.statValue}>{value}</p>
        <p className={styles.statLabel}>{label}</p>
        {hint && <p className={styles.statHint}>{hint}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [clinicCount, setClinicCount] = useState('—');
  const [apiStatus,   setApiStatus]   = useState('checking…');
  const [apiOk,       setApiOk]       = useState(null);

  useEffect(() => {
    // Ping backend
    checkHealth()
      .then((d) => { setApiStatus(d.message); setApiOk(true); })
      .catch(() => { setApiStatus('Backend unreachable'); setApiOk(false); });

    // Count clinics
    getClinics()
      .then((data) => setClinicCount(data.length))
      .catch(() => setClinicCount('—'));
  }, []);

  return (
    <main className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Real-time overview of the cold-chain network</p>
        </div>
        <span
          className={`${styles.apiPill} ${apiOk === false ? styles.apiPillError : ''}`}
        >
          <span className={styles.dot} />
          {apiOk === null ? 'Connecting…' : apiOk ? 'API Online' : 'API Offline'}
        </span>
      </div>

      {/* KPI grid */}
      <div className={styles.statsGrid}>
        <StatCard
          icon={Building2}
          label="Registered Facilities"
          value={clinicCount}
          color="#3b82f6"
          hint="Clinics in network"
        />
        <StatCard
          icon={Package}
          label="Active Shipments"
          value="—"
          color="#8b5cf6"
          hint="Coming soon"
        />
        <StatCard
          icon={Thermometer}
          label="Avg Temperature"
          value="—°C"
          color="#06b6d4"
          hint="Last 24 h"
        />
        <StatCard
          icon={AlertTriangle}
          label="Temp Alerts"
          value="—"
          color="#f59e0b"
          hint="Out-of-range events"
        />
      </div>

      {/* Chart placeholder */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <TrendingUp size={18} />
          <h2 className={styles.chartTitle}>Temperature Trends</h2>
          <span className={styles.chartBadge}>Live</span>
        </div>
        <div className={styles.chartPlaceholder}>
          <Thermometer size={40} className={styles.chartPlaceholderIcon} />
          <p>Temperature chart will render here</p>
          <p className={styles.chartHint}>
            Hook up <code>/api/temperatures</code> and drop in a{' '}
            <code>&lt;TemperatureChart /&gt;</code> component using Recharts.
          </p>
        </div>
      </div>

      {/* API status bar */}
      <div className={styles.statusBar}>
        <span className={styles.statusDot} data-ok={apiOk} />
        <code className={styles.statusText}>{apiStatus}</code>
      </div>
    </main>
  );
}
