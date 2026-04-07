import React, { useState } from 'react';

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
  cursor: 'pointer',
  transition: 'border-color 0.2s ease',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%235e5e78' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
};

export default function ControlPanel({ nodes, start, end, setStart, setEnd }) {
  return (
    <div style={{
      position: 'absolute',
      top: 16, right: 16,
      zIndex: 1000,
      width: 260,
      background: 'rgba(28, 28, 38, 0.88)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 20,
      animation: 'slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: 'var(--shadow-lg)',
    }}>
      <div style={{
        fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
        color: 'var(--text-muted)', textTransform: 'uppercase',
        letterSpacing: '0.1em', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span className="material-icons-round" style={{ fontSize: 14 }}>tune</span>
        Node Configuration
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
          color: 'var(--success)', marginBottom: 6,
        }}>
          <span className="material-icons-round" style={{ fontSize: 14 }}>trip_origin</span>
          Origin
        </label>
        <select
          value={start}
          onChange={e => setStart(e.target.value)}
          style={selectStyle}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-active)'}
        >
          <option value="">Select start point...</option>
          {nodes.map(n => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
          color: 'var(--danger)', marginBottom: 6,
        }}>
          <span className="material-icons-round" style={{ fontSize: 14 }}>location_on</span>
          Destination
        </label>
        <select
          value={end}
          onChange={e => setEnd(e.target.value)}
          style={selectStyle}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-active)'}
        >
          <option value="">Select end point...</option>
          {nodes.map(n => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
      </div>

      {/* Legend */}
      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: 14,
      }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 10,
        }}>Legend</div>
        {[
          { color: 'var(--info)', label: 'Dijkstra Route' },
          { color: 'var(--accent)', label: 'A* Route (dashed)' },
          { color: 'var(--success)', label: 'Start Node' },
          { color: 'var(--danger)', label: 'End Node' },
        ].map(l => (
          <div key={l.label} style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7,
          }}>
            <div style={{
              width: 24, height: 3,
              background: l.color,
              borderRadius: 2,
              boxShadow: `0 0 8px ${l.color}44`,
            }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
