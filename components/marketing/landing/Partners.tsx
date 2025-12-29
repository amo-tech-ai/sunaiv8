
import React from 'react';

const Partners: React.FC = () => (
  <section className="py-32 bg-white border-y border-gray-50">
    <div className="max-w-7xl mx-auto px-8 text-center">
      <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-300 block mb-16">Selected Partners</span>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
        {['Vogue', 'LVMH', 'Farfetch', 'Net-a-Porter', 'Gucci', 'Dior'].map(brand => (
          <span key={brand} className="font-serif text-2xl font-bold text-black cursor-default">{brand}</span>
        ))}
      </div>
    </div>
  </section>
);

export default Partners;
