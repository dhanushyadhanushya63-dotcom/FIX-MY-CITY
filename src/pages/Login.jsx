import { useState } from 'react';
import {
  FaUser,
  FaUserShield,
  FaHardHat,
  FaSignInAlt,
  FaUserPlus,
  FaCheckCircle,
  FaLock,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
  FaArrowRight,
  FaInfoCircle
} from 'react-icons/fa';
import { TEAMS, CITIZEN, getTeamLabel } from '../data';
import { useT } from '../i18n.jsx';

export default function Login({ currentUser, setCurrentUser, go, say }) {
  const { t, lang } = useT();
  const [activeTab, setActiveTab] = useState(currentUser?.role || 'citizen');
  
  // Citizen form state
  const [citizenMode, setCitizenMode] = useState('login'); // 'login' | 'register'
  const [citizenName, setCitizenName] = useState('Priya Raman');
  const [citizenContact, setCitizenContact] = useState('9840123456');
  const [citizenArea, setCitizenArea] = useState('T. Nagar, Chennai');

  // Admin form state
  const [adminUser, setAdminUser] = useState('admin@fixmystreet.gov');
  const [adminPass, setAdminPass] = useState('••••••••');

  // Authority form state
  const [authTeam, setAuthTeam] = useState('Zone 4 Roads');
  const [authOfficer, setAuthOfficer] = useState('Officer R. Selvam');
  const [authPass, setAuthPass] = useState('••••••••');

  // Handle Citizen Login / Registration
  const handleCitizenSubmit = (e) => {
    e?.preventDefault();
    if (!citizenName.trim()) {
      if (say) say(t('login_enter_name'));
      return;
    }
    const user = {
      role: 'citizen',
      name: citizenName.trim(),
      contact: citizenContact.trim() || '9840123456',
      area: citizenArea.trim() || (lang === 'ta' ? 'சென்னை மத்திய' : 'Chennai Central'),
      id: 'CIT-' + Math.floor(1000 + Math.random() * 9000),
    };
    setCurrentUser(user);
    if (say) say(lang === 'ta' ? `வணக்கம், ${user.name}! குடிமக்களாக உள்நுழைந்தீர்கள்.` : `Welcome, ${user.name}! Logged in as Citizen.`);
    go('citizen');
  };

  // Handle Admin Login
  const handleAdminSubmit = (e) => {
    e?.preventDefault();
    const user = {
      role: 'admin',
      name: lang === 'ta' ? 'நகராட்சி நிர்வாகி மேசை' : 'Municipal Admin Desk',
      email: adminUser,
      title: lang === 'ta' ? 'நகராட்சி முதன்மை அதிகாரி' : 'Chief Municipal Officer',
      id: 'ADM-01',
    };
    setCurrentUser(user);
    if (say) say(lang === 'ta' ? 'நகராட்சி நிர்வாகியாக உள்நுழைந்தீர்கள்.' : 'Logged in as Municipal Administrator.');
    go('admin');
  };

  // Handle Authority Login
  const handleAuthoritySubmit = (e) => {
    e?.preventDefault();
    const user = {
      role: 'authority',
      name: authOfficer || (lang === 'ta' ? 'களக் குழு தலைவர்' : 'Field Team Lead'),
      team: authTeam,
      title: `${getTeamLabel(authTeam, lang)} Supervisor`,
      id: 'AUTH-' + authTeam.replace(/\s+/g, '-').toUpperCase(),
    };
    setCurrentUser(user);
    if (say) say(lang === 'ta' ? `அதிகாரியாக உள்நுழைந்தீர்கள் (${getTeamLabel(authTeam, 'ta')}).` : `Logged in as Authority (${authTeam}).`);
    go('authority');
  };

  // Quick 1-click Demo logins
  const quickLoginCitizen = (name, area = 'Chennai') => {
    const user = {
      role: 'citizen',
      name,
      contact: '9840123456',
      area,
      id: 'CIT-2026',
    };
    setCurrentUser(user);
    if (say) say(lang === 'ta' ? `${name} (குடிமகன்) ஆக உள்நுழைந்தீர்கள்.` : `Logged in as ${name} (Citizen)`);
    go('citizen');
  };

  const quickLoginAdmin = () => {
    handleAdminSubmit();
  };

  const quickLoginAuthority = (teamName) => {
    const user = {
      role: 'authority',
      name: `${getTeamLabel(teamName, lang)} Lead Officer`,
      team: teamName,
      title: `${getTeamLabel(teamName, lang)} Supervisor`,
      id: 'AUTH-' + teamName.replace(/\s+/g, '-').toUpperCase(),
    };
    setCurrentUser(user);
    if (say) say(lang === 'ta' ? `${getTeamLabel(teamName, 'ta')} அதிகாரியாக உள்நுழைந்தீர்கள்.` : `Logged in as Authority (${teamName})`);
    go('authority');
  };

  return (
    <div className="login-page">
      {/* Top Banner */}
      <div className="login-header text-center">
        <span className="eyebrow">{lang === 'ta' ? 'FIXMYSTREET அங்கீகார & அணுகல் தளம்' : 'FIXMYSTREET AUTHENTICATION & ACCESS PORTAL'}</span>
        <h1>{lang === 'ta' ? 'FixMyStreet-க்கு வரவேற்கிறோம்' : 'Welcome to FixMyStreet'}</h1>
        <p className="lead">
          {lang === 'ta'
            ? 'உங்கள் பங்கைத் தேர்ந்தெடுத்து, உங்கள் தனிப்பயனாக்கப்பட்ட டாஷ்போர்டு மற்றும் அம்சங்களை அணுக உள்நுழையவும்.'
            : 'Choose your module and sign in to access your customized dashboard and features.'}
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="role-tabs">
        <button
          type="button"
          className={`role-tab ${activeTab === 'citizen' ? 'active' : ''}`}
          onClick={() => setActiveTab('citizen')}
        >
          <FaUser className="tab-icon" />
          <div className="tab-text">
            <b>1. {t('login_citizen')}</b>
            <small>{lang === 'ta' ? 'புகார் & நிலை அறிதல்' : 'Report & Track Complaints'}</small>
          </div>
        </button>

        <button
          type="button"
          className={`role-tab ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          <FaUserShield className="tab-icon" />
          <div className="tab-text">
            <b>2. {t('login_admin')}</b>
            <small>{lang === 'ta' ? 'ஆய்வு, நகல்கள் & ஒதுக்கீடு' : 'Review, Duplicates & Assign'}</small>
          </div>
        </button>

        <button
          type="button"
          className={`role-tab ${activeTab === 'authority' ? 'active' : ''}`}
          onClick={() => setActiveTab('authority')}
        >
          <FaHardHat className="tab-icon" />
          <div className="tab-text">
            <b>3. {t('login_authority')}</b>
            <small>{lang === 'ta' ? 'பணி மேலாண்மை & ஆதாரம்' : 'Manage Work & Upload Proof'}</small>
          </div>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="login-card-container">
        {/* CITIZEN TAB */}
        {activeTab === 'citizen' && (
          <div className="card login-card">
            <div className="login-card-head">
              <div className="login-badge-pill citizen-pill">
                <FaUser /> {lang === 'ta' ? 'பகுதி 1: குடிமக்கள் அணுகல்' : 'Module 1: Citizen Access'}
              </div>
              <h2>{citizenMode === 'login' ? t('login_citizen_title') : (lang === 'ta' ? 'புதிய குடிமக்கள் பதிவு' : 'New Citizen Registration')}</h2>
              <p className="mute">
                {lang === 'ta'
                  ? 'புகைப்படம் மற்றும் வரைபடக் குறிப்புடன் புகார்களைச் சமர்ப்பிக்கவும், நிலையைப் பார்க்கவும், ரசீதுகளைப் பதிவிறக்கவும்.'
                  : 'Submit complaints with photos and location pins, view status updates and download receipts.'}
              </p>
            </div>

            <div className="sub-mode-toggle">
              <button
                type="button"
                className={citizenMode === 'login' ? 'active' : ''}
                onClick={() => setCitizenMode('login')}
              >
                <FaSignInAlt /> {t('login_mode_login')}
              </button>
              <button
                type="button"
                className={citizenMode === 'register' ? 'active' : ''}
                onClick={() => setCitizenMode('register')}
              >
                <FaUserPlus /> {t('login_mode_register')}
              </button>
            </div>

            <form onSubmit={handleCitizenSubmit} className="login-form">
              <label className="field">
                <span>{t('login_name')}</span>
                <div className="input-wrap">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder={lang === 'ta' ? 'எ.கா. பிரியா ராமன்' : 'e.g. Priya Raman'}
                  />
                </div>
              </label>

              <label className="field">
                <span>{t('login_contact')}</span>
                <div className="input-wrap">
                  <FaPhone className="input-icon" />
                  <input
                    type="text"
                    required
                    value={citizenContact}
                    onChange={(e) => setCitizenContact(e.target.value)}
                    placeholder="9840123456"
                  />
                </div>
              </label>

              <label className="field">
                <span>{t('login_area')}</span>
                <div className="input-wrap">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    value={citizenArea}
                    onChange={(e) => setCitizenArea(e.target.value)}
                    placeholder={lang === 'ta' ? 'எ.கா. தி. நகர், சென்னை' : 'e.g. T. Nagar, Chennai'}
                  />
                </div>
              </label>

              <button type="submit" className="solid big full-btn">
                <FaSignInAlt /> {citizenMode === 'login' ? t('login_btn') : t('login_register_btn')}
              </button>
            </form>

            {/* Quick Demo Citizen Logins */}
            <div className="demo-credentials-box">
              <div className="demo-box-title">
                <FaCheckCircle className="text-green" /> <b>{lang === 'ta' ? 'ஒரே கிளிக்கில் டெமோ அணுகல்:' : 'One-Click Demo Access:'}</b>
              </div>
              <div className="demo-btn-group">
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => quickLoginCitizen('Priya Raman', 'T. Nagar, Chennai')}
                >
                  {lang === 'ta' ? 'பிரியா ராமன் ஆக உள்நுழை' : 'Sign in as Priya Raman'} (Demo Citizen)
                </button>
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => quickLoginCitizen('Karthik S', 'Adyar, Chennai')}
                >
                  {lang === 'ta' ? 'கார்த்திக் எஸ் ஆக உள்நுழை' : 'Sign in as Karthik S'} (Resident)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN TAB */}
        {activeTab === 'admin' && (
          <div className="card login-card">
            <div className="login-card-head">
              <div className="login-badge-pill admin-pill">
                <FaUserShield /> {lang === 'ta' ? 'பகுதி 2: நகராட்சி நிர்வாகி' : 'Module 2: Municipal Administrator'}
              </div>
              <h2>{t('login_admin_title')}</h2>
              <p className="mute">
                {lang === 'ta'
                  ? 'வரும் புகார்களை ஆய்வு செய்யவும், 60 மீட்டருக்குள் நகல் அறிக்கைகளைக் கண்டறியவும், ஹாட்ஸ்பாட்களைக் கண்காணிக்கவும், களக் குழுக்களை ஒதுக்கவும்.'
                  : 'Review incoming complaints, identify duplicate reports within 60 meters, monitor hotspots and assign authority teams.'}
              </p>
            </div>

            <form onSubmit={handleAdminSubmit} className="login-form">
              <label className="field">
                <span>{t('login_email')}</span>
                <div className="input-wrap">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    required
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    placeholder="admin@fixmystreet.gov"
                  />
                </div>
              </label>

              <label className="field">
                <span>{t('login_password')}</span>
                <div className="input-wrap">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    required
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </label>

              <button type="submit" className="solid big full-btn admin-btn">
                <FaSignInAlt /> {t('login_btn')}
              </button>
            </form>

            {/* Quick Demo Admin Login */}
            <div className="demo-credentials-box">
              <div className="demo-box-title">
                <FaCheckCircle className="text-green" /> <b>{lang === 'ta' ? 'டெமோ நிர்வாகி அணுகல்:' : 'One-Click Demo Access:'}</b>
              </div>
              <button
                type="button"
                className="demo-btn full-btn"
                onClick={quickLoginAdmin}
              >
                {lang === 'ta' ? 'நகராட்சி முதன்மை நிர்வாகியாக உள்நுழை' : 'Sign In as Chief Municipal Admin Desk'} (Instant Demo)
              </button>
            </div>
          </div>
        )}

        {/* AUTHORITY TAB */}
        {activeTab === 'authority' && (
          <div className="card login-card">
            <div className="login-card-head">
              <div className="login-badge-pill auth-pill">
                <FaHardHat /> {lang === 'ta' ? 'பகுதி 3: அதிகாரி & களக் குழுக்கள்' : 'Module 3: Authority & Field Teams'}
              </div>
              <h2>{t('login_authority_title')}</h2>
              <p className="mute">
                {lang === 'ta'
                  ? 'ஒதுக்கப்பட்ட பழுதுபார்ப்பு ஆணைகளை நிர்வகிக்கவும், கள முன்னேற்றத்தைப் பதிவு செய்யவும் மற்றும் பணி முடிந்த புகைப்படங்களை பதிவேற்றவும்.'
                  : 'Manage assigned repair orders, update field progress, log inspection remarks and upload after-work proof photos.'}
              </p>
            </div>

            <form onSubmit={handleAuthoritySubmit} className="login-form">
              <label className="field">
                <span>{t('login_team')}</span>
                <div className="input-wrap">
                  <FaBuilding className="input-icon" />
                  <select
                    value={authTeam}
                    onChange={(e) => {
                      setAuthTeam(e.target.value);
                      const officers = {
                        'Zone 4 Roads': 'Officer R. Selvam',
                        'Sanitation Wing': 'Lead Inspector Murugan',
                        'Metro Water': 'Engineer K. Anitha',
                        'Lighting Cell': 'Supervisor S. Baskar',
                      };
                      setAuthOfficer(officers[e.target.value] || 'Team Officer');
                    }}
                  >
                    {TEAMS.map((tName) => (
                      <option key={tName} value={tName}>
                        {getTeamLabel(tName, lang)}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="field">
                <span>{t('login_officer')}</span>
                <div className="input-wrap">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    required
                    value={authOfficer}
                    onChange={(e) => setAuthOfficer(e.target.value)}
                  />
                </div>
              </label>

              <label className="field">
                <span>{t('login_password')}</span>
                <div className="input-wrap">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    required
                    value={authPass}
                    onChange={(e) => setAuthPass(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </label>

              <button type="submit" className="solid big full-btn auth-btn">
                <FaSignInAlt /> {t('login_btn')}
              </button>
            </form>

            {/* Quick Demo Department buttons */}
            <div className="demo-credentials-box">
              <div className="demo-box-title">
                <FaCheckCircle className="text-green" /> <b>{lang === 'ta' ? 'துறை வாரியாக நேரடி அணுகல்:' : 'Quick Select Department:'}</b>
              </div>
              <div className="demo-btn-group">
                {TEAMS.map((tName) => (
                  <button
                    key={tName}
                    type="button"
                    className="demo-btn"
                    onClick={() => quickLoginAuthority(tName)}
                  >
                    {getTeamLabel(tName, lang)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
