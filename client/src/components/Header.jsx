import React from 'react';

const Header = () => (
  <header style={{
    background: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border)',
    padding: '0',
  }}>
    <div style={{
      maxWidth: 960,
      margin: '0 auto',
      padding: '18px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 40, height: 40,
          background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
          boxShadow: '0 0 20px var(--accent-glow)',
          flexShrink: 0,
        }}>🔐</div>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: '-0.5px',
            color: 'var(--text-primary)',
          }}>
            SecureCode<span style={{ color: 'var(--accent)' }}>.</span>Analyzer
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
            AI-powered vulnerability scanner
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['SQL Injection', 'XSS', 'Command Injection', 'Secrets'].map(label => (
          <span key={label} style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 20,
            background: 'rgba(37, 99, 235, 0.1)',
            color: '#93c5fd',
            border: '1px solid rgba(37, 99, 235, 0.25)',
          }}>{label}</span>
        ))}
      </div>
    </div>
  </header>
);

export default Header;
