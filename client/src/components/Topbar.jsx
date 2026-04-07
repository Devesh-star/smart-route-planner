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

  const tabs = [
    { id: 'MAP', icon: 'map', label: 'Map' },
    { id: 'NODES', icon: 'hub', label: 'Nodes' },
    { id: 'REPORTS', icon: 'flag', label: 'Reports' },
    { id: 'ADMIN', icon: 'admin_panel_settings', label: 'Admin' },
  ];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 56, padding: '0 24px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'relative', zIndex: 1000, flexShrink: 0,
      backdropFilter: 'blur(20px)',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 'var(--radius-sm)',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px var(--primary-soft)',
        }}>
          <span className="material-icons-round" style={{ fontSize: 20, color: '#fff' }}>route</span>
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
            color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>Smart Route</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
            fontWeight: 500, letterSpacing: '0.05em',
          }}>Delhi NCR</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4,
        background: 'var(--bg)', borderRadius: 'var(--radius-md)',
        padding: 4,
      }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: activeTab === tab.id
              ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
              : 'transparent',
            border: 'none', borderRadius: 'var(--radius-sm)',
            color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
            fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
            padding: '8px 16px', cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: activeTab === tab.id ? '0 2px 12px var(--primary-soft)' : 'none',
          }}
          onMouseEnter={e => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.background = 'var(--surface-hover)';
              e.currentTarget.style.color = 'var(--text)';
            }
          }}
          onMouseLeave={e => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }
          }}
          >
            <span className="material-icons-round" style={{ fontSize: 16 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
        }}>
          <span className="material-icons-round" style={{ fontSize: 14, color: 'var(--success)' }}>speed</span>
          <span style={{ color: 'var(--success)', fontWeight: 600 }}>{latency}ms</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
        }}>
          {time.toLocaleTimeString('en-IN', { hour12: false })}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--success-soft)',
          color: 'var(--success)', fontSize: 11, fontWeight: 600,
          fontFamily: 'var(--font-sans)',
          padding: '5px 12px', borderRadius: 'var(--radius-xl)',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--success)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          Online
        </div>
      </div>
    </div>
  );
}
