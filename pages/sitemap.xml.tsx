import { GetServerSideProps } from 'next';

function generateSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${process.env.NEXTAUTH_URL}</loc>
     </url>
     <url>
       <loc>${process.env.NEXTAUTH_URL}/teams</loc>
     </url>
     <url>
       <loc>${process.env.NEXTAUTH_URL}/about</loc>
     </url>
     <url>
       <loc>${process.env.NEXTAUTH_URL}/contact</loc>
     </url>
     <url>
       <loc>${process.env.NEXTAUTH_URL}/pricing</loc>
     </url>
   </urlset>
 `;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateSiteMap();

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
