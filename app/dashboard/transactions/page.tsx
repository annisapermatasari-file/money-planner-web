import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { formatCurrency } from "../../../lib/format";
import { TransactionForm } from "../../../components/dashboard/TransactionForm";
import { DeleteTransactionButton } from "../../../components/dashboard/DeleteTransactionButton";
import type { Transaction } from "../../../lib/types";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("occurred_on", { ascending: false })
    .limit(50);

  const transactions = (data ?? []) as Transaction[];

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <div>
          <h1>Transactions</h1>
          <p>Log income and expenses as they happen.</p>
        </div>
      </div>

      <TransactionForm />

      <div className="panel-card">
        {transactions.length === 0 ? (
          <p className="empty-hint">No transactions yet. Add your first one above.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.occurred_on}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.description ?? "—"}</td>
                  <td className={transaction.type === "income" ? "type-income" : "type-expense"}>
                    {transaction.type}
                  </td>
                  <td>{formatCurrency(transaction.amount)}</td>
                  <td>
                    <DeleteTransactionButton id={transaction.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
