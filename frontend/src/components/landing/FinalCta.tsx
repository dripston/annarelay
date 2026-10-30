import Image from "next/image";
import { ArrowRight, PhoneCall } from "lucide-react";
import { PHOTOS } from "@/lib/photos";
import { ButtonLink } from "../ui";
import { Container } from "./shared";
import { Reveal } from "../motion";

export function FinalCta() {
  return (
    <section className="py-24">
      <Container>
        <Reveal y={30}>
          <div className="relative overflow-hidden rounded-[2rem]">
            <Image src={PHOTOS.meal.src} alt={PHOTOS.meal.alt} placeholder="blur" sizes="(min-width: 1240px) 1180px, 100vw" className="absolute inset-0 h-full w-full object-cover" />
            {/* dark wash so paper-coloured text reads on the photo */}
            <div className="absolute inset-0 bg-linear-to-r from-ink/90 via-ink/70 to-ink/25" aria-hidden />
            <div className="relative flex min-h-[380px] flex-col justify-end gap-8 p-8 sm:p-12">
              <h2 className="display max-w-2xl text-5xl text-paper sm:text-6xl">Ready to rescue tonight&apos;s leftovers?</h2>
              <p className="max-w-xl text-lg text-paper/85">
                One call is enough. Say what&apos;s left; the food goes to people who asked for it, before it spoils.
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/call?role=restaurant" size="lg" className="h-14 bg-turmeric px-7 text-base text-ink hover:bg-turmeric/90">
                  <PhoneCall className="size-5" aria-hidden /> Call AnnaRelay
                </ButtonLink>
                <ButtonLink href="/board" variant="outline" size="lg" className="h-14 border-paper/40 px-6 text-base text-paper hover:border-paper hover:bg-paper/10">
                  See the live board <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
