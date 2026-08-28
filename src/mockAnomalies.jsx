// Mock data. field names are assumed here,will map properly once
// final field names are locked as per backend.
//
// Assumed shape per anomaly:
//   id               string   unique anomaly identifier
//   name             string   facility / location label
//   x, y             number   0-100, demo-only position on the fake
//                              placeholder grid in Dashboard.jsx.
//                              not part of real API, delete once
//                              real map component is added
//   lat, lon         number   coordinates
//   timestamp        string   ISO 8601 UTC
//   frp              number   Fire Radiative Power (MW), confirm unit with Apurv
//   brightness_temp  number   Kelvin, confirm with Apurv
//   confidence       number   0-1, confirm with Ayush (0-1 or 0-100?)
//   class            string   one of CLASS_META keys below, confirm exact strings with Ayush
//   land_cover       string   from ESA WorldCover / Dynamic World, confirm categories with Apurv
//   distance_km      number   distance to nearest industrial polygon, confirm with Apurv
//   safety_brief     string   only present on detail response, not list.
//                              comes from Aatman's RAG layer, not in mock
//                              list below since Dashboard.jsx treats it
//                              as optional and shows placeholder until ready

export const CLASS_META = {
  industrial_flare: {
    label: 'Industrial flare',
    color: '#EF9F27',
    bg: '#412402',
  },
  industrial_accident: {
    label: 'Industrial accident',
    color: '#E24B4A',
    bg: '#501313',
  },
  wildfire: { label: 'Wildfire', color: '#D85A30', bg: '#4A1B0C' },
  agri_burning: {
    label: 'Agricultural burning',
    color: '#639922',
    bg: '#173404',
  },
};

export const MOCK_ANOMALIES = [
  {
    id: 'A-1042',
    name: 'Jamnagar Refinery Unit 4',
    x: 62,
    y: 58,
    lat: 22.34,
    lon: 69.83,
    timestamp: '2026-08-27T02:14:00Z',
    frp: 812,
    brightness_temp: 411,
    confidence: 0.94,
    class: 'industrial_accident',
    land_cover: 'Industrial built-up',
    distance_km: 0.1,
  },
  {
    id: 'A-1041',
    name: 'Panipat Thermal Plant',
    x: 48,
    y: 30,
    lat: 29.39,
    lon: 76.96,
    timestamp: '2026-08-27T01:52:00Z',
    frp: 210,
    brightness_temp: 356,
    confidence: 0.88,
    class: 'industrial_flare',
    land_cover: 'Industrial built-up',
    distance_km: 0.3,
  },
  {
    id: 'A-1040',
    name: 'Sonipat district field',
    x: 50,
    y: 33,
    lat: 28.99,
    lon: 77.02,
    timestamp: '2026-08-27T01:10:00Z',
    frp: 45,
    brightness_temp: 322,
    confidence: 0.81,
    class: 'agri_burning',
    land_cover: 'Cropland',
    distance_km: 8.2,
  },
  {
    id: 'A-1039',
    name: 'Nilgiri forest belt',
    x: 40,
    y: 78,
    lat: 11.41,
    lon: 76.7,
    timestamp: '2026-08-26T22:40:00Z',
    frp: 130,
    brightness_temp: 341,
    confidence: 0.76,
    class: 'wildfire',
    land_cover: 'Dense forest',
    distance_km: 14.6,
  },
  {
    id: 'A-1038',
    name: 'Vadodara Petrochem Zone',
    x: 30,
    y: 55,
    lat: 22.31,
    lon: 73.19,
    timestamp: '2026-08-26T20:05:00Z',
    frp: 640,
    brightness_temp: 398,
    confidence: 0.91,
    class: 'industrial_accident',
    land_cover: 'Industrial built-up',
    distance_km: 0.2,
  },
  {
    id: 'A-1037',
    name: 'Karnal cropland',
    x: 49,
    y: 29,
    lat: 29.69,
    lon: 76.98,
    timestamp: '2026-08-26T18:33:00Z',
    frp: 38,
    brightness_temp: 318,
    confidence: 0.7,
    class: 'agri_burning',
    land_cover: 'Cropland',
    distance_km: 6.9,
  },
  {
    id: 'A-1036',
    name: 'Barmer flare stack',
    x: 22,
    y: 48,
    lat: 25.75,
    lon: 71.38,
    timestamp: '2026-08-26T15:20:00Z',
    frp: 190,
    brightness_temp: 352,
    confidence: 0.86,
    class: 'industrial_flare',
    land_cover: 'Industrial built-up',
    distance_km: 0.1,
  },
  {
    id: 'A-1035',
    name: 'Nainital ridge',
    x: 55,
    y: 24,
    lat: 29.39,
    lon: 79.46,
    timestamp: '2026-08-26T12:05:00Z',
    frp: 95,
    brightness_temp: 330,
    confidence: 0.68,
    class: 'wildfire',
    land_cover: 'Dense forest',
    distance_km: 21.3,
  },
];

// Placeholder, will update once final api response structure locks in
export const MOCK_TIMELINE = [
  { t: '00:00', frp: 120 },
  { t: '03:00', frp: 340 },
  { t: '06:00', frp: 280 },
  { t: '09:00', frp: 410 },
  { t: '12:00', frp: 260 },
  { t: '15:00', frp: 520 },
  { t: '18:00', frp: 610 },
  { t: '21:00', frp: 380 },
];
