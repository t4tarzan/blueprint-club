import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { ReactElement } from 'react';
import { AuthLayout } from '@/components/layouts';
import type { NextPageWithLayout } from '@/types';
import { Join as JoinComponent } from '@/components/auth';

const Join: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  csrfToken,
}) => {
  return <JoinComponent csrfToken={csrfToken} />;
};

Join.getLayout = function getLayout(page: ReactElement) {
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

export default Join;
