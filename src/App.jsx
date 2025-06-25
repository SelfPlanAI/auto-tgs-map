import { generateTrafficSetup } from './utils/generateSetup';
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import "leaflet-draw";

function App() {
  useEffect(() => {
    const map = L.map("map").setView([-37.8136, 144.9631], 13); // Centered on Melbourne

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: true,
        polyline: true,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (event) {
      const layer = event.layer;
      drawnItems.addLayer(layer);
      // Assume default speed limit for now (60 km/h)
const setup = generateTrafficSetup(60);

console.log("Auto-generated traffic setup:", setup);

alert(`
  🚧 Auto Traffic Setup for 60 km/h:

  Sign A: ${setup.signs.signA}m
  Sign B: ${setup.signs.signB}m
  Sign C: ${setup.signs.signC}m
  Taper: ${setup.taper}m
  Buffer Zone: ${setup.buffer}m
  Cone Spacing: ${setup.coneSpacing}m
`);

    });
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Auto-TGS Generator (Beta)</h1>
      <div id="map" style={{ height: "90vh", width: "100%" }}></div>
    </div>
  );
}

export default App;
