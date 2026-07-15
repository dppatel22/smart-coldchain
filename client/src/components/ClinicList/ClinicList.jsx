/**
 * components/ClinicList/ClinicList.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders the list of clinics fetched from the useClinics hook.
 * Shows a skeleton while loading, an empty state when there's no data,
 * and individual cards with a remove button.
 *
 * Props:
 *   clinics   Clinic[]
 *   loading   boolean
 *   onRemove  (id: number) => void
 */

import { Building2, MapPin, Trash2 } from 'lucide-react';
import styles from './ClinicList.module.css';

// ── Skeleton placeholder ──────────────────────────────────────────────────────
function ClinicSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
      <div className={`${styles.skeletonLine} ${styles.skeletonSub}`} />
    </div>
  );
}

// ── Individual card ───────────────────────────────────────────────────────────
function ClinicCard({ clinic, onRemove }) {
  return (
    <div className={styles.card}>
      <span className={styles.cardIcon}>
        <Building2 size={18} />
      </span>
      <div className={styles.cardBody}>
        <p className={styles.cardName}>{clinic.name}</p>
        <p className={styles.cardCounty}>
          <MapPin size={12} /> {clinic.county}
        </p>
      </div>
      {onRemove && (
        <button
          className={styles.removeBtn}
          onClick={() => onRemove(clinic.id)}
          title="Remove facility"
          aria-label={`Remove ${clinic.name}`}
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}

// ── List ─────────────────────────────────────────────────────────────────────
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
        <Building2 size={36} className={styles.emptyIcon} />
        <p>No facilities registered yet.</p>
        <p className={styles.emptyHint}>Use the form above to add your first clinic.</p>
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
