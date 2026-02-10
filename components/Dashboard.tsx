import React, { useState, useEffect, useMemo } from 'react';
import { IngestedItem, IndustryMode, DailyBrief } from '../types';
import { generateDailyBrief } from '../services/gemini';

interface DashboardProps {
  items: IngestedItem[];
  activeMode: IndustryMode;
}

const Dashboard: React.FC<DashboardProps> = ({ items, activeMode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [loadingBrief, setLoadingBrief] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const statusLabel = useMemo(() => {
    const hours = currentTime.getHours();
    if (hours >= 8 && hours < 18) return 'Active Day';
    if (hours >= 18 && hours < 23) return 'Evening Reflection';
    return 'Resting';
  }, [currentTime]);

  const filteredItems = useMemo(() => 
    items.filter(i => i.mode === activeMode || i.mode === IndustryMode.GENERAL), 
  [items, activeMode]);

  const tasks = filteredItems.filter(i => i.type === 'TASK');

  const handleGenerateBrief = async () => {
    if (items.length === 0) return;
    setLoadingBrief(true);
    try {
      const result = await generateDailyBrief(items, activeMode);
      setBrief(result);
    } catch (e) {
      console.error("Failed to generate brief", e);
    } finally {
      setLoadingBrief(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Daily View</h1>
          <p className="text-slate-400 text-sm mt-1">Current Status: <span className="text-blue-400 font-bold uppercase text-xs tracking-wider">{statusLabel}</span></p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-3xl font-light text-slate-300">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          </div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Queued Tasks</h3>
          <ul className="space-y-3 flex-1">
            {tasks.length ? tasks.slice(0, 5).map((s, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${s.metadata?.priority === 'HIGH' ? 'bg-red-500' : 'bg-slate-500'}`}></div> 
                <span className="truncate">{s.content}</span>
              </li>
            )) : <li className="text-sm italic text-slate-600">No active tasks. Capture one below.</li>}
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/20 p-6 rounded-3xl shadow-xl flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full"></div>
          <h3 className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">Active Focus</h3>
          <p className="text-2xl font-bold text-white leading-tight z-10">
            {tasks[0]?.content || "No current priority set."}
          </p>
          {tasks[0]?.metadata?.priority && (
            <span className="mt-2 inline-block text-[10px] font-bold px-2 py-1 bg-white/10 rounded text-white w-fit">
              {tasks[0].metadata.priority} PRIORITY
            </span>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Total Activity</h3>
            <p className="text-4xl font-bold text-white tracking-tighter">{filteredItems.length}</p>
            <p className="text-xs text-slate-500 mt-1 uppercase">Recorded Items in {activeMode}</p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
             <div className="bg-slate-500 h-full rounded-full" style={{ width: `${Math.min(filteredItems.length * 5, 100)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Daily Briefing Section */}
      <div className="border border-white/5 bg-white/[0.02] rounded-3xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Daily Briefing</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">AI Generated</span>
          </h2>
          <button 
            onClick={handleGenerateBrief}
            disabled={loadingBrief || items.length === 0}
            className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            {loadingBrief ? 'Generating...' : 'Refresh Brief'}
          </button>
        </div>

        {!brief ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            {items.length > 0 ? "Generate a brief to get an AI analysis of your day." : "Capture some items to generate a daily briefing."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Optimized Schedule</h3>
              <ul className="space-y-3">
                {brief.schedule.map((item, i) => (
                  <li key={i} className="text-sm text-slate-300 border-l-2 border-slate-700 pl-3 py-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Big Win Opportunity</h3>
              <p className="text-lg text-white font-serif italic leading-relaxed">
                "{brief.bigWin}"
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Creative Tip</h3>
              <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl">
                <p className="text-sm text-blue-200">
                  {brief.creativeTip}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6 pt-4">
        <h2 className="text-xl font-bold text-white">History Feed</h2>
        {filteredItems.length === 0 ? (
          <div className="p-16 text-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
            No local data found. Use the capture bar below to add logs.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.slice(0, 9).map(item => (
              <div key={item.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${
                    item.type === 'TASK' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-900/30' : 'bg-slate-950 text-slate-400 border-slate-900'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] text-slate-600">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm text-slate-300 group-hover:text-white transition-colors">{item.content}</p>
                {item.metadata?.priority && (
                  <div className="mt-3 flex gap-2">
                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Priority: {item.metadata.priority}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;