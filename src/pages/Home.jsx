import { FaBullhorn, FaRegClock, FaShieldAlt, FaLeaf, FaArrowRight } from 'react-icons/fa';
import { useT } from '../i18n.jsx';
import { useReveal } from '../ui.jsx';
import { FLOW } from '../flow.js';

const Skyline = () => (
  <svg className="city-illustration" viewBox="0 0 680 430" role="img" aria-label="Bright illustration of a modern municipal civic centre and a clean green neighbourhood">
    <defs>
      <linearGradient id="citySky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8f1f0"/><stop offset="1" stopColor="#f6fffb"/></linearGradient>
      <linearGradient id="civicWall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffdf5"/><stop offset="1" stopColor="#dceee7"/></linearGradient>
      <linearGradient id="cityGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8edbd4"/><stop offset="1" stopColor="#258c99"/></linearGradient>
      <filter id="cityShadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#174b55" floodOpacity=".16"/></filter>
    </defs>
    <rect width="680" height="430" rx="28" fill="url(#citySky)"/>
    <circle cx="565" cy="75" r="34" fill="#ffd778" opacity=".95"/>
    <path d="M0 270 Q120 215 245 268 T490 258 T680 250 V430 H0Z" fill="#d9f0df"/>
    <g opacity=".92">
      <rect x="34" y="130" width="100" height="155" rx="8" fill="#9bc9c5"/><rect x="48" y="148" width="22" height="30" rx="3" fill="#eafff7"/><rect x="86" y="148" width="22" height="30" rx="3" fill="#eafff7"/><rect x="48" y="194" width="22" height="30" rx="3" fill="#eafff7"/><rect x="86" y="194" width="22" height="30" rx="3" fill="#eafff7"/>
      <rect x="548" y="145" width="91" height="140" rx="8" fill="#a8d3ca"/><rect x="562" y="163" width="22" height="27" rx="3" fill="#effff8"/><rect x="600" y="163" width="22" height="27" rx="3" fill="#effff8"/><rect x="562" y="204" width="22" height="27" rx="3" fill="#effff8"/><rect x="600" y="204" width="22" height="27" rx="3" fill="#effff8"/>
    </g>
    <g filter="url(#cityShadow)">
      <rect x="166" y="154" width="350" height="184" rx="10" fill="url(#civicWall)"/>
      <path d="M148 160 L341 65 L534 160Z" fill="#f6fbf2"/>
      <path d="M166 158 L341 76 L516 158" fill="none" stroke="#c6ded5" strokeWidth="5"/>
      <rect x="310" y="92" width="62" height="65" rx="5" fill="#fffdf5"/>
      <path d="M302 94 L341 55 L380 94Z" fill="#087f8c"/>
      <rect x="335" y="104" width="12" height="40" fill="#d6e9df"/>
      <rect x="194" y="184" width="294" height="14" rx="4" fill="#123d54"/>
      <text x="341" y="194" textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="1.2" fill="#ffffff" fontFamily="Inter,Arial,sans-serif">MUNICIPAL CIVIC CENTRE</text>
      {[205,250,295,340,385,430,475].map((x) => <g key={x}><rect x={x} y="218" width="27" height="72" rx="4" fill="url(#cityGlass)"/><path d={`M${x+5} 225 V282`} stroke="#dffff8" strokeWidth="3" opacity=".65"/></g>)}
      <rect x="317" y="270" width="48" height="68" rx="5" fill="#087f8c"/><rect x="326" y="281" width="30" height="57" rx="3" fill="#c9f1e7"/>
      <rect x="181" y="335" width="320" height="10" rx="4" fill="#b3d3c8"/>
    </g>
    <g>
      {[[105,290],[580,292],[145,322],[535,322]].map(([x,y],i)=><g key={i}><rect x={x-5} y={y} width="10" height="49" rx="3" fill="#8a6547"/><circle cx={x} cy={y-13} r="29" fill={i%2?'#39a96b':'#53bd7b'}/><circle cx={x-13} cy={y-24} r="15" fill="#73cf91"/></g>)}
      <path d="M0 365 Q170 344 340 365 T680 362 V430 H0Z" fill="#b6d9c5"/>
      <path d="M0 390 Q180 365 340 390 T680 385 V430 H0Z" fill="#6b8582"/>
      <path d="M0 397 H680" stroke="#e9f1dd" strokeWidth="5" strokeDasharray="32 24"/>
      <path d="M250 365 Q340 345 430 365" fill="none" stroke="#f7fff8" strokeWidth="8" opacity=".8"/>
    </g>
    <g transform="translate(75 340)"><circle cx="0" cy="0" r="13" fill="#123d54"/><circle cx="0" cy="-18" r="8" fill="#f0b28a"/><path d="M-8 -4 L-13 18 M8 -4 L13 18" stroke="#123d54" strokeWidth="6" strokeLinecap="round"/><path d="M-8 -10 L8 -10" stroke="#12a8a0" strokeWidth="9" strokeLinecap="round"/></g>
    <g transform="translate(610 355)"><circle cx="0" cy="0" r="12" fill="#123d54"/><circle cx="0" cy="-18" r="8" fill="#d99c72"/><path d="M-8 -4 L-13 18 M8 -4 L13 18" stroke="#123d54" strokeWidth="6" strokeLinecap="round"/><path d="M-8 -10 L8 -10" stroke="#f3a64a" strokeWidth="9" strokeLinecap="round"/></g>
  </svg>
);

const FEATURES = [[FaBullhorn, 'f1'], [FaRegClock, 'f2'], [FaShieldAlt, 'f3'], [FaLeaf, 'f4']];

function Workflow() {
  const { t } = useT();
  const ref = useReveal();
  return (
    <section className="flow" ref={ref} aria-labelledby="wf-title">
      <h2 id="wf-title">{t('w_title')}</h2>
      <p className="lead">{t('w_sub')}</p>
      <ol className="steps">
        {FLOW.map(([Icon, who], i) => (
          <li key={i} style={{ '--i': i }}>
            <span className="num">{i + 1}</span>
            <span className="ico"><Icon /></span>
            <b>{t('s' + i + 't')}</b>
            <p>{t('s' + i + 'd')}</p>
            <em className={'who ' + who}>{t('r_' + who)}</em>
          </li>
        ))}
      </ol>
      <p className="note">{t('w_note')}</p>
    </section>
  );
}

export default function Home({ go }) {
  const { t } = useT();
  return (
    <>
      <section className="hero">
        <div>
          <h1>{t('h_a')} <span>{t('h_b')}</span></h1>
          <p>{t('h_sub')}</p>
          <div className="row">
            <button className="solid big" onClick={() => go('register')}>{t('h_reg')} <FaArrowRight /></button>
            <button className="ghost big" onClick={() => go('track')}>{t('h_track')}</button>
          </div>
        </div>
        <Skyline />
      </section>
      <section className="tiles" aria-label="FixMyStreet">
        {FEATURES.map(([Icon, k]) => (
          <div key={k} className="tile"><span className="ico"><Icon /></span><b>{t(k + 't')}</b><small>{t(k + 'd')}</small></div>
        ))}
      </section>
      <Workflow />
      <section className="home-contact-intro"><span className="eyebrow">WE ARE LISTENING</span><h2>Let’s make our neighbourhood better.</h2><p>Have a question about reporting or tracking a civic issue? Send our team a message below.</p></section>
    </>
  );
}

// Hero section, CTA buttons and stats added
