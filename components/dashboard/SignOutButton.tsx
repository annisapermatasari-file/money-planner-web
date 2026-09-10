"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "../../lib/firebase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut(getFirebaseAuth());
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button className="button button-ghost button-small" onClick={handleSignOut}>
      Sign out
    </button>
  );
}
