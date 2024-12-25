import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

const sectionColors = {
  mission: {
    primary: '#7C3AED', // Lighter purple
    accent: '#A78BFA', // Even lighter purple
    text: '#2D3748'
  },
  values: {
    primary: '#E11D48', // Lighter rose
    accent: '#FB7185', // Even lighter rose
    text: '#2D3748'
  },
  story: {
    primary: '#14B8A6', // Lighter teal
    accent: '#5EEAD4', // Even lighter teal
    text: '#2D3748'
  },
  team: {
    primary: '#3B82F6', // Lighter blue
    accent: '#93C5FD', // Even lighter blue
    text: '#2D3748'
  }
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#EBEBEB]">
      <Navbar />
      
      <Hero 
        title="About Blueprint Club"
        subtitle="Empowering the next generation of innovators and leaders through education and hands-on experience"
        backgroundImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=2850&q=80"
        showButton={false}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid gap-8"
      >
        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-8 hover:shadow-xl transition-all duration-500 border group cursor-pointer relative overflow-hidden"
          style={{
            borderColor: `${sectionColors.mission.accent}20`
          }}
        >
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-95 transition-opacity duration-700"
            style={{
              background: `linear-gradient(135deg, ${sectionColors.mission.primary}20, ${sectionColors.mission.accent}40)`
            }}
          />
          <div className="relative z-10 group-hover:text-white transition-colors duration-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 group-hover:text-gray-900">Our Mission & Vision</h2>
            <p className="text-gray-600 mb-6 group-hover:text-gray-700">
              At Blueprint Club, we are dedicated to bridging the gap between academic knowledge and real-world application. 
              Our mission is to empower students with the skills, knowledge, and practical experience they need to succeed in their chosen fields.
            </p>
            <p className="text-gray-600 group-hover:text-gray-700">
              We envision a future where every student has access to quality education that combines theoretical learning with hands-on experience, 
              preparing them for the challenges and opportunities of tomorrow.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl p-8 hover:shadow-xl transition-all duration-500 border group cursor-pointer relative overflow-hidden"
          style={{
            borderColor: `${sectionColors.values.accent}20`
          }}
        >
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-95 transition-opacity duration-700"
            style={{
              background: `linear-gradient(135deg, ${sectionColors.values.primary}20, ${sectionColors.values.accent}40)`
            }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 group-hover:text-gray-900">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Excellence',
                  description: 'We strive for excellence in everything we do, from curriculum design to student support.'
                },
                {
                  title: 'Innovation',
                  description: 'We embrace innovative teaching methods and technologies to enhance the learning experience.'
                },
                {
                  title: 'Inclusivity',
                  description: 'We create an inclusive environment where every student feels welcome and valued.'
                },
                {
                  title: 'Impact',
                  description: 'We measure our success by the positive impact we have on our students\' lives and careers.'
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="bg-gray-50 group-hover:bg-white/60 rounded-xl p-6 transition-all duration-500"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 group-hover:text-gray-700">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl p-8 hover:shadow-xl transition-all duration-500 border group cursor-pointer relative overflow-hidden"
          style={{
            borderColor: `${sectionColors.story.accent}20`
          }}
        >
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-95 transition-opacity duration-700"
            style={{
              background: `linear-gradient(135deg, ${sectionColors.story.primary}20, ${sectionColors.story.accent}40)`
            }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 group-hover:text-gray-900">Our Story</h2>
            <div className="space-y-6">
              {[
                {
                  step: '1',
                  title: 'The Beginning',
                  description: 'Founded with a vision to revolutionize education by combining traditional learning with real-world experience.'
                },
                {
                  step: '2',
                  title: 'Growth & Innovation',
                  description: 'Expanded our programs to include comprehensive learning paths across multiple disciplines.'
                },
                {
                  step: '3',
                  title: 'Today & Beyond',
                  description: 'Leading the way in educational innovation with AI-powered learning and global partnerships.'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-white/60 flex items-center justify-center flex-shrink-0 transition-colors duration-500">
                    <span className="text-gray-900 group-hover:text-gray-900 text-xl">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 group-hover:text-gray-700">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl p-8 hover:shadow-xl transition-all duration-500 border group cursor-pointer relative overflow-hidden"
          style={{
            borderColor: `${sectionColors.team.accent}20`
          }}
        >
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-95 transition-opacity duration-700"
            style={{
              background: `linear-gradient(135deg, ${sectionColors.team.primary}20, ${sectionColors.team.accent}40)`
            }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 group-hover:text-gray-900">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Dr. Sarah Johnson',
                  role: 'Program Director',
                  image: '/images/team/sarah.jpg'
                },
                {
                  name: 'Michael Chen',
                  role: 'Lead Instructor',
                  image: '/images/team/michael.jpg'
                },
                {
                  name: 'Emma Davis',
                  role: 'Community Manager',
                  image: '/images/team/emma.jpg'
                }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  className="bg-gray-50 group-hover:bg-white/60 rounded-xl p-6 text-center transition-all duration-500"
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-gray-600 group-hover:text-gray-700">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
