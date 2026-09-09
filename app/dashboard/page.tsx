import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
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
    user_id: "",
    year,
    month,
    income: 0,
    expenses: 0,
    savings: 0,
    debt_balance: 0,
    net_worth: 0,
  };
}

function sumSummaries(acc: MonthlySummary, summary: MonthlySummary): MonthlySummary {
  return {
    ...acc,
    income: acc.income + summary.income,
    expenses: acc.expenses + summary.expenses,
    savings: acc.savings + summary.savings,
    debt_balance: summary.debt_balance,
    net_worth: summary.net_worth,
  };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const year = new Date().getFullYear();
  const selectedMonth = period && period !== "annual" ? Number(period) : null;

  const { summaries, goals, debts } = await getDashboardData(user.id, year);

  const totals = selectedMonth
    ? summaries.find((s) => s.month === selectedMonth) ?? emptySummary(year, selectedMonth)
    : summaries.reduce(sumSummaries, emptySummary(year, 0));

  const budgetItems = selectedMonth ? await getBudgetItems(user.id, year, selectedMonth) : [];

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
        <SummaryCard label="Debt Balance" value={formatCurrency(totals.debt_balance)} />
        <SummaryCard label="Net Worth" value={formatCurrency(totals.net_worth)} />
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
