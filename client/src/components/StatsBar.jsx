import React from 'react';

function StatCard({ title, badge, badgeColor, stats, pathNames }) {
  return (
    <div style={{
      flex: 1,
      background: 'var(--surface2)',
      border: `1px solid var(--border)`,
      borderTop: `2px solid ${badgeColor}`,
      borderRadius: 3,
      padding: '10px 14px',
      animation: 'fade-in 0.4s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-head)', fontSize: 12, color: badgeColor, letterSpacing: 2 }}>{title}</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 1,
          border: `1px solid ${badgeColor}`, color: badgeColor,
          padding: '2px 6px', borderRadius: 2,
        }}>{badge}</span>
      </div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 6 }}>
        {stats.map(s => (
          <div key={s.label}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: badgeColor, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>
      {pathNames && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          PATH: {pathNames}
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
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', letterSpacing: 3 }}>
        // SELECT NODES AND SYNTHESIZE ROUTE TO SEE STATS
      </span>
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
      height: 100, background: 'var(--surface)', borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', flexShrink: 0,
    }}>
      <StatCard
        title="DIJKSTRA"
        badge="GUARANTEED OPTIMAL"
        badgeColor="var(--cyan)"
        stats={[
          { label: 'NODES EXPLORED', value: result.dijkstra.nodesExplored },
          { label: 'ROUTE COST', value: fmtCost(result.dijkstra.cost) },
          { label: 'HOPS', value: result.dijkstra.path.length },
        ]}
        pathNames={fmtPath(result.dijkstra.path)}
      />

      <StatCard
        title="A* STAR"
        badge="HEURISTIC OPTIMIZED"
        badgeColor="var(--orange)"
        stats={[
          { label: 'NODES EXPLORED', value: result.astar.nodesExplored },
          { label: 'ROUTE COST', value: fmtCost(result.astar.cost) },
          { label: 'HOPS', value: result.astar.path.length },
        ]}
        pathNames={fmtPath(result.astar.path)}
      />

      {/* Comparative */}
      <div style={{
        width: 180, background: 'var(--surface2)',
        border: '1px solid var(--border)', borderTop: '2px solid var(--green)',
        borderRadius: 3, padding: '10px 14px', flexShrink: 0,
      }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: 11, color: 'var(--green)', letterSpacing: 2, marginBottom: 8 }}>ANALYSIS</div>
        <div style={{ marginBottom: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>A* EFFICIENCY</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--green)' }}>{effGain}%</span>
          </div>
          <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.max(0, effGain)}%`, background: 'var(--green)', borderRadius: 2, transition: 'width 0.6s ease' }} />
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>
          {effGain > 0
            ? `A* explored ${result.dijkstra.nodesExplored - result.astar.nodesExplored} fewer nodes`
            : 'Both algorithms equal on this path'}
        </div>
      </div>
    </div>
  );
}
