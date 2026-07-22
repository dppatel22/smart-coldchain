/**
 * components/ClinicList/ClinicList.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders the list of health facilities in the cold-chain network.
 *
 * Props:
 *   clinics   Clinic[]
 *   loading   boolean
 *   onRemove  (id: number) => void
 */

import { Building2, MapPin, Trash2 } from 'lucide-react';
import styles from './ClinicList.module.css';

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ClinicSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
      <div className={`${styles.skeletonLine} ${styles.skeletonSub}`} />
    </div>
  );
}

// ── Individual facility card ───────────────────────────────────────────────────
function ClinicCard({ clinic, onRemove }) {
  return (
    <div className={styles.card}>
      <span className={styles.cardIcon}>
        <Building2 size={16} strokeWidth={2} />
      </span>
      <div className={styles.cardBody}>
        <p className={styles.cardName}>{clinic.name}</p>
        {/* County rendered in mono — it's a geographic data field */}
        <p className={styles.cardCounty}>
          <MapPin size={11} />
          <span className={styles.countyValue}>{clinic.county}</span>
        </p>
      </div>
      {onRemove && (
        <button
          className={styles.removeBtn}
          onClick={() => onRemove(clinic.id)}
          title="Remove from network"
          aria-label={`Remove ${clinic.name} from network`}
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

// ── List ──────────────────────────────────────────────────────────────────────
export default function ClinicList({ clinics = [], loading = false, onRemove }) {
  if (loading) {
    return (
      <div className={styles.list}>
        {Array.from({ length: 4 }).map((_, i) => (
          <ClinicSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!clinics.length) {
    return (
      <div className={styles.empty}>
        <Building2 size={32} className={styles.emptyIcon} strokeWidth={1.5} />
        <p className={styles.emptyTitle}>No facilities in the network yet.</p>
        <p className={styles.emptyHint}>
          Add your first facility to start tracking cold storage.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {clinics.map((clinic) => (
        <ClinicCard key={clinic.id} clinic={clinic} onRemove={onRemove} />
      ))}
    </div>
  );
}
