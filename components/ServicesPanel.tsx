
import React, { useState } from 'react';
import { Service, FocusState } from '../types';
import { MOCK_SERVICES } from '../constants';

interface ServicesPanelProps {
  onFocus: (type: 'service', item: Service) => void;
  focus: FocusState;
}

const ServiceRow: React.FC<{ service: Service; isActive: boolean; onClick: () => void }> = ({ service, isActive, onClick }) => (
  <div 
    onClick={onClick}
    className={`group flex items-center justify-between py-5 px-6 border border-transparent rounded-lg cursor-pointer transition-all duration-200 ${
      isActive ? 'bg-white border-gray-200 shadow-sm ring-1 ring-gray-100' : 'hover:bg-gray-50/50'
    }`}
  >
    <div className="flex-1">
      <div className="flex items-center space-x-3 mb-1">
        <span className="text-[9px] uppercase tracking-widest bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold">{service.category}</span>
        <h4 className="text-[15px] font-medium text-gray-900 leading-tight">{service.name}</h4>
      </div>
      <p className="text-[13px] text-gray-400 font-serif italic max-w-md">{service.description}</p>
    </div>
    <div className="flex items-center space-x-12 text-[12px] text-right">
      <div className="w-24">
        <span className="text-gray-400 uppercase tracking-tighter text-[9px] block mb-0.5">Investment</span>
        <span className="text-gray-700 font-medium">{service.price}</span>
      </div>
      <div className="w-24">
        <span className="text-gray-400 uppercase tracking-tighter text-[9px] block mb-0.5">Cycle</span>
        <span className="text-gray-700 font-medium">{service.duration}</span>
      </div>
    </div>
  </div>
);

const ServicesPanel: React.FC<ServicesPanelProps> = ({ onFocus, focus }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Strategy', 'Creative', 'Digital', 'Design'];

  const filtered = activeCategory === 'All' 
    ? MOCK_SERVICES 
    : MOCK_SERVICES.filter(s => s.category === activeCategory);

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#fafafa] p-12 pb-32">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl mb-4 tracking-tight">Service Catalog</h1>
          <p className="text-[14px] text-gray-400">Defining agency capabilities and standardized engagement models.</p>
        </div>
        <button className="bg-black text-white px-6 py-2.5 rounded-lg text-[12px] font-medium hover:bg-gray-800 transition-all">
          Create Service Request
        </button>
      </header>

      <div className="flex space-x-8 mb-10 border-b border-gray-100 pb-4">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[12px] uppercase tracking-widest font-bold transition-all pb-1 border-b-2 ${
              activeCategory === cat ? 'text-black border-black' : 'text-gray-300 border-transparent hover:text-gray-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {filtered.map((service) => (
          <ServiceRow 
            key={service.id} 
            service={service} 
            isActive={focus.id === service.id}
            onClick={() => onFocus('service', service)}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesPanel;
