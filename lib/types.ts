export type MonthlySummary = {
  id: string;
  year: number;
  month: number;
  income: number;
  expenses: number;
  savings: number;
  debtBalance: number;
  netWorth: number;
};

export type Transaction = {
  id: string;
  occurredOn: string;
  category: string;
  description: string | null;
  amount: number;
  type: "income" | "expense";
  createdAt: string;
};

export type BudgetItem = {
  id: string;
  year: number;
  month: number;
  category: string;
  budgeted: number;
  actual: number;
};

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
};

export type Debt = {
  id: string;
  name: string;
  initialBalance: number;
  currentBalance: number;
};
