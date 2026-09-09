import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { LoginForm } from "../../components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-shell">
      <LoginForm
        initialError={
          error ? "That sign-in link is invalid or has expired. Please try again." : null
        }
      />
    </main>
  );
}
