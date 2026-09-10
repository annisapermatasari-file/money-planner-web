import { formatCurrency } from "../../lib/format";
import type { SavingsGoal } from "../../lib/types";

export function SavingsGoals({ goals }: { goals: SavingsGoal[] }) {
  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h3>Savings Goals</h3>
      </div>
      {goals.length === 0 ? (
        <p className="empty-hint">No savings goals yet. Add one in Firestore to see it here.</p>
      ) : (
        <ul className="goal-list">
          {goals.map((goal) => {
            const pct =
              goal.targetAmount > 0
                ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
                : 0;
            return (
              <li key={goal.id}>
                <div className="goal-row">
                  <span className="goal-name">{goal.name}</span>
                  <span className="goal-amount">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
