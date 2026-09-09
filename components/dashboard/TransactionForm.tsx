"use client";

import { useRef, useState, useTransition } from "react";
import { addTransaction } from "../../app/dashboard/actions";

export function TransactionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await addTransaction(formData);
        formRef.current?.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="panel-card transaction-form">
      <div className="form-row">
        <div>
          <label htmlFor="occurred_on">Date</label>
          <input
            id="occurred_on"
            name="occurred_on"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            required
          />
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <input id="category" name="category" type="text" placeholder="Housing, Food..." required />
        </div>
        <div>
          <label htmlFor="type">Type</label>
          <select id="type" name="type" defaultValue="expense">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input id="amount" name="amount" type="number" min="0" step="1000" required />
        </div>
        <div className="form-row-grow">
          <label htmlFor="description">Description</label>
          <input id="description" name="description" type="text" placeholder="Optional" />
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
      <button className="button button-primary" type="submit" disabled={isPending}>
        {isPending ? "Adding..." : "Add transaction"}
      </button>
    </form>
  );
}
