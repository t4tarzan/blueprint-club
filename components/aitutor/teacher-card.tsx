import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TeacherCardProps {
  teacher: 'math' | 'science';
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  isSelected,
  onSelect,
  disabled
}) => {
  const teachers = {
    math: {
      name: 'Mr. David',
      title: 'Mathematics',
      image: '/images/avatars/math-tutor.jpg',
      fallbackImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=math',
      color: 'blue',
      gradient: {
        bg: 'from-blue-500/20 to-blue-600/30',
        hover: 'hover:from-blue-500/10 hover:to-blue-600/20'
      }
    },
    science: {
      name: 'Ms. Sarah',
      title: 'Science',
      image: '/images/avatars/science-tutor.jpg',
      fallbackImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=science',
      color: 'purple',
      gradient: {
        bg: 'from-purple-500/20 to-purple-600/30',
        hover: 'hover:from-purple-500/10 hover:to-purple-600/20'
      }
    }
  };

  const handleImageError = (t: 'math' | 'science') => {
    const img = document.querySelector(`#${t}-teacher-img`) as HTMLImageElement;
    if (img) {
      img.src = teachers[t].fallbackImage;
    }
  };

  const currentTeacher = teachers[teacher];

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        "w-full h-[450px] rounded-xl cursor-pointer shadow-lg transition-all duration-200 p-1 bg-white/10",
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={disabled ? undefined : onSelect}
      role="button"
    >
      {/* Inner container with gradient */}
      <div className={cn(
        "w-full h-full rounded-lg overflow-hidden flex flex-col bg-gradient-to-b",
        currentTeacher.gradient.bg,
        !disabled && currentTeacher.gradient.hover,
        isSelected && `ring-2 ring-${currentTeacher.color}-200`
      )}>
        {/* Image Container - 60% height */}
        <div className="relative w-full h-[60%]">
          <Image
            id={`${teacher}-teacher-img`}
            src={currentTeacher.image}
            alt={currentTeacher.name}
            fill
            className={cn(
              "object-cover",
              teacher === 'math' ? "scale-x-[-1] object-[30%_20%]" : "object-[center_20%]"
            )}
            onError={() => handleImageError(teacher)}
          />
          {/* Gradient overlay */}
          <div className={cn(
            "absolute inset-0 opacity-10 bg-gradient-to-t",
            teacher === 'math' 
              ? "from-blue-600 to-transparent" 
              : "from-purple-600 to-transparent"
          )} />
        </div>

        {/* Content Container - 30% height */}
        <div className="h-[30%] px-5 py-3 flex flex-col justify-center bg-white">
          <h3 className={cn(
            "text-xl font-bold mb-1",
            teacher === 'math' ? "text-blue-600" : "text-purple-600"
          )}>
            {currentTeacher.name}
          </h3>
          <p className={cn(
            "text-lg font-semibold",
            teacher === 'math' ? "text-blue-500" : "text-purple-500"
          )}>
            {currentTeacher.title}
          </p>
        </div>

        {/* State Container - 10% height */}
        <div className="h-[10%] px-4 flex items-center justify-center bg-black/30">
          <span className="text-gray-100 text-xs font-medium">
            {isSelected ? 'Currently Selected' : 'Click to select'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
