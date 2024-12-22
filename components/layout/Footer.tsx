import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FacebookIcon, 
  TwitterIcon, 
  InstagramIcon, 
  LinkedinIcon 
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              Blueprint<span className="text-primary">Club</span>
            </h3>
            <p className="text-slate-400">
              Empowering students with professional skills and real-world experience.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="hover:text-primary">
                <FacebookIcon className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" className="hover:text-primary">
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" className="hover:text-primary">
                <InstagramIcon className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com" className="hover:text-primary">
                <LinkedinIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Programs Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Programs</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/bpc-adults" className="hover:text-primary">
                  BPC Adults
                </Link>
              </li>
              <li>
                <Link href="/bpc-schooling" className="hover:text-primary">
                  BPC Schooling Club
                </Link>
              </li>
              <li>
                <Link href="/bpcas" className="hover:text-primary">
                  BPCAS
                </Link>
              </li>
              <li>
                <Link href="/white-noise-academy" className="hover:text-primary">
                  White Noise Academy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Stay Updated</h4>
            <p className="text-slate-400 mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-slate-900 border-slate-800"
              />
              <Button className="w-full">Subscribe</Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-400">
          <p>© {new Date().getFullYear()} Blueprint Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
