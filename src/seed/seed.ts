import path from 'path'
import { existsSync } from 'fs'
import type { Payload } from 'payload'

/**
 * Seeds complete, professional placeholder content so the site demos well on
 * day one. Every dog, litter, puppy, testimonial, and image here is SAMPLE
 * DATA — original placeholder artwork and invented example records that Pam
 * replaces with her real dogs, photos, and details from the admin dashboard.
 * See HANDOFF.md for the replace-before-launch checklist.
 *
 * Idempotent: collections that already contain data are left untouched, so
 * it is safe to run on every boot (AUTO_SEED=true) and it will never
 * overwrite Pam's edits.
 */

const assetsDir = (): string => {
  const candidates = [
    process.env.SEED_ASSETS_DIR,
    path.resolve(process.cwd(), 'seed-assets'),
    path.resolve(process.cwd(), 'src/seed/assets'),
  ].filter(Boolean) as string[]
  for (const dir of candidates) {
    if (existsSync(dir)) return dir
  }
  return ''
}

export const seed = async (payload: Payload): Promise<void> => {
  const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)
  const assets = assetsDir()
  if (!assets) log('warning: seed assets directory not found — seeding without images')

  const countOf = async (collection: 'users' | 'media' | 'dogs' | 'litters' | 'puppies' | 'faqs' | 'testimonials') =>
    (await payload.find({ collection, limit: 0 })).totalDocs

  // --- Admin user -----------------------------------------------------------
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'pamela@example.com'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!secure'
  if ((await payload.find({ collection: 'users', where: { email: { equals: adminEmail } }, limit: 1 })).totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { name: 'Pamela', email: adminEmail, password: adminPassword, role: 'admin' },
    })
    log(`created admin user ${adminEmail}`)
  }

  // --- Media (placeholder artwork) ------------------------------------------
  const media: Record<string, number> = {}
  const uploadArt = async (file: string, alt: string, caption?: string) => {
    if (!assets) return undefined
    const filePath = path.join(assets, `${file}.jpg`)
    if (!existsSync(filePath)) return undefined
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { contains: file } },
      limit: 1,
    })
    if (existing.docs[0]) {
      media[file] = existing.docs[0].id
      return existing.docs[0].id
    }
    const doc = await payload.create({
      collection: 'media',
      data: { alt, caption, credit: 'Original placeholder artwork — replace with your photos' },
      filePath,
    })
    media[file] = doc.id
    return doc.id
  }

  if ((await countOf('media')) === 0 && assets) {
    await uploadArt('hero-meadow', 'Golden-hour meadow illustration with rolling Virginia hills')
    await uploadArt('og-banner', 'Celestial English Golden Retrievers — Suffolk, Virginia')
    await uploadArt('dog-daisy', 'Engraved monogram plate for Daisy', 'Daisy — replace with her photo')
    await uploadArt('dog-sadie', 'Engraved monogram plate for Sadie', 'Sadie — replace with her photo')
    await uploadArt('dog-cooper', 'Engraved monogram plate for Cooper', 'Cooper — replace with his photo')
    await uploadArt('dog-juniper', 'Engraved monogram plate for Juniper', 'Juniper — replace with her photo')
    await uploadArt('puppy-green', 'Green collar puppy plate', 'Green collar')
    await uploadArt('puppy-pink', 'Pink collar puppy plate', 'Pink collar')
    await uploadArt('puppy-blue', 'Blue collar puppy plate', 'Blue collar')
    await uploadArt('puppy-yellow', 'Yellow collar puppy plate', 'Yellow collar')
    await uploadArt('litter-spring', 'The Stardust Litter announcement plate')
    await uploadArt('gallery-oak-hill', 'Oak on the hill at first light', 'The back field, first light')
    await uploadArt('gallery-dusk', 'Dusk over the meadow', 'Evening walk weather')
    await uploadArt('gallery-goldenrod', 'Goldenrod study', 'Goldenrod, early autumn')
    await uploadArt('gallery-paw-quilt', 'Paw print quilt pattern', 'Every collar tells a story')
    await uploadArt('gallery-crest', 'Celestial English Golden Retrievers kennel crest', 'Our crest')
    log(`uploaded ${Object.keys(media).length} placeholder artworks`)
  } else if (assets) {
    // map already-uploaded assets so re-runs can still link relations
    for (const f of [
      'hero-meadow', 'og-banner', 'dog-daisy', 'dog-sadie', 'dog-cooper', 'dog-juniper',
      'puppy-green', 'puppy-pink', 'puppy-blue', 'puppy-yellow', 'litter-spring',
    ]) {
      const existing = await payload.find({ collection: 'media', where: { filename: { contains: f } }, limit: 1 })
      if (existing.docs[0]) media[f] = existing.docs[0].id
    }
  }

  // --- Site settings ---------------------------------------------------------
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  if (!settings?.heroImage) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        businessName: 'Celestial English Golden Retrievers',
        tagline:
          'I’m Pamela. I raise one litter of AKC English Golden Retrievers a year in my Suffolk, Virginia home — health-tested parents, puppies underfoot from day one.',
        breederName: 'Pamela',
        showBreederName: true,
        email: 'celestialpups62@gmail.com',
        phone: '(757) 537-9055',
        addressVisibility: 'generalized',
        city: 'Suffolk',
        state: 'VA',
        serviceArea: 'Suffolk, VA and the greater Hampton Roads / Tidewater area',
        badgeVetChecked: true,
        badgeFamilyRaised: true,
        badgeAkc: true,
        badgeOfa: true,
        badgeEmbark: true,
        heroImage: media['hero-meadow'],
        defaultOgImage: media['og-banner'],
        defaultMetaDescription:
          'Celestial English Golden Retrievers — a boutique, AKC-registered English Golden Retriever program in Suffolk, Virginia. One litter a year, health-tested parents, home-raised puppies.',
      },
    })
    log('site settings updated')
  }

  // --- Dogs -------------------------------------------------------------------
  // SAMPLE DOGS — names, dates, and health entries are illustrative placeholders.
  if ((await countOf('dogs')) === 0) {
    const dogs = [
      {
        callName: 'Daisy',
        registeredName: 'Willowmere Morning Light',
        role: 'dam' as const,
        sex: 'female' as const,
        dateOfBirth: '2022-04-18',
        color: 'Light cream',
        weight: '58 lbs',
        temperament:
          'Daisy is the heart of my home — a velcro girl who naps under my kitchen table and swims like she was born in the river. Steady with children, soft-mouthed, endlessly patient.',
        pedigreeNotes:
          'European lines selected for longevity and gentle temperament. I share the full pedigree with approved families.',
        healthTesting: [
          { test: 'OFA Hips', result: 'Good', link: '' },
          { test: 'OFA Elbows', result: 'Normal' },
          { test: 'OFA Cardiac', result: 'Normal' },
          { test: 'OFA Eyes (repeated annually)', result: 'Normal' },
          { test: 'DNA panel', result: 'Clear' },
        ],
        featuredImage: media['dog-daisy'],
        published: true,
      },
      {
        callName: 'Sadie',
        registeredName: 'Willowmere Summer Sonnet',
        role: 'dam' as const,
        sex: 'female' as const,
        dateOfBirth: '2023-02-09',
        color: 'Cream',
        weight: '55 lbs',
        temperament:
          'My young rising star — playful, biddable, and the first to greet you at the gate. Sadie loves fetch more than dinner, which is saying something.',
        healthTesting: [
          { test: 'OFA Hips', result: 'Good' },
          { test: 'OFA Elbows', result: 'Normal' },
          { test: 'OFA Eyes (repeated annually)', result: 'Normal' },
          { test: 'DNA panel', result: 'Clear' },
        ],
        featuredImage: media['dog-sadie'],
        published: true,
      },
      {
        callName: 'Cooper',
        registeredName: 'Brightwater Standing Ovation',
        role: 'sire' as const,
        sex: 'male' as const,
        dateOfBirth: '2021-09-30',
        color: 'Cream',
        weight: '68 lbs',
        temperament:
          'Cooper is a gentleman — blocky-headed, calm-eyed, and famously tolerant of puppies climbing on his ears. He sets the tone for every litter he sires.',
        titles: 'CGC (Canine Good Citizen)',
        healthTesting: [
          { test: 'OFA Hips', result: 'Excellent' },
          { test: 'OFA Elbows', result: 'Normal' },
          { test: 'OFA Cardiac', result: 'Normal' },
          { test: 'OFA Eyes (repeated annually)', result: 'Normal' },
          { test: 'DNA panel', result: 'Clear' },
        ],
        featuredImage: media['dog-cooper'],
        published: true,
      },
      {
        callName: 'Juniper',
        registeredName: 'Willowmere First Frost',
        role: 'retired' as const,
        sex: 'female' as const,
        dateOfBirth: '2017-06-02',
        color: 'Light cream',
        temperament:
          'My foundation girl, now happily retired to full-time couch supervision and part-time puppy mentoring. Every dog in my program traces back to her sweetness.',
        featuredImage: media['dog-juniper'],
        published: true,
      },
    ]
    for (const d of dogs) await payload.create({ collection: 'dogs', data: d })
    log('seeded 4 sample dogs')
  }

  // --- Litters & puppies --------------------------------------------------------
  if ((await countOf('litters')) === 0) {
    const daisy = (await payload.find({ collection: 'dogs', where: { callName: { equals: 'Daisy' } }, limit: 1 })).docs[0]
    const sadie = (await payload.find({ collection: 'dogs', where: { callName: { equals: 'Sadie' } }, limit: 1 })).docs[0]
    const cooper = (await payload.find({ collection: 'dogs', where: { callName: { equals: 'Cooper' } }, limit: 1 })).docs[0]

    const meadow = await payload.create({
      collection: 'litters',
      data: {
        name: 'The Stardust Litter — Daisy × Cooper',
        status: 'born',
        waitlistOpen: false,
        expectedDate: '2026-05-12',
        goHomeDate: '2026-07-07',
        description:
          'Four beautiful puppies arrived on a rainy May morning — two boys, two girls, all thriving in my living room. I expected calm, people-first temperaments from this pairing, and the early signs agree.',
        coverImage: media['litter-spring'],
        published: true,
        dam: daisy?.id,
        sire: cooper?.id,
      },
    })

    await payload.create({
      collection: 'litters',
      data: {
        name: 'The Aurora Litter — Sadie × Cooper',
        status: 'planned',
        waitlistOpen: true,
        expectedDate: '2026-10-05',
        description:
          'Sadie’s first litter, planned for early autumn — my one litter for the year ahead. I anticipate the same easy biddability both parents are known for. The waitlist is open — apply early to be considered.',
        published: true,
        dam: sadie?.id,
        sire: cooper?.id,
      },
    })

    const puppies = [
      {
        name: 'Green Collar', collarColor: 'Green', sex: 'male' as const, status: 'available' as const,
        notes: 'My explorer — first out of the whelping box, first to find the water bowl. Confident and curious with a soft, easy mouth.',
        featuredImage: media['puppy-green'],
      },
      {
        name: 'Pink Collar', collarColor: 'Pink', sex: 'female' as const, status: 'reserved' as const,
        notes: 'A cuddler through and through — happiest on a lap or trailing whoever looks busiest. Reserved for an approved family.',
        featuredImage: media['puppy-pink'],
      },
      {
        name: 'Blue Collar', collarColor: 'Blue', sex: 'male' as const, status: 'under-evaluation' as const,
        notes: 'My thinker — watches first, then does it right the first time. I’m evaluating him a little longer before matching.',
        featuredImage: media['puppy-blue'],
      },
      {
        name: 'Yellow Collar', collarColor: 'Yellow', sex: 'female' as const, status: 'waitlist-only' as const,
        notes: 'Sunshine in dog form. Waitlist-only for now, while I finish temperament evaluations and match families.',
        featuredImage: media['puppy-yellow'],
      },
    ]
    for (const p of puppies) {
      await payload.create({
        collection: 'puppies',
        data: {
          ...p,
          litter: meadow.id,
          dateOfBirth: '2026-05-12',
          goHomeDate: '2026-07-07',
          color: 'Light cream',
          published: true,
          allowDeposit: false,
        },
      })
    }
    log('seeded 2 sample litters + 4 sample puppies')
  }

  // --- FAQs -----------------------------------------------------------------
  if ((await countOf('faqs')) === 0) {
    const faqs = [
      { category: 'pricing', order: 1, question: 'How much does a puppy cost?', answer: 'My puppies are $3,500. That includes AKC registration (pre-paid by me), the seven-week veterinary exam and first vaccinations, fully health-tested parents, and a complete go-home packet — plus my support for the life of your dog.' },
      { category: 'pricing', order: 2, question: 'How do deposits and payments work?', answer: 'Once I’ve approved you, a $500 non-refundable deposit holds your place — check or Zelle. The balance is paid in cash when you pick up your puppy. I never take a deposit from a family I haven’t approved.' },
      { category: 'general', order: 3, question: 'How does the approval process work?', answer: 'Two steps: fill out my application completely, then you and I talk on the phone. After both have happened, I’ll tell you whether you’ve been approved. Incomplete applications are the one thing I don’t consider.' },
      { category: 'waitlist', order: 4, question: 'Is there a waitlist?', answer: 'Yes. I raise one litter a year, so approved families join my waitlist and are matched as puppies arrive. Applying early is the best way to be considered.' },
      { category: 'waitlist', order: 5, question: 'Can we visit or video call?', answer: 'Yes to both. Video calls start once puppies are three weeks old, and you’re welcome to visit by appointment after they turn five weeks. I want you to see exactly how they live.' },
      { category: 'registration', order: 6, question: 'Are the puppies AKC registered?', answer: 'Yes. My dogs are AKC registered, and puppies go home on limited registration with the AKC paperwork pre-paid by me.' },
      { category: 'health', order: 7, question: 'What health testing do you do?', answer: 'Both parents are DNA tested and OFA evaluated — hips, elbows, and heart — and I have their eyes re-examined every single year. I show the OFA certificates to approved families.' },
      { category: 'health', order: 8, question: 'What vet care do puppies receive?', answer: 'At seven weeks every puppy sees my vet for a full exam and their first distemper/parvo vaccination, and goes home with their first heartworm preventative to give after homecoming. You also get a signed letter from the vet confirming the exam — pet insurance companies accept it.' },
      { category: 'health', order: 9, question: 'Are puppies microchipped?', answer: 'I recommend microchipping closer to one year of age — chips can migrate in young, fast-growing puppies. Your vet can place one at any routine visit.' },
      { category: 'pickup', order: 10, question: 'Do you ship or deliver puppies?', answer: 'No. Families are welcome from anywhere — I have no location restrictions — but puppies are picked up in person. I do not allow my puppies to be transported in cargo holds. Period.' },
      { category: 'care', order: 11, question: 'What food do puppies go home eating?', answer: 'Royal Canin Golden Retriever Puppy — and I recommend keeping them on it for their whole first year.' },
      { category: 'care', order: 12, question: 'What comes home with the puppy?', answer: 'A copy of your application, your contract, a toy, potty pick-up bags — and a small blanket carrying mom’s and the litter’s scent. That blanket is very calming for your puppy on the first nights home.' },
      { category: 'care', order: 13, question: 'Are puppies started on potty training?', answer: 'Yes — potty training starts here in my home, along with early neurological stimulation and sound desensitization. Most of my families tell me their puppy is completely house trained within 2 to 2½ weeks of coming home.' },
      { category: 'general', order: 14, question: 'How many litters do you raise?', answer: 'One a year. Keeping it small means every puppy is raised in my home, underfoot, with the time and attention they deserve. I wouldn’t do it any other way.' },
      { category: 'general', order: 15, question: 'What if I can’t keep my dog someday?', answer: 'They come back to me — always. At any point in the dog’s life, for any reason, I will take my dog back. No dog of mine will ever need a shelter.' },
    ]
    for (const f of faqs) await payload.create({ collection: 'faqs', data: { ...f, published: true } as never })
    log(`seeded ${faqs.length} FAQs`)
  }

  // --- Testimonials (SAMPLE — replace with real ones before launch) ----------
  if ((await countOf('testimonials')) === 0) {
    const testimonials = [
      {
        quote: 'Pamela matched us with exactly the right puppy — calmer than the one we thought we wanted, and perfect for our kids. Two years later she still answers our questions within the hour.',
        ownerName: 'Rachel', dogName: 'Biscuit', location: 'Virginia Beach, VA', date: '2025-11-02', published: true, featured: true,
      },
      {
        quote: 'The most organized, transparent breeder we spoke with. Health records, contracts, video calls with the litter — everything was ready before we even asked.',
        ownerName: 'Marcus', dogName: 'Willow', location: 'Chesapeake, VA', date: '2025-08-19', published: true, featured: true,
      },
      {
        quote: 'You can tell these puppies were raised in a living room and not a barn. Ours slept through the night in week one and never met a stranger she didn’t love.',
        ownerName: 'The Hendersons', dogName: 'Maple', location: 'Richmond, VA', date: '2026-01-24', published: true, featured: true,
      },
    ]
    for (const t of testimonials) await payload.create({ collection: 'testimonials', data: t })
    log('seeded 3 sample testimonials (replace before launch)')
  }

  // --- Editable content pages -------------------------------------------------
  const pageDefs = [
    { slug: 'responsible-breeding', title: 'Responsible Breeding', subtitle: 'Health-first pairings, home-raised puppies, and a commitment that lasts the dog’s whole life.' },
    { slug: 'process', title: 'How It Works', subtitle: 'From first hello to go-home day — and every year after.' },
    { slug: 'health-guarantee', title: 'Health Guarantee & Contract', subtitle: 'A plain-language overview of what we stand behind.' },
  ]
  for (const def of pageDefs) {
    const existing = await payload.find({ collection: 'pages', where: { slug: { equals: def.slug } }, limit: 1 })
    if (existing.totalDocs === 0) {
      await payload.create({ collection: 'pages', data: { ...def, published: true } })
    }
  }

  log('seed complete ✅')
}
