import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';

interface Team {
  id: string;
  slug: string;
  updatedAt: Date;
}

function generateSiteMap(teams: Team[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${process.env.NEXTAUTH_URL}</loc>
     </url>
     <url>
       <loc>${process.env.NEXTAUTH_URL}/teams</loc>
     </url>
     ${teams
       .map(({ slug, updatedAt }) => {
         return `
       <url>
           <loc>${`${process.env.NEXTAUTH_URL}/teams/${slug}`}</loc>
           <lastmod>${updatedAt.toISOString()}</lastmod>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const teams = await prisma.team.findMany({
    select: {
      id: true,
      slug: true,
      updatedAt: true,
    },
  });

  const sitemap = generateSiteMap(teams);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default function Sitemap() {
  return null;
}
