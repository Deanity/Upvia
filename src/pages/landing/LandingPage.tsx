import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { TargetUsers } from './components/TargetUsers';
import { ValueProposition } from './components/ValueProposition';
import { DashboardPreview } from './components/DashboardPreview';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--brand-muted))] text-[hsl(var(--brand-dark))] selection:bg-green-100 selection:text-green-800 overflow-x-hidden pt-16">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-teal-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />
      
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <TargetUsers />
        <ValueProposition />
        <DashboardPreview />
        <CTA />
      </main>

      <Footer />
    </div>
  );
};
