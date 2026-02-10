import React, { useState } from 'react';
import { IngestedItem, IndustryMode } from '../types';
import { parseUnifiedInput } from '../services/gemini';

interface GlobalCaptureProps {
  onIngest: (item: IngestedItem) => void;
  activeMode: IndustryMode;
}

const GlobalCapture: React.FC<GlobalCaptureProps> = ({ onIngest, activeMode }) => {
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);

  const placeholders = {
    [IndustryMode.ACADEMIC]: "Enter a student task or assignment...",
    [IndustryMode.ECOMMERCE]: "Log a business event or sale...",
    [IndustryMode.CREATIVE]: "Jot down a design note or idea...",
    [IndustryMode.GENERAL]: "Add anything to your day..."
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || processing) return;

    setProcessing(true);
    
    try {
      // Use AI to parse the input intelligently
      const parsed = await parseUnifiedInput(input, activeMode);
      
      const newItem: IngestedItem = {
        id: crypto.randomUUID(),
        type: parsed.type || 'NOTE', // Fallback to NOTE
        content: parsed.content || input, // Use AI summary or original
        timestamp: Date.now(),
        mode: activeMode,
        metadata: parsed.metadata
      };
      
      onIngest(newItem);
      setInput('');
    } catch (error) {
      // Fallback for offline or error
      console.warn("AI Parsing failed, falling back to manual", error);
      const newItem: IngestedItem = {
        id: crypto.randomUUID(),
        type: input.toLowerCase().includes('task') ? 'TASK' : 'NOTE',
        content: input,
        timestamp: Date.now(),
        mode: activeMode,
      };
      onIngest(newItem);
      setInput('');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50">
      <form 
        onSubmit={handleSubmit}
        className={`bg-slate-900 border ${processing ? 'border-blue-500/50' : 'border-white/10'} rounded-2xl shadow-2xl flex items-center p-2 backdrop-blur-xl transition-all duration-300`}
      >
        <div className="pl-4 pr-2">
          {processing ? (
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
          ) : (
             <div className={`w-2 h-2 rounded-full bg-slate-700`}></div>
          )}
        </div>
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={processing ? "Analyzing input..." : placeholders[activeMode]}
          className="flex-1 bg-transparent border-none outline-none text-sm py-4 text-white placeholder:text-slate-600"
          autoFocus
          disabled={processing}
        />
        <button 
          type="submit"
          disabled={!input.trim() || processing}
          className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white px-8 py-2 rounded-xl text-xs font-bold uppercase transition-all shadow-lg min-w-[100px]"
        >
          {processing ? 'Saving...' : 'Capture'}
        </button>
      </form>
    </div>
  );
};

export default GlobalCapture;