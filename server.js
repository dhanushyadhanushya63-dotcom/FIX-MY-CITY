import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const DB_DIR = path.join(__dirname, 'database');
const DB_FILE = path.join(DB_DIR, 'complaints.json');
const FEEDBACK_FILE = path.join(DB_DIR, 'feedback.json');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Default Seed Data
const INITIAL_SEED = [
  {
    id: 'FMS-101',
    cat: 'pothole',
    desc: 'Deep pothole near the bus stop, two-wheelers swerve into traffic.',
    area: 'T. Nagar',
    lat: 13.0418,
    lng: 80.2341,
    stage: 0,
    by: 'Priya Raman',
    team: null,
    notes: [],
    proof: false,
    rating: null,
    history: [{ stage: 0, at: new Date(Date.now() - 86400000).toISOString() }]
  },
  {
    id: 'FMS-102',
    cat: 'pothole',
    desc: 'Large pothole outside the Pondy Bazaar entrance.',
    area: 'T. Nagar',
    lat: 13.04205,
    lng: 80.23435,
    stage: 0,
    by: 'Karthik S',
    team: null,
    notes: [],
    proof: false,
    rating: null,
    history: [{ stage: 0, at: new Date(Date.now() - 259200000).toISOString() }]
  },
  {
    id: 'FMS-103',
    cat: 'garbage',
    desc: 'Garbage heap not cleared for a week on 2nd Main Road.',
    area: 'Adyar',
    lat: 13.0012,
    lng: 80.2565,
    stage: 2,
    by: 'Priya Raman',
    team: 'Sanitation Wing',
    notes: [],
    proof: false,
    rating: null,
    history: [
      { stage: 0, at: new Date(Date.now() - 518400000).toISOString() },
      { stage: 1, at: new Date(Date.now() - 418400000).toISOString() },
      { stage: 2, at: new Date(Date.now() - 318400000).toISOString() }
    ]
  },
  {
    id: 'FMS-104',
    cat: 'leakage',
    desc: 'Drinking water pipe leaking onto the road.',
    area: 'Velachery',
    lat: 12.9815,
    lng: 80.218,
    stage: 3,
    by: 'Meena L',
    team: 'Metro Water',
    notes: [],
    proof: false,
    rating: null,
    history: [
      { stage: 0, at: new Date(Date.now() - 345600000).toISOString() },
      { stage: 1, at: new Date(Date.now() - 245600000).toISOString() },
      { stage: 2, at: new Date(Date.now() - 145600000).toISOString() },
      { stage: 3, at: new Date(Date.now() - 45600000).toISOString() }
    ]
  },
  {
    id: 'FMS-105',
    cat: 'light',
    desc: 'Three streetlights are out along the service road.',
    area: 'Guindy',
    lat: 13.0067,
    lng: 80.2206,
    stage: 1,
    by: 'Priya Raman',
    team: 'Lighting Cell',
    notes: [],
    proof: false,
    rating: null,
    history: [
      { stage: 0, at: new Date(Date.now() - 172800000).toISOString() },
      { stage: 1, at: new Date(Date.now() - 72800000).toISOString() }
    ]
  },
  {
    id: 'FMS-106',
    cat: 'pothole',
    desc: 'Road caved in after rain near the signal.',
    area: 'Anna Nagar',
    lat: 13.085,
    lng: 80.2101,
    stage: 2,
    by: 'Arun V',
    team: 'Zone 4 Roads',
    notes: [],
    proof: false,
    rating: null,
    history: [
      { stage: 0, at: new Date(Date.now() - 172800000).toISOString() },
      { stage: 1, at: new Date(Date.now() - 120000000).toISOString() },
      { stage: 2, at: new Date(Date.now() - 72800000).toISOString() }
    ]
  },
  {
    id: 'FMS-107',
    cat: 'garbage',
    desc: 'Overflowing bins near the vegetable market.',
    area: 'Mylapore',
    lat: 13.0368,
    lng: 80.2676,
    stage: 4,
    by: 'Priya Raman',
    team: 'Sanitation Wing',
    notes: [],
    proof: true,
    rating: null,
    history: [
      { stage: 0, at: new Date(Date.now() - 691200000).toISOString() },
      { stage: 1, at: new Date(Date.now() - 591200000).toISOString() },
      { stage: 2, at: new Date(Date.now() - 491200000).toISOString() },
      { stage: 3, at: new Date(Date.now() - 391200000).toISOString() },
      { stage: 4, at: new Date(Date.now() - 191200000).toISOString() }
    ]
  },
  {
    id: 'FMS-108',
    cat: 'leakage',
    desc: 'Sewage overflowing into the lane.',
    area: 'Perambur',
    lat: 13.1167,
    lng: 80.2333,
    stage: 0,
    by: 'Divya R',
    team: 'Metro Water',
    notes: [],
    proof: false,
    rating: null,
    history: [{ stage: 0, at: new Date(Date.now() - 604800000).toISOString() }]
  },
  {
    id: 'FMS-109',
    cat: 'pothole',
    desc: 'Broken tar patch where the highway merges.',
    area: 'Tambaram',
    lat: 12.9249,
    lng: 80.1,
    stage: 3,
    by: 'Priya Raman',
    team: 'Zone 4 Roads',
    notes: [],
    proof: false,
    rating: null,
    history: [
      { stage: 0, at: new Date(Date.now() - 259200000).toISOString() },
      { stage: 1, at: new Date(Date.now() - 200000000).toISOString() },
      { stage: 2, at: new Date(Date.now() - 150000000).toISOString() },
      { stage: 3, at: new Date(Date.now() - 50000000).toISOString() }
    ]
  },
  {
    id: 'FMS-110',
    cat: 'light',
    desc: 'Dark stretch outside the school gate.',
    area: 'Velachery',
    lat: 12.979,
    lng: 80.221,
    stage: 5,
    by: 'Priya Raman',
    team: 'Lighting Cell',
    notes: [],
    proof: true,
    rating: 4,
    history: [
      { stage: 0, at: new Date(Date.now() - 864000000).toISOString() },
      { stage: 1, at: new Date(Date.now() - 764000000).toISOString() },
      { stage: 2, at: new Date(Date.now() - 664000000).toISOString() },
      { stage: 3, at: new Date(Date.now() - 564000000).toISOString() },
      { stage: 4, at: new Date(Date.now() - 364000000).toISOString() },
      { stage: 5, at: new Date(Date.now() - 164000000).toISOString() }
    ]
  }
];

function readComplaints() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED, null, 2), 'utf-8');
      return INITIAL_SEED;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading complaints DB:', err);
    return INITIAL_SEED;
  }
}

function writeComplaints(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving complaints DB:', err);
    return false;
  }
}

function readFeedback() {
  try {
    if (!fs.existsSync(FEEDBACK_FILE)) return [];
    return JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeFeedback(item) {
  try {
    const list = readFeedback();
    list.unshift(item);
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost:8080'}`);
  const pathname = url.pathname;

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    // GET /api/complaints
    if (req.method === 'GET' && (pathname === '/api/complaints' || pathname === '/api/complaints/')) {
      const data = readComplaints();
      res.writeHead(200);
      res.end(JSON.stringify(data));
      return;
    }

    // POST /api/complaints (Create new complaint)
    if (req.method === 'POST' && pathname === '/api/complaints') {
      const body = await parseBody(req);
      const complaints = readComplaints();
      
      const maxId = complaints.reduce((m, x) => Math.max(m, Number(String(x.id).split('-')[1]) || 100), 100);
      const id = body.id || `FMS-${maxId + 1}`;
      
      const newComplaint = {
        id,
        cat: body.cat || 'other',
        categoryLabel: body.categoryLabel || 'General Issue',
        desc: body.desc || '',
        otherDetails: body.otherDetails || '',
        area: body.area || 'Chennai',
        lat: body.lat || 13.0418,
        lng: body.lng || 80.2341,
        stage: body.stage != null ? body.stage : 2,
        by: body.by || 'Citizen',
        team: body.team || 'Zone 4 Roads',
        notes: body.notes || [{ t: `Auto-routed to ${body.team || 'Zone 4 Roads'}.`, at: new Date().toISOString() }],
        proof: Boolean(body.proof),
        rating: body.rating || null,
        history: body.history || [
          { stage: 0, at: new Date().toISOString() },
          { stage: 1, at: new Date().toISOString() },
          { stage: 2, at: new Date().toISOString() }
        ]
      };

      complaints.unshift(newComplaint);
      writeComplaints(complaints);

      res.writeHead(201);
      res.end(JSON.stringify(newComplaint));
      return;
    }

    // PUT /api/complaints/:id/stage (Update stage, notes, rating, proof)
    if (req.method === 'PUT' && pathname.startsWith('/api/complaints/') && pathname.endsWith('/stage')) {
      const parts = pathname.split('/');
      const id = decodeURIComponent(parts[3]);
      const body = await parseBody(req);
      const complaints = readComplaints();
      const index = complaints.findIndex((c) => c.id === id);

      if (index === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Complaint not found' }));
        return;
      }

      const item = complaints[index];
      const newStage = body.stage != null ? body.stage : item.stage;
      const updatedItem = {
        ...item,
        ...body,
        stage: newStage,
        history: [...(item.history || []), { stage: newStage, at: new Date().toISOString() }]
      };

      complaints[index] = updatedItem;
      writeComplaints(complaints);

      res.writeHead(200);
      res.end(JSON.stringify(updatedItem));
      return;
    }

    // POST /api/complaints/:id/notes (Add internal note)
    if (req.method === 'POST' && pathname.startsWith('/api/complaints/') && pathname.endsWith('/notes')) {
      const parts = pathname.split('/');
      const id = decodeURIComponent(parts[3]);
      const body = await parseBody(req);
      const complaints = readComplaints();
      const index = complaints.findIndex((c) => c.id === id);

      if (index === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Complaint not found' }));
        return;
      }

      const item = complaints[index];
      const noteEntry = { t: body.t || body.note || '', at: new Date().toISOString() };
      item.notes = [...(item.notes || []), noteEntry];
      writeComplaints(complaints);

      res.writeHead(200);
      res.end(JSON.stringify(item));
      return;
    }

    // POST /api/feedback
    if (req.method === 'POST' && pathname === '/api/feedback') {
      const body = await parseBody(req);
      writeFeedback({ ...body, at: new Date().toISOString() });
      res.writeHead(200);
      res.end(JSON.stringify({ ok: true, message: 'Feedback received' }));
      return;
    }

    // 404 fallback
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🏛️  FixMyStreet Database REST API Server Active!`);
  console.log(`🚀 Port: http://localhost:${PORT}/api`);
  console.log(`📦 Database: ${DB_FILE}`);
  console.log(`✓ Real REST API: GET, POST, PUT complaints ready!`);
  console.log(`===================================================`);
});
