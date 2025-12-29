
import React from 'react';

interface HeaderProps {
  onNavigate: (route: string) => void;
  scrolled: boolean;
}

export const MarketingHeader: React.FC<HeaderProps> = ({ onNavigate, scrolled }) => (
  <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-8 py-4 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent py-8'}`}>
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('Home')}>
        <div className="w-8 h-8 bg-[#0a1628] rounded-lg flex items-center justify-center">
          <span className="text-white text-xl font-serif">S</span>
        </div>
        <span className="font-serif text-xl tracking-tight text-[#0a1628]">Sun AI Agency</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
        <button onClick={() => onNavigate('Public Services')} className="hover:text-black transition-colors">Services</button>
        <button onClick={() => onNavigate('AI Agents')} className="hover:text-black transition-colors">AI Agents</button>
        <button onClick={() => onNavigate('Work')} className="hover:text-black transition-colors">Work</button>
        <button onClick={() => onNavigate('About')} className="hover:text-black transition-colors">Manifesto</button>
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={() => onNavigate('Main')} className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">Sign In</button>
        <button onClick={() => onNavigate('Booking')} className="bg-[#0a1628] text-white px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-0.15em hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10">Start Project</button>
      </div>
    </div>
  </nav>
);

export default MarketingHeader;
