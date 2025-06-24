import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

function App() {
  useEffect(() => {
    // your existing useEffect code here...
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Auto-TGS Generator (Beta)</h1>
      <div id="map" style={{ height: "90vh", width: "100%" }}></div>
    </div>
  );
}

export default App;
