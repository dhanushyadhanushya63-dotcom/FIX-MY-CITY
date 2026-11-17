import { useEffect, useState } from 'react';
import { FaUserCircle, FaCity, FaGlobe } from 'react-icons/fa';
import { useT, LANGS } from './i18n.jsx';
import Footer from './Footer';
import Feedback from './pages/Feedback';
import { SEED } from './data';
import Home from './pages/Home';
import Register from './pages/Register';
import Track from './pages/Track';
import { About, Staff } from './pages/Misc';
import Admin from './pages/Admin';
import Authority from './pages/Authority';

const NAV_KEYS = [['home', 'n_home'], ['about', 'n_about'], ['register', 'n_register'], ['track', 'n_track'], ['feedback', 'n_feedback']];


export default function App() {
  const { lang, setLang, t } = useT();
  const [page, setPage] = useState('home');
  const [staff, setStaff] = useState(null);
  const [items, setItems] = useState(() => { try { const saved = localStorage.getItem('fms-complaints'); return saved ? JSON.parse(saved) : SEED; } catch { return SEED; } });
  const [trackId, setTrackId] = useState('');
  const [toast, setToast] = useState('');
  const [inbox, setInbox] = useState([]);
  useEffect(() => { try { localStorage.setItem('fms-complaints', JSON.stringify(items)); } catch {} }, [items]);   // contact queries, feedback and suggestions (later: POST to the backend)
  const send = (kind, data) => setInbox((a) => [...a, { kind, ...data, at: new Date().toISOString() }]);
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 3200); };
  const go = (p, id) => { if (id) setTrackId(id); setPage(p); window.scrollTo(0, 0); };

  // Every status change is appended to history (mirrors the status_history table).
  const move = (id, stage, extra = {}, msg) => {
    setItems((a) => a.map((c) => (c.id === id ? { ...c, ...extra, stage, history: [...c.history, { stage, at: new Date().toISOString() }] } : c)));
    if (msg) say(msg);
  };
  const add = (c) => {
    const maxId = items.reduce((m, x) => Math.max(m, Number(String(x.id).split('-')[1]) || 100), 100);
    const id = 'FMS-' + (maxId + 1);
    setItems((a) => [...a, { ...c, id, stage: 0, team: null, notes: [], proof: false, rating: null, history: [{ stage: 0, at: new Date().toISOString() }] }]);
    return id;
  };
  const signIn = (s) => { setStaff(s); go(s.role); };
  const signOut = () => { setStaff(null); go('home'); };

  const base = NAV_KEYS.map(([k, key]) => [k, t(key)]);
  const nav = staff ? [...base.slice(0, 4), [staff.role, t('n_dash')], base[4]] : base;   // Feedback stays the last page
  const pages = {
    home: <Home go={go} />,
    register: <Register items={items} add={add} go={go} />,
    track: <Track key={trackId} items={items} move={move} initialId={trackId} />,
    about: <About go={go} />,
    feedback: <Feedback send={send} />,
    staff: <Staff onEnter={signIn} />,
    admin: staff?.role === 'admin' ? <Admin items={items} move={move} /> : <Staff onEnter={signIn} />,
    authority: staff?.role === 'authority' ? <Authority user={staff} items={items} move={move} /> : <Staff onEnter={signIn} />,
  };

  return (
    <>
      <header className="top">
        <button className="brand" onClick={() => go('home')} aria-label="FixMyStreet home">
          <FaCity className="logo" /><span><b>FixMyStreet</b><small>Our City, Our Responsibility</small></span>
        </button>
        <nav aria-label="Main">
          {nav.map(([k, l]) => <button key={k} className={'link' + (page === k ? ' on' : '')} onClick={() => go(k)} aria-current={page === k ? 'page' : undefined}>{l}</button>)}
          <label className="lang"><FaGlobe aria-hidden="true" /><span className="sr">{t('n_lang')}</span>
            <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label={t('n_lang')}>{LANGS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
          <button className="avatar" onClick={() => (staff ? signOut() : go('staff'))} aria-label={staff ? 'Sign out ' + staff.name : 'Staff sign-in'} title={staff ? 'Sign out' : 'Staff sign-in'}><FaUserCircle /></button>
        </nav>
      </header>
      <main className="page">{pages[page]}</main>
      <Footer go={go} send={send} showContact={page === 'home'} />
      <div className="toast" role="status" aria-live="polite">{toast}</div>
    </>
  );
}
