"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { getFirebaseAuth } from "../../../lib/firebase/client";
import { PENDING_EMAIL_KEY } from "../../../components/auth/LoginForm";

type Status = "working" | "need-email" | "error";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("working");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    completeSignIn(window.localStorage.getItem(PENDING_EMAIL_KEY));
    // Only run once on mount; completeSignIn reads fresh state via closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function completeSignIn(storedEmail: string | null) {
    const auth = getFirebaseAuth();
    const href = window.location.href;

    if (!isSignInWithEmailLink(auth, href)) {
      setStatus("error");
      setError("That sign-in link is invalid or has expired.");
      return;
    }

    if (!storedEmail) {
      setStatus("need-email");
      return;
    }

    try {
      const credential = await signInWithEmailLink(auth, storedEmail, href);
      window.localStorage.removeItem(PENDING_EMAIL_KEY);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("Could not start your session. Please try again.");
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    }
  }

  function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("working");
    void completeSignIn(email);
  }

  if (status === "need-email") {
    return (
      <main className="auth-shell">
        <form className="auth-card" onSubmit={handleEmailSubmit}>
          <h2>Confirm your email</h2>
          <p>
            You opened this sign-in link on a different device or browser. Enter your
            email to finish signing in.
          </p>
          <label htmlFor="confirm-email">Email</label>
          <input
            id="confirm-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
          <button className="button button-primary" type="submit">
            Continue
          </button>
        </form>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="auth-shell">
        <div className="auth-card">
          <h2>Sign-in failed</h2>
          <p>{error}</p>
          <a className="button button-primary" href="/login">
            Back to sign in
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <h2>Signing you in…</h2>
        <p>Just a moment.</p>
      </div>
    </main>
  );
}
