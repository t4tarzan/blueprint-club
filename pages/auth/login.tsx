import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { ReactElement } from 'react';
import { AuthLayout } from '@/components/layouts';
import type { NextPageWithLayout } from '@/types';
import { Login as LoginComponent } from '@/components/auth';

const Login: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  csrfToken,
}) => {
  return <LoginComponent csrfToken={csrfToken} />;
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { locale } = context;

  return {
    props: {
      csrfToken: await getCsrfToken(context),
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export default Login;
