import React from 'react';

function StatCard({ title, icon, badgeColor, stats, pathNames }) {
  return (
    <div style={{
      flex: 1,
      background: 'var(--surface2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 18px',
      animation: 'slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle top gradient accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${badgeColor}, transparent)`,
        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 'var(--radius-sm)',
            background: `${badgeColor}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-icons-round" style={{ fontSize: 16, color: badgeColor }}>{icon}</span>
          </div>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--text)',
            fontWeight: 700,
          }}>{title}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 8 }}>
        {stats.map(s => (
          <div key={s.label}>
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4,
            }}>{s.label}</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 18, color: badgeColor,
              fontWeight: 700, lineHeight: 1,
            }}>{s.value}</div>
          </div>
        ))}
      </div>

      {pathNames && (
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
          marginTop: 6, lineHeight: 1.5,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          background: 'var(--bg)', padding: '6px 10px',
          borderRadius: 'var(--radius-sm)',
        }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Path:</span> {pathNames}
        </div>
      )}
    </div>
  );
}

export default function StatsBar({ result, nodes }) {
  if (!result) return (
    <div style={{
      height: 80, background: 'var(--surface)', borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="material-icons-round" style={{ fontSize: 20, color: 'var(--text-muted)' }}>info_outline</span>
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)',
          fontWeight: 500,
        }}>
          Select nodes and click "Find Route" to see statistics
        </span>
      </div>
    </div>
  );

  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n.name; });

  const fmtPath = path => path.map(id => nodeMap[id] || id).join(' → ');
  const fmtCost = cost => cost ? cost.toFixed(2) : 'N/A';
  const effGain = result.dijkstra.nodesExplored > 0
    ? Math.round((1 - result.astar.nodesExplored / result.dijkstra.nodesExplored) * 100)
    : 0;

  return (
    <div style={{
      minHeight: 110, background: 'var(--surface)', borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'stretch', gap: 12, padding: '12px 16px', flexShrink: 0,
    }}>
      <StatCard
        title="Dijkstra"
        icon="verified"
        badgeColor="var(--info)"
        stats={[
          { label: 'Explored', value: result.dijkstra.nodesExplored },
          { label: 'Cost', value: fmtCost(result.dijkstra.cost) },
          { label: 'Hops', value: result.dijkstra.path.length },
        ]}
        pathNames={fmtPath(result.dijkstra.path)}
      />

      <StatCard
        title="A* Star"
        icon="bolt"
        badgeColor="var(--accent)"
        stats={[
          { label: 'Explored', value: result.astar.nodesExplored },
          { label: 'Cost', value: fmtCost(result.astar.cost) },
          { label: 'Hops', value: result.astar.path.length },
        ]}
        pathNames={fmtPath(result.astar.path)}
      />

      {/* Analysis Card */}
      <div style={{
        width: 220, background: 'var(--surface2)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
        padding: '16px 18px', flexShrink: 0,
        animation: 'slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, var(--success), transparent)',
          borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 'var(--radius-sm)',
            background: 'var(--success-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-icons-round" style={{ fontSize: 16, color: 'var(--success)' }}>analytics</span>
          </div>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--text)',
            fontWeight: 700,
          }}>Analysis</span>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)' }}>A* Efficiency</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--success)', fontWeight: 700 }}>{effGain}%</span>
          </div>
          <div style={{
            height: 6, background: 'var(--bg)',
            borderRadius: 'var(--radius-xl)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${Math.max(0, effGain)}%`,
              background: 'linear-gradient(90deg, var(--success), var(--primary))',
              borderRadius: 'var(--radius-xl)',
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 8px var(--success-soft)',
            }} />
          </div>
        </div>

        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4,
        }}>
          {effGain > 0
            ? `A* explored ${result.dijkstra.nodesExplored - result.astar.nodesExplored} fewer nodes`
            : 'Both algorithms equal on this path'}
        </div>
      </div>
    </div>
  );
}
