import { motion } from 'framer-motion';
import Head from 'next/head';
import Navbar from '../components/Navbar';

const programs = [
  {
    title: "BPC Adults",
    description: "Transform your career with expert guidance",
    features: [
      "Industry mentorship",
      "Personal branding",
      "Real projects",
      "Networking"
    ],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
  },
  {
    title: "BPC Schooling",
    description: "Comprehensive learning for future leaders",
    features: [
      "Integrated curriculum",
      "Project-based learning",
      "Global perspective",
      "Skill development"
    ],
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  },
  {
    title: "BPCAS",
    description: "After-school excellence program",
    features: [
      "16 divisions",
      "Flexible schedule",
      "Expert instruction",
      "Portfolio building"
    ],
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80"
  },
  {
    title: "RSL Program",
    description: "Music and media mastery",
    features: [
      "Professional certification",
      "Performance training",
      "Industry exposure",
      "Creative development"
    ],
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  }
];

export default function Example2() {
  return (
    <>
      <Head>
        <title>Blueprint Club - Alternative Design</title>
      </Head>
      <div className="min-h-screen bg-black">
        <Navbar />
        
        {/* Hero Section */}
        <div className="relative h-screen">
          {/* Video Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-black">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-50"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center px-4">
              <motion.h1 
                className="text-6xl md:text-8xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Blueprint
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Your Future
                </span>
              </motion.h1>
              <motion.p 
                className="text-xl text-white/80 max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Discover our innovative programs designed to shape the leaders of tomorrow
              </motion.p>
              <motion.button
                className="bg-white text-purple-900 px-8 py-4 rounded-full font-medium hover:bg-purple-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>

        {/* Programs Section */}
        <div className="container mx-auto px-4 py-20">
          <motion.h2 
            className="text-4xl font-bold text-white mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Our Programs
          </motion.h2>
          <div className="space-y-32">
            {programs.map((program, index) => (
              <motion.div
                key={program.title}
                className="flex flex-col md:flex-row items-center gap-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className={`w-full md:w-1/2 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
                    <img 
                      src={program.image} 
                      alt={program.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                </div>
                <div className={`w-full md:w-1/2 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <h3 className="text-3xl font-bold text-white mb-4">{program.title}</h3>
                  <p className="text-white/80 mb-6">{program.description}</p>
                  <ul className="space-y-3">
                    {program.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-white/70">
                        <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
