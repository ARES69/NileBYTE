import { Intro } from '@/components/Intro'
import { Hero } from '@/components/Hero'
import { OrderBar } from '@/components/OrderBar'
import { Consent } from '@/components/Consent'

/**
 * Home page — section order follows SPEC.md §5 exactly:
 * hero → marquee → one cup → meet the bites → build your cup → sauces →
 * born by the nile → tourists → locations → feed → packaging (+QR) →
 * franchise → nile club → cta → footer.
 *
 * Each section below is a server component pulling from Sanity;
 * interactive islands (Builder, Map, Feed rail) are client components.
 * Visual/behavioral spec per section: SPEC.md §5.1–5.15, motion: src/lib/motion.ts.
 */
export default function HomePage() {
  return (
    <>
      <Intro />
      <main id="top">
        <Hero />
        {/* TODO §5.2  <MarqueeStrip items={['DUMPLINGS','SAUCES','STREET FOOD']} tone="terra" /> */}
        {/* TODO §5.3  <CupSection />            — orbit ingredients + arch photo */}
        {/* TODO §5.4  <Bites />                 — CMS products, filters, allergens, kcal */}
        {/* TODO §5.5  <Builder />               — client island: cup svg + quote + ADD TO ORDER → /order */}
        {/* TODO §5.6  <Sauces />                — giant type + 4 bottles */}
        {/* TODO §5.7  <BornByTheNile />         — parallax photo + stats */}
        {/* TODO §5.8  <Tourists />              — founder photo + partners talabat/elmenus */}
        {/* TODO §5.9  <Locations />             — SVG map + store card (CMS stores) */}
        {/* TODO §5.10 <FeedRail />              — CMS socialClips, 9:16, tap-to-play */}
        {/* TODO §5.11 <Packaging />             — board + NILE SYSTEM + QR block */}
        {/* TODO §5.12 <Franchise />             — WHAT YOU GET, scale, FAQ, deck gate → /api/deck */}
        {/* TODO §5.13 <Club />                  — JOIN onboarding (OTP), referral */}
        {/* TODO §5.14 <CtaBand />               — TASTE THE NILE. */}
      </main>
      {/* TODO §5.15 <Footer /> */}
      <OrderBar />
      <Consent />
    </>
  )
}
