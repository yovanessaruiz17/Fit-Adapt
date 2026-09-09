import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Base SVG Icon (Brand: FitAdapt - Adaptive Shield & Dynamic Pulse)
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#134e4a" />
      <stop offset="100%" stop-color="#042f2e" />
    </linearGradient>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14b8a6" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background with subtle rounded corners for standard view -->
  <rect width="512" height="512" rx="108" fill="url(#bgGrad)" />

  <!-- Hexagonal Biomechanical Shield Border -->
  <path d="M 256 64 L 416 144 L 416 320 L 256 448 L 96 320 L 96 144 Z"
        fill="none" stroke="url(#brandGrad)" stroke-width="12" stroke-linejoin="round" opacity="0.4" />

  <!-- Inner Protective Adaptive Shield -->
  <path d="M 256 94 L 384 160 L 384 304 L 256 414 L 128 304 L 128 160 Z"
        fill="#042f2e" stroke="url(#brandGrad)" stroke-width="16" stroke-linejoin="round" />

  <!-- Dynamic Adaptive Pulse & Motion Symbol (Biomechanics + Progress) -->
  <!-- Left wing / barbell node -->
  <circle cx="196" cy="256" r="24" fill="url(#brandGrad)" />
  <!-- Right wing / barbell node -->
  <circle cx="316" cy="256" r="24" fill="url(#brandGrad)" />
  
  <!-- Central Energy Core / Ascending Barbell Bar with Dynamic Crest -->
  <path d="M 196 256 L 232 256 L 256 184 L 276 312 L 296 256 L 316 256"
        fill="none" stroke="#f8fafc" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)" />

  <!-- Top Crown: Adaptive Precision Marker -->
  <circle cx="256" cy="144" r="16" fill="url(#accentGrad)" />

  <!-- Bottom Stability Dot -->
  <circle cx="256" cy="360" r="12" fill="#14b8a6" />
</svg>`;

// 2. Maskable SVG Icon (Safe zone margin: elements concentrated within central 75% circle, full-bleed bg)
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgMaskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#134e4a" />
      <stop offset="100%" stop-color="#042f2e" />
    </linearGradient>
    <linearGradient id="brandMaskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14b8a6" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
  </defs>

  <!-- Full bleed background for Android maskable cropping -->
  <rect width="512" height="512" fill="url(#bgMaskGrad)" />

  <!-- Scaled content inside safe zone (0.76 scale centered at 256, 256) -->
  <g transform="translate(61.44, 61.44) scale(0.76)">
    <!-- Hexagonal Biomechanical Shield Border -->
    <path d="M 256 64 L 416 144 L 416 320 L 256 448 L 96 320 L 96 144 Z"
          fill="none" stroke="url(#brandMaskGrad)" stroke-width="14" stroke-linejoin="round" opacity="0.4" />

    <!-- Inner Shield -->
    <path d="M 256 94 L 384 160 L 384 304 L 256 414 L 128 304 L 128 160 Z"
          fill="#042f2e" stroke="url(#brandMaskGrad)" stroke-width="18" stroke-linejoin="round" />

    <circle cx="196" cy="256" r="26" fill="url(#brandMaskGrad)" />
    <circle cx="316" cy="256" r="26" fill="url(#brandMaskGrad)" />
    
    <path d="M 196 256 L 232 256 L 256 184 L 276 312 L 296 256 L 316 256"
          fill="none" stroke="#ffffff" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" />

    <circle cx="256" cy="144" r="18" fill="#10b981" />
    <circle cx="256" cy="360" r="14" fill="#14b8a6" />
  </g>
</svg>`;

async function run() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);
  console.log('Created public/icon.svg');

  const svgBuffer = Buffer.from(svgIcon);
  const maskableBuffer = Buffer.from(svgMaskable);

  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Created public/pwa-192x192.png');

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Created public/pwa-512x512.png');

  // 512x512 maskable
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Created public/pwa-maskable-512x512.png');

  // 180x180 apple-touch-icon (iOS PNG requirement)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created public/apple-touch-icon.png');

  // 64x64 favicon.ico / png
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Created public/favicon.ico');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
