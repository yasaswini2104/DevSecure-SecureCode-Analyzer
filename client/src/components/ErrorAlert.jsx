import React from 'react';

const ErrorAlert = ({ message }) => {
  if (!message) return null;
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="animate-in"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '14px 16px',
        borderRadius: 'var(--radius)',
        background: 'rgba(239, 68, 68, 0.07)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#fca5a5',
        fontSize: 13.5,
        lineHeight: 1.6,
      }}
    >
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠️</span>
      <p>{message}</p>
    </div>
  );
};

export default ErrorAlert;
