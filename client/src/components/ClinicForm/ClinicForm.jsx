/**
 * components/ClinicForm/ClinicForm.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Form for adding a health facility to the cold-chain network.
 *
 * Props:
 *   onAdd (clinic: Clinic) => void — called after successful server round-trip
 */

import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { PlusCircle, Loader2 } from 'lucide-react';
import styles from './ClinicForm.module.css';

const INITIAL = { name: '', county: '' };

export default function ClinicForm({ onAdd }) {
  const [form,   setForm]   = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { showToast }       = useToast();

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name   = 'Facility name is required.';
    if (!form.county.trim()) e.county = 'County is required.';
    return e;
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      const clinic = await onAdd({ name: form.name.trim(), county: form.county.trim() });
      showToast(`${clinic?.name ?? form.name} added to network.`, 'success');
      setForm(INITIAL);
      setErrors({});
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>Add facility to network</h2>

      {/* Facility name */}
      <div className={`${styles.field} ${errors.name ? styles.fieldError : ''}`}>
        <label htmlFor="clinic-name" className={styles.label}>
          Facility name
        </label>
        <input
          id="clinic-name"
          name="name"
          type="text"
          placeholder="e.g. Kenyatta National Hospital"
          className={styles.input}
          value={form.name}
          onChange={handleChange}
          disabled={saving}
          autoComplete="off"
        />
        {errors.name && (
          <span className={styles.errorMsg} role="alert">{errors.name}</span>
        )}
      </div>

      {/* County */}
      <div className={`${styles.field} ${errors.county ? styles.fieldError : ''}`}>
        <label htmlFor="clinic-county" className={styles.label}>
          County
        </label>
        <input
          id="clinic-county"
          name="county"
          type="text"
          placeholder="e.g. Nairobi"
          className={styles.input}
          value={form.county}
          onChange={handleChange}
          disabled={saving}
          autoComplete="off"
        />
        {errors.county && (
          <span className={styles.errorMsg} role="alert">{errors.county}</span>
        )}
      </div>

      <button type="submit" className={styles.btn} disabled={saving}>
        {saving
          ? <><Loader2 size={15} className={styles.spin} /> Saving…</>
          : <><PlusCircle size={15} /> Add facility</>
        }
      </button>
    </form>
  );
}
