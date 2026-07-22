/**
 * pages/ClinicsPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Health facility management.
 * Layout: facility list (primary, left) + registration form (context rail, right).
 * On mobile: form stacks above list (action before result).
 */

import { useToast }   from '../context/ToastContext';
import { useClinics } from '../hooks/useClinics';
import ClinicForm     from '../components/ClinicForm/ClinicForm';
import ClinicList     from '../components/ClinicList/ClinicList';
import styles         from './ClinicsPage.module.css';
import { RefreshCcw } from 'lucide-react';

export default function ClinicsPage() {
  const { clinics, loading, error, addClinic, removeClinic, refresh } = useClinics();
  const { showToast } = useToast();

  const handleRemove = async (id) => {
    try {
      await removeClinic(id);
      showToast('Facility removed from network.', 'warning');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Network Facilities</h1>
          <p className={styles.pageSubtitle}>
            Health centres enrolled in the cold-chain network
          </p>
        </div>
        <button className={styles.refreshBtn} onClick={refresh} title="Refresh list">
          <RefreshCcw size={14} />
          Refresh
        </button>
      </div>

      {/* Error — plain language, not apologetic */}
      {error && (
        <div className={styles.errorBanner} role="alert">
          Can't load facilities — {error}
        </div>
      )}

      {/* Content grid: list is primary, form is context rail */}
      <div className={styles.grid}>
        {/* ── List (primary — left on desktop, below on mobile) ── */}
        <section className={styles.listSection}>
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>Registered facilities</h2>
            <span className={styles.badge}>{clinics.length}</span>
          </div>
          <ClinicList clinics={clinics} loading={loading} onRemove={handleRemove} />
        </section>

        {/* ── Form (context rail — right on desktop, above on mobile) ── */}
        <section className={styles.formSection}>
          <ClinicForm onAdd={addClinic} />
        </section>
      </div>
    </div>
  );
}
