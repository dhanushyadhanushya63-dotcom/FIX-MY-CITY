import { useState } from 'react';
import { FaSearch, FaCheckCircle, FaSearchLocation, FaHardHat } from 'react-icons/fa';
import { useT } from '../i18n.jsx';
import { FLOW } from '../flow.js';
import TrackArt from './TrackArt';
import { CATS, stamp, getCatLabel, getTeamLabel } from '../data';
import { Status, Timeline } from '../ui';
import { CITIZEN } from '../data';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

export default function Track({ items, move, initialId, currentUser }) {
  const { t, lang } = useT();
  const [q, setQ] = useState(initialId || '');
  const [shown, setShown] = useState(initialId || '');
  const [miss, setMiss] = useState(false);
  const c = items.find((x) => x.id === shown);
  const currentCitizen = currentUser?.name || CITIZEN;
  const mine = items
    .filter((x) => (x.by || '').toLowerCase() === currentCitizen.toLowerCase() || x.by === CITIZEN)
    .sort((a, b) => b.id.localeCompare(a.id));
  const look = (e, id = q) => {
    e?.preventDefault();
    const f = items.find((x) => x.id === id.trim().toUpperCase());
    setMiss(!f);
    setShown(f ? f.id : '');
    setQ(id.trim().toUpperCase());
  };

  return (
    <div className="track">
      <h2>{t('tr_title')}</h2>
      <form className="card search" onSubmit={look}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('tr_ph')}
          aria-label={t('tr_title')}
        />
        <button className="solid" type="submit"><FaSearch /> {t('tr_btn')}</button>
      </form>
      {miss && (
        <div className="miss" role="alert">
          <FaSearchLocation aria-hidden="true" />
          <p className="err">{t('tr_miss')}</p>
        </div>
      )}
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
                  <div>
                    <b>{i + 1}. {t('s' + i + 't')}</b>
                    <small>{t('s' + i + 'd')}</small>
                    <em className={'who ' + who}>{t('r_' + who)}</em>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <div className="card">
            <b>{t('tr_recent')}</b>
            <div className="chips">
              {mine.map((m) => (
                <button key={m.id} className="pick" onClick={(e) => look(e, m.id)}>
                  {m.id} · {getCatLabel(m.cat, lang)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      {c && (
        <article className="card result">
          <div className="row between">
            <div className="row">
              <FaCheckCircle className="ok" />
              <h3>{lang === 'ta' ? `புகார் எண்: ${c.id}` : `Complaint ID: ${c.id}`}</h3>
            </div>
            <Status c={c} />
          </div>
          <p className="mute">
            {t('tr_cat')}: <b>{getCatLabel(c.cat, lang)}</b><br />
            {t('tr_sub')}: {stamp(c.history[0].at)}
            {c.team ? (
              <>
                <br />
                {t('tr_by')}: <b>{getTeamLabel(c.team, lang)}</b>
              </>
            ) : null}
          </p>
          <p>{c.desc}</p>
          <Timeline c={c} />
          
          {/* Interactive Before & After Slider for Resolved Complaints */}
          {c.stage >= 4 && (
            <div style={{ marginTop: '1.2rem', marginBottom: '1.2rem' }}>
              <h4 style={{ margin: '0 0 .5rem', fontSize: '1rem', color: 'var(--navy)' }}>
                {lang === 'ta' ? 'தீர்வு சரிபார்ப்பு ஆதாரம் (முன் & பின்)' : 'Resolution Verification Proof (Before & After)'}
              </h4>
              <p className="mute small" style={{ marginBottom: '.8rem' }}>
                {lang === 'ta'
                  ? `${getTeamLabel(c.team, lang)} மேற்கொண்ட பணியைச் சரிபார்க்க ஸ்லைடரை நகர்த்தவும்.`
                  : `Drag the interactive slider to inspect the verified fix completed by ${getTeamLabel(c.team, lang)}.`}
              </p>
              <BeforeAfterSlider
                beforeLabel={lang === 'ta' ? 'முன்: புகாரளித்தது' : 'BEFORE: REPORTED'}
                afterLabel={lang === 'ta' ? 'பின்: சரிசெய்யப்பட்டது' : 'AFTER: RESOLVED & VERIFIED'}
                category={c.cat}
              />
            </div>
          )}

          {c.proofImg && <img className="thumb" src={c.proofImg} alt="Resolution proof" />}
          {c.stage === 4 && (
            <div className="feedback">
              <b>{lang === 'ta' ? 'குழு இப்பணியைத் தீர்த்துவிட்டது. உங்கள் மதிப்பீடு என்ன?' : 'The team marked this resolved and attached proof. How did they do?'}</b>
              <div className="row">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className="ghost"
                    aria-label={n + ' out of 5'}
                    onClick={() => move(c.id, 5, { rating: n }, lang === 'ta' ? `நன்றி, ${c.id} முடிக்கப்பட்டது.` : `Thanks, ${c.id} is closed`)}
                  >
                    ★ {n}
                  </button>
                ))}
              </div>
            </div>
          )}
          {c.stage === 5 && c.rating && (
            <p className="mute small">
              {lang === 'ta' ? `5-க்கு ${c.rating} நட்சத்திர மதிப்பீட்டுடன் முடிக்கப்பட்டது.` : `Closed with a rating of ${c.rating} out of 5.`}
            </p>
          )}
          <button className="ghost" onClick={() => { setShown(''); setQ(''); }}>{t('tr_another')}</button>
        </article>
      )}
    </div>
  );
}
