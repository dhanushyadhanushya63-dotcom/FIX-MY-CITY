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
import { CATS, TEAMS, days, stamp, getCatLabel, getTeamLabel, getStageLabel } from '../data';
import { Plate, Chip, Tracker } from '../ui';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import AdminSubNav from '../components/AdminSubNav';
import { useT } from '../i18n.jsx';

export default function Authority({ user, items, move, say, go }) {
  const { t, lang } = useT();
  const [team, setTeam] = useState(user?.team || TEAMS[0]);
  const [selId, setSelId] = useState(null);
  const [note, setNote] = useState('');
  const [proof, setProof] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState('all');

  // Filter complaints assigned to this department team (stage >= 1 or auto-routed)
  const list = useMemo(() => {
    return items
      .filter((c) => c.team === team)
      .sort((a, b) => a.stage - b.stage);
  }, [items, team]);

  // Derived KPI Stats for this Department
  const totalAssigned = list.length;
  const newAssigned = list.filter((c) => c.stage <= 2).length;
  const inProgress = list.filter((c) => c.stage === 3).length;
  const resolved = list.filter((c) => c.stage >= 4).length;

  // Filtered complaints
  const filteredList = useMemo(() => {
    if (filter === 'new') return list.filter((c) => c.stage <= 2);
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
      setErr(lang === 'ta' ? 'புகைப்படம் 5 MB-க்கு குறைவாக இருக்க வேண்டும்.' : 'Photo must be smaller than 5 MB.');
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
    move(
      c.id,
      3,
      withNote(),
      lang === 'ta' ? `${c.id} மீதான பணி ${getTeamLabel(team, 'ta')} பிரிவால் தொடங்கப்பட்டது` : `Work started on ${c.id} by ${team}`
    );
    setNote('');
  };

  const resolve = () => {
    if (!c) return;
    if (!proof && !proofPreview) {
      setErr(t('auth_proof_required'));
      return;
    }
    const proofUrl = proofPreview || (proof ? URL.createObjectURL(proof) : null);
    move(
      c.id,
      4,
      { ...withNote(), proof: true, proofImg: proofUrl },
      lang === 'ta' ? `புகார் ${c.id} பழுதுநீக்க ஆதாரத்துடன் தீர்க்கப்பட்டது என குறிக்கப்பட்டது` : `Complaint ${c.id} marked as resolved with photo proof`
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
              <FaHardHat /> {t('auth_module')}
            </span>
            <div className="team-select-box">
              <FaBuilding className="text-blue" />
              <label>
                {t('auth_dept')}:
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
                  {TEAMS.map((tName) => (
                    <option key={tName} value={tName}>
                      {getTeamLabel(tName, lang)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <h2>{getTeamLabel(team, lang)} — {t('auth_title')}</h2>
          <p className="lead">{t('auth_lead')}</p>
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
            <div className="metric-lbl">{t('auth_total')}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-amber-subtle">
            <FaClock />
          </div>
          <div>
            <div className="metric-val">{newAssigned}</div>
            <div className="metric-lbl">{t('auth_new')}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-blue-subtle">
            <FaTools />
          </div>
          <div>
            <div className="metric-val">{inProgress}</div>
            <div className="metric-lbl">{t('auth_progress')}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-green-subtle">
            <FaCheckCircle />
          </div>
          <div>
            <div className="metric-val text-green">{resolved}</div>
            <div className="metric-lbl">{t('auth_completed')}</div>
          </div>
        </div>
      </section>

      {/* Main Workspace Layout */}
      {list.length === 0 ? (
        <div className="card empty text-center p-3">
          <FaClipboardList className="empty-icon" />
          <h3>{t('auth_no_orders')} ({getTeamLabel(team, lang)})</h3>
          <p className="mute">
            {lang === 'ta'
              ? 'குடிமக்கள் புகார் அளிக்கும் போது அல்லது நிர்வாகி ஒதுக்கும் போது அவை இங்கே தானாகவே தோன்றும்.'
              : 'When citizens report issues or the Municipal Admin Desk assigns work, they will appear here automatically.'}
          </p>
        </div>
      ) : (
        <div className="split authority-split">
          {/* Left Column: Assigned Complaints List */}
          <section className="work-order-list card" aria-label="Assigned complaints">
            <div className="row between head-wrap">
              <h4>{lang === 'ta' ? 'ஒதுக்கப்பட்ட பணி ஆணைகள்' : 'Assigned Work Orders'}</h4>
              <div className="chips">
                <button
                  className={`pick ${filter === 'all' ? 'on' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  {t('auth_filter_all')} ({list.length})
                </button>
                <button
                  className={`pick ${filter === 'new' ? 'on' : ''}`}
                  onClick={() => setFilter('new')}
                >
                  {t('auth_filter_new')} ({newAssigned})
                </button>
                <button
                  className={`pick ${filter === 'progress' ? 'on' : ''}`}
                  onClick={() => setFilter('progress')}
                >
                  {t('auth_filter_progress')} ({inProgress})
                </button>
                <button
                  className={`pick ${filter === 'resolved' ? 'on' : ''}`}
                  onClick={() => setFilter('resolved')}
                >
                  {t('auth_filter_done')} ({resolved})
                </button>
              </div>
            </div>

            <div className="order-items-scroll">
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  className={`order-item-card ${c?.id === item.id ? 'active' : ''}`}
                  onClick={() => setSelId(item.id)}
                >
                  <div className="row between">
                    <Plate id={item.id} />
                    <Chip
                      tone={
                        item.stage >= 4
                          ? 'green'
                          : item.stage === 3
                          ? 'blue'
                          : 'amber'
                      }
                    >
                      {getStageLabel(item.stage, lang)}
                    </Chip>
                  </div>
                  <p className="order-item-desc">
                    <b>{item.desc}</b>
                  </p>
                  <div className="row between mute small">
                    <span>{getCatLabel(item.cat, lang)}</span>
                    <span>{item.area}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Column: Work Order Action Detail Workspace */}
          {c && (
            <section className="work-order-detail card" aria-label="Work order execution">
              <div className="row between order-detail-head">
                <div>
                  <span className="eyebrow">{lang === 'ta' ? 'செயல்பாட்டு பணி ஆணை' : 'ACTIVE WORK ORDER'}</span>
                  <h3>
                    {c.id} — {getCatLabel(c.cat, lang)}
                  </h3>
                </div>
                <Chip tone={c.stage >= 4 ? 'green' : c.stage === 3 ? 'blue' : 'amber'}>
                  {getStageLabel(c.stage, lang)}
                </Chip>
              </div>

              {/* Citizen & Location Metadata Card */}
              <div className="order-meta-grid">
                <div>
                  <small><FaMapMarkerAlt /> {lang === 'ta' ? 'கள இருப்பிடம்' : 'Field Location'}</small>
                  <b>{c.area}</b>
                </div>
                <div>
                  <small><FaUser /> {lang === 'ta' ? 'புகாரளித்த குடிமகன்' : 'Reported Citizen'}</small>
                  <b>{c.by}</b>
                </div>
                <div>
                  <small><FaClock /> {lang === 'ta' ? 'பதிவு செய்யப்பட்ட நாள்' : 'Reported Age'}</small>
                  <b>{days(c)}</b>
                </div>
                <div>
                  <small><FaBuilding /> {t('auth_dept')}</small>
                  <b>{getTeamLabel(c.team, lang)}</b>
                </div>
              </div>

              {/* Progress Milestones Tracker */}
              <div className="mt-2 mb-2">
                <Tracker c={c} />
              </div>

              {/* Original Issue Description */}
              <div className="issue-desc-box">
                <b>{lang === 'ta' ? 'குடிமகன் விவரித்த பிரச்சினை:' : 'Citizen Problem Description:'}</b>
                <p>{c.desc}</p>
                {c.photo && (
                  <div className="mt-1">
                    <small className="mute">{lang === 'ta' ? 'குடிமகன் சமர்ப்பித்த புகைப்படம்:' : 'Citizen Submitted Photo:'}</small>
                    <img src={c.photo} alt="Reported problem" className="proof-thumb" />
                  </div>
                )}
              </div>

              {/* Field Progress Updates Log */}
              <div className="field-notes-history">
                <b>{lang === 'ta' ? 'கள முன்னேற்றப் பதிவுகள்:' : 'Field Progress Logs & Audit Notes:'}</b>
                {c.notes && c.notes.length > 0 ? (
                  <ul className="notes-list">
                    {c.notes.map((n, i) => (
                      <li key={i}>
                        <span className="note-text">{n.t || n.note}</span>
                        <span className="note-date mute">{stamp(n.at)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mute small">{lang === 'ta' ? 'குறிப்புகள் இன்னும் பதிவு செய்யப்படவில்லை.' : 'No progress logs recorded yet.'}</p>
                )}
              </div>

              {/* Work Order Action Controls */}
              {c.stage < 4 && (
                <div className="action-control-panel">
                  <h4>{lang === 'ta' ? 'கள நடவடிக்கை & தீர்வு மேலாண்மை' : 'Field Action & Resolution Desk'}</h4>

                  <div className="field">
                    <label>
                      {t('auth_note_ph')}
                      <textarea
                        rows="2"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={t('auth_note_ph')}
                      />
                    </label>
                  </div>

                  {c.stage <= 2 && (
                    <div className="row">
                      <button className="solid" type="button" onClick={start}>
                        <FaTools /> {t('auth_start')}
                      </button>
                    </div>
                  )}

                  {c.stage === 3 && (
                    <div className="resolution-upload-box">
                      <b>{t('auth_upload_proof')} *</b>
                      <p className="mute small">
                        {lang === 'ta'
                          ? 'பணி முடிந்ததை உறுதிப்படுத்த பழுது நீக்கிய பின் எடுத்த புகைப்படத்தைப் பதிவேற்றவும்.'
                          : 'Upload an after-work photograph to confirm the resolution before closing this work order.'}
                      </p>

                      {!proofPreview ? (
                        <label className="drop">
                          <FaCamera style={{ fontSize: '1.8rem', marginBottom: '.3rem' }} />
                          <b>{t('auth_upload_proof')}</b>
                          <small>{lang === 'ta' ? 'பழுது நீக்கிய தெளிவான புகைப்படத்தைத் தேர்வு செய்யவும்' : 'Select a clear photo of the completed repair'}</small>
                          <input type="file" accept="image/*" onChange={handlePhotoSelect} />
                        </label>
                      ) : (
                        <div className="preview-card">
                          <img className="preview-thumb" src={proofPreview} alt="Work resolution proof" />
                          <div className="preview-meta">
                            <span><FaImage /> {proof?.name || 'resolution-proof.jpg'}</span>
                            <button
                              type="button"
                              className="preview-change-btn"
                              onClick={() => {
                                setProof(null);
                                setProofPreview(null);
                              }}
                            >
                              {lang === 'ta' ? 'மாற்று' : 'Change Photo'}
                            </button>
                          </div>
                        </div>
                      )}

                      {err && <p className="err">{err}</p>}

                      <div className="row mt-2">
                        <button className="solid green-btn" type="button" onClick={resolve}>
                          <FaCheckCircle /> {t('auth_mark_resolved')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Resolved State Display with Before/After Comparison */}
              {c.stage >= 4 && (
                <div className="resolved-status-box">
                  <div className="row between">
                    <div className="row">
                      <FaCheckCircle className="text-green big-icon" />
                      <div>
                        <h4 className="text-green">{lang === 'ta' ? 'பணி வெற்றிகரமாக முடிக்கப்பட்டது' : 'Work Order Successfully Resolved'}</h4>
                        <p className="mute small">
                          {lang === 'ta' ? 'தீர்வு ஆதாரம் சரிபார்க்கப்பட்டு குடிமகனுக்கு அனுப்பப்பட்டுள்ளது.' : 'Verified resolution proof has been submitted and shared with the citizen.'}
                        </p>
                      </div>
                    </div>
                    {c.rating && (
                      <div className="rating-badge">
                        <FaStar className="star-icon" /> {c.rating} / 5 Rating
                      </div>
                    )}
                  </div>

                  {/* Interactive Before & After Slider */}
                  <div className="mt-2 mb-2">
                    <h5>{t('auth_comparison')}</h5>
                    <BeforeAfterSlider
                      beforeLabel={t('auth_before')}
                      afterLabel={t('auth_after')}
                      category={c.cat}
                    />
                  </div>

                  {c.proofImg && (
                    <div className="mt-2">
                      <small className="mute">{lang === 'ta' ? 'பதிவேற்றப்பட்ட கள ஆதாரம்:' : 'Uploaded Resolution Proof:'}</small>
                      <img src={c.proofImg} alt="Resolution proof" className="proof-thumb" />
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
