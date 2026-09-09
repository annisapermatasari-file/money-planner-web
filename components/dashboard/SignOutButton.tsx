"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button className="button button-ghost button-small" onClick={handleSignOut}>
      Sign out
    </button>
  );
}
