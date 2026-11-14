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
  FaEye,
  FaUsers,
  FaHardHat,
  FaStar,
  FaChartLine,
  FaPhone,
  FaEnvelope,
  FaSearch,
  FaClipboardList
} from 'react-icons/fa';
import Map from '../Map';
import {
  CATS,
  TEAMS,
  TEAM_OFFICERS,
  score,
  level,
  overdue,
  dupes,
  days,
  stamp,
  getCatLabel,
  getTeamLabel,
  getStageLabel,
  formatUserName
} from '../data';
import { Plate, Chip } from '../ui';
import AdminSubNav from '../components/AdminSubNav';
import { useT } from '../i18n.jsx';

const LV = { High: 'red', Medium: 'amber', Low: 'blue' };

export default function Admin({ items, move, currentUser, say, go }) {
  const { t, lang } = useT();
  const [adminTab, setAdminTab] = useState('queue'); // 'queue' | 'monitor'
  const [f, setF] = useState('open');
  const [sel, setSel] = useState(null);
  const [team, setTeam] = useState({});
  const [reviewed, setReviewed] = useState({});
  const [reviewFilter, setReviewFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [citizenFilter, setCitizenFilter] = useState('all');
  const [detailModal, setDetailModal] = useState(null);

  const FILTERS = [
    ['open', t('adm_f_open')],
    ['review', t('adm_f_review')],
    ['overdue', t('adm_f_overdue')],
    ['dup', t('adm_f_dup')],
    ['done', t('adm_f_done')]
  ];

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
      if (c.dup.length) reasons.push(lang === 'ta' ? `நகல் பொருத்தம்: 60 மீட்டருக்குள் இதே பிரச்சினை (${c.dup.map((d) => d.id).join(', ')})` : `Duplicate match: identical issue within 60m (${c.dup.map((d) => d.id).join(', ')})`);
      if (!c.desc || c.desc.trim().length < 18) reasons.push(lang === 'ta' ? 'விளக்கம் சுருக்கமாக உள்ளது' : 'Description has limited detail');
      if (!c.area || /pinned location|குறிக்கப்பட்ட இடம்/i.test(c.area)) reasons.push(lang === 'ta' ? 'முகவரி உறுதிப்படுத்தப்படவில்லை' : 'Location address unverified');
      if (!c.photo) reasons.push(lang === 'ta' ? 'புகைப்படம் இணைக்கப்படவில்லை' : 'No photo attachment');
      
      const risk = Math.min(
        95,
        c.dup.length * 40 +
        (!c.desc || c.desc.trim().length < 18 ? 20 : 0) +
        (!c.area || /pinned location|குறிக்கப்பட்ட இடம்/i.test(c.area) ? 15 : 0) +
        (!c.photo ? 15 : 0)
      );

      return {
        ...c,
        reasons,
        risk
      };
    }).filter((c) => (c.risk >= 35 || c.dup.length > 0) && !reviewed[c.id]);
  }, [rows, reviewed, lang]);

  const reviewRows = flagged.filter(
    (c) => reviewFilter === 'all' || (reviewFilter === 'high' ? c.risk >= 60 : c.risk < 60)
  );

  // Filtered queue
  const show = useMemo(() => {
    return rows.filter((c) => {
      const matchesCategory = categoryFilter === 'all' || c.cat === categoryFilter;
      const matchesCitizen = citizenFilter === 'all' || (c.by || '').toLowerCase() === citizenFilter.toLowerCase();
      const matchesFilter = {
        open: c.stage < 4,
        review: c.stage <= 1,
        overdue: c.od,
        dup: c.dup.length > 0 && c.stage < 2,
        done: c.stage >= 4
      }[f];
      return matchesCategory && matchesCitizen && matchesFilter;
    });
  }, [rows, f, categoryFilter, citizenFilter]);

  const focus = rows.find((c) => c.id === sel);

  // Assign team
  const assign = (c) => {
    const tName = team[c.id] || CATS[c.cat]?.team || TEAMS[0];
    if (c.stage === 0) move(c.id, 1);
    move(c.id, 2, { team: tName }, lang === 'ta' ? `புகார் ${c.id} ${getTeamLabel(tName, 'ta')} துறைக்கு ஒதுக்கப்பட்டது` : `Complaint ${c.id} successfully assigned to ${tName}`);
  };

  const markVerified = (id) => {
    setReviewed((x) => ({ ...x, [id]: 'verified' }));
    if (say) say(lang === 'ta' ? `புகார் ${id} நிர்வாகியால் உறுதிப்படுத்தப்பட்டது` : `Complaint ${id} verified by Admin`);
  };

  const markDuplicate = (id) => {
    setReviewed((x) => ({ ...x, [id]: 'duplicate' }));
    move(id, 1, { notes: [{ t: lang === 'ta' ? 'நிர்வாகியால் நகல் என குறிக்கப்பட்டது' : 'Flagged as duplicate report by Admin', at: new Date().toISOString() }] }, lang === 'ta' ? `புகார் ${id} நகல் என குறிக்கப்பட்டது` : `Complaint ${id} flagged as duplicate`);
  };

  // ==========================================
  // CITIZEN & AUTHORITY MONITORING AGGREGATION
  // ==========================================

  // 1. Citizen Monitoring Metrics
  const citizenList = useMemo(() => {
    const map = {};
    items.forEach((c) => {
      const name = c.by || 'Anonymous Citizen';
      if (!map[name]) {
        map[name] = {
          name,
          total: 0,
          active: 0,
          resolved: 0,
          ratings: [],
          areas: new Set(),
          lastDate: c.submittedAt || c.history?.[0]?.at || '',
          complaints: []
        };
      }
      map[name].total += 1;
      if (c.stage >= 4) map[name].resolved += 1;
      else map[name].active += 1;
      if (c.rating) map[name].ratings.push(c.rating);
      if (c.area) map[name].areas.add(c.area);
      map[name].complaints.push(c);
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [items]);

  // 2. Authority Performance Monitoring Metrics
  const authorityStats = useMemo(() => {
    return TEAMS.map((tName) => {
      const assigned = items.filter((c) => c.team === tName);
      const active = assigned.filter((c) => c.stage < 4);
      const inProgress = assigned.filter((c) => c.stage === 3);
      const newAssigned = assigned.filter((c) => c.stage === 2);
      const resolved = assigned.filter((c) => c.stage >= 4);
      const overdueList = assigned.filter((c) => overdue(c));
      const ratings = assigned.filter((c) => c.rating).map((c) => c.rating);
      const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;
      const rate = assigned.length ? Math.round((resolved.length / assigned.length) * 100) : 0;
      const officerInfo = TEAM_OFFICERS[tName] || {};

      return {
        team: tName,
        teamLabel: getTeamLabel(tName, lang),
        officer: lang === 'ta' && officerInfo.officerTa ? officerInfo.officerTa : officerInfo.officer,
        phone: officerInfo.phone,
        email: officerInfo.email,
        total: assigned.length,
        active: active.length,
        newAssigned: newAssigned.length,
        inProgress: inProgress.length,
        resolved: resolved.length,
        overdue: overdueList.length,
        resolutionRate: rate,
        avgRating,
        status: overdueList.length > 0 ? 'overdue' : active.length > 4 ? 'high-load' : 'normal'
      };
    });
  }, [items, lang]);

  return (
    <div className="admin-dashboard">
      <AdminSubNav active="admin" go={go} />

      {/* Admin Command Header Banner */}
      <section className="dash-hero admin-hero">
        <div className="dash-hero-content">
          <div className="row between">
            <span className="role-tag admin-tag">
              <FaUserShield /> {t('adm_module')}
            </span>
            <span className="user-id-chip">
              {lang === 'ta' ? 'நிர்வாகி:' : 'Admin:'} {currentUser?.name || (lang === 'ta' ? 'நகராட்சி முதன்மை அதிகாரி' : 'Chief Municipal Officer')}
            </span>
          </div>
          <h2>{t('adm_title')}</h2>
          <p className="lead">{t('adm_lead')}</p>

          {/* Admin Feature Tabs: Complaints Desk vs Monitoring Center */}
          <div className="admin-main-tabs">
            <button
              type="button"
              className={`admin-main-tab-btn ${adminTab === 'queue' ? 'active' : ''}`}
              onClick={() => setAdminTab('queue')}
            >
              <FaClipboardList /> {lang === 'ta' ? 'புகார்கள் & GIS வரைபடம்' : 'Complaints & GIS Map'}
            </button>
            <button
              type="button"
              className={`admin-main-tab-btn ${adminTab === 'monitor' ? 'active' : ''}`}
              onClick={() => setAdminTab('monitor')}
            >
              <FaChartLine /> {t('adm_mon_title')}
            </button>
          </div>
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
            <div className="metric-lbl">{t('adm_open')}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-amber-subtle">
            <FaHourglassHalf />
          </div>
          <div>
            <div className="metric-val">{rows.filter((c) => c.stage <= 1).length}</div>
            <div className="metric-lbl">{t('adm_review')}</div>
          </div>
        </div>

        <div className="metric-card alert-metric">
          <div className="metric-icon bg-red-subtle">
            <FaExclamationTriangle />
          </div>
          <div>
            <div className="metric-val text-red">{overdueItems.length}</div>
            <div className="metric-lbl">{t('adm_overdue')}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-red-subtle">
            <FaSortAmountUp />
          </div>
          <div>
            <div className="metric-val">{highPriorityItems.length}</div>
            <div className="metric-lbl">{t('adm_high')}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-green-subtle">
            <FaCheckCircle />
          </div>
          <div>
            <div className="metric-val text-green">{resolvedItems.length}</div>
            <div className="metric-lbl">{t('adm_resolved')}</div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* VIEW 1: CITIZEN & AUTHORITY MONITORING CENTER (TAB 2)   */}
      {/* ======================================================== */}
      {adminTab === 'monitor' && (
        <div className="admin-monitoring-view">
          
          {/* 1. AUTHORITY TEAMS MONITORING PANEL */}
          <section className="card monitoring-panel">
            <div className="row between head-wrap">
              <div>
                <div className="row">
                  <FaHardHat className="text-teal" />
                  <span className="eyebrow">{lang === 'ta' ? 'அதிகாரிகள் துறை கண்காணிப்பு' : 'AUTHORITY PERFORMANCE MONITORING'}</span>
                </div>
                <h3>{lang === 'ta' ? 'அதிகாரி துறைகள் & பணி முன்னேற்றம்' : 'Departmental Field Teams & Workload Tracker'}</h3>
                <p className="mute small">
                  {lang === 'ta'
                    ? '4 நகராட்சித் துறைகளின் பணி ஒதுக்கீடு, தீர்வு வேகம் மற்றும் சேவை நிலை ஒப்பந்த (SLA) செயல்திறன்.'
                    : 'Real-time performance, workload distribution and SLA compliance across all 4 municipal authority teams.'}
                </p>
              </div>
              <span className="risk-count">
                {TEAMS.length} {t('adm_mon_authorities')}
              </span>
            </div>

            <div className="authority-monitor-grid">
              {authorityStats.map((auth) => (
                <div key={auth.team} className={`auth-monitor-card ${auth.status}`}>
                  <div className="row between auth-card-head">
                    <div>
                      <h4>{auth.teamLabel}</h4>
                      <span className="officer-name">👤 {auth.officer}</span>
                    </div>
                    <span className={`status-pill ${auth.status}`}>
                      {auth.status === 'overdue'
                        ? (lang === 'ta' ? '⚠️ தாமதம் உள்ளது' : '⚠️ Overdue Alert')
                        : auth.status === 'high-load'
                        ? (lang === 'ta' ? '🔥 அதிக பணி' : '🔥 High Load')
                        : (lang === 'ta' ? '✓ சுமுகமானது' : '✓ Optimal')}
                    </span>
                  </div>

                  <div className="contact-row small mute">
                    <span><FaPhone /> {auth.phone}</span>
                    <span><FaEnvelope /> {auth.email}</span>
                  </div>

                  <div className="auth-stat-mini-grid">
                    <div className="mini-stat">
                      <small>{t('adm_mon_assigned')}</small>
                      <b>{auth.total}</b>
                    </div>
                    <div className="mini-stat">
                      <small>{t('adm_mon_in_progress')}</small>
                      <b className="text-blue">{auth.inProgress}</b>
                    </div>
                    <div className="mini-stat">
                      <small>{t('adm_mon_completed')}</small>
                      <b className="text-green">{auth.resolved}</b>
                    </div>
                    <div className="mini-stat">
                      <small>{lang === 'ta' ? 'தாமதமானவை' : 'Overdue'}</small>
                      <b className={auth.overdue > 0 ? 'text-red' : ''}>{auth.overdue}</b>
                    </div>
                  </div>

                  {/* Resolution Rate Progress Bar */}
                  <div className="rate-progress-wrap">
                    <div className="row between small">
                      <span>{t('adm_mon_resolved_rate')}</span>
                      <b>{auth.resolutionRate}%</b>
                    </div>
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${auth.resolutionRate}%`,
                          backgroundColor: auth.resolutionRate >= 70 ? 'var(--green)' : auth.resolutionRate >= 40 ? 'var(--amber)' : 'var(--red)'
                        }}
                      />
                    </div>
                  </div>

                  <div className="auth-card-foot row between">
                    <span className="rating-pill">
                      {auth.avgRating ? `★ ${auth.avgRating} / 5 Rating` : (lang === 'ta' ? 'மதிப்பீடு இல்லை' : 'No ratings yet')}
                    </span>
                    <button
                      type="button"
                      className="ghost sm-btn"
                      onClick={() => {
                        setAdminTab('queue');
                        setCategoryFilter('all');
                        setSel(items.find((c) => c.team === auth.team)?.id || null);
                      }}
                    >
                      {lang === 'ta' ? 'பணிகளைப் பார் ➔' : 'Inspect Tasks ➔'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. CITIZEN MONITORING PANEL */}
          <section className="card monitoring-panel mt-3">
            <div className="row between head-wrap">
              <div>
                <div className="row">
                  <FaUsers className="text-blue" />
                  <span className="eyebrow">{lang === 'ta' ? 'குடிமக்கள் கண்காணிப்பு' : 'CITIZEN PARTICIPATION MONITOR'}</span>
                </div>
                <h3>{lang === 'ta' ? 'பதிவு செய்யப்பட்ட குடிமக்கள் & அவர்களின் புகார்கள்' : 'Citizen Activity & Feedback Monitor'}</h3>
                <p className="mute small">
                  {lang === 'ta'
                    ? 'குடிமக்கள் பதிவு செய்த புகார்கள், அவர்களின் பகுதிகள் மற்றும் வழங்கிய மதிப்பீடுகள்.'
                    : 'Track active citizen reporters, community engagement, areas covered and feedback ratings.'}
                </p>
              </div>
              <span className="risk-count">
                {citizenList.length} {t('adm_mon_citizens')}
              </span>
            </div>

            <div className="table-responsive">
              <table className="citizen-monitor-table">
                <thead>
                  <tr>
                    <th>{t('adm_reported_by')}</th>
                    <th>{lang === 'ta' ? 'பகுதிகள்' : 'Covered Areas'}</th>
                    <th>{t('adm_mon_complaints')}</th>
                    <th>{t('adm_mon_active')}</th>
                    <th>{t('adm_resolved')}</th>
                    <th>{lang === 'ta' ? 'சராசரி மதிப்பீடு' : 'Avg Rating'}</th>
                    <th>{lang === 'ta' ? 'நடவடிக்கை' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody>
                  {citizenList.map((cit) => {
                    const avgCitRating = cit.ratings.length
                      ? (cit.ratings.reduce((a, b) => a + b, 0) / cit.ratings.length).toFixed(1)
                      : null;
                    return (
                      <tr key={cit.name}>
                        <td>
                          <b>{formatUserName(cit.name, lang)}</b>
                          {cit.name === 'Priya Raman' && <span className="lead-reporter-badge">★ Top Citizen</span>}
                        </td>
                        <td className="small mute">{Array.from(cit.areas).slice(0, 2).join(', ') || 'Chennai'}</td>
                        <td><b>{cit.total}</b></td>
                        <td><span className="text-blue font-bold">{cit.active}</span></td>
                        <td><span className="text-green font-bold">{cit.resolved}</span></td>
                        <td>
                          {avgCitRating ? (
                            <span className="star-text">★ {avgCitRating}</span>
                          ) : (
                            <span className="mute small">—</span>
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="ghost sm-btn"
                            onClick={() => {
                              setCitizenFilter(cit.name);
                              setAdminTab('queue');
                              say(lang === 'ta' ? `${cit.name} அவர்களின் புகார்கள் வடிகட்டப்பட்டது` : `Filtered complaints for ${cit.name}`);
                            }}
                          >
                            {lang === 'ta' ? 'புகார்கள்' : 'View Reports'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: COMPLAINTS DESK, DUPLICATES & GIS MAP (TAB 1)    */}
      {/* ======================================================== */}
      {adminTab === 'queue' && (
        <>
          {/* OVERDUE COMPLAINT ALERTS SECTION (Special Feature) */}
          {overdueItems.length > 0 && (
            <section className="overdue-alert-panel">
              <div className="row between">
                <div className="row">
                  <span className="pulse-alert-icon">⚠️</span>
                  <div>
                    <h3 className="text-red">{t('adm_sla_title')} ({overdueItems.length} {t('adm_overdue')})</h3>
                    <p className="mute small">{t('adm_sla_hint')}</p>
                  </div>
                </div>
                <button
                  className="solid red-btn"
                  onClick={() => {
                    setF('overdue');
                    window.scrollTo({ top: 800, behavior: 'smooth' });
                  }}
                >
                  {t('adm_filter_overdue')}
                </button>
              </div>

              <div className="overdue-cards-row">
                {overdueItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="overdue-summary-pill" onClick={() => setSel(item.id)}>
                    <Plate id={item.id} />
                    <b>{getCatLabel(item.cat, lang)}</b>
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
                  <span className="eyebrow">{lang === 'ta' ? 'சிறப்பு அம்சம்: அறிவார்ந்த சரிபார்ப்பு' : 'SPECIAL FEATURE: AI-ASSISTED VALIDATION'}</span>
                </div>
                <h3>{t('adm_dup_title')}</h3>
                <p className="mute small">{t('adm_dup_hint')}</p>
              </div>
              <span className="risk-count">
                {flagged.length} {t('adm_pending')}
              </span>
            </div>

            <div className="chips">
              <button
                className={`pick ${reviewFilter === 'all' ? 'on' : ''}`}
                onClick={() => setReviewFilter('all')}
              >
                {t('adm_all_flagged')} ({flagged.length})
              </button>
              <button
                className={`pick ${reviewFilter === 'high' ? 'on' : ''}`}
                onClick={() => setReviewFilter('high')}
              >
                {t('adm_high_dup')}
              </button>
            </div>

            {reviewRows.length === 0 ? (
              <p className="empty text-center">
                <FaCheckCircle className="text-green mr-1" />
                {t('adm_no_dup')}
              </p>
            ) : (
              <div className="fraud-grid">
                {reviewRows.map((c) => (
                  <article className="fraud-card" key={c.id}>
                    <div className="row between">
                      <Plate id={c.id} />
                      <Chip tone={c.dup.length > 0 ? 'red' : 'amber'}>
                        {c.dup.length > 0 ? (lang === 'ta' ? 'நகல் எச்சரிக்கை' : 'Duplicate Alert') : (lang === 'ta' ? 'சரிபார்க்க வேண்டும்' : 'Needs Check')} · {c.risk}%
                      </Chip>
                    </div>

                    <p className="mt-1">
                      <b>{c.desc}</b>
                    </p>
                    <p className="small mute">
                      {c.area} · {getCatLabel(c.cat, lang)} · {t('adm_reported_by')} {c.by}
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
                        <FaCheck /> {t('adm_verify')}
                      </button>
                      <button
                        className="ghost sm-btn red-ghost"
                        onClick={() => markDuplicate(c.id)}
                      >
                        <FaClone /> {t('adm_mark_dup')}
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
                    <h4>{t('adm_hotspot')}</h4>
                  </div>
                  <span className="small mute">{t('adm_wards')}</span>
                </div>

                <Map
                  items={rows}
                  focus={focus}
                  selected={sel}
                  onSelect={setSel}
                  height={460}
                  label={t('adm_hotspot')}
                />

                <div className="map-footer-stats">
                  <p className="legend">
                    <i className="d red" /> {t('adm_legend_high')}
                    <i className="d amber" /> {t('adm_legend_med')}
                    <i className="d blue" /> {t('adm_legend_low')}
                    <i className="d green" /> {t('adm_legend_res')}
                  </p>

                  {/* Area Hotspot Ranking */}
                  <div className="hotspot-clusters">
                    <b>{t('adm_top_hot')}:</b>
                    <div className="cluster-tags">
                      {areaCounts.slice(0, 4).map(([area, count]) => (
                        <span key={area} className="hotspot-tag">
                          {area}: <b>{count} {lang === 'ta' ? 'திறந்தவை' : 'open'}</b>
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
                  <h4>{t('adm_queue')}</h4>
                  <div className="row">
                    {citizenFilter !== 'all' && (
                      <button
                        type="button"
                        className="ghost sm-btn text-blue"
                        onClick={() => setCitizenFilter('all')}
                        title="Clear citizen filter"
                      >
                        ✕ {citizenFilter}
                      </button>
                    )}
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="cat-select"
                    >
                      <option value="all">{t('adm_all_cats')}</option>
                      {Object.entries(CATS).map(([k]) => (
                        <option key={k} value={k}>
                          {getCatLabel(k, lang)}
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
                <p className="empty text-center">{t('adm_no_match')}</p>
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
                          {c.od && <Chip tone="red">{t('adm_overdue')}</Chip>}
                          {c.stage < 4 && <Chip tone={LV[c.lv]}>{c.lv} {t('adm_priority')} ({c.s})</Chip>}
                          {c.stage >= 4 && <Chip tone="green">{t('adm_legend_res')}</Chip>}
                        </div>
                      </div>

                      <p className="admin-desc">
                        <b>{c.desc}</b>
                      </p>

                      <p className="mute small">
                        {getCatLabel(c.cat, lang)} · {c.area} · {days(c)} · {t('adm_reported_by')} <b>{c.by}</b>
                      </p>

                      {/* Auto-routed department pill */}
                      <div className="auto-assigned-department-pill">
                        <FaHardHat className="text-teal" />
                        <span>
                          {lang === 'ta' ? 'ஒதுக்கப்பட்ட துறை:' : 'Assigned Team:'}{' '}
                          <b>{getTeamLabel(c.team || CATS[c.cat]?.team, lang)}</b>
                        </span>
                      </div>

                      {c.dup.length > 0 && c.stage < 2 && (
                        <p className="note duplicate-warning-box">
                          <FaClone /> <b>{lang === 'ta' ? 'சாத்தியமான நகல்:' : 'Potential Duplicate:'}</b> {c.dup.map((d) => d.id).join(', ')}
                        </p>
                      )}

                      {/* Team Assignment / Status Controls */}
                      <div className="assignment-control-bar">
                        {c.stage < 2 ? (
                          <div className="row assign-form-row">
                            <select
                              aria-label={`Assign team for ${c.id}`}
                              value={team[c.id] || c.team || CATS[c.cat]?.team || TEAMS[0]}
                              onChange={(e) =>
                                setTeam({ ...team, [c.id]: e.target.value })
                              }
                              onClick={(e) => e.stopPropagation()}
                            >
                              {TEAMS.map((tName) => (
                                <option key={tName} value={tName}>
                                  {getTeamLabel(tName, lang)}
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
                              <FaTools /> {t('adm_assign')}
                            </button>
                          </div>
                        ) : (
                          <div className="row between assignment-status">
                            <span className="small">
                              {t('adm_status')}: <b>{getStageLabel(c.stage, lang)}</b> · {t('adm_team')}: <b>{getTeamLabel(c.team, lang)}</b>
                            </span>
                            <button
                              className="ghost sm-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDetailModal(c);
                              }}
                            >
                              <FaEye /> {t('adm_full')}
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
        </>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="modal-backdrop" onClick={() => setDetailModal(null)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{t('adm_detail_title')} — {detailModal.id}</h3>
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
                    <th>{t('adm_id')}:</th>
                    <td>{detailModal.id}</td>
                  </tr>
                  <tr>
                    <th>{t('adm_cat')}:</th>
                    <td>{getCatLabel(detailModal.cat, lang)}</td>
                  </tr>
                  <tr>
                    <th>{t('adm_description')}:</th>
                    <td>{detailModal.desc}</td>
                  </tr>
                  <tr>
                    <th>{t('adm_location')}:</th>
                    <td>{detailModal.area} ({detailModal.lat?.toFixed(4)}, {detailModal.lng?.toFixed(4)})</td>
                  </tr>
                  <tr>
                    <th>{t('adm_reported_by')}:</th>
                    <td>{detailModal.by}</td>
                  </tr>
                  <tr>
                    <th>{t('adm_assigned_team')}:</th>
                    <td><b>{getTeamLabel(detailModal.team, lang)}</b></td>
                  </tr>
                  <tr>
                    <th>{t('adm_priority')}:</th>
                    <td>{detailModal.s} ({detailModal.lv})</td>
                  </tr>
                  <tr>
                    <th>{t('adm_notes')}:</th>
                    <td>
                      {detailModal.notes?.length > 0 ? (
                        <ul>
                          {detailModal.notes.map((n, i) => (
                            <li key={i}>{n.t || n.note}</li>
                          ))}
                        </ul>
                      ) : (
                        t('adm_no_notes')
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              {detailModal.proofImg && (
                <div className="mt-2">
                  <b>{t('adm_proof')}:</b>
                  <img src={detailModal.proofImg} alt="Resolution proof" className="proof-thumb" />
                </div>
              )}
            </div>
            <div className="modal-foot">
              <button className="solid" onClick={() => setDetailModal(null)}>
                {t('adm_close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
