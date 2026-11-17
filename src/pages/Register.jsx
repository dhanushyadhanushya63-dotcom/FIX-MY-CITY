import { useState } from 'react';
import { FaTrashAlt, FaRoad, FaLightbulb, FaTint, FaEllipsisH, FaLeaf, FaCloudUploadAlt, FaCheckCircle, FaPrint, FaCopy, FaMapMarkerAlt } from 'react-icons/fa';
import Map from '../Map';
import { CATS, dupes } from '../data';
import { CITIZEN } from '../data';

const ICONS = { garbage: FaTrashAlt, pothole: FaRoad, light: FaLightbulb, leakage: FaTint, other: FaEllipsisH };

export default function Register({ items, add, go }) {
  const [cat, setCat] = useState('garbage');
  const [loc, setLoc] = useState('');
  const [desc, setDesc] = useState('');
  const [otherDetails, setOtherDetails] = useState('');
  const [pin, setPin] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [sat, setSat] = useState(false);
  const [err, setErr] = useState({});
  const [done, setDone] = useState(null);
  const [searching, setSearching] = useState(false);
  const similar = pin ? dupes({ id: 'new', cat, ...pin }, items) : [];

  const drop = (p) => { setPin(p); setErr((e) => ({ ...e, pin: '' })); if (!loc) setLoc('Pinned at ' + p.lat.toFixed(4) + ', ' + p.lng.toFixed(4)); };
  const locate = () => navigator.geolocation?.getCurrentPosition((p) => drop({ lat: p.coords.latitude, lng: p.coords.longitude }),
    () => setErr((e) => ({ ...e, pin: 'Location access was blocked. Tap the map to drop a pin instead.' })));
  const reset = () => { setLoc(''); setDesc(''); setOtherDetails(''); setPin(null); setPhoto(null); setErr({}); };
  const findAddress = async () => {
    if (!loc.trim()) return setErr((e) => ({ ...e, pin: 'Enter an area or landmark to search.' }));
    setSearching(true);
    try {
      const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(loc.trim() + ', Chennai, India');
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      const data = await res.json();
      if (!data.length) throw new Error('No matching place found. Try a nearby landmark.');
      drop({ lat: Number(data[0].lat), lng: Number(data[0].lon) });
      setLoc(data[0].display_name);
    } catch (e) { setErr((x) => ({ ...x, pin: e.message || 'Could not find that place.' })); }
    finally { setSearching(false); }
  };
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (desc.trim().length < 10) er.desc = 'Describe the problem in at least 10 characters.';
    if (cat === 'other' && otherDetails.trim().length < 3) er.otherDetails = 'Please specify what type of issue you are reporting.';
    if (!pin) er.pin = 'Tap the map to drop a pin, or use your location.';
    setErr(er);
    if (Object.keys(er).length) return;
    const receiptData = {
      cat,
      categoryLabel: CATS[cat]?.label || cat,
      otherDetails: cat === 'other' ? otherDetails.trim() : '',
      desc: cat === 'other' ? `[${otherDetails.trim()}] ${desc.trim()}` : desc.trim(),
      area: loc || 'Pinned location',
      lat: pin.lat,
      lng: pin.lng,
      by: CITIZEN,
      submittedAt: new Date().toISOString(),
    };
    const id = add({ ...receiptData, photo: photo && URL.createObjectURL(photo) });
    setDone({ id, ...receiptData });
    reset();
  };

  const printReceipt = () => window.print();
  const copyReceiptId = async () => {
    try { await navigator.clipboard.writeText(done.id); }
    catch { const el = document.createElement('textarea'); el.value = done.id; document.body.appendChild(el); el.select(); document.execCommand('copy'); el.remove(); }
  };

  if (done) return (
    <section className="receipt-wrap">
      <div className="receipt-actions no-print">
        <div><FaCheckCircle className="big-ok" /><h2>Complaint successfully registered</h2><p className="mute">Your digital acknowledgement is ready. Save it for future reference.</p></div>
        <div className="row">
          <button className="ghost" onClick={copyReceiptId}><FaCopy /> Copy ID</button>
          <button className="solid" onClick={printReceipt}><FaPrint /> Save / Print PDF</button>
        </div>
      </div>
      <article className="receipt" aria-label="Complaint acknowledgement receipt">
        <header className="receipt-head">
          <div className="receipt-brand"><span className="receipt-mark">F</span><div><b>FixMyStreet</b><small>Our City, Our Responsibility</small></div></div>
          <span className="receipt-status">SUBMITTED</span>
        </header>
        <div className="receipt-title"><span>DIGITAL COMPLAINT ACKNOWLEDGEMENT</span><h2>Complaint Receipt</h2><p>This receipt confirms that your civic issue report has been submitted.</p></div>
        <div className="receipt-id"><small>YOUR COMPLAINT ID</small><strong>{done.id}</strong></div>
        <div className="receipt-details">
          <div><small>Issue category</small><b>{done.categoryLabel}{done.otherDetails ? ` — ${done.otherDetails}` : ''}</b></div>
          <div><small>Submitted on</small><b>{new Date(done.submittedAt).toLocaleString()}</b></div>
          <div className="receipt-location"><small><FaMapMarkerAlt /> Reported location</small><b>{done.area}</b><span>Latitude: {done.lat.toFixed(6)} · Longitude: {done.lng.toFixed(6)}</span></div>
          <div className="receipt-description"><small>Issue description</small><p>{done.desc}</p></div>
        </div>
        <div className="receipt-note"><b>What happens next?</b><p>Your complaint will be reviewed and assigned to the relevant department. Use your Complaint ID to track its progress. This receipt confirms submission, not resolution.</p></div>
        <footer className="receipt-foot"><span>Keep this receipt for your records.</span><span>FixMyStreet · Citizen Services</span></footer>
      </article>
      <div className="row center no-print receipt-bottom">
        <button className="solid" onClick={() => go('track', done.id)}>Track my complaint</button>
        <button className="ghost" onClick={() => setDone(null)}>Register another issue</button>
      </div>
    </section>
  );

  return (
    <div className="reg">
      <aside className="card side">
        <h3>Complaint Categories</h3>
        {Object.entries(CATS).map(([k, v]) => { const Icon = ICONS[k]; return (
          <button key={k} type="button" className={'cat' + (cat === k ? ' on' : '')} onClick={() => setCat(k)} aria-pressed={cat === k}><Icon />{v.label}</button>); })}
        <div className="green-card"><FaLeaf /><b>Keep Our City Clean &amp; Green</b></div>
      </aside>

      <form className="card form" onSubmit={submit} noValidate>
        <h2>Register a Complaint</h2>
        <div className="cols">
          <div className="stack">
            <label className="field">Location / landmark *
              <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Search a street, area or landmark" />
            </label>
            <button type="button" className="ghost" onClick={findAddress} disabled={searching}>{searching ? 'Searching…' : 'Find this place on map'}</button>
            <label className="field">Category *
              <select value={cat} onChange={(e) => setCat(e.target.value)}>{Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
            </label>
            {cat === 'other' && <label className="field other-detail-field">Please specify the issue type *
              <input value={otherDetails} onChange={(e) => setOtherDetails(e.target.value)} placeholder="E.g. fallen tree, damaged public bench, stray animal issue" aria-invalid={!!err.otherDetails} />
              {err.otherDetails && <span className="err">{err.otherDetails}</span>}
            </label>}
            <label className="field">Description *
              <textarea rows="4" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe your complaint..." aria-invalid={!!err.desc} />
              {err.desc && <span className="err">{err.desc}</span>}
            </label>
            <label className="drop"><FaCloudUploadAlt /><b>Upload Photo (Optional)</b><small>{photo ? photo.name : 'Choose a clear photo of the issue'}</small>
              <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file && file.size > 5 * 1024 * 1024) { setErr((x) => ({ ...x, photo: 'Choose an image smaller than 5 MB.' })); return; } setErr((x) => ({ ...x, photo: '' })); setPhoto(file || null); }} /></label>
            {err.photo && <span className="err">{err.photo}</span>}
            {photo && <img className="thumb photo-preview" src={URL.createObjectURL(photo)} alt="Selected complaint preview" />}
          </div>
          <div className="stack">
            <div className="tabs" role="tablist">
              <button type="button" role="tab" aria-selected={!sat} className={!sat ? 'on' : ''} onClick={() => setSat(false)}>Map</button>
              <button type="button" role="tab" aria-selected={sat} className={sat ? 'on' : ''} onClick={() => setSat(true)}>Satellite</button>
            </div>
            <Map pin={pin} onPick={drop} satellite={sat} height={340} label="Tap or drag the marker to select the complaint location" />
            <p className="map-hint">Click anywhere on the map to place a pin, then drag the pin to adjust the exact location.</p>
            <button type="button" className="ghost" onClick={locate}>Use my current location</button>
            {pin && <p className="small mute">Selected: {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)} · Drag the map pin to adjust.</p>}
            {err.pin && <span className="err">{err.pin}</span>}
            {similar.length > 0 && <p className="note">A similar open report is already nearby ({similar[0].id}). You can still submit; repeat reports raise the priority.</p>}
          </div>
        </div>
        <div className="row end"><button type="button" className="ghost" onClick={reset}>Reset</button><button className="solid" type="submit">Submit Complaint</button></div>
      </form>
    </div>
  );
}

// Form validation rules: email, phone, password strength
