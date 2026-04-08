import React from 'react';

const Footer = () => (
  <footer style={{
    textAlign: 'center',
    padding: '20px',
    borderTop: '1px solid var(--border)',
    color: 'var(--text-muted)',
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    background: 'var(--bg-surface)',
  }}>
    SecureCode Analyzer v2.0 — React + Vite &amp; Spring Boot &bull; Built for security engineers
  </footer>
);

export default Footer;
