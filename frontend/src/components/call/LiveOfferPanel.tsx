"use client";

// After the call creates an offer: follow it live over /api/stream. Assignments pop in one by one,
// timeline events animate in, and the safe-window countdown runs, all on the call screen.
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Radio } from "lucide-react";
import { normalizeOffer } from "@/lib/api/live";
import type { OfferDetail } from "@/lib/api/types";
import { useStreamEvent } from "@/lib/stream";
import { pct } from "@/lib/time";
import { Countdown } from "@/components/Countdown";
import { DietTag, dishNames } from "@/components/OfferCard";
import { StatusChip } from "@/components/StatusChip";
import { Timeline } from "@/components/Timeline";
import { cx } from "@/components/ui";

export function LiveOfferPanel({ initial }: { initial: OfferDetail }) {
  const [offer, setOffer] = useState(initial);
  useStreamEvent<{ offer: OfferDetail }>("offer", (d) => {
    if (d.offer.id === initial.id) setOffer(normalizeOffer(d.offer));
  });
  const primaries = offer.assignments.filter((a) => !a.is_standby);
  const standbys = offer.assignments.filter((a) => a.is_standby);

  return (
    <div className="animate-pop space-y-4">
      <div className="relative overflow-hidden rounded-card border border-success/40 bg-raised p-5 sm:p-6">
        <div className="pointer-events-none absolute -top-20 -left-20 size-56 rounded-full bg-success/15 blur-3xl" aria-hidden />
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[13px] text-success font-semibold">
              <Radio className="size-3.5" aria-hidden /> Live offer · {offer.restaurant_name}
            </p>
            <h2 className="display mt-2 text-3xl text-ink sm:text-4xl">{offer.meal_count} plates · {dishNames(offer)}</h2>
            <div className="mt-2 flex items-center gap-2"><DietTag diet={offer.diet} /><StatusChip kind="offer" status={offer.status} /></div>
          </div>
          <Countdown to={offer.safe_until} label="Safe for" size="lg" />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-[13px] text-ink/68 font-semibold">Matched by reliability</h3>
        {primaries.length ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {[...primaries, ...standbys].map((a, i) => (
              <li
                key={a.id}
                className={cx("animate-enter rounded-2xl border bg-panel p-4", a.is_standby ? "border-saffron/50" : "border-line")}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-ink">{a.recipient_name}{a.is_standby ? <span className="ml-2 text-[13px] text-saffron font-semibold">backup</span> : null}</p>
                  <StatusChip kind="assignment" status={a.status} />
                </div>
                <p className="mt-1 text-[14px] text-ink/78">
                  {a.meals} meals · <span className="tabular">{pct(a.reliability_at_assignment)}</span> reliable · <MapPin className="inline size-3.5 align-[-2px]" aria-hidden /> {a.distance_km} km
                </p>
                <p className="mt-2 text-[13px] leading-snug text-ink/68">{a.selection.reason}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-line px-4 py-3 text-sm text-ink/72">Looking for a shelter that needs this…</p>
        )}
      </div>

      <div className="rounded-card border border-line bg-panel p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[13px] text-ink/68 font-semibold">Every decision, as it happens</h3>
          <Link href={`/offers/${offer.id}`} className="flex items-center gap-1 text-sm font-semibold text-leaf">Full timeline <ArrowUpRight className="size-3.5" aria-hidden /></Link>
        </div>
        <Timeline events={offer.timeline.slice(-6)} />
      </div>
    </div>
  );
}
