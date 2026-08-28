import React, { useState, useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CLASS_META } from "./mockAnomalies";
import { fetchAnomalies, fetchAnomalyDetail, fetchTimeline } from "./api";
import "./dashboard.css";

// Config for drawer rows. Add/remove a field here instead of
// editing the render logic below. Missing fields just get skipped.
//   key: field name on the detail object
//   label: shown to user
//   format: optional formatter fn
const DRAWER_FIELDS = [
  { key: "id", label: "Anomaly ID" },
  { key: "timestamp", label: "Timestamp (UTC)", format: (v) => new Date(v).toISOString().slice(0, 16).replace("T", " ") },
  { key: "frp", label: "FRP", format: (v) => `${v} MW` },
  { key: "brightness_temp", label: "Brightness temp", format: (v) => `${v} K` },
  { key: "confidence", label: "Confidence", format: (v) => `${Math.round(v * 100)}%` },
  { key: "land_cover", label: "Land cover" },
  { key: "distance_km", label: "Distance to facility", format: (v) => `${v} km` },
  { key: "lat", label: "Latitude", format: (v) => v.toFixed(2) },
  { key: "lon", label: "Longitude", format: (v) => v.toFixed(2) },
];

function Badge({ cls }) {
  const meta = CLASS_META[cls];
  if (!meta) return null; // unknown class label, skip instead of crashing
  return (
    <span className="badge" style={{ background: meta.bg, color: meta.color }}>
      {meta.label}
    </span>
  );
}

export default function Dashboard() {
  const [anomalies, setAnomalies] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [minConfidence, setMinConfidence] = useState(0.5);
  const [activeClasses, setActiveClasses] = useState(Object.keys(CLASS_META));
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);

  const [filtersOpen, setFiltersOpen] = useState(true);
  const [statsOpen, setStatsOpen] = useState(true);

  // list + timeline data, swap USE_MOCK in api.js when backend is ready
  useEffect(() => {
    fetchAnomalies().then(setAnomalies);
    fetchTimeline().then(setTimeline);
  }, []);

  // will fetch full detail once pin is selected
  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    fetchAnomalyDetail(selectedId).then((d) => {
      if (!cancelled) setDetail(d);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const filtered = useMemo(
    () => anomalies.filter((a) => a.confidence >= minConfidence && activeClasses.includes(a.class)),
    [anomalies, minConfidence, activeClasses]
  );

  const pieData = useMemo(() => {
    const counts = {};
    filtered.forEach((a) => (counts[a.class] = (counts[a.class] || 0) + 1));
    return Object.entries(counts)
      .filter(([k]) => CLASS_META[k]) // skip unrecognized class
      .map(([k, v]) => ({ name: CLASS_META[k].label, value: v, color: CLASS_META[k].color }));
  }, [filtered]);

  function toggleClass(cls) {
    setActiveClasses((prev) => (prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]));
  }

  // map handoff point, real map component calls this on pin click:
  function handlePinClick(anomaly) {
    setSelectedId(anomaly.id);
  }

  return (
    <div className="dashboard-root">
      {/* map placeholder, replace with real map component:
          <FireMap anomalies={filtered} onPinClick={handlePinClick} /> */}
      <div className="map-placeholder">
        <div className="map-placeholder-label">
          map layer (teammate's component) — pins below are illustrative
        </div>
        {anomalies.map((a) => {
          const isVisible = a.confidence >= minConfidence && activeClasses.includes(a.class);
          const meta = CLASS_META[a.class];
          if (!meta || a.x == null || a.y == null) return null; // demo-only
          return (
            <div
              key={a.id}
              onClick={() => isVisible && handlePinClick(a)}
              title={a.name}
              className={`map-pin ${isVisible ? "map-pin--active" : "map-pin--dim"}`}
              style={{
                left: `${a.x}%`,
                top: `${a.y}%`,
                background: meta.color,
                boxShadow: selectedId === a.id ? `0 0 0 4px ${meta.color}55` : "none",
              }}
            />
          );
        })}
      </div>

      {/* ---------- Top bar ---------- */}
      <div className="topbar">
        <div>
          <div className="topbar-eyebrow">SIH26162</div>
          <div className="topbar-title">Thermal anomaly monitor</div>
        </div>
        <div className="topbar-actions">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`topbar-btn ${filtersOpen ? "topbar-btn--active" : ""}`}
          >
            Filters
          </button>
          <button
            onClick={() => setStatsOpen((v) => !v)}
            className={`topbar-btn ${statsOpen ? "topbar-btn--active" : ""}`}
          >
            Stats
          </button>
          <div className="topbar-count">{filtered.length} active</div>
        </div>
      </div>

      {/* ---------- Filter overlay ---------- */}
      {filtersOpen && (
        <div className="filter-panel">
          <div className="filter-label">Min confidence — {Math.round(minConfidence * 100)}%</div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={minConfidence}
            onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
            style={{ width: "100%" }}
          />
          <div className="filter-label" style={{ margin: "14px 0 8px" }}>Fire class</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Object.entries(CLASS_META).map(([key, meta]) => (
              <label
                key={key}
                className={`filter-checkbox-row ${!activeClasses.includes(key) ? "filter-checkbox-row--inactive" : ""}`}
              >
                <input type="checkbox" checked={activeClasses.includes(key)} onChange={() => toggleClass(key)} />
                <span className="filter-swatch" style={{ background: meta.color }} />
                {meta.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ---------- Stats overlay ---------- */}
      {statsOpen && (
        <div className="stats-strip" style={{ right: selectedId ? 356 : 20 }}>
          <div className="stats-card">
            <div className="stats-card-title">FRP time series (24h)</div>
            <ResponsiveContainer width="100%" height={90}>
              <LineChart data={timeline}>
                <CartesianGrid stroke="#232722" strokeDasharray="3 3" />
                <XAxis dataKey="t" tick={{ fill: "#8A8A82", fontSize: 10 }} axisLine={{ stroke: "#2A2E27" }} />
                <YAxis tick={{ fill: "#8A8A82", fontSize: 10 }} axisLine={{ stroke: "#2A2E27" }} width={30} />
                <Tooltip contentStyle={{ background: "#1A1D19", border: "1px solid #2A2E27", fontSize: 11 }} />
                <Line type="monotone" dataKey="frp" stroke="#EF9F27" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="stats-card">
            <div className="stats-card-title">Class breakdown</div>
            <ResponsiveContainer width="100%" height={90}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={20} outerRadius={38}>
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1A1D19", border: "1px solid #2A2E27", fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ---------- Incident drawer ---------- */}
      <div className={`drawer ${selectedId ? "drawer--open" : "drawer--closed"}`}>
        {selectedId && !detail && (
          <div style={{ color: "#8A8A82", fontSize: 13 }}>Loading incident details…</div>
        )}
        {detail && (
          <>
            <div className="drawer-header">
              <div>
                <div className="drawer-title">{detail.name}</div>
                <div style={{ marginTop: 6 }}><Badge cls={detail.class} /></div>
              </div>
              <button onClick={() => setSelectedId(null)} className="drawer-close-btn">×</button>
            </div>

            <div className="drawer-fields">
              {DRAWER_FIELDS.map(({ key, label, format }) => {
                const raw = detail[key];
                if (raw === undefined || raw === null) return null; // missing field -> row just doesn't render
                return (
                  <div key={key} className="drawer-field-row">
                    <span className="drawer-field-label">{label}</span>
                    <span>{format ? format(raw) : raw}</span>
                  </div>
                );
              })}
            </div>

            {/* real content comes from detail.safety_brief once ready */}
            {detail.safety_brief ? (
              <div className="ai-brief">
                <div className="ai-brief-title">AI brief</div>
                {detail.safety_brief}
              </div>
            ) : (
              <div className="ai-brief ai-brief--placeholder">
                <div className="ai-brief-title">AI brief</div>
                AI BRIEF
                {/* will wire once api is live */}
              </div>
            )}

           {/* export button can be added here  */}
          </>
        )}
      </div>
    </div>
  );
}