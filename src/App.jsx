import "./fixLeafletIcons";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

import * as L from "leaflet"; // ✅ FIXED: Correct Leaflet import
import "leaflet-draw";
import "leaflet-control-geocoder";

import { generateTrafficSetup } from "./utils/generateSetup";

function App() {
  useEffect(() => {
    console.log("Mounting map...");

    try {
      const map = L.map("map").setView([-37.8136, 144.9631], 13); // Melbourne

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Add geocoder (search bar)
      L.Control.geocoder({ defaultMarkGeocode: true }).addTo(map);

      // Add draw controls
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems },
        draw: {
          polygon: true,
          rectangle: true,
          circle: false,
          marker: false,
          polyline: false,
        },
      });
      map.addControl(drawControl);

      // On drawing completion
      map.on(L.Draw.Event.CREATED, function (event) {
        const layer = event.layer;
        drawnItems.addLayer(layer);

        const bounds = layer.getBounds?.() || layer.getLatLngs?.();
        const setup = generateTrafficSetup(bounds);

        // === Draw TGS elements ===

        // 1. Buffer Line
        if (setup.bufferStart && setup.bufferEnd) {
          L.polyline(
            [setup.bufferStart, setup.bufferEnd],
            { color: "red", dashArray: "5, 10" }
          ).addTo(map);
        }

        // 2. Taper Line
        if (setup.taperStart && setup.taperEnd) {
          L.polyline(
            [setup.taperStart, setup.taperEnd],
            { color: "orange", dashArray: "5, 10" }
          ).addTo(map);
        }

        // 3. Signs
        setup.signs.forEach(sign => {
          L.marker(sign.position, {
            title: sign.type,
          })
            .bindPopup(sign.type)
            .addTo(map);
        });
      });
    } catch (err) {
      console.error("Failed to mount map:", err);
    }
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100%" }}></div>;
}

export default App;
