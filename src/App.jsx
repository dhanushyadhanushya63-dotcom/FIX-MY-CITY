import { useEffect, useState } from 'react';
import {
  FaUserCircle,
  FaCity,
  FaGlobe,
  FaSun,
  FaMoon,
  FaUser,
  FaUserShield,
  FaHardHat,
  FaSignInAlt,
  FaSignOutAlt,
  FaExchangeAlt,
  FaThLarge,
  FaChevronDown
} from 'react-icons/fa';
import { useT, LANGS } from './i18n.jsx';
import Footer from './Footer';
import Feedback from './pages/Feedback';
import { SEED, CITIZEN } from './data';
import Home from './pages/Home';
import Register from './pages/Register';
import Track from './pages/Track';
import { About } from './pages/Misc';
import Admin from './pages/Admin';
import Authority from './pages/Authority';
import CitizenDashboard from './pages/CitizenDashboard';
import Login from './pages/Login';
import { SkeletonScreen } from './ui';
import { fetchComplaints, createComplaintApi, updateStageApi, submitFeedbackApi } from './api';

export default function App() {
  const { lang, setLang, t } = useT();
  const [page, setPage] = useState('home');
  const [adminDropdown, setAdminDropdown] = useState(false);

  // Multi-role authenticated user state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fms-current-user');
      return saved
        ? JSON.parse(saved)
        : {
            role: 'citizen',
            name: 'Priya Raman',
            contact: '9840123456',
            area: 'T. Nagar, Chennai',
            id: 'CIT-2026-44',
          };
    } catch {
      return {
        role: 'citizen',
        name: 'Priya Raman',
        contact: '9840123456',
        area: 'T. Nagar, Chennai',
        id: 'CIT-2026-44',
      };
    }
  });

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('fms-complaints');
      return saved ? JSON.parse(saved) : SEED;
    } catch {
      return SEED;
    }
  });

  const [trackId, setTrackId] = useState('');
  const [toast, setToast] = useState('');
  const [inbox, setInbox] = useState([]);
  const [apiConnected, setApiConnected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('fms-theme') === 'dark';
    } catch {
      return false;
    }
  });

  // Apply Dark Mode theme to document
  useEffect(() => {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('fms-theme', 'dark'); } catch {}
    } else {
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('fms-theme', 'light'); } catch {}
    }
  }, [dark]);

  // Sync with Spring Boot REST API & MySQL on start
  useEffect(() => {
    fetchComplaints()
      .then((res) => {
        if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
          setItems(res.data);
          setApiConnected(true);
        } else if (res.ok) {
          setApiConnected(true);
        } else {
          setApiConnected(false);
        }
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 300);
      });
  }, []);

  // Save complaints locally as offline fallback
  useEffect(() => {
    try {
      localStorage.setItem('fms-complaints', JSON.stringify(items));
    } catch {}
  }, [items]);

  // Persist logged-in user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('fms-current-user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('fms-current-user');
      }
    } catch {}
  }, [currentUser]);

  const send = (kind, data) => {
    const payload = { kind, ...data, at: new Date().toISOString() };
    setInbox((a) => [...a, payload]);
    submitFeedbackApi(payload);
  };

  const say = (m) => {
    setToast(m);
    setTimeout(() => setToast(''), 3500);
  };

  const go = (p, id) => {
    if (id) setTrackId(id);
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Status updates sent to backend and state
  const move = (id, stage, extra = {}, msg) => {
    setItems((a) =>
      a.map((c) =>
        c.id === id
          ? {
              ...c,
              ...extra,
              stage,
              history: [...(c.history || []), { stage, at: new Date().toISOString() }],
            }
          : c
      )
    );
    updateStageApi(id, stage, extra);
    if (msg) say(msg);
  };

  // Add new complaint (saved to MySQL via Spring Boot API)
  const add = (c) => {
    const maxId = items.reduce((m, x) => Math.max(m, Number(String(x.id).split('-')[1]) || 100), 100);
    const id = 'FMS-' + (maxId + 1);
    const newComplaint = {
      ...c,
      id,
      stage: 0,
      team: null,
      notes: [],
      proof: false,
      rating: null,
      history: [{ stage: 0, at: new Date().toISOString() }],
    };

    setItems((a) => [...a, newComplaint]);

    createComplaintApi({
      cat: c.cat,
      categoryLabel: c.categoryLabel,
      desc: c.desc,
      otherDetails: c.otherDetails,
      area: c.area,
      lat: c.lat,
      lng: c.lng,
      by: c.by || currentUser?.name || CITIZEN,
      photo: c.photo,
    }).then((res) => {
      if (res.ok && res.data) {
        setItems((a) => a.map((item) => (item.id === id ? { ...item, ...res.data } : item)));
        say('✓ Saved to MySQL database via Spring Boot API');
      }
    });

    return id;
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    say('Signed out successfully.');
    go('login');
  };

  const getRoleIcon = (role) => {
    if (role === 'admin') return <FaUserShield />;
    if (role === 'authority') return <FaHardHat />;
    return <FaUser />;
  };

  const pages = {
    home: <Home go={go} />,
    register: <Register items={items} add={add} go={go} currentUser={currentUser} />,
    track: <Track key={trackId} items={items} move={move} initialId={trackId} currentUser={currentUser} />,
    citizen: <CitizenDashboard currentUser={currentUser} items={items} go={go} move={move} say={say} />,
    admin: <Admin items={items} move={move} currentUser={currentUser} say={say} go={go} />,
    authority: (
      <Authority
        user={currentUser?.role === 'authority' ? currentUser : { team: 'Zone 4 Roads' }}
        items={items}
        move={move}
        say={say}
        go={go}
      />
    ),
    login: <Login currentUser={currentUser} setCurrentUser={setCurrentUser} go={go} say={say} />,
    about: <About go={go} />,
    feedback: <Feedback send={send} />,
    staff: <Login currentUser={currentUser} setCurrentUser={setCurrentUser} go={go} say={say} />,
  };

  return (
    <>
      <header className="top">
        <button className="brand" onClick={() => go('home')} aria-label="FixMyStreet home">
          <FaCity className="logo" />
          <span>
            <b>FixMyStreet</b>
            <small>Our Street, Our Responsibilities</small>
          </span>
        </button>

        <nav aria-label="Main Navigation">
          <button
            className={'link' + (page === 'home' ? ' on' : '')}
            onClick={() => go('home')}
          >
            {t('n_home')}
          </button>

          <button
            className={'link' + (page === 'register' ? ' on' : '')}
            onClick={() => go('register')}
          >
            {t('n_register')}
          </button>

          <button
            className={'link' + (page === 'track' ? ' on' : '')}
            onClick={() => go('track')}
          >
            {t('n_track')}
          </button>

          {/* Spring Boot / MySQL API Status Badge */}
          <span
            className={`api-badge ${apiConnected ? 'live' : 'offline'}`}
            title={
              apiConnected
                ? 'Connected to Java Spring Boot & MySQL'
                : 'Running in offline fallback mode'
            }
          >
            <span className="dot" /> {apiConnected ? 'MySQL API Live' : 'Local Mode'}
          </span>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            className="theme-btn"
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <FaSun className="icon-sun" /> : <FaMoon className="icon-moon" />}
          </button>

          {/* Language Selector */}
          <label className="lang">
            <FaGlobe aria-hidden="true" />
            <span className="sr">{t('n_lang')}</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label={t('n_lang')}
            >
              {LANGS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>

          {/* Login / User Session Profile Indicator */}
          {currentUser ? (
            <div className="user-profile-header-group">
              <button
                type="button"
                className="user-profile-nav"
                onClick={() => go(currentUser.role)}
                title={`Logged in as ${currentUser.name} (${currentUser.role}). Click to view dashboard.`}
              >
                <span className="user-avatar-circle">
                  {getRoleIcon(currentUser.role)}
                </span>
                <span className="user-name-text">{currentUser.name}</span>
                <span className={`user-role-badge ${currentUser.role}`}>
                  {currentUser.role}
                </span>
              </button>

              <button
                type="button"
                className="switch-role-btn"
                onClick={() => go('login')}
                title="Switch role or sign in as another user"
              >
                <FaExchangeAlt /> Switch
              </button>

              <button
                type="button"
                className="signout-btn"
                onClick={handleSignOut}
                title="Sign out of current account"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="solid login-nav-btn"
              onClick={() => go('login')}
            >
              <FaSignInAlt /> Login / Sign In
            </button>
          )}

          {/* Admin Master Dropdown placed right at the right-side end next to Login & Signout */}
          <div className="nav-dropdown-wrapper">
            <button
              type="button"
              className={
                'link admin-dropdown-btn' +
                (['admin', 'citizen', 'authority'].includes(page) ? ' on' : '')
              }
              onClick={() => setAdminDropdown((d) => !d)}
              aria-expanded={adminDropdown}
              title="Admin Portal - Access All 3 Dashboards"
            >
              <FaUserShield className="mr-sm" /> Admin <FaChevronDown className={`dropdown-arrow ${adminDropdown ? 'open' : ''}`} />
            </button>

            {adminDropdown && (
              <>
                <div className="dropdown-overlay" onClick={() => setAdminDropdown(false)} />
                <div className="dropdown-menu">
                  <div className="dropdown-header">ADMIN MASTER PORTAL · 3 DASHBOARDS</div>
                  <button
                    type="button"
                    className={`dropdown-item ${page === 'admin' ? 'active' : ''}`}
                    onClick={() => {
                      go('admin');
                      setAdminDropdown(false);
                    }}
                  >
                    <FaUserShield className="text-red" />
                    <div>
                      <b>1. Admin Dashboard</b>
                      <small>Review, Duplicates, Hotspots & Assign</small>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`dropdown-item ${page === 'citizen' ? 'active' : ''}`}
                    onClick={() => {
                      go('citizen');
                      setAdminDropdown(false);
                    }}
                  >
                    <FaUser className="text-blue" />
                    <div>
                      <b>2. Citizen Dashboard</b>
                      <small>Citizen Reports, Receipts & Ratings</small>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`dropdown-item ${page === 'authority' ? 'active' : ''}`}
                    onClick={() => {
                      go('authority');
                      setAdminDropdown(false);
                    }}
                  >
                    <FaHardHat className="text-teal" />
                    <div>
                      <b>3. Authority Dashboard</b>
                      <small>Work Orders, Field Progress & Proof</small>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Main Page Content with Skeleton Loading Shimmer */}
      <main className="page">
        {loading ? <SkeletonScreen /> : pages[page]}
      </main>

      <Footer go={go} send={send} showContact={page === 'home'} />
      <div className="toast" role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
