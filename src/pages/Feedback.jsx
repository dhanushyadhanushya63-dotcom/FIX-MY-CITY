import { useState } from 'react';
import { FaCommentDots, FaPaperPlane } from 'react-icons/fa';
import { useT } from '../i18n.jsx';
import { Thanks } from '../ui.jsx';

const FACES = ['😞', '😕', '🙂', '😀', '🤩'];
const EMPTY = { type: 'feedback', rating: 0, name: '', email: '', msg: '' };

export default function Feedback({ send }) {
  const { t } = useT();
  const [f, setF] = useState(EMPTY);
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(false);
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (f.msg.trim().length < 10) return setErr(t('e_msg'));
    setErr('');
    send(f.type, { ...f, msg: f.msg.trim() });   // later: POST /api/feedback
    setF(EMPTY);
    setSent(true);
  };

  return (
    <section className="fb card">
      <div className="row"><span className="ico"><FaCommentDots /></span><div><h2>{t('fb_title')}</h2><p className="mute">{t('fb_sub')}</p></div></div>
      <form className="form" onSubmit={submit} noValidate>
        <fieldset className="seg">
          <legend>{t('fb_type')}</legend>
          {[['feedback', 'fb_fb'], ['suggestion', 'fb_su']].map(([v, k]) => (
            <label key={v} className={f.type === v ? 'on' : ''}>
              <input type="radio" name="type" value={v} checked={f.type === v} onChange={() => set('type', v)} />{t(k)}
            </label>
          ))}
        </fieldset>
        <fieldset className="faces">
          <legend>{t('fb_rate')}</legend>
          {FACES.map((x, i) => (
            <button key={x} type="button" role="radio" aria-checked={f.rating === i + 1} aria-label={(i + 1) + ' / 5'}
              className={f.rating === i + 1 ? 'on' : ''} onClick={() => set('rating', i + 1)}>{x}</button>
          ))}
        </fieldset>
        <div className="cols">
          <label className="field">{t('fb_name')}<input value={f.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" /></label>
          <label className="field">{t('fb_email')}<input type="email" value={f.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" /></label>
        </div>
        <label className="field">{t('fb_msg')} *
          <textarea rows="5" value={f.msg} onChange={(e) => set('msg', e.target.value)} aria-invalid={!!err} />
          {err && <span className="err">{err}</span>}
        </label>
        <div className="row end"><button className="solid" type="submit"><FaPaperPlane /> {t('fb_send')}</button></div>
      </form>
      {sent && <Thanks title={t('th_t')} text={t('th_f')} label={t('th_close')} onClose={() => setSent(false)} />}
    </section>
  );
}

// Star rating and comment validation added
