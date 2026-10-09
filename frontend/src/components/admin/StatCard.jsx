export function StatCard({ label, value, icon, tone = "indigo" }) {
  return (
    <div className="stat">
      {icon && <div className={`stat-icon tone-${tone}`}>{icon}</div>}
      <div>
        <span>{label}</span>
      </div>
      <strong>{value ?? "—"}</strong>
    </div>
  );
}
