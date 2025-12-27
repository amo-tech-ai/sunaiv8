
import React from 'react';

interface NavItem {
  name: string;
  active: boolean;
}

interface LeftPanelProps {
  activeRoute: string;
  onNavigate: (name: string) => void;
  navItems: NavItem[];
}

const LeftPanel: React.FC<LeftPanelProps> = ({ activeRoute, onNavigate, navItems }) => {
  return (
    <aside className="w-64 border-r border-gray-200 h-screen bg-white flex flex-col p-8 overflow-y-auto">
      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-2">Workspace</span>
        <h2 className="font-serif text-xl">Sun AI Agency</h2>
      </div>

      <nav className="flex-1">
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium block mb-4">Navigation</span>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => onNavigate(item.name)}
                className={`w-full text-left py-1.5 text-[14px] transition-colors ${
                  item.active ? 'text-black font-semibold' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>

        <div className="my-8 border-t border-gray-100" />

        <ul className="space-y-1">
          <li>
            <button onClick={() => onNavigate('AI Wizard')} className="w-full text-left py-1.5 text-[14px] text-gray-500 hover:text-gray-800">AI Wizard (Demo)</button>
          </li>
          <li>
            <button onClick={() => onNavigate('Client Project')} className="w-full text-left py-1.5 text-[14px] text-gray-500 hover:text-gray-800">Client Project (Demo)</button>
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-8 border-t border-gray-100">
        <button 
          onClick={() => onNavigate('Settings')} 
          className={`text-[14px] transition-colors ${activeRoute === 'Settings' ? 'text-black font-semibold' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Settings
        </button>
      </div>
    </aside>
  );
};

export default LeftPanel;
