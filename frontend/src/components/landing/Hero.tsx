"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin, PhoneCall, ShieldCheck } from "lucide-react";
import type { Board } from "@/lib/api/types";
import { PHOTOS } from "@/lib/photos";
import { pct } from "@/lib/time";
import { CountUp, Reveal } from "../motion";
import { ButtonLink } from "../ui";
import { Container } from "./shared";

/** One row of the example call card. */
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="text-[13px] text-ink/62">{label}</span>
      <span className="text-right text-[14px] font-semibold text-ink">{value}</span>
    </div>
  );
}

export function Hero({ board }: { board: Board | null }) {
  const s = board?.stats;
  return (
    <section className="relative overflow-hidden">
      {/* warm light behind the photo */}
      <div className="pointer-events-none absolute -top-48 right-[-12%] size-[720px] rounded-full bg-turmeric/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute top-[40%] left-[-18%] size-[520px] rounded-full bg-leaf/10 blur-3xl" aria-hidden />

      <Container className="relative grid items-center gap-14 pt-12 pb-24 lg:grid-cols-[1.02fr_1fr] lg:gap-16 lg:pt-20">
        <div>
          <Reveal>
            <Link
              href="/board"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-panel py-1 pr-4 pl-1 text-[14px] text-ink/78 transition-colors hover:border-leaf/40"
            >
              <span className="rounded-full bg-success px-2.5 py-0.5 text-xs font-semibold text-paper">Live</span>
              {s ? `${s.meals_rescued} meals rescued · ${s.backups_promoted} backups stepped in` : "A backup on standby before anyone drops out"}
            </Link>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="display mt-7 text-[3.2rem] text-ink sm:text-6xl lg:text-[4.5rem]">
              Leftover food, <em className="text-leaf">collected</em> before it spoils
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/72 sm:text-xl">
              A restaurant calls and says what&apos;s left, in any Indian language. AnnaRelay checks it&apos;s safe, offers it to
              the shelter most likely to show up, and keeps a backup ready before anyone drops out.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/call?role=restaurant" size="lg" className="h-14 px-7 text-base">
                <PhoneCall className="size-5" aria-hidden /> Call AnnaRelay
              </ButtonLink>
              <ButtonLink href="/recipient" variant="outline" size="lg" className="h-14 px-6 text-base">
                I run a shelter <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <dl className="mt-11 grid max-w-lg grid-cols-2 gap-8 border-t border-line pt-6">
              <div>
                <dt className="text-sm text-ink/68">Collected in the safe window</dt>
                <dd className="display mt-1 text-4xl text-ink">{s ? pct(s.share_collected_within_window) : "—"}</dd>
              </div>
              <div>
                <dt className="text-sm text-ink/68">Meals rescued</dt>
                <dd className="display mt-1 text-4xl text-ink"><CountUp value={s?.meals_rescued} /></dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-ink/55">Across finished offers, including simulated history.</p>
          </Reveal>
        </div>

        {/* the photo, with an example call and its match floating over it */}
        <Reveal delay={120} y={24} className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
          <div className="relative overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgb(30_38_32/0.55)]">
            <Image
              src={PHOTOS.kitchen.src}
              alt={PHOTOS.kitchen.alt}
              placeholder="blur"
              preload
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-[4/5] w-full object-cover object-[50%_8%]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink/35 via-transparent to-transparent" aria-hidden />
          </div>

          <div className="absolute top-6 -right-3 hidden w-[250px] rounded-2xl border border-line bg-panel p-4 sm:block lg:-right-8">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-success">
              <Check className="size-4" aria-hidden /> Matched in seconds
            </p>
            <p className="mt-2 text-[15px] font-semibold text-ink">Hope Shelter</p>
            <p className="mt-0.5 flex items-center gap-1 text-[13px] text-ink/68">
              86% reliable · <MapPin className="size-3.5" aria-hidden /> 2.4 km
            </p>
            <p className="mt-2 rounded-lg bg-mist px-2.5 py-1.5 text-[12.5px] text-ink/72">Backup on standby: Sunrise Elders Home</p>
          </div>

          <div className="absolute -bottom-10 -left-4 w-[min(372px,92%)] rounded-2xl border border-line bg-panel p-5 sm:-left-10">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-leaf">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf opacity-50" aria-hidden />
                <span className="relative inline-flex size-2.5 rounded-full bg-leaf" aria-hidden />
              </span>
              On a call · Hindi
            </p>
            <p className="mt-2.5 text-[15px] leading-snug text-ink">“तीस प्लेट वेज पुलाव बचा है, रात दस बजे तक ठीक है”</p>
            <div className="mt-3 divide-y divide-line rounded-xl bg-mist px-3 py-1">
              <Field label="Food" value="30 plates · veg pulao" />
              <Field label="Safe until" value="10:00 pm" />
              <Field label="Safety check" value={<span className="inline-flex items-center gap-1 text-success"><ShieldCheck className="size-4" aria-hidden /> said yes</span>} />
            </div>
            <p className="mt-2.5 text-xs text-ink/55">Example call</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
