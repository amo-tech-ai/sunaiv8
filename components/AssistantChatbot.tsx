
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';

interface AssistantChatbotProps {
  workspace: {
    contacts: any[];
    projects: any[];
  };
}

const AssistantChatbot: React.FC<AssistantChatbotProps> = ({ workspace }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: "Hello. I'm your Agency Assistant. How can I help clarify your current workspace data?" }
  ]);

  const suggestions = [
    "What are my high-priority tasks?",
    "Show me leads added recently",
    "Which projects are at risk?",
    "Summarize Maison Laurent's status"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (customQuery?: string) => {
    const activeQuery = customQuery || query;
    if (!activeQuery.trim() || isTyping) return;
    
    setMessages(prev => [...prev, { role: 'user', text: activeQuery }]);
    setQuery('');
    setIsTyping(true);

    const response = await getChatResponse(activeQuery, workspace);
    
    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      {isOpen ? (
        <div className="w-80 h-[480px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
          <header className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full bg-emerald-500 ${isTyping ? 'animate-pulse' : ''}`} />
              <span className="text-[11px] uppercase tracking-widest font-bold text-gray-500">Agency Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-gray-600">✕</button>
          </header>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-[13px] leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 font-serif italic border border-gray-50 shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-50 text-gray-400 p-2 px-4 rounded-full text-[10px] animate-pulse">
                  Consulting workspace memory...
                </div>
              </div>
            )}
            
            {!isTyping && messages.length < 3 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(s)}
                    className="text-[10px] px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-500 hover:border-black hover:text-black transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100 focus-within:border-black transition-all">
              <input 
                type="text" 
                value={query}
                autoFocus
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query pipeline or projects..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] text-gray-700 outline-none"
              />
              <button onClick={() => handleSend()} disabled={isTyping} className="ml-2 text-[18px] hover:scale-110 transition-transform disabled:opacity-30">✧</button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all group"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">✧</span>
        </button>
      )}
    </div>
  );
};

export default AssistantChatbot;
