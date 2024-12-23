import { getPlaiceholder } from 'plaiceholder';
import type { ImageProps } from 'next/image';

export interface BlurImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
  blurDataURL?: string;
}

export async function getImagePlaceholder(src: string | Buffer): Promise<string> {
  try {
    if (typeof src === 'string') {
      const response = await fetch(src);
      const buffer = Buffer.from(await response.arrayBuffer());
      const { base64 } = await getPlaiceholder(buffer);
      return base64;
    }
    const { base64 } = await getPlaiceholder(src);
    return base64;
  } catch (err) {
    console.error('Error generating placeholder:', err);
    return '';
  }
}

export async function getImageDimensions(src: string | Buffer): Promise<{ width: number; height: number }> {
  try {
    if (typeof src === 'string') {
      const response = await fetch(src);
      const buffer = Buffer.from(await response.arrayBuffer());
      const { metadata } = await getPlaiceholder(buffer);
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
      };
    }
    const { metadata } = await getPlaiceholder(src);
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
    };
  } catch (err) {
    console.error('Error getting image dimensions:', err);
    return { width: 0, height: 0 };
  }
}

export async function getImageProps(
  src: string | Buffer,
  alt: string = ''
): Promise<BlurImageProps> {
  try {
    if (typeof src === 'string') {
      const response = await fetch(src);
      const buffer = Buffer.from(await response.arrayBuffer());
      const { base64, metadata } = await getPlaiceholder(buffer);
      return {
        src,
        alt,
        width: metadata.width || 0,
        height: metadata.height || 0,
        blurDataURL: base64,
        placeholder: 'blur',
      };
    }
    const { base64, metadata } = await getPlaiceholder(src);
    return {
      src: '',  // Buffer input requires external source URL
      alt,
      width: metadata.width || 0,
      height: metadata.height || 0,
      blurDataURL: base64,
      placeholder: 'blur',
    };
  } catch (err) {
    console.error('Error getting image props:', err);
    return {
      src: typeof src === 'string' ? src : '',
      alt,
      width: 0,
      height: 0,
    };
  }
}

export const imageDefaults = {
  hero: {
    width: 1920,
    height: 1080,
  },
  thumbnail: {
    width: 400,
    height: 300,
  },
  avatar: {
    width: 128,
    height: 128,
  },
};
