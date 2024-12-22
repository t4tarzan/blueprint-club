import React from 'react';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
      <span className="text-gray-500">{message}</span>
    </div>
  );
};
