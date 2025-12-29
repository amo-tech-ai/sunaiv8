import React, { useState, useEffect } from 'react';
import MarketingHeader from './Header';
import { MarketingFooter } from './Footer';
import Hero from './landing/Hero';
import HowItWorksSection from './landing/HowItWorks';
import Partners from './landing/Partners';
import WhatWeBuild from './landing/WhatWeBuild';
import TechStack from './landing/TechStack';
import Metrics from './landing/Metrics';
import VelocitySystem from './landing/VelocitySystem';
import CTASection from './landing/CTASection';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-emerald-100 flex flex-col">
      <style>{`
        @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes counter-orbit { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .animate-orbit { animation: orbit 60s linear infinite; }
        .animate-counter-orbit { animation: counter-orbit 60s linear infinite; }
        .animate-breathe { animation: breathe 6s ease-in-out infinite; }
        .paused { animation-play-state: paused; }
        .text-gradient-blue {
          background: linear-gradient(180deg, #7FB2E5 0%, #4A90E2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <MarketingHeader onNavigate={onNavigate} scrolled={scrolled} />
      
      <Hero onNavigate={onNavigate} />

      <HowItWorksSection />

      <WhatWeBuild />

      <TechStack />

      <Metrics />

      <VelocitySystem />

      <CTASection onNavigate={onNavigate} />

      <Partners />

      <MarketingFooter onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;