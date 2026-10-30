"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { FlaskConical, LoaderCircle, RefreshCw, TriangleAlert } from "lucide-react";
import { errorMessage } from "@/lib/api/types";
import { cx } from "@/lib/cx";

export { cx };

type Variant = "primary" | "secondary" | "outline" | "quiet" | "onDark";
type Size = "sm" | "md" | "lg";

// pill buttons with a hairline top highlight, as in the reference
const VARIANT: Record<Variant, string> = {
  // the main call to action: deep leaf green with paper text
  primary: "bg-forest text-paper shadow-[0_8px_20px_-10px_rgb(20_83_47/0.6)] hover:bg-forest/90 active:bg-forest/80",
  // ink pill for confirmations inside the app
  secondary: "bg-ink text-paper hover:bg-ink/90 active:bg-ink/80",
  // light pill on a card or the page (the name is from the old dark theme)
  onDark: "border border-line bg-panel text-ink hover:border-ink/25 hover:bg-mist",
  outline: "border border-ink/15 text-ink hover:border-ink/35 hover:bg-ink/5",
  quiet: "text-ink/78 hover:bg-ink/5 hover:text-ink",
};

const SIZE: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-3.5 text-[13px]",
  md: "h-10 gap-2 px-5 text-sm",
  lg: "h-12 gap-2.5 px-6 text-[15px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra?: string): string {
  return cx(
    "inline-flex select-none items-center justify-center rounded-full font-medium whitespace-nowrap transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-40",
    VARIANT[variant], SIZE[size], extra,
  );
}

export function Button({
  variant = "primary", size = "md", busy = false, className, children, disabled, ...rest
}: ComponentProps<"button"> & { variant?: Variant; size?: Size; busy?: boolean }) {
  return (
    <button {...rest} disabled={disabled || busy} aria-busy={busy || undefined} className={buttonClass(variant, size, className)}>
      {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary", size = "md", className, ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link {...rest} className={buttonClass(variant, size, className)} />;
}

export function Card({ className, children, ...rest }: ComponentProps<"div">) {
  return (
    <div {...rest} className={cx("rounded-card border border-line bg-panel", className)}>
      {children}
    </div>
  );
}

/** Small label with an icon chip, like "Global network" in the reference. */
export function Eyebrow({ children, icon, className }: { children: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <p className={cx("inline-flex items-center gap-2 text-sm font-medium text-leaf", className)}>
      {icon ? (
        <span className="flex size-6 items-center justify-center rounded-md bg-leaf/15 text-leaf [&>svg]:size-3.5">{icon}</span>
      ) : null}
      {children}
    </p>
  );
}

export function PageHeader({
  eyebrow, icon, title, description, actions,
}: { eyebrow?: ReactNode; icon?: ReactNode; title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="min-w-0">
        {eyebrow ? <Eyebrow icon={icon}>{eyebrow}</Eyebrow> : null}
        <h1 className="display mt-4 text-4xl text-ink sm:text-5xl">{title}</h1>
        {description ? <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/72 sm:text-lg">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/** Seeded or simulated data must always say so. */
export function SimulatedBadge({ className, label = "Simulated" }: { className?: string; label?: string }) {
  return (
    <span
      title="Seeded demo data, not real-world records"
      className={cx(
        "inline-flex items-center gap-1 rounded-full border border-dashed border-ink/25 px-2 py-0.5",
        "text-[11px] font-medium tracking-wide text-ink/72",
        className,
      )}
    >
      <FlaskConical className="size-3" aria-hidden />
      {label}
    </span>
  );
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink/68" role="status">
      <LoaderCircle className="size-4 animate-spin" aria-hidden />
      {label}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("animate-pulse rounded-2xl bg-ink/[0.05]", className)} aria-hidden />;
}

export function LoadingBlock({ label = "Loading", rows = 3 }: { label?: string; rows?: number }) {
  return (
    <div className="space-y-3" aria-busy>
      <Spinner label={label} />
      {Array.from({ length: rows }, (_, i) => <Skeleton key={i} className="h-20" />)}
    </div>
  );
}

export function EmptyState({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-ink/15 px-6 py-12 text-center">
      {icon ? <div className="mb-4 text-leaf">{icon}</div> : null}
      <p className="text-base font-medium text-ink">{title}</p>
      {children ? <div className="mt-1.5 max-w-sm text-sm text-ink/68">{children}</div> : null}
    </div>
  );
}

export function ErrorState({ error, onRetry, compact }: { error: unknown; onRetry?: () => void; compact?: boolean }) {
  return (
    <div
      role="alert"
      className={cx(
        "flex items-start gap-3 rounded-2xl border border-saffron/60 bg-saffron/[0.06] text-ink",
        compact ? "p-3 text-sm" : "p-4",
      )}
    >
      <TriangleAlert className="mt-0.5 size-5 shrink-0 text-saffron" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-medium">Couldn&apos;t load this</p>
        <p className="text-ink/72">{errorMessage(error)}</p>
      </div>
      {onRetry ? (
        <Button variant="onDark" size="sm" onClick={onRetry}>
          <RefreshCw className="size-3.5" aria-hidden />
          Retry
        </Button>
      ) : null}
    </div>
  );
}

/** Inline field-level label used in forms. */
export function FieldLabel({ children, htmlFor, missing }: { children: ReactNode; htmlFor?: string; missing?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-center gap-2 text-sm font-medium text-ink/85">
      {children}
      {missing ? (
        <span className="rounded-full bg-saffron px-2 py-px text-[11px] font-semibold tracking-wide text-paper">Missing</span>
      ) : null}
    </label>
  );
}

/** Input styling without a width, for inputs sized by their flex/grid parent. */
export const inputBase = cx(
  "rounded-xl border border-line bg-ink/[0.03] px-4 py-2.5 text-ink placeholder:text-ink/30",
  "outline-none transition-colors focus:border-leaf/60 focus:bg-ink/[0.05] focus:ring-2 focus:ring-leaf/15",
  "disabled:opacity-50",
);

export const inputClass = `${inputBase} w-full`;

export function missingRing(missing: boolean): string {
  return missing ? "border-saffron! ring-2 ring-saffron/25" : "";
}
