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
              <Image
                src={allSlides[currentIndex].image}
                alt={allSlides[currentIndex].title}
                fill
                style={{ objectFit: 'contain' }}
                priority
                quality={100}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {allSlides[currentIndex].title}
                </h3>
                <p className="text-white/90">
                  {allSlides[currentIndex].description}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <button
        className="absolute -left-8 top-1/2 transform -translate-y-1/2 bg-gray-900 rounded-full p-2 transition-colors z-20 cursor-pointer"
        onClick={() => {
          setDirection(-1);
          paginate(-1);
        }}
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-6 w-6 text-white" />
      </button>
      <button
        className="absolute -right-8 top-1/2 transform -translate-y-1/2 bg-gray-900 rounded-full p-2 transition-colors z-20 cursor-pointer"
        onClick={() => {
          setDirection(1);
          paginate(1);
        }}
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-6 w-6 text-white" />
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {allSlides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
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
