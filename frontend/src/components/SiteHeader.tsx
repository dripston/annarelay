"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhoneCall } from "lucide-react";
import { API_MODE } from "@/lib/api/client";
import { useHealth } from "./providers";
import { Wordmark } from "./Logo";
import { ButtonLink, cx } from "./ui";

const NAV = [
  { href: "/call", label: "Call" },
  { href: "/board", label: "Live board" },
  { href: "/#how", label: "How it works" },
] as const;

const WORD: Record<string, string> = {
  ready: "ready", mock: "mock", missing_key: "no key", unavailable: "off",
};

/** "Language model ready · Laya off", straight from GET /api/health. Shown in the footer, not the header. */
export function AiStatusPill({ className }: { className?: string }) {
  const { health, error } = useHealth();
  const dot = (s: string | undefined) => (s === "ready" ? "bg-success" : s === "mock" ? "border border-ink/50" : "bg-ink/30");
  if (error && !health) {
    return (
      <span className={cx("inline-flex items-center gap-1.5 text-xs text-ink/68", className)}>
        <span className="size-1.5 rounded-full bg-saffron" aria-hidden />
        Server offline
      </span>
    );
  }
  return (
    <span className={cx("inline-flex shrink-0 items-center gap-3 text-xs text-ink/68", className)} title="AI status reported by the backend">
      {health ? (
        <>
          <span className="inline-flex items-center gap-1.5">
            <span className={cx("size-1.5 rounded-full", dot(health.llm))} aria-hidden />
            Language model {WORD[health.llm] ?? health.llm}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className={cx("size-1.5 rounded-full", dot(health.laya))} aria-hidden />
            Laya {WORD[health.laya] ?? health.laya}
          </span>
        </>
      ) : (
        <span>Checking AI…</span>
      )}
    </span>
  );
}

function ModeBadge() {
  if (API_MODE === "live") return null;
  return (
    <span
      className="block rounded-full bg-turmeric/30 px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-ink"
      title={API_MODE === "mock" ? "Running on the in-browser mock backend" : "Some endpoint groups use the mock backend"}
    >
      {API_MODE === "mock" ? "Demo data" : "Partly demo data"}
    </span>
  );
}

function NavItems({ path, mobile }: { path: string | null; mobile?: boolean }) {
  return (
    <>
      {NAV.map(({ href, label }) => {
        const active = !!path && !href.includes("#") && (path === href || path.startsWith(`${href}/`));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cx(
              "rounded-full text-[15px] font-medium transition-colors",
              mobile ? "shrink-0 px-3 py-1.5" : "px-4 py-2",
              active ? "bg-ink/[0.07] text-ink" : "text-ink/72 hover:text-ink",
            )}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}

/** Reads the URL, so it streams in after prerendering (dynamic routes). */
function ActiveNav({ mobile }: { mobile?: boolean }) {
  return <NavItems path={usePathname()} mobile={mobile} />;
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto grid h-[68px] max-w-[1240px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 lg:px-8">
        <Link href="/" className="justify-self-start rounded-lg" aria-label="AnnaRelay home">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          <Suspense fallback={<NavItems path={null} />}>
            <ActiveNav />
          </Suspense>
        </nav>

        <div className="col-start-3 flex items-center justify-self-end gap-2">
          <span className="hidden sm:block"><ModeBadge /></span>
          <Link href="/recipient" className="hidden rounded-full px-4 py-2 text-[15px] font-medium text-ink/78 transition-colors hover:text-ink lg:block">
            I need food
          </Link>
          <ButtonLink href="/call?role=restaurant" size="sm" className="h-10 px-4 text-[14px]">
            <PhoneCall className="size-4" aria-hidden /> I have food
          </ButtonLink>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-line/80 px-3 py-2 md:hidden" aria-label="Main">
        <Suspense fallback={<NavItems path={null} mobile />}>
          <ActiveNav mobile />
        </Suspense>
        <Link href="/recipient" className="shrink-0 rounded-full px-3 py-1.5 text-[15px] font-medium text-ink/72">I need food</Link>
        <span className="ml-auto shrink-0 self-center sm:hidden"><ModeBadge /></span>
      </nav>
    </header>
  );
}
