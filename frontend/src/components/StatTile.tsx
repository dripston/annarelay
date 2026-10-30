import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function StatTile({
  label, value, sub, icon, hero = false, className,
}: { label: string; value: ReactNode; sub?: ReactNode; icon?: ReactNode; hero?: boolean; className?: string }) {
  return (
    <div
      className={cx(
        "flex min-w-0 flex-col justify-between rounded-card border p-5",
        hero ? "border-leaf/25 bg-leaf/[0.07] text-ink" : "border-line bg-panel text-ink",
        className,
      )}
    >
      <p className={cx("flex items-center gap-2 text-sm", hero ? "text-leaf" : "text-ink/68")}>
        {icon}
        {label}
      </p>
      <p className={cx("tabular display mt-4", hero ? "text-7xl sm:text-8xl" : "text-4xl")}>{value}</p>
      {sub ? <p className={cx("mt-2 text-sm", hero ? "text-ink/72" : "text-ink/62")}>{sub}</p> : null}
    </div>
  );
}
