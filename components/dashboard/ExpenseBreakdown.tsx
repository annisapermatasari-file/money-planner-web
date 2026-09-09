import { formatCurrency } from "../../lib/format";
import type { BudgetItem } from "../../lib/types";

const COLORS = ["#2f6f68", "#7ba88f", "#c9a66b", "#8e7cc3", "#d98b72", "#5b8ca6", "#b9b0a0"];

export function ExpenseBreakdown({
  items,
  income,
  expenses,
}: {
  items: BudgetItem[];
  income: number;
  expenses: number;
}) {
  const remaining = income - expenses;
  const spentPct = income > 0 ? Math.min(100, Math.round((expenses / income) * 100)) : 0;

  const total = items.reduce((sum, item) => sum + item.actual, 0) || 1;
  let cumulative = 0;
  const segments = items.map((item, index) => {
    const percent = (item.actual / total) * 100;
    const offset = 25 - cumulative;
    cumulative += percent;
    return { ...item, color: COLORS[index % COLORS.length], percent, offset };
  });

  return (
    <div className="panel-card expense-breakdown">
      <div className="panel-card-header">
        <h3>Expenses Breakdown</h3>
        <div className="donut-summary">
          <svg viewBox="0 0 42 42" className="donut" role="img" aria-label="Share of budget spent">
            <circle cx="21" cy="21" r="15.915" className="donut-track" />
            {segments.map((segment) => (
              <circle
                key={segment.id}
                cx="21"
                cy="21"
                r="15.915"
                className="donut-segment"
                style={{ stroke: segment.color }}
                strokeDasharray={`${segment.percent} ${100 - segment.percent}`}
                strokeDashoffset={segment.offset}
              />
            ))}
          </svg>
          <div className="donut-center">
            <span className="donut-pct">{spentPct}%</span>
            <span className="donut-caption">Spent</span>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="empty-hint">No budget categories yet for this month.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget</th>
              <th>Actual</th>
              <th>Difference</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className="category-dot" style={{ background: item.color }} />
                  {item.category}
                </td>
                <td>{formatCurrency(item.budgeted)}</td>
                <td>{formatCurrency(item.actual)}</td>
                <td>{formatCurrency(item.budgeted - item.actual)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="expense-remaining">
        <span>Remaining</span>
        <strong>{formatCurrency(remaining)}</strong>
      </div>
    </div>
  );
}
