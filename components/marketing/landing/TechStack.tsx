
import React, { useEffect, useRef, useState } from 'react';

interface TechItem {
  name: string;
  description: string;
}

interface TechCardProps {
  category: string;
  items: TechItem[];
  index: number;
}

const TechCard: React.FC<TechCardProps> = ({ category, items, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 80);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`bg-[#0a1628] border border-white/5 p-8 rounded-[22px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group flex flex-col h-full hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-emerald-500 mb-6 group-hover:text-emerald-400 transition-colors">
        {category}
      </h3>
      <div className="h-px w-full bg-white/5 mb-8" />
      
      <div className="space-y-8 flex-1">
        {items.map((item, i) => (
          <div key={i} className="space-y-1">
            <h4 className="text-[15px] font-medium text-white">{item.name}</h4>
            <p className="text-[12px] text-gray-500 font-light leading-relaxed group-hover:text-gray-400 transition-colors">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const TechStack: React.FC = () => {
  const categories = [
    {
      category: "Frontend & Development",
      items: [
        { name: "Cursor", description: "AI-powered IDE for accelerated development" },
        { name: "Claude Code", description: "AI-assisted coding and refactoring" },
        { name: "Figma", description: "System design, flows, and UI screens" }
      ]
    },
    {
      category: "AI Models",
      items: [
        { name: "Gemini 3 (Pro / Flash)", description: "Strategic reasoning and real-time AI execution" },
        { name: "Claude", description: "Advanced reasoning and long-context intelligence" },
        { name: "OpenAI", description: "General-purpose GPT-powered AI capabilities" }
      ]
    },
    {
      category: "Backend, Data & Automation",
      items: [
        { name: "Supabase", description: "PostgreSQL, authentication, storage, edge functions" },
        { name: "Vercel", description: "Production-grade hosting and deployments" },
        { name: "GitHub", description: "CI pipelines and repository management" },
        { name: "n8n", description: "Workflow automation and system integrations" }
      ]
    },
    {
      category: "Marketing Channels",
      items: [
        { name: "WhatsApp", description: "Messaging and automation" },
        { name: "Amazon", description: "E-commerce integrations" },
        { name: "Shopify", description: "Commerce workflows" },
        { name: "Instagram / Facebook", description: "Social distribution and engagement" }
      ]
    }
  ];

  return (
    <section className="py-40 bg-[#050508] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <header className="mb-24 space-y-4">
          <span className="text-[11px] uppercase tracking-[0.4em] font-bold text-gray-500 block mb-2">TOOLS & TECHNOLOGIES</span>
          <h2 className="font-serif text-5xl text-white leading-tight">Our Technology Stack</h2>
          <p className="text-lg text-gray-400 font-light leading-relaxed max-w-2xl">
            A focused, production-proven stack powering scalable AI systems and automation.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <TechCard
              key={cat.category}
              index={i}
              category={cat.category}
              items={cat.items}
            />
          ))}
        </div>
        
        {/* Footer Metrics for the section */}
        <div className="mt-32 pt-16 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
           <div>
             <span className="text-4xl font-serif text-emerald-500 block mb-2">20+</span>
             <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Technologies Mastered</span>
           </div>
           <div>
             <span className="text-4xl font-serif text-emerald-500 block mb-2">99.9%</span>
             <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Uptime Guaranteed</span>
           </div>
           <div>
             <span className="text-4xl font-serif text-emerald-500 block mb-2">24/7</span>
             <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Monitoring & Support</span>
           </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
