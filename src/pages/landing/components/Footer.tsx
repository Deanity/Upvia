import { Globe, Users } from 'lucide-react';
import logo from '../../../assets/UPVIALOGO.png';

export const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-green-100 bg-white/20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Upvia Logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold tracking-tight">Upvia</span>
        </div>
        
        <div className="flex gap-8 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-green-600 transition-colors">Tentang</a>
          <a href="#features" className="hover:text-green-600 transition-colors">Fitur</a>
          <a href="#" className="hover:text-green-600 transition-colors">Kontak</a>
          <a href="#" className="hover:text-green-600 transition-colors">Privasi</a>
        </div>

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-green-600 transition-colors border border-gray-100 shadow-sm">
            <Globe className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-green-600 transition-colors border border-gray-100 shadow-sm">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 text-center text-xs text-gray-400">
        © 2026 Upvia AI. Hak cipta dilindungi undang-undang.
      </div>
    </footer>
  );
};
