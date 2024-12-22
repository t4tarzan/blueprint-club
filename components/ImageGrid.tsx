import Image from 'next/image';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface Stage {
  title: string;
  description: string;
  image?: string;
}

interface ImageGridProps {
  stages: Stage[];
  overviewImage: string;
}

const ImageGrid: React.FC<ImageGridProps> = ({ stages, overviewImage }) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const allImages = [
    { title: 'Overview', image: overviewImage },
    ...stages.filter(stage => stage.image)
  ];

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(src);
      if (newSet.size === allImages.length) {
        setIsLoading(false);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="w-full aspect-[16/9] flex items-center justify-center bg-gray-100 rounded-lg">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Grid container with responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {allImages.map((item, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] rounded-lg overflow-hidden group hover:shadow-lg transition-shadow duration-300"
          >
            {item.image && (
              <>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onLoad={() => handleImageLoad(item.image!)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold px-4 text-center">
                    {item.title}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
