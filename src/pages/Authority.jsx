import { useState } from 'react';
import { CATS, TEAMS, days } from '../data';
import { Plate, Chip, Tracker } from '../ui';

export default function Authority({ user, items, move }) {
  const [team, setTeam] = useState(user.team);
  const [selId, setSelId] = useState(null);
  const [note, setNote] = useState('');
  const [proof, setProof] = useState(null);
  const [err, setErr] = useState('');
  const list = items.filter((c) => c.team === team && c.stage >= 2).sort((a, b) => a.stage - b.stage);
  const c = list.find((x) => x.id === selId) || list[0];

  const withNote = () => (note.trim() ? { notes: [...c.notes, { t: note.trim(), at: new Date().toISOString() }] } : {});
  const start = () => { move(c.id, 3, withNote(), 'Work started on ' + c.id); setNote(''); };
  const resolve = () => {
    if (!proof) return setErr('Add an after-work photo before marking this resolved.');
    move(c.id, 4, { ...withNote(), proof: true, proofImg: URL.createObjectURL(proof) }, c.id + ' marked resolved');
    setNote(''); setProof(null); setErr('');
  };

  return (
    <>
      <div className="row between head">
        <h2>Assigned to your team</h2>
        <label className="inline">Team <select value={team} onChange={(e) => { setTeam(e.target.value); setSelId(null); }}>{TEAMS.map((t) => <option key={t}>{t}</option>)}</select></label>
      </div>
      {list.length === 0 ? <p className="empty">Nothing assigned to {team} yet. New assignments from the admin desk will appear here.</p> : (
        <div className="split">
          <section aria-label="Assigned complaints">
            {list.map((x) => (
              <button key={x.id} className={'item' + (c.id === x.id ? ' on' : '')} onClick={() => setSelId(x.id)}>
                <Plate id={x.id} /><span>{x.desc}</span><small>{x.area} · {['', '', 'New', 'In progress', 'Resolved', 'Closed'][x.stage]}</small>
              </button>
            ))}
          </section>
          <article className="panel">
            <div className="row between"><Plate id={c.id} /><Chip>{CATS[c.cat].label}</Chip></div>
            <h3>{c.desc}</h3>
            <p className="mute small">{c.area} · reported {days(c)} by {c.by} · {c.lat.toFixed(4)}, {c.lng.toFixed(4)}</p>
            <Tracker c={c} />
            {c.notes.map((n, i) => <p key={i} className="note">{n.t}</p>)}
            {c.proofImg && <img className="thumb" src={c.proofImg} alt="Resolution proof" />}
            {c.stage === 2 && (<>
              <label className="field">Progress note (optional)<input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Crew scheduled for tomorrow morning" /></label>
              <button className="solid" onClick={start}>Start work</button></>)}
            {c.stage === 3 && (<>
              <label className="field">Progress note (optional)<input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Patched and levelled" /></label>
              <label className="field">After-work photo (required)<input type="file" accept="image/*" onChange={(e) => setProof(e.target.files[0] || null)} />
                {err && <span className="err">{err}</span>}</label>
              <button className="solid" onClick={resolve}>Mark resolved</button></>)}
            {c.stage >= 4 && <p className="mute">{c.stage === 4 ? 'Resolved. Waiting for the citizen to confirm and rate the fix.' : 'Closed by the citizen' + (c.rating ? ' with a rating of ' + c.rating + ' out of 5.' : '.')}</p>}
          </article>
        </div>
      )}
    </>
  );
}

// Report management dashboard for authorities

// Filter by district and search by issue ID
