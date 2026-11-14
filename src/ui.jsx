import { useEffect, useRef } from 'react';
import { FaCheck } from 'react-icons/fa';
import { STAGES, STAGES_TA, LABELS, when, stamp, getStageLabel } from './data';
import { useT } from './i18n.jsx';

const LABELS_TA = [
  'புகார் பதிவு செய்யப்பட்டது',
  'ஆய்வில் உள்ளது',
  'குழுவுக்கு ஒதுக்கப்பட்டது',
  'நடவடிக்கை பணியில் உள்ளது',
  'தீர்க்கப்பட்டது',
  'முடிக்கப்பட்டது'
];

export const Plate = ({ id }) => <span className="plate">{id}</span>;
export const Chip = ({ tone = 'grey', children }) => <span className={'chip ' + tone}>{children}</span>;

export const Status = ({ c }) => {
  const { lang } = useT();
  const [t, l] = c.stage >= 4
    ? ['green', lang === 'ta' ? 'தீர்க்கப்பட்டது' : 'Resolved']
    : c.stage >= 2
    ? ['blue', lang === 'ta' ? 'பணியில்' : 'In Progress']
    : ['grey', lang === 'ta' ? 'பெறப்பட்டது' : 'Received'];
  return <Chip tone={t}>{l}</Chip>;
};

// Horizontal progress (admin / authority views).
export const Tracker = ({ c }) => {
  const { lang } = useT();
  const stagesList = lang === 'ta' ? STAGES_TA : STAGES;

  return (
    <ol className="road" aria-label="Complaint progress">
      {stagesList.map((s, i) => {
        const h = c.history.find((x) => x.stage === i);
        return (
          <li
            key={i}
            className={i < c.stage ? 'done' : i === c.stage ? 'now' : ''}
            aria-current={i === c.stage ? 'step' : undefined}
          >
            <i />
            <span>{s}</span>
            <small>{h ? when(h.at) : ''}</small>
          </li>
        );
      })}
    </ol>
  );
};

// Vertical timeline (track status page).
export const Timeline = ({ c }) => {
  const { lang } = useT();
  const labelsList = lang === 'ta' ? LABELS_TA : LABELS;

  return (
    <ol className="vt" aria-label="Complaint timeline">
      {labelsList.map((l, i) => {
        const h = c.history.find((x) => x.stage === i);
        return (
          <li
            key={i}
            className={i < c.stage ? 'done' : i === c.stage ? 'now' : ''}
            aria-current={i === c.stage ? 'step' : undefined}
          >
            <i>{i < c.stage ? <FaCheck /> : null}</i>
            <div>
              <b>{l}</b>
              <small>{h ? stamp(h.at) : (lang === 'ta' ? 'நிலுவையில்' : 'Pending')}</small>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

// Skeleton Shimmer Loading Placeholder Components
export const SkeletonCard = () => (
  <div className="skeleton-card" aria-hidden="true">
    <div className="skeleton-bar title" />
    <div className="skeleton-bar medium" />
    <div className="skeleton-bar short" />
  </div>
);

export const SkeletonScreen = () => (
  <div className="skeleton-wrap" aria-busy="true" aria-label="Loading data from database">
    <div className="skeleton-hero">
      <div className="skeleton-bar h1" />
      <div className="skeleton-bar subtitle" />
      <div className="skeleton-row-btn">
        <div className="skeleton-btn" />
        <div className="skeleton-btn small" />
      </div>
    </div>
    <div className="skeleton-stats">
      <div className="skeleton-stat-tile" />
      <div className="skeleton-stat-tile" />
      <div className="skeleton-stat-tile" />
      <div className="skeleton-stat-tile" />
    </div>
    <div className="skeleton-grid">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);

// Adds the class "in" to the element the first time it scrolls into view (used for entrance animation).
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { el?.classList.add('in'); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function Thanks({ onClose }) {
  const { t } = useT();
  return (
    <div className="thanks-modal" role="dialog" aria-modal="true">
      <div className="thanks-card">
        <h3>{t('th_t')}</h3>
        <p>{t('th_q')}</p>
        <p className="mute small">{t('th_f')}</p>
        <button className="solid" onClick={onClose}>{t('th_close')}</button>
      </div>
    </div>
  );
}
