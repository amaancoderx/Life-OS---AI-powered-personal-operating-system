import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import GlobalCapture from './components/GlobalCapture';
import EnginePanel from './components/EnginePanel';
import Visualizer from './components/Visualizer';
import VoiceDiagnostic from './components/VoiceDiagnostic';
import { AppSection, IngestedItem, IndustryMode } from './types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.DASHBOARD);
  const [activeMode, setActiveMode] = useState<IndustryMode>(IndustryMode.GENERAL);
  const [items, setItems] = useState<IngestedItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('LIFE_OS_STORE');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Storage error", e);
      }
    }
    const savedMode = localStorage.getItem('LIFE_OS_MODE');
    if (savedMode) setActiveMode(savedMode as IndustryMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('LIFE_OS_STORE', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('LIFE_OS_MODE', activeMode);
  }, [activeMode]);

  const handleIngest = (newItem: IngestedItem) => {
    setItems(prev => [newItem, ...prev]);
  };

  const renderSection = () => {
    switch (activeSection) {
      case AppSection.DASHBOARD:
        return <Dashboard items={items} activeMode={activeMode} />;
      case AppSection.STRATEGIST:
        return <EnginePanel />;
      case AppSection.VISUALIZER:
        return <Visualizer />;
      case AppSection.VOICE:
        return <VoiceDiagnostic />;
      default:
        return <Dashboard items={items} activeMode={activeMode} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100">
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        activeMode={activeMode}
        setActiveMode={setActiveMode}
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto py-12 px-6 pb-40">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2 opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               Life OS v3.1.0 // {activeMode} MODE
             </span>
          </div>
        </div>

        {renderSection()}
      </main>

      <GlobalCapture onIngest={handleIngest} activeMode={activeMode} />

      <footer className="py-8 px-6 text-center border-t border-white/5 bg-slate-950/30 mt-auto">
        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
          LIFE OS // Autonomous Operations Manager // 2025
        </p>
      </footer>
    </div>
  );
};

export default App;