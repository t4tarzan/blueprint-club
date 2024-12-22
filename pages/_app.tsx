import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import type { NextPageWithLayout } from '@/types';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/globals.css';

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
        {getLayout(<Component {...pageProps} />)}
        <Toaster />
      </SessionProvider>
    </ErrorBoundary>
  );
}

export default appWithTranslation(MyApp);
