import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface Stage {
  title: string;
  description: string;
  image?: string;
}

interface StagesSlideshowProps {
  stages: Stage[];
  overviewImage: string;
}

const StagesSlideshow: React.FC<StagesSlideshowProps> = ({ stages, overviewImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  const allSlides = [
    { title: 'Overview', description: '', image: overviewImage },
    ...stages
  ];

  // Preload images
  useEffect(() => {
    const preloadImage = (src: string) => {
      if (!src || preloadedImages.has(src)) return;
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, src]));
      };
    };

    // Preload current, next, and previous images
    const preloadImages = () => {
      const imagesToPreload = [
        currentIndex,
        (currentIndex + 1) % allSlides.length,
        (currentIndex - 1 + allSlides.length) % allSlides.length
      ];

      imagesToPreload.forEach(index => {
        const image = allSlides[index]?.image;
        if (image) preloadImage(image);
      });
    };

    preloadImages();
  }, [currentIndex, allSlides, preloadedImages]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    }),
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const paginate = (newDirection: number) => {
    setIsLoading(true);
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = allSlides.length - 1;
      if (nextIndex >= allSlides.length) nextIndex = 0;
      return nextIndex;
    });
  };

  return (
    <div className="relative w-[800px] h-[500px] bg-gray-900 rounded-xl mx-auto">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute w-full h-full"
          >
            <div className="relative w-full h-full">
              {allSlides[currentIndex].image && (
                <>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                      <LoadingSpinner />
                    </div>
                  )}
                  <Image
                    src={allSlides[currentIndex].image || ''}
                    alt={allSlides[currentIndex].title}
                    fill
                    priority={currentIndex === 0}
                    quality={75}
                    sizes="(max-width: 800px) 100vw, 800px"
                    className="object-contain"
                    loading={currentIndex < 3 ? "eager" : "lazy"}
                    onLoadingComplete={() => setIsLoading(false)}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHSIeHx8dIigjJCUmJSQkIiYnLC4sJiYnNTU4ODU+QkJCQjpDRUs5Rk1LS0v/2wBDAR"
                  />
                </>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
                <h3 className="text-xl font-semibold mb-2">{allSlides[currentIndex].title}</h3>
                <p className="text-sm opacity-90">{allSlides[currentIndex].description}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-30 hover:bg-opacity-50 transition-all"
        onClick={() => paginate(-1)}
        disabled={isLoading}
      >
        <ChevronLeftIcon className="w-6 h-6 text-white" />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-30 hover:bg-opacity-50 transition-all"
        onClick={() => paginate(1)}
        disabled={isLoading}
      >
        <ChevronRightIcon className="w-6 h-6 text-white" />
      </button>

      {/* Progress dots */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2">
        {allSlides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
            }`}
            onClick={() => {
              if (!isLoading) {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }
            }}
            disabled={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default StagesSlideshow;
