import React from 'react';

const SELECT_STYLE = {
  width: '100%',
  background: 'var(--surface2)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  padding: '8px 10px',
  borderRadius: 3,
  outline: 'none',
  cursor: 'pointer',
};

export default function ControlPanel({ nodes, start, end, setStart, setEnd }) {
  return (
    <div style={{
      position: 'absolute',
      top: 16, right: 16,
      zIndex: 1000,
      width: 240,
      background: 'rgba(10,21,32,0.92)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--border)',
      borderRadius: 4,
      padding: 16,
      animation: 'fade-in 0.4s ease',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3,
        color: 'var(--text-dim)', marginBottom: 14,
        borderBottom: '1px solid var(--border)', paddingBottom: 8,
      }}>
        // NODE CONFIGURATION
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--green)', letterSpacing: 2, marginBottom: 5 }}>
          ORIGIN NODE
        </label>
        <select value={start} onChange={e => setStart(e.target.value)} style={SELECT_STYLE}>
          <option value="">— SELECT START —</option>
          {nodes.map(n => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--danger)', letterSpacing: 2, marginBottom: 5 }}>
          DESTINATION NODE
        </label>
        <select value={end} onChange={e => setEnd(e.target.value)} style={SELECT_STYLE}>
          <option value="">— SELECT END —</option>
          {nodes.map(n => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
      </div>

      {/* Legend */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, color: 'var(--text-dim)', marginBottom: 8 }}>LEGEND</div>
        {[
          { color: 'var(--cyan)', label: 'Dijkstra Route' },
          { color: 'var(--orange)', label: 'A* Route (dashed)' },
          { color: 'var(--green)', label: 'Start Node' },
          { color: 'var(--danger)', label: 'End Node' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
            <div style={{ width: 20, height: 2, background: l.color, borderRadius: 1 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
