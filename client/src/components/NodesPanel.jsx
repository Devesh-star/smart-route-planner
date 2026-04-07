import React from 'react';

export default function NodesPanel({ nodes, edges }) {
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Nodes */}
      <div style={{
        width: '38%', borderRight: '1px solid var(--border)',
        padding: 24, overflowY: 'auto',
      }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span className="material-icons-round" style={{ fontSize: 16 }}>scatter_plot</span>
          Graph Nodes
          <span style={{
            marginLeft: 'auto',
            background: 'var(--primary-soft)',
            color: 'var(--primary)',
            padding: '2px 10px',
            borderRadius: 'var(--radius-xl)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11, fontWeight: 700,
          }}>{nodes.length}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {nodes.map((n, i) => (
            <div key={n.id} style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 16px',
              transition: 'all 0.2s ease',
              animation: `fadeIn 0.3s ease ${i * 0.03}s both`,
              cursor: 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              e.currentTarget.style.background = 'var(--surface-hover)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--surface2)';
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--primary)',
                    boxShadow: '0 0 8px var(--primary-soft)',
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: 14,
                    fontWeight: 600, color: 'var(--text)',
                  }}>{n.name}</span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--text-muted)', background: 'var(--bg)',
                  padding: '3px 8px', borderRadius: 'var(--radius-sm)',
                }}>
                  {n.lat.toFixed(4)}, {n.lng.toFixed(4)}
                </span>
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--primary)', marginTop: 6, opacity: 0.8,
              }}>{n.id}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Edges */}
      <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span className="material-icons-round" style={{ fontSize: 16 }}>device_hub</span>
          Adjacency List
          <span style={{
            marginLeft: 'auto',
            background: 'var(--accent-soft)',
            color: 'var(--accent)',
            padding: '2px 10px',
            borderRadius: 'var(--radius-xl)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11, fontWeight: 700,
          }}>{edges.length}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {edges.map((e, i) => (
            <div key={i} style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 18px',
              display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
              alignItems: 'center', gap: 16,
              animation: `fadeIn 0.3s ease ${i * 0.02}s both`,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={ev => {
              ev.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              ev.currentTarget.style.background = 'var(--surface-hover)';
            }}
            onMouseLeave={ev => {
              ev.currentTarget.style.borderColor = 'var(--border)';
              ev.currentTarget.style.background = 'var(--surface2)';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-icons-round" style={{ fontSize: 14, color: 'var(--text-muted)' }}>arrow_forward</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: 'var(--text)', fontWeight: 500,
                }}>
                  {e.from} → {e.to}
                </span>
              </div>
              {[
                { label: 'Distance', value: `${e.distance}km`, color: 'var(--info)', pct: Math.min(100, e.distance / 15 * 100) },
                { label: 'Traffic', value: `${Math.round(e.traffic * 100)}%`, color: 'var(--accent)', pct: e.traffic * 100 },
                { label: 'Safety', value: `${Math.round(e.safety * 100)}%`, color: 'var(--success)', pct: e.safety * 100 },
              ].map(s => (
                <div key={s.label}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: 10,
                      color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{s.label}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 12,
                      color: s.color, fontWeight: 600,
                    }}>{s.value}</span>
                  </div>
                  <div style={{
                    height: 4, background: 'var(--bg)',
                    borderRadius: 'var(--radius-xl)', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 'var(--radius-xl)',
                      background: s.color, width: `${s.pct}%`,
                      transition: 'width 0.6s ease',
                      opacity: 0.8,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
