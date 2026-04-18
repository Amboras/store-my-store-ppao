'use client'

import { Check, Sparkles } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format-price'

interface BundleOption {
  id: string
  value: string
  amount: number
  compareAt: number | null
  currency: string
  soldOut: boolean
}

interface BundlePickerProps {
  options: BundleOption[]
  selectedValue: string | undefined
  onSelect: (value: string) => void
}

/**
 * Conversion-optimized pack selector.
 * Renders each pack option as a tappable card with savings % and
 * "Most Popular" / "Best Value" badges.
 */
export default function BundlePicker({
  options,
  selectedValue,
  onSelect,
}: BundlePickerProps) {
  if (options.length === 0) return null

  // Find the highest-savings pack for "Best Value" badge
  const withSavings = options.map((o) => {
    const savings =
      o.compareAt && o.compareAt > o.amount
        ? Math.round(((o.compareAt - o.amount) / o.compareAt) * 100)
        : 0
    return { ...o, savings }
  })

  const bestValueIdx = withSavings.reduce(
    (best, o, i) => (o.savings > withSavings[best].savings ? i : best),
    0,
  )
  // Middle option is "Most Popular" by convention
  const popularIdx = options.length >= 3 ? 1 : -1

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest">
          Choose your pack
        </h3>
        <span className="text-xs text-muted-foreground">
          Bigger pack = bigger save
        </span>
      </div>

      <div className="space-y-3">
        {withSavings.map((opt, idx) => {
          const isSelected = selectedValue === opt.value
          const isBestValue = idx === bestValueIdx && opt.savings > 0
          const isPopular = idx === popularIdx

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => !opt.soldOut && onSelect(opt.value)}
              disabled={opt.soldOut}
              className={`relative flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]'
                  : opt.soldOut
                  ? 'cursor-not-allowed border-border bg-muted/40 opacity-60'
                  : 'border-border bg-background hover:border-foreground/40'
              }`}
            >
              {/* Badge */}
              {isBestValue && (
                <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  <Sparkles className="h-2.5 w-2.5" />
                  Best Value
                </span>
              )}
              {isPopular && !isBestValue && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background shadow-sm">
                  Most Popular
                </span>
              )}

              {/* Radio */}
              <div
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-muted-foreground/40'
                }`}
              >
                {isSelected && (
                  <Check
                    className="h-3 w-3 text-white"
                    strokeWidth={3}
                  />
                )}
              </div>

              {/* Label + savings */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">{opt.value}</span>
                  {opt.savings > 0 && (
                    <span className="rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-bold text-red-600">
                      SAVE {opt.savings}%
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {opt.value === 'Single'
                    ? '1 unit · perfect for yourself'
                    : opt.value === 'Duo Pack'
                    ? '2 units · 1 to keep, 1 to gift'
                    : opt.value === 'Trio Pack'
                    ? '3 units · stock up & save most'
                    : ''}
                </p>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-lg font-bold tabular-nums">
                  {formatPrice(opt.amount, opt.currency)}
                </div>
                {opt.compareAt && opt.compareAt > opt.amount && (
                  <div className="text-xs text-muted-foreground line-through tabular-nums">
                    {formatPrice(opt.compareAt, opt.currency)}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
