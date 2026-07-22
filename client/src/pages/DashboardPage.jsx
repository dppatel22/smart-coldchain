/**
 * pages/DashboardPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Network overview with the Cold-Band Rail signature element.
 *
 * Cold-Band Rail: the one bold visual device.
 *   - Renders the 2–8°C safe zone on a temperature track (–2°C to 14°C)
 *   - Facility readings are plotted as dots positioned at their current temp
 *   - Dot colour: --stable (in range) / --alert (boundary drift) / --breach (outside)
 *   - At current scale (no live feed): demo data with an honest pending label
 *   - Animation: track draws left-to-right on mount (400ms), dots drop in with
 *     stagger (one orchestrated sequence, not scattered micro-animations)
 *
 * Everything else on this page is quiet and disciplined.
 */

import { useEffect, useState } from 'react';
import {
  Building2,
  Package,
  Thermometer,
  AlertTriangle,
} from 'lucide-react';
import { checkHealth, getClinics } from '../services/api';
import styles from './DashboardPage.module.css';

/* ── Cold-Band constants ─────────────────────────────────────────────────── */
const MIN_TEMP  = -2;
const MAX_TEMP  = 14;
const SAFE_MIN  =  2;
const SAFE_MAX  =  8;
const TEMP_SPAN = MAX_TEMP - MIN_TEMP;

/** Maps a temperature value to a percentage position on the track */
const toPct = (temp) => ((temp - MIN_TEMP) / TEMP_SPAN) * 100;

const SAFE_LEFT  = toPct(SAFE_MIN);  // 25%
const SAFE_WIDTH = toPct(SAFE_MAX) - toPct(SAFE_MIN); // 37.5%

/**
 * Demo readings — representative Kenyan facilities.
 * Replace with live data from /api/temperatures when available.
 */
const DEMO_READINGS = [
  { name: 'Nairobi Central',  temp: 4.1, status: 'stable' },
  { name: 'Mombasa KCH',     temp: 3.6, status: 'stable' },
  { name: 'Nakuru District',  temp: 7.8, status: 'alert'  },
  { name: 'Kisumu Referral',  temp: 5.3, status: 'stable' },
];

/* ── Cold-Band Rail ─────────────────────────────────────────────────────────
   Signature element. The one place where design boldness is concentrated.
   Everything else on the page defers to this.
*/
function ColdBandRail() {
  return (
    <div className={styles.railCard}>
      {/* Header */}
      <div className={styles.railHeader}>
        <span className={styles.railTitle}>COLD-BAND STATUS</span>
        <span className={styles.railNote}>
          Demo readings — connect <code>/api/temperatures</code> for live data
        </span>
      </div>

      {/* Track + dots */}
      <div className={styles.railWrapper}>
        <div className={styles.railTrack}>
          {/* Safe zone: the 2–8°C band highlighted in --cold */}
          <div
            className={styles.safeZone}
            style={{ left: `${SAFE_LEFT}%`, width: `${SAFE_WIDTH}%` }}
          />

          {/* Facility dots positioned at their temperature readings */}
          {DEMO_READINGS.map((f, i) => (
            <div
              key={f.name}
              className={`${styles.facilityDot} ${styles[`dot_${f.status}`]}`}
              style={{
                left: `${toPct(f.temp)}%`,
                animationDelay: `${420 + i * 75}ms`,
              }}
              role="img"
              aria-label={`${f.name}: ${f.temp}°C — ${f.status}`}
              title={`${f.name}: ${f.temp}°C`}
            />
          ))}
        </div>

        {/* Safe zone bracket label */}
        <div
          className={styles.safeLabel}
          style={{ left: `${SAFE_LEFT}%`, width: `${SAFE_WIDTH}%` }}
        >
          ← 2–8°C safe zone →
        </div>

        {/* Temperature scale */}
        <div className={styles.railScale}>
          <span className={styles.scaleMin}>{MIN_TEMP}°C</span>
          <span
            className={styles.scaleMid}
            style={{ left: `${SAFE_LEFT}%` }}
          >
            {SAFE_MIN}°C
          </span>
          <span
            className={styles.scaleMid}
            style={{ left: `${toPct(SAFE_MAX)}%` }}
          >
            {SAFE_MAX}°C
          </span>
          <span className={styles.scaleMax}>{MAX_TEMP}°C</span>
        </div>
      </div>

      {/* Facility legend */}
      <div className={styles.railLegend}>
        {DEMO_READINGS.map((f) => (
          <span
            key={f.name}
            className={`${styles.legendItem} ${styles[`legend_${f.status}`]}`}
          >
            <span className={styles.legendDot} />
            {f.name}
            <span className={styles.legendTemp}>{f.temp}°C</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Stat card ──────────────────────────────────────────────────────────────
   Quiet and disciplined — the Rail is the bold element, not these.
*/
function StatCard({ icon: Icon, label, value, status }) {
  return (
    <div className={`${styles.statCard} ${status ? styles[`stat_${status}`] : ''}`}>
      <div className={styles.statIconWrap}>
        <Icon size={17} strokeWidth={2} />
      </div>
      <div className={styles.statBody}>
        <p className={styles.statValue}>{value}</p>
        <p className={styles.statLabel}>{label}</p>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────────*/
export default function DashboardPage() {
  const [clinicCount, setClinicCount] = useState('—');
  const [apiStatus,   setApiStatus]   = useState('Connecting…');
  const [apiOk,       setApiOk]       = useState(null);

  useEffect(() => {
    checkHealth()
      .then((d) => { setApiStatus(d.message); setApiOk(true); })
      .catch(() => {
        setApiStatus("Can't reach server — check your connection");
        setApiOk(false);
      });

    getClinics()
      .then((data) => setClinicCount(data.length))
      .catch(() => setClinicCount('—'));
  }, []);

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Network Overview</h1>
          <p className={styles.pageSubtitle}>
            Cold-chain status across all registered health facilities in Kenya
          </p>
        </div>
        <span
          className={`${styles.connPill} ${apiOk === false ? styles.connPillError : ''}`}
          aria-live="polite"
        >
          <span className={styles.connDot} />
          {apiOk === null ? 'Connecting…' : apiOk ? 'Connected' : 'Offline'}
        </span>
      </div>

      {/* ── Cold-Band Rail — signature element ─────────────────────────── */}
      <ColdBandRail />

      {/* ── KPI cards ──────────────────────────────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard
          icon={Building2}
          label="Facilities in network"
          value={clinicCount}
        />
        <StatCard
          icon={Package}
          label="Active shipments"
          value="—"
        />
        <StatCard
          icon={Thermometer}
          label="Avg. cold-box temp"
          value="—°C"
        />
        <StatCard
          icon={AlertTriangle}
          label="Batches expiring this week"
          value="—"
          status="alert"
        />
      </div>

      {/* API status — small, at the bottom, not prominent */}
      <div className={styles.statusBar}>
        <span className={styles.statusDot} data-ok={String(apiOk)} />
        <code className={styles.statusText}>{apiStatus}</code>
      </div>
    </div>
  );
}
