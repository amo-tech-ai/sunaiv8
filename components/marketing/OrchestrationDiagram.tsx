
import React from 'react';

const OrchestrationDiagram: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#050508] relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
      {/* CSS for flowing animations */}
      <style>{`
        @keyframes flow {
          to {
            stroke-dashoffset: -200;
          }
        }
        .animate-flow {
          animation: flow 2s linear infinite;
        }
        .animate-flow-slow {
          animation: flow 4s linear infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; filter: drop-shadow(0 0 5px #10B981); }
          50% { opacity: 1; filter: drop-shadow(0 0 15px #10B981); }
        }
        .node-pulse {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      <svg viewBox="0 0 800 400" className="w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- CONNECTIONS (Static Background) --- */}
        <g stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" fill="none">
          {/* Input -> Orchestrator */}
          <path d="M 100 200 L 250 200" />
          
          {/* Orchestrator -> Agents */}
          <path d="M 250 200 C 300 200, 300 100, 400 100" /> {/* Top */}
          <path d="M 250 200 C 300 200, 300 200, 400 200" /> {/* Mid */}
          <path d="M 250 200 C 300 200, 300 300, 400 300" /> {/* Bot */}

          {/* Agents -> Gate */}
          <path d="M 400 100 C 500 100, 500 200, 600 200" />
          <path d="M 400 200 C 500 200, 500 200, 600 200" />
          <path d="M 400 300 C 500 300, 500 200, 600 200" />

          {/* Gate -> Execution */}
          <path d="M 600 200 L 750 200" />
        </g>

        {/* --- DATA PACKETS (Animated Dashes) --- */}
        <g stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round">
          {/* Input Flow */}
          <path d="M 100 200 L 250 200" strokeDasharray="10 190" className="animate-flow" />

          {/* Split Flow */}
          <path d="M 250 200 C 300 200, 300 100, 400 100" strokeDasharray="10 190" className="animate-flow" style={{ animationDelay: '0.2s' }} />
          <path d="M 250 200 C 300 200, 300 200, 400 200" strokeDasharray="10 190" className="animate-flow" style={{ animationDelay: '0.4s' }} />
          <path d="M 250 200 C 300 200, 300 300, 400 300" strokeDasharray="10 190" className="animate-flow" style={{ animationDelay: '0.6s' }} />

          {/* Converge Flow */}
          <path d="M 400 100 C 500 100, 500 200, 600 200" strokeDasharray="10 190" className="animate-flow" style={{ animationDelay: '0.8s' }} />
          <path d="M 400 200 C 500 200, 500 200, 600 200" strokeDasharray="10 190" className="animate-flow" style={{ animationDelay: '1.0s' }} />
          <path d="M 400 300 C 500 300, 500 200, 600 200" strokeDasharray="10 190" className="animate-flow" style={{ animationDelay: '1.2s' }} />

          {/* Execution Flow (Orange for action) */}
          <path d="M 600 200 L 750 200" stroke="#F59E0B" strokeDasharray="10 190" className="animate-flow" style={{ animationDelay: '1.4s' }} />
        </g>

        {/* --- NODES --- */}
        
        {/* User Input */}
        <g transform="translate(100, 200)" className="node-pulse">
          <circle r="20" fill="#050508" stroke="#10B981" strokeWidth="2" />
          <text x="0" y="35" textAnchor="middle" fill="#9CA3AF" fontSize="10" fontFamily="Inter" fontWeight="bold" letterSpacing="1">INPUT</text>
          <path d="M -5 0 L 5 0" stroke="#10B981" strokeWidth="2" />
          <path d="M 0 -5 L 0 5" stroke="#10B981" strokeWidth="2" />
        </g>

        {/* Orchestrator */}
        <g transform="translate(250, 200)">
          <circle r="25" fill="#0A1628" stroke="#3B82F6" strokeWidth="2" />
          <circle r="10" fill="#3B82F6" opacity="0.3" className="animate-pulse" />
          <text x="0" y="45" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="Inter" fontWeight="bold" letterSpacing="1">ORCHESTRATOR</text>
        </g>

        {/* Agents */}
        <g transform="translate(400, 100)">
          <rect x="-15" y="-15" width="30" height="30" rx="8" fill="#050508" stroke="#10B981" strokeWidth="1.5" />
          <text x="0" y="30" textAnchor="middle" fill="#6EE7B7" fontSize="9" fontFamily="Inter" fontWeight="bold">RESEARCH</text>
        </g>
        <g transform="translate(400, 200)">
          <rect x="-15" y="-15" width="30" height="30" rx="8" fill="#050508" stroke="#10B981" strokeWidth="1.5" />
          <text x="0" y="30" textAnchor="middle" fill="#6EE7B7" fontSize="9" fontFamily="Inter" fontWeight="bold">PLAN</text>
        </g>
        <g transform="translate(400, 300)">
          <rect x="-15" y="-15" width="30" height="30" rx="8" fill="#050508" stroke="#10B981" strokeWidth="1.5" />
          <text x="0" y="30" textAnchor="middle" fill="#6EE7B7" fontSize="9" fontFamily="Inter" fontWeight="bold">ANALYZE</text>
        </g>

        {/* Controller Gate */}
        <g transform="translate(600, 200)">
          <path d="M -20 0 L 0 -20 L 20 0 L 0 20 Z" fill="#050508" stroke="#F59E0B" strokeWidth="2" />
          <text x="0" y="40" textAnchor="middle" fill="#FCD34D" fontSize="10" fontFamily="Inter" fontWeight="bold" letterSpacing="1">GATE</text>
          <text x="0" y="4" textAnchor="middle" fill="#F59E0B" fontSize="14">🔒</text>
        </g>

        {/* Execution */}
        <g transform="translate(750, 200)" className="node-pulse">
          <circle r="20" fill="#10B981" stroke="#ffffff" strokeWidth="2" />
          <text x="0" y="35" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="Inter" fontWeight="bold" letterSpacing="1">EXECUTION</text>
          <text x="0" y="4" textAnchor="middle" fill="white" fontSize="14">⚡</text>
        </g>

      </svg>
    </div>
  );
};

export default OrchestrationDiagram;
