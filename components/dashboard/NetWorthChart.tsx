import { formatCurrency, MONTH_NAMES } from "../../lib/format";
import type { MonthlySummary } from "../../lib/types";

const WIDTH = 560;
const HEIGHT = 220;
const PADDING = 28;

export function NetWorthChart({ summaries }: { summaries: MonthlySummary[] }) {
  const byMonth = new Map(summaries.map((summary) => [summary.month, summary.netWorth]));
  const values = MONTH_NAMES.map((_, index) => byMonth.get(index + 1) ?? 0);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values.map((value, index) => {
    const x = PADDING + (index / (values.length - 1)) * (WIDTH - PADDING * 2);
    const y = HEIGHT - PADDING - ((value - min) / range) * (HEIGHT - PADDING * 2);
    return [x, y] as const;
  });

  const linePath = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const baseline = HEIGHT - PADDING;
  const areaPath = `${linePath} L${points[points.length - 1][0]},${baseline} L${points[0][0]},${baseline} Z`;
  const latest = values[values.length - 1];

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3>Net Worth Growth</h3>
        <span className="chart-card-latest">{formatCurrency(latest)}</span>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="line-chart"
        role="img"
        aria-label="Net worth by month"
      >
        <path d={areaPath} className="line-chart-area" />
        <path d={linePath} className="line-chart-line" />
        {points.map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r={3} className="line-chart-point" />
        ))}
      </svg>
      <div className="chart-axis">
        {MONTH_NAMES.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  );
}
