
import React from 'react';
import { WizardBlueprint } from '../../../hooks/useWizard';

interface Step3ConstraintsProps {
  blueprint: WizardBlueprint;
  onUpdate: (section: keyof WizardBlueprint, data: any) => void;
}

const TECH_STACKS = [
  'React', 'Next.js', 'Vue', 'Python', 'Node.js', 'Supabase', 'Firebase', 'PostgreSQL', 'Tailwind', 'Vercel'
];

const URGENCY_LEVELS = [
  { 
    id: 'Normal', 
    label: 'Standard', 
    desc: 'Quality focus. 8-12 weeks.',
    color: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  { 
    id: 'High', 
    label: 'Accelerated', 
    desc: 'Sprint mode. 4-8 weeks.',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700'
  },
  { 
    id: 'Critical', 
    label: 'Rush (MVP)', 
    desc: ' ASAP. < 4 weeks.',
    color: 'bg-amber-50 border-amber-200 text-amber-700'
  }
];

const Step3Constraints: React.FC<Step3ConstraintsProps> = ({ blueprint, onUpdate }) => {
  const budget = blueprint.constraints.budgetRange[1];

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    onUpdate('constraints', { budgetRange: [val * 0.75, val] });
  };

  const toggleTech = (tech: string) => {
    const current = blueprint.constraints.techStackPref || [];
    const updated = current.includes(tech) 
      ? current.filter(t => t !== tech)
      : [...current, tech];
    onUpdate('constraints', { techStackPref: updated });
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-3xl text-gray-900 mb-2">Define the boundaries.</h2>
        <p className="text-gray-500 text-[14px]">Budget and timeline determine the architecture.</p>
      </div>

      <div className="space-y-12">
        {/* Budget Slider */}
        <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-end mb-6">
            <label className="text-[11px] uppercase tracking-widest font-bold text-gray-400">
              Target Budget Ceiling
            </label>
            <div className="text-right">
              <span className="text-3xl font-serif text-gray-900">${budget.toLocaleString()}</span>
              <span className="text-gray-400 text-sm ml-1">USD</span>
            </div>
          </div>
          
          <input
            type="range"
            min="10000"
            max="250000"
            step="5000"
            value={budget}
            onChange={handleBudgetChange}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mt-4">
            <span>$10k (MVP)</span>
            <span>$250k (Enterprise)</span>
          </div>
        </section>

        {/* Urgency Selector */}
        <section>
          <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-4 text-center">
            Timeline Velocity
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {URGENCY_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => onUpdate('constraints', { timelineUrgency: level.id })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  blueprint.constraints.timelineUrgency === level.id
                    ? `${level.color} shadow-sm border-transparent ring-1 ring-black/5`
                    : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[14px]">{level.label}</span>
                  {blueprint.constraints.timelineUrgency === level.id && (
                    <span className="text-[10px] font-bold">✓</span>
                  )}
                </div>
                <p className="text-[11px] opacity-80">{level.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-4 text-center">
            Preferred Stack (Optional)
          </label>
          <div className="flex flex-wrap justify-center gap-2">
            {TECH_STACKS.map(tech => (
              <button
                key={tech}
                onClick={() => toggleTech(tech)}
                className={`px-4 py-2 rounded-full text-[12px] font-medium border transition-all ${
                  blueprint.constraints.techStackPref?.includes(tech)
                    ? 'bg-black text-white border-black shadow-lg'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Step3Constraints;
