import React, { useState, useEffect } from 'react';

export default function Topbar({ activeTab, setActiveTab }) {
  const [time, setTime] = useState(new Date());
  const [latency, setLatency] = useState(12);

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date());
      setLatency(Math.floor(Math.random() * 20 + 8));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const tabs = ['MAP', 'NODES', 'REPORTS', 'ADMIN'];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '48px', padding: '0 20px',
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      position: 'relative', zIndex: 1000, flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--green)',
          boxShadow: '0 0 8px var(--green)',
          animation: 'pulse-glow 2s infinite',
        }} />
        <span style={{
          fontFamily: 'var(--font-head)', fontSize: 14, letterSpacing: 3,
          color: 'var(--cyan)', fontWeight: 700,
        }}>SMART ROUTE PLANNER</span>
        <span style={{ color: 'var(--text-dim)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
          // DELHI NCR
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: activeTab === tab ? 'var(--border)' : 'transparent',
            border: 'none', borderBottom: activeTab === tab ? '2px solid var(--cyan)' : '2px solid transparent',
            color: activeTab === tab ? 'var(--cyan)' : 'var(--text-dim)',
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 2,
            padding: '0 16px', height: '48px', cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        <span style={{ color: 'var(--text-dim)' }}>LAT <span style={{ color: 'var(--green)' }}>{latency}ms</span></span>
        <span style={{ color: 'var(--text-dim)' }}>{time.toLocaleTimeString('en-IN', { hour12: false })}</span>
        <span style={{
          background: '#001a0a', border: '1px solid var(--green)',
          color: 'var(--green)', fontSize: 9, letterSpacing: 2,
          padding: '3px 8px', borderRadius: 2,
        }}>SYSTEM ONLINE</span>
      </div>
    </div>
  );
}
