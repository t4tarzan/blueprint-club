import React from 'react';
import { Error } from './Error';
import { Loading } from './Loading';

interface WithLoadingAndErrorProps {
  loading?: boolean;
  error?: string;
  children: React.ReactNode;
}

export const WithLoadingAndError: React.FC<WithLoadingAndErrorProps> = ({
  loading,
  error,
  children,
}) => {
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  return <>{children}</>;
};
