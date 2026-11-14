import { FaBullhorn, FaRegClock, FaShieldAlt, FaLeaf, FaArrowRight, FaCheckCircle, FaBolt, FaStar, FaTools, FaUser, FaUserShield, FaHardHat } from 'react-icons/fa';
import { useT } from '../i18n.jsx';
import { useReveal } from '../ui.jsx';
import { FLOW } from '../flow.js';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import heroBanner from '../assets/home-hero.png';

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
  const { t, lang } = useT();
  return (
    <>
      {/* MUNICIPALITY CIVIC HERO BANNER */}
      <section className="home-hero-banner-section" aria-label="Our Street, Our Responsibilities">
        <div className="hero-banner-container">
          <img
            src={heroBanner}
            alt={lang === 'ta' ? 'நமது தெரு, நமது பொறுப்புகள்' : 'FixMyStreet - Our Street, Our Responsibilities'}
            className="hero-banner-image"
          />

          {/* Dynamic Tamil Text Overlays when Tamil language is selected */}
          {lang === 'ta' && (
            <div className="hero-ta-banner-layer">
              <div className="hero-ta-headline-box">
                <h1 className="hero-ta-main-title">நமது தெரு, நமது பொறுப்புகள்</h1>
                <p className="hero-ta-sub-title">குடிமைப் புகார்களைப் பதிவு செய்து, நேரலைத் தீர்வை எளிதாக அறிந்திடுங்கள்!</p>
              </div>
            </div>
          )}

          {/* Interactive Clickable Hotspots mapped directly to the image */}
          <div className="hero-interactive-grid">
            <button
              type="button"
              className={`hero-hotspot explore-hotspot ${lang === 'ta' ? 'ta-mode' : ''}`}
              onClick={() => go('citizen')}
              title={lang === 'ta' ? 'குடிமக்கள் சேவைகளை ஆராய்க' : 'Explore Citizen Portal & Services'}
            >
              {lang === 'ta' ? <span className="hero-ta-explore-text">சேவைகளை ஆராய்க →</span> : <span className="sr">Explore Services</span>}
            </button>

            <div className="hero-cards-hotspots">
              <button
                type="button"
                className={`card-hotspot ${lang === 'ta' ? 'ta-card' : ''}`}
                onClick={() => go('register')}
                title={lang === 'ta' ? 'குப்பை மேலாண்மை புகார்' : 'Report Waste Management Issue'}
              >
                {lang === 'ta' ? <span className="hero-ta-card-pill">குப்பை மேலாண்மை</span> : <span className="sr">Waste Management</span>}
              </button>

              <button
                type="button"
                className={`card-hotspot ${lang === 'ta' ? 'ta-card' : ''}`}
                onClick={() => go('register')}
                title={lang === 'ta' ? 'குடிநீர் சேவைகள் புகார்' : 'Report Water Services Issue'}
              >
                {lang === 'ta' ? <span className="hero-ta-card-pill">குடிநீர் சேவைகள்</span> : <span className="sr">Water Services</span>}
              </button>

              <button
                type="button"
                className={`card-hotspot ${lang === 'ta' ? 'ta-card' : ''}`}
                onClick={() => go('register')}
                title={lang === 'ta' ? 'சாலைப் பராமரிப்பு புகார்' : 'Report Road Maintenance Issue'}
              >
                {lang === 'ta' ? <span className="hero-ta-card-pill">சாலைப் பராமரிப்பு</span> : <span className="sr">Road Maintenance</span>}
              </button>

              <button
                type="button"
                className={`card-hotspot ${lang === 'ta' ? 'ta-card' : ''}`}
                onClick={() => go('register')}
                title={lang === 'ta' ? 'புதிய புகார் பதிவு செய்க' : 'Register New Complaint'}
              >
                {lang === 'ta' ? <span className="hero-ta-card-pill">புகார் பதிவு</span> : <span className="sr">Report Issue</span>}
              </button>

              <button
                type="button"
                className={`card-hotspot ${lang === 'ta' ? 'ta-card' : ''}`}
                onClick={() => go('track')}
                title={lang === 'ta' ? 'புகாரின் நேரலை நிலை' : 'Track Complaint Status Live'}
              >
                {lang === 'ta' ? <span className="hero-ta-card-pill">நிலை அறிதல்</span> : <span className="sr">Track Status</span>}
              </button>

              <button
                type="button"
                className={`card-hotspot ${lang === 'ta' ? 'ta-card' : ''}`}
                onClick={() => go('admin')}
                title={lang === 'ta' ? 'நகராட்சி அறிவிப்புகள்' : 'View Municipal Notices & Hotspot Map'}
              >
                {lang === 'ta' ? <span className="hero-ta-card-pill">அறிவிப்புகள்</span> : <span className="sr">Latest Notices</span>}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 CORE APPLICATION MODULES SHOWCASE */}
      <section className="modules-portal-bar" aria-label="FixMyStreet 3 Main Modules">
        <div className="module-banner-card citizen-banner" onClick={() => go('citizen')}>
          <div className="mod-head">
            <span className="mod-icon citizen-icon"><FaUser /></span>
            <div>
              <b>1. {t('sub_citizen')}</b>
              <small className="mute d-block">{lang === 'ta' ? 'புகார், கண்காணிப்பு & சரிபார்ப்பு' : 'Report, Track & Verify'}</small>
            </div>
          </div>
          <p className="small">
            {lang === 'ta'
              ? 'புகைப்படம் மற்றும் வரைபடக் குறிப்புடன் குடிமைப் புகார்களைப் பதிவு செய்யவும், நிகழ்நேரத் தீர்வைப் பின்தொடரவும், ரசீதுகளைப் பெறவும்.'
              : 'Report civic issues with photos and GPS pin, track real-time resolution timeline and download receipts.'}
          </p>
          <span className="launch-link">{lang === 'ta' ? 'குடிமக்கள் டாஷ்போர்டு திறக்க →' : 'Open Citizen Dashboard →'}</span>
        </div>

        <div className="module-banner-card admin-banner" onClick={() => go('admin')}>
          <div className="mod-head">
            <span className="mod-icon admin-icon"><FaUserShield /></span>
            <div>
              <b>2. {t('sub_admin')}</b>
              <small className="mute d-block">{lang === 'ta' ? 'ஆய்வு, நகல்கள் & ஒதுக்கீடு' : 'Review, Duplicates & Assign'}</small>
            </div>
          </div>
          <p className="small">
            {lang === 'ta'
              ? 'வரும் புகார்களை ஆய்வு செய்து, 60 மீட்டருக்குள் நகல் அறிக்கைகளைக் கண்டறிந்து, GIS ஹாட்ஸ்பாட்களைக் கண்காணித்து, களக் குழுக்களை ஒதுக்கவும்.'
              : 'Review incoming complaints, identify duplicate reports within 60m, monitor GIS hotspots and dispatch authority teams.'}
          </p>
          <span className="launch-link">{lang === 'ta' ? 'நிர்வாகி டாஷ்போர்டு திறக்க →' : 'Open Admin Dashboard →'}</span>
        </div>

        <div className="module-banner-card auth-banner" onClick={() => go('authority')}>
          <div className="mod-head">
            <span className="mod-icon auth-icon"><FaHardHat /></span>
            <div>
              <b>3. {t('sub_authority')}</b>
              <small className="mute d-block">{lang === 'ta' ? 'பணி மேலாண்மை & ஆதாரம்' : 'Execute Work & Proof'}</small>
            </div>
          </div>
          <p className="small">
            {lang === 'ta'
              ? 'ஒதுக்கப்பட்ட துறை பணி ஆணைகளை நிர்வகிக்கவும், கள முன்னேற்றக் குறிப்புகளைப் புதுப்பிக்கவும், பழுது நீக்கிய ஆதாரப் புகைப்படங்களைப் பதிவேற்றவும்.'
              : 'Manage departmental work orders, update field progress notes and upload mandatory after-work repair proof photos.'}
          </p>
          <span className="launch-link">{lang === 'ta' ? 'அதிகாரி டாஷ்போர்டு திறக்க →' : 'Open Authority Dashboard →'}</span>
        </div>
      </section>

      {/* LIVE CIVIC PULSE STATS TICKER */}
      <section className="live-pulse-bar" aria-label="Live city civic stats">
        <div className="pulse-item">
          <div className="pulse-num"><span className="live-dot" /> 1,428+</div>
          <small><FaCheckCircle /> {lang === 'ta' ? 'இம்மாதம் தீர்க்கப்பட்டவை' : 'Issues Resolved This Month'}</small>
        </div>
        <div className="pulse-item">
          <div className="pulse-num">3.2 {lang === 'ta' ? 'நாட்கள்' : 'Days'}</div>
          <small><FaBolt /> {lang === 'ta' ? 'சராசரி தீர்வு நேரம்' : 'Average Turnaround Time'}</small>
        </div>
        <div className="pulse-item">
          <div className="pulse-num">95.4%</div>
          <small><FaStar /> {lang === 'ta' ? 'குடிமக்கள் திருப்தி விகிதம்' : 'Citizen Satisfaction Rate'}</small>
        </div>
        <div className="pulse-item">
          <div className="pulse-num">4,850+</div>
          <small><FaTools /> {lang === 'ta' ? 'சரிபார்க்கப்பட்ட நடவடிக்கைகள்' : 'Verified Civic Actions'}</small>
        </div>
      </section>

      <section className="tiles" aria-label="FixMyStreet">
        {FEATURES.map(([Icon, k]) => (
          <div key={k} className="tile"><span className="ico"><Icon /></span><b>{t(k + 't')}</b><small>{t(k + 'd')}</small></div>
        ))}
      </section>

      {/* UNIQUE INTERACTIVE BEFORE & AFTER CIVIC PROOF SHOWCASE */}
      <section className="impact-showcase" aria-label="Civic impact before and after proof">
        <div className="impact-head">
          <div>
            <span className="eyebrow">{lang === 'ta' ? 'சரிபார்க்கப்பட்ட மக்கள் தாக்கம்' : 'VERIFIED CIVIC IMPACT'}</span>
            <h2>{lang === 'ta' ? 'உண்மையான முடிவுகள்: பழுது நீக்குவதற்கு முன் & பின்' : 'Real Results: Before & After Fixes'}</h2>
            <p className="mute">
              {lang === 'ta'
                ? 'புகாரளிக்கப்பட்ட தெருப் பிரச்சினையையும், நகராட்சி தீர்வு செய்த பின் உள்ள நிலையையும் ஒப்பிட்டுப் பார்க்க ஸ்லைடரை கிடைமட்டமாக நகர்த்தவும்.'
                : 'Drag the slider horizontally to compare the reported street issue with the completed municipal resolution.'}
            </p>
          </div>
          <div className="impact-tag">
            <span>{lang === 'ta' ? 'மண்டலம் 4 - அண்ணா சாலை குழி சீரமைப்பு' : 'Zone 4 - Anna Salai Pothole Repair'}</span>
          </div>
        </div>

        <BeforeAfterSlider
          beforeLabel={lang === 'ta' ? 'முன்: ஆபத்தான குழி' : 'REPORTED: DEEP POTHOLE'}
          afterLabel={lang === 'ta' ? 'பின்: தார் சாலை சீரமைப்பு முடிந்தது' : 'RESOLVED: TAR LEVELLING COMPLETE'}
          category="pothole"
        />
      </section>

      <Workflow />
      <section className="home-contact-intro">
        <span className="eyebrow">{lang === 'ta' ? 'நாங்கள் கேட்கிறோம்' : 'WE ARE LISTENING'}</span>
        <h2>{lang === 'ta' ? 'நமது பகுதியை சிறந்ததாக்குவோம் வாருங்கள்.' : 'Let’s make our neighbourhood better.'}</h2>
        <p>
          {lang === 'ta'
            ? 'குடிமைப் புகாரைப் பதிவு செய்வது அல்லது பின்தொடர்வது குறித்த கேள்விகள் உள்ளதா? எங்கள் குழுவுக்கு கீழே செய்தி அனுப்பவும்.'
            : 'Have a question about reporting or tracking a civic issue? Send our team a message below.'}
        </p>
      </section>
    </>
  );
}
