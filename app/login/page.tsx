import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import { LoginForm } from "../../components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const session = await getSession();

  if (session) {
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
