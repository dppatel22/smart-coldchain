/**
 * hooks/useClinics.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom hook that owns all clinic state: fetching, adding, and error handling.
 * Any component that needs clinic data imports this hook — never calls the
 * service layer directly — keeping data flow in a single, predictable place.
 */

import { useState, useEffect, useCallback } from 'react';
import { getClinics, createClinic, deleteClinic } from '../services/api';

/**
 * @typedef {Object} Clinic
 * @property {number}  id
 * @property {string}  name
 * @property {string}  county
 * @property {string}  [created_at]
 */

/**
 * @returns {{
 *   clinics: Clinic[],
 *   loading: boolean,
 *   error: string|null,
 *   addClinic: (payload: { name: string, county: string }) => Promise<Clinic>,
 *   removeClinic: (id: number) => Promise<void>,
 *   refresh: () => void,
 * }}
 */
export function useClinics() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchClinics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClinics();
      setClinics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClinics();
  }, [fetchClinics]);

  // ── Add (optimistic UI: append immediately, rollback on failure) ───────────
  const addClinic = useCallback(async (payload) => {
    // Temporary placeholder so the list feels instant
    const tempId = `temp-${Date.now()}`;
    const optimistic = { id: tempId, ...payload };
    setClinics((prev) => [...prev, optimistic]);

    try {
      const { clinic } = await createClinic(payload);
      // Replace the temporary record with the real one from the database
      setClinics((prev) => prev.map((c) => (c.id === tempId ? clinic : c)));
      return clinic;
    } catch (err) {
      // Rollback on failure
      setClinics((prev) => prev.filter((c) => c.id !== tempId));
      setError(err.message);
      throw err; // re-throw so the form component can catch it too
    }
  }, []);

  // ── Remove ────────────────────────────────────────────────────────────────
  const removeClinic = useCallback(async (id) => {
    const snapshot = clinics; // keep for rollback
    setClinics((prev) => prev.filter((c) => c.id !== id));
    try {
      await deleteClinic(id);
    } catch (err) {
      setClinics(snapshot); // rollback
      setError(err.message);
      throw err;
    }
  }, [clinics]);

  return {
    clinics,
    loading,
    error,
    addClinic,
    removeClinic,
    refresh: fetchClinics,
  };
}
