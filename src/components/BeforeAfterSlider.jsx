import { useState } from 'react';

export default function BeforeAfterSlider({
  beforeLabel = 'BEFORE (Reported)',
  afterLabel = 'AFTER (Resolved)',
  category = 'pothole',
}) {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="before-after-container" role="region" aria-label="Before and after resolution comparison">
      {/* AFTER IMAGE (Background) */}
      <div className="ba-layer ba-after">
        <svg viewBox="0 0 700 400" className="ba-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cleanSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#87CEEB"/>
              <stop offset="100%" stopColor="#E0F6FF"/>
            </linearGradient>
            <linearGradient id="freshTar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#374151"/>
              <stop offset="100%" stopColor="#1f2937"/>
            </linearGradient>
          </defs>
          <rect width="700" height="400" fill="url(#cleanSky)"/>
          <circle cx="620" cy="80" r="38" fill="#FBBF24" opacity="0.9"/>
          
          {/* Clean modern city backdrop */}
          <rect x="60" y="140" width="80" height="130" rx="4" fill="#93c5fd" opacity="0.6"/>
          <rect x="160" y="110" width="100" height="160" rx="4" fill="#60a5fa" opacity="0.7"/>
          <rect x="440" y="125" width="90" height="145" rx="4" fill="#93c5fd" opacity="0.6"/>
          <rect x="550" y="150" width="85" height="120" rx="4" fill="#60a5fa" opacity="0.7"/>
          
          {/* Clean green park sidewalk */}
          <rect x="0" y="240" width="700" height="40" fill="#86efac"/>
          <circle cx="100" cy="230" r="24" fill="#22c55e"/>
          <circle cx="120" cy="225" r="20" fill="#16a34a"/>
          <rect x="108" y="235" width="8" height="25" fill="#78350f"/>

          <circle cx="580" cy="230" r="26" fill="#22c55e"/>
          <circle cx="600" cy="222" r="22" fill="#16a34a"/>
          <rect x="588" y="235" width="8" height="25" fill="#78350f"/>
          
          {/* Smooth freshly paved road */}
          <rect x="0" y="270" width="700" height="130" fill="url(#freshTar)"/>
          {/* Crisp white lane markings */}
          <line x1="50" y1="335" x2="150" y2="335" stroke="#ffffff" strokeWidth="8" strokeDasharray="30 20"/>
          <line x1="200" y1="335" x2="350" y2="335" stroke="#ffffff" strokeWidth="8" strokeDasharray="30 20"/>
          <line x1="400" y1="335" x2="550" y2="335" stroke="#ffffff" strokeWidth="8" strokeDasharray="30 20"/>
          <line x1="600" y1="335" x2="680" y2="335" stroke="#ffffff" strokeWidth="8" strokeDasharray="30 20"/>

          {/* Quality verification stamp */}
          <g transform="translate(480, 290)">
            <rect width="180" height="42" rx="21" fill="#15803d" opacity="0.95"/>
            <text x="90" y="26" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              ✓ WORK VERIFIED
            </text>
          </g>
        </svg>
        <span className="ba-badge after-badge">{afterLabel}</span>
      </div>

      {/* BEFORE IMAGE (Clipped on top) */}
      <div className="ba-layer ba-before" style={{ width: `${sliderPos}%` }}>
        <svg viewBox="0 0 700 400" className="ba-svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="dustySky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cbd5e1"/>
              <stop offset="100%" stopColor="#e2e8f0"/>
            </linearGradient>
            <linearGradient id="wornRoad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569"/>
              <stop offset="100%" stopColor="#334155"/>
            </linearGradient>
          </defs>
          <rect width="700" height="400" fill="url(#dustySky)"/>
          
          {/* Dull city backdrop */}
          <rect x="60" y="140" width="80" height="130" rx="4" fill="#94a3b8" opacity="0.4"/>
          <rect x="160" y="110" width="100" height="160" rx="4" fill="#64748b" opacity="0.4"/>
          <rect x="440" y="125" width="90" height="145" rx="4" fill="#94a3b8" opacity="0.4"/>
          <rect x="550" y="150" width="85" height="120" rx="4" fill="#64748b" opacity="0.4"/>
          
          {/* Broken dusty curb */}
          <rect x="0" y="240" width="700" height="40" fill="#d1d5db"/>
          
          {/* Cracked broken asphalt road */}
          <rect x="0" y="270" width="700" height="130" fill="url(#wornRoad)"/>
          <path d="M40 310 L120 315 L180 305 L240 318" stroke="#1e293b" strokeWidth="3" fill="none"/>
          <path d="M450 330 L520 340 L600 325" stroke="#1e293b" strokeWidth="4" fill="none"/>
          <path d="M220 350 L280 355 L320 348" stroke="#1e293b" strokeWidth="2.5" fill="none"/>

          {/* Deep pothole with warning cones */}
          <ellipse cx="320" cy="335" rx="75" ry="32" fill="#0f172a"/>
          <ellipse cx="320" cy="338" rx="60" ry="24" fill="#78350f" opacity="0.7"/>
          <ellipse cx="320" cy="340" rx="45" ry="16" fill="#1e293b"/>
          
          {/* Warning Cone */}
          <polygon points="210,320 226,370 194,370" fill="#f97316"/>
          <polygon points="210,332 222,370 198,370" fill="#ffffff" opacity="0.6"/>
          <polygon points="210,320 218,345 202,345" fill="#f97316"/>

          {/* Issue Alert badge */}
          <g transform="translate(40, 290)">
            <rect width="180" height="42" rx="21" fill="#dc2626" opacity="0.95"/>
            <text x="90" y="26" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              ⚠ SEVERE ISSUE
            </text>
          </g>
        </svg>
        <span className="ba-badge before-badge">{beforeLabel}</span>
      </div>

      {/* DIVIDER HANDLE */}
      <div className="ba-divider" style={{ left: `${sliderPos}%` }}>
        <div className="ba-handle" aria-hidden="true">
          <span>‹ ›</span>
        </div>
      </div>

      {/* ACCESSIBLE SLIDER INPUT */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPos}
        onChange={(e) => setSliderPos(Number(e.target.value))}
        className="ba-range-input"
        aria-label="Drag to compare before and after resolution"
      />
    </div>
  );
}
