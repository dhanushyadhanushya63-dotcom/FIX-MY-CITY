import { useState, useMemo } from 'react';
import {
  FaUser,
  FaBullhorn,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaTools,
  FaStar,
  FaExclamationTriangle,
  FaFileAlt,
  FaMapMarkerAlt,
  FaCamera,
  FaArrowRight,
  FaRegSmile,
  FaCheck
} from 'react-icons/fa';
import { CATS, STAGES, stamp, days } from '../data';
import { Plate, Chip, Status } from '../ui';
import AdminSubNav from '../components/AdminSubNav';

export default function CitizenDashboard({ currentUser, items, go, move, say }) {
  const citizenName = currentUser?.name || 'Priya Raman';
  const [filter, setFilter] = useState('all');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [ratingInput, setRatingInput] = useState({});

  // Filter complaints filed by this citizen (or fall back to seed complaints for demo preview)
  const myComplaints = useMemo(() => {
    const list = items.filter(
      (c) => (c.by || '').toLowerCase() === citizenName.toLowerCase()
    );
    // If user has no complaints yet, also show Priya Raman's complaints or all user complaints for instant rich preview
    return list.length > 0 ? list : items.filter((c) => c.by === 'Priya Raman');
  }, [items, citizenName]);

  // Derived KPI Stats
  const totalReported = myComplaints.length;
  const inProgress = myComplaints.filter((c) => c.stage >= 1 && c.stage < 4).length;
  const resolved = myComplaints.filter((c) => c.stage >= 4).length;
  const pending = myComplaints.filter((c) => c.stage === 0).length;

  // Filtered list
  const filteredList = useMemo(() => {
    if (filter === 'active') return myComplaints.filter((c) => c.stage < 4);
    if (filter === 'resolved') return myComplaints.filter((c) => c.stage >= 4);
    return myComplaints;
  }, [myComplaints, filter]);

  const handleRatingSubmit = (complaintId, stars) => {
    move(complaintId, 5, { rating: stars }, `Thank you for rating complaint ${complaintId} with ${stars} stars!`);
    setRatingInput((prev) => ({ ...prev, [complaintId]: stars }));
  };

  return (
    <div className="citizen-dashboard">
      <AdminSubNav active="citizen" go={go} />
      {/* Citizen Welcome Profile Banner */}
      <section className="dash-hero citizen-hero">
        <div className="dash-hero-content">
          <div className="row between">
            <div className="user-badge-row">
              <span className="role-tag citizen-tag">
                <FaUser /> CITIZEN MODULE
              </span>
              <span className="user-id-chip">
                ID: {currentUser?.id || 'CIT-2026-44'}
              </span>
            </div>
            <span className="civic-score-badge" title="Points earned for verified community reports">
              <FaStar className="star-icon" /> 150 Civic Karma Points
            </span>
          </div>

          <h2>Welcome, {citizenName}!</h2>
          <p className="lead">
            Manage your reported civic complaints, monitor repair milestones in real-time, and confirm resolution proofs.
          </p>

          <div className="dash-cta-row">
            <button className="solid big pulse-btn" onClick={() => go('register')}>
              <FaBullhorn /> Report New Issue
            </button>
            <button className="ghost big" onClick={() => go('track')}>
              <FaSearch /> Track by Complaint ID
            </button>
          </div>
        </div>
      </section>

      {/* KPI Stats Bar */}
      <section className="metrics-grid" aria-label="Citizen Complaint Statistics">
        <div className="metric-card">
          <div className="metric-icon bg-blue-subtle">
            <FaBullhorn />
          </div>
          <div>
            <div className="metric-val">{totalReported}</div>
            <div className="metric-lbl">Total Reported</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-amber-subtle">
            <FaClock />
          </div>
          <div>
            <div className="metric-val">{inProgress + pending}</div>
            <div className="metric-lbl">In Review / Progress</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-green-subtle">
            <FaCheckCircle />
          </div>
          <div>
            <div className="metric-val">{resolved}</div>
            <div className="metric-lbl">Resolved Issues</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-sky-subtle">
            <FaRegSmile />
          </div>
          <div>
            <div className="metric-val">
              {totalReported > 0 ? Math.round((resolved / totalReported) * 100) : 100}%
            </div>
            <div className="metric-lbl">Resolution Rate</div>
          </div>
        </div>
      </section>

      {/* Main Section: My Complaints Table / Cards */}
      <section className="card my-complaints-section">
        <div className="row between head-wrap">
          <div>
            <h3>My Reported Complaints</h3>
            <p className="mute small">
              Live status from Municipal Authority teams for issues filed by {citizenName}.
            </p>
          </div>

          <div className="chips">
            <button
              className={`pick ${filter === 'all' ? 'on' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Complaints ({myComplaints.length})
            </button>
            <button
              className={`pick ${filter === 'active' ? 'on' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active / Pending ({totalReported - resolved})
            </button>
            <button
              className={`pick ${filter === 'resolved' ? 'on' : ''}`}
              onClick={() => setFilter('resolved')}
            >
              Resolved ({resolved})
            </button>
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="empty text-center">
            <FaBullhorn className="empty-icon" />
            <h4>No complaints match this filter</h4>
            <p className="mute">You have not reported any complaints in this category yet.</p>
            <button className="solid" onClick={() => go('register')}>
              Report a Complaint Now
            </button>
          </div>
        ) : (
          <div className="complaints-list-grid">
            {filteredList.map((c) => {
              const catInfo = CATS[c.cat] || { label: c.cat };
              const isResolved = c.stage >= 4;

              return (
                <article key={c.id} className="citizen-complaint-card">
                  <div className="card-top-bar">
                    <div className="row">
                      <Plate id={c.id} />
                      <span className="cat-pill">{catInfo.label}</span>
                    </div>
                    <Status c={c} />
                  </div>

                  <h4 className="complaint-title">{c.desc}</h4>

                  <div className="complaint-meta">
                    <span>
                      <FaMapMarkerAlt /> {c.area}
                    </span>
                    <span>
                      <FaClock /> Reported {days(c)}
                    </span>
                    {c.team && (
                      <span>
                        <FaTools /> {c.team}
                      </span>
                    )}
                  </div>

                  {/* Stage Progress Tracker Bar */}
                  <div className="progress-indicator">
                    <div className="progress-labels">
                      <span>Submitted</span>
                      <span>Under Review</span>
                      <span>Assigned</span>
                      <span>In Progress</span>
                      <span>Resolved</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${Math.min(100, Math.max(15, (c.stage / 4) * 100))}%`,
                          backgroundColor: isResolved ? '#16a34a' : '#0b4aa8'
                        }}
                      />
                    </div>
                  </div>

                  {/* Resolution Proof Notification */}
                  {isResolved && (
                    <div className="resolution-proof-banner">
                      <FaCheckCircle className="text-green" />
                      <div>
                        <b>Work Completed & Proof Attached</b>
                        <p className="small mute">
                          Authority has marked this issue resolved. You can inspect the repair work and rate the service.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="card-actions-bar">
                    <button
                      className="ghost"
                      onClick={() => go('track', c.id)}
                    >
                      <FaSearch /> Live Tracking
                    </button>

                    <button
                      className="ghost"
                      onClick={() => setSelectedReceipt(c)}
                    >
                      <FaFileAlt /> View Receipt
                    </button>

                    {/* Star Rating for Resolved Complaints */}
                    {isResolved && c.stage === 4 && (
                      <div className="rating-box">
                        <span className="small">Rate fix:</span>
                        <div className="star-rating-btns">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className={`star-btn ${
                                (c.rating || ratingInput[c.id]) >= star ? 'active' : ''
                              }`}
                              onClick={() => handleRatingSubmit(c.id, star)}
                              title={`Rate ${star} Stars`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {c.stage === 5 && (
                      <span className="closed-badge">
                        <FaCheck /> Closed with {c.rating || 5}★ Rating
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Citizen Receipt Modal */}
      {selectedReceipt && (
        <div className="modal-backdrop" onClick={() => setSelectedReceipt(null)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Digital Acknowledgment Receipt</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setSelectedReceipt(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body receipt-content">
              <div className="receipt-stamp-box">
                <Plate id={selectedReceipt.id} />
                <span className="receipt-status-tag">
                  {STAGES[selectedReceipt.stage]}
                </span>
              </div>
              <table className="receipt-table">
                <tbody>
                  <tr>
                    <th>Category:</th>
                    <td>{CATS[selectedReceipt.cat]?.label || selectedReceipt.cat}</td>
                  </tr>
                  <tr>
                    <th>Description:</th>
                    <td>{selectedReceipt.desc}</td>
                  </tr>
                  <tr>
                    <th>Location / Area:</th>
                    <td>{selectedReceipt.area}</td>
                  </tr>
                  <tr>
                    <th>GPS Coordinates:</th>
                    <td>
                      {selectedReceipt.lat?.toFixed(5)}, {selectedReceipt.lng?.toFixed(5)}
                    </td>
                  </tr>
                  <tr>
                    <th>Reported By:</th>
                    <td>{selectedReceipt.by}</td>
                  </tr>
                  <tr>
                    <th>Submission Time:</th>
                    <td>{stamp(selectedReceipt.history[0]?.at || new Date().toISOString())}</td>
                  </tr>
                  {selectedReceipt.team && (
                    <tr>
                      <th>Assigned Team:</th>
                      <td>{selectedReceipt.team}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {selectedReceipt.proofImg && (
                <div className="receipt-proof-preview">
                  <b>Resolution Proof Photo:</b>
                  <img
                    src={selectedReceipt.proofImg}
                    alt="Proof of work"
                    className="proof-thumb"
                  />
                </div>
              )}
            </div>
            <div className="modal-foot">
              <button className="ghost" onClick={() => setSelectedReceipt(null)}>
                Close
              </button>
              <button
                className="solid"
                onClick={() => {
                  setSelectedReceipt(null);
                  go('track', selectedReceipt.id);
                }}
              >
                Track Journey
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Community Info & Hotline Card */}
      <section className="civic-info-bar">
        <div className="info-item">
          <FaBullhorn className="info-ico" />
          <div>
            <b>Ward Community Hotline</b>
            <p className="small mute">Toll-free 1800-425-1913 for emergency pipeline bursts or road cave-ins.</p>
          </div>
        </div>
        <div className="info-item">
          <FaCheckCircle className="info-ico text-green" />
          <div>
            <b>Guaranteed 5-Day SLA</b>
            <p className="small mute">Every public complaint is escalated to higher municipal authorities if unaddressed.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
