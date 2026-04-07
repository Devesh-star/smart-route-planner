import React from 'react';

export default function NodesPanel({ nodes, edges }) {
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Nodes */}
      <div style={{ width: '40%', borderRight: '1px solid var(--border)', padding: 20, overflowY: 'auto' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--text-dim)', marginBottom: 16 }}>
          // GRAPH NODES ({nodes.length})
        </div>
        {nodes.map(n => (
          <div key={n.id} style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderLeft: '3px solid var(--cyan)', borderRadius: 3,
            padding: '10px 12px', marginBottom: 8,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan)' }}>{n.id}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>
                {n.lat.toFixed(4)}, {n.lng.toFixed(4)}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text)', marginTop: 3 }}>{n.name}</div>
          </div>
        ))}
      </div>

      {/* Edges */}
      <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--text-dim)', marginBottom: 16 }}>
          // GRAPH EDGES ({edges.length}) — ADJACENCY LIST
        </div>
        {edges.map((e, i) => (
          <div key={i} style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 3, padding: '10px 14px', marginBottom: 8,
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
            alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)' }}>
              {e.from} → {e.to}
            </span>
            {[
              { label: 'DIST', value: `${e.distance}km`, color: 'var(--cyan)' },
              { label: 'TRAFFIC', value: `${Math.round(e.traffic * 100)}%`, color: 'var(--orange)' },
              { label: 'SAFETY', value: `${Math.round(e.safety * 100)}%`, color: 'var(--green)' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-dim)', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: s.color }}>{s.value}</div>
                <div style={{ height: 2, background: 'var(--border)', borderRadius: 1, marginTop: 3 }}>
                  <div style={{
                    height: '100%', borderRadius: 1, background: s.color,
                    width: s.label === 'DIST' ? `${Math.min(100, e.distance / 15 * 100)}%`
                      : s.label === 'TRAFFIC' ? `${e.traffic * 100}%`
                      : `${e.safety * 100}%`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
