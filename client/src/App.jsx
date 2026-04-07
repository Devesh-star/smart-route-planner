import React, { useState, useEffect } from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import ControlPanel from './components/ControlPanel';
import StatsBar from './components/StatsBar';
import ReportsPanel from './components/ReportsPanel';
import AdminPanel from './components/AdminPanel';
import NodesPanel from './components/NodesPanel';
import { computeRoute, getGraph } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('MAP');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [preference, setPreference] = useState('fastest');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getGraph()
      .then(data => { setNodes(data.nodes); setEdges(data.edges); })
      .catch(() => setError('Could not reach backend. Make sure server is running on port 5000.'));
  }, []);

  const handleCompute = async () => {
    if (!start || !end) return setError('Select both start and end nodes.');
    if (start === end) return setError('Start and end must be different nodes.');
    setError('');
    setLoading(true);
    try {
      const data = await computeRoute(start, end, preference);
      setResult(data);
    } catch (e) {
      setError('Route computation failed. Is the server running?');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Topbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {error && (
        <div style={{
          background: 'rgba(255,51,85,0.1)', border: '1px solid var(--danger)',
          color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: 11,
          padding: '8px 20px', letterSpacing: 1, flexShrink: 0,
        }}>
          ⚠ {error}
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar only on MAP tab */}
        {activeTab === 'MAP' && (
          <Sidebar
            preference={preference}
            setPreference={setPreference}
            onCompute={handleCompute}
            loading={loading}
            result={result}
          />
        )}

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          {activeTab === 'MAP' && (
            <>
              <div style={{ flex: 1, position: 'relative' }}>
                <MapView
                  nodes={nodes}
                  result={result}
                  selectedStart={start}
                  selectedEnd={end}
                />
                <ControlPanel
                  nodes={nodes}
                  start={start} end={end}
                  setStart={setStart} setEnd={setEnd}
                />
              </div>
              <StatsBar result={result} nodes={nodes} />
            </>
          )}

          {activeTab === 'NODES' && (
            <NodesPanel nodes={nodes} edges={edges} />
          )}

          {activeTab === 'REPORTS' && (
            <ReportsPanel nodes={nodes} />
          )}

          {activeTab === 'ADMIN' && (
            <AdminPanel />
          )}
        </div>
      </div>
    </div>
  );
}
