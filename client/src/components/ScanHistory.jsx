import React from 'react';

const ScanHistory = ({ history, onRestore }) => {
  if (!history || history.length === 0) return null;

  return (
    <section className="card" style={{ padding: '16px 20px' }}>
      <div className="section-title" style={{ marginBottom: 12 }}>
        <span className="section-icon">🕒</span>
        <h2>Recent Scans</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {history.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onRestore(item)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              textAlign: 'left',
              gap: 12,
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-light)';
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--bg-elevated)';
            }}
            aria-label={`Restore scan from ${item.timestamp}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {item.timestamp}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 600,
                padding: '2px 8px', borderRadius: 10,
                background: 'rgba(37,99,235,0.1)',
                color: '#93c5fd',
                border: '1px solid rgba(37,99,235,0.2)',
              }}>
                {item.type}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {item.totalIssues > 0
                ? <span style={{ fontSize: 12, color: '#f87171', fontWeight: 600 }}>
                    ⚠️ {item.totalIssues} issue{item.totalIssues !== 1 ? 's' : ''}
                  </span>
                : <span style={{ fontSize: 12, color: 'var(--clean-text)', fontWeight: 600 }}>✅ Clean</span>
              }
              <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>Restore ↗</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ScanHistory;
