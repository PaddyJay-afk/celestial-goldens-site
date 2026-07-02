/**
 * Brand art generator — "heritage kennel" identity suite.
 *
 * Generates the site's original placeholder artwork (hero, dog medallion
 * plates, puppy plates, litter plate, gallery studies, OG banner, crest) as
 * SVG compositions and rasterizes them to JPG for CMS seeding.
 *
 * All artwork is original, generated from this file, and free to use without
 * attribution (see art/LICENSE). Regenerate with: node art/build-art.mjs
 */
import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'

const OUT_SVG = new URL('./svg/', import.meta.url).pathname
const OUT_JPG = process.argv[2] || new URL('../src/seed/assets/', import.meta.url).pathname
mkdirSync(OUT_SVG, { recursive: true })
mkdirSync(OUT_JPG, { recursive: true })

// ---------------------------------------------------------------------------
// Palette (mirrors tailwind tokens)
const P = {
  cream: '#FBF8F1',
  ivory: '#FEFCF7',
  forest: '#29382E',
  forest700: '#33473A',
  sage: '#7C8C6F',
  sageLight: '#A9B48E',
  gold: '#BD8B3C',
  goldDark: '#A0742F',
  goldSoft: '#E7D3A8',
  parchment: '#F3E4C2',
  charcoal: '#2C2A25',
  skyHi: '#F6E3C0',
  skyLo: '#EDD09E',
  sun: '#E9BE7B',
  duskHi: '#D8B394',
  duskLo: '#B98A6E',
}

const collars = {
  green: { base: '#5F7355', deep: '#49593F', soft: '#DCE3D2' },
  pink: { base: '#C08497', deep: '#A56374', soft: '#F2DEE4' },
  blue: { base: '#5B7C99', deep: '#44607A', soft: '#DCE6EE' },
  yellow: { base: '#C9A227', deep: '#A98518', soft: '#F2E8C9' },
}

// ---------------------------------------------------------------------------
// Shared components

/** Paw print centered at 0,0, ~78 units wide, pointing up. Pass fill via <g>. */
const paw = `
  <path d="M -30 8 C -34 -10, -22 -22, 0 -22 C 22 -22, 34 -10, 30 8 C 27 22, 20 32, 10 36 C 4 38.5, -4 38.5, -10 36 C -20 32, -27 22, -30 8 Z"/>
  <ellipse cx="-15" cy="-42" rx="11" ry="15"/>
  <ellipse cx="15" cy="-42" rx="11" ry="15"/>
  <ellipse cx="-40" cy="-24" rx="10" ry="14" transform="rotate(-18 -40 -24)"/>
  <ellipse cx="40" cy="-24" rx="10" ry="14" transform="rotate(18 40 -24)"/>`

/** Tapered grass blade: filled, base at (0,0), tip up-left/right by lean. */
const blade = (h, lean, w = 7) =>
  `<path d="M 0 0 C ${-w / 2} ${-h * 0.4}, ${lean * 0.4 - w / 2} ${-h * 0.75}, ${lean} ${-h}
     C ${lean * 0.55 + w / 2} ${-h * 0.7}, ${w / 2} ${-h * 0.35}, ${w * 0.9} 0 Z"/>`

/** Grass tuft: fan of blades at (x,y), scale s. */
const tuft = (x, y, s = 1, fill = P.forest, op = 1) => `
  <g transform="translate(${x},${y}) scale(${s})" fill="${fill}" opacity="${op}">
    ${blade(70, -26)} ${blade(96, -10)} ${blade(112, 4, 8)} ${blade(88, 20)} ${blade(62, 32)}
  </g>`

/** Wheat / goldenrod seed head on curved stem, base (x,y). */
const wheat = (x, y, s = 1, tint = P.goldSoft) => `
  <g transform="translate(${x},${y}) scale(${s})">
    <path d="M 0 0 C 4 -40, 2 -78, 12 -110" fill="none" stroke="${tint}" stroke-width="3.4" stroke-linecap="round"/>
    ${[0, 1, 2, 3, 4]
      .map((i) => {
        const t = -108 - i * 13
        const dx = 12 + i * 1.2
        return `<ellipse cx="${dx - 7}" cy="${t}" rx="4.6" ry="9" transform="rotate(-24 ${dx - 7} ${t})" fill="${tint}"/>
                <ellipse cx="${dx + 7}" cy="${t}" rx="4.6" ry="9" transform="rotate(24 ${dx + 7} ${t})" fill="${tint}"/>`
      })
      .join('')}
    <ellipse cx="${12 + 5 * 1.2}" cy="-178" rx="4.4" ry="9" fill="${tint}"/>
  </g>`

/** Laurel sprig curving up-right from (0,0); leaves alternate along the stem. */
const laurel = (s = 1, mirror = 1, tint = P.goldSoft, n = 7) => `
  <g transform="scale(${mirror * s},${s})">
    <path d="M 0 0 C 34 -8, 66 -34, 82 -80" fill="none" stroke="${tint}" stroke-width="2.6" stroke-linecap="round"/>
    ${Array.from({ length: n }, (_, i) => {
      const t = (i + 0.5) / n
      // point on the stem curve (approx) and its tangent angle
      const x = 3 + 78 * t - 12 * t * t
      const y = -4 - 60 * t * t - 14 * t
      const tangent = -12 - 52 * t
      const side = i % 2 === 0 ? 1 : -1
      const ang = tangent + side * 52
      return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="3.8" ry="12.5" transform="rotate(${ang.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${tint}"/>`
    }).join('')}
  </g>`


/** Four-point sparkle centered at 0,0, ~28 units. */
const sparkle = `<path d="M 0 -14 C 2 -4, 4 -2, 14 0 C 4 2, 2 4, 0 14 C -2 4, -4 2, -14 0 C -4 -2, -2 -4, 0 -14 Z"/>`

/** Fence: n posts + two rails, silhouette. Origin at left post base. */
const fence = (n = 5, gap = 92, fill = P.forest) => `
  <g fill="${fill}">
    ${Array.from({ length: n }, (_, i) => `<rect x="${i * gap}" y="-86" width="12" height="86" rx="3"/>`).join('')}
    <rect x="-8" y="-72" width="${(n - 1) * gap + 28}" height="8" rx="4"/>
    <rect x="-8" y="-40" width="${(n - 1) * gap + 28}" height="8" rx="4"/>
  </g>`

/** Film-grain texture overlay for a w×h canvas. */
const grain = (w, h, op = 0.05, seed = 7) => `
  <filter id="grain${seed}" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="${seed}" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.14  0 0 0 0 0.10  0 0 0 ${op} 0"/>
  </filter>
  <rect width="${w}" height="${h}" filter="url(#grain${seed})"/>`

const svgDoc = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}">${body}</svg>`

// ---------------------------------------------------------------------------
// Scenes

/** Meadow scene builder — reused for hero / og / gallery variants. */
const meadow = (w, h, { dusk = false, sunX = 0.52, sunY = 0.36, withFence = true, seed = 3 } = {}) => {
  const sky0 = dusk ? P.duskHi : P.skyHi
  const sky1 = dusk ? P.duskLo : P.skyLo
  const far = dusk ? '#A99B84' : P.sageLight
  const farLo = dusk ? '#98876F' : '#9DA982'
  const mid = dusk ? '#7E7A62' : '#8A9A74'
  const midLo = dusk ? '#6E6A54' : P.sage
  const near0 = dusk ? '#4A4A3C' : '#57694E'
  const near1 = dusk ? '#37372E' : '#3E5040'
  const sx = w * sunX
  const sy = h * sunY
  return `
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky0}"/><stop offset="1" stop-color="${sky1}"/>
    </linearGradient>
    <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${far}"/><stop offset="1" stop-color="${farLo}"/>
    </linearGradient>
    <linearGradient id="mid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${mid}"/><stop offset="1" stop-color="${midLo}"/>
    </linearGradient>
    <linearGradient id="near" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${near0}"/><stop offset="1" stop-color="${near1}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#F9EFD8" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#F9EFD8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <circle cx="${sx}" cy="${sy}" r="${h * 0.3}" fill="url(#glow)"/>
  <circle cx="${sx}" cy="${sy}" r="${h * 0.085}" fill="${P.sun}"/>
  <path fill="url(#far)" d="M0 ${h * 0.52} C ${w * 0.2} ${h * 0.47}, ${w * 0.42} ${h * 0.48} ${w * 0.62} ${h * 0.515} C ${w * 0.8} ${h * 0.545}, ${w * 0.92} ${h * 0.54} ${w} ${h * 0.52} L ${w} ${h} L 0 ${h} Z"/>
  <path fill="url(#mid)" d="M0 ${h * 0.62} C ${w * 0.18} ${h * 0.57}, ${w * 0.45} ${h * 0.585} ${w * 0.66} ${h * 0.625} C ${w * 0.84} ${h * 0.658}, ${w * 0.94} ${h * 0.652} ${w} ${h * 0.635} L ${w} ${h} L 0 ${h} Z"/>
  <path fill="url(#near)" d="M0 ${h * 0.78} C ${w * 0.22} ${h * 0.73}, ${w * 0.52} ${h * 0.74} ${w * 0.74} ${h * 0.775} C ${w * 0.88} ${h * 0.797}, ${w * 0.96} ${h * 0.795} ${w} ${h * 0.785} L ${w} ${h} L 0 ${h} Z"/>
  ${withFence ? `<g transform="translate(${w * 0.60},${h * 0.775})">${fence(5, w * 0.062, '#2E3A2C')}</g>` : ''}
  ${tuft(w * 0.085, h * 0.985, 1.25, '#243024')}
  ${tuft(w * 0.19, h * 1.01, 0.9, '#2C3A2E', 0.95)}
  ${tuft(w * 0.87, h * 0.99, 1.35, '#243024')}
  ${tuft(w * 0.76, h * 1.015, 0.85, '#2C3A2E', 0.92)}
  ${wheat(w * 0.115, h * 0.985, 1.05)}
  ${wheat(w * 0.152, h * 1.0, 0.85, '#D9C08B')}
  ${wheat(w * 0.895, h * 0.99, 1.1)}
  ${wheat(w * 0.845, h * 1.005, 0.8, '#D9C08B')}
  ${grain(w, h, 0.05, seed)}`
}

/** Dog medallion plate (square). letterY tweaks optical centering. */
const dogPlate = (name, letter, { bg = P.forest700, ring = P.goldSoft, letterFill = P.parchment, accent = P.gold, seed = 11 } = {}) => {
  const w = 1200
  const h = 1200
  const cx = 600
  const cy = 470
  const rays = Array.from({ length: 13 }, (_, i) => {
    const a = Math.PI + (i / 12) * Math.PI
    const x = cx + Math.cos(a) * 720
    const y = cy + Math.sin(a) * 720
    return `<path d="M${cx} ${cy} L ${x.toFixed(1)} ${y.toFixed(1)}"/>`
  }).join('')
  return svgDoc(
    w,
    h,
    `
  <rect width="${w}" height="${h}" fill="${P.cream}"/>
  <clipPath id="arch"><path d="M120 1120 L120 520 C120 255, 335 90, 600 90 C865 90, 1080 255, 1080 520 L1080 1120 Z"/></clipPath>
  <g clip-path="url(#arch)">
    <rect width="${w}" height="${h}" fill="${bg}"/>
    <g stroke="${ring}" stroke-width="2" opacity="0.28">${rays}</g>
    <circle cx="${cx}" cy="${cy}" r="300" fill="${bg}"/>
    <circle cx="${cx}" cy="${cy}" r="300" fill="none" stroke="${ring}" stroke-width="3" opacity="0.85"/>
    <circle cx="${cx}" cy="${cy}" r="282" fill="none" stroke="${ring}" stroke-width="1.4" opacity="0.5"/>
    <text x="${cx}" y="${cy + 118}" text-anchor="middle" font-family="Fraunces" font-style="italic" font-size="340" fill="${letterFill}">${letter}</text>
    <g transform="translate(${cx - 190},878) scale(1.15)" fill="${ring}" opacity="0.9">${sparkle}</g>
    <g transform="translate(${cx + 190},878) scale(1.15)" fill="${ring}" opacity="0.9">${sparkle}</g>
    <g transform="translate(${cx - 252},902) scale(0.6)" fill="${ring}" opacity="0.55">${sparkle}</g>
    <g transform="translate(${cx + 252},902) scale(0.6)" fill="${ring}" opacity="0.55">${sparkle}</g>
    <g transform="translate(${cx},888) scale(1.05)" fill="${accent}">${paw}</g>
    <text x="${cx}" y="1042" text-anchor="middle" font-family="Fraunces" font-size="64" letter-spacing="20" fill="${ring}">${name.toUpperCase()}</text>
    ${grain(w, h, 0.045, seed)}
  </g>
  <path d="M120 1120 L120 520 C120 255, 335 90, 600 90 C865 90, 1080 255, 1080 520 L1080 1120 Z" fill="none" stroke="${P.forest}" stroke-opacity="0.14" stroke-width="2"/>`,
  )
}

/** Puppy plate (4:3) — collar-ribbon themed. */
const puppyPlate = (collarName, c, seed = 21) => {
  const w = 1200
  const h = 900
  return svgDoc(
    w,
    h,
    `
  <rect width="${w}" height="${h}" fill="${c.soft}"/>
  <defs>
    <linearGradient id="pp" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c.base}"/><stop offset="1" stop-color="${c.deep}"/>
    </linearGradient>
  </defs>
  <clipPath id="parch"><path d="M210 830 L210 430 C210 235, 368 100, 600 100 C832 100, 990 235, 990 430 L990 830 Z"/></clipPath>
  <g clip-path="url(#parch)">
    <rect width="${w}" height="${h}" fill="url(#pp)"/>
    <circle cx="600" cy="405" r="205" fill="none" stroke="${P.cream}" stroke-width="2.6" opacity="0.75"/>
    <circle cx="600" cy="405" r="190" fill="none" stroke="${P.cream}" stroke-width="1.2" opacity="0.45"/>
    <g transform="translate(600,430) scale(2.5)" fill="${P.cream}">${paw}</g>
    <rect x="210" y="672" width="780" height="64" fill="${P.cream}" opacity="0.94"/>
    <text x="600" y="716" text-anchor="middle" font-family="Fraunces" font-size="41" letter-spacing="15" fill="${c.deep}">${collarName.toUpperCase()} COLLAR</text>
    ${grain(w, h, 0.05, seed)}
  </g>
  <path d="M210 830 L210 430 C210 235, 368 100, 600 100 C832 100, 990 235, 990 430 L990 830 Z" fill="none" stroke="${c.deep}" stroke-opacity="0.35" stroke-width="2.5"/>
  ${tuft(120, 880, 1.0, c.deep, 0.5)}
  ${tuft(1085, 885, 1.1, c.deep, 0.5)}`,
  )
}

// ---------------------------------------------------------------------------
// Asset catalog

const assets = {}

// 1. Hero (3:4 portrait, arch-cropped by the site CSS)
assets['hero-meadow'] = { w: 1500, h: 2000, svg: svgDoc(1500, 2000, meadow(1500, 2000, { sunX: 0.5, sunY: 0.3, seed: 3 })) }

// 2. OG banner (1200×630) — meadow + lockup
assets['og-banner'] = {
  w: 1200,
  h: 630,
  svg: svgDoc(
    1200,
    630,
    `
  ${meadow(1200, 630, { sunX: 0.8, sunY: 0.3, withFence: true, seed: 5 })}
  <rect x="60" y="120" width="600" height="380" rx="18" fill="${P.cream}" opacity="0.96"/>
  <g transform="translate(360,235) scale(1.05)" fill="${P.forest}">${paw}</g>
  <text x="360" y="368" text-anchor="middle" font-family="Fraunces" font-size="57" fill="${P.forest}">Cirilli English Goldens</text>
  <text x="360" y="434" text-anchor="middle" font-family="Fraunces" font-style="italic" font-size="30" fill="${P.goldDark}">Suffolk, Virginia</text>`,
  ),
}

// 3. Dog plates
assets['dog-daisy'] = { w: 1200, h: 1200, svg: dogPlate('Daisy', 'D', { seed: 11 }) }
assets['dog-sadie'] = { w: 1200, h: 1200, svg: dogPlate('Sadie', 'S', { bg: '#465A48', seed: 12 }) }
assets['dog-cooper'] = { w: 1200, h: 1200, svg: dogPlate('Cooper', 'C', { bg: '#2F3A33', ring: '#D9C08B', seed: 13 }) }
assets['dog-juniper'] = { w: 1200, h: 1200, svg: dogPlate('Juniper', 'J', { bg: '#6E6A54', ring: P.parchment, accent: P.goldSoft, seed: 14 }) }

// 4. Puppy plates
for (const [name, c] of Object.entries(collars)) {
  assets[`puppy-${name}`] = { w: 1200, h: 900, svg: puppyPlate(name, c, 20 + name.length) }
}

// 5. Litter plate — four collar paws in a ring around a heart-of-the-nest sun
assets['litter-spring'] = {
  w: 1200,
  h: 900,
  svg: svgDoc(
    1200,
    900,
    `
  <rect width="1200" height="900" fill="${P.ivory}"/>
  <defs>
    <radialGradient id="nest" cx="0.5" cy="0.5" r="0.62">
      <stop offset="0" stop-color="${P.goldSoft}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${P.goldSoft}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="600" cy="420" r="360" fill="url(#nest)"/>
  <circle cx="600" cy="420" r="252" fill="none" stroke="${P.gold}" stroke-width="2.4" opacity="0.7"/>
  <circle cx="600" cy="420" r="236" fill="none" stroke="${P.gold}" stroke-width="1.1" opacity="0.4"/>
  <circle cx="600" cy="420" r="64" fill="none" stroke="${P.gold}" stroke-width="2" opacity="0.8"/>
  <text x="600" y="446" text-anchor="middle" font-family="Fraunces" font-style="italic" font-size="72" fill="${P.goldDark}">4</text>
  ${Object.values(collars)
    .map((c, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 2
      const x = 600 + Math.cos(a) * 168
      const y = 420 + Math.sin(a) * 168
      const rot = (a * 180) / Math.PI + 90
      return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(1.06)" fill="${c.base}">${paw}</g>`
    })
    .join('')}
  <text x="600" y="762" text-anchor="middle" font-family="Fraunces" font-size="56" fill="${P.forest}">The Meadow Litter</text>
  <text x="600" y="820" text-anchor="middle" font-family="Fraunces" font-style="italic" font-size="30" fill="${P.goldDark}">expected this spring</text>
  ${tuft(105, 875, 1.05, P.sage, 0.55)}
  ${tuft(1100, 880, 1.15, P.sage, 0.55)}
  ${grain(1200, 900, 0.04, 31)}`,
  ),
}

// 6. Gallery studies
assets['gallery-oak-hill'] = {
  w: 1400,
  h: 1050,
  svg: svgDoc(
    1400,
    1050,
    `
  ${meadow(1400, 1050, { sunX: 0.24, sunY: 0.3, withFence: false, seed: 41 })}
  <!-- oak on the mid hill -->
  <g transform="translate(950,640)">
    <path d="M -14 0 C -10 -60, -12 -110, -4 -150 L 10 -150 C 16 -108, 12 -58, 18 0 Z" fill="#2E3A2C"/>
    <path d="M -4 -150 C -30 -166, -52 -188, -58 -214 M 8 -152 C 34 -170, 52 -190, 58 -212" stroke="#2E3A2C" stroke-width="12" fill="none" stroke-linecap="round"/>
    <g fill="#3A4A38">
      <circle cx="-70" cy="-236" r="62"/><circle cx="0" cy="-268" r="80"/><circle cx="74" cy="-234" r="64"/>
      <circle cx="-30" cy="-208" r="58"/><circle cx="40" cy="-206" r="56"/>
    </g>
    <g fill="#465A48">
      <circle cx="-52" cy="-252" r="40"/><circle cx="14" cy="-282" r="48"/><circle cx="66" cy="-250" r="38"/>
    </g>
  </g>`,
  ),
}

assets['gallery-dusk'] = {
  w: 1400,
  h: 1050,
  svg: svgDoc(1400, 1050, meadow(1400, 1050, { dusk: true, sunX: 0.5, sunY: 0.42, withFence: true, seed: 43 })),
}

assets['gallery-goldenrod'] = {
  w: 1050,
  h: 1400,
  svg: svgDoc(
    1050,
    1400,
    `
  <rect width="1050" height="1400" fill="${P.ivory}"/>
  <circle cx="525" cy="560" r="330" fill="${P.goldSoft}" opacity="0.28"/>
  ${wheat(430, 1180, 3.4, P.gold)}
  ${wheat(560, 1220, 2.6, P.goldDark)}
  ${wheat(640, 1180, 2.0, '#D9C08B')}
  ${tuft(320, 1240, 2.1, P.sage, 0.8)}
  ${tuft(700, 1255, 1.8, P.sage, 0.7)}
  <text x="525" y="1330" text-anchor="middle" font-family="Fraunces" font-style="italic" font-size="42" fill="${P.forest}">goldenrod, early autumn</text>
  ${grain(1050, 1400, 0.04, 47)}`,
  ),
}

assets['gallery-paw-quilt'] = {
  w: 1400,
  h: 1050,
  svg: svgDoc(
    1400,
    1050,
    `
  <rect width="1400" height="1050" fill="${P.forest}"/>
  ${Array.from({ length: 5 }, (_, r) =>
    Array.from({ length: 7 }, (_, cIdx) => {
      const x = 120 + cIdx * 195 + (r % 2 ? 95 : 0)
      const y = 120 + r * 205
      const tone = (r + cIdx) % 3 === 0 ? P.gold : (r + cIdx) % 3 === 1 ? P.goldSoft : P.sageLight
      const op = (r + cIdx) % 3 === 2 ? 0.5 : 0.9
      return `<g transform="translate(${x},${y}) scale(1.05) rotate(${((r * 7 + cIdx * 11) % 14) - 7})" fill="${tone}" opacity="${op}">${paw}</g>`
    }).join(''),
  ).join('')}
  ${grain(1400, 1050, 0.05, 53)}`,
  ),
}

assets['gallery-crest'] = {
  w: 1050,
  h: 1400,
  svg: svgDoc(
    1050,
    1400,
    `
  <rect width="1050" height="1400" fill="${P.cream}"/>
  <circle cx="525" cy="600" r="352" fill="${P.ivory}"/>
  <circle cx="525" cy="600" r="352" fill="none" stroke="${P.gold}" stroke-width="3"/>
  <circle cx="525" cy="600" r="332" fill="none" stroke="${P.gold}" stroke-width="1.2" opacity="0.6"/>
  <g transform="translate(330,540) scale(1.5)" fill="${P.gold}" opacity="0.85">${sparkle}</g>
  <g transform="translate(720,540) scale(1.5)" fill="${P.gold}" opacity="0.85">${sparkle}</g>
  <g transform="translate(380,430) scale(0.8)" fill="${P.sage}" opacity="0.7">${sparkle}</g>
  <g transform="translate(672,432) scale(0.8)" fill="${P.sage}" opacity="0.7">${sparkle}</g>
  <g transform="translate(525,520) scale(2.3)" fill="${P.forest}">${paw}</g>
  <text x="525" y="760" text-anchor="middle" font-family="Fraunces" font-size="64" fill="${P.forest}">Cirilli</text>
  <text x="525" y="836" text-anchor="middle" font-family="Fraunces" font-style="italic" font-size="44" fill="${P.goldDark}">English Goldens</text>
  <text x="525" y="1075" text-anchor="middle" font-family="Fraunces" font-size="30" letter-spacing="12" fill="${P.charcoal}">SUFFOLK · VIRGINIA</text>
  <path d="M 315 1120 L 735 1120" stroke="${P.gold}" stroke-width="2"/>
  <text x="525" y="1180" text-anchor="middle" font-family="Fraunces" font-style="italic" font-size="30" fill="${P.charcoal}" opacity="0.75">raised gently, placed thoughtfully</text>
  ${grain(1050, 1400, 0.035, 59)}`,
  ),
}

// ---------------------------------------------------------------------------
// Render
for (const [name, a] of Object.entries(assets)) {
  const svgPath = path.join(OUT_SVG, `${name}.svg`)
  writeFileSync(svgPath, a.svg)
  const px = Math.max(a.w, a.h) >= 1400 ? 1 : 1 // rasterize at natural size
  await sharp(Buffer.from(a.svg), { density: 96 * px })
    .resize(a.w, a.h)
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(OUT_JPG, `${name}.jpg`))
  console.log('✓', name)
}
console.log('done →', OUT_JPG)
