
import React, { useEffect, useRef, useState } from 'react';

const CTASection: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-white relative overflow-hidden">
      {/* Soft background decorative element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          
          <div className={`space-y-6 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-serif text-5xl md:text-[64px] leading-tight text-[#0F172A] tracking-tight">
              Ready to Build <br />
              <span className="text-[#FF6B2C]">Something Extraordinary?</span>
            </h2>
            <p className="text-xl text-[#475569] font-light max-w-2xl mx-auto leading-relaxed">
              Let’s design, build, and scale your AI systems — starting today.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button 
              onClick={() => onNavigate?.('Booking')}
              className="bg-[#FF6B2C] text-white px-10 py-5 rounded-2xl text-[13px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#FF6B2C]/20 group flex items-center"
            >
              Start Your Project <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button 
              onClick={() => onNavigate?.('Work')}
              className="bg-[#0F172A] text-white px-10 py-5 rounded-2xl text-[13px] font-bold uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-[#0F172A]/10"
            >
              Talk to a Strategist
            </button>
          </div>

          <div className={`pt-24 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-full h-px bg-gray-100 mb-16" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-2">
                <span className="text-3xl font-serif text-[#0F172A]">50+</span>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#64748B]">Projects Completed</p>
              </div>
              <div className="space-y-2">
                <span className="text-3xl font-serif text-[#0F172A]">100%</span>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#64748B]">Success Rate</p>
              </div>
              <div className="space-y-2">
                <span className="text-3xl font-serif text-[#0F172A]">8 Weeks</span>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#64748B]">Avg. Delivery</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom corner branding detail */}
      <div className="absolute bottom-12 right-12 opacity-[0.03] select-none pointer-events-none hidden lg:block">
        <span className="font-serif text-9xl italic">Sun AI</span>
      </div>
    </section>
  );
};

export default CTASection;
