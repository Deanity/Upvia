import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Users } from 'lucide-react';

export const DashboardPreview = () => {
  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="bg-emerald-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-emerald-400 opacity-10 blur-[100px] rounded-full"></div>
          
          <div className="flex-1 relative z-10 text-white">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Alami Masa Depan Dasbor Pembelajaran</h2>
            <p className="text-emerald-100/70 mb-8 leading-relaxed">
              Dasbor cerdas kami tidak hanya mencantumkan kursus—ia memvisualisasikan pertumbuhan Anda, melacak setiap pencapaian, dan membangun portofolio Anda secara otomatis saat Anda maju.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-50">Pemetaan keterampilan interaktif</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-50">Generator portofolio otomatis</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-50">Alat kolaborasi waktu nyata</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-card bg-white/10 backdrop-blur-2xl border-white/20 p-6 rounded-3xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-400/20 flex items-center justify-center">
                    <Users className="text-emerald-400 w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-bold">Alex Johnson</div>
                    <div className="text-emerald-300 text-[10px] uppercase font-bold tracking-widest">Tingkat Master</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full text-white text-[10px] font-bold">PRO</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-2xl p-4">
                  <div className="text-[10px] text-emerald-300 uppercase font-bold mb-1">Kursus</div>
                  <div className="text-xl font-bold text-white">12</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4">
                  <div className="text-[10px] text-emerald-300 uppercase font-bold mb-1">Tantangan</div>
                  <div className="text-xl font-bold text-white">48</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-[10px] text-emerald-300 uppercase font-bold flex justify-between">
                  <span>Kemajuan Terbaru</span>
                  <span>85%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-emerald-400 rounded-full"
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
