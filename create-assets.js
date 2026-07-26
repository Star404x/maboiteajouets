const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = './public';

async function createAssets() {
  try {
    // 1. Create favicon.ico
    const faviconSvg = `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#FFF9F1"/>
      <rect x="12" y="16" width="40" height="32" fill="#F45168" rx="4"/>
      <rect x="16" y="20" width="8" height="8" fill="#FFD700" rx="1"/>
      <rect x="28" y="20" width="8" height="8" fill="#00CED1" rx="1"/>
      <rect x="40" y="20" width="8" height="8" fill="#90EE90" rx="1"/>
      <path d="M 20 32 L 18 44 Q 18 48 22 48 L 42 48 Q 46 48 46 44 L 44 32" fill="#102A4C" stroke="#102A4C" stroke-width="1"/>
    </svg>`;

    await sharp(Buffer.from(faviconSvg))
      .resize(64, 64)
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));
    console.log('✅ favicon.ico created');

    // 2. Create apple-touch-icon.png
    const appleSvg = `<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
      <rect width="180" height="180" fill="#FFF9F1" rx="40"/>
      <rect x="36" y="48" width="108" height="84" fill="#F45168" rx="12"/>
      <rect x="48" y="60" width="24" height="24" fill="#FFD700" rx="4"/>
      <rect x="84" y="60" width="24" height="24" fill="#00CED1" rx="4"/>
      <rect x="120" y="60" width="24" height="24" fill="#90EE90" rx="4"/>
      <path d="M 60 90 L 54 132 Q 54 144 66 144 L 114 144 Q 126 144 126 132 L 120 90" fill="#102A4C"/>
    </svg>`;

    await sharp(Buffer.from(appleSvg))
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✅ apple-touch-icon.png created');

    // 3. Create og-image.jpg
    const ogSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFF9F1;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FFF0E6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgGradient)"/>
      <rect x="60" y="80" width="1080" height="470" fill="#F45168" rx="20" opacity="0.95"/>
      <text x="600" y="180" font-family="Fredoka,Arial,sans-serif" font-size="72" font-weight="700" text-anchor="middle" fill="white">Ma Boîte à Jouets</text>
      <text x="600" y="270" font-family="Nunito,Arial,sans-serif" font-size="48" text-anchor="middle" fill="white">Jouets premium pour enfants</text>
      <rect x="150" y="320" width="180" height="180" fill="#FFD700" rx="12"/>
      <rect x="450" y="320" width="180" height="180" fill="#00CED1" rx="12"/>
      <rect x="750" y="320" width="180" height="180" fill="#90EE90" rx="12"/>
      <text x="600" y="560" font-family="Nunito,Arial,sans-serif" font-size="28" text-anchor="middle" fill="#102A4C">Le bonheur commence ici 🧸</text>
    </svg>`;

    await sharp(Buffer.from(ogSvg))
      .resize(1200, 630)
      .jpeg({ quality: 90 })
      .toFile(path.join(publicDir, 'og-image.jpg'));
    console.log('✅ og-image.jpg created');

    console.log('\n✅ All assets created successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAssets();
