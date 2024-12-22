import { motion } from 'framer-motion';
import { AcademicCapIcon, UserGroupIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

interface ProgramCardProps {
  title: string;
  description: string;
  icon: string;
  features: string[];
  slug: string;
}

const icons = {
  AcademicCapIcon,
  UserGroupIcon,
  CommandLineIcon,
};

const slugToPath: Record<string, string> = {
  'bpc-adults': '/bpc-adults',
  'bpc-schooling': '/bpc-schooling',
  'bpcas': '/bpcas',
  'white-noise-academy': '/white-noise-academy',
};

const programColors: Record<string, { primary: string; accent: string; text: string }> = {
  'bpc-adults': {
    primary: '#4C1D95', // Deep purple
    accent: '#7C3AED', // Lighter purple
    text: '#2D3748'
  },
  'bpc-schooling': {
    primary: '#BE123C', // Deep rose
    accent: '#E11D48', // Lighter rose
    text: '#2D3748'
  },
  'bpcas': {
    primary: '#0D9488', // Deep teal
    accent: '#14B8A6', // Lighter teal
    text: '#2D3748'
  },
  'white-noise-academy': {
    primary: '#1E40AF', // Deep blue
    accent: '#3B82F6', // Lighter blue
    text: '#2D3748'
  }
};

const ProgramCard = ({ title, description, icon, features, slug }: ProgramCardProps) => {
  const router = useRouter();
  const Icon = icons[icon as keyof typeof icons];
  const colors = programColors[slug] || { primary: '#FFC107', accent: '#FFC107', text: '#424242' };

  const handleClick = () => {
    router.push(slugToPath[slug] || '/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onClick={handleClick}
      className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-[#E0E0E0] cursor-pointer relative overflow-hidden group"
      style={{
        borderColor: `${colors.accent}20`
      }}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={{
          background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`
        }}
      />
      <div 
        className="h-12 w-12 rounded-lg p-2 mb-6 relative"
        style={{
          background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`
        }}
      >
        {Icon && <Icon className="h-8 w-8 text-white" />}
      </div>
      <h3 
        className="text-xl font-bold mb-3"
        style={{ color: colors.text }}
      >
        {title}
      </h3>
      <p 
        className="mb-6"
        style={{ color: `${colors.text}99` }}
      >
        {description}
      </p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li 
            key={index} 
            className="flex items-center"
            style={{ color: `${colors.text}99` }}
          >
            <span 
              className="h-1.5 w-1.5 rounded-full mr-2"
              style={{ background: colors.accent }}
            />
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ProgramCard;
