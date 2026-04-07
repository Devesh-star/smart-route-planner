import React, { useEffect, useRef } from 'react';
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
    if (id === selectedStart) return '#00ff88';
    if (id === selectedEnd) return '#ff3355';
    if (result) {
      const inDijkstra = result.dijkstra.path.includes(id);
      const inAstar = result.astar.path.includes(id);
      if (inDijkstra && inAstar) return '#ffffff';
      if (inDijkstra) return '#00d4ff';
      if (inAstar) return '#ff6b35';
    }
    return '#1a3a5c';
  };

  const getNodeRadius = (id) => {
    if (id === selectedStart || id === selectedEnd) return 10;
    if (result) {
      if (result.dijkstra.path.includes(id) || result.astar.path.includes(id)) return 8;
    }
    return 6;
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
          pathOptions={{ color: '#00d4ff', weight: 4, opacity: 0.85, dashArray: null }}
        />
      )}

      {result && result.astar.pathCoords.length > 1 && (
        <Polyline
          positions={result.astar.pathCoords.map(c => [c.lat, c.lng])}
          pathOptions={{ color: '#ff6b35', weight: 3, opacity: 0.75, dashArray: '8 4' }}
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
            fillOpacity: 0.9,
            weight: 2,
          }}
        >
          <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
            <div style={{ fontFamily: 'monospace', fontSize: 12, background: '#0a1520', color: '#00d4ff', padding: '4px 8px', border: '1px solid #1a3a5c', borderRadius: 3 }}>
              <strong>{node.name}</strong><br />
              <span style={{ color: '#6a9ab8' }}>{node.id}</span>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}

      {result && <FitBounds result={result} />}
    </MapContainer>
  );
}
