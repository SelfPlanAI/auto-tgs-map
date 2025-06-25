import * as turf from "@turf/turf";

/**
 * Generates a simple traffic guidance scheme (TGS) for a work zone
 * @param {LatLngBounds | LatLng[]} bounds - Bounds or latlngs from the drawn layer
 * @returns {Object} setup
 */
export function generateTrafficSetup(bounds) {
  // Normalize input to bbox
  const bbox = Array.isArray(bounds)
    ? turf.bbox(turf.polygon([bounds[0].map(p => [p.lng, p.lat])]))
    : [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];

  const [minLng, minLat, maxLng, maxLat] = bbox;

  // Approximate road direction vector (simplified)
  const direction = turf.bearing(
    turf.point([minLng, minLat]),
    turf.point([maxLng, maxLat])
  );

  const center = [(minLat + maxLat) / 2, (minLng + maxLng) / 2];

  // Estimate buffer zone (100m back along the road)
  const bufferStart = turf.destination(turf.point([center[1], center[0]]), 0.1, direction - 180, { units: "kilometers" });
  const bufferEnd = turf.destination(turf.point([center[1], center[0]]), 0.01, direction, { units: "kilometers" });

  // Estimate taper (4 points diagonally)
  const taper = [
    turf.destination(bufferEnd, 0.02, direction - 90, { units: "kilometers" }),
    turf.destination(bufferEnd, 0.015, direction - 45, { units: "kilometers" }),
    turf.destination(bufferEnd, 0.01, direction, { units: "kilometers" }),
    turf.destination(bufferEnd, 0.005, direction + 45, { units: "kilometers" }),
  ].map(pt => [pt.geometry.coordinates[1], pt.geometry.coordinates[0]]);

  // Work area polygon
  const work_area = [
    [minLat, minLng],
    [minLat, maxLng],
    [maxLat, maxLng],
    [maxLat, minLng],
  ];

  // Sign positions (2 signs back from buffer start)
  const sign1 = turf.destination(bufferStart, 0.02, direction - 180, { units: "kilometers" });
  const sign2 = turf.destination(bufferStart, 0.01, direction - 180, { units: "kilometers" });

  return {
    buffer_zone: {
      start: [bufferStart.geometry.coordinates[1], bufferStart.geometry.coordinates[0]],
      end: [bufferEnd.geometry.coordinates[1], bufferEnd.geometry.coordinates[0]],
    },
    taper,
    work_area,
    signs: [
      { type: "Roadwork Ahead", position: [sign1.geometry.coordinates[1], sign1.geometry.coordinates[0]] },
      { type: "Prepare to Stop", position: [sign2.geometry.coordinates[1], sign2.geometry.coordinates[0]] },
    ],
  };
}
