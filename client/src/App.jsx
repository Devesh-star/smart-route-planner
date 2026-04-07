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

  // Auto-dismiss errors
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', width: '100vw', overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      <Topbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Error Toast */}
      {error && (
        <div style={{
          position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'var(--danger-soft)',
          border: '1px solid rgba(248,113,113,0.3)',
          backdropFilter: 'blur(12px)',
          color: 'var(--danger)',
          fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
          padding: '12px 20px', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex', alignItems: 'center', gap: 10,
          maxWidth: 500,
        }}>
          <span className="material-icons-round" style={{ fontSize: 18 }}>error_outline</span>
          {error}
          <button
            onClick={() => setError('')}
            style={{
              background: 'none', border: 'none', color: 'var(--danger)',
              cursor: 'pointer', padding: 4, marginLeft: 8,
              display: 'flex', alignItems: 'center',
            }}
          >
            <span className="material-icons-round" style={{ fontSize: 16 }}>close</span>
          </button>
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
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden',
        }}>
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
