"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { AdminAPI } from "@/lib/admin/api";
import { StatCard } from "@/components/admin/StatCard";
import { SystemHealth } from "@/components/admin/SystemHealth";
import {
  IconDashboard, IconFile, IconCost, IconEval, IconSettings, IconSpark,
} from "@/components/admin/icons";

const TrafficChart = dynamic(
  () => import("@/components/admin/OverviewCharts").then((m) => m.TrafficChart),
  { ssr: false, loading: () => <p className="muted">Loading chart…</p> }
);
const LatencyBars = dynamic(
  () => import("@/components/admin/OverviewCharts").then((m) => m.LatencyBars),
  { ssr: false, loading: () => <p className="muted">Loading chart…</p> }
);

export default function Overview() {
  const { data: stats } = useQuery({ queryKey: ["overview"], queryFn: () => AdminAPI.overview(24) });
  const { data: ts } = useQuery({ queryKey: ["ts"], queryFn: () => AdminAPI.timeseries(24) });
  const { data: lat } = useQuery({ queryKey: ["lat"], queryFn: () => AdminAPI.latency(24) });
  const { data: health } = useQuery({ queryKey: ["health"], queryFn: AdminAPI.health });

  const chartData = ts
    ? ts.timestamps.map((t, i) => ({
        time: new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        users: ts.users[i],
        questions: ts.questions[i],
      }))
    : [];

  const latencyData = lat?.buckets.map((b) => ({
    name: `${Math.round(b.range_ms[0] / 1000)}s`,
    count: b.count,
  })) ?? [];

  return (
    <div>
      <h1>Overview</h1>
      <p className="page-desc">Your RAG assistant&apos;s activity over the last 24 hours.</p>

      <div className="stat-grid">
        <StatCard icon={<IconDashboard size={17} />} tone="indigo" label="Unique Users" value={stats?.unique_users} />
        <StatCard icon={<IconSpark size={17} />} tone="sky" label="Questions" value={stats?.questions} />
        <StatCard icon={<IconEval size={17} />} tone="amber" label="Avg Latency" value={stats?.avg_latency_ms ? `${stats.avg_latency_ms} ms` : "—"} />
        <StatCard icon={<IconEval size={17} />} tone="rose" label="P95 Latency" value={stats?.p95_latency_ms ? `${stats.p95_latency_ms} ms` : "—"} />
        <StatCard icon={<IconSettings size={17} />} tone="green" label="Cache Hit" value={stats?.cache_hit_rate != null ? `${(stats.cache_hit_rate * 100).toFixed(1)}%` : "—"} />
        <StatCard icon={<IconDashboard size={17} />} tone="emerald" label="Satisfaction" value={stats?.satisfaction != null ? `${(stats.satisfaction * 100).toFixed(1)}%` : "—"} />
        <StatCard icon={<IconFile size={17} />} tone="violet" label="Documents" value={stats?.doc_count} />
        <StatCard icon={<IconCost size={17} />} tone="pink" label="Chunks" value={stats?.chunk_count} />
      </div>

      <h2>Traffic</h2>
      <div className="panel">
        <div className="panel-head">
          <span className="panel-title">Questions & Users per hour</span>
          <span className="panel-sub">last 24h</span>
        </div>
        <div className="panel-pad">
          <TrafficChart data={chartData} />
        </div>
      </div>

      <h2>Latency distribution</h2>
      <div className="panel">
        <div className="panel-head">
          <span className="panel-title">Response-time buckets</span>
          <span className="panel-sub">seconds</span>
        </div>
        <div className="panel-pad">
          <LatencyBars data={latencyData} />
        </div>
      </div>

      <h2>System health</h2>
      <SystemHealth health={health} />
    </div>
  );
}
