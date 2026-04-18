import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Award,
  Headphones,
} from 'lucide-react'

const badges = [
  {
    icon: ShieldCheck,
    title: '60-Day Guarantee',
    sub: 'Love it or your money back — no questions asked.',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    sub: 'On every order, worldwide. Ships in 24 hours.',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    sub: 'Free return shipping, prepaid label included.',
  },
  {
    icon: Lock,
    title: 'Secure Checkout',
    sub: '256-bit SSL · Visa, Mastercard, Amex, Apple Pay.',
  },
]

export default function TrustBadges() {
  return (
    <div className="space-y-4">
      {/* Headline badge */}
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Award className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-emerald-900">
            Trusted by 50,000+ happy homes
          </p>
          <p className="mt-0.5 text-xs text-emerald-800/80">
            Join thousands of customers who upgraded their daily rituals with
            Hauxly.
          </p>
        </div>
      </div>

      {/* Grid of 4 */}
      <div className="grid grid-cols-2 gap-3">
        {badges.map((b) => (
          <div
            key={b.title}
            className="rounded-lg border bg-background p-3"
          >
            <div className="flex items-center gap-2">
              <b.icon
                className="h-4 w-4 flex-shrink-0 text-emerald-600"
                strokeWidth={2}
              />
              <p className="text-xs font-semibold">{b.title}</p>
            </div>
            <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
              {b.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Payment + support row */}
      <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Headphones className="h-4 w-4 text-foreground" strokeWidth={2} />
          <span>
            <span className="font-semibold text-foreground">24/7 support</span>{' '}
            · Real humans, always
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="rounded bg-white px-2 py-1 shadow-sm">VISA</span>
          <span className="rounded bg-white px-2 py-1 shadow-sm">MC</span>
          <span className="rounded bg-white px-2 py-1 shadow-sm">AMEX</span>
          <span className="rounded bg-white px-2 py-1 shadow-sm">APPLE</span>
        </div>
      </div>
    </div>
  )
}
