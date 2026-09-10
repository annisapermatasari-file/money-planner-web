import Link from "next/link";
import { getSession } from "../lib/session";

const FEATURES = [
  "All-in-one finance tracker",
  "Monthly & annual overviews",
  "Reach your financial goals",
  "A clearer, calmer you",
];

export default async function HomePage() {
  const session = await getSession();

  return (
    <main className="landing">
      <section className="landing-panel">
        <p className="eyebrow">Ultimate Money Planner</p>
        <h1>Plan Today for a Brighter Tomorrow</h1>
        <p className="lede">
          Budget, track, save, pay off debt, and build wealth — all in one calm,
          private dashboard.
        </p>
        <ul className="landing-features">
          {FEATURES.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <Link className="button button-primary" href={session ? "/dashboard" : "/login"}>
          {session ? "Go to dashboard" : "Get started"}
        </Link>
      </section>
    </main>
  );
}
