'use client'

import { useEffect, useState } from 'react'
import { Flame, Clock } from 'lucide-react'

interface UrgencyBarProps {
  /** Inventory quantity of the currently selected variant (for stock counter) */
  inventory?: number | null
  /** Hours from now for flash sale end (default 8) */
  saleDurationHours?: number
}

/**
 * Two-line conversion urgency bar:
 * - Top: live stock counter for the selected variant
 * - Bottom: flash-sale countdown timer
 */
export default function UrgencyBar({
  inventory,
  saleDurationHours = 8,
}: UrgencyBarProps) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    // Anchor the countdown to a per-session end time so it doesn't reset
    // on every re-render but stays consistent for the browsing session.
    const key = 'hauxly_flash_end'
    let end = Number(sessionStorage.getItem(key))
    if (!end || end < Date.now()) {
      end = Date.now() + saleDurationHours * 60 * 60 * 1000
      sessionStorage.setItem(key, String(end))
    }

    const tick = () => {
      const diff = Math.max(0, end - Date.now())
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1000)
      setTimeLeft({ h, m, s })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [saleDurationHours])

  const showStock = inventory != null && inventory > 0 && inventory <= 50

  return (
    <div className="space-y-3 rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-4">
      {/* Flash sale countdown */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Flame
            className="h-4 w-4 flex-shrink-0 text-red-600"
            strokeWidth={2.25}
          />
          <span className="text-sm font-semibold text-red-700">
            Flash sale ends in
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm font-bold tabular-nums text-red-700">
          <Clock className="h-3.5 w-3.5" strokeWidth={2.25} />
          <span className="rounded bg-white/80 px-1.5 py-0.5">
            {String(timeLeft.h).padStart(2, '0')}
          </span>
          <span>:</span>
          <span className="rounded bg-white/80 px-1.5 py-0.5">
            {String(timeLeft.m).padStart(2, '0')}
          </span>
          <span>:</span>
          <span className="rounded bg-white/80 px-1.5 py-0.5">
            {String(timeLeft.s).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Stock counter */}
      {showStock && (
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-red-700">
              Selling fast — only{' '}
              <span className="font-bold">{inventory}</span> left
            </span>
            <span className="text-red-600/70">High demand</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-red-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all"
              style={{
                width: `${Math.min(100, Math.max(8, (inventory / 50) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
