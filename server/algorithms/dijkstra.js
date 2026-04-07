const MinHeap = require('./priorityQueue');
const { calcWeight } = require('../utils/weightCalculator');

/**
 * Dijkstra's shortest path algorithm
 * Time Complexity: O((V + E) log V) with min-heap
 */
function dijkstra(graph, startId, endId, preference) {
  const dist = {};
  const prev = {};
  const explored = [];
  const heap = new MinHeap();

  // Initialize distances
  graph.nodes.forEach(n => { dist[n.id] = Infinity; prev[n.id] = null; });
  dist[startId] = 0;
  heap.push({ id: startId, cost: 0 });

  while (!heap.isEmpty()) {
    const { id: u, cost } = heap.pop();
    if (cost > dist[u]) continue; // stale entry
    explored.push(u);
    if (u === endId) break;

    const neighbors = graph.adjList[u] || [];
    for (const { to, edge } of neighbors) {
      const w = calcWeight(edge, preference);
      const alt = dist[u] + w;
      if (alt < dist[to]) {
        dist[to] = alt;
        prev[to] = u;
        heap.push({ id: to, cost: alt });
      }
    }
  }

  // Reconstruct path
  const path = [];
  let cur = endId;
  while (cur) {
    path.unshift(cur);
    cur = prev[cur];
  }

  const valid = path[0] === startId && dist[endId] !== Infinity;
  return {
    algorithm: 'Dijkstra',
    path: valid ? path : [],
    cost: valid ? dist[endId] : null,
    nodesExplored: explored.length,
    explored,
  };
}

module.exports = dijkstra;
