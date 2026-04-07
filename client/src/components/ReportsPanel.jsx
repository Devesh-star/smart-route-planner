import React, { useState, useEffect } from 'react';
import { submitReport, getReports } from '../services/api';

const ISSUE_TYPES = ['pothole', 'poor_lighting', 'construction', 'flooding', 'crime'];
const ISSUE_META = {
  pothole: { icon: 'report_problem', color: 'var(--accent)', label: 'Pothole' },
  poor_lighting: { icon: 'lightbulb', color: 'var(--info)', label: 'Poor Lighting' },
  construction: { icon: 'construction', color: 'var(--accent)', label: 'Construction' },
  flooding: { icon: 'water', color: 'var(--info)', label: 'Flooding' },
  crime: { icon: 'warning', color: 'var(--danger)', label: 'Crime' },
};

const selectStyle = {
  width: '100%',
  background: 'var(--bg)',
  border: '1px solid var(--border-active)',
  color: 'var(--text)',
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  padding: '10px 12px',
  borderRadius: 'var(--radius-sm)',
  outline: 'none',
  marginBottom: 12,
  transition: 'border-color 0.2s ease',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%235e5e78' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
};

const badgeInfo = s => {
  if (s === 'approved') return { color: 'var(--success)', bg: 'var(--success-soft)', icon: 'check_circle' };
  if (s === 'rejected') return { color: 'var(--danger)', bg: 'var(--danger-soft)', icon: 'cancel' };
  return { color: 'var(--accent)', bg: 'var(--accent-soft)', icon: 'schedule' };
};

export default function ReportsPanel({ nodes }) {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ from: '', to: '', issueType: 'pothole', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    try { setReports(await getReports()); } catch (e) { setReports([]); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!form.from || !form.to || !form.issueType) return setMsg('Please fill all required fields.');
    setSubmitting(true);
    try {
      await submitReport({ edge: { from: form.from, to: form.to }, issueType: form.issueType, description: form.description });
      setMsg('Report submitted successfully! Pending admin review.');
      setForm({ from: '', to: '', issueType: 'pothole', description: '' });
      load();
    } catch (e) {
      setMsg('Could not submit — MongoDB may be offline.');
    }
    setSubmitting(false);
    setTimeout(() => setMsg(''), 4000);
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Submit Form */}
      <div style={{
        width: 320, borderRight: '1px solid var(--border)',
        padding: 24, overflowY: 'auto', flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span className="material-icons-round" style={{ fontSize: 16, color: 'var(--accent)' }}>flag</span>
          Report Hazard
        </div>

        <label style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
          color: 'var(--info)', marginBottom: 6,
        }}>
          <span className="material-icons-round" style={{ fontSize: 14 }}>trip_origin</span>
          From Node
        </label>
        <select value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))} style={selectStyle}>
          <option value="">Select origin...</option>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
        </select>

        <label style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
          color: 'var(--accent)', marginBottom: 6,
        }}>
          <span className="material-icons-round" style={{ fontSize: 14 }}>location_on</span>
          To Node
        </label>
        <select value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))} style={selectStyle}>
          <option value="">Select destination...</option>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
        </select>

        <label style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
          color: 'var(--text-muted)', marginBottom: 6,
        }}>
          <span className="material-icons-round" style={{ fontSize: 14 }}>category</span>
          Issue Type
        </label>
        <select value={form.issueType} onChange={e => setForm(f => ({ ...f, issueType: e.target.value }))} style={selectStyle}>
          {ISSUE_TYPES.map(t => (
            <option key={t} value={t}>{ISSUE_META[t].label}</option>
          ))}
        </select>

        <label style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
          color: 'var(--text-muted)', marginBottom: 6,
        }}>
          <span className="material-icons-round" style={{ fontSize: 14 }}>description</span>
          Description
        </label>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={3}
          style={{
            ...selectStyle,
            resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: 13,
            backgroundImage: 'none',
          }}
          placeholder="Describe the hazard..."
        />

        {msg && (
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: 12,
            color: msg.includes('success') ? 'var(--success)' : 'var(--danger)',
            background: msg.includes('success') ? 'var(--success-soft)' : 'var(--danger-soft)',
            padding: '10px 14px', borderRadius: 'var(--radius-sm)',
            marginBottom: 12, animation: 'fadeIn 0.3s ease',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span className="material-icons-round" style={{ fontSize: 16 }}>
              {msg.includes('success') ? 'check_circle' : 'error'}
            </span>
            {msg}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: '100%', padding: '12px 0',
            background: submitting
              ? 'var(--surface-hover)'
              : 'linear-gradient(135deg, var(--accent), var(--secondary))',
            border: 'none', borderRadius: 'var(--radius-sm)',
            color: submitting ? 'var(--text-muted)' : '#fff',
            fontFamily: 'var(--font-display)', fontSize: 13,
            fontWeight: 700, letterSpacing: '0.02em',
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: submitting ? 'none' : '0 4px 16px rgba(251,146,60, 0.2)',
          }}
        >
          <span className="material-icons-round" style={{ fontSize: 16 }}>
            {submitting ? 'hourglass_top' : 'send'}
          </span>
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>

      {/* Reports List */}
      <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span className="material-icons-round" style={{ fontSize: 16 }}>list_alt</span>
          Submitted Reports
          <span style={{
            marginLeft: 'auto',
            background: 'var(--primary-soft)',
            color: 'var(--primary)',
            padding: '2px 10px',
            borderRadius: 'var(--radius-xl)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11, fontWeight: 700,
          }}>{reports.length}</span>
        </div>

        {reports.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '60%', gap: 12,
          }}>
            <span className="material-icons-round" style={{ fontSize: 48, color: 'var(--text-muted)', opacity: 0.3 }}>
              inbox
            </span>
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)',
            }}>No reports yet</span>
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', opacity: 0.6,
            }}>MongoDB may be offline</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reports.map((r, i) => {
            const meta = ISSUE_META[r.issueType] || ISSUE_META.pothole;
            const badge = badgeInfo(r.status);
            return (
              <div key={r._id} style={{
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 18px',
                animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-active)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                      background: `${meta.color}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span className="material-icons-round" style={{ fontSize: 18, color: meta.color }}>{meta.icon}</span>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: 13,
                      color: 'var(--text)', fontWeight: 600,
                    }}>
                      {r.edge.from} → {r.edge.to}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: badge.bg,
                    color: badge.color,
                    padding: '4px 10px', borderRadius: 'var(--radius-xl)',
                    fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
                  }}>
                    <span className="material-icons-round" style={{ fontSize: 14 }}>{badge.icon}</span>
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </div>
                </div>

                <div style={{
                  fontFamily: 'var(--font-sans)', fontSize: 12,
                  color: 'var(--text-secondary)', marginBottom: 4,
                }}>
                  {meta.label}{r.description ? ` — ${r.description}` : ''}
                </div>

                {r.status === 'approved' && (
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11,
                    color: 'var(--danger)', marginTop: 6,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span className="material-icons-round" style={{ fontSize: 14 }}>add_circle</span>
                    Penalty: +{r.penaltyScore} on safety weight
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
