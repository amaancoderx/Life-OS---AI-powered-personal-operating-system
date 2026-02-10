import React from 'react';
import { AppSection, IndustryMode } from '../types';

interface HeaderProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
  activeMode: IndustryMode;
  setActiveMode: (mode: IndustryMode) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection, activeMode, setActiveMode }) => {
  return (
    <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col xl:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-6 w-full xl:w-auto justify-between xl:justify-start">
        <div className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-sm shadow-lg shadow-slate-500/20">L</div>
          LIFE <span className="text-slate-400">OS</span>
        </div>
        
        <div className="flex gap-2 bg-slate-950/80 p-1 rounded-lg border border-white/5 overflow-x-auto">
          {Object.values(IndustryMode).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMode(m)}
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all rounded-md ${
                activeMode === m
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      
      <nav className="flex gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 justify-center">
        {[
          { id: AppSection.DASHBOARD, label: 'Dashboard' },
          { id: AppSection.STRATEGIST, label: 'Strategist' },
          { id: AppSection.VISUALIZER, label: 'Visualizer' },
          { id: AppSection.VOICE, label: 'Voice Link' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`px-4 py-2 text-xs font-bold transition-all rounded-lg whitespace-nowrap uppercase tracking-wide ${
              activeSection === item.id
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;