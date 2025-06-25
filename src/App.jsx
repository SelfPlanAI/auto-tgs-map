import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

import L from "leaflet";
import "leaflet-draw";
import "leaflet-control-geocoder";

import { generateTrafficSetup } from "./utils/generateSetup";

function App() {
  useEffect(() => {
    const map = L.map("map").setView([-37.8136, 144.9631], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.Control.geocoder({ defaultMarkGeocode: true }).addTo(map);

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

    map.on(L.Draw.Event.CREATED, function (event) {
      const layer = event.layer;
      drawnItems.addLayer(layer);

      const bounds = layer.getBounds?.() || layer.getLatLngs?.();
      const setup = generateTrafficSetup(bounds);

      // === Draw TGS elements ===

      // 1. Buffer Zone
      L.polyline(
        [setup.buffer_zone.start, setup.buffer_zone.end],
        { color: "orange", dashArray: "4 6" }
      ).addTo(map);

      // 2. Taper
      L.polyline(setup.taper, { color: "blue", weight: 2 }).addTo(map);

      // 3. Work Area
      L.polygon(setup.work_area, {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.3,
      }).addTo(map);

      // 4. Signs
      setup.signs.forEach((sign) => {
        L.marker(sign.position)
          .addTo(map)
          .bindPopup(sign.type)
          .openPopup();
      });
    });
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100%" }}></div>;
}

export default App;
