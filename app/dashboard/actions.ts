"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

export async function addTransaction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
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

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    category,
    description: description || null,
    amount,
    type,
    occurred_on: occurredOn,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/transactions");
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/dashboard/transactions");
}
