const KNOWN = ["postgres", "redis", "llm", "mysql"];

function prettyName(key) {
  const map = {
    postgres: "PostgreSQL",
    redis: "Redis",
    llm: "LLM (Groq)",
    mysql: "MySQL (tenders)",
  };
  return map[key] ?? key;
}

export function SystemHealth({ health }) {
  if (!health) return <p className="muted">Health data unavailable.</p>;

  const items = KNOWN
    .filter((k) => k in health)
    .map((k) => {
      const v = health[k];
      const ok = v === "ok" || v === "empty" || String(v).startsWith("http 20");
      const err = health[`${k}_error`];
      return { key: k, label: prettyName(k), value: v, ok, err };
    });

  return (
    <div className="health">
      {items.map(({ key, label, value, ok, err }) => (
        <div key={key} className={`health-item ${ok ? "ok" : "down"}`} title={err ? String(err) : undefined}>
          <span><span className="dot" />{label}</span>
          <strong>{ok ? "Healthy" : String(value)}</strong>
          {!ok && err && <small className="muted">{String(err).slice(0, 90)}</small>}
        </div>
      ))}
    </div>
  );
}
