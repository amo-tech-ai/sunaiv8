
import React from 'react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const MarketingFooter: React.FC<FooterProps> = ({ onNavigate }) => (
  <footer className="bg-[#0a1628] text-white py-24 px-8 border-t border-white/5 mt-auto">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
      <div className="space-y-8">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('Home')}>
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#0a1628] text-xl font-serif">S</span>
          </div>
          <h2 className="font-serif text-2xl text-white">Sun AI Agency</h2>
        </div>
        <p className="text-gray-400 font-light leading-relaxed text-sm">
          Engineering high-fidelity operations and creative systems for the next era of commerce.
        </p>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-500">Navigation</h4>
        <ul className="space-y-3 text-[13px] text-gray-400">
          <li onClick={() => onNavigate('Home')} className="hover:text-white transition-colors cursor-pointer">Home</li>
          <li onClick={() => onNavigate('Public Services')} className="hover:text-white transition-colors cursor-pointer">Expertise Catalog</li>
          <li onClick={() => onNavigate('AI Agents')} className="hover:text-white transition-colors cursor-pointer flex items-center">
            AI Agents <span className="ml-2 text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">NEW</span>
          </li>
          <li onClick={() => onNavigate('Work')} className="hover:text-white transition-colors cursor-pointer">Selected Case Studies</li>
          <li onClick={() => onNavigate('About')} className="hover:text-white transition-colors cursor-pointer">Our Manifesto</li>
        </ul>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-500">Platform</h4>
        <ul className="space-y-3 text-[13px] text-gray-400">
          <li onClick={() => onNavigate('Main')} className="hover:text-white transition-colors cursor-pointer">Main Dashboard</li>
          <li onClick={() => onNavigate('CRM')} className="hover:text-white transition-colors cursor-pointer">CRM Pipeline</li>
          <li onClick={() => onNavigate('Projects')} className="hover:text-white transition-colors cursor-pointer">Projects Portfolio</li>
          <li onClick={() => onNavigate('Project Intelligence')} className="hover:text-white transition-colors cursor-pointer flex items-center group">
            Project Intelligence <span className="ml-2 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
          </li>
          <li onClick={() => onNavigate('Execution Plan')} className="hover:text-white transition-colors cursor-pointer">Execution Plan</li>
          <li onClick={() => onNavigate('Tasks')} className="hover:text-white transition-colors cursor-pointer">Execution Manager</li>
          <li onClick={() => onNavigate('Booking')} className="pt-4 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer font-bold flex items-center">
            Start Project Wizard <span className="ml-2">→</span>
          </li>
        </ul>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-500">Contact</h4>
        <ul className="space-y-4 text-[13px] text-gray-400">
          <li className="hover:text-white transition-colors cursor-pointer flex items-center space-x-2">
            <span>✉️</span>
            <span>hello@sunai.agency</span>
          </li>
          <li className="flex items-center space-x-2">
            <span>📍</span>
            <span>London / Paris / NYC</span>
          </li>
          <li className="pt-6 flex space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-widest">LinkedIn</span>
            <span className="hover:text-white transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-widest">Twitter</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest font-bold gap-4">
      <span>© 2024 Sun AI Agency</span>
      <div className="flex space-x-8">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
      </div>
    </div>
  </footer>
);

export const Footer = MarketingFooter;
export default MarketingFooter;
