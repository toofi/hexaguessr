/**
 * Regenerates PWA PNG icons from the source SVGs.
 *
 *   public/icons/icon.svg            → icon-192.png, icon-512.png  (purpose: any)
 *   public/icons/icon-maskable.svg   → icon-maskable-512.png       (purpose: maskable)
 *
 * Run with:  node scripts/generate-icons.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = resolve(__dirname, '..', 'public', 'icons');

const targets = [
  { src: 'icon.svg', out: 'icon-192.png', size: 192 },
  { src: 'icon.svg', out: 'icon-512.png', size: 512 },
  { src: 'icon-maskable.svg', out: 'icon-maskable-512.png', size: 512 },
  { src: 'icon.svg', out: 'apple-touch-icon.png', size: 180 },
];

for (const { src, out, size } of targets) {
  const svg = await readFile(resolve(iconsDir, src));
  const png = await sharp(svg).resize(size, size).png().toBuffer();
  await writeFile(resolve(iconsDir, out), png);
  console.log(`✓ ${out} (${size}x${size})`);
}
