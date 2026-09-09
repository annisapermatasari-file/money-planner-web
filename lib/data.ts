import { createClient } from "./supabase/server";
import type { BudgetItem, Debt, MonthlySummary, SavingsGoal } from "./types";

export async function getDashboardData(userId: string, year: number) {
  const supabase = await createClient();

  const [{ data: summaries }, { data: goals }, { data: debts }] = await Promise.all([
    supabase
      .from("monthly_summaries")
      .select("*")
      .eq("user_id", userId)
      .eq("year", year)
      .order("month"),
    supabase.from("savings_goals").select("*").eq("user_id", userId).order("created_at"),
    supabase.from("debts").select("*").eq("user_id", userId).order("created_at"),
  ]);

  return {
    summaries: (summaries ?? []) as MonthlySummary[],
    goals: (goals ?? []) as SavingsGoal[],
    debts: (debts ?? []) as Debt[],
  };
}

export async function getBudgetItems(
  userId: string,
  year: number,
  month: number
): Promise<BudgetItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("budget_items")
    .select("*")
    .eq("user_id", userId)
    .eq("year", year)
    .eq("month", month)
    .order("category");

  return (data ?? []) as BudgetItem[];
}
