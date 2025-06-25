import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

import L from "leaflet";
import "leaflet-draw";
import "leaflet-control-geocoder";

function App() {
  useEffect(() => {
    const map = L.map("map").setView([-37.8136, 144.9631], 13); // Melbourne

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Add Geocoder control
    L.Control.geocoder({
      defaultMarkGeocode: true,
    }).addTo(map);

    // Add drawing layer
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: true,
        rectangle: true,
        circle: false,
        marker: false,
        polyline: false,
      },
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (event) {
      const layer = event.layer;
      drawnItems.addLayer(layer);

      const bounds = layer.getBounds();
      console.log("Bounds drawn:", bounds);
      // Call your setup generator here
      // const setup = generateTrafficSetup(bounds);
    });
  }, []);

  return (
    <div id="map" style={{ height: "100vh", width: "100%" }}></div>
  );
}

export default App;
