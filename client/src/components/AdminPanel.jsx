import React, { useState, useEffect } from 'react';
import { getReports, updateReport } from '../services/api';

const badgeColor = s => s === 'approved' ? 'var(--green)' : s === 'rejected' ? 'var(--danger)' : 'var(--orange)';
const ISSUE_ICONS = { pothole: '🕳', poor_lighting: '💡', construction: '🚧', flooding: '🌊', crime: '⚠️' };

export default function AdminPanel() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [penaltyMap, setPenaltyMap] = useState({});

  const load = async () => {
    try { setReports(await getReports()); } catch (e) { setReports([]); }
  };

  useEffect(() => { load(); }, []);

  const handle = async (id, status) => {
    setLoading(true);
    try {
      await updateReport(id, { status, penaltyScore: penaltyMap[id] ?? 0.2 });
      load();
    } catch (e) { alert('Error — MongoDB may be offline.'); }
    setLoading(false);
  };

  const pending = reports.filter(r => r.status === 'pending');
  const reviewed = reports.filter(r => r.status !== 'pending');

  return (
    <div style={{ padding: 24, overflowY: 'auto', height: '100%' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--text-dim)', marginBottom: 20 }}>
        // ADMIN PANEL — COMMUNITY SAFETY REVIEW
      </div>

      {reports.length === 0 && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', marginTop: 80 }}>
          No reports to review. MongoDB may be offline, or no reports submitted yet.
        </div>
      )}

      {pending.length > 0 && (
        <>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: 'var(--orange)', marginBottom: 12 }}>
            ⏳ PENDING REVIEW ({pending.length})
          </div>
          {pending.map(r => (
            <div key={r._id} style={{
              background: 'var(--surface2)', border: '1px solid var(--orange)',
              borderRadius: 4, padding: '14px 16px', marginBottom: 12,
              animation: 'fade-in 0.3s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>
                    {ISSUE_ICONS[r.issueType]} {r.edge.from} → {r.edge.to}
                    <span style={{ marginLeft: 10, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
                      {r.issueType.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  {r.description && (
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-dim)' }}>{r.description}</div>
                  )}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginTop: 4 }}>
                    Reported: {new Date(r.reportedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 1 }}>
                  SAFETY PENALTY:
                </label>
                <input
                  type="number" min="0" max="1" step="0.05"
                  value={penaltyMap[r._id] ?? 0.2}
                  onChange={e => setPenaltyMap(m => ({ ...m, [r._id]: parseFloat(e.target.value) }))}
                  style={{
                    width: 70, background: 'var(--surface)', border: '1px solid var(--border)',
                    color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: 11,
                    padding: '4px 8px', borderRadius: 3, outline: 'none',
                  }}
                />
                <button onClick={() => handle(r._id, 'approved')} disabled={loading} style={{
                  padding: '6px 16px', background: 'var(--green)', border: 'none',
                  borderRadius: 3, color: '#000', fontFamily: 'var(--font-mono)',
                  fontSize: 10, letterSpacing: 1, cursor: 'pointer', fontWeight: 700,
                }}>✓ APPROVE</button>
                <button onClick={() => handle(r._id, 'rejected')} disabled={loading} style={{
                  padding: '6px 16px', background: 'transparent', border: '1px solid var(--danger)',
                  borderRadius: 3, color: 'var(--danger)', fontFamily: 'var(--font-mono)',
                  fontSize: 10, letterSpacing: 1, cursor: 'pointer',
                }}>✗ REJECT</button>
              </div>
            </div>
          ))}
        </>
      )}

      {reviewed.length > 0 && (
        <>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: 'var(--text-dim)', marginBottom: 12, marginTop: 20 }}>
            REVIEWED ({reviewed.length})
          </div>
          {reviewed.map(r => (
            <div key={r._id} style={{
              background: 'var(--surface)', border: `1px solid ${badgeColor(r.status)}22`,
              borderLeft: `3px solid ${badgeColor(r.status)}`,
              borderRadius: 3, padding: '10px 14px', marginBottom: 8, opacity: 0.75,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
                  {ISSUE_ICONS[r.issueType]} {r.edge.from} → {r.edge.to}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: badgeColor(r.status) }}>
                  {r.status.toUpperCase()} {r.status === 'approved' ? `| PENALTY: ${r.penaltyScore}` : ''}
                </span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
