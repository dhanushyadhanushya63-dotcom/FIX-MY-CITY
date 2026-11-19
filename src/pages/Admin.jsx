import { useMemo, useState } from 'react';
import {
  FaUserShield,
  FaExclamationTriangle,
  FaClone,
  FaMapMarkedAlt,
  FaSortAmountUp,
  FaHourglassHalf,
  FaCheckCircle,
  FaFilter,
  FaTools,
  FaArrowRight,
  FaTimes,
  FaCheck,
  FaEye
} from 'react-icons/fa';
import Map from '../Map';
import { CATS, TEAMS, score, level, overdue, dupes, days, stamp } from '../data';
import { Plate, Chip } from '../ui';
import AdminSubNav from '../components/AdminSubNav';

const FILTERS = [
  ['open', 'Open Complaints'],
  ['review', 'Needs Validation'],
  ['overdue', 'Overdue SLA Alerts'],
  ['dup', 'Potential Duplicates'],
  ['done', 'Resolved & Closed']
];

const LV = { High: 'red', Medium: 'amber', Low: 'blue' };

export default function Admin({ items, move, currentUser, say, go }) {
  const [f, setF] = useState('open');
  const [sel, setSel] = useState(null);
  const [team, setTeam] = useState({});
  const [reviewed, setReviewed] = useState({});
  const [reviewFilter, setReviewFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [detailModal, setDetailModal] = useState(null);

  // Compute calculated values for all complaints
  const rows = useMemo(() => {
    return items.map((c) => {
      const s = score(c, items);
      const lv = level(s);
      const od = overdue(c);
      const dup = dupes(c, items);
      return {
        ...c,
        s,
        lv,
        od,
        dup,
        tone: c.stage >= 4 ? 'green' : LV[lv]
      };
    }).sort((a, b) => (a.stage >= 4) - (b.stage >= 4) || b.s - a.s);
  }, [items]);

  // Overdue count and open items
  const open = useMemo(() => rows.filter((c) => c.stage < 4), [rows]);
  const overdueItems = useMemo(() => open.filter((c) => c.od), [open]);
  const highPriorityItems = useMemo(() => open.filter((c) => c.lv === 'High'), [open]);
  const resolvedItems = useMemo(() => rows.filter((c) => c.stage >= 4), [rows]);

  // Hotspot analysis
  const areaCounts = useMemo(() => {
    const counts = {};
    open.forEach((c) => {
      counts[c.area] = (counts[c.area] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [open]);

  // Duplicate / Validation Candidates
  const flagged = useMemo(() => {
    return rows.map((c) => {
      const reasons = [];
      if (c.dup.length) reasons.push(`Duplicate match: identical issue within 60m (${c.dup.map((d) => d.id).join(', ')})`);
      if (!c.desc || c.desc.trim().length < 18) reasons.push('Description has limited detail');
      if (!c.area || /pinned location/i.test(c.area)) reasons.push('Location address unverified');
      if (!c.photo) reasons.push('No photo attachment');
      
      const risk = Math.min(
        95,
        c.dup.length * 40 +
        (!c.desc || c.desc.trim().length < 18 ? 20 : 0) +
        (!c.area || /pinned location/i.test(c.area) ? 15 : 0) +
        (!c.photo ? 15 : 0)
      );

      return {
        ...c,
        reasons,
        risk
      };
    }).filter((c) => (c.risk >= 35 || c.dup.length > 0) && !reviewed[c.id]);
  }, [rows, reviewed]);

  const reviewRows = flagged.filter(
    (c) => reviewFilter === 'all' || (reviewFilter === 'high' ? c.risk >= 60 : c.risk < 60)
  );

  // Filtered queue
  const show = useMemo(() => {
    return rows.filter((c) => {
      const matchesCategory = categoryFilter === 'all' || c.cat === categoryFilter;
      const matchesFilter = {
        open: c.stage < 4,
        review: c.stage <= 1,
        overdue: c.od,
        dup: c.dup.length > 0 && c.stage < 2,
        done: c.stage >= 4
      }[f];
      return matchesCategory && matchesFilter;
    });
  }, [rows, f, categoryFilter]);

  const focus = rows.find((c) => c.id === sel);

  // Assign team
  const assign = (c) => {
    const t = team[c.id] || CATS[c.cat]?.team || TEAMS[0];
    if (c.stage === 0) move(c.id, 1);
    move(c.id, 2, { team: t }, `Complaint ${c.id} successfully assigned to ${t}`);
  };

  const markVerified = (id) => {
    setReviewed((x) => ({ ...x, [id]: 'verified' }));
    if (say) say(`Complaint ${id} verified by Admin`);
  };

  const markDuplicate = (id) => {
    setReviewed((x) => ({ ...x, [id]: 'duplicate' }));
    move(id, 1, { notes: [{ t: 'Flagged as duplicate report by Admin', at: new Date().toISOString() }] }, `Complaint ${id} flagged as duplicate`);
  };

  return (
    <div className="admin-dashboard">
      <AdminSubNav active="admin" go={go} />
      {/* Admin Command Header Banner */}
      <section className="dash-hero admin-hero">
        <div className="dash-hero-content">
          <div className="row between">
            <span className="role-tag admin-tag">
              <FaUserShield /> ADMIN MODULE · MUNICIPAL COMMAND CENTER
            </span>
            <span className="user-id-chip">
              Admin: {currentUser?.name || 'Chief Municipal Officer'}
            </span>
          </div>
          <h2>Municipal Issue Resolution & Assignment Desk</h2>
          <p className="lead">
            Review incoming complaints, identify duplicate reports with spatial matching, monitor geographic hotspots and assign field teams.
          </p>
        </div>
      </section>

      {/* High-Level Analytics KPI Tiles */}
      <section className="metrics-grid" aria-label="Municipal Operational Metrics">
        <div className="metric-card">
          <div className="metric-icon bg-blue-subtle">
            <FaFilter />
          </div>
          <div>
            <div className="metric-val">{open.length}</div>
            <div className="metric-lbl">Total Open Issues</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-amber-subtle">
            <FaHourglassHalf />
          </div>
          <div>
            <div className="metric-val">{rows.filter((c) => c.stage <= 1).length}</div>
            <div className="metric-lbl">Awaiting Review</div>
          </div>
        </div>

        <div className="metric-card alert-metric">
          <div className="metric-icon bg-red-subtle">
            <FaExclamationTriangle />
          </div>
          <div>
            <div className="metric-val text-red">{overdueItems.length}</div>
            <div className="metric-lbl">Overdue SLA Alerts</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-red-subtle">
            <FaSortAmountUp />
          </div>
          <div>
            <div className="metric-val">{highPriorityItems.length}</div>
            <div className="metric-lbl">High Priority</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-green-subtle">
            <FaCheckCircle />
          </div>
          <div>
            <div className="metric-val text-green">{resolvedItems.length}</div>
            <div className="metric-lbl">Resolved Issues</div>
          </div>
        </div>
      </section>

      {/* OVERDUE COMPLAINT ALERTS SECTION (Special Feature) */}
      {overdueItems.length > 0 && (
        <section className="overdue-alert-panel">
          <div className="row between">
            <div className="row">
              <span className="pulse-alert-icon">⚠️</span>
              <div>
                <h3 className="text-red">Critical SLA Escalations ({overdueItems.length} Overdue)</h3>
                <p className="mute small">
                  The following complaints have remained unresolved beyond the 5-day Municipal Service Level Agreement (SLA).
                </p>
              </div>
            </div>
            <button
              className="solid red-btn"
              onClick={() => {
                setF('overdue');
                window.scrollTo({ top: 800, behavior: 'smooth' });
              }}
            >
              Filter Overdue Queue
            </button>
          </div>

          <div className="overdue-cards-row">
            {overdueItems.slice(0, 3).map((item) => (
              <div key={item.id} className="overdue-summary-pill" onClick={() => setSel(item.id)}>
                <Plate id={item.id} />
                <b>{CATS[item.cat]?.label}</b>
                <span className="mute">{item.area}</span>
                <span className="badge-days text-red">{days(item)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SPECIAL FEATURE 1: DUPLICATE DETECTION & SMART VALIDATION */}
      <section className="fraud-panel card">
        <div className="row between head-wrap">
          <div>
            <div className="row">
              <FaClone className="text-blue" />
              <span className="eyebrow">SPECIAL FEATURE: AI-ASSISTED VALIDATION</span>
            </div>
            <h3>Smart Duplicate Detection & Validation Desk</h3>
            <p className="mute small">
              Identifies overlapping complaints filed within 60 metres to eliminate duplicate field dispatches.
            </p>
          </div>
          <span className="risk-count">
            {flagged.length} Pending Review
          </span>
        </div>

        <div className="chips">
          <button
            className={`pick ${reviewFilter === 'all' ? 'on' : ''}`}
            onClick={() => setReviewFilter('all')}
          >
            All Flagged ({flagged.length})
          </button>
          <button
            className={`pick ${reviewFilter === 'high' ? 'on' : ''}`}
            onClick={() => setReviewFilter('high')}
          >
            High Probability Duplicates
          </button>
        </div>

        {reviewRows.length === 0 ? (
          <p className="empty text-center">
            <FaCheckCircle className="text-green mr-1" />
            No active duplicate flags or validation conflicts detected in the system.
          </p>
        ) : (
          <div className="fraud-grid">
            {reviewRows.map((c) => (
              <article className="fraud-card" key={c.id}>
                <div className="row between">
                  <Plate id={c.id} />
                  <Chip tone={c.dup.length > 0 ? 'red' : 'amber'}>
                    {c.dup.length > 0 ? 'Duplicate Alert' : 'Needs Check'} · {c.risk}%
                  </Chip>
                </div>

                <p className="mt-1">
                  <b>{c.desc}</b>
                </p>
                <p className="small mute">
                  {c.area} · {CATS[c.cat]?.label} · Reported by {c.by}
                </p>

                <ul className="flag-reasons-list">
                  {c.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>

                <div className="row validation-actions">
                  <button
                    className="solid sm-btn"
                    onClick={() => markVerified(c.id)}
                  >
                    <FaCheck /> Verify Legitimate
                  </button>
                  <button
                    className="ghost sm-btn red-ghost"
                    onClick={() => markDuplicate(c.id)}
                  >
                    <FaClone /> Mark Duplicate
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* SPECIAL FEATURE 2: HOTSPOT MONITORING MAP & ASSIGNMENT WORKSPACE */}
      <div className="split admin">
        {/* Left Column: Interactive GIS Hotspot Map */}
        <div className="sticky">
          <div className="card map-wrapper-card">
            <div className="row between map-head">
              <div className="row">
                <FaMapMarkedAlt className="text-blue" />
                <h4>Hotspot Monitoring GIS Map</h4>
              </div>
              <span className="small mute">Chennai Wards</span>
            </div>

            <Map
              items={rows}
              focus={focus}
              selected={sel}
              onSelect={setSel}
              height={460}
              label="Complaint hotspots"
            />

            <div className="map-footer-stats">
              <p className="legend">
                <i className="d red" /> High Priority
                <i className="d amber" /> Medium Priority
                <i className="d blue" /> Low Priority
                <i className="d green" /> Resolved
              </p>

              {/* Area Hotspot Ranking */}
              <div className="hotspot-clusters">
                <b>Top Hotspots:</b>
                <div className="cluster-tags">
                  {areaCounts.slice(0, 4).map(([area, count]) => (
                    <span key={area} className="hotspot-tag">
                      {area}: <b>{count} open</b>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Complaint Management Queue */}
        <section className="complaint-queue-column" aria-label="Complaint queue">
          <div className="card filter-bar-card">
            <div className="row between">
              <h4>Complaint Management Queue</h4>
              <div className="row">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="cat-select"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(CATS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="chips">
              {FILTERS.map(([k, l]) => (
                <button
                  key={k}
                  className={`pick ${f === k ? 'on' : ''}`}
                  onClick={() => setF(k)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {show.length === 0 ? (
            <p className="empty text-center">No complaints match this filter.</p>
          ) : (
            <div className="admin-queue-list">
              {show.map((c) => (
                <article
                  key={c.id}
                  className={`card admin-complaint-card ${sel === c.id ? 'sel' : ''}`}
                  onClick={() => setSel(c.id)}
                >
                  <div className="row between">
                    <Plate id={c.id} />
                    <div className="row">
                      {c.od && <Chip tone="red">Overdue SLA</Chip>}
                      {c.stage < 4 && <Chip tone={LV[c.lv]}>{c.lv} Priority (Score {c.s})</Chip>}
                      {c.stage >= 4 && <Chip tone="green">Resolved</Chip>}
                    </div>
                  </div>

                  <p className="admin-desc">
                    <b>{c.desc}</b>
                  </p>

                  <p className="mute small">
                    {CATS[c.cat]?.label} · {c.area} · Reported {days(c)} by {c.by}
                  </p>

                  {c.dup.length > 0 && c.stage < 2 && (
                    <p className="note duplicate-warning-box">
                      <FaClone /> <b>Potential Duplicate:</b> Similar to{' '}
                      {c.dup.map((d) => d.id).join(', ')}. Review before dispatching teams.
                    </p>
                  )}

                  {/* Team Assignment Controls */}
                  <div className="assignment-control-bar">
                    {c.stage < 2 ? (
                      <div className="row assign-form-row">
                        <select
                          aria-label={`Assign team for ${c.id}`}
                          value={team[c.id] || CATS[c.cat]?.team || TEAMS[0]}
                          onChange={(e) =>
                            setTeam({ ...team, [c.id]: e.target.value })
                          }
                          onClick={(e) => e.stopPropagation()}
                        >
                          {TEAMS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <button
                          className="solid"
                          onClick={(e) => {
                            e.stopPropagation();
                            assign(c);
                          }}
                        >
                          <FaTools /> Assign Team
                        </button>
                      </div>
                    ) : (
                      <div className="row between assignment-status">
                        <span className="small">
                          Status: <b>{['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'][c.stage]}</b> · Team: <b>{c.team}</b>
                        </span>
                        <button
                          className="ghost sm-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailModal(c);
                          }}
                        >
                          <FaEye /> Full Details
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <div className="modal-backdrop" onClick={() => setDetailModal(null)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Complaint Details & Timeline — {detailModal.id}</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setDetailModal(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <table className="receipt-table">
                <tbody>
                  <tr>
                    <th>ID:</th>
                    <td>{detailModal.id}</td>
                  </tr>
                  <tr>
                    <th>Category:</th>
                    <td>{CATS[detailModal.cat]?.label}</td>
                  </tr>
                  <tr>
                    <th>Description:</th>
                    <td>{detailModal.desc}</td>
                  </tr>
                  <tr>
                    <th>Location:</th>
                    <td>{detailModal.area} ({detailModal.lat?.toFixed(4)}, {detailModal.lng?.toFixed(4)})</td>
                  </tr>
                  <tr>
                    <th>Reported By:</th>
                    <td>{detailModal.by}</td>
                  </tr>
                  <tr>
                    <th>Assigned Team:</th>
                    <td>{detailModal.team || 'Not assigned yet'}</td>
                  </tr>
                  <tr>
                    <th>Priority Score:</th>
                    <td>{detailModal.s} ({detailModal.lv} Priority)</td>
                  </tr>
                  <tr>
                    <th>Field Notes:</th>
                    <td>
                      {detailModal.notes?.length > 0 ? (
                        <ul>
                          {detailModal.notes.map((n, i) => (
                            <li key={i}>{n.t || n.note}</li>
                          ))}
                        </ul>
                      ) : (
                        'No field notes added yet.'
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              {detailModal.proofImg && (
                <div className="mt-2">
                  <b>Resolution Proof Photo:</b>
                  <img src={detailModal.proofImg} alt="Resolution proof" className="proof-thumb" />
                </div>
              )}
            </div>
            <div className="modal-foot">
              <button className="solid" onClick={() => setDetailModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
