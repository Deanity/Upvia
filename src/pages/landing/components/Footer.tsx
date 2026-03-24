import { Globe, Users } from 'lucide-react';
import logo from '../../../assets/UPVIALOGO.svg';

export const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-green-100 dark:border-white/5 bg-white/20 dark:bg-black/20 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Upvia Logo" className="w-10 h-10 object-contain" />
        </div>
        
        <div className="flex gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
          <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">About</a>
          <a href="#features" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Features</a>
          <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Contact</a>
          <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Privacy</a>
        </div>

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-all border border-gray-100 dark:border-white/5 shadow-sm">
            <Globe className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-all border border-gray-100 dark:border-white/5 shadow-sm">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
        © 2026 Upvia AI. All rights reserved.
      </div>
    </footer>
  );
};
