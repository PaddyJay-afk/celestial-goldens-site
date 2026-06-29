import Stripe from 'stripe'
import { isStripeConfigured, stripe as stripeEnv } from './env'

let client: Stripe | null = null

const getClient = (): Stripe | null => {
  if (!isStripeConfigured) return null
  if (!client) client = new Stripe(stripeEnv.secretKey)
  return client
}

/**
 * Create a Stripe Payment Link for a puppy deposit. Returns null when Stripe is
 * not configured so the admin can still record the deposit manually.
 *
 * Important: this is only ever called from the admin (Deposits collection),
 * never from a public route. There is no public "buy now" checkout.
 */
export const createDepositLink = async ({
  amount,
  label,
}: {
  amount: number
  label: string
}): Promise<{ url: string; id: string } | null> => {
  const stripe = getClient()
  if (!stripe) return null

  const price = await stripe.prices.create({
    currency: 'usd',
    unit_amount: Math.round(amount * 100),
    product_data: { name: label },
  })

  const link = await stripe.paymentLinks.create({
    line_items: [{ price: price.id, quantity: 1 }],
    metadata: { purpose: 'puppy_deposit', label },
  })

  return { url: link.url, id: link.id }
}

export { getClient as getStripeClient }
