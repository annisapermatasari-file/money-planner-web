export function SummaryCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="summary-card">
      <p className="summary-label">{label}</p>
      <p className="summary-value">{value}</p>
      {hint && <p className="summary-hint">{hint}</p>}
    </div>
  );
}
