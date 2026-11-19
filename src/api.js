// FixMyStreet API Client
// Connects React frontend to Java Spring Boot REST API (http://localhost:8080/api)

const API_BASE = 'http://localhost:8080/api';

/**
 * Fetch all complaints from Java Spring Boot backend
 */
export async function fetchComplaints() {
  try {
    const res = await fetch(`${API_BASE}/complaints`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    console.warn('Backend currently unreachable, using local storage:', err.message);
    return { ok: false, error: err.message };
  }
}

/**
 * Fetch single complaint by ID
 */
export async function fetchComplaintById(id) {
  try {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Register a new complaint in MySQL via Spring Boot
 */
export async function createComplaintApi(complaint) {
  try {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaint),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    console.warn('Backend save failed, saved locally:', err.message);
    return { ok: false, error: err.message };
  }
}

/**
 * Update complaint stage, assign team, attach resolution proof or rating
 */
export async function updateStageApi(id, stage, extra = {}) {
  try {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}/stage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, ...extra }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    console.warn('Backend update failed:', err.message);
    return { ok: false, error: err.message };
  }
}

/**
 * Add a progress note to a complaint
 */
export async function addNoteApi(id, noteText) {
  try {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(id)}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ t: noteText }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Submit feedback or contact query
 */
export async function submitFeedbackApi(data) {
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const resData = await res.json();
    return { ok: true, data: resData };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
