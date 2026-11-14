// Demo data + the three "innovation" rules from the blueprint.
// Replace SEED and the helpers' inputs with calls to your Spring Boot REST API later.
export const CATS = {
  garbage: { label: 'Garbage & Waste', labelTa: 'குப்பை & கழிவு மேலாண்மை', w: 2, team: 'Sanitation Wing', teamTa: 'துப்புரவுப் பிரிவு' },
  pothole: { label: 'Roads & Potholes', labelTa: 'சாலைகள் & சாலைக் குழிகள்', w: 3, team: 'Zone 4 Roads', teamTa: 'மண்டலம் 4 சாலைப் பிரிவு' },
  light: { label: 'Street Lights', labelTa: 'தெரு விளக்குகள் பழுது', w: 1, team: 'Lighting Cell', teamTa: 'மின் விளக்குப் பிரிவு' },
  leakage: { label: 'Water Supply', labelTa: 'குடிநீர் & கழிவுநீர் கசிவு', w: 3, team: 'Metro Water', teamTa: 'மெட்ரோ குடிநீர்ப் பிரிவு' },
  other: { label: 'Others', labelTa: 'இதர குடிமைப் பிரச்சினைகள்', w: 1, team: 'Zone 4 Roads', teamTa: 'மண்டலம் 4 சாலைப் பிரிவு' },
};

export const STAGES = ['Submitted', 'Under review', 'Assigned', 'In progress', 'Resolved', 'Closed'];
export const STAGES_TA = ['சமர்ப்பிக்கப்பட்டது', 'ஆய்வில்', 'ஒதுக்கப்பட்டது', 'பணியில்', 'தீர்க்கப்பட்டது', 'முடிக்கப்பட்டது'];

export const TEAMS = ['Zone 4 Roads', 'Sanitation Wing', 'Metro Water', 'Lighting Cell'];
export const TEAMS_TA = {
  'Zone 4 Roads': 'மண்டலம் 4 சாலைப் பிரிவு',
  'Sanitation Wing': 'துப்புரவுப் பிரிவு',
  'Metro Water': 'மெட்ரோ குடிநீர்ப் பிரிவு',
  'Lighting Cell': 'மின் விளக்குப் பிரிவு',
};

export const TEAM_OFFICERS = {
  'Zone 4 Roads': { officer: 'Officer R. Selvam', officerTa: 'அதிகாரி ஆர். செல்வம்', phone: '044-2815000', email: 'roads.zone4@fixmystreet.gov' },
  'Sanitation Wing': { officer: 'Lead Inspector Murugan', officerTa: 'ஆய்வாளர் முருகன்', phone: '044-2815001', email: 'sanitation@fixmystreet.gov' },
  'Metro Water': { officer: 'Engineer K. Anitha', officerTa: 'பொறியாளர் கே. அனிதா', phone: '044-2815002', email: 'water@fixmystreet.gov' },
  'Lighting Cell': { officer: 'Supervisor S. Baskar', officerTa: 'கண்காணிப்பாளர் எஸ். பாஸ்கர்', phone: '044-2815003', email: 'lighting@fixmystreet.gov' },
};

export const getCatLabel = (cat, lang = 'en') => {
  if (!CATS[cat]) return cat;
  return lang === 'ta' ? CATS[cat].labelTa : CATS[cat].label;
};

export const getTeamLabel = (team, lang = 'en') => {
  if (!team) return lang === 'ta' ? 'ஒதுக்கப்படவில்லை' : 'Not assigned';
  return lang === 'ta' ? (TEAMS_TA[team] || team) : team;
};

export const getStageLabel = (stageIndex, lang = 'en') => {
  if (lang === 'ta') return STAGES_TA[stageIndex] || STAGES[stageIndex];
  return STAGES[stageIndex] || 'Unknown';
};

export const NAME_MAP_TA = {
  'dhanushya muthumani': 'தனுஷ்யா முத்துமணி',
  'dhanushya': 'தனுஷ்யா',
  'muthumani': 'முத்துமணி',
  'priya raman': 'பிரியா ராமன்',
  'priya': 'பிரியா',
  'karthik s': 'கார்த்திக் எஸ்',
  'karthik': 'கார்த்திக்',
  'meena l': 'மீனா எல்',
  'arun v': 'அருண் வி',
  'divya r': 'திவ்யா ஆர்',
  'officer r. selvam': 'அதிகாரி ஆர். செல்வம்',
  'lead inspector murugan': 'ஆய்வாளர் முருகன்',
  'engineer k. anitha': 'பொறியாளர் கே. அனிதா',
  'supervisor s. baskar': 'கண்காணிப்பாளர் எஸ். பாஸ்கர்',
  'admin': 'நிர்வாகி',
};

export const formatUserName = (name, lang = 'en') => {
  if (!name) return '';
  if (lang !== 'ta') return name;
  const raw = String(name).trim();
  const lower = raw.toLowerCase();
  if (NAME_MAP_TA[lower]) return NAME_MAP_TA[lower];

  // Try matching words individually
  const words = lower.split(/\s+/);
  const mapped = words.map((w) => NAME_MAP_TA[w] || w);
  const combined = mapped.join(' ');
  return combined !== lower ? combined : raw;
};

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

export const age = (c) => {
  const at = c?.history?.[0]?.at || c?.createdAt;
  if (!at) return 1;
  const d = (Date.now() - new Date(at).getTime()) / 864e5;
  return Number.isFinite(d) && d >= 0 ? d : 1;
};

const dist = (a, b) => {
  if (!a || !b || a.lat == null || a.lng == null || b.lat == null || b.lng == null) return 999999;
  const aLat = Number(a.lat), aLng = Number(a.lng), bLat = Number(b.lat), bLng = Number(b.lng);
  if (!Number.isFinite(aLat) || !Number.isFinite(aLng) || !Number.isFinite(bLat) || !Number.isFinite(bLng)) return 999999;
  const r = Math.PI / 180, x = (bLng - aLng) * r * Math.cos(((aLat + bLat) * r) / 2), y = (bLat - aLat) * r;
  return Math.hypot(x, y) * 6371000; // metres
};

const near = (c, all, m) => {
  if (!c || !Array.isArray(all)) return [];
  return all.filter((o) => o && o.id !== c.id && o.cat === c.cat && dist(c, o) <= m);
};

// 1. Duplicate detection: same category, open, within 60 m. Admin confirms; nothing auto-merges.
export const dupes = (c, all) => {
  if (!c || !Array.isArray(all)) return [];
  return near(c, all, 60).filter((o) => (o.stage ?? 0) < 4);
};

// 2. Priority: category severity + age + repeat reports within 150 m.
export const score = (c, all) => {
  if (!c) return 0;
  const weight = CATS[c?.cat]?.w || 1;
  const nearCount = near(c, all || [], 150).length;
  return weight * 2 + Math.min(age(c), 14) * 0.5 + nearCount * 2;
};

export const level = (s) => (s >= 9 ? 'High' : s >= 6 ? 'Medium' : 'Low');

// 3. Escalation: still open after SLA_DAYS.
export const overdue = (c) => Boolean(c && (c.stage ?? 0) < 4 && age(c) > SLA_DAYS);

export const when = (iso) => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
};

export const days = (c) => {
  const d = Math.floor(age(c));
  return d < 1 ? 'today' : d === 1 ? '1 day ago' : d + ' days ago';
};

export const LABELS = ['Complaint Registered', 'Under Review', 'Assigned to Team', 'Action in Progress', 'Resolved', 'Closed'];

export const stamp = (iso) => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '' : d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch {
    return '';
  }
};
export const CITIZEN = 'Priya Raman'; // demo citizen
