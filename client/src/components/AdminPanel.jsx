import React, { useState, useEffect } from 'react';
import { getReports, updateReport } from '../services/api';

const badgeInfo = s => {
  if (s === 'approved') return { color: 'var(--success)', bg: 'var(--success-soft)', icon: 'check_circle' };
  if (s === 'rejected') return { color: 'var(--danger)', bg: 'var(--danger-soft)', icon: 'cancel' };
  return { color: 'var(--accent)', bg: 'var(--accent-soft)', icon: 'schedule' };
};

const ISSUE_META = {
  pothole: { icon: 'report_problem', color: 'var(--accent)' },
  poor_lighting: { icon: 'lightbulb', color: 'var(--info)' },
  construction: { icon: 'construction', color: 'var(--accent)' },
  flooding: { icon: 'water', color: 'var(--info)' },
  crime: { icon: 'warning', color: 'var(--danger)' },
};

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
    <div style={{ padding: 28, overflowY: 'auto', height: '100%' }}>
      <div style={{
        fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
        color: 'var(--text-muted)', textTransform: 'uppercase',
        letterSpacing: '0.1em', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span className="material-icons-round" style={{ fontSize: 18, color: 'var(--primary)' }}>admin_panel_settings</span>
        Community Safety Review
      </div>

      {reports.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '60%', gap: 12,
        }}>
          <span className="material-icons-round" style={{ fontSize: 56, color: 'var(--text-muted)', opacity: 0.2 }}>
            fact_check
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-muted)' }}>
            No reports to review
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', opacity: 0.5 }}>
            MongoDB may be offline, or no reports submitted yet
          </span>
        </div>
      )}

      {pending.length > 0 && (
        <>
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600,
            color: 'var(--accent)', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span className="material-icons-round" style={{ fontSize: 16 }}>pending_actions</span>
            Pending Review
            <span style={{
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              padding: '2px 10px',
              borderRadius: 'var(--radius-xl)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11, fontWeight: 700,
            }}>{pending.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {pending.map((r, i) => {
              const meta = ISSUE_META[r.issueType] || ISSUE_META.pothole;
              return (
                <div key={r._id} style={{
                  background: 'var(--surface2)',
                  border: '1px solid rgba(251, 146, 60, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 20px',
                  animation: `fadeIn 0.4s ease ${i * 0.05}s both`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 'var(--radius-sm)',
                          background: `${meta.color}18`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span className="material-icons-round" style={{ fontSize: 18, color: meta.color }}>{meta.icon}</span>
                        </div>
                        <div>
                          <div style={{
                            fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
                            color: 'var(--text)',
                          }}>
                            {r.edge.from} → {r.edge.to}
                          </div>
                          <div style={{
                            fontFamily: 'var(--font-sans)', fontSize: 11,
                            color: 'var(--text-muted)',
                          }}>
                            {r.issueType.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      {r.description && (
                        <div style={{
                          fontFamily: 'var(--font-sans)', fontSize: 12,
                          color: 'var(--text-secondary)', marginTop: 2, marginLeft: 44,
                        }}>{r.description}</div>
                      )}
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: 10,
                        color: 'var(--text-muted)', marginTop: 6, marginLeft: 44,
                      }}>
                        {new Date(r.reportedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px',
                    background: 'var(--bg)',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontFamily: 'var(--font-sans)', fontSize: 11,
                        color: 'var(--text-muted)', fontWeight: 500,
                      }}>Safety Penalty:</span>
                      <input
                        type="number" min="0" max="1" step="0.05"
                        value={penaltyMap[r._id] ?? 0.2}
                        onChange={e => setPenaltyMap(m => ({ ...m, [r._id]: parseFloat(e.target.value) }))}
                        style={{
                          width: 72, background: 'var(--surface)',
                          border: '1px solid var(--border-active)',
                          color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: 13,
                          padding: '6px 10px', borderRadius: 'var(--radius-sm)', outline: 'none',
                          fontWeight: 600,
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }} />
                    <button
                      onClick={() => handle(r._id, 'approved')}
                      disabled={loading}
                      style={{
                        padding: '8px 20px',
                        background: 'linear-gradient(135deg, var(--success), #059669)',
                        border: 'none', borderRadius: 'var(--radius-sm)',
                        color: '#fff', fontFamily: 'var(--font-sans)',
                        fontSize: 12, fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(52,211,153,0.2)',
                      }}
                    >
                      <span className="material-icons-round" style={{ fontSize: 16 }}>check</span>
                      Approve
                    </button>
                    <button
                      onClick={() => handle(r._id, 'rejected')}
                      disabled={loading}
                      style={{
                        padding: '8px 20px',
                        background: 'transparent',
                        border: '1px solid rgba(248,113,113,0.4)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--danger)', fontFamily: 'var(--font-sans)',
                        fontSize: 12, fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span className="material-icons-round" style={{ fontSize: 16 }}>close</span>
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {reviewed.length > 0 && (
        <>
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600,
            color: 'var(--text-muted)', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span className="material-icons-round" style={{ fontSize: 16 }}>history</span>
            Reviewed
            <span style={{
              background: 'var(--surface-hover)',
              color: 'var(--text-muted)',
              padding: '2px 10px',
              borderRadius: 'var(--radius-xl)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11, fontWeight: 700,
            }}>{reviewed.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reviewed.map((r, i) => {
              const badge = badgeInfo(r.status);
              const meta = ISSUE_META[r.issueType] || ISSUE_META.pothole;
              return (
                <div key={r._id} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 16px',
                  opacity: 0.7,
                  transition: 'all 0.2s ease',
                  animation: `fadeIn 0.3s ease ${i * 0.03}s both`,
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="material-icons-round" style={{ fontSize: 16, color: meta.color }}>{meta.icon}</span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-secondary)' }}>
                        {r.edge.from} → {r.edge.to}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {r.status === 'approved' && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 10,
                          color: 'var(--text-muted)',
                        }}>Penalty: {r.penaltyScore}</span>
                      )}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        background: badge.bg, color: badge.color,
                        padding: '3px 10px', borderRadius: 'var(--radius-xl)',
                        fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
                      }}>
                        <span className="material-icons-round" style={{ fontSize: 13 }}>{badge.icon}</span>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
