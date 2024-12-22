import { GetServerSideProps } from 'next';
import { prisma } from '../lib/prisma';

const SITE_URL = 'https://blueprintclub.com';

function generateSiteMap(programs) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static Pages -->
      <url>
        <loc>${SITE_URL}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${SITE_URL}/about</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>${SITE_URL}/contact</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
      
      <!-- Program Pages -->
      <url>
        <loc>${SITE_URL}/bpc-adults</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${SITE_URL}/bpc-schooling</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${SITE_URL}/bpcas</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${SITE_URL}/white-noise-academy</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>

      <!-- Dynamic Program Pages -->
      ${programs
        .map(({ slug }) => {
          return `
            <url>
              <loc>${SITE_URL}/programs/${slug}</loc>
              <changefreq>weekly</changefreq>
              <priority>0.7</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;
}

function SiteMap() {
  // getServerSideProps will handle the XML generation
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Get dynamic programs from database
  const programs = await prisma.program.findMany({
    select: {
      slug: true,
    },
  });

  // Generate sitemap XML
  const sitemap = generateSiteMap(programs);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
