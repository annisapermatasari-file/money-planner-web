import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { SignOutButton } from "../../components/dashboard/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="brand">Ultimate
          <br />
          Money Planner
        </div>
        <nav>
          <Link href="/dashboard">Overview</Link>
          <Link href="/dashboard/transactions">Transactions</Link>
        </nav>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <span>{user.email}</span>
          <SignOutButton />
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
