import React from 'react';

const SecurityScoreGauge = ({ score }) => {
  const getColor = (s) => {
    if (s >= 80) return '#4ade80';
    if (s >= 60) return '#fde047';
    if (s >= 40) return '#fdba74';
    return '#f87171';
  };

  const getLabel = (s) => {
    if (s >= 80) return 'Secure';
    if (s >= 60) return 'Moderate Risk';
    if (s >= 40) return 'High Risk';
    return 'Critical Risk';
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference * (1 - score / 100);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px 20px',
      background: 'var(--bg-elevated)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
    }}>
      <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
   
          <circle cx="40" cy="40" r="36"
            fill="none" stroke="var(--border)" strokeWidth="6" />
          
          <circle cx="40" cy="40" r="36"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: 18,
          color,
        }}>
          {score}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
          Security Score
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color, marginBottom: 2 }}>
          {getLabel(score)}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Out of 100 — higher is better
        </div>
      </div>
    </div>
  );
};

export default SecurityScoreGauge;
