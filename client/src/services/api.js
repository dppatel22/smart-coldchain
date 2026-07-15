/**
 * services/api.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all HTTP calls to the Express backend.
 * An axios instance is created with a shared baseURL and default headers so
 * every service module inherits them automatically.
 */

import axios from 'axios';

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000, // 10 s — generous for rural/mobile networks
});

// ── Request interceptor (attach auth tokens later if needed) ──────────────────
api.interceptors.request.use(
  (config) => {
    // Placeholder: add Authorization header here when auth is introduced
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor (normalize errors) ───────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Build a single, consistent error message regardless of error shape
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    // Attach normalized message so callers can do: catch(e) => e.message
    error.message = message;
    return Promise.reject(error);
  },
);

// ═════════════════════════════════════════════════════════════════════════════
// Health
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Ping the backend health endpoint.
 * @returns {Promise<{ status: string, message: string }>}
 */
export const checkHealth = () => api.get('/health').then((r) => r.data);

// ═════════════════════════════════════════════════════════════════════════════
// Clinics
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Fetch every clinic record.
 * @returns {Promise<Clinic[]>}
 */
export const getClinics = () => api.get('/clinics').then((r) => r.data);

/**
 * Create a new clinic.
 * @param {{ name: string, county: string }} payload
 * @returns {Promise<{ message: string, clinic: Clinic }>}
 */
export const createClinic = (payload) =>
  api.post('/clinics', payload).then((r) => r.data);

/**
 * Update an existing clinic by id.
 * @param {number|string} id
 * @param {Partial<{ name: string, county: string }>} payload
 * @returns {Promise<{ message: string, clinic: Clinic }>}
 */
export const updateClinic = (id, payload) =>
  api.put(`/clinics/${id}`, payload).then((r) => r.data);

/**
 * Soft-delete a clinic.
 * @param {number|string} id
 * @returns {Promise<{ message: string }>}
 */
export const deleteClinic = (id) =>
  api.delete(`/clinics/${id}`).then((r) => r.data);

// ═════════════════════════════════════════════════════════════════════════════
// Temperature Readings  (extend when the simulator/IoT data flows in)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Fetch temperature readings, optionally filtered by clinicId.
 * @param {number|string} [clinicId]
 * @returns {Promise<TemperatureReading[]>}
 */
export const getTemperatureReadings = (clinicId) => {
  const params = clinicId ? { clinic_id: clinicId } : {};
  return api.get('/temperatures', { params }).then((r) => r.data);
};

/**
 * Post a new temperature reading (used by the simulator).
 * @param {{ clinic_id: number, temperature: number, timestamp?: string }} payload
 * @returns {Promise<TemperatureReading>}
 */
export const createTemperatureReading = (payload) =>
  api.post('/temperatures', payload).then((r) => r.data);

// ═════════════════════════════════════════════════════════════════════════════
// Shipments  (placeholder — add routes to server.js when ready)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Fetch all shipment records.
 * @returns {Promise<Shipment[]>}
 */
export const getShipments = () => api.get('/shipments').then((r) => r.data);

/**
 * Create a shipment.
 * @param {object} payload
 * @returns {Promise<Shipment>}
 */
export const createShipment = (payload) =>
  api.post('/shipments', payload).then((r) => r.data);

export default api;
