# Celestial English Golden Retrievers brand upgrade

## Goal

Elevate the existing breeder site into a premium celestial/luxury brand while preserving the current layout, responsible-breeder positioning, and conversion flow.

## Brand direction

**Celestial Heritage Boutique** — warm family breeder trust with moonlit luxury cues.

Core mood:

- ethical
- premium
- calm
- magical, but not gimmicky
- family-safe
- high-touch

## Visual system

### Palette

- Midnight: `#020814`
- Celestial navy: `#081A2D`
- Deep blue: `#102A44`
- Forest: `#20362A`
- Cream: `#FAF6EC`
- Ivory: `#FFF9EA`
- Champagne gold: `#D7B56D`
- Soft gold: `#F1D993`
- Rich gold: `#9E762E`
- Moon silver: `#DDEAF2`

### Logo usage

- Header/footer use the cropped circular mark from the official logo.
- Full logo is included in `public/brand/celestial-english-golden-retrievers-logo.jpg` for social, admin, and future page treatments.
- Favicon is a lightweight SVG moon/dog mark inspired by the logo.

## Implemented upgrades on this branch

1. Added official Celestial logo assets.
2. Added circular logo mark to header and footer.
3. Updated favicon/apple touch icon.
4. Shifted design tokens from teal/forest to midnight/forest/champagne.
5. Added subtle global celestial glow background.
6. Added starfield/midnight `celestial-panel` utility.
7. Updated homepage headline for premium positioning.
8. Added trust chips under hero.
9. Added a “Find your celestial match” quiz/application teaser.
10. Upgraded featured litter area into a moonlit section with moon-phase journey cards.
11. Added premium borders/hover lift to puppy cards.
12. Updated seed data to use `Celestial English Golden Retrievers` and include the logo.

## Next-level roadmap

### Phase 1 — visual polish

- Replace placeholder/seed puppy images with real puppy photography.
- Create a moonlit hero illustration/photo to match the new logo.
- Add a full-width brand/about section using the complete logo.

### Phase 2 — conversion UX

- Build the real “Find your celestial match” quiz.
- Add sticky mobile CTA: `Apply | Puppies | Call`.
- Add puppy comparison cards.
- Add temperament archetypes: Gentle Star, Bright Explorer, Cuddle Moon, Steady Heart.

### Phase 3 — trust and content

- Add “The Celestial Promise” trust center.
- Add weekly litter/pupdate timeline.
- Add parent dog profile storytelling.
- Add FAQ schema and richer local SEO pages.

### Phase 4 — operations

- Add CMS controls for homepage feature flags.
- Add admin-editable matching quiz questions.
- Add email follow-up automation for applications.

## Verification

Run before merge/deploy:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
