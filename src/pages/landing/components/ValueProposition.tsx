import React from 'react';
import { motion } from 'motion/react';
import { valuesList } from '../constants';

export const ValueProposition = () => {
  return (
    <section id="values" className="py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white transition-colors">Why Choose Upvia?</h2>
          <p className="text-gray-500 dark:text-gray-400 transition-colors">The core principles that drive our learning engine.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 lg:gap-8 max-w-4xl">
          {valuesList.map((v, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-2xl premium-shadow border border-gray-100 dark:border-white/5 transition-colors"
            >
              <div className="text-green-500 dark:text-green-400">{v.icon}</div>
              <span className="font-bold text-sm text-gray-900 dark:text-gray-200">{v.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
