import React from 'react';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { navLinks } from '../constants';
import logo from '../../../assets/UPVIALOGO.svg';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3 rounded-2xl">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img src={logo} alt="Upvia Logo" className="w-12 h-12 object-contain transition-transform group-hover:scale-105" style={{ imageRendering: 'crisp-edges' }} />
              <div className="absolute inset-0 bg-green-400/10 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">Upvia</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[hsl(var(--brand-primary))] transition-colors">
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/auth" className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-[hsl(var(--brand-primary))] transition-colors">
            Login
          </Link>
          <Link to="/auth" className="btn-primary py-2 px-5 text-sm">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-900 dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-4 glass-card bg-white/90 dark:bg-gray-900/90 p-6 rounded-2xl flex flex-col gap-4 shadow-2xl transition-colors"
        >
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-lg font-medium text-gray-900 dark:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <hr className="border-green-100 dark:border-white/5" />
          <Link to="/auth" className="text-lg font-medium text-gray-900 dark:text-white">Login</Link>
          <Link to="/auth" className="btn-primary text-center">Get Started</Link>
        </motion.div>
      )}
    </nav>
  );
};
