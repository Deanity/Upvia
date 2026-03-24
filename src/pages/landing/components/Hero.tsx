import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="pt-20 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Belajar Berbasis AI
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] mb-6">
            Dari <span className="text-[hsl(var(--brand-primary))]">Kebingungan</span> Menuju Kejelasan dalam Belajar
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
            Upvia membantu Anda tumbuh di bidang apa pun dengan peta jalan belajar berbasis AI yang dipersonalisasi. Mentor cerdas Anda untuk pertumbuhan berkelanjutan.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/auth" className="btn-primary flex items-center gap-2 group">
              Mulai Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-6 py-3 rounded-xl font-bold bg-white text-gray-700 hover:bg-gray-50 transition-colors premium-shadow border border-gray-100">
              Coba Demo
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="glass-card p-4 rounded-3xl relative z-10 animate-float translate-x-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="text-xs font-bold text-gray-400">JALUR BELAJAR AI</div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">Pengantar Desain UI</div>
                  <div className="h-1.5 w-full bg-green-200 rounded-full mt-1.5">
                    <div className="h-full w-full bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-white/50 rounded-2xl border border-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-green-500 text-green-500 flex items-center justify-center font-bold text-sm">2</div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-700">Dasar-Dasar Tipografi</div>
                  <div className="h-1.5 w-32 bg-gray-100 rounded-full mt-1.5">
                    <div className="h-full w-12 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-white/50 rounded-2xl border border-white flex items-center gap-3 opacity-60">
                <div className="w-8 h-8 rounded-full border-2 border-gray-300 text-gray-300 flex items-center justify-center font-bold text-sm">3</div>
                <div className="text-sm font-bold text-gray-400">Sistem Tata Letak Lanjutan</div>
              </div>
            </div>
          </div>
          <div className="absolute top-20 -right-4 w-24 h-24 bg-green-400/20 blur-2xl rounded-full"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-400/10 blur-3xl rounded-full"></div>
        </motion.div>
      </div>
    </section>
  );
};
