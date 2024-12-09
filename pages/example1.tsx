import { motion } from 'framer-motion';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import ProgramCard from '../components/ProgramCard';
import Hero from '../components/Hero';

const programs = [
  {
    title: "BPC Adults",
    description: "Transform your professional journey with industry expertise",
    icon: "👔",
    gradient: "bg-gradient-to-r from-purple-600 to-pink-500",
    features: [
      "Personal brand development",
      "Industry mentorship",
      "Real-world projects",
      "Professional certifications"
    ]
  },
  {
    title: "BPC Schooling",
    description: "Comprehensive learning for future leaders",
    icon: "🎓",
    gradient: "bg-gradient-to-r from-pink-500 to-purple-500",
    features: [
      "Integrated curriculum",
      "9 stages of learning",
      "Project-based approach",
      "Global certifications"
    ]
  },
  {
    title: "BPCAS",
    description: "After-school excellence in 16 divisions",
    icon: "🌟",
    gradient: "bg-gradient-to-r from-purple-500 to-indigo-500",
    features: [
      "Flexible scheduling",
      "Specialized workshops",
      "Portfolio building",
      "Hands-on learning"
    ]
  },
  {
    title: "RSL Program",
    description: "Excellence in music and digital media",
    icon: "🎵",
    gradient: "bg-gradient-to-r from-indigo-500 to-purple-600",
    features: [
      "Music certification",
      "Performance opportunities",
      "Production training",
      "Industry connections"
    ]
  }
];

export default function Example1() {
  return (
    <div className="min-h-screen bg-purple-900">
      <Head>
        <title>Blueprint Club - Empowering Future Leaders</title>
      </Head>
      <Navbar />
      <Hero />
      
      {/* Programs Section */}
      <section id="programs" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Programs</h2>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Discover our comprehensive range of professional development programs
              designed to help you succeed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, index) => (
              <ProgramCard key={program.title} {...program} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
