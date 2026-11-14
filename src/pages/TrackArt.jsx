import { useT } from '../i18n.jsx';
import { FLOW } from '../flow.js';

const P = [[70, 150], [190, 70], [310, 150], [430, 70], [550, 150], [670, 70]];
const ROAD = 'M20 150H70C130 150 130 70 190 70C250 70 250 150 310 150C370 150 370 70 430 70C490 70 490 150 550 150C610 150 610 70 670 70H720';

// Winding road with six stops. stage < 0 = guide mode; otherwise stops before it are done and it pulses.
export default function TrackArt({ stage = -1 }) {
  const { t } = useT();
  return (
    <svg viewBox="0 0 740 230" className="art" role="img" aria-label={t('tr_journey')}>
      <rect width="740" height="230" rx="18" fill="#eaf3fc" />
      <path d={ROAD} fill="none" stroke="#51606f" strokeWidth="30" strokeLinecap="round" />
      <path d={ROAD} className="lane" />
      {P.map(([x, y], i) => {
        const Icon = FLOW[i][0];
        const st = stage < 0 ? 'all' : i < stage ? 'done' : i === stage ? 'now' : 'next';
        return (
          <g key={i} className={'stn st-' + st}>
            {st === 'now' && <circle cx={x} cy={y} r="26" className="ring" />}
            <circle cx={x} cy={y} r="22" className="dot" />
            <Icon x={x - 10} y={y - 10} size={20} color="#fff" />
            <text x={x} y={y < 100 ? y - 36 : y + 46} textAnchor="middle" className="lbl">{t('s' + i + 't')}</text>
          </g>
        );
      })}
    </svg>
  );
}
