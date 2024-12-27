import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TeacherCardProps {
  selectedTeacher: 'math' | 'science' | null;
  onSelectTeacher: (teacher: 'math' | 'science') => void;
  questionsLeft: number;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  selectedTeacher,
  onSelectTeacher,
  questionsLeft
}) => {
  const teachers = {
    math: {
      name: 'Mr. David',
      title: 'Math Teacher',
      image: '/images/avatars/math-tutor.jpg',
      fallbackImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=math',
      color: 'blue',
      gradient: 'from-blue-500/10 to-blue-600/20',
      description: 'Expert in algebra, geometry, and calculus'
    },
    science: {
      name: 'Ms. Sarah',
      title: 'Science Teacher',
      image: '/images/avatars/science-tutor.jpg',
      fallbackImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=science',
      color: 'purple',
      gradient: 'from-purple-500/10 to-purple-600/20',
      description: 'Specializes in physics, chemistry, and biology'
    }
  };

  const handleImageError = (teacher: 'math' | 'science') => {
    const img = document.querySelector(`#${teacher}-teacher-img`) as HTMLImageElement;
    if (img) {
      img.src = teachers[teacher].fallbackImage;
    }
  };

  return (
    <div className="flex justify-between">
      {(['math', 'science'] as const).map((teacher) => (
        <motion.div
          key={teacher}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-[14%] h-[450px] fixed rounded-xl cursor-pointer shadow-lg transition-all duration-200 p-1 bg-white/10",
            teacher === 'math' ? 'left-[2%] top-[180px]' : 'right-[2%] top-[180px]',
          )}
          onClick={() => onSelectTeacher(teacher)}
        >
          {/* Inner container with gradient */}
          <div className={cn(
            "w-full h-full rounded-lg overflow-hidden flex flex-col bg-gradient-to-b",
            teacher === 'math' 
              ? "from-blue-500/20 to-blue-600/30 hover:from-blue-500/10 hover:to-blue-600/20" 
              : "from-purple-500/20 to-purple-600/30 hover:from-purple-500/10 hover:to-purple-600/20",
            selectedTeacher === teacher
              ? teacher === 'math'
                ? "ring-2 ring-blue-200"
                : "ring-2 ring-purple-200"
              : ""
          )}>
            {/* Image Container - 60% height */}
            <div className="relative w-full h-[60%]">
              <Image
                id={`${teacher}-teacher-img`}
                src={teachers[teacher].image}
                alt={teachers[teacher].name}
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
                {teachers[teacher].name}
              </h3>
              <p className={cn(
                "text-lg font-semibold",
                teacher === 'math' ? "text-blue-500" : "text-purple-500"
              )}>
                {teacher === 'math' ? 'Mathematics' : 'Science'}
              </p>
            </div>

            {/* State Container - 10% height */}
            <div className="h-[10%] px-4 flex items-center justify-center bg-black/30">
              {selectedTeacher === teacher ? (
                <div className="w-full">
                  <div className="flex items-center justify-center mb-1">
                    <span className="text-gray-100 text-xs font-medium">
                      {questionsLeft} questions remaining
                    </span>
                  </div>
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        teacher === 'math' ? "bg-blue-400" : "bg-purple-400"
                      )}
                      style={{ width: `${(20 - questionsLeft) * 5}%` }}
                    />
                  </div>
                </div>
              ) : (
                <span className="text-gray-100 text-xs font-medium">
                  Click to select
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
