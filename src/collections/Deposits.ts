import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isStaff } from '@/access/roles'
import { createDepositLink } from '@/lib/stripe'

/**
 * Deposit records. A deposit link is generated through Stripe only for an
 * applicant the breeder has approved. There is no public checkout: records are
 * created and managed in the admin dashboard only.
 *
 * Stripe webhooks are not implemented yet. Mark a deposit as paid in admin after
 * confirming payment. STRIPE_WEBHOOK_SECRET is reserved for a future hook.
 */
export const Deposits: CollectionConfig = {
  slug: 'deposits',
  admin: {
    useAsTitle: 'label',
    group: 'Inbox',
    defaultColumns: ['label', 'application', 'amount', 'status', 'createdAt'],
    description:
      'Stripe deposit links for approved applicants only. Never a public purchase.',
  },
  access: {
    create: isAdminOrEditor,
    read: isStaff,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { description: 'Internal label, e.g. "Deposit — Smith family — Green Collar".' },
    },
    {
      name: 'application',
      type: 'relationship',
      relationTo: 'applications',
      required: true,
      admin: { description: 'Approved application this deposit is for.' },
    },
    {
      name: 'puppy',
      type: 'relationship',
      relationTo: 'puppies',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          min: 1,
          admin: { width: '50%', description: 'Deposit amount in USD.' },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Link sent', value: 'sent' },
            { label: 'Paid', value: 'paid' },
            { label: 'Refunded', value: 'refunded' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'paymentUrl',
      type: 'text',
      label: 'Payment link',
      admin: {
        readOnly: true,
        description:
          'Generated automatically from Stripe when configured. Copy and send to the approved applicant.',
      },
    },
    {
      name: 'stripeId',
      type: 'text',
      admin: { readOnly: true, hidden: true },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal notes.' },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Generate a Stripe Payment Link on create if Stripe is configured and
        // we don't already have one. Only approved / deposit-sent applications.
        if (operation === 'create' && !data.paymentUrl && data.amount) {
          const applicationId =
            typeof data.application === 'object' && data.application
              ? data.application.id
              : data.application

          if (!applicationId) {
            throw new Error('A deposit must be tied to an application.')
          }

          const application = await req.payload.findByID({
            collection: 'applications',
            id: applicationId,
            depth: 0,
          })

          if (application.status !== 'approved' && application.status !== 'deposit-sent') {
            throw new Error(
              'Payment links can only be created for applications with status approved or deposit-sent.',
            )
          }

          const result = await createDepositLink({
            amount: data.amount,
            label: data.label ?? 'Puppy deposit',
          })
          if (result) {
            data.paymentUrl = result.url
            data.stripeId = result.id
            data.status = data.status === 'draft' ? 'sent' : data.status
          } else {
            req.payload.logger.info(
              'Stripe not configured — deposit created without a payment link.',
            )
          }
        }
        return data
      },
    ],
  },
}
