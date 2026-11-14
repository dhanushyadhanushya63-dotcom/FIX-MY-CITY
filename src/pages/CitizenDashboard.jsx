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
  FaCheck,
  FaPrint,
  FaTimes,
  FaHardHat
} from 'react-icons/fa';
import { CATS, STAGES, stamp, days, getCatLabel, getTeamLabel, getStageLabel, formatUserName } from '../data';
import { Plate, Chip, Status } from '../ui';
import AdminSubNav from '../components/AdminSubNav';
import { useT } from '../i18n.jsx';

export default function CitizenDashboard({ currentUser, items, go, move, say }) {
  const { t, lang } = useT();
  const citizenName = currentUser?.name || 'Priya Raman';
  const [filter, setFilter] = useState('all');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [ratingInput, setRatingInput] = useState({});

  // Filter complaints filed by this citizen (or fall back to seed complaints for demo preview)
  const myComplaints = useMemo(() => {
    const list = items.filter(
      (c) => (c.by || '').toLowerCase() === citizenName.toLowerCase()
    );
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
    move(
      complaintId,
      5,
      { rating: stars },
      lang === 'ta'
        ? `புகார் ${complaintId}-க்கு ${stars} நட்சத்திர மதிப்பீடு அளித்ததற்கு நன்றி!`
        : `Thank you for rating complaint ${complaintId} with ${stars} stars!`
    );
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
                <FaUser /> {t('cit_module')}
              </span>
              <span className="user-id-chip">
                ID: {currentUser?.id || 'CIT-2026-44'}
              </span>
            </div>
            <span className="civic-score-badge" title="Points earned for verified community reports">
              <FaStar className="star-icon" /> 150 {lang === 'ta' ? 'குடிமை புள்ளிகள்' : 'Civic Karma Points'}
            </span>
          </div>

          <h2>{t('cit_welcome')}, {formatUserName(citizenName, lang)}!</h2>
          <p className="lead">{t('cit_lead')}</p>

          <div className="dash-cta-row">
            <button className="solid big pulse-btn" onClick={() => go('register')}>
              <FaBullhorn /> {t('reg_title')}
            </button>
            <button className="ghost big" onClick={() => go('track')}>
              <FaSearch /> {t('tr_title')}
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
            <div className="metric-lbl">{t('cit_total')}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-amber-subtle">
            <FaClock />
          </div>
          <div>
            <div className="metric-val">{inProgress + pending}</div>
            <div className="metric-lbl">{t('cit_progress')}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-green-subtle">
            <FaCheckCircle />
          </div>
          <div>
            <div className="metric-val text-green">{resolved}</div>
            <div className="metric-lbl">{t('cit_resolved')}</div>
          </div>
        </div>
      </section>

      {/* Complaint List Filter & Table */}
      <section className="card citizen-reports-panel">
        <div className="row between head-wrap">
          <div>
            <h3>{lang === 'ta' ? 'என் புகார்கள் & கள நிலை' : 'My Reported Issues & Status'}</h3>
            <p className="mute small">
              {lang === 'ta'
                ? 'உங்கள் புகாரின் தற்போதைய நிலை, ஒதுக்கப்பட்ட துறை மற்றும் பழுது நீக்கிய ஆதாரம்.'
                : 'Track milestone progress, inspect assigned department, and review photo proof upon completion.'}
            </p>
          </div>
          <div className="chips">
            <button
              className={`pick ${filter === 'all' ? 'on' : ''}`}
              onClick={() => setFilter('all')}
            >
              {t('cit_filter_all')} ({myComplaints.length})
            </button>
            <button
              className={`pick ${filter === 'active' ? 'on' : ''}`}
              onClick={() => setFilter('active')}
            >
              {t('cit_filter_active')} ({myComplaints.filter((c) => c.stage < 4).length})
            </button>
            <button
              className={`pick ${filter === 'resolved' ? 'on' : ''}`}
              onClick={() => setFilter('resolved')}
            >
              {t('cit_filter_resolved')} ({myComplaints.filter((c) => c.stage >= 4).length})
            </button>
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="empty text-center p-3">
            <FaBullhorn className="empty-icon" />
            <p>{t('cit_no_complaints')}</p>
            <button className="solid" onClick={() => go('register')}>
              {t('cit_register')}
            </button>
          </div>
        ) : (
          <div className="citizen-cards-grid">
            {filteredList.map((item) => (
              <article key={item.id} className="citizen-report-card">
                <div className="row between">
                  <Plate id={item.id} />
                  <Status c={item} />
                </div>

                <h4 className="mt-1">{item.desc}</h4>
                <p className="small mute">
                  {getCatLabel(item.cat, lang)} · <FaMapMarkerAlt /> {item.area} · {days(item)}
                </p>

                {/* Auto-routed department badge */}
                <div className="auto-assigned-department-pill">
                  <FaHardHat className="text-teal" />
                  <span>
                    {lang === 'ta' ? 'பொறுப்புத் துறை:' : 'Assigned Team:'}{' '}
                    <b>{getTeamLabel(item.team || CATS[item.cat]?.team, lang)}</b>
                  </span>
                </div>

                {/* Star Rating Section for Resolved issues */}
                {item.stage >= 4 && (
                  <div className="rating-box mt-1">
                    <small className="mute">
                      {item.rating
                        ? `${t('cit_rated')}: ${item.rating} ★`
                        : `${t('cit_rate')}:`}
                    </small>
                    <div className="row stars-row">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-btn ${(item.rating || ratingInput[item.id]) >= star ? 'gold' : ''}`}
                          onClick={() => handleRatingSubmit(item.id, star)}
                          title={`${star} stars`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="row between card-foot-actions mt-2">
                  <button
                    type="button"
                    className="ghost sm-btn"
                    onClick={() => setSelectedReceipt(item)}
                  >
                    <FaFileAlt /> {t('cit_receipt')}
                  </button>
                  <button
                    type="button"
                    className="solid sm-btn"
                    onClick={() => go('track', item.id)}
                  >
                    <FaArrowRight /> {t('cit_track')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Digital Receipt Modal */}
      {selectedReceipt && (
        <div className="modal-backdrop" onClick={() => setSelectedReceipt(null)}>
          <div className="modal-window receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{t('reg_receipt_title')} — {selectedReceipt.id}</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setSelectedReceipt(null)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <table className="receipt-table">
                <tbody>
                  <tr>
                    <th>{t('reg_your_id')}:</th>
                    <td><b>{selectedReceipt.id}</b></td>
                  </tr>
                  <tr>
                    <th>{t('reg_issue_cat')}:</th>
                    <td>{getCatLabel(selectedReceipt.cat, lang)}</td>
                  </tr>
                  <tr>
                    <th>{lang === 'ta' ? 'ஒதுக்கப்பட்ட துறை' : 'Assigned Department'}:</th>
                    <td><b>{getTeamLabel(selectedReceipt.team || CATS[selectedReceipt.cat]?.team, lang)}</b></td>
                  </tr>
                  <tr>
                    <th>{t('reg_reported_loc')}:</th>
                    <td>{selectedReceipt.area}</td>
                  </tr>
                  <tr>
                    <th>{t('reg_issue_desc')}:</th>
                    <td>{selectedReceipt.desc}</td>
                  </tr>
                  <tr>
                    <th>{t('adm_status')}:</th>
                    <td><b>{getStageLabel(selectedReceipt.stage, lang)}</b></td>
                  </tr>
                </tbody>
              </table>
              {selectedReceipt.proofImg && (
                <div className="mt-2">
                  <b>{lang === 'ta' ? 'பழுது நீக்கிய ஆதாரம்:' : 'Resolution Proof Photo:'}</b>
                  <img src={selectedReceipt.proofImg} alt="Proof" className="proof-thumb" />
                </div>
              )}
            </div>
            <div className="modal-foot">
              <button className="solid" onClick={() => window.print()}>
                <FaPrint /> {t('reg_print')}
              </button>
              <button className="ghost" onClick={() => setSelectedReceipt(null)}>
                {t('th_close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
