// Rasterize art/*.svg to JPG/PNG for seeding + preview.
import sharp from 'sharp'
import { readdirSync } from 'fs'
import path from 'path'

const artDir = new URL('.', import.meta.url).pathname
const outDir = process.argv[2] || '/tmp/artcheck'
const only = process.argv[3]

for (const f of readdirSync(artDir).filter((f) => f.endsWith('.svg'))) {
  if (only && !f.includes(only)) continue
  const name = path.basename(f, '.svg')
  const input = path.join(artDir, f)
  await sharp(input, { density: 160 })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(outDir, `${name}.jpg`))
  console.log('rasterized', name)
}
