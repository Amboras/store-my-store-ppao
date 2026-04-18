'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
  Sparkles,
  Star,
  PackageCheck,
  CreditCard,
  Headphones,
} from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'
import { useProducts } from '@/hooks/use-products'
import ProductCard from '@/components/product/product-card'
import { trackMetaEvent } from '@/lib/meta-pixel'

const HERO_IMG =
  'https://images.unsplash.com/photo-1558002038-1055907df827?w=1600&q=80'
const LIFESTYLE_IMG =
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1600&q=80'

export default function HomePage() {
  const { data: collections, isLoading: collectionsLoading } = useCollections()
  const { data: productsData } = useProducts({ limit: 6 })
  const featuredProducts = productsData || []
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSent, setNewsletterSent] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    trackMetaEvent('Lead', {
      content_name: 'newsletter_signup',
      status: 'submitted',
    })
    setNewsletterSent(true)
    setNewsletterEmail('')
  }

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-[#0B0F17] text-white">
        {/* Ambient gradient orbs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-3xl" />
        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="container-custom relative grid items-center gap-12 py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-28">
          {/* Copy */}
          <div className="animate-fade-in-up space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              New Drop · Winter Collection
            </div>

            <h1 className="font-heading text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Smart gadgets for the{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                way you live now.
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Hand-picked home innovations that actually solve real problems.
              Thoughtfully designed, obsessively tested, and shipped free
              straight to your door.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                prefetch
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#0B0F17] transition-all hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.45)]"
              >
                Shop the Drop
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#featured"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
              >
                See Bestsellers
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-x-10 gap-y-5 pt-8 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="font-medium text-white">4.8/5</span>
                <span>from 12,400+ customers</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-300" strokeWidth={2} />
                <span>Free worldwide shipping</span>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 shadow-2xl lg:aspect-[3/4]">
              <Image
                src={HERO_IMG}
                alt="Hauxly smart gadgets in a modern home"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent" />
            </div>

            {/* Floating badge — bestseller */}
            <div className="absolute -left-4 top-10 hidden rounded-xl border border-white/10 bg-[#0B0F17]/80 p-4 backdrop-blur-md sm:block lg:-left-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                  <Zap className="h-5 w-5 text-emerald-300" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">
                    #1 Bestseller
                  </p>
                  <p className="text-sm font-semibold">Selling out fast</p>
                </div>
              </div>
            </div>

            {/* Floating badge — guarantee */}
            <div className="absolute -right-4 bottom-10 hidden rounded-xl border border-white/10 bg-[#0B0F17]/80 p-4 backdrop-blur-md sm:block lg:-right-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
                  <ShieldCheck
                    className="h-5 w-5 text-cyan-300"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">
                    60 Days
                  </p>
                  <p className="text-sm font-semibold">Money-back guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee-style logo bar */}
        <div className="relative border-t border-white/10 bg-black/30 py-5">
          <div className="container-custom flex flex-wrap items-center justify-between gap-6 text-xs uppercase tracking-[0.25em] text-white/50">
            <span>As seen in</span>
            <span className="font-heading text-base text-white/70">FORBES</span>
            <span className="font-heading text-base italic text-white/70">
              WIRED
            </span>
            <span className="font-heading text-base text-white/70">
              TECHCRUNCH
            </span>
            <span className="font-heading text-base text-white/70">
              THE VERGE
            </span>
            <span className="font-heading text-base text-white/70">
              GIZMODO
            </span>
          </div>
        </div>
      </section>

      {/* ===================== VALUE PROPS ===================== */}
      <section className="border-b bg-background py-12">
        <div className="container-custom grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            {
              icon: Truck,
              title: 'Free Shipping',
              sub: 'On every order',
            },
            {
              icon: PackageCheck,
              title: '60-Day Returns',
              sub: 'No questions asked',
            },
            {
              icon: CreditCard,
              title: 'Secure Checkout',
              sub: '256-bit SSL',
            },
            {
              icon: Headphones,
              title: '24/7 Support',
              sub: 'Real humans, always',
            },
          ].map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="flex items-center gap-3 md:flex-col md:items-center md:text-center md:gap-2"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== FEATURED PRODUCTS ===================== */}
      <section id="featured" className="py-section">
        <div className="container-custom">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">
                Bestsellers
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                The gadgets everyone is talking about.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Every product is rigorously tested in our lab before we ship it.
                If it doesn&apos;t wow us, it doesn&apos;t make the cut.
              </p>
            </div>
            <Link
              href="/products"
              prefetch
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground link-underline pb-0.5"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.length > 0
              ? featuredProducts
                  .slice(0, 6)
                  .map((p: any) => <ProductCard key={p.id} product={p} />)
              : [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] animate-pulse rounded bg-muted"
                  />
                ))}
          </div>
        </div>
      </section>

      {/* ===================== COLLECTIONS ===================== */}
      {!collectionsLoading && collections && collections.length > 0 && (
        <>
          {collections.map((collection: any, index: number) => (
            <CollectionSection
              key={collection.id}
              collection={collection}
              alternate={index % 2 === 1}
            />
          ))}
        </>
      )}

      {/* ===================== WHY HAUXLY ===================== */}
      <section className="bg-muted/40 py-section">
        <div className="container-custom grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src={LIFESTYLE_IMG}
              alt="Smart home lifestyle"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent" />
            {/* Overlay stat card */}
            <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/10 bg-black/50 p-5 backdrop-blur-md sm:right-auto sm:w-[18rem]">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                Over 50,000 happy homes
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                &ldquo;Hauxly genuinely upgraded my morning routine.&rdquo;
              </p>
              <p className="mt-2 text-sm text-white/70">— Sarah K., verified buyer</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">
                Why Hauxly
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                We obsess over the details so you don&apos;t have to.
              </h2>
            </div>

            <ul className="space-y-6">
              {[
                {
                  title: 'Curated, not cluttered',
                  body: 'We test 100+ products a month and keep only the ones that genuinely make life easier.',
                },
                {
                  title: 'Premium feel, fair price',
                  body: 'No markup madness. We cut out the middlemen so you get flagship quality at half the cost.',
                },
                {
                  title: 'Ships fast, worldwide',
                  body: 'Order today, most items leave our warehouse within 24 hours. Tracked, insured, on us.',
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                    <Sparkles className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide link-underline pb-0.5"
            >
              Our Story
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="py-section">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">
              Loved by 50k+
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Don&apos;t just take our word for it.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  'I was skeptical about dropshipping stores, but Hauxly completely changed my mind. Quality feels premium.',
                name: 'Marcus T.',
                role: 'Verified Buyer',
              },
              {
                quote:
                  'Honestly the fastest shipping I&apos;ve ever had. Ordered Monday, arrived Wednesday. 10/10.',
                name: 'Priya R.',
                role: 'Verified Buyer',
              },
              {
                quote:
                  'Finally, smart home stuff that isn&apos;t ugly. My apartment has never looked this clean.',
                name: 'Jordan L.',
                role: 'Verified Buyer',
              },
            ].map((t, i) => (
              <figure
                key={i}
                className="rounded-2xl border bg-background p-6 shadow-sm"
              >
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <blockquote
                  className="mt-4 text-sm leading-relaxed text-foreground"
                  dangerouslySetInnerHTML={{ __html: `&ldquo;${t.quote}&rdquo;` }}
                />
                <figcaption className="mt-6 text-sm">
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-muted-foreground"> · {t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== NEWSLETTER ===================== */}
      <section className="relative overflow-hidden bg-[#0B0F17] py-section text-white">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="container-custom relative mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            Exclusive offer
          </div>
          <h2 className="mt-6 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Get 10% off your first order.
          </h2>
          <p className="mt-3 text-white/70">
            Join 50,000+ subscribers for early access to product drops and
            subscriber-only deals.
          </p>

          {newsletterSent ? (
            <p className="mt-8 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-6 py-3 text-sm text-emerald-300">
              Thanks! Check your inbox for your 10% off code.
            </p>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:bg-white/10 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#0B0F17] transition-all hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.45)]"
              >
                Claim 10% off
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-white/40">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  )
}
