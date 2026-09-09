export type MonthlySummary = {
  id: string;
  user_id: string;
  year: number;
  month: number;
  income: number;
  expenses: number;
  savings: number;
  debt_balance: number;
  net_worth: number;
};

export type Transaction = {
  id: string;
  user_id: string;
  occurred_on: string;
  category: string;
  description: string | null;
  amount: number;
  type: "income" | "expense";
  created_at: string;
};

export type BudgetItem = {
  id: string;
  user_id: string;
  year: number;
  month: number;
  category: string;
  budgeted: number;
  actual: number;
};

export type SavingsGoal = {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
};

export type Debt = {
  id: string;
  user_id: string;
  name: string;
  initial_balance: number;
  current_balance: number;
};
