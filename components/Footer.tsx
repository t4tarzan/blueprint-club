import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-black/90 to-gray-900/90 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              Blueprint<span className="text-[#FFC107]">Club</span>
            </h3>
            <p className="text-gray-300">
              Empowering students through innovative education and comprehensive development programs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[#FFC107]">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#FFC107]">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#FFC107]">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#FFC107]">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Programs */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#FFC107]">Programs</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/programs/bpc-adults" className="text-gray-300 hover:text-[#FFC107]">
                  BPC Adults
                </Link>
              </li>
              <li>
                <Link href="/programs/bpc-schooling" className="text-gray-300 hover:text-[#FFC107]">
                  BPC Schooling
                </Link>
              </li>
              <li>
                <Link href="/programs/bpc-afterschool" className="text-gray-300 hover:text-[#FFC107]">
                  BPC After School
                </Link>
              </li>
              <li>
                <Link href="/programs/bpc-academy" className="text-gray-300 hover:text-[#FFC107]">
                  BPC Academy
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#FFC107]">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#FFC107]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#FFC107]">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-[#FFC107]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-[#FFC107]">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#FFC107]">Contact Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li>123 Education Street</li>
              <li>Bangalore, Karnataka 560001</li>
              <li>Phone: +91 123 456 7890</li>
              <li>Email: info@blueprintclub.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} BlueprintClub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
