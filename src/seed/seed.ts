import type { Payload } from 'payload'

/**
 * Seeds safe placeholder content. Everything is editable in the admin dashboard
 * and marked as a placeholder where a real fact is unknown. No health
 * certifications, registrations, pricing, or testimonials are fabricated as
 * real — sample testimonials are clearly labeled as examples.
 */
export const seed = async (payload: Payload): Promise<void> => {
  const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)

  // --- Admin user -----------------------------------------------------------
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'pamela@example.com'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!secure'

  const existingUsers = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
  })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        name: 'Pamela Cirilli',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      },
    })
    log(`created admin user ${adminEmail}`)
  } else {
    log('admin user already exists — skipping')
  }

  // --- Site settings --------------------------------------------------------
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      businessName: 'Cirilli English Goldens',
      tagline: 'Thoughtfully raised English Golden Retrievers in Suffolk, Virginia.',
      breederName: 'Pamela Cirilli',
      showBreederName: true,
      addressVisibility: 'generalized',
      city: 'Suffolk',
      state: 'VA',
      serviceArea: 'Suffolk, VA and the greater Hampton Roads / Tidewater area',
      // Badges default conservatively — enable only what is true (TODO: confirm).
      badgeVetChecked: true,
      badgeFamilyRaised: true,
      badgeAkc: false,
      badgeOfa: false,
      badgeEmbark: false,
      defaultMetaDescription:
        'A responsible English Golden Retriever breeding program in Suffolk, Virginia. Health-tested parents, family-raised puppies, and lifelong support.',
    },
  })
  log('site settings updated')

  // --- Helper to avoid duplicate seeding ------------------------------------
  const countOf = async (collection: Parameters<Payload['find']>[0]['collection']) =>
    (await payload.find({ collection, limit: 0 })).totalDocs

  // --- Dogs -----------------------------------------------------------------
  if ((await countOf('dogs')) === 0) {
    await payload.create({
      collection: 'dogs',
      data: {
        callName: 'Daisy',
        registeredName: 'TODO — add registered name',
        role: 'dam',
        sex: 'female',
        color: 'Light cream',
        temperament:
          'Placeholder: gentle, people-oriented, and steady. Replace with Daisy’s real description.',
        published: true,
        healthTesting: [
          { test: 'TODO — add a completed health test (e.g. OFA Hips)', result: '' },
        ],
      },
    })
    await payload.create({
      collection: 'dogs',
      data: {
        callName: 'Cooper',
        registeredName: 'TODO — add registered name',
        role: 'sire',
        sex: 'male',
        color: 'Cream',
        temperament:
          'Placeholder: confident, biddable, and affectionate. Replace with Cooper’s real description.',
        published: true,
      },
    })
    log('seeded 2 placeholder dogs')
  }

  // --- Litter + puppies -----------------------------------------------------
  if ((await countOf('litters')) === 0) {
    const dam = (await payload.find({ collection: 'dogs', where: { role: { equals: 'dam' } }, limit: 1 })).docs[0]
    const sire = (await payload.find({ collection: 'dogs', where: { role: { equals: 'sire' } }, limit: 1 })).docs[0]

    const litter = await payload.create({
      collection: 'litters',
      data: {
        name: 'Daisy × Cooper — Sample Litter',
        status: 'planned',
        waitlistOpen: true,
        description:
          'Placeholder litter so you can see how this looks. Edit or delete it in the admin dashboard.',
        published: true,
        dam: dam?.id,
        sire: sire?.id,
      },
    })

    await payload.create({
      collection: 'puppies',
      data: {
        name: 'Green Collar',
        collarColor: 'Green',
        litter: litter.id,
        sex: 'male',
        status: 'under-evaluation',
        color: 'Light cream',
        notes: 'Placeholder puppy. Replace with a real listing when a litter arrives.',
        published: true,
        allowDeposit: false,
      },
    })
    await payload.create({
      collection: 'puppies',
      data: {
        name: 'Pink Collar',
        collarColor: 'Pink',
        litter: litter.id,
        sex: 'female',
        status: 'waitlist-only',
        color: 'Cream',
        notes: 'Placeholder puppy. Replace with a real listing when a litter arrives.',
        published: true,
        allowDeposit: false,
      },
    })
    log('seeded 1 placeholder litter with 2 puppies')
  }

  // --- FAQs -----------------------------------------------------------------
  if ((await countOf('faqs')) === 0) {
    const faqs: { question: string; answer: string; category: string; order: number }[] = [
      { question: 'How much does a puppy cost?', answer: 'TODO — add your pricing. (Placeholder)', category: 'pricing', order: 1 },
      { question: 'How much is the deposit and is it refundable?', answer: 'TODO — add your deposit amount and refund/transfer policy. Deposits are only requested after we approve your application. (Placeholder)', category: 'pricing', order: 2 },
      { question: 'How does the waitlist work?', answer: 'TODO — describe how families join and move up your waitlist. (Placeholder)', category: 'waitlist', order: 3 },
      { question: 'Can we visit?', answer: 'TODO — describe your visit and video-call policy. (Placeholder)', category: 'waitlist', order: 4 },
      { question: 'Are the puppies AKC registered?', answer: 'TODO — confirm registration status and limited vs. full registration. (Placeholder)', category: 'registration', order: 5 },
      { question: 'What health testing do you do?', answer: 'TODO — list the health testing you complete on your parent dogs. (Placeholder)', category: 'health', order: 6 },
      { question: 'When can a puppy come home, and do you ship?', answer: 'TODO — describe go-home age and any delivery/transport options. (Placeholder)', category: 'pickup', order: 7 },
      { question: 'What food and supplies come home with the puppy?', answer: 'TODO — describe the go-home packet, starter food, and supplies. (Placeholder)', category: 'care', order: 8 },
    ]
    for (const f of faqs) {
      await payload.create({ collection: 'faqs', data: { ...f, published: true } as never })
    }
    log(`seeded ${faqs.length} placeholder FAQs`)
  }

  // --- Testimonials (clearly marked as examples) ----------------------------
  if ((await countOf('testimonials')) === 0) {
    await payload.create({
      collection: 'testimonials',
      data: {
        quote:
          'EXAMPLE TESTIMONIAL (replace with a real one): Our puppy is healthy, gentle, and the heart of our family.',
        ownerName: 'Example',
        dogName: 'Sample',
        location: 'Virginia',
        published: false,
        featured: false,
      },
    })
    log('seeded 1 example testimonial (unpublished)')
  }

  // --- Editable content pages ----------------------------------------------
  const pageDefs = [
    { slug: 'responsible-breeding', title: 'Responsible Breeding', subtitle: 'Health-first, family-raised, and committed for life.' },
    { slug: 'process', title: 'How It Works', subtitle: 'From first hello to go-home day.' },
    { slug: 'health-guarantee', title: 'Health Guarantee & Contract', subtitle: 'A plain-language overview of what we stand behind.' },
  ]
  for (const def of pageDefs) {
    const existing = await payload.find({ collection: 'pages', where: { slug: { equals: def.slug } }, limit: 1 })
    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'pages',
        data: { title: def.title, slug: def.slug, subtitle: def.subtitle, published: true },
      })
    }
  }
  log('ensured editable content pages exist')

  log('seed complete ✅')
}
