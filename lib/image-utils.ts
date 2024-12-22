import { getPlaiceholder } from 'plaiceholder';
import type { ImageProps } from 'next/image';

export interface BlurImageProps extends ImageProps {
  blurDataURL?: string;
}

export async function getImageProps(src: string): Promise<BlurImageProps> {
  try {
    const { base64, img } = await getPlaiceholder(src, { size: 10 });

    return {
      ...img,
      blurDataURL: base64,
    };
  } catch (error) {
    console.error('Error generating blur data:', error);
    return { src } as BlurImageProps;
  }
}

export const imageDefaults = {
  hero: {
    width: 1920,
    height: 1080,
    quality: 90,
  },
  program: {
    width: 800,
    height: 600,
    quality: 85,
  },
  thumbnail: {
    width: 400,
    height: 300,
    quality: 80,
  },
};

export const programImages = {
  'bpc-adults': {
    hero: '/images/programs/bpc-adults/hero.jpg',
    overview: '/images/programs/bpc-adults/overview.jpg',
    phases: [
      '/images/programs/bpc-adults/phases/phase1.jpg',
      '/images/programs/bpc-adults/phases/phase2.jpg',
      '/images/programs/bpc-adults/phases/phase3.jpg',
    ],
  },
  'bpc-schooling': {
    hero: '/images/programs/bpc-schooling/hero.jpg',
    overview: '/images/programs/bpc-schooling/overview.jpg',
    phases: [
      '/images/programs/bpc-schooling/phases/phase1.jpg',
      '/images/programs/bpc-schooling/phases/phase2.jpg',
      '/images/programs/bpc-schooling/phases/phase3.jpg',
    ],
  },
  'bpcas': {
    hero: '/images/programs/bpcas/hero.jpg',
    overview: '/images/programs/bpcas/overview.jpg',
    phases: [
      '/images/programs/bpcas/phases/phase1.jpg',
      '/images/programs/bpcas/phases/phase2.jpg',
      '/images/programs/bpcas/phases/phase3.jpg',
    ],
  },
  'white-noise': {
    hero: '/images/programs/white-noise/hero.jpg',
    overview: '/images/programs/white-noise/overview.jpg',
    phases: [
      '/images/programs/white-noise/phases/phase1.jpg',
      '/images/programs/white-noise/phases/phase2.jpg',
      '/images/programs/white-noise/phases/phase3.jpg',
    ],
  },
};
