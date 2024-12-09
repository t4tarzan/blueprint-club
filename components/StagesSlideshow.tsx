import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useState } from 'react';

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

  const allSlides = [
    { title: 'Overview', description: '', image: overviewImage },
    ...stages
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = allSlides.length - 1;
      if (nextIndex >= allSlides.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (e.deltaX > 0) {
        paginate(1);
      } else {
        paginate(-1);
      }
    }
  };

  return (
    <div className="relative w-[800px] h-[500px] bg-gray-900 rounded-xl mx-auto">
      <div 
        className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl"
        onWheel={handleWheel}
      >
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
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full h-full"
            style={{ pointerEvents: 'auto', touchAction: 'pan-y' }}
          >
            <div className="relative w-full h-full">
              {allSlides[currentIndex].image && (
                <Image
                  src={allSlides[currentIndex].image || ''}
                  alt={allSlides[currentIndex].title}
                  fill
                  priority={currentIndex === 0}
                  quality={75}
                  sizes="(max-width: 800px) 100vw, 800px"
                  className="object-contain"
                  loading={currentIndex < 3 ? "eager" : "lazy"}
                />
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
      >
        <ChevronLeftIcon className="w-6 h-6 text-white" />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-30 hover:bg-opacity-50 transition-all"
        onClick={() => paginate(1)}
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
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StagesSlideshow;
