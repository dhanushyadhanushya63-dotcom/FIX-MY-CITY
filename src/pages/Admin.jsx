import { useMemo, useState } from 'react';
import Map from '../Map';
import { CATS, TEAMS, score, level, overdue, dupes, days } from '../data';
import { Plate, Chip } from '../ui';

const FILTERS = [['open', 'Open'], ['review', 'Needs review'], ['overdue', 'Overdue'], ['dup', 'Possible duplicates'], ['done', 'Resolved']];
const LV = { High: 'red', Medium: 'amber', Low: 'blue' };

export default function Admin({ items, move }) {
  const [f, setF] = useState('open');
  const [sel, setSel] = useState(null);
  const [team, setTeam] = useState({});
  const [reviewed, setReviewed] = useState({});
  const [reviewFilter, setReviewFilter] = useState('all');

  const rows = useMemo(() => items.map((c) => {
    const s = score(c, items), lv = level(s);
    return { ...c, s, lv, od: overdue(c), dup: dupes(c, items), tone: c.stage >= 4 ? 'green' : LV[lv] };
  }).sort((a, b) => (a.stage >= 4) - (b.stage >= 4) || b.s - a.s), [items]);

  const show = rows.filter((c) => ({ open: c.stage < 4, review: c.stage <= 1, overdue: c.od, dup: c.dup.length && c.stage < 2, done: c.stage >= 4 })[f]);
  const open = rows.filter((c) => c.stage < 4);
  const flagged = rows.map((c) => {
    const reasons = [];
    if (c.dup.length) reasons.push('Similar open complaint within 60 metres');
    if (!c.desc || c.desc.trim().length < 18) reasons.push('Description has limited detail');
    if (!c.area || /pinned location/i.test(c.area)) reasons.push('Location needs confirmation');
    if (!c.photo) reasons.push('No supporting photo attached');
    return { ...c, reasons, risk: Math.min(95, c.dup.length * 35 + (!c.desc || c.desc.trim().length < 18 ? 15 : 0) + (!c.area || /pinned location/i.test(c.area) ? 15 : 0) + (!c.photo ? 10 : 0)) };
  }).filter((c) => c.risk >= 35 && !reviewed[c.id]);
  const reviewRows = flagged.filter((c) => reviewFilter === 'all' || (reviewFilter === 'high' ? c.risk >= 60 : c.risk < 60));
  const focus = rows.find((c) => c.id === sel);
  const assign = (c) => {
    const t = team[c.id] || CATS[c.cat].team;
    if (c.stage === 0) move(c.id, 1);
    move(c.id, 2, { team: t }, c.id + ' assigned to ' + t);
  };

  return (
    <>
      <div className="summary" aria-label="Summary">
        <div><b>{open.length}</b> open</div>
        <div><b>{rows.filter((c) => c.stage <= 1).length}</b> waiting for review</div>
        <div className="bad"><b>{open.filter((c) => c.od).length}</b> overdue</div>
        <div className="bad"><b>{open.filter((c) => c.lv === 'High').length}</b> high priority</div>
      </div>
      <section className="fraud-panel">
        <div className="row between"><div><span className="eyebrow">ADMIN REVIEW WORKSPACE</span><h2>Smart complaint validation</h2><p className="mute small">Flags are suggestions for human review, not proof of fraud. Never auto-reject a complaint based only on this score.</p></div><span className="risk-count">{flagged.length} to review</span></div>
        <div className="chips"><button className={'pick' + (reviewFilter === 'all' ? ' on' : '')} onClick={() => setReviewFilter('all')}>All flags</button><button className={'pick' + (reviewFilter === 'high' ? ' on' : '')} onClick={() => setReviewFilter('high')}>Higher risk</button><button className={'pick' + (reviewFilter === 'medium' ? ' on' : '')} onClick={() => setReviewFilter('medium')}>Needs details</button></div>
        {reviewRows.length === 0 ? <p className="empty">No complaints currently need additional validation.</p> : <div className="fraud-grid">{reviewRows.map((c) => <article className="fraud-card" key={c.id}>
          <div className="row between"><Plate id={c.id}/><Chip tone={c.risk >= 60 ? 'red' : 'amber'}>{c.risk >= 60 ? 'Higher review priority' : 'Check details'} · {c.risk}%</Chip></div>
          <p><b>{c.desc}</b></p><p className="small mute">{c.area} · {CATS[c.cat].label}</p>
          <ul>{c.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
          <div className="row"><button className="solid" onClick={() => setReviewed((x) => ({...x, [c.id]: 'verified'}))}>Verify</button><button className="ghost" onClick={() => setReviewed((x) => ({...x, [c.id]: 'duplicate'}))}>Mark duplicate</button><button className="ghost" onClick={() => setReviewed((x) => ({...x, [c.id]: 'info'}))}>Request details</button></div>
        </article>)}</div>}
      </section>
      <div className="split admin">
        <div className="sticky">
          <Map items={rows} focus={focus} selected={sel} onSelect={setSel} height={520} label="Complaint hotspots" />
          <p className="legend"><i className="d red" />High <i className="d amber" />Medium <i className="d blue" />Low <i className="d green" />Resolved</p>
        </div>
        <section aria-label="Complaint queue">
          <div className="chips">{FILTERS.map(([k, l]) => <button key={k} className={'pick' + (f === k ? ' on' : '')} onClick={() => setF(k)}>{l}</button>)}</div>
          {show.length === 0 && <p className="empty">No complaints match this filter.</p>}
          {show.map((c) => (
            <article key={c.id} className={'card' + (sel === c.id ? ' sel' : '')} onClick={() => setSel(c.id)}>
              <div className="row between"><Plate id={c.id} />
                <div className="row">{c.od && <Chip tone="red">Overdue</Chip>}{c.stage < 4 && <Chip tone={LV[c.lv]}>{c.lv} priority</Chip>}</div></div>
              <p>{c.desc}</p>
              <p className="mute small">{CATS[c.cat].label} · {c.area} · {days(c)} · by {c.by}</p>
              {c.dup.length > 0 && c.stage < 2 && <p className="note">Possible duplicate of {c.dup.map((d) => d.id).join(', ')}. Check before assigning.</p>}
              {c.stage < 2 ? (
                <div className="row">
                  <select aria-label={'Team for ' + c.id} value={team[c.id] || CATS[c.cat].team} onChange={(e) => setTeam({ ...team, [c.id]: e.target.value })}>
                    {TEAMS.map((t) => <option key={t}>{t}</option>)}</select>
                  <button className="solid" onClick={(e) => { e.stopPropagation(); assign(c); }}>Assign</button>
                </div>
              ) : <p className="small"><b>{['', '', 'Assigned', 'In progress', 'Resolved', 'Closed'][c.stage]}</b> · {c.team}</p>}
            </article>
          ))}
        </section>
      </div>
    </>
  );
}

// Admin stats cards: total, resolved, pending, in-progress
