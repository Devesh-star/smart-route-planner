const graphData = require('../data/graph.json');
const dijkstra = require('../algorithms/dijkstra');
const astar = require('../algorithms/astar');

let Report;
try { Report = require('../models/Report'); } catch (e) { Report = null; }

function buildAdjList(edges, approvedReports = []) {
  const adj = {};
  const penaltyMap = {};

  approvedReports.forEach(r => {
    const key = `${r.edge.from}-${r.edge.to}`;
    penaltyMap[key] = (penaltyMap[key] || 0) + r.penaltyScore;
  });

  edges.forEach(edge => {
    const key = `${edge.from}-${edge.to}`;
    const enrichedEdge = { ...edge, safetyPenalty: penaltyMap[key] || 0 };

    if (!adj[edge.from]) adj[edge.from] = [];
    if (!adj[edge.to]) adj[edge.to] = [];
    adj[edge.from].push({ to: edge.to, edge: enrichedEdge });
    adj[edge.to].push({ to: edge.from, edge: enrichedEdge }); // undirected
  });
  return adj;
}

async function computeRoute(req, res) {
  try {
    const { start, end, preference = 'fastest' } = req.body;
    if (!start || !end) return res.status(400).json({ error: 'start and end required' });
    if (start === end) return res.status(400).json({ error: 'start and end must differ' });

    let approvedReports = [];
    if (Report) {
      try {
        approvedReports = await Report.find({ status: 'approved' });
      } catch (e) { /* MongoDB offline — use base graph */ }
    }

    const adjList = buildAdjList(graphData.edges, approvedReports);
    const graph = { nodes: graphData.nodes, edges: graphData.edges, adjList };

    const dResult = dijkstra(graph, start, end, preference);
    const aResult = astar(graph, start, end, preference);

    // Annotate paths with node coordinates
    const nodeMap = {};
    graphData.nodes.forEach(n => { nodeMap[n.id] = n; });

    const annotate = r => ({
      ...r,
      pathCoords: r.path.map(id => nodeMap[id]),
    });

    res.json({
      dijkstra: annotate(dResult),
      astar: annotate(aResult),
      preference,
      nodes: graphData.nodes,
      edges: graphData.edges,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

async function getGraph(req, res) {
  res.json({ nodes: graphData.nodes, edges: graphData.edges });
}

async function submitReport(req, res) {
  if (!Report) return res.status(503).json({ error: 'MongoDB not connected' });
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getReports(req, res) {
  if (!Report) return res.json([]);
  try {
    const reports = await Report.find().sort({ reportedAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateReport(req, res) {
  if (!Report) return res.status(503).json({ error: 'MongoDB not connected' });
  try {
    const { id } = req.params;
    const { status, penaltyScore } = req.body;
    const update = { status };
    if (status === 'approved') update.approvedAt = new Date();
    if (penaltyScore !== undefined) update.penaltyScore = penaltyScore;
    const report = await Report.findByIdAndUpdate(id, update, { new: true });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { computeRoute, getGraph, submitReport, getReports, updateReport };
