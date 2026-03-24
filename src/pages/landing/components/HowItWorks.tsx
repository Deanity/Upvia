import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { steps } from '../constants';

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Your Path to Mastery</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">From setup to portfolio building, Upvia guides you every step of the way.</p>
        </div>
        
        <div className="relative">
          <div className="hidden lg:block absolute top-[2.25rem] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center relative z-10"
              >
                <div className="w-10 h-10 rounded-full bg-white border-2 border-green-500 text-green-600 font-bold flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                  {idx + 1}
                </div>
                <h4 className="font-bold mb-2 text-sm">{step.title}</h4>
                <p className="text-gray-500 text-xs">{step.description}</p>
                
                {idx < steps.length - 1 && (
                  <div className="lg:hidden mt-4 text-green-300 flex justify-center">
                    <ChevronRight className="w-4 h-4 rotate-90 md:rotate-0" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
