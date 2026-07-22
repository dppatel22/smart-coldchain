/**
 * components/Navbar/Navbar.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Top navigation bar for the Smart Cold-Chain dashboard.
 * Collapses to a hamburger menu on mobile (< 768 px) for field use.
 */

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Thermometer,
  Building2,
  Package,
  LayoutDashboard,
  Menu,
  X,
  Wifi,
} from 'lucide-react';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { to: '/',          label: 'Dashboard',    Icon: LayoutDashboard },
  { to: '/clinics',   label: 'Clinics',      Icon: Building2       },
  { to: '/shipments', label: 'Shipments',    Icon: Package         },
  { to: '/monitor',   label: 'Temperature',  Icon: Thermometer     },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* ── Brand ────────────────────────────────────────────────────────── */}
        <NavLink to="/" className={styles.brand} onClick={close}>
          <span className={styles.brandIcon}>
            <Thermometer size={20} />
          </span>
          <span className={styles.brandText}>
            Smart <span className={styles.brandAccent}>Cold-Chain</span>
          </span>
        </NavLink>

        {/* ── Desktop links ─────────────────────────────────────────────────── */}
        <ul className={styles.links}>
          {NAV_LINKS.map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.linkActive : ''}`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* ── Status badge ─────────────────────────────────────────────────── */}
        <div className={styles.statusBadge} title="Backend connected">
          <Wifi size={13} />
          <span>Live</span>
        </div>

        {/* ── Hamburger (mobile) ────────────────────────────────────────────── */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ── Mobile drawer ────────────────────────────────────────────────────── */}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        {NAV_LINKS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `${styles.drawerLink} ${isActive ? styles.drawerLinkActive : ''}`
            }
            onClick={close}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
