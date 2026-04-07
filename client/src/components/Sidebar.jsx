import React, { useState } from 'react';

const algorithms = [
  { id: 'dijkstra', label: 'Dijkstra', desc: 'Guaranteed optimal path', icon: 'verified', color: 'var(--info)', bg: 'var(--info-soft)' },
  { id: 'astar', label: 'A* Star', desc: 'Heuristic optimized', icon: 'bolt', color: 'var(--accent)', bg: 'var(--accent-soft)' },
  { id: 'compare', label: 'Compare', desc: 'Dual algorithm analysis', icon: 'compare_arrows', color: 'var(--success)', bg: 'var(--success-soft)' },
];

const preferences = [
  { id: 'fastest', label: 'Fastest', icon: 'flash_on', desc: 'Minimize travel time' },
  { id: 'safest', label: 'Safest', icon: 'shield', desc: 'Prioritize safety' },
  { id: 'fuel', label: 'Fuel Efficient', icon: 'eco', desc: 'Low fuel consumption' },
];

export default function Sidebar({ preference, setPreference, onCompute, loading, result }) {
  const [hoveredPref, setHoveredPref] = useState(null);

  return (
    <div style={{
      width: 260, background: 'var(--surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      animation: 'slideInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      {/* Algorithms Section */}
      <div style={{ padding: 20, borderBottom: '1px solid var(--border)' }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 14,
        }}>Algorithms</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {algorithms.map(algo => (
            <div key={algo.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px',
              background: algo.bg, borderRadius: 'var(--radius-sm)',
              transition: 'all 0.2s ease',
              cursor: 'default',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                background: `${algo.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-icons-round" style={{ fontSize: 18, color: algo.color }}>{algo.icon}</span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                  {algo.label}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)' }}>
                  {algo.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Mode */}
      <div style={{ padding: 20, borderBottom: '1px solid var(--border)' }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 14,
        }}>Optimization</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {preferences.map(p => {
            const isActive = preference === p.id;
            const isHovered = hoveredPref === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPreference(p.id)}
                onMouseEnter={() => setHoveredPref(p.id)}
                onMouseLeave={() => setHoveredPref(null)}
                style={{
                  width: '100%', padding: '12px 14px',
                  textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                  background: isActive
                    ? 'var(--primary-soft)'
                    : isHovered ? 'var(--surface-hover)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(139,92,246,0.3)' : 'transparent'}`,
                  borderRadius: 'var(--radius-sm)',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                <span className="material-icons-round" style={{
                  fontSize: 18,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                }}>{p.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>{p.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Snapshot */}
      {result && (
        <div style={{
          padding: 20, borderBottom: '1px solid var(--border)',
          animation: 'fadeIn 0.4s ease',
        }}>
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
            color: 'var(--text-muted)', textTransform: 'uppercase',
            letterSpacing: '0.1em', marginBottom: 14,
          }}>Last Result</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Dijkstra explored', value: result.dijkstra.nodesExplored, color: 'var(--info)' },
              { label: 'A* explored', value: result.astar.nodesExplored, color: 'var(--accent)' },
              {
                label: 'A* efficiency gain',
                value: `${Math.round((1 - result.astar.nodesExplored / result.dijkstra.nodesExplored) * 100)}%`,
                color: 'var(--success)',
              },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 13, color: s.color, fontWeight: 700,
                  background: `${s.color}15`,
                  padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spacer + Compute */}
      <div style={{ flex: 1 }} />
      <div style={{ padding: 20 }}>
        <button
          onClick={onCompute}
          disabled={loading}
          style={{
            width: '100%', padding: '14px 0',
            background: loading
              ? 'var(--surface-hover)'
              : 'linear-gradient(135deg, var(--primary), var(--secondary))',
            border: 'none', borderRadius: 'var(--radius-md)',
            color: loading ? 'var(--text-muted)' : '#fff',
            fontFamily: 'var(--font-display)', fontSize: 14,
            fontWeight: 700, letterSpacing: '0.02em',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: loading ? 'none' : '0 4px 20px var(--primary-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
          onMouseEnter={e => {
            if (!loading) e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span className="material-icons-round" style={{ fontSize: 18 }}>
            {loading ? 'hourglass_top' : 'play_arrow'}
          </span>
          {loading ? 'Computing...' : 'Find Route'}
        </button>
      </div>
    </div>
  );
}
