"use client";

import { useState, type FormEvent } from "react";
import { sendSignInLinkToEmail } from "firebase/auth";
import { getFirebaseAuth } from "../../lib/firebase/client";

export const PENDING_EMAIL_KEY = "money-planner:pending-email";

type Status = "idle" | "loading" | "sent" | "error";

export function LoginForm({ initialError }: { initialError: string | null }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(initialError);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const auth = getFirebaseAuth();
      await sendSignInLinkToEmail(auth, email, {
        url: `${window.location.origin}/auth/callback`,
        handleCodeInApp: true,
      });
      window.localStorage.setItem(PENDING_EMAIL_KEY, email);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="auth-card">
        <h2>Check your inbox</h2>
        <p>
          We sent a sign-in link to <strong>{email}</strong>. Open it on this device to
          sign in — no password needed.
        </p>
      </div>
    );
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>Sign in</h2>
      <p>Enter your email and we will send you a sign-in link.</p>
      {initialError && status === "idle" && <p className="auth-banner">{initialError}</p>}
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
      />
      {error && <p className="form-error">{error}</p>}
      <button className="button button-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send sign-in link"}
      </button>
    </form>
  );
}
