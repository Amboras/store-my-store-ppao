'use client'

import { useMemo, useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Minus, Plus, Check, Loader2, ShoppingBag, Lock } from 'lucide-react'
import { toast } from 'sonner'
import ProductPrice, { type VariantExtension } from './product-price'
import BundlePicker from './bundle-picker'
import UrgencyBar from './urgency-bar'
import { trackAddToCart } from '@/lib/analytics'
import { trackMetaEvent, toMetaCurrencyValue } from '@/lib/meta-pixel'
import type { Product } from '@/types'

interface ProductActionsProps {
  product: Product
  variantExtensions?: Record<string, VariantExtension>
}

interface VariantOption {
  option_id?: string
  option?: { id: string }
  value: string
}

interface ProductVariantWithPrice {
  id: string
  options?: VariantOption[]
  calculated_price?: {
    calculated_amount?: number
    currency_code?: string
  } | number
  [key: string]: unknown
}

interface ProductOptionValue {
  id?: string
  value: string
}

interface ProductOptionWithValues {
  id: string
  title: string
  values?: (string | ProductOptionValue)[]
}

// Helper: extract price amount from calculated_price object
function getVariantPriceAmount(variant: ProductVariantWithPrice | undefined): number | null {
  const cp = variant?.calculated_price
  if (!cp) return null
  return typeof cp === 'number' ? cp : cp.calculated_amount ?? null
}

export default function ProductActions({ product, variantExtensions }: ProductActionsProps) {
  const variants = useMemo(
    () => (product.variants || []) as unknown as ProductVariantWithPrice[],
    [product.variants],
  )
  const options = useMemo(() => product.options || [], [product.options])

  // Track selected value per option
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    const firstVariant = variants[0]
    if (firstVariant?.options) {
      for (const opt of firstVariant.options) {
        const optionId = opt.option_id || opt.option?.id
        if (optionId && opt.value) {
          defaults[optionId] = opt.value
        }
      }
    }
    return defaults
  })

  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, isAddingItem } = useCart()

  // Find variant matching all selected options
  const selectedVariant = useMemo(() => {
    if (variants.length <= 1) return variants[0]

    return variants.find((v: ProductVariantWithPrice) => {
      if (!v.options) return false
      return v.options.every((opt: VariantOption) => {
        const optionId = opt.option_id || opt.option?.id
        if (!optionId) return false
        return selectedOptions[optionId] === opt.value
      })
    }) || variants[0]
  }, [variants, selectedOptions])

  const ext = selectedVariant?.id ? variantExtensions?.[selectedVariant.id] : null
  const currentPriceCents = getVariantPriceAmount(selectedVariant)
  const cp = selectedVariant?.calculated_price
  const currency = (cp && typeof cp !== 'number' ? cp.currency_code : undefined) || 'usd'

  const allowBackorder = ext?.allow_backorder ?? false
  const inventoryQuantity = ext?.inventory_quantity
  const isOutOfStock = !allowBackorder && inventoryQuantity != null && inventoryQuantity <= 0
  const isLowStock = inventoryQuantity != null && inventoryQuantity > 0 && inventoryQuantity < 10

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }))
    setQuantity(1)
  }

  const handleAddToCart = () => {
    if (!selectedVariant?.id || isOutOfStock) return

    addItem(
      { variantId: selectedVariant.id, quantity },
      {
        onSuccess: () => {
          setJustAdded(true)
          toast.success('Added to bag')
          const metaValue = toMetaCurrencyValue(currentPriceCents)
          trackAddToCart(product?.id || '', selectedVariant.id, quantity, currentPriceCents ?? undefined)
          trackMetaEvent('AddToCart', {
            content_ids: [selectedVariant.id],
            content_type: 'product',
            content_name: product?.title,
            value: metaValue,
            currency,
            contents: [{ id: selectedVariant.id, quantity, item_price: metaValue }],
            num_items: quantity,
          })
          setTimeout(() => setJustAdded(false), 2000)
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to add to bag')
        },
      }
    )
  }

  const hasMultipleVariants = variants.length > 1

  // Detect if the product has a "Pack"/"Bundle" option — render as visual picker
  const packOption = options.find((o: ProductOptionWithValues) =>
    /^(pack|bundle)s?$/i.test(o.title),
  )

  return (
    <div className="space-y-6">
      {/* Price */}
      <ProductPrice
        amount={currentPriceCents}
        currency={currency}
        compareAtPrice={ext?.compare_at_price}
        soldOut={isOutOfStock}
        size="detail"
      />

      {/* Urgency bar */}
      <UrgencyBar inventory={inventoryQuantity ?? null} />

      {/* Bundle picker (Pack/Bundle option) */}
      {packOption && (() => {
        const rawValues = (packOption.values || []) as Array<string | ProductOptionValue>
        const normalized = rawValues
          .map((v) =>
            typeof v === 'string'
              ? { id: v, value: v }
              : { id: (v.id || v.value) as string, value: v.value },
          )
          .filter((v) => !!v.value)

        const bundleOptions = normalized.map((v) => {
          const variant = variants.find((vv) =>
            vv.options?.some(
              (o) =>
                (o.option_id === packOption.id || o.option?.id === packOption.id) &&
                o.value === v.value,
            ),
          )
          const variantExt = variant?.id ? variantExtensions?.[variant.id] : null
          const amt = variant ? getVariantPriceAmount(variant) : null
          const variantCp = variant?.calculated_price
          const variantCurrency =
            (variantCp && typeof variantCp !== 'number' ? variantCp.currency_code : undefined) || 'usd'
          const variantAllowBackorder = variantExt?.allow_backorder ?? false
          const variantInventory = variantExt?.inventory_quantity
          const variantSoldOut =
            !variantAllowBackorder && variantInventory != null && variantInventory <= 0
          return {
            id: v.id,
            value: v.value,
            amount: amt ?? 0,
            compareAt: variantExt?.compare_at_price ?? null,
            currency: variantCurrency,
            soldOut: variantSoldOut,
          }
        })

        return (
          <BundlePicker
            options={bundleOptions}
            selectedValue={selectedOptions[packOption.id]}
            onSelect={(value) => handleOptionChange(packOption.id, value)}
          />
        )
      })()}

      {/* Standard option selectors (non-Pack options) */}
      {hasMultipleVariants && options.map((option: ProductOptionWithValues) => {
        if (packOption && option.id === packOption.id) return null

        const values = (option.values || []).map((v: string | ProductOptionValue) =>
          typeof v === 'string' ? v : v.value
        ).filter(Boolean) as string[]

        if (values.length <= 1 && (values[0] === 'One Size' || values[0] === 'Default')) {
          return null
        }

        const optionId = option.id
        const selectedValue = selectedOptions[optionId]

        return (
          <div key={optionId}>
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-3">
              {option.title}
              {selectedValue && (
                <span className="ml-2 normal-case tracking-normal font-normal text-muted-foreground">
                  — {selectedValue}
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const isSelected = selectedValue === value

                const isAvailable = variants.some((v: ProductVariantWithPrice) => {
                  const hasValue = v.options?.some(
                    (o: VariantOption) => (o.option_id === optionId || o.option?.id === optionId) && o.value === value
                  )
                  if (!hasValue) return false
                  const vExt = variantExtensions?.[v.id]
                  if (!vExt) return true
                  if (vExt.allow_backorder) return true
                  return vExt.inventory_quantity == null || vExt.inventory_quantity > 0
                })

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(optionId, value)}
                    disabled={!isAvailable}
                    className={`min-w-[48px] px-4 py-2.5 text-sm border transition-all ${
                      isSelected
                        ? 'border-foreground bg-foreground text-background'
                        : isAvailable
                        ? 'border-border hover:border-foreground'
                        : 'border-border text-muted-foreground/40 line-through cursor-not-allowed'
                    }`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Low Stock Warning (for non-pack products) */}
      {!packOption && isLowStock && (
        <p className="text-sm font-medium text-red-600">
          Only {inventoryQuantity} left in stock
        </p>
      )}

      {/* Quantity + Add to Cart */}
      <div className="flex gap-3">
        <div className="flex items-center border rounded-md">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:bg-muted transition-colors"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium tabular-nums">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 hover:bg-muted transition-colors"
            disabled={isOutOfStock || (!allowBackorder && inventoryQuantity != null && quantity >= inventoryQuantity)}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingItem}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md py-3.5 text-sm font-semibold uppercase tracking-wide transition-all ${
            isOutOfStock
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30'
          }`}
        >
          {isAddingItem ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : justAdded ? (
            <>
              <Check className="h-4 w-4" />
              Added to bag
            </>
          ) : isOutOfStock ? (
            'Sold Out'
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              Add to Bag — {currentPriceCents != null ? `$${(currentPriceCents / 100).toFixed(2)}` : ''}
            </>
          )}
        </button>
      </div>

      {/* Reassurance under CTA */}
      <p className="-mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <Lock className="h-3 w-3" strokeWidth={2} />
        Secure checkout · Free shipping · 60-day money-back guarantee
      </p>
    </div>
  )
}
