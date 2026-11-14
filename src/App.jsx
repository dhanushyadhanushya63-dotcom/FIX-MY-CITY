import { useEffect, useState, useMemo } from 'react';
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
  FaChevronDown,
  FaBell,
  FaCheck,
  FaTrashAlt
} from 'react-icons/fa';
import { useT, LANGS } from './i18n.jsx';
import Footer from './Footer';
import Feedback from './pages/Feedback';
import { SEED, CITIZEN, CATS, getCatLabel, getTeamLabel, formatUserName } from './data';
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
  const [showNotifs, setShowNotifs] = useState(false);

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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => ({
            ...item,
            history: Array.isArray(item.history) && item.history.length > 0
              ? item.history
              : [{ stage: item.stage || 0, at: new Date().toISOString() }],
          }));
        }
      }
      return SEED;
    } catch {
      return SEED;
    }
  });

  // Real-time Notification System for Admin, Authority & Citizen
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('fms-notifications');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'notif-seed-1',
              role: 'admin',
              title: '🚨 New Pothole Report: FMS-101',
              titleTa: '🚨 புதிய சாலைக்குழி புகார்: FMS-101',
              message: 'Priya Raman reported a deep pothole in T. Nagar. Auto-routed to Zone 4 Roads.',
              messageTa: 'பிரியா ராமன் தி. நகரில் குழி பற்றி புகார் அளித்துள்ளார். மண்டலம் 4 சாலைப் பிரிவுக்கு ஒதுக்கப்பட்டது.',
              at: new Date(Date.now() - 3600000).toISOString(),
              read: false,
              complaintId: 'FMS-101',
            },
            {
              id: 'notif-seed-2',
              role: 'authority',
              team: 'Sanitation Wing',
              title: '🔔 New Work Order: FMS-103',
              titleTa: '🔔 புதிய பணி ஆணை: FMS-103',
              message: 'Garbage heap reported at Adyar. Auto-assigned to Sanitation Wing.',
              messageTa: 'அடையாறில் குப்பைக் குவியல் புகார். துப்புரவுப் பிரிவுக்கு ஒதுக்கப்பட்டுள்ளது.',
              at: new Date(Date.now() - 7200000).toISOString(),
              read: false,
              complaintId: 'FMS-103',
            },
            {
              id: 'notif-seed-3',
              role: 'authority',
              team: 'Zone 4 Roads',
              title: '🔔 New Work Order: FMS-102',
              titleTa: '🔔 புதிய பணி ஆணை: FMS-102',
              message: 'Large pothole outside Pondy Bazaar entrance. Assigned to Zone 4 Roads.',
              messageTa: 'பாண்டி பஜார் நுழைவாயிலில் பெரிய குழி. மண்டலம் 4 சாலைப் பிரிவுக்கு ஒதுக்கப்பட்டுள்ளது.',
              at: new Date(Date.now() - 10800000).toISOString(),
              read: false,
              complaintId: 'FMS-102',
            },
          ];
    } catch {
      return [];
    }
  });

  const [trackId, setTrackId] = useState('');
  const [toast, setToast] = useState('');
  const [inbox, setInbox] = useState([]);
  const [apiConnected, setApiConnected] = useState(null);
  const [loading, setLoading] = useState(false);
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

  // Save notifications
  useEffect(() => {
    try {
      localStorage.setItem('fms-notifications', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

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
    setTimeout(() => setToast(''), 4500);
  };

  const go = (p, id) => {
    if (id) setTrackId(id);
    setPage(p);
    setShowNotifs(false);
    setAdminDropdown(false);
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

  // =========================================================================
  // REQUIREMENT 2 & 4: AUTO-ROUTING TO CORRECT AUTHORITY & NOTIFICATION SYSTEM
  // =========================================================================
  const add = (c) => {
    const maxId = items.reduce((m, x) => Math.max(m, Number(String(x.id).split('-')[1]) || 100), 100);
    const id = 'FMS-' + (maxId + 1);

    // 1. Auto-route to the correct authority team based on complaint category
    const targetTeam = c.team || CATS[c.cat]?.team || 'Zone 4 Roads';

    const newComplaint = {
      ...c,
      id,
      stage: 2, // Auto-routed and assigned to department work queue
      team: targetTeam,
      notes: [
        {
          t: lang === 'ta'
            ? `வகை அடிப்படையில் ${getTeamLabel(targetTeam, 'ta')} துறைக்கு தானாக ஒதுக்கப்பட்டது.`
            : `Auto-routed to ${targetTeam} based on complaint category.`,
          at: new Date().toISOString(),
        },
      ],
      proof: false,
      rating: null,
      history: [
        { stage: 0, at: new Date().toISOString() },
        { stage: 1, at: new Date().toISOString() },
        { stage: 2, at: new Date().toISOString() },
      ],
    };

    setItems((a) => [newComplaint, ...a]);

    // 2. REQUIREMENT 4: Create notification for ADMIN
    const adminNotif = {
      id: 'notif-' + Date.now() + '-adm',
      role: 'admin',
      title: lang === 'ta' ? `🚨 புதிய புகார்: ${id}` : `🚨 New Complaint: ${id}`,
      titleTa: `🚨 புதிய புகார்: ${id}`,
      message: lang === 'ta'
        ? `${c.by || 'குடிமகன்'} அவர்கள் ${getCatLabel(c.cat, 'ta')} புகாரை (${c.area}) அளித்துள்ளார். ${getTeamLabel(targetTeam, 'ta')} துறைக்கு ஒதுக்கப்பட்டது.`
        : `${c.by || 'Citizen'} reported ${CATS[c.cat]?.label} at ${c.area}. Auto-routed to ${targetTeam}.`,
      messageTa: `${c.by || 'குடிமகன்'} அவர்கள் ${getCatLabel(c.cat, 'ta')} புகாரை (${c.area}) அளித்துள்ளார். ${getTeamLabel(targetTeam, 'ta')} துறைக்கு ஒதுக்கப்பட்டது.`,
      at: new Date().toISOString(),
      read: false,
      complaintId: id,
    };

    // 3. REQUIREMENT 4: Create notification for AUTHORITY
    const authNotif = {
      id: 'notif-' + Date.now() + '-auth',
      role: 'authority',
      team: targetTeam,
      title: lang === 'ta' ? `🔔 புதிய பணி ஆணை: ${id}` : `🔔 New Work Order: ${id}`,
      titleTa: `🔔 புதிய பணி ஆணை: ${id}`,
      message: lang === 'ta'
        ? `${getCatLabel(c.cat, 'ta')} பிரச்சினை (${c.area}) உங்கள் துறைக்கு (${getTeamLabel(targetTeam, 'ta')}) ஒதுக்கப்பட்டுள்ளது.`
        : `${CATS[c.cat]?.label} issue at ${c.area} has been assigned to your department (${targetTeam}).`,
      messageTa: `${getCatLabel(c.cat, 'ta')} பிரச்சினை (${c.area}) உங்கள் துறைக்கு (${getTeamLabel(targetTeam, 'ta')}) ஒதுக்கப்பட்டுள்ளது.`,
      at: new Date().toISOString(),
      read: false,
      complaintId: id,
    };

    // 4. Create notification for CITIZEN
    const citNotif = {
      id: 'notif-' + Date.now() + '-cit',
      role: 'citizen',
      user: c.by,
      title: lang === 'ta' ? `✓ புகார் ${id} பதிவு செய்யப்பட்டது` : `✓ Complaint ${id} Registered`,
      titleTa: `✓ புகார் ${id} பதிவு செய்யப்பட்டது`,
      message: lang === 'ta'
        ? `உங்கள் புகார் ${id} பெறப்பட்டு ${getTeamLabel(targetTeam, 'ta')} துறைக்கு அனுப்பப்பட்டது.`
        : `Your complaint ${id} has been registered and auto-routed to ${targetTeam}.`,
      messageTa: `உங்கள் புகார் ${id} பெறப்பட்டு ${getTeamLabel(targetTeam, 'ta')} துறைக்கு அனுப்பப்பட்டது.`,
      at: new Date().toISOString(),
      read: false,
      complaintId: id,
    };

    setNotifications((prev) => [adminNotif, authNotif, citNotif, ...prev]);

    // Toast alert in selected language
    const alertText = lang === 'ta'
      ? `✓ புகார் ${id} வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! நிர்வாகி மற்றும் ${getTeamLabel(targetTeam, 'ta')} துறைக்கு உடனடியாக அறிவிப்பு அனுப்பப்பட்டது.`
      : `✓ Complaint ${id} registered! Auto-routed to ${targetTeam}. Admin & Authority notified.`;
    say(alertText);

    // Save to backend MySQL API
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
      }
    });

    return id;
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    say(lang === 'ta' ? 'வெற்றிகரமாக வெளியேறினீர்கள்.' : 'Signed out successfully.');
    go('login');
  };

  const getRoleIcon = (role) => {
    if (role === 'admin') return <FaUserShield />;
    if (role === 'authority') return <FaHardHat />;
    return <FaUser />;
  };

  // Filter notifications for current user role
  const userNotifications = useMemo(() => {
    if (!currentUser) return notifications.filter((n) => n.role === 'citizen');
    if (currentUser.role === 'admin') return notifications; // Admin sees ALL alerts!
    if (currentUser.role === 'authority') {
      return notifications.filter(
        (n) => n.role === 'authority' && (!n.team || n.team === currentUser.team)
      );
    }
    return notifications.filter(
      (n) => n.role === 'citizen' && (!n.user || n.user.toLowerCase() === (currentUser.name || '').toLowerCase())
    );
  }, [notifications, currentUser]);

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home go={go} />;
      case 'register':
        return <Register items={items} add={add} go={go} currentUser={currentUser} />;
      case 'track':
        return <Track key={trackId} items={items} move={move} initialId={trackId} currentUser={currentUser} />;
      case 'citizen':
        return <CitizenDashboard currentUser={currentUser} items={items} go={go} move={move} say={say} />;
      case 'admin':
        return <Admin items={items} move={move} currentUser={currentUser} say={say} go={go} />;
      case 'authority':
        return (
          <Authority
            user={currentUser?.role === 'authority' ? currentUser : { team: 'Zone 4 Roads' }}
            items={items}
            move={move}
            say={say}
            go={go}
          />
        );
      case 'login':
      case 'staff':
        return <Login currentUser={currentUser} setCurrentUser={setCurrentUser} go={go} say={say} />;
      case 'about':
        return <About go={go} />;
      case 'feedback':
        return <Feedback send={send} />;
      default:
        return <Home go={go} />;
    }
  };

  return (
    <>
      <header className="top">
        <button className="brand" onClick={() => go('home')} aria-label="FixMyStreet home">
          <FaCity className="logo" />
          <span>
            <b>FixMyStreet</b>
            <small>{t('our_tagline')}</small>
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

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            className="theme-btn"
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? (lang === 'ta' ? 'வெளிச்ச முறைக்கு மாற்று' : 'Switch to light mode') : (lang === 'ta' ? 'இருண்ட முறைக்கு மாற்று' : 'Switch to dark mode')}
          >
            {dark ? <FaSun className="icon-sun" /> : <FaMoon className="icon-moon" />}
          </button>

          {/* Notification Bell Dropdown */}
          <div className="notif-wrapper">
            <button
              type="button"
              className="notif-btn"
              onClick={() => setShowNotifs((s) => !s)}
              aria-label={t('notif_title')}
              title={lang === 'ta' ? `அறிவிப்புகள் (${unreadCount} புதியவை)` : `Notifications (${unreadCount} unread)`}
            >
              <FaBell />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {showNotifs && (
              <>
                <div className="dropdown-overlay" onClick={() => setShowNotifs(false)} />
                <div className="notif-menu">
                  <div className="notif-head row between">
                    <b>{t('notif_title')} ({userNotifications.length})</b>
                    <div className="row">
                      {unreadCount > 0 && (
                        <button type="button" className="notif-action-btn" onClick={markAllRead}>
                          <FaCheck /> {t('notif_mark_read')}
                        </button>
                      )}
                      {userNotifications.length > 0 && (
                        <button type="button" className="notif-action-btn red" onClick={clearNotifications}>
                          <FaTrashAlt /> {t('notif_clear')}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="notif-list">
                    {userNotifications.length === 0 ? (
                      <p className="mute small text-center p-2">{t('notif_empty')}</p>
                    ) : (
                      userNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`notif-item ${notif.read ? 'read' : 'unread'}`}
                          onClick={() => {
                            if (notif.complaintId) go('track', notif.complaintId);
                            setNotifications((prev) =>
                              prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                            );
                            setShowNotifs(false);
                          }}
                        >
                          <div className="notif-title-row">
                            <b>{lang === 'ta' && notif.titleTa ? notif.titleTa : notif.title}</b>
                            {!notif.read && <span className="new-dot" />}
                          </div>
                          <p className="notif-msg">{lang === 'ta' && notif.messageTa ? notif.messageTa : notif.message}</p>
                          <small className="notif-time mute">
                            {new Date(notif.at).toLocaleTimeString(lang === 'ta' ? 'ta-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

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
                title={`Logged in as ${currentUser.name} (${currentUser.role}).`}
              >
                <span className="user-avatar-circle">
                  {getRoleIcon(currentUser.role)}
                </span>
                <span className="user-name-text">{formatUserName(currentUser.name, lang)}</span>
                <span className={`user-role-badge ${currentUser.role}`}>
                  {lang === 'ta'
                    ? currentUser.role === 'admin'
                      ? 'நிர்வாகி'
                      : currentUser.role === 'authority'
                      ? 'அதிகாரி'
                      : 'குடிமகன்'
                    : currentUser.role}
                </span>
              </button>

              <button
                type="button"
                className="switch-role-btn"
                onClick={() => go('login')}
                title={lang === 'ta' ? 'பங்கை மாற்றவும்' : 'Switch role or sign in as another user'}
              >
                <FaExchangeAlt /> {lang === 'ta' ? 'மாற்று' : 'Switch'}
              </button>

              <button
                type="button"
                className="signout-btn"
                onClick={handleSignOut}
                title={lang === 'ta' ? 'வெளியேறு' : 'Sign out'}
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
              <FaSignInAlt /> {t('login_btn')}
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
              <FaUserShield className="mr-sm" /> {t('login_admin')} <FaChevronDown className={`dropdown-arrow ${adminDropdown ? 'open' : ''}`} />
            </button>

            {adminDropdown && (
              <>
                <div className="dropdown-overlay" onClick={() => setAdminDropdown(false)} />
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    {lang === 'ta' ? 'நிர்வாகி முதன்மை மையம் · 3 டாஷ்போர்டுகள்' : 'ADMIN MASTER PORTAL · 3 DASHBOARDS'}
                  </div>
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
                      <b>1. {t('sub_admin')}</b>
                      <small>{lang === 'ta' ? 'ஆய்வு, நகல்கள், ஹாட்ஸ்பாட்கள் & ஒதுக்கீடு' : 'Review, Duplicates, Hotspots & Assign'}</small>
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
                      <b>2. {t('sub_citizen')}</b>
                      <small>{lang === 'ta' ? 'குடிமக்கள் அறிக்கைகள், ரசீதுகள் & மதிப்பீடுகள்' : 'Citizen Reports, Receipts & Ratings'}</small>
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
                      <b>3. {t('sub_authority')}</b>
                      <small>{lang === 'ta' ? 'பணி ஆணைகள், கள முன்னேற்றம் & ஆதாரம்' : 'Work Orders, Field Progress & Proof'}</small>
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
        {loading ? <SkeletonScreen /> : renderPage()}
      </main>

      <Footer go={go} send={send} showContact={page === 'home'} />
      <div className="toast" role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
