import React from 'react';
import { motion } from 'motion/react';
import { targetUsers } from '../constants';

export const TargetUsers = () => {
  return (
    <section id="users" className="py-24 px-6 soft-green-gradient">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 text-[hsl(var(--brand-dark))]">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Designed for Every Learner</h2>
          <p className="text-green-800/60 max-w-2xl mx-auto">Tailored experiences for different educational needs and goals.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {targetUsers.map((user, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 hover:bg-white/60 transition-colors group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[hsl(var(--brand-primary))] mb-6 shadow-sm group-hover:rotate-3 transition-transform">
                {user.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{user.type}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{user.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
