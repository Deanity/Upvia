import React from 'react';
import { motion } from 'motion/react';
import { features } from '../constants';
import { cn } from '../../../lib/utils';

export const Features = () => {
  return (
    <section id="features" className="py-24 px-6 bg-white/30 dark:bg-gray-950/30 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">Powerful Features for Smarter Learning</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Everything you need to master any skill with the help of advanced AI.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card bg-white/70 dark:bg-gray-900/70 p-8 rounded-3xl hover:border-green-300/50 dark:hover:border-green-500/20 border border-white/20 dark:border-white/5 transition-all duration-300 group"
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",
                feature.color
              )}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
