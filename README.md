# 🗺 Smart Route Planner — Delhi NCR

A full-stack MERN application for intelligent route planning using **Dijkstra** and **A\*** algorithms with a **Community Safety Review** system.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Leaflet.js (via react-leaflet) |
| Backend | Node.js + Express.js |
| Database | MongoDB (optional — app works without it) |
| Algorithms | Dijkstra + A* with Min-Heap, from scratch |

---

## 🚀 Running the Project

### 1. Backend

```bash
cd server
npm install
npm run dev        # runs on http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev        # runs on http://localhost:3000
```

### 3. MongoDB (Optional)

If MongoDB is running locally, the community safety reports feature activates automatically.  
Default URI: `mongodb://localhost:27017/smartroute`

To use a custom URI, create `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/smartroute
```

---

## 📁 Project Structure

```
smart-route-planner/
├── server/
│   ├── algorithms/
│   │   ├── dijkstra.js        ← Dijkstra with min-heap  O((V+E) log V)
│   │   ├── astar.js           ← A* with Euclidean heuristic f(n)=g(n)+h(n)
│   │   └── priorityQueue.js   ← Min-Heap implementation
│   ├── utils/
│   │   └── weightCalculator.js ← Multi-criteria weight: fastest/safest/fuel
│   ├── data/
│   │   └── graph.json         ← 12-node Delhi graph (distance, traffic, safety)
│   ├── models/
│   │   └── Report.js          ← Mongoose schema for hazard reports
│   ├── controllers/
│   │   └── routeController.js ← Merges approved reports into edge weights
│   ├── routes/
│   │   └── route.js           ← REST API routes
│   └── server.js              ← Express entry point
│
└── client/
    └── src/
        ├── components/
        │   ├── App.jsx          ← Root component, tab routing
        │   ├── Topbar.jsx       ← Nav bar with live latency
        │   ├── Sidebar.jsx      ← Algorithm panel + SYNTHESIZE button
        │   ├── MapView.jsx      ← Leaflet map with routes & nodes
        │   ├── ControlPanel.jsx ← Floating start/end selector
        │   ├── StatsBar.jsx     ← Algorithm comparison stats
        │   ├── ReportsPanel.jsx ← Community hazard submission
        │   ├── AdminPanel.jsx   ← Admin approve/reject panel
        │   └── NodesPanel.jsx   ← Graph explorer
        └── services/
            └── api.js           ← Axios calls to Express
```

---

## 🔬 DAA Concepts

### Dijkstra's Algorithm
- **Time Complexity**: O((V + E) log V) with min-heap
- **Guarantee**: Always finds optimal path
- **Approach**: Explores all reachable nodes by increasing cost

### A* Algorithm
- **Time Complexity**: O((V + E) log V) — faster in practice
- **Heuristic**: `f(n) = g(n) + h(n)` where `h(n)` = Euclidean distance
- **Advantage**: Explores fewer nodes by biasing toward the goal

### Weight Formula (Multi-Criteria)
```
fastest:  w = distance × (1 + traffic × 1.5)
safest:   w = distance × (1 + (1 - safety) × 2 + safetyPenalty)
fuel:     w = distance × (1 + traffic × 0.5)
```

### Community Safety Penalty
When a report is approved by admin, a `safetyPenalty` score (0–1) is added to the affected edge weight in **safest** mode — making the algorithm dynamically avoid hazardous roads.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/route` | Compute Dijkstra + A* route |
| GET | `/api/graph` | Get all nodes and edges |
| POST | `/api/report` | Submit a hazard report |
| GET | `/api/reports` | List all reports |
| PATCH | `/api/report/:id` | Approve/reject a report |
