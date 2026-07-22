/**
 * components/Layout/Layout.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Cold-Chain KE application shell.
 *
 * Shell concept: status-first topbar, no sidebar.
 * Rationale: Cold-chain workers open the app to check one thing —
 * is everything still cold and on time? A sidebar implies spatial/modal
 * navigation. This app's primary interaction is status-at-a-glance.
 * The topbar carries brand + navigation + a live fleet-status slot.
 *
 * Navigation: text links with active underline, not pills.
 * Active underline sits flush with the topbar's bottom border — it reads
 * as a tab, which is the correct mental model (you're viewing a section
 * of a continuous operational picture, not switching "modes").
 */

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Thermometer, Menu, X } from 'lucide-react';
import styles from './Layout.module.css';

const NAV_LINKS = [
  { to: '/',          label: 'Dashboard',   end: true  },
  { to: '/clinics',   label: 'Facilities',  end: false },
  { to: '/shipments', label: 'Shipments',   end: false },
  { to: '/monitor',   label: 'Live Feed',   end: false },
];

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={styles.shell}>
      {/* ── Topbar ──────────────────────────────────────────────────────── */}
      <header className={styles.topbar}>
        {/* Brand */}
        <NavLink to="/" className={styles.brand} onClick={() => setMobileOpen(false)}>
          <Thermometer size={16} className={styles.brandIcon} strokeWidth={2.5} />
          <span className={styles.brandName}>
            Cold-Chain <span className={styles.brandGeo}>KE</span>
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Fleet status — right slot */}
        <div className={styles.fleetStatus}>
          <span className={styles.fleetDot} />
          <span className={styles.fleetLabel}>KE Network</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* ── Mobile nav drawer ───────────────────────────────────────────── */}
      {mobileOpen && (
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}

      {/* ── Page content ────────────────────────────────────────────────── */}
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
