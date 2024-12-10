import React from 'react';

interface LoadingSpinnerProps {
  progress?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ progress }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      {typeof progress === 'number' && (
        <div className="text-white text-sm">
          Loading {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
