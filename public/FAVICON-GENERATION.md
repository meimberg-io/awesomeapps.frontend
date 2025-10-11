# Favicon Generation Guide

## Current Status
You have some favicons but may want to regenerate them all from a source file.

## Required Favicons for Modern Web Apps

### ✅ Already Have:
- `apple-touch-icon.png` (180x180)
- `favicon-96x96.png` (96x96)
- `web-app-manifest-192x192.png` (192x192)
- `web-app-manifest-512x512.png` (512x512)

### ❌ Missing:
- `favicon.ico` (multi-size: 16x16, 32x32, 48x48)
- `favicon.svg` (vector, recommended)
- `favicon-16x16.png`
- `favicon-32x32.png`

---

## Option 1: Using the Script (Recommended)

### Step 1: Create favicon.svg
Place your logo/icon as `public/favicon.svg`

### Step 2: Run the generation script
```bash
node scripts/generate-favicons.js
```

This will generate all PNG sizes automatically.

### Step 3: Generate favicon.ico
Use an online tool or:
```bash
npm install --global to-ico-cli
to-ico public/favicon-32x32.png > public/favicon.ico
```

---

## Option 2: Online Tool (Easiest)

Visit: **https://realfavicongenerator.net/**

1. Upload your logo (SVG, PNG, or JPG)
2. Customize settings
3. Download the generated package
4. Extract all files to `/public` folder

---

## Option 3: Use Figma/Design Tool

If you're creating a new logo:

1. Design in Figma/Sketch/Illustrator
2. Export as SVG (512x512 artboard)
3. Save to `public/favicon.svg`
4. Run generation script

---

## SVG Favicon Template

If you need to create a simple favicon.svg:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#2563eb"/>
  <text 
    x="50%" 
    y="50%" 
    dominant-baseline="middle" 
    text-anchor="middle" 
    font-size="320" 
    fill="white" 
    font-weight="bold"
    font-family="Arial, sans-serif">
    A
  </text>
</svg>
```

Save this as `public/favicon.svg` and run the script!

---

## Browser Support

Different browsers need different sizes:

| File | Size | Used By |
|------|------|---------|
| favicon.ico | 16,32,48 | Old browsers, Windows |
| favicon-16x16.png | 16x16 | Browser tabs |
| favicon-32x32.png | 32x32 | Browser tabs (retina) |
| favicon-96x96.png | 96x96 | Google TV |
| apple-touch-icon.png | 180x180 | iOS home screen |
| web-app-manifest-192x192.png | 192x192 | Android home screen |
| web-app-manifest-512x512.png | 512x512 | Android splash screen |
| favicon.svg | Vector | Modern browsers |

---

## After Generation

Update `src/app/layout.tsx` to include all icons:

```tsx
export const metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
}
```

---

## Quick Start

**Don't have a logo yet?**

Use this placeholder:
```bash
# Download a placeholder
curl https://via.placeholder.com/512/2563eb/ffffff?text=A -o public/favicon.svg

# Or create the template above
```

Then run:
```bash
node scripts/generate-favicons.js
```

Done! 🎉

