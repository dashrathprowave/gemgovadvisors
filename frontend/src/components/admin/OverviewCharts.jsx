"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
} from "recharts";

const AXIS = { fontSize: 11, fill: "#8b93a6", tickLine: false, axisLine: false };

function tooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#14181f", color: "#fff", borderRadius: 10, padding: "10px 12px",
        fontSize: 12, boxShadow: "0 8px 24px rgba(0,0,0,.25)",
      }}
    >
      <div style={{ opacity: 0.7, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ margin: "2px 0" }}>
          <span style={{ color: p.color }}>{p.dataKey}</span>: <b>{p.value}</b>
        </div>
      ))}
    </div>
  );
}

export function TrafficChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="gUsers" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F8862B" />
            <stop offset="100%" stopColor="#EE6C0F" />
          </linearGradient>
          <linearGradient id="gQuestions" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FBBF83" />
            <stop offset="100%" stopColor="#C6540E" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 6" stroke="#eef1f6" vertical={false} />
        <XAxis dataKey="time" tick={AXIS} dy={6} />
        <YAxis tick={AXIS} />
        <Tooltip content={tooltip} cursor={{ stroke: "#c7cee0" }} />
        <Line type="monotone" dataKey="users" stroke="url(#gUsers)" strokeWidth={2.4} dot={false} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="questions" stroke="url(#gQuestions)" strokeWidth={2.4} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function LatencyBars({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="gBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8862B" />
            <stop offset="100%" stopColor="#FBBF83" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 6" stroke="#eef1f6" vertical={false} />
        <XAxis dataKey="name" tick={AXIS} dy={6} />
        <YAxis tick={AXIS} />
        <Tooltip content={tooltip} cursor={{ fill: "rgba(248,134,43,.06)" }} />
        <Bar dataKey="count" fill="url(#gBar)" radius={[6, 6, 0, 0]} maxBarSize={42} />
      </BarChart>
    </ResponsiveContainer>
  );
}
