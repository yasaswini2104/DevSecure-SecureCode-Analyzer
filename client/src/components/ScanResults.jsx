import React, { useState, useMemo } from 'react';
import VulnerabilityCard from './VulnerabilityCard';
import SecurityScoreGauge from './SecurityScoreGauge';
import { exportResultsAsJson } from '../services/scanService';
import { SCAN_STATUS } from '../constants';

const SEVERITY_ORDER = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const ScanResults = ({ results }) => {
  const [filter, setFilter] = useState('ALL');
  const isClean = results.status === SCAN_STATUS.CLEAN;
  const vulns = results.vulnerabilities || [];

  const counts = useMemo(() => {
    const c = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    vulns.forEach(v => { if (v.severity && c[v.severity] !== undefined) c[v.severity]++; });
    return c;
  }, [vulns]);

  const filtered = useMemo(() =>
    filter === 'ALL' ? vulns : vulns.filter(v => v.severity === filter),
  [vulns, filter]);

  return (
    <section className="card animate-in">
      <div className="section-header">
        <div className="section-title">
          <span className="section-icon">📊</span>
          <h2>Scan Results</h2>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            fontSize: 13, fontWeight: 600, padding: '5px 14px', borderRadius: 20,
            ...(isClean
              ? { background: 'rgba(34,197,94,0.1)', color: 'var(--clean-text)', border: '1px solid rgba(34,197,94,0.25)' }
              : { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }
            ),
          }}>
            {isClean ? '✅ Clean' : `⚠️ ${results.totalIssues} Issue${results.totalIssues !== 1 ? 's' : ''} Found`}
          </div>
          {!isClean && (
            <button
              className="btn btn-ghost"
              onClick={() => exportResultsAsJson(results)}
              style={{ fontSize: 12 }}
              aria-label="Export results as JSON"
            >
              ⬇ Export JSON
            </button>
          )}
        </div>
      </div>

      {isClean ? (
        <div style={{ textAlign: 'center', padding: '52px 20px' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h3 style={{ fontSize: 20, color: 'var(--clean-text)', marginBottom: 8 }}>
            No vulnerabilities detected!
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Your code passed all AI security checks. Keep following secure coding practices.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 20, alignItems: 'start' }}>
            <SecurityScoreGauge score={results.securityScore ?? 100} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 120 }}>
              {SEVERITY_ORDER.filter(s => counts[s] > 0).map(s => (
                <div key={s} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  gap: 12, padding: '5px 10px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', fontSize: 12,
                }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{s}</span>
                  <span style={{
                    fontWeight: 700,
                    color: s === 'CRITICAL' ? 'var(--critical-text)' :
                           s === 'HIGH' ? 'var(--high-text)' :
                           s === 'MEDIUM' ? 'var(--medium-text)' : 'var(--low-text)',
                  }}>{counts[s]}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Filter:</span>
            {['ALL', ...SEVERITY_ORDER.filter(s => counts[s] > 0)].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: '4px 12px', borderRadius: 14, border: '1px solid',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  borderColor: filter === s ? 'var(--border-focus)' : 'var(--border)',
                  background: filter === s ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                  color: filter === s ? '#93c5fd' : 'var(--text-muted)',
                }}
                aria-pressed={filter === s}
              >
                {s}{s !== 'ALL' && counts[s] > 0 ? ` (${counts[s]})` : ''}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.length === 0
              ? <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
                  No results match the current filter.
                </p>
              : filtered.map((vuln, idx) => (
                  <VulnerabilityCard
                    key={`${vuln.type}-${vuln.lineNumber}-${idx}`}
                    vulnerability={vuln}
                    index={idx}
                  />
                ))
            }
          </div>

          {results.scannedAt && (
            <p style={{ marginTop: 16, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
              Scanned at {new Date(results.scannedAt).toLocaleString()}
            </p>
          )}
        </>
      )}
    </section>
  );
};

export default ScanResults;
