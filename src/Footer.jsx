import { useState } from 'react';
import { FaCity, FaPaperPlane, FaEnvelope } from 'react-icons/fa';
import { useT } from './i18n.jsx';
import { Thanks } from './ui.jsx';

const EMPTY = { name: '', email: '', q: '' };

export default function Footer({ go, send, links, showContact = false }) {
  const { t } = useT();
  const [f, setF] = useState(EMPTY);
  const [err, setErr] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = t('e_name');
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) er.email = t('e_email');
    if (f.q.trim().length < 10) er.q = t('e_q');
    setErr(er);
    if (Object.keys(er).length) return;
    send('query', { name: f.name.trim(), email: f.email.trim(), message: f.q.trim() });   // later: POST /api/contact
    setF(EMPTY);
    setSent(true);
  };

  return (
    <footer className="foot">
      <div className="foot-grid">
        <div>
          <div className="row foot-brand"><FaCity /><b>FixMyStreet</b></div>
          <p>{t('ft_about')}</p>
          <p className="small foot-mute">{t('ft_pilot')}</p>
        </div>
        {showContact && <form onSubmit={submit} noValidate aria-label={t('ft_contact')} className="foot-form">
          <h3><FaEnvelope /> {t('ft_contact')}</h3>
          <label>{t('ft_name')}
            <input value={f.name} onChange={set('name')} autoComplete="name" aria-invalid={!!err.name} />
            {err.name && <span className="ferr">{err.name}</span>}
          </label>
          <label>{t('ft_email')}
            <input type="email" value={f.email} onChange={set('email')} autoComplete="email" aria-invalid={!!err.email} />
            {err.email && <span className="ferr">{err.email}</span>}
          </label>
          <label>{t('ft_q')}
            <textarea rows="3" value={f.q} onChange={set('q')} aria-invalid={!!err.q} />
            {err.q && <span className="ferr">{err.q}</span>}
          </label>
          <button className="solid" type="submit"><FaPaperPlane /> {t('ft_submit')}</button>
        </form>}
      </div>
      <p className="foot-end small">© {new Date().getFullYear()} FixMyStreet · Java, Spring Boot, React, MySQL</p>
      {sent && <Thanks title={t('th_t')} text={t('th_q')} label={t('th_close')} onClose={() => setSent(false)} />}
    </footer>
  );
}

// Social media links: GitHub, LinkedIn, Instagram

// Mobile responsive footer layout with flex wrap
