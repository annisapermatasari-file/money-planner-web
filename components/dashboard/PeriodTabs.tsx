"use client";

import { usePathname, useRouter } from "next/navigation";
import { MONTH_NAMES } from "../../lib/format";

export function PeriodTabs({ selected }: { selected: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function go(period: string) {
    const params = new URLSearchParams();
    if (period !== "annual") {
      params.set("period", period);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="period-tabs">
      <button className={selected === "annual" ? "active" : ""} onClick={() => go("annual")}>
        Annual
      </button>
      {MONTH_NAMES.map((month, index) => {
        const value = String(index + 1);
        return (
          <button key={month} className={selected === value ? "active" : ""} onClick={() => go(value)}>
            {month}
          </button>
        );
      })}
    </div>
  );
}
