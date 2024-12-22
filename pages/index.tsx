import { motion } from 'framer-motion';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProgramCard from '../components/ProgramCard';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Blueprint Club - Professional Development</title>
        <meta name="description" content="Empowering students with professional skills and real-world experience through comprehensive programs and mentorship." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <Hero 
        title="Blueprint Club"
        subtitle="Empowering students with professional skills and real-world experience"
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80"
        showButton={true}
        buttonText="Explore Our Programs"
        buttonLink="#programs"
        accentWord="Club"
      />
      
      {/* Programs Section */}
      <section id="programs" className="section section-alt bg-[#EBEBEB] relative">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/background-pattern.svg")',
            backgroundSize: '100px 100px',
            backgroundRepeat: 'repeat',
            opacity: 0.5
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#424242] mb-4">Our Programs</h2>
            <p className="text-[#757575] text-lg max-w-2xl mx-auto">
              Discover our comprehensive range of professional development programs
              designed to help you succeed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ProgramCard
              title="BPC Adults"
              description="Foster a community of seasoned professionals and aspiring youth through expertise-driven innovation and micro-niche development."
              icon="AcademicCapIcon"
              features={[
                "Micro-Niche Development & Expertise Building",
                "AI-Enhanced Learning & Content Creation",
                "Cross-Generational Collaborative Community",
                "Structured Six-Phase Growth Program",
                "Personal Brand Development"
              ]}
              slug="bpc-adults"
            />
            <ProgramCard
              title="BPC Schooling Club"
              description="Comprehensive educational programs combining traditional learning with modern technology and practical skills."
              icon="UserGroupIcon"
              features={[
                "Integrated NCERT, IB & Cambridge Curriculum",
                "Real-World Labs for Hands-on Learning",
                "Holistic Development with Arts & Technology",
                "Personalized Learning & Mentorship",
                "Industry Certifications & Digital Portfolio"
              ]}
              slug="bpc-schooling"
            />
            <ProgramCard
              title="BPCAS"
              description="Advanced studies program focusing on cutting-edge technology and professional development."
              icon="CommandLineIcon"
              features={[
                "Hands-on Technology & Creative Arts",
                "Professional Certifications (Adobe, AWS, IBM)",
                "Project-Based Learning Experience",
                "Industry Expert Mentorship",
                "Flexible Learning Schedule"
              ]}
              slug="bpcas"
            />
            <ProgramCard
              title="White Noise Academy RSL Club"
              description="Comprehensive music and digital arts program offering graded exams, live performances, and vocational qualifications."
              icon="AcademicCapIcon"
              features={[
                "RSL London Graded Music Exams (All Levels)",
                "Live Performance & Studio Production",
                "Digital Branding & Portfolio Building",
                "Vocational Qualifications in Digital Arts",
                "Weekend Music Sessions & Collaborations"
              ]}
              slug="white-noise-academy"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
