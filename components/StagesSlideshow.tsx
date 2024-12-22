import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Stage {
  title: string;
  imagePath: string;
}

interface StagesSlideshowProps {
  stages: Stage[];
  autoplayInterval?: number;
}

export default function StagesSlideshow({ stages, autoplayInterval = 5000 }: StagesSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % stages.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [isAutoplay, stages.length, autoplayInterval]);

  const handlePrevious = () => {
    setIsAutoplay(false);
    setCurrentIndex((current) => (current - 1 + stages.length) % stages.length);
  };

  const handleNext = () => {
    setIsAutoplay(false);
    setCurrentIndex((current) => (current + 1) % stages.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-xl border border-gray-200">
      {/* Fixed aspect ratio container - using 4:3 ratio for more height */}
      <div className="relative w-full" style={{ paddingBottom: '75%' }}> {/* 4:3 aspect ratio */}
        <div className="absolute inset-0 bg-gray-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full"
            >
              <img
                src={stages[currentIndex].imagePath}
                alt={stages[currentIndex].title}
                className="absolute inset-0 w-full h-full object-contain bg-white" // Changed to object-contain
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-white text-xl font-semibold">
                  {stages[currentIndex].title}
                </h3>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-200"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-200"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {stages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoplay(false);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
