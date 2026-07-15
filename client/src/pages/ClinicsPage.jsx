/**
 * pages/ClinicsPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Full-page view for clinic management.
 * Owns the useClinics hook instance and passes data/actions down to children.
 */

import { useToast }    from '../context/ToastContext';
import { useClinics }  from '../hooks/useClinics';
import ClinicForm      from '../components/ClinicForm/ClinicForm';
import ClinicList      from '../components/ClinicList/ClinicList';
import styles          from './ClinicsPage.module.css';
import { RefreshCcw }  from 'lucide-react';

export default function ClinicsPage() {
  const { clinics, loading, error, addClinic, removeClinic, refresh } = useClinics();
  const { showToast } = useToast();

  const handleRemove = async (id) => {
    try {
      await removeClinic(id);
      showToast('Facility removed.', 'warning');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <main className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Health Facilities</h1>
          <p className={styles.pageSubtitle}>
            Manage all clinics and health centres in the cold-chain network.
          </p>
        </div>
        <button className={styles.refreshBtn} onClick={refresh} title="Refresh list">
          <RefreshCcw size={15} />
          Refresh
        </button>
      </div>

      {/* Global error banner */}
      {error && (
        <div className={styles.errorBanner} role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Main content grid */}
      <div className={styles.grid}>
        <section className={styles.formSection}>
          <ClinicForm onAdd={addClinic} />
        </section>

        <section className={styles.listSection}>
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>Registered Facilities</h2>
            <span className={styles.badge}>{clinics.length}</span>
          </div>
          <ClinicList clinics={clinics} loading={loading} onRemove={handleRemove} />
        </section>
      </div>
    </main>
  );
}
