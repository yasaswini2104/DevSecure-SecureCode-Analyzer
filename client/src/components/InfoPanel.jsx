import React from 'react';

const STEPS = [
  { num: 1, title: 'Paste Code',   desc: 'Paste any code snippet into the editor and select the language' },
  { num: 2, title: 'AI Scan',      desc: 'Click "AI Scan" — Gemini analyzes for OWASP Top 10 issues' },
  { num: 3, title: 'Review & Fix', desc: 'Inspect findings by severity and apply the suggested fixes' },
];

const DETECTIONS = [
  { icon: '🛡️', title: 'SQL / NoSQL Injection',  desc: 'Unsafe queries built from user input' },
  { icon: '🔑', title: 'Hardcoded Secrets',       desc: 'Passwords and API keys in source code' },
  { icon: '💉', title: 'XSS',                     desc: 'Unencoded user input in HTML output' },
  { icon: '💻', title: 'Command Injection',        desc: 'OS commands built from user input' },
  { icon: '🔒', title: 'Weak Cryptography',        desc: 'MD5, SHA-1, DES, RC4 usage' },
  { icon: '📂', title: 'Path Traversal',           desc: 'Directory traversal via unsanitized paths' },
  { icon: '🌐', title: 'SSRF',                     desc: 'Server-side requests to internal services' },
  { icon: '🔓', title: 'Broken Auth / IDOR',       desc: 'Missing authorization checks' },
];

const InfoPanel = () => (
  <section className="card animate-in">
    <div className="section-title" style={{ marginBottom: 20 }}>
      <span className="section-icon">✨</span>
      <h2>How It Works</h2>
    </div>

    <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
      {STEPS.map((step, i) => (
        <React.Fragment key={step.num}>
          <div style={{
            flex: 1, minWidth: 160,
            display: 'flex', alignItems: 'flex-start', gap: 12,
            background: 'var(--bg-elevated)',
            padding: '14px', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
          }}>
            <div style={{
              width: 28, height: 28, background: 'var(--accent-ai)', color: '#fff',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>{step.num}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{step.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{step.desc}</div>
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <span style={{ color: 'var(--text-muted)', fontSize: 20, alignSelf: 'center', flexShrink: 0 }}>→</span>
          )}
        </React.Fragment>
      ))}
    </div>

    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12,
      }}>
        AI Detects
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
        {DETECTIONS.map(d => (
          <div key={d.title} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: 'var(--bg-elevated)', padding: '12px 14px',
            borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: 18,
          }}>
            <span style={{ flexShrink: 0 }}>{d.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{d.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{d.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={{
      marginTop: 20, padding: '12px 16px',
      background: 'rgba(124, 58, 237, 0.08)',
      border: '1px solid rgba(124, 58, 237, 0.2)',
      borderRadius: 'var(--radius)', fontSize: 13, color: '#c4b5fd',
    }}>
      <strong>⚙ Setup:</strong> Set <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>gemini.api.key</code> in{' '}
      <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>application.properties</code> on the backend server before scanning.
    </div>
  </section>
);

export default InfoPanel;