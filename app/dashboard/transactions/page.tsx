import { redirect } from "next/navigation";
import { getSession } from "../../../lib/session";
import { adminDb } from "../../../lib/firebase/admin";
import { formatCurrency } from "../../../lib/format";
import { TransactionForm } from "../../../components/dashboard/TransactionForm";
import { DeleteTransactionButton } from "../../../components/dashboard/DeleteTransactionButton";
import type { Transaction } from "../../../lib/types";

export default async function TransactionsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const snap = await adminDb()
    .collection("users")
    .doc(session.uid)
    .collection("transactions")
    .orderBy("occurredOn", "desc")
    .limit(50)
    .get();

  const transactions: Transaction[] = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      occurredOn: data.occurredOn,
      category: data.category,
      description: data.description ?? null,
      amount: data.amount,
      type: data.type,
      createdAt: data.createdAt?.toDate?.().toISOString() ?? "",
    };
  });

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
                  <td>{transaction.occurredOn}</td>
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
