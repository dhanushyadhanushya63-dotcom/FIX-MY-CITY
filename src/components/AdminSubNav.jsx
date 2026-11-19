import { FaUserShield, FaUser, FaHardHat } from 'react-icons/fa';

export default function AdminSubNav({ active, go }) {
  return (
    <div className="admin-subnav-bar">
      <div className="subnav-label">
        <FaUserShield /> <b>Admin Control Hub</b>
        <span>(Manage & Access All 3 Dashboards)</span>
      </div>
      <div className="subnav-tabs">
        <button
          type="button"
          className={`subnav-tab ${active === 'admin' ? 'active' : ''}`}
          onClick={() => go('admin')}
        >
          <FaUserShield /> 1. Admin Desk
        </button>
        <button
          type="button"
          className={`subnav-tab ${active === 'citizen' ? 'active' : ''}`}
          onClick={() => go('citizen')}
        >
          <FaUser /> 2. Citizen Dashboard
        </button>
        <button
          type="button"
          className={`subnav-tab ${active === 'authority' ? 'active' : ''}`}
          onClick={() => go('authority')}
        >
          <FaHardHat /> 3. Authority Teams
        </button>
      </div>
    </div>
  );
}
