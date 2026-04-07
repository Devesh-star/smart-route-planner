import React from 'react';

const algorithms = [
  { id: 'dijkstra', label: 'Dijkstra', badge: 'GUARANTEED', color: 'var(--cyan)' },
  { id: 'astar', label: 'A* Star', badge: 'OPTIMIZED', color: 'var(--orange)' },
  { id: 'compare', label: 'Compare', badge: 'DUAL', color: 'var(--green)' },
];

const preferences = [
  { id: 'fastest', label: '⚡ FASTEST' },
  { id: 'safest', label: '🛡 SAFEST' },
  { id: 'fuel', label: '⛽ FUEL EFF.' },
];

export default function Sidebar({ preference, setPreference, onCompute, loading, result }) {
  return (
    <div style={{
      width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      animation: 'slide-in-left 0.4s ease',
    }}>
      {/* Section: Algorithms */}
      <div style={{ padding: '16px 16px 8px', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3,
          color: 'var(--text-dim)', marginBottom: 12,
        }}>// ALGORITHM ENGINE</div>
        {algorithms.map(algo => (
          <div key={algo.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 10px', marginBottom: 4,
            background: 'var(--surface2)', border: `1px solid var(--border)`,
            borderRadius: 3, cursor: 'default',
          }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, color: algo.color }}>
              {algo.label}
            </span>
            <span style={{
              fontSize: 8, letterSpacing: 1, fontFamily: 'var(--font-mono)',
              background: 'transparent', border: `1px solid ${algo.color}`,
              color: algo.color, padding: '2px 5px', borderRadius: 2,
            }}>{algo.badge}</span>
          </div>
        ))}
      </div>

      {/* Section: Optimization Mode */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3,
          color: 'var(--text-dim)', marginBottom: 10,
        }}>// WEIGHT MODE</div>
        {preferences.map(p => (
          <button key={p.id} onClick={() => setPreference(p.id)} style={{
            width: '100%', marginBottom: 6,
            padding: '8px 12px', textAlign: 'left',
            background: preference === p.id ? 'rgba(0,212,255,0.08)' : 'transparent',
            border: `1px solid ${preference === p.id ? 'var(--cyan)' : 'var(--border)'}`,
            borderRadius: 3, color: preference === p.id ? 'var(--cyan)' : 'var(--text-dim)',
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1,
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Stats from last result */}
      {result && (
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', animation: 'fade-in 0.3s ease' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--text-dim)', marginBottom: 10 }}>
            // LAST RESULT
          </div>
          {[
            { label: 'Dijkstra nodes', value: result.dijkstra.nodesExplored, color: 'var(--cyan)' },
            { label: 'A* nodes', value: result.astar.nodesExplored, color: 'var(--orange)' },
            { label: 'Efficiency gain', value: `${Math.round((1 - result.astar.nodesExplored / result.dijkstra.nodesExplored) * 100)}%`, color: 'var(--green)' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{s.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: s.color, fontWeight: 700 }}>{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Spacer + Compute Button */}
      <div style={{ flex: 1 }} />
      <div style={{ padding: 16 }}>
        <button onClick={onCompute} disabled={loading} style={{
          width: '100%', padding: '12px 0',
          background: loading ? 'var(--border)' : 'linear-gradient(135deg, var(--cyan), var(--cyan-dim))',
          border: 'none', borderRadius: 3,
          color: '#000', fontFamily: 'var(--font-head)', fontSize: 11,
          fontWeight: 700, letterSpacing: 3, cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 0 20px rgba(0,212,255,0.3)',
        }}>
          {loading ? 'COMPUTING...' : 'SYNTHESIZE ROUTE'}
        </button>
      </div>
    </div>
  );
}
