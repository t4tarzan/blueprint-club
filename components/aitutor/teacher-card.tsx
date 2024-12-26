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
  const teacherInfo = {
    math: {
      name: 'Mr. David',
      title: 'Math Teacher',
      image: '/images/avatars/math-tutor.jpg',
      fallbackImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=math',
      color: 'blue'
    },
    science: {
      name: 'Ms. Sarah',
      title: 'Science Teacher',
      image: '/images/avatars/science-tutor.jpg',
      fallbackImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=science',
      color: 'purple'
    }
  }[teacher];

  const [imageSrc, setImageSrc] = React.useState(teacherInfo.image);

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        "h-full rounded-lg overflow-hidden cursor-pointer bg-white shadow-md border",
        isSelected ? [
          teacher === 'math' 
            ? "border-blue-500" 
            : "border-purple-500"
        ] : "border-gray-200",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      )}
      onClick={disabled ? undefined : onSelect}
    >
      <div className="p-4">
        {/* Image Container */}
        <div className="relative aspect-square mb-4">
          <Image
            src={imageSrc}
            alt={teacherInfo.name}
            fill
            className="object-cover rounded-lg"
            onError={() => setImageSrc(teacherInfo.fallbackImage)}
            unoptimized={imageSrc === teacherInfo.fallbackImage}
          />
        </div>

        {/* Info Section */}
        <div className="text-center">
          <h3 className="font-medium text-lg text-gray-900">{teacherInfo.name}</h3>
          <p className="text-sm text-gray-600">{teacherInfo.title}</p>
          
          {/* Status Indicator */}
          {isSelected && (
            <div className="mt-2 text-sm font-medium" style={{ color: `var(--${teacherInfo.color}-500)` }}>
              {disabled ? 'In Session' : 'Selected'}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
