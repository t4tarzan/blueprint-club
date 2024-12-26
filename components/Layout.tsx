import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Footer from './Footer';
import { Meta } from './Meta';
import { OrganizationSchema } from './JsonLd';

interface LayoutProps {
  children: ReactNode;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogUrl?: string;
    noIndex?: boolean;
  };
}

const Layout = ({ children, meta }: LayoutProps) => {
  const router = useRouter();
  const isDashboardPage = router.pathname.startsWith('/dashboard');
  const isSocialPage = router.pathname.startsWith('/social');
  const isAITutorPage = router.pathname.startsWith('/aitutor');
  const showNavbar = !isDashboardPage && !isSocialPage && !isAITutorPage;

  return (
    <div className="min-h-screen flex flex-col">
      <Meta {...meta} />
      <OrganizationSchema />
      {showNavbar && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {showNavbar && <Footer />}
    </div>
  );
};

export default Layout;
