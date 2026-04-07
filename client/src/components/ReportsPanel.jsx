import React, { useState, useEffect } from 'react';
import { submitReport, getReports } from '../services/api';

const ISSUE_TYPES = ['pothole', 'poor_lighting', 'construction', 'flooding', 'crime'];
const ISSUE_ICONS = { pothole: '🕳', poor_lighting: '💡', construction: '🚧', flooding: '🌊', crime: '⚠️' };

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
    if (!form.from || !form.to || !form.issueType) return setMsg('Please fill all fields.');
    setSubmitting(true);
    try {
      await submitReport({ edge: { from: form.from, to: form.to }, issueType: form.issueType, description: form.description });
      setMsg('✅ Report submitted! Pending admin review.');
      setForm({ from: '', to: '', issueType: 'pothole', description: '' });
      load();
    } catch (e) {
      setMsg('❌ Could not submit — MongoDB may be offline.');
    }
    setSubmitting(false);
  };

  const SELECT = {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 11,
    padding: '8px 10px', borderRadius: 3, outline: 'none', marginBottom: 10,
  };

  const badgeColor = s => s === 'approved' ? 'var(--green)' : s === 'rejected' ? 'var(--danger)' : 'var(--orange)';

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Submit Form */}
      <div style={{ width: 280, borderRight: '1px solid var(--border)', padding: 20, overflowY: 'auto', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--text-dim)', marginBottom: 16 }}>
          // REPORT HAZARD
        </div>

        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--cyan)', letterSpacing: 2, marginBottom: 5 }}>FROM NODE</label>
        <select value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))} style={SELECT}>
          <option value="">— select —</option>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
        </select>

        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--orange)', letterSpacing: 2, marginBottom: 5 }}>TO NODE</label>
        <select value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))} style={SELECT}>
          <option value="">— select —</option>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
        </select>

        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 5 }}>ISSUE TYPE</label>
        <select value={form.issueType} onChange={e => setForm(f => ({ ...f, issueType: e.target.value }))} style={SELECT}>
          {ISSUE_TYPES.map(t => <option key={t} value={t}>{ISSUE_ICONS[t]} {t.replace('_', ' ').toUpperCase()}</option>)}
        </select>

        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 5 }}>DESCRIPTION</label>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={3}
          style={{ ...SELECT, resize: 'vertical', fontFamily: 'var(--font-ui)', fontSize: 12 }}
          placeholder="Describe the hazard..."
        />

        {msg && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', marginBottom: 10 }}>{msg}</div>}

        <button onClick={handleSubmit} disabled={submitting} style={{
          width: '100%', padding: '10px 0', background: 'var(--orange)',
          border: 'none', borderRadius: 3, color: '#000',
          fontFamily: 'var(--font-head)', fontSize: 11, letterSpacing: 2,
          fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
        }}>
          {submitting ? 'SUBMITTING...' : 'SUBMIT REPORT'}
        </button>
      </div>

      {/* Reports List */}
      <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--text-dim)', marginBottom: 16 }}>
          // SUBMITTED REPORTS ({reports.length})
        </div>
        {reports.length === 0 && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', marginTop: 60 }}>
            No reports yet. MongoDB may be offline.
          </div>
        )}
        {reports.map(r => (
          <div key={r._id} style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 3, padding: '12px 14px', marginBottom: 10,
            animation: 'fade-in 0.3s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>
                {ISSUE_ICONS[r.issueType]} {r.edge.from} → {r.edge.to}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1,
                border: `1px solid ${badgeColor(r.status)}`, color: badgeColor(r.status),
                padding: '2px 6px', borderRadius: 2,
              }}>{r.status.toUpperCase()}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-dim)', marginBottom: 4 }}>
              {r.issueType.replace('_', ' ')} {r.description ? `— ${r.description}` : ''}
            </div>
            {r.status === 'approved' && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--danger)' }}>
                PENALTY: +{r.penaltyScore} on safety weight
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
