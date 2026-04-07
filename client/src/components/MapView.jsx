import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMap } from 'react-leaflet';

function FitBounds({ result }) {
  const map = useMap();
  useEffect(() => {
    if (!result) return;
    const coords = result.dijkstra.pathCoords.length
      ? result.dijkstra.pathCoords
      : result.astar.pathCoords;
    if (coords.length > 1) {
      map.fitBounds(coords.map(c => [c.lat, c.lng]), { padding: [60, 60] });
    }
  }, [result, map]);
  return null;
}

export default function MapView({ nodes, result, selectedStart, selectedEnd }) {
  const center = [28.6139, 77.2090];

  const getNodeColor = (id) => {
    if (id === selectedStart) return '#34d399';
    if (id === selectedEnd) return '#f87171';
    if (result) {
      const inDijkstra = result.dijkstra.path.includes(id);
      const inAstar = result.astar.path.includes(id);
      if (inDijkstra && inAstar) return '#f0f0f5';
      if (inDijkstra) return '#60a5fa';
      if (inAstar) return '#fb923c';
    }
    return '#33334a';
  };

  const getNodeRadius = (id) => {
    if (id === selectedStart || id === selectedEnd) return 10;
    if (result) {
      if (result.dijkstra.path.includes(id) || result.astar.path.includes(id)) return 8;
    }
    return 5;
  };

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution=""
      />

      {result && result.dijkstra.pathCoords.length > 1 && (
        <Polyline
          positions={result.dijkstra.pathCoords.map(c => [c.lat, c.lng])}
          pathOptions={{ color: '#60a5fa', weight: 5, opacity: 0.9, dashArray: null, lineCap: 'round', lineJoin: 'round' }}
        />
      )}

      {result && result.astar.pathCoords.length > 1 && (
        <Polyline
          positions={result.astar.pathCoords.map(c => [c.lat, c.lng])}
          pathOptions={{ color: '#fb923c', weight: 4, opacity: 0.8, dashArray: '10 6', lineCap: 'round', lineJoin: 'round' }}
        />
      )}

      {nodes.map(node => (
        <CircleMarker
          key={node.id}
          center={[node.lat, node.lng]}
          radius={getNodeRadius(node.id)}
          pathOptions={{
            color: getNodeColor(node.id),
            fillColor: getNodeColor(node.id),
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              background: '#1c1c26',
              color: '#f0f0f5',
              padding: '8px 12px',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{node.name}</div>
              <div style={{ color: '#a0a0b8', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>{node.id}</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}

      {result && <FitBounds result={result} />}
    </MapContainer>
  );
}
