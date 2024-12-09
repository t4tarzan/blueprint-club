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

const ProgramCard = ({ title, description, icon, features, slug }: ProgramCardProps) => {
  const router = useRouter();
  const Icon = icons[icon as keyof typeof icons];

  const handleClick = () => {
    router.push(`/programs/${slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onClick={handleClick}
      className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-[#E0E0E0] cursor-pointer"
    >
      <div className="h-12 w-12 bg-[#FFC107] rounded-lg p-2 mb-6">
        {Icon && <Icon className="h-8 w-8 text-white" />}
      </div>
      <h3 className="text-xl font-bold text-[#424242] mb-3">{title}</h3>
      <p className="text-[#757575] mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-[#757575]">
            <span className="h-1.5 w-1.5 bg-[#FFC107] rounded-full mr-2"></span>
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ProgramCard;
