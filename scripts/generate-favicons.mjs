import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'web-app-manifest-192x192.png', size: 192 },
  { name: 'web-app-manifest-512x512.png', size: 512 },
];

const inputFile = path.join(__dirname, '../public/favicon.svg');
const outputDir = path.join(__dirname, '../public');

async function generateFavicons() {
  console.log('ðŸŽ¨ Generating favicons...\n');

  if (!fs.existsSync(inputFile)) {
    console.error('âŒ Error: favicon.svg not found in public folder!');
    process.exit(1);
  }

  try {
    const svg = fs.readFileSync(inputFile);
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 512 } });
    const pngData = resvg.render().asPng();

    for (const { name, size } of sizes) {
      const outputPath = path.join(outputDir, name);
      await sharp(pngData).resize(size, size).png().toFile(outputPath);
      console.log(`âœ… Generated ${name} (${size}x${size})`);
    }

    console.log('\nâœ¨ All favicons generated successfully!');
  } catch (error) {
    console.error('âŒ Error:', error.message);
    process.exit(1);
  }
}

generateFavicons();
