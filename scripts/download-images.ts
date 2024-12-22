const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');

const imageUrls = {
  hero: {
    main: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    pattern: '/background-pattern.svg',
  },
  programs: {
    'bpc-adults': {
      hero: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
      overview: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
    },
    'bpc-schooling': {
      hero: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
      overview: 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
    },
    'bpcas': {
      hero: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      overview: 'https://images.unsplash.com/photo-1581472723648-909f4851d4ae',
    },
    'white-noise': {
      hero: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
      overview: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae',
    },
  },
};

async function downloadAndOptimizeImage(url, outputPath, options = {}) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Process with sharp
    await sharp(buffer)
      .resize(options)
      .jpeg({ quality: 85 })
      .toFile(outputPath);

    console.log(`✅ Downloaded and optimized: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error processing ${url}:`, error);
  }
}

async function downloadAllImages() {
  const publicDir = path.join(process.cwd(), 'public');

  // Download hero images
  await downloadAndOptimizeImage(
    imageUrls.hero.main,
    path.join(publicDir, 'images/hero/main-hero.jpg'),
    { width: 1920, height: 1080, fit: 'cover' }
  );

  // Download program images
  for (const [program, images] of Object.entries(imageUrls.programs)) {
    for (const [type, url] of Object.entries(images)) {
      await downloadAndOptimizeImage(
        url,
        path.join(publicDir, `images/programs/${program}/${type}.jpg`),
        type === 'hero' 
          ? { width: 1200, height: 800, fit: 'cover' }
          : { width: 800, height: 600, fit: 'cover' }
      );
    }
  }
}

downloadAllImages().catch(console.error);
