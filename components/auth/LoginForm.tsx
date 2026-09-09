"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "../../lib/supabase/client";

type Status = "idle" | "loading" | "sent" | "error";

export function LoginForm({ initialError }: { initialError: string | null }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(initialError);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signInError) {
      setStatus("error");
      setError(signInError.message);
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="auth-card">
        <h2>Check your inbox</h2>
        <p>
          We sent a magic link to <strong>{email}</strong>. Open it on this device to
          sign in — no password needed.
        </p>
      </div>
    );
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>Sign in</h2>
      <p>Enter your email and we will send you a magic link.</p>
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
        {status === "loading" ? "Sending..." : "Send magic link"}
      </button>
    </form>
  );
}
