import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

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
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission & Vision</h2>
          <p className="text-gray-600 mb-6">
            At Blueprint Club, we are dedicated to bridging the gap between academic knowledge and real-world application. 
            Our mission is to empower students with the skills, knowledge, and practical experience they need to succeed in their chosen fields.
          </p>
          <p className="text-gray-600">
            We envision a future where every student has access to quality education that combines theoretical learning with hands-on experience, 
            preparing them for the challenges and opportunities of tomorrow.
          </p>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
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
                className="bg-gray-50 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Team</h2>
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
                name: 'Emma Williams',
                role: 'Student Success Coordinator',
                image: '/images/team/emma.jpg'
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                className="text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="absolute inset-0 bg-[#FFC107] rounded-full opacity-10"></div>
                  <div className="absolute inset-2 bg-gray-200 rounded-full">
                    {/* Image placeholder */}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
