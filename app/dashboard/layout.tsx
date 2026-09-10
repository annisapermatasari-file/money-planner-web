import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import { SignOutButton } from "../../components/dashboard/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
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
          <span>{session.email}</span>
          <SignOutButton />
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
