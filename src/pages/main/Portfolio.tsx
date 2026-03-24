import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/db';
import { Briefcase, Calendar, CheckCircle2, Award, Sparkles, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function Portfolio() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        db.getPortfolio(user.id).then((data) => {
          setItems(data);
          setLoading(false);
        });
      }
    });
  }, []);

  if (loading) return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse p-4">
      <div className="h-10 bg-gray-200 rounded-xl w-1/4"></div>
      {[1, 2].map(i => <div key={i} className="h-48 bg-gray-200 rounded-3xl"></div>)}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-10 pb-12"
    >
      <header>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight text-center md:text-left">Portofolio Anda</h1>
        <p className="text-gray-500 mt-2 font-medium text-center md:text-left">Etalase pencapaian belajar dan keterampilan yang telah Anda kuasai.</p>
      </header>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card bg-white/50 p-16 rounded-[2.5rem] border border-dashed border-green-200 text-center premium-shadow"
        >
          <div className="mx-auto bg-green-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 animate-float">
            <Briefcase className="text-[hsl(var(--brand-primary))] w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Cerita Anda dimulai di sini</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">
            Selesaikan peta jalan belajar pertama Anda untuk membuka pencapaian dan membangun portofolio profesional Anda.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-10 py-4 bg-[hsl(var(--brand-primary))] text-white rounded-2xl font-black text-sm hover:translate-y-[-2px] hover:shadow-lg hover:shadow-green-500/20 active:translate-y-0 transition-all shadow-xl"
          >
            Mulai Belajar Sekarang
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card bg-white/50 p-10 rounded-[2.5rem] border border-white/60 shadow-sm hover:shadow-xl hover:shadow-green-500/5 transition-all relative overflow-hidden group border-b-4 border-b-green-500/20"
            >
              <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 group-hover:rotate-0 transform duration-700">
                <Award className="w-64 h-64 text-[hsl(var(--brand-primary))]" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                <div className="space-y-6 flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-[hsl(var(--brand-primary))]">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">Pencapaian Selesai</span>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{item.title}</h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-400 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-400" />
                      {new Date(item.completed_at).toLocaleDateString('id-ID')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-400" />
                      {item.goal}
                    </div>
                  </div>
                  <div className="p-6 bg-white/80 rounded-2xl border border-green-50 italic text-gray-600 leading-relaxed text-sm shadow-inner">
                    "{item.summary}"
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-green-50 to-white rounded-3xl border border-green-100 min-w-[200px] premium-shadow group-hover:scale-105 transition-transform">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                    <Award className="w-10 h-10 text-amber-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-green-900 uppercase tracking-widest">Mastery Terverifikasi</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-bold">Protokol Upvia</p>
                  </div>
                  <div className="h-px w-full bg-green-100" />
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-black uppercase tracking-tighter">
                    <CheckCircle2 className="w-3 h-3" />
                    ID-{item.id.slice(0, 8).toUpperCase()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
