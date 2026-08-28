// Proposed contract (not confirmed with team yet):
//
//   GET /api/anomalies?date_from=&date_to=&class=&min_confidence=
//     -> [{ id, lat, lon, timestamp, frp, brightness_temp,
//           confidence, class, land_cover, distance_km }, ...]
//
//   GET /api/anomalies/:id
//     -> same fields + { safety_brief, nearest_facility, history: [...] }
//
//   GET /api/anomalies/timeseries?window=24h
//     -> [{ t, frp }, ...]

import { MOCK_ANOMALIES, MOCK_TIMELINE } from './mockAnomalies';

const USE_MOCK = true; // to flip to false when api gets live
const API_BASE = ''; //to be filled in later

export async function fetchAnomalies(filters = {}) {
  if (USE_MOCK) {
    return Promise.resolve(MOCK_ANOMALIES);
  }
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE}/api/anomalies?${params}`);
  if (!res.ok) throw new Error(`fetchAnomalies failed: ${res.status}`);
  return res.json();
}

export async function fetchAnomalyDetail(id) {
  if (USE_MOCK) {
    return Promise.resolve(MOCK_ANOMALIES.find((a) => a.id === id));
  }
  const res = await fetch(`${API_BASE}/api/anomalies/${id}`);
  if (!res.ok) throw new Error(`fetchAnomalyDetail failed: ${res.status}`);
  return res.json();
}

export async function fetchTimeline(window = '24h') {
  if (USE_MOCK) {
    return Promise.resolve(MOCK_TIMELINE);
  }
  const res = await fetch(
    `${API_BASE}/api/anomalies/timeseries?window=${window}`
  );
  if (!res.ok) throw new Error(`fetchTimeline failed: ${res.status}`);
  return res.json();
}
