"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../../lib/firebase/admin";
import { getSession } from "../../lib/session";

export async function addTransaction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const type = String(formData.get("type") ?? "expense") as "income" | "expense";
  const occurredOn = String(formData.get("occurred_on") ?? new Date().toISOString().slice(0, 10));

  if (!category || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("Enter a category and a positive amount.");
  }

  await adminDb()
    .collection("users")
    .doc(session.uid)
    .collection("transactions")
    .add({
      category,
      description: description || null,
      amount,
      type,
      occurredOn,
      createdAt: FieldValue.serverTimestamp(),
    });

  revalidatePath("/dashboard/transactions");
}

export async function deleteTransaction(id: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  await adminDb()
    .collection("users")
    .doc(session.uid)
    .collection("transactions")
    .doc(id)
    .delete();

  revalidatePath("/dashboard/transactions");
}
