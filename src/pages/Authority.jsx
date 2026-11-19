import { useState, useMemo } from 'react';
import {
  FaHardHat,
  FaTools,
  FaCheckCircle,
  FaClock,
  FaCamera,
  FaBuilding,
  FaClipboardList,
  FaMapMarkerAlt,
  FaUser,
  FaStar,
  FaImage,
  FaExclamationCircle
} from 'react-icons/fa';
import { CATS, TEAMS, days, stamp } from '../data';
import { Plate, Chip, Tracker } from '../ui';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import AdminSubNav from '../components/AdminSubNav';

export default function Authority({ user, items, move, say, go }) {
  const [team, setTeam] = useState(user?.team || TEAMS[0]);
  const [selId, setSelId] = useState(null);
  const [note, setNote] = useState('');
  const [proof, setProof] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState('all');

  // Filter complaints assigned to this department team
  const list = useMemo(() => {
    return items
      .filter((c) => c.team === team && c.stage >= 2)
      .sort((a, b) => a.stage - b.stage);
  }, [items, team]);

  // Derived KPI Stats for this Department
  const totalAssigned = list.length;
  const newAssigned = list.filter((c) => c.stage === 2).length;
  const inProgress = list.filter((c) => c.stage === 3).length;
  const resolved = list.filter((c) => c.stage >= 4).length;

  // Filtered complaints
  const filteredList = useMemo(() => {
    if (filter === 'new') return list.filter((c) => c.stage === 2);
    if (filter === 'progress') return list.filter((c) => c.stage === 3);
    if (filter === 'resolved') return list.filter((c) => c.stage >= 4);
    return list;
  }, [list, filter]);

  // Selected complaint
  const c = filteredList.find((x) => x.id === selId) || filteredList[0] || list[0];

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErr('Photo must be smaller than 5 MB.');
      return;
    }
    setErr('');
    setProof(file);
    if (proofPreview) URL.revokeObjectURL(proofPreview);
    setProofPreview(URL.createObjectURL(file));
  };

  const withNote = () =>
    note.trim()
      ? { notes: [...(c.notes || []), { t: note.trim(), at: new Date().toISOString() }] }
      : {};

  const start = () => {
    if (!c) return;
    move(c.id, 3, withNote(), `Work started on ${c.id} by ${team}`);
    setNote('');
  };

  const resolve = () => {
    if (!c) return;
    if (!proof && !proofPreview) {
      setErr('Please capture or select an after-work photo as resolution proof.');
      return;
    }
    const proofUrl = proofPreview || (proof ? URL.createObjectURL(proof) : null);
    move(
      c.id,
      4,
      { ...withNote(), proof: true, proofImg: proofUrl },
      `Complaint ${c.id} marked as resolved with photo proof`
    );
    setNote('');
    setProof(null);
    setProofPreview(null);
    setErr('');
  };

  return (
    <div className="authority-dashboard">
      <AdminSubNav active="authority" go={go} />
      {/* Authority Department Header */}
      <section className="dash-hero auth-hero">
        <div className="dash-hero-content">
          <div className="row between">
            <span className="role-tag auth-tag">
              <FaHardHat /> AUTHORITY MODULE · FIELD OPERATIONS DESK
            </span>
            <div className="team-select-box">
              <FaBuilding className="text-blue" />
              <label>
                Department:
                <select
                  value={team}
                  onChange={(e) => {
                    setTeam(e.target.value);
                    setSelId(null);
                    setProof(null);
                    setProofPreview(null);
                    setErr('');
                  }}
                  className="team-dropdown"
                >
                  {TEAMS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <h2>{team} — Work Order & Resolution Portal</h2>
          <p className="lead">
            Manage assigned civic work orders, record field progress logs, and upload mandatory resolution proof before sign-off.
          </p>
        </div>
      </section>

      {/* KPI Stats Bar */}
      <section className="metrics-grid" aria-label="Department Field Statistics">
        <div className="metric-card">
          <div className="metric-icon bg-blue-subtle">
            <FaClipboardList />
          </div>
          <div>
            <div className="metric-val">{totalAssigned}</div>
            <div className="metric-lbl">Total Work Orders</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-amber-subtle">
            <FaClock />
          </div>
          <div>
            <div className="metric-val">{newAssigned}</div>
            <div className="metric-lbl">New Assignments</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-blue-subtle">
            <FaTools />
          </div>
          <div>
            <div className="metric-val">{inProgress}</div>
            <div className="metric-lbl">Work in Progress</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-green-subtle">
            <FaCheckCircle />
          </div>
          <div>
            <div className="metric-val text-green">{resolved}</div>
            <div className="metric-lbl">Resolved & Closed</div>
          </div>
        </div>
      </section>

      {/* Main Workspace Layout */}
      {list.length === 0 ? (
        <div className="card empty text-center p-3">
          <FaClipboardList className="empty-icon" />
          <h3>No complaints currently assigned to {team}</h3>
          <p className="mute">
            When the Municipal Admin Desk assigns issues for this department, they will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="split authority-split">
          {/* Left Column: Assigned Complaints List */}
          <section className="work-order-list card" aria-label="Assigned complaints">
            <div className="row between head-wrap">
              <h4>Assigned Work Orders</h4>
              <div className="chips">
                <button
                  className={`pick ${filter === 'all' ? 'on' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All ({totalAssigned})
                </button>
                <button
                  className={`pick ${filter === 'new' ? 'on' : ''}`}
                  onClick={() => setFilter('new')}
                >
                  New ({newAssigned})
                </button>
                <button
                  className={`pick ${filter === 'progress' ? 'on' : ''}`}
                  onClick={() => setFilter('progress')}
                >
                  In Progress ({inProgress})
                </button>
                <button
                  className={`pick ${filter === 'resolved' ? 'on' : ''}`}
                  onClick={() => setFilter('resolved')}
                >
                  Resolved ({resolved})
                </button>
              </div>
            </div>

            <div className="work-order-items">
              {filteredList.map((x) => (
                <button
                  key={x.id}
                  className={`item work-item-btn ${c && c.id === x.id ? 'on' : ''}`}
                  onClick={() => {
                    setSelId(x.id);
                    setProof(null);
                    setProofPreview(null);
                    setErr('');
                  }}
                >
                  <div className="row between w-100">
                    <Plate id={x.id} />
                    <Chip tone={x.stage >= 4 ? 'green' : x.stage === 3 ? 'blue' : 'amber'}>
                      {['', '', 'New Assigned', 'In Progress', 'Resolved', 'Closed'][x.stage]}
                    </Chip>
                  </div>
                  <span className="work-item-desc">{x.desc}</span>
                  <small className="mute">
                    {x.area} · {days(x)}
                  </small>
                </button>
              ))}
            </div>
          </section>

          {/* Right Column: Active Complaint Detail & Execution Workspace */}
          {c && (
            <article className="panel card auth-detail-panel">
              <div className="row between detail-head">
                <div className="row">
                  <Plate id={c.id} />
                  <span className="cat-pill">{CATS[c.cat]?.label}</span>
                </div>
                <Chip tone={c.stage >= 4 ? 'green' : c.stage === 3 ? 'blue' : 'amber'}>
                  {['', '', 'Step 1: Start Work', 'Step 2: Execution & Proof', 'Completed', 'Closed'][c.stage]}
                </Chip>
              </div>

              <h3 className="detail-title">{c.desc}</h3>

              <div className="meta-box">
                <p className="mute small">
                  <FaMapMarkerAlt /> <b>Location:</b> {c.area} ({c.lat.toFixed(4)}, {c.lng.toFixed(4)})
                </p>
                <p className="mute small">
                  <FaUser /> <b>Reported By:</b> {c.by} · {days(c)}
                </p>
              </div>

              {/* Progress Milestones Tracker */}
              <div className="tracker-box">
                <Tracker c={c} />
              </div>

              {/* Field Notes History */}
              {c.notes && c.notes.length > 0 && (
                <div className="field-notes-history">
                  <b>Field Progress Log:</b>
                  {c.notes.map((n, i) => (
                    <div key={i} className="note field-note-item">
                      <span>{n.t || n.note}</span>
                      <small className="mute d-block">{stamp(n.at)}</small>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Form: Stage 2 (New -> Start Work) */}
              {c.stage === 2 && (
                <div className="auth-action-box bg-blue-subtle">
                  <h4>
                    <FaTools /> Action Required: Initiate Work
                  </h4>
                  <p className="small mute">
                    Acknowledge this work order and update the citizen that field crews have begun addressing the issue.
                  </p>
                  <label className="field">
                    <span>Field Log / Remarks (optional)</span>
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g. Crew dispatched with road leveller machine"
                    />
                  </label>
                  <button className="solid big" onClick={start}>
                    <FaTools /> Start Field Work
                  </button>
                </div>
              )}

              {/* Action Form: Stage 3 (In Progress -> Upload Proof & Resolve) */}
              {c.stage === 3 && (
                <div className="auth-action-box bg-amber-subtle">
                  <h4>
                    <FaCamera /> Action Required: Upload Resolution Proof
                  </h4>
                  <p className="small mute">
                    FixMyStreet requires visual proof of resolution before a complaint can be closed.
                  </p>

                  <label className="field">
                    <span>Completion Note (optional)</span>
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g. Tarred and levelled surface. Debris cleared."
                    />
                  </label>

                  <label className="field photo-upload-field">
                    <span>After-Work Photo Proof (Mandatory)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                    />
                    {err && <span className="err">{err}</span>}
                  </label>

                  {/* Immediate Photo Preview */}
                  {proofPreview && (
                    <div className="proof-preview-box">
                      <p className="small"><b>Selected After-Work Proof Preview:</b></p>
                      <img
                        src={proofPreview}
                        alt="Resolution proof preview"
                        className="proof-thumb"
                      />
                    </div>
                  )}

                  <button className="solid big green-btn" onClick={resolve}>
                    <FaCheckCircle /> Mark as Resolved & Submit Proof
                  </button>
                </div>
              )}

              {/* Stage >= 4: Resolved View with Proof & Citizen Rating */}
              {c.stage >= 4 && (
                <div className="resolved-summary-box">
                  <div className="row">
                    <FaCheckCircle className="text-green text-xl" />
                    <div>
                      <b>This issue was resolved by {team}.</b>
                      <p className="small mute">
                        {c.stage === 4
                          ? 'Awaiting citizen review and final rating.'
                          : `Citizen confirmed and closed this complaint with a ${c.rating || 5}★ rating.`}
                      </p>
                    </div>
                  </div>

                  {c.proofImg && (
                    <div className="proof-display-container mt-2">
                      <p className="small"><b>Resolution Proof Photo:</b></p>
                      <img
                        className="thumb resolution-proof-img"
                        src={c.proofImg}
                        alt="Resolution proof"
                      />
                    </div>
                  )}

                  {/* Before & After Interactive Showcase */}
                  <div className="mt-3">
                    <b>Before vs After Repair Comparison:</b>
                    <div className="before-after-embed mt-1">
                      <BeforeAfterSlider />
                    </div>
                  </div>
                </div>
              )}
            </article>
          )}
        </div>
      )}
    </div>
  );
}
