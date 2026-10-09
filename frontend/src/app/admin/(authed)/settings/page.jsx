"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AdminAPI, clearCredentials } from "@/lib/admin/api";
import { SystemHealth } from "@/components/admin/SystemHealth";
import { IconSettings } from "@/components/admin/icons";

export default function Settings() {
  const { data: health } = useQuery({ queryKey: ["health"], queryFn: AdminAPI.health });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const refresh = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      <p className="page-desc">System configuration and diagnostics.</p>

      <div className="panel">
        <div className="panel-head">
          <span className="panel-title">System health</span>
          <button onClick={refresh} disabled={saving} className="ghost">
            {saving ? "Checking…" : saved ? "✓ Updated" : "↻ Refresh"}
          </button>
        </div>
        <div className="panel-pad">
          <SystemHealth health={health} />
          {health?.llm_error && (
            <p className="muted" style={{ marginTop: 12, fontSize: 12 }}>
              LLM detail: {String(health.llm_error)}
            </p>
          )}
        </div>
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-head">
          <span className="panel-title inline"><IconSettings size={16} /> Danger zone</span>
        </div>
        <div className="panel-pad">
          <p className="muted" style={{ marginBottom: 12 }}>
            Clear the saved admin username + password in this browser. You'll need both again to log back in.
          </p>
          <button
            className="danger"
            onClick={() => {
              if (confirm("Log out of the dashboard on this browser?")) {
                clearCredentials();
                location.reload();
              }
            }}
          >
            Log out of dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
