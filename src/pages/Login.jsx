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
import { TEAMS, CITIZEN } from '../data';

export default function Login({ currentUser, setCurrentUser, go, say }) {
  const [activeTab, setActiveTab] = useState(currentUser?.role || 'citizen');
  
  // Citizen form state
  const [citizenMode, setCitizenMode] = useState('login'); // 'login' | 'register'
  const [citizenName, setCitizenName] = useState('Priya Raman');
  const [citizenContact, setCitizenContact] = useState('9876543210');
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
      if (say) say('Please enter your full name');
      return;
    }
    const user = {
      role: 'citizen',
      name: citizenName.trim(),
      contact: citizenContact.trim() || '9876543210',
      area: citizenArea.trim() || 'Chennai Central',
      id: 'CIT-' + Math.floor(1000 + Math.random() * 9000),
    };
    setCurrentUser(user);
    if (say) say(`Welcome, ${user.name}! Logged in as Citizen.`);
    go('citizen');
  };

  // Handle Admin Login
  const handleAdminSubmit = (e) => {
    e?.preventDefault();
    const user = {
      role: 'admin',
      name: 'Municipal Admin Desk',
      email: adminUser,
      title: 'Chief Municipal Officer',
      id: 'ADM-01',
    };
    setCurrentUser(user);
    if (say) say('Logged in as Municipal Administrator.');
    go('admin');
  };

  // Handle Authority Login
  const handleAuthoritySubmit = (e) => {
    e?.preventDefault();
    const user = {
      role: 'authority',
      name: authOfficer || 'Field Team Lead',
      team: authTeam,
      title: `${authTeam} Supervisor`,
      id: 'AUTH-' + authTeam.replace(/\s+/g, '-').toUpperCase(),
    };
    setCurrentUser(user);
    if (say) say(`Logged in as Authority (${authTeam}).`);
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
    if (say) say(`Logged in as ${name} (Citizen)`);
    go('citizen');
  };

  const quickLoginAdmin = () => {
    handleAdminSubmit();
  };

  const quickLoginAuthority = (teamName) => {
    const user = {
      role: 'authority',
      name: `${teamName} Lead Officer`,
      team: teamName,
      title: `${teamName} Supervisor`,
      id: 'AUTH-' + teamName.replace(/\s+/g, '-').toUpperCase(),
    };
    setCurrentUser(user);
    if (say) say(`Logged in as Authority (${teamName})`);
    go('authority');
  };

  return (
    <div className="login-page">
      {/* Top Banner */}
      <div className="login-header text-center">
        <span className="eyebrow">FIXMYSTREET AUTHENTICATION & ACCESS PORTAL</span>
        <h1>Welcome to FixMyStreet</h1>
        <p className="lead">
          Choose your module and sign in to access your customized dashboard and features.
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
            <b>1. Citizen Portal</b>
            <small>Report & Track Complaints</small>
          </div>
        </button>

        <button
          type="button"
          className={`role-tab ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          <FaUserShield className="tab-icon" />
          <div className="tab-text">
            <b>2. Admin Desk</b>
            <small>Review, Duplicates & Assign</small>
          </div>
        </button>

        <button
          type="button"
          className={`role-tab ${activeTab === 'authority' ? 'active' : ''}`}
          onClick={() => setActiveTab('authority')}
        >
          <FaHardHat className="tab-icon" />
          <div className="tab-text">
            <b>3. Authority Teams</b>
            <small>Manage Work & Upload Proof</small>
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
                <FaUser /> Module 1: Citizen Access
              </div>
              <h2>Citizen Sign In & Registration</h2>
              <p className="mute">
                Submit complaints with photos and location pins, view status updates and download receipts.
              </p>
            </div>

            <div className="sub-mode-toggle">
              <button
                type="button"
                className={citizenMode === 'login' ? 'active' : ''}
                onClick={() => setCitizenMode('login')}
              >
                <FaSignInAlt /> Citizen Sign In
              </button>
              <button
                type="button"
                className={citizenMode === 'register' ? 'active' : ''}
                onClick={() => setCitizenMode('register')}
              >
                <FaUserPlus /> New Resident Sign Up
              </button>
            </div>

            <form onSubmit={handleCitizenSubmit} className="login-form">
              <label className="field">
                <span>Full Name</span>
                <div className="input-wrap">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="e.g. Priya Raman"
                  />
                </div>
              </label>

              <label className="field">
                <span>Mobile Number or Email</span>
                <div className="input-wrap">
                  <FaPhone className="input-icon" />
                  <input
                    type="text"
                    required
                    value={citizenContact}
                    onChange={(e) => setCitizenContact(e.target.value)}
                    placeholder="e.g. 9840123456 or citizen@example.com"
                  />
                </div>
              </label>

              <label className="field">
                <span>Ward / Residential Area</span>
                <div className="input-wrap">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    value={citizenArea}
                    onChange={(e) => setCitizenArea(e.target.value)}
                    placeholder="e.g. T. Nagar, Chennai"
                  />
                </div>
              </label>

              <button type="submit" className="solid big full-btn">
                <FaSignInAlt /> {citizenMode === 'login' ? 'Sign In to Citizen Dashboard' : 'Register & Enter Dashboard'}
              </button>
            </form>

            {/* Quick Demo Citizen Logins */}
            <div className="demo-credentials-box">
              <div className="demo-box-title">
                <FaCheckCircle className="text-green" /> <b>One-Click Demo Access:</b>
              </div>
              <div className="demo-btn-group">
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => quickLoginCitizen('Priya Raman', 'T. Nagar, Chennai')}
                >
                  Sign in as <b>Priya Raman</b> (Demo Citizen)
                </button>
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => quickLoginCitizen('Karthik S', 'Adyar, Chennai')}
                >
                  Sign in as <b>Karthik S</b> (Resident)
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
                <FaUserShield /> Module 2: Municipal Administrator
              </div>
              <h2>Municipal Admin Command Portal</h2>
              <p className="mute">
                Review incoming complaints, identify duplicate reports within 60 meters, monitor hotspots and assign authority teams.
              </p>
            </div>

            <form onSubmit={handleAdminSubmit} className="login-form">
              <label className="field">
                <span>Admin Official Email</span>
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
                <span>Admin Password / Passcode</span>
                <div className="input-wrap">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    required
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="Enter security password"
                  />
                </div>
              </label>

              <button type="submit" className="solid big full-btn admin-btn">
                <FaSignInAlt /> Sign In to Admin Command Dashboard
              </button>
            </form>

            {/* Quick Demo Admin Login */}
            <div className="demo-credentials-box">
              <div className="demo-box-title">
                <FaCheckCircle className="text-green" /> <b>One-Click Demo Access:</b>
              </div>
              <button
                type="button"
                className="demo-btn full-btn"
                onClick={quickLoginAdmin}
              >
                Sign In as <b>Chief Municipal Admin Desk</b> (Instant Demo)
              </button>
              <small className="mute d-block text-center mt-1">
                Full privileges: Duplicate Detection, Priority Queue, SLA Overdue Alerts, GIS Hotspot Map.
              </small>
            </div>
          </div>
        )}

        {/* AUTHORITY TAB */}
        {activeTab === 'authority' && (
          <div className="card login-card">
            <div className="login-card-head">
              <div className="login-badge-pill auth-pill">
                <FaHardHat /> Module 3: Authority & Field Teams
              </div>
              <h2>Authority Field Operations Portal</h2>
              <p className="mute">
                Manage assigned repair orders, update field progress, log inspection remarks and upload after-work proof photos.
              </p>
            </div>

            <form onSubmit={handleAuthoritySubmit} className="login-form">
              <label className="field">
                <span>Select Department / Team</span>
                <div className="input-wrap">
                  <FaBuilding className="input-icon" />
                  <select
                    value={authTeam}
                    onChange={(e) => setAuthTeam(e.target.value)}
                  >
                    {TEAMS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="field">
                <span>Field Officer Name / Employee ID</span>
                <div className="input-wrap">
                  <FaHardHat className="input-icon" />
                  <input
                    type="text"
                    required
                    value={authOfficer}
                    onChange={(e) => setAuthOfficer(e.target.value)}
                    placeholder="e.g. Officer R. Selvam"
                  />
                </div>
              </label>

              <label className="field">
                <span>Team Passkey</span>
                <div className="input-wrap">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    required
                    value={authPass}
                    onChange={(e) => setAuthPass(e.target.value)}
                  />
                </div>
              </label>

              <button type="submit" className="solid big full-btn auth-btn">
                <FaSignInAlt /> Sign In to {authTeam} Dashboard
              </button>
            </form>

            {/* Quick Demo Authority Department Logins */}
            <div className="demo-credentials-box">
              <div className="demo-box-title">
                <FaCheckCircle className="text-green" /> <b>One-Click Department Logins:</b>
              </div>
              <div className="demo-btn-grid">
                {TEAMS.map((teamName) => (
                  <button
                    key={teamName}
                    type="button"
                    className="demo-btn"
                    onClick={() => quickLoginAuthority(teamName)}
                  >
                    Login: <b>{teamName}</b>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Module Overview Footer Cards */}
      <div className="modules-summary-grid">
        <div className="module-feature-card">
          <div className="mod-icon citizen-icon"><FaUser /></div>
          <h4>1. Citizen Module</h4>
          <ul>
            <li>Photo & GPS Pin reporting</li>
            <li>Real-time tracking timeline</li>
            <li>Digital acknowledgment receipt</li>
            <li>Citizen feedback & star rating</li>
          </ul>
        </div>

        <div className="module-feature-card">
          <div className="mod-icon admin-icon"><FaUserShield /></div>
          <h4>2. Admin Module</h4>
          <ul>
            <li>Duplicate detection (&lt; 60m radius)</li>
            <li>Priority scoring & SLA alert monitor</li>
            <li>Interactive hotspot GIS map</li>
            <li>Team assignment & review desk</li>
          </ul>
        </div>

        <div className="module-feature-card">
          <div className="mod-icon auth-icon"><FaHardHat /></div>
          <h4>3. Authority Module</h4>
          <ul>
            <li>Department work order management</li>
            <li>Status progress update (In Progress)</li>
            <li>Mandatory after-repair photo proof</li>
            <li>Before/After resolution comparison</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
