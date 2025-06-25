import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";import "leaflet-control-geocoder";

useEffect(() => {
  const map = L.map("map").setView([-37.8136, 144.9631], 13); // Melbourne default

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  // Add Geocoder control
  L.Control.geocoder({
    defaultMarkGeocode: true,
  }).addTo(map);
}, []);

import L from "leaflet";
import "leaflet-draw";

import { generateTrafficSetup } from "./utils/generateSetup";

function App() {
  useEffect(() => {
    const map = L.map("map").setView([-37.8136, 144.9631], 13); // Melbourne

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);    const drawControl = new L.Control.Draw({
      edit: { featureGroup: drawnItems },
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

      const speed = 60;
      const setup = generateTrafficSetup(speed);
      console.log("Auto-generated traffic setup:", setup);

      const latlngs = layer.getLatLngs()[0];
      if (!latlngs || latlngs.length < 2) return;

      const start = latlngs[0];
      const direction = latlngs[1];
      const latStep = direction.lat - start.lat;
      const lngStep = direction.lng - start.lng;

      function addMarkerAtDistance(label, distance, color) {
        const ratio = distance / 100;
        const lat = start.lat + latStep * ratio;
        const lng = start.lng + lngStep * ratio;
        L.circleMarker([lat, lng], {
          radius: 5,
          color: color || "blue",
        })
          .bindTooltip(label, { permanent: true, direction: "right" })
          .addTo(map);
      }

      addMarkerAtDistance("Sign A", setup.signs.signA, "red");
      addMarkerAtDistance("Sign B", setup.signs.signB, "orange");
      addMarkerAtDistance("Sign C", setup.signs.signC, "yellow");
      addMarkerAtDistance("Buffer Start", setup.buffer, "green");
      addMarkerAtDistance("Taper End", setup.buffer + setup.taper, "purple");

      alert(`
🚧 Auto Traffic Setup for ${speed} km/h:

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

