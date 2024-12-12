import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return router.asPath === path ? 'text-[#FFC107]' : 'text-[#424242] hover:text-[#FFC107]';
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <Link href="/" className="text-2xl font-bold text-[#424242]">
              Blueprint<span className="text-[#FFC107]">Club</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center space-x-8"
          >
            <Link href="/" className={`nav-link ${isActive('/')}`}>
              Home
            </Link>
            <Link href="/#programs" className={`nav-link ${isActive('/#programs')}`}>
              Programs
            </Link>
            <Link href="/about" className={`nav-link ${isActive('/about')}`}>
              About
            </Link>
            <Link href="/contact" className={`nav-link ${isActive('/contact')}`}>
              Contact
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden md:flex items-center space-x-4"
          >
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#FFC107] flex items-center justify-center text-white">
                      {session.user?.name?.[0] || 'U'}
                    </div>
                  )}
                  <span className="text-[#424242]">{session.user?.name}</span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-[#424242] hover:text-[#FFC107]"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-[#FFC107] text-white px-4 py-2 rounded-md hover:bg-[#FFB300] transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="md:hidden text-[#424242] hover:text-[#FFC107]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </motion.button>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/"
                  className="block px-3 py-2 text-[#424242] hover:text-[#FFC107]"
                >
                  Home
                </Link>
                <Link
                  href="/#programs"
                  className="block px-3 py-2 text-[#424242] hover:text-[#FFC107]"
                >
                  Programs
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-[#424242] hover:text-[#FFC107]"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-2 text-[#424242] hover:text-[#FFC107]"
                >
                  Contact
                </Link>
                {!session && (
                  <>
                    <Link
                      href="/auth/signin"
                      className="block px-3 py-2 text-[#424242] hover:text-[#FFC107]"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block px-3 py-2 bg-[#FFC107] text-white rounded-md hover:bg-[#FFB300]"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
