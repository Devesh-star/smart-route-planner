const MinHeap = require('./priorityQueue');
const { calcWeight } = require('../utils/weightCalculator');

/**
 * A* Search Algorithm
 * f(n) = g(n) + h(n)
 * h(n) = Euclidean distance heuristic (admissible)
 * Time Complexity: O((V + E) log V) — better in practice due to heuristic pruning
 */

function euclidean(a, b) {
  const dx = a.lat - b.lat;
  const dy = a.lng - b.lng;
  // Approx km per degree in Delhi latitude
  return Math.sqrt((dx * 111) ** 2 + (dy * 85) ** 2);
}

function astar(graph, startId, endId, preference) {
  const nodeMap = {};
  graph.nodes.forEach(n => { nodeMap[n.id] = n; });

  const gScore = {};
  const fScore = {};
  const prev = {};
  const explored = [];
  const heap = new MinHeap();

  graph.nodes.forEach(n => {
    gScore[n.id] = Infinity;
    fScore[n.id] = Infinity;
    prev[n.id] = null;
  });

  gScore[startId] = 0;
  fScore[startId] = euclidean(nodeMap[startId], nodeMap[endId]);
  heap.push({ id: startId, cost: fScore[startId] });

  while (!heap.isEmpty()) {
    const { id: u } = heap.pop();
    explored.push(u);
    if (u === endId) break;

    const neighbors = graph.adjList[u] || [];
    for (const { to, edge } of neighbors) {
      const w = calcWeight(edge, preference);
      const tentativeG = gScore[u] + w;
      if (tentativeG < gScore[to]) {
        prev[to] = u;
        gScore[to] = tentativeG;
        fScore[to] = tentativeG + euclidean(nodeMap[to], nodeMap[endId]);
        heap.push({ id: to, cost: fScore[to] });
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

  const valid = path[0] === startId && gScore[endId] !== Infinity;
  return {
    algorithm: 'A*',
    path: valid ? path : [],
    cost: valid ? gScore[endId] : null,
    nodesExplored: explored.length,
    explored,
  };
}

module.exports = astar;
