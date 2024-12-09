import { motion } from 'framer-motion';

interface HeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  accentWord?: string;
}

const Hero = ({ 
  title = "Blueprint Club",
  subtitle = "Empowering students with professional skills and real-world experience",
  backgroundImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80",
  showButton = true,
  buttonText = "Explore Our Programs",
  buttonLink = "#programs",
  accentWord = "Club"
}: HeroProps) => {
  const titleParts = accentWord ? title.split(accentWord) : [title];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${backgroundImage}")`,
        }}
      />
      
      {/* Overlay with Pattern */}
      <div 
        className="absolute inset-0 bg-white/95"
        style={{
          backgroundImage: 'url("/background-pattern.svg")',
          backgroundSize: '40px 40px',
          backgroundRepeat: 'repeat',
          opacity: 0.3
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/75 backdrop-blur-sm rounded-[2.5rem] shadow-lg px-8 py-12 md:px-16 md:py-14 mx-auto max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-[#424242] mb-6">
            {accentWord ? (
              <>
                {titleParts[0]}
                <span className="text-[#FFC107]">{accentWord}</span>
                {titleParts[1]}
              </>
            ) : (
              title
            )}
          </h1>
          <p className="text-xl md:text-2xl text-[#757575] mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>
          {showButton && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-x-4"
            >
              <a
                href={buttonLink}
                className="button-primary"
              >
                {buttonText}
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/40 pointer-events-none" />
    </div>
  );
};

export default Hero;
