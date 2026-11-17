import { useEffect, useRef } from 'react';
import { FaCheck } from 'react-icons/fa';
import { STAGES, LABELS, when, stamp } from './data';

export const Plate = ({ id }) => <span className="plate">{id}</span>;
export const Chip = ({ tone = 'grey', children }) => <span className={'chip ' + tone}>{children}</span>;
export const Status = ({ c }) => {
  const [t, l] = c.stage >= 4 ? ['green', 'Resolved'] : c.stage >= 2 ? ['blue', 'In Progress'] : ['grey', 'Received'];
  return <Chip tone={t}>{l}</Chip>;
};

// Horizontal progress (admin / authority views).
export const Tracker = ({ c }) => (
  <ol className="road" aria-label="Complaint progress">
    {STAGES.map((s, i) => {
      const h = c.history.find((x) => x.stage === i);
      return (
        <li key={s} className={i < c.stage ? 'done' : i === c.stage ? 'now' : ''} aria-current={i === c.stage ? 'step' : undefined}>
          <i /><span>{s}</span><small>{h ? when(h.at) : ''}</small>
        </li>
      );
    })}
  </ol>
);

// Vertical timeline (track status page).
export const Timeline = ({ c }) => (
  <ol className="vt" aria-label="Complaint timeline">
    {LABELS.map((l, i) => {
      const h = c.history.find((x) => x.stage === i);
      return (
        <li key={l} className={i < c.stage ? 'done' : i === c.stage ? 'now' : ''} aria-current={i === c.stage ? 'step' : undefined}>
          <i>{i < c.stage ? <FaCheck /> : null}</i>
          <div><b>{l}</b><small>{h ? stamp(h.at) : 'Pending'}</small></div>
        </li>
      );
    })}
  </ol>
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

// "Thank you" pop-up with a smiling emoji. Closes on button, backdrop click or Esc.
export function Thanks({ text, onClose, title, label }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="veil" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="thx" onClick={(e) => e.stopPropagation()}>
        <div className="smile" aria-hidden="true">😊</div>
        <h2 id="thx">{title}</h2>
        <p>{text}</p>
        <button className="solid" autoFocus onClick={onClose}>{label}</button>
      </div>
    </div>
  );
}

// Modal dialog, Toast notifications and Card components

// ARIA: aria-label and role attributes on all buttons and inputs
