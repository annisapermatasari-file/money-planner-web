import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import { getBudgetItems, getDashboardData } from "../../lib/data";
import { PeriodTabs } from "../../components/dashboard/PeriodTabs";
import { SummaryCard } from "../../components/dashboard/SummaryCard";
import { NetWorthChart } from "../../components/dashboard/NetWorthChart";
import { CashFlowChart } from "../../components/dashboard/CashFlowChart";
import { SavingsGoals } from "../../components/dashboard/SavingsGoals";
import { DebtProgress } from "../../components/dashboard/DebtProgress";
import { ExpenseBreakdown } from "../../components/dashboard/ExpenseBreakdown";
import { formatCurrency, MONTH_NAMES } from "../../lib/format";
import type { MonthlySummary } from "../../lib/types";

function emptySummary(year: number, month: number): MonthlySummary {
  return {
    id: "",
    year,
    month,
    income: 0,
    expenses: 0,
    savings: 0,
    debtBalance: 0,
    netWorth: 0,
  };
}

function sumSummaries(acc: MonthlySummary, summary: MonthlySummary): MonthlySummary {
  return {
    ...acc,
    income: acc.income + summary.income,
    expenses: acc.expenses + summary.expenses,
    savings: acc.savings + summary.savings,
    debtBalance: summary.debtBalance,
    netWorth: summary.netWorth,
  };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period } = await searchParams;

  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const year = new Date().getFullYear();
  const selectedMonth = period && period !== "annual" ? Number(period) : null;

  const { summaries, goals, debts } = await getDashboardData(session.uid, year);

  const totals = selectedMonth
    ? summaries.find((s) => s.month === selectedMonth) ?? emptySummary(year, selectedMonth)
    : summaries.reduce(sumSummaries, emptySummary(year, 0));

  const budgetItems = selectedMonth ? await getBudgetItems(session.uid, year, selectedMonth) : [];

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <div>
          <h1>{selectedMonth ? `${MONTH_NAMES[selectedMonth - 1]} Budget` : "Annual Dashboard"}</h1>
          <p>A healthier relationship with money</p>
        </div>
        <PeriodTabs selected={period ?? "annual"} />
      </div>

      <div className="summary-grid">
        <SummaryCard label="Total Income" value={formatCurrency(totals.income)} />
        <SummaryCard label="Total Expenses" value={formatCurrency(totals.expenses)} />
        <SummaryCard label="Savings" value={formatCurrency(totals.savings)} />
        <SummaryCard label="Debt Balance" value={formatCurrency(totals.debtBalance)} />
        <SummaryCard label="Net Worth" value={formatCurrency(totals.netWorth)} />
      </div>

      {selectedMonth ? (
        <div className="dashboard-grid">
          <ExpenseBreakdown items={budgetItems} income={totals.income} expenses={totals.expenses} />
          <SavingsGoals goals={goals} />
        </div>
      ) : (
        <div className="dashboard-grid">
          <NetWorthChart summaries={summaries} />
          <SavingsGoals goals={goals} />
          <DebtProgress debts={debts} />
          <CashFlowChart summaries={summaries} />
        </div>
      )}
    </div>
  );
}
