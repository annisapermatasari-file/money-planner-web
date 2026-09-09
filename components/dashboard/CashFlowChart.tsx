import { formatCurrency, MONTH_NAMES } from "../../lib/format";
import type { MonthlySummary } from "../../lib/types";

export function CashFlowChart({ summaries }: { summaries: MonthlySummary[] }) {
  const byMonth = new Map(summaries.map((summary) => [summary.month, summary]));
  const rows = MONTH_NAMES.map((label, index) => {
    const summary = byMonth.get(index + 1);
    return {
      label,
      income: summary?.income ?? 0,
      expenses: summary?.expenses ?? 0,
      savings: summary?.savings ?? 0,
    };
  });
  const max = Math.max(...rows.flatMap((row) => [row.income, row.expenses, row.savings]), 1);

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3>Monthly Cash Flow</h3>
        <div className="legend">
          <span>
            <span className="legend-dot legend-income" />
            Income
          </span>
          <span>
            <span className="legend-dot legend-expenses" />
            Expenses
          </span>
          <span>
            <span className="legend-dot legend-savings" />
            Savings
          </span>
        </div>
      </div>
      <div className="bar-chart">
        {rows.map((row) => (
          <div className="bar-group" key={row.label}>
            <div className="bar-set">
              <span
                className="bar bar-income"
                style={{ height: `${(row.income / max) * 100}%` }}
                title={`Income: ${formatCurrency(row.income)}`}
              />
              <span
                className="bar bar-expenses"
                style={{ height: `${(row.expenses / max) * 100}%` }}
                title={`Expenses: ${formatCurrency(row.expenses)}`}
              />
              <span
                className="bar bar-savings"
                style={{ height: `${(row.savings / max) * 100}%` }}
                title={`Savings: ${formatCurrency(row.savings)}`}
              />
            </div>
            <span className="bar-label">{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
