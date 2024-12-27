import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import type { NextPageWithLayout } from '@/types';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';
import '@/styles/globals.css';
import 'katex/dist/katex.min.css';
import { Kalam } from 'next/font/google';

const kalam = Kalam({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-kalam',
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <ErrorBoundary>
      <SessionProvider 
        session={session}
        refetchInterval={0}
        refetchOnWindowFocus={false}
      >
        <div className={`${kalam.variable}`}>
          {getLayout(<Component {...pageProps} />)}
          <Toaster />
        </div>
      </SessionProvider>
    </ErrorBoundary>
  );
}

export default appWithTranslation(MyApp);
