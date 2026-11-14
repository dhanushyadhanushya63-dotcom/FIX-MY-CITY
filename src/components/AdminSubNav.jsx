import { FaUserShield, FaUser, FaHardHat, FaChartLine } from 'react-icons/fa';
import { useT } from '../i18n.jsx';

export default function AdminSubNav({ active, go, adminSubTab, setAdminSubTab }) {
  const { t, lang } = useT();

  return (
    <div className="admin-subnav-bar">
      <div className="subnav-label">
        <FaUserShield /> <b>{t('sub_hub')}</b>
        <span>({t('sub_manage')})</span>
      </div>
      <div className="subnav-tabs">
        <button
          type="button"
          className={`subnav-tab ${active === 'admin' ? 'active' : ''}`}
          onClick={() => go('admin')}
        >
          <FaUserShield /> 1. {t('sub_admin')}
        </button>
        <button
          type="button"
          className={`subnav-tab ${active === 'citizen' ? 'active' : ''}`}
          onClick={() => go('citizen')}
        >
          <FaUser /> 2. {t('sub_citizen')}
        </button>
        <button
          type="button"
          className={`subnav-tab ${active === 'authority' ? 'active' : ''}`}
          onClick={() => go('authority')}
        >
          <FaHardHat /> 3. {t('sub_authority')}
        </button>
      </div>
    </div>
  );
}
