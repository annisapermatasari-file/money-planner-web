import "server-only";
import { adminDb } from "./firebase/admin";
import type { BudgetItem, Debt, MonthlySummary, SavingsGoal } from "./types";

// Each collection here is small (a personal finance app's own data), so we
// fetch the whole per-user subcollection and filter/sort in code. This also
// sidesteps Firestore's composite-index requirements and lets values be
// added directly in the console without needing every field (e.g. no
// createdAt) just to satisfy a server-side orderBy.

export async function getDashboardData(uid: string, year: number) {
  const userRef = adminDb().collection("users").doc(uid);

  const [summariesSnap, goalsSnap, debtsSnap] = await Promise.all([
    userRef.collection("monthlySummaries").get(),
    userRef.collection("savingsGoals").get(),
    userRef.collection("debts").get(),
  ]);

  const summaries = summariesSnap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as MonthlySummary)
    .filter((summary) => summary.year === year)
    .sort((a, b) => a.month - b.month);

  const goals = goalsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as SavingsGoal);
  const debts = debtsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Debt);

  return { summaries, goals, debts };
}

export async function getBudgetItems(
  uid: string,
  year: number,
  month: number
): Promise<BudgetItem[]> {
  const snap = await adminDb().collection("users").doc(uid).collection("budgetItems").get();

  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as BudgetItem)
    .filter((item) => item.year === year && item.month === month)
    .sort((a, b) => a.category.localeCompare(b.category));
}
