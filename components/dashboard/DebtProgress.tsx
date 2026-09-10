import { formatCurrency } from "../../lib/format";
import type { Debt } from "../../lib/types";

export function DebtProgress({ debts }: { debts: Debt[] }) {
  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h3>Debt Payoff Progress</h3>
      </div>
      {debts.length === 0 ? (
        <p className="empty-hint">No debts tracked. Nice.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Debt</th>
              <th>Initial Balance</th>
              <th>Current Balance</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {debts.map((debt) => {
              const paid =
                debt.initialBalance > 0
                  ? Math.min(
                      100,
                      Math.round(
                        ((debt.initialBalance - debt.currentBalance) / debt.initialBalance) * 100
                      )
                    )
                  : 0;
              return (
                <tr key={debt.id}>
                  <td>{debt.name}</td>
                  <td>{formatCurrency(debt.initialBalance)}</td>
                  <td>{formatCurrency(debt.currentBalance)}</td>
                  <td>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${paid}%` }} />
                    </div>
                    <span className="progress-value">{paid}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
