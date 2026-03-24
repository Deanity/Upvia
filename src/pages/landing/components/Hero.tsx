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
            AI-POWERED LEARNING
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] mb-6 text-gray-900 dark:text-white transition-colors">
            From <span className="text-[hsl(var(--brand-primary))]">Confusion</span> to Clarity in Learning
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg leading-relaxed transition-colors">
            Upvia helps you grow in any field with personalized AI-powered learning paths. Your smart mentor for continuous growth.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/auth" className="btn-primary flex items-center gap-2 group">
              Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="glass-card bg-white/70 dark:bg-gray-900/70 p-4 rounded-3xl relative z-10 animate-float translate-x-4 border border-white/20 dark:border-white/5 transition-colors">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">AI LEARNING PATH</div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-2xl border border-green-100 dark:border-green-500/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">Intro to UI Design</div>
                  <div className="h-1.5 w-full bg-green-200 dark:bg-green-900 rounded-full mt-1.5">
                    <div className="h-full w-full bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-white dark:border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-green-500 text-green-500 flex items-center justify-center font-bold text-sm">2</div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-700 dark:text-gray-200">Typography Basics</div>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full mt-1.5">
                    <div className="h-full w-12 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-white dark:border-white/5 flex items-center gap-3 opacity-60">
                <div className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-300 dark:text-gray-600 flex items-center justify-center font-bold text-sm">3</div>
                <div className="text-sm font-bold text-gray-400 dark:text-gray-500">Advanced Layout Systems</div>
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
