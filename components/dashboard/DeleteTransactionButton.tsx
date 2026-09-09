"use client";

import { useTransition } from "react";
import { deleteTransaction } from "../../app/dashboard/actions";

export function DeleteTransactionButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="button button-ghost button-small"
      disabled={isPending}
      onClick={() => startTransition(() => deleteTransaction(id))}
    >
      Delete
    </button>
  );
}
