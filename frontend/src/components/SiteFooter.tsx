"use client";

import Link from "next/link";
import { api } from "@/lib/api/client";
import { PHOTOS } from "@/lib/photos";
import { usePoll } from "@/lib/usePoll";
import { Wordmark } from "./Logo";
import { AiStatusPill } from "./SiteHeader";

const COLUMNS = [
  { title: "Use AnnaRelay", links: [["Call AnnaRelay", "/call"], ["I have leftover food", "/restaurant"], ["I need food", "/recipient"], ["Live board", "/board"]] },
  { title: "How it works", links: [["The relay", "/#how"], ["Who gets the food", "/#reliability"], ["Backups", "/#network"], ["Try it as a judge", "/judge"]] },
] as const;

export function SiteFooter() {
  const { data } = usePoll(() => api.board(), 15000);
  return (
    <footer className="mt-16 border-t border-line bg-cream">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 pt-16 pb-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-ink/72">
            Leftover food, matched to people who need it, collected before it spoils. Anna (अन्न) means food.
          </p>
          <AiStatusPill className="mt-5" />
        </div>
        {COLUMNS.map((c) => (
          <div key={c.title}>
            <p className="text-[15px] font-semibold text-ink">{c.title}</p>
            <ul className="mt-4 space-y-3">
              {c.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-[15px] text-ink/72 transition-colors hover:text-leaf">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="text-[15px] font-semibold text-ink">Honesty</p>
          <ul className="mt-4 space-y-3 text-[15px] text-ink/72">
            <li>Seeded homes and history are simulated</li>
            <li>Every AI answer shows its source</li>
            <li>One metric, no inflated claims</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-3 border-t border-line px-5 py-6 text-sm text-ink/68 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="tabular font-semibold text-ink">{data ? data.stats.meals_rescued.toLocaleString("en-IN") : "—"}</span> meals rescued so far
            <span className="text-ink/55"> · includes simulated history</span>
          </p>
          <p>Built for Promptverse</p>
        </div>
        <p className="text-xs text-ink/55">
          Photos via Wikimedia Commons:{" "}
          {Object.values(PHOTOS).map((p, i) => (
            <span key={p.credit.url}>
              {i ? " · " : ""}
              <a href={p.credit.url} className="underline decoration-ink/20 underline-offset-2 hover:text-ink" target="_blank" rel="noreferrer">
                {p.credit.author}
              </a>{" "}
              ({p.credit.license})
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
