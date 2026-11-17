import { useState } from 'react';
import { FaSearch, FaCheckCircle, FaSearchLocation } from 'react-icons/fa';
import { useT } from '../i18n.jsx';
import { FLOW } from '../flow.js';
import TrackArt from './TrackArt';
import { CATS, stamp } from '../data';
import { Status, Timeline } from '../ui';
import { CITIZEN } from '../data';

export default function Track({ items, move, initialId }) {
  const { t } = useT();
  const [q, setQ] = useState(initialId);
  const [shown, setShown] = useState(initialId);
  const [miss, setMiss] = useState(false);
  const c = items.find((x) => x.id === shown);
  const mine = items.filter((x) => x.by === CITIZEN).sort((a, b) => b.id.localeCompare(a.id));
  const look = (e, id = q) => { e?.preventDefault(); const f = items.find((x) => x.id === id.trim().toUpperCase()); setMiss(!f); setShown(f ? f.id : ''); setQ(id.trim().toUpperCase()); };

  return (
    <div className="track">
      <h2>{t('tr_title')}</h2>
      <form className="card search" onSubmit={look}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('tr_ph')} aria-label="Complaint ID" />
        <button className="solid" type="submit"><FaSearch /> {t('tr_btn')}</button>
      </form>
      {miss && <div className="miss" role="alert"><FaSearchLocation aria-hidden="true" /><p className="err">{t('tr_miss')}</p><p className="small">Forgot your ID? Check the confirmation shown after submission or your saved receipt. In this demo, choose a recent complaint below. A live service should verify your registered contact before recovering an ID.</p></div>}
      <section className="card">
        <h3>{c ? t('tr_where') : t('tr_journey')}</h3>
        <p className="mute small">{c ? t('tr_where_d') : t('tr_journey_d')}</p>
        <TrackArt stage={c ? c.stage : -1} />
      </section>
      {!c && (
        <>
          <section aria-label={t('tr_guide')}>
            <h3>{t('tr_guide')}</h3>
            <div className="guide">
              {FLOW.map(([Icon, who], i) => (
                <div key={i} className="gcard" style={{ '--i': i }}>
                  <span className="ico"><Icon /></span>
                  <div><b>{i + 1}. {t('s' + i + 't')}</b><small>{t('s' + i + 'd')}</small><em className={'who ' + who}>{t('r_' + who)}</em></div>
                </div>
              ))}
            </div>
          </section>
          <div className="card"><b>{t('tr_recent')}</b>
            <div className="chips">{mine.map((m) => <button key={m.id} className="pick" onClick={(e) => look(e, m.id)}>{m.id} · {CATS[m.cat].label}</button>)}</div></div>
        </>
      )}
      {c && (
        <article className="card result">
          <div className="row between">
            <div className="row"><FaCheckCircle className="ok" /><h3>Complaint ID: {c.id}</h3></div><Status c={c} />
          </div>
          <p className="mute">{t('tr_cat')}: {CATS[c.cat].label}<br />{t('tr_sub')}: {stamp(c.history[0].at)}{c.team ? <><br />{t('tr_by')}: {c.team}</> : null}</p>
          <p>{c.desc}</p>
          <Timeline c={c} />
          {c.proofImg && <img className="thumb" src={c.proofImg} alt="Resolution proof" />}
          {c.stage === 4 && (
            <div className="feedback"><b>The team marked this resolved{c.proof ? ' and attached proof' : ''}. How did they do?</b>
              <div className="row">{[1, 2, 3, 4, 5].map((n) => <button key={n} className="ghost" aria-label={n + ' out of 5'} onClick={() => move(c.id, 5, { rating: n }, 'Thanks, ' + c.id + ' is closed')}>{n}</button>)}</div></div>)}
          {c.stage === 5 && c.rating && <p className="mute small">Closed with a rating of {c.rating} out of 5.</p>}
          <button className="ghost" onClick={() => { setShown(''); setQ(''); }}>{t('tr_another')}</button>
        </article>
      )}
    </div>
  );
}
