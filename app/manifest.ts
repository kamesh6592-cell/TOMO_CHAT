import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AJ STUDIOZ - AI Research Engine',
    short_name: 'AJ STUDIOZ',
    description:
      'AJ STUDIOZ - Your intelligent AI research companion. Fast, accurate, and powerful search engine powered by advanced AI models.',
    start_url: '/',
    display: 'standalone',
    categories: ['search', 'ai', 'productivity'],
    background_color: '#FF0000',
    icons: [
      {
        src: '/icon-maskable.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/opengraph-image.png',
        type: 'image/png',
        sizes: '1200x630',
      },
    ],
  };
}
