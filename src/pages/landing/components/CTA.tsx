import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CTA = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-600 to-emerald-800 p-12 md:p-20 rounded-[3rem] text-white shadow-2xl shadow-green-200 dark:shadow-green-900/40 relative overflow-hidden transition-shadow"
        >
          {/* Decorative circle */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-4xl font-extrabold mb-6 relative z-10">Start Your Learning Journey Today</h2>
          <p className="text-emerald-50/80 text-lg mb-10 max-w-xl mx-auto relative z-10">
            Join thousands of learners who use Upvia to master new skills and build their future.
          </p>
          <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-emerald-50 text-emerald-800 rounded-2xl font-bold text-lg hover:bg-emerald-50 dark:hover:bg-white transition-all shadow-lg relative z-10 active:scale-95">
            Get Started for Free <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
