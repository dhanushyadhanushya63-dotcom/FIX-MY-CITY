import { useState } from 'react';
import { FaTrashAlt, FaRoad, FaLightbulb, FaTint, FaEllipsisH, FaLeaf, FaCloudUploadAlt, FaCheckCircle, FaPrint, FaCopy, FaMapMarkerAlt, FaTimes, FaImage, FaWhatsapp, FaMicrophone, FaHardHat } from 'react-icons/fa';
import Map from '../Map';
import { CATS, dupes, getCatLabel, getTeamLabel } from '../data';
import { CITIZEN } from '../data';
import { useT } from '../i18n.jsx';

const ICONS = { garbage: FaTrashAlt, pothole: FaRoad, light: FaLightbulb, leakage: FaTint, other: FaEllipsisH };

export default function Register({ items, add, go, currentUser }) {
  const { t, lang } = useT();
  const [cat, setCat] = useState('garbage');
  const [loc, setLoc] = useState('');
  const [desc, setDesc] = useState('');
  const [otherDetails, setOtherDetails] = useState('');
  const [pin, setPin] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [sat, setSat] = useState(false);
  const [err, setErr] = useState({});
  const [done, setDone] = useState(null);
  const [searching, setSearching] = useState(false);
  const [listening, setListening] = useState(false);
  const similar = pin ? dupes({ id: 'new', cat, ...pin }, items) : [];

  const drop = (p) => {
    setPin(p);
    setErr((e) => ({ ...e, pin: '' }));
    setLoc((curr) => (!curr || curr.startsWith('Pinned at') || curr.startsWith('வரைபடத்தில்') ? (lang === 'ta' ? `வரைபடத்தில் குறிக்கப்பட்டது: ${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}` : `Pinned at ${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`) : curr));
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setErr((e) => ({ ...e, pin: lang === 'ta' ? 'உங்கள் உலாவியில் இருப்பிட சேவை ஆதரிக்கப்படவில்லை.' : 'Location access is not supported by your browser.' }));
      return;
    }
    setSearching(true);
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        const coords = { lat: p.coords.latitude, lng: p.coords.longitude };
        drop(coords);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            setLoc(data.display_name);
          }
        } catch {}
        setSearching(false);
      },
      () => {
        setSearching(false);
        setErr((e) => ({ ...e, pin: lang === 'ta' ? 'இருப்பிட அனுமதி மறுக்கப்பட்டது. வரைபடத்தில் கிளிக் செய்து இடத்தைக் குறிக்கவும்.' : 'Location access was blocked. Tap the map to drop a pin instead.' }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview(null);
  };

  const reset = () => {
    setLoc('');
    setDesc('');
    setOtherDetails('');
    setPin(null);
    removePhoto();
    setErr({});
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErr((x) => ({ ...x, photo: lang === 'ta' ? '5 MB-க்கு குறைவான படத்தைத் தேர்வு செய்யவும்.' : 'Choose an image smaller than 5 MB.' }));
      return;
    }
    setErr((x) => ({ ...x, photo: '' }));
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // Speech-to-Text Voice Recording
  const toggleListening = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert(lang === 'ta' ? 'குரல் தட்டச்சு Google Chrome மற்றும் Microsoft Edge உலாவிகளில் ஆதரிக்கப்படுகிறது.' : 'Voice speech recognition is supported in Google Chrome, Microsoft Edge, and modern mobile browsers.');
      return;
    }

    if (listening) {
      window._fmsSpeechRec?.stop();
      setListening(false);
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
      rec.onstart = () => setListening(true);
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setDesc((prev) => (prev ? prev + ' ' + transcript : transcript));
        setListening(false);
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      window._fmsSpeechRec = rec;
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const findAddress = async () => {
    if (!loc.trim()) return setErr((e) => ({ ...e, pin: lang === 'ta' ? 'தேட தெரு அல்லது அடையாளத்தை உள்ளிடவும்.' : 'Enter an area or landmark to search.' }));
    setSearching(true);
    try {
      const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(loc.trim() + ', Chennai, India');
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      const data = await res.json();
      if (!data.length) throw new Error(lang === 'ta' ? 'பொருந்தும் இடம் கிடைக்கவில்லை. அருகிலுள்ள அடையாளத்தை முயற்சிக்கவும்.' : 'No matching place found. Try a nearby landmark.');
      drop({ lat: Number(data[0].lat), lng: Number(data[0].lon) });
      setLoc(data[0].display_name);
    } catch (e) { setErr((x) => ({ ...x, pin: e.message || 'Could not find that place.' })); }
    finally { setSearching(false); }
  };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (desc.trim().length < 10) er.desc = lang === 'ta' ? 'குறைந்தது 10 எழுத்துகளில் பிரச்சினையை விவரிக்கவும்.' : 'Describe the problem in at least 10 characters.';
    if (cat === 'other' && otherDetails.trim().length < 3) er.otherDetails = lang === 'ta' ? 'பிரச்சினை வகையைக் குறிப்பிடவும்.' : 'Please specify what type of issue you are reporting.';
    if (!pin) er.pin = lang === 'ta' ? 'இடத்தைக் குறிக்க வரைபடத்தில் தட்டவும் அல்லது தற்போதைய இடத்தைப் பயன்படுத்தவும்.' : 'Tap the map to drop a pin, or use your location.';
    setErr(er);
    if (Object.keys(er).length) return;

    // AUTO-ROUTING TO CORRECT AUTHORITY BASED ON CATEGORY
    const assignedTeam = CATS[cat]?.team || 'Zone 4 Roads';

    const receiptData = {
      cat,
      categoryLabel: getCatLabel(cat, lang),
      otherDetails: cat === 'other' ? otherDetails.trim() : '',
      desc: cat === 'other' ? `[${otherDetails.trim()}] ${desc.trim()}` : desc.trim(),
      area: loc || (lang === 'ta' ? 'குறிக்கப்பட்ட இடம்' : 'Pinned location'),
      lat: pin.lat,
      lng: pin.lng,
      by: currentUser?.name || CITIZEN,
      team: assignedTeam,
      submittedAt: new Date().toISOString(),
    };
    const id = add({ ...receiptData, photo: photoPreview });
    setDone({ id, ...receiptData });
    reset();
  };

  const printReceipt = () => window.print();
  const copyReceiptId = async () => {
    try { await navigator.clipboard.writeText(done.id); }
    catch { const el = document.createElement('textarea'); el.value = done.id; document.body.appendChild(el); el.select(); document.execCommand('copy'); el.remove(); }
  };

  const shareWhatsApp = () => {
    if (!done) return;
    const msg = encodeURIComponent(
      `🚨 *FixMyStreet Civic Report Acknowledgement*\n\n` +
      `🆔 *Complaint ID:* ${done.id}\n` +
      `📌 *Issue Category:* ${done.categoryLabel}\n` +
      `🏢 *Assigned Authority:* ${getTeamLabel(done.team, lang)}\n` +
      `📍 *Location:* ${done.area}\n` +
      `📅 *Date:* ${new Date(done.submittedAt).toLocaleDateString()}\n` +
      `📝 *Details:* ${done.desc}\n\n` +
      `🔗 Track progress live at: http://localhost:5173\n\n` +
      `_FixMyStreet · ${t('our_tagline')}_`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  if (done) return (
    <section className="receipt-wrap">
      <div className="receipt-actions no-print">
        <div>
          <FaCheckCircle className="big-ok" />
          <h2>{t('reg_success')}</h2>
          <p className="mute">{t('reg_success_hint')}</p>
        </div>
        <div className="row">
          <button className="ghost" onClick={copyReceiptId}><FaCopy /> {t('reg_copy')}</button>
          <button className="whatsapp-btn" onClick={shareWhatsApp}><FaWhatsapp /> {t('reg_share')}</button>
          <button className="solid" onClick={printReceipt}><FaPrint /> {t('reg_print')}</button>
        </div>
      </div>
      <article className="receipt" aria-label="Complaint acknowledgement receipt">
        <header className="receipt-head">
          <div className="receipt-brand"><span className="receipt-mark">F</span><div><b>FixMyStreet</b><small>{t('our_tagline')}</small></div></div>
          <span className="receipt-status">{lang === 'ta' ? 'சமர்ப்பிக்கப்பட்டது' : 'SUBMITTED'}</span>
        </header>
        <div className="receipt-title"><span>{t('reg_receipt')}</span><h2>{t('reg_receipt_title')}</h2><p>{t('reg_receipt_hint')}</p></div>
        <div className="receipt-id"><small>{t('reg_your_id')}</small><strong>{done.id}</strong></div>
        
        {/* Department Auto-Routing Badge */}
        <div className="auto-route-badge-box">
          <FaHardHat className="text-teal" />
          <div>
            <small>{lang === 'ta' ? 'தானாக ஒதுக்கப்பட்ட பொறுப்புத் துறை:' : 'Auto-routed to Responsible Authority:'}</small>
            <b>{getTeamLabel(done.team, lang)}</b>
            <span className="route-sub-badge">✓ {lang === 'ta' ? 'நிர்வாகி மற்றும் துறைக்கு உடனடி அறிவிப்பு அனுப்பப்பட்டது' : 'Admin & Authority notified immediately'}</span>
          </div>
        </div>

        <div className="receipt-details">
          <div><small>{t('reg_issue_cat')}</small><b>{done.categoryLabel}{done.otherDetails ? ` — ${done.otherDetails}` : ''}</b></div>
          <div><small>{t('reg_submitted_on')}</small><b>{new Date(done.submittedAt).toLocaleString(lang === 'ta' ? 'ta-IN' : 'en-IN')}</b></div>
          <div className="receipt-location"><small><FaMapMarkerAlt /> {t('reg_reported_loc')}</small><b>{done.area}</b><span>{lang === 'ta' ? 'அட்சரேகை' : 'Latitude'}: {done.lat.toFixed(6)} · {lang === 'ta' ? 'தீர்க்கரேகை' : 'Longitude'}: {done.lng.toFixed(6)}</span></div>
          <div className="receipt-description"><small>{t('reg_issue_desc')}</small><p>{done.desc}</p></div>
        </div>
        <div className="receipt-note">
          <b>{t('reg_next')}</b>
          <p>{t('reg_next_hint')}</p>
        </div>
        <footer className="receipt-foot"><span>{t('reg_keep')}</span><span>FixMyStreet · Citizen Services</span></footer>
      </article>
      <div className="row center no-print receipt-bottom">
        <button className="solid" onClick={() => go('track', done.id)}>{t('reg_track_mine')}</button>
        <button className="ghost" onClick={() => go('citizen')}>{t('reg_go_citizen')}</button>
        <button className="ghost" onClick={() => setDone(null)}>{t('reg_another')}</button>
      </div>
    </section>
  );

  return (
    <div className="reg">
      <aside className="card side">
        <h3>{t('reg_cats')}</h3>
        {Object.entries(CATS).map(([k, v]) => { const Icon = ICONS[k]; return (
          <button key={k} type="button" className={'cat' + (cat === k ? ' on' : '')} onClick={() => setCat(k)} aria-pressed={cat === k}>
            <Icon />
            <span>{getCatLabel(k, lang)}</span>
            <small className="cat-team-hint">➔ {getTeamLabel(v.team, lang)}</small>
          </button>); })}
        <div className="green-card"><FaLeaf /><b>{t('reg_green')}</b></div>
      </aside>

      <form className="card form" onSubmit={submit} noValidate>
        <h2>{t('reg_title')}</h2>
        <div className="cols">
          <div className="stack">
            <label className="field">{t('reg_loc')} *
              <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder={t('reg_loc_ph')} />
            </label>
            <button type="button" className="ghost" onClick={findAddress} disabled={searching}>
              {searching ? t('reg_searching') : t('reg_find')}
            </button>
            <label className="field">{t('reg_category')} *
              <select value={cat} onChange={(e) => setCat(e.target.value)}>
                {Object.entries(CATS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {getCatLabel(k, lang)} ({getTeamLabel(v.team, lang)})
                  </option>
                ))}
              </select>
            </label>

            {/* Auto-routed authority indicator */}
            <div className="auto-assign-preview">
              <FaHardHat className="text-teal" />
              <span>
                {lang === 'ta' ? 'பொறுப்பான துறை:' : 'Assigned Department:'}{' '}
                <b>{getTeamLabel(CATS[cat]?.team, lang)}</b>
              </span>
            </div>

            {cat === 'other' && <label className="field other-detail-field">{t('reg_other_specify')} *
              <input value={otherDetails} onChange={(e) => setOtherDetails(e.target.value)} placeholder={t('reg_other_ph')} aria-invalid={!!err.otherDetails} />
              {err.otherDetails && <span className="err">{err.otherDetails}</span>}
            </label>}
            
            <div className="field">
              <div className="row between" style={{ marginBottom: '.25rem' }}>
                <span style={{ fontWeight: 600 }}>{t('reg_desc')} *</span>
                <button
                  type="button"
                  className={`voice-btn ${listening ? 'listening' : ''}`}
                  onClick={toggleListening}
                  title={listening ? (lang === 'ta' ? 'கேட்கிறது... நிறுத்த கிளிக் செய்யவும்' : 'Listening... click to stop') : (lang === 'ta' ? 'பேச கிளிக் செய்யவும்' : 'Click to speak description')}
                >
                  <FaMicrophone /> {listening ? t('reg_voice_on') : t('reg_voice')}
                </button>
              </div>
              <textarea rows="4" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={t('reg_desc_ph')} aria-invalid={!!err.desc} />
              {err.desc && <span className="err">{err.desc}</span>}
            </div>
            
            {/* Upload Area with Photo Preview */}
            <div className="upload-container">
              <label className="field-label" style={{ fontWeight: 600, fontSize: '.9rem', color: 'var(--navy)' }}>
                {t('reg_photo')}
              </label>
              {!photoPreview ? (
                <label className="drop">
                  <FaCloudUploadAlt style={{ fontSize: '1.8rem', marginBottom: '.2rem' }} />
                  <b>{t('reg_photo_btn')}</b>
                  <small>{t('reg_photo_hint')}</small>
                  <input type="file" accept="image/*" onChange={handlePhotoSelect} />
                </label>
              ) : (
                <div className="preview-card">
                  <div className="preview-thumb-wrap">
                    <img className="preview-thumb" src={photoPreview} alt="Selected complaint issue" />
                    <button type="button" className="preview-remove" onClick={removePhoto} title="Remove photo" aria-label="Remove photo">
                      <FaTimes />
                    </button>
                  </div>
                  <div className="preview-meta">
                    <span className="preview-title"><FaImage /> {photo?.name}</span>
                    <span className="preview-size">{photo?.size ? (photo.size / (1024 * 1024)).toFixed(2) + ' MB' : ''}</span>
                    <button type="button" className="preview-change-btn" onClick={() => document.getElementById('reg-photo-input')?.click()}>
                      {t('reg_change_photo')}
                    </button>
                    <input id="reg-photo-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoSelect} />
                  </div>
                </div>
              )}
              {err.photo && <span className="err">{err.photo}</span>}
            </div>
          </div>
          
          <div className="stack">
            <div className="tabs" role="tablist">
              <button type="button" role="tab" aria-selected={!sat} className={!sat ? 'on' : ''} onClick={() => setSat(false)}>{t('reg_map')}</button>
              <button type="button" role="tab" aria-selected={sat} className={sat ? 'on' : ''} onClick={() => setSat(true)}>{t('reg_satellite')}</button>
            </div>
            <Map pin={pin} onPick={drop} satellite={sat} height={340} label={t('reg_map_hint')} />
            <p className="map-hint">{t('reg_map_hint')}</p>
            <button type="button" className="ghost" onClick={locate} disabled={searching}>
              <FaMapMarkerAlt /> {searching ? t('reg_locating') : t('reg_locate')}
            </button>
            {pin && (
              <div className="location-success-badge">
                ✓ {lang === 'ta' ? `குறிக்கப்பட்டது: ${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}` : `Pinned at ${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)} (Drag pin to adjust)`}
              </div>
            )}
            {err.pin && <span className="err">{err.pin}</span>}
            {similar.length > 0 && <p className="note">{t('reg_similar')} ({similar[0].id}). {t('reg_similar2')}</p>}
          </div>
        </div>
        <div className="row end">
          <button type="button" className="ghost" onClick={reset}>{t('reg_reset')}</button>
          <button className="solid" type="submit">{t('reg_submit')}</button>
        </div>
      </form>
    </div>
  );
}
