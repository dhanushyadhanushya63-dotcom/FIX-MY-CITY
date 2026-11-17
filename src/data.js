// Demo data + the three "innovation" rules from the blueprint.
// Replace SEED and the helpers' inputs with calls to your Spring Boot REST API later.
export const CATS = {
  garbage: { label: 'Garbage & Waste', w: 2, team: 'Sanitation Wing' },
  pothole: { label: 'Roads & Potholes', w: 3, team: 'Zone 4 Roads' },
  light: { label: 'Street Lights', w: 1, team: 'Lighting Cell' },
  leakage: { label: 'Water Supply', w: 3, team: 'Metro Water' },
  other: { label: 'Others', w: 1, team: 'Zone 4 Roads' },
};
export const STAGES = ['Submitted', 'Under review', 'Assigned', 'In progress', 'Resolved', 'Closed'];
export const TEAMS = ['Zone 4 Roads', 'Sanitation Wing', 'Metro Water', 'Lighting Cell'];
export const SLA_DAYS = 5;

const ago = (n) => new Date(Date.now() - n * 864e5).toISOString();
const mk = (n, cat, desc, area, lat, lng, stage, age, by, team = null, extra = {}) => ({
  id: 'FMS-' + (100 + n), cat, desc, area, lat, lng, stage, by, team, notes: [], proof: false, rating: null, ...extra,
  history: Array.from({ length: stage + 1 }, (_, i) => ({ stage: i, at: ago(Math.max(age - i * 1.2, 0)) })),
});

export const SEED = [
  mk(1, 'pothole', 'Deep pothole near the bus stop, two-wheelers swerve into traffic.', 'T. Nagar', 13.0418, 80.2341, 0, 1, 'Priya Raman'),
  mk(2, 'pothole', 'Large pothole outside the Pondy Bazaar entrance.', 'T. Nagar', 13.04205, 80.23435, 0, 3, 'Karthik S'),
  mk(3, 'garbage', 'Garbage heap not cleared for a week on 2nd Main Road.', 'Adyar', 13.0012, 80.2565, 2, 6, 'Priya Raman', 'Sanitation Wing'),
  mk(4, 'leakage', 'Drinking water pipe leaking onto the road.', 'Velachery', 12.9815, 80.218, 3, 4, 'Meena L', 'Metro Water'),
  mk(5, 'light', 'Three streetlights are out along the service road.', 'Guindy', 13.0067, 80.2206, 1, 2, 'Priya Raman'),
  mk(6, 'pothole', 'Road caved in after rain near the signal.', 'Anna Nagar', 13.085, 80.2101, 2, 2, 'Arun V', 'Zone 4 Roads'),
  mk(7, 'garbage', 'Overflowing bins near the vegetable market.', 'Mylapore', 13.0368, 80.2676, 4, 8, 'Priya Raman', 'Sanitation Wing', { proof: true }),
  mk(8, 'leakage', 'Sewage overflowing into the lane.', 'Perambur', 13.1167, 80.2333, 0, 7, 'Divya R'),
  mk(9, 'pothole', 'Broken tar patch where the highway merges.', 'Tambaram', 12.9249, 80.1, 3, 3, 'Priya Raman', 'Zone 4 Roads'),
  mk(10, 'light', 'Dark stretch outside the school gate.', 'Velachery', 12.979, 80.221, 5, 10, 'Priya Raman', 'Lighting Cell', { proof: true, rating: 4 }),
];

export const age = (c) => (Date.now() - new Date(c.history[0].at)) / 864e5;
const dist = (a, b) => {
  const r = Math.PI / 180, x = (b.lng - a.lng) * r * Math.cos(((a.lat + b.lat) * r) / 2), y = (b.lat - a.lat) * r;
  return Math.hypot(x, y) * 6371000; // metres
};
const near = (c, all, m) => all.filter((o) => o.id !== c.id && o.cat === c.cat && dist(c, o) <= m);
// 1. Duplicate detection: same category, open, within 60 m. Admin confirms; nothing auto-merges.
export const dupes = (c, all) => near(c, all, 60).filter((o) => o.stage < 4);
// 2. Priority: category severity + age + repeat reports within 150 m.
export const score = (c, all) => CATS[c.cat].w * 2 + Math.min(age(c), 14) * 0.5 + near(c, all, 150).length * 2;
export const level = (s) => (s >= 9 ? 'High' : s >= 6 ? 'Medium' : 'Low');
// 3. Escalation: still open after SLA_DAYS.
export const overdue = (c) => c.stage < 4 && age(c) > SLA_DAYS;
export const when = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
export const days = (c) => { const d = Math.floor(age(c)); return d < 1 ? 'today' : d === 1 ? '1 day ago' : d + ' days ago'; };

export const LABELS = ['Complaint Registered', 'Under Review', 'Assigned to Team', 'Action in Progress', 'Resolved', 'Closed'];
export const stamp = (iso) => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
export const CITIZEN = 'Priya Raman'; // demo citizen
