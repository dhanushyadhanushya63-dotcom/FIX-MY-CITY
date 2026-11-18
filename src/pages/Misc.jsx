import { FaBullhorn, FaUserShield, FaHardHat, FaClone, FaSortAmountUp, FaMapMarkedAlt, FaHourglassHalf, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import { useT } from '../i18n.jsx';

export function About({ go }) {
  const { t } = useT();
  const who = [[FaBullhorn, 'u1'], [FaUserShield, 'u2'], [FaHardHat, 'u3']];
  const checks = [[FaClone, 'k1'], [FaSortAmountUp, 'k2'], [FaMapMarkedAlt, 'k3'], [FaHourglassHalf, 'k4']];
  return (
    <section className="about">
      <h2>{t('ab_title')}</h2>
      <p className="lead">{t('ab_lead')}</p>

      <h3 className="sec">{t('ab_why')}</h3>
      <div className="vs" role="table" aria-label={t('ab_why')}>
        <div className="vshead" role="row"><span role="columnheader">{t('ab_before')}</span><span role="columnheader">{t('ab_after')}</span></div>
        {[1, 2, 3, 4].map((n) => (
          <div className="vsrow" role="row" key={n} style={{ '--i': n }}>
            <div className="before" role="cell"><FaTimesCircle aria-hidden="true" />{t('p' + n + 'b')}</div>
            <div className="after" role="cell"><FaCheckCircle aria-hidden="true" />{t('p' + n + 'a')}</div>
          </div>
        ))}
      </div>

      <h3 className="sec">{t('ab_who')}</h3>
      <div className="tiles three">
        {who.map(([I, k]) => <div key={k} className="tile left"><span className="ico"><I /></span><b>{t(k + 't')}</b><small>{t(k + 'd')}</small></div>)}
      </div>
      <p className="note">{t('ab_signin')}</p>

      <h3 className="sec">{t('ab_checks')}</h3>
      <div className="tiles">
        {checks.map(([I, k]) => <div key={k} className="tile left"><span className="ico"><I /></span><b>{t(k + 't')}</b><small>{t(k + 'd')}</small></div>)}
      </div>
      <button className="solid big" onClick={() => go('register')}>{t('h_reg')}</button>
    </section>
  );
}

const ROLES = [
  { role: 'admin', name: 'Admin Desk', title: 'Admin', text: 'Review complaints, catch duplicates and assign teams.' },
  { role: 'authority', name: 'Zone 4 Roads', team: 'Zone 4 Roads', title: 'Authority', text: 'Work through assigned complaints and upload proof.' },
];
export const Staff = ({ onEnter }) => (
  <section className="card staff">
    <h2>Staff sign-in</h2>
    <p className="mute">Demo mode: no password needed. Residents do not need to sign in.</p>
    {ROLES.map((r) => <button key={r.role} className="role" onClick={() => onEnter(r)}><b>{r.title}</b><span>{r.text}</span></button>)}
  </section>
);

// About us, Contact and FAQ accordion sections

// Contact form: name, email, subject, message with FormData submit
