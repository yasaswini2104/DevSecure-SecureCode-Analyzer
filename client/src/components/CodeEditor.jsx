import React from 'react';
import Editor from '@monaco-editor/react';
import { SAMPLE_CODE, LANGUAGES } from '../constants';

const MONACO_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 13,
  lineHeight: 22,
  fontFamily: "'Space Mono', 'Fira Code', monospace",
  fontLigatures: true,
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
  overviewRulerBorder: false,
  renderLineHighlight: 'gutter',
  padding: { top: 14, bottom: 14 },
};

const CodeEditor = ({ code, onChange, language, onLanguageChange, onScan, onClear, loading }) => {
  const lineCount = code ? code.split('\n').length : 0;
  const charCount = code ? code.length : 0;

  return (
    <section className="card">
      <div className="section-header">
        <div className="section-title">
          <span className="section-icon">📝</span>
          <h2>Code Input</h2>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            aria-label="Select programming language"
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '7px 12px',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
            }}
          >
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
          <button className="btn btn-ghost" onClick={() => onChange(SAMPLE_CODE)} disabled={loading}>
            Load Sample
          </button>
          <button className="btn btn-ghost" onClick={onClear} disabled={loading}>
            Clear
          </button>
        </div>
      </div>

      <div style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        minHeight: 320,
        background: 'var(--bg-input)',
      }}>
        <Editor
          height="320px"
          language={language === 'csharp' ? 'csharp' : language}
          value={code}
          onChange={(val) => onChange(val || '')}
          theme="vs-dark"
          options={MONACO_OPTIONS}
          loading={
            <div style={{
              height: 320,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', fontSize: 13,
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg-input)',
            }}>
              Loading editor…
            </div>
          }
        />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 14,
        flexWrap: 'wrap',
        gap: 10,
      }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {lineCount} {lineCount === 1 ? 'line' : 'lines'}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {charCount.toLocaleString()} chars
          </span>
        </div>

        <button
          className="btn btn-ai"
          onClick={onScan}
          disabled={loading || !code.trim()}
          aria-busy={loading}
          aria-label="Scan code with AI"
        >
          {loading
            ? <><span className="spinner" /> Analyzing…</>
            : <><span aria-hidden>✨</span> AI Scan</>
          }
        </button>
      </div>
    </section>
  );
};

export default CodeEditor;
