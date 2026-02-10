
import React, { useState } from 'react';
import { planAutonomousStrategy } from '../services/gemini';
import { AgentPlan } from '../types';

const EnginePanel: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<AgentPlan | null>(null);

  const handlePlan = async () => {
    if (!goal) return;
    setLoading(true);
    try {
      const result = await planAutonomousStrategy(goal, context);
      setPlan(result);
    } catch (e) {
      console.error("Agent failed to reason", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Strategy Builder</h2>
            <p className="text-sm text-slate-500 mt-1">Tell Life OS your goal and it will build a plan.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">What is your big goal?</label>
              <textarea 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Ex: Start a side business by next month..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-blue-500 outline-none min-h-[120px] transition-all text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Helpful Context (Optional)</label>
              <textarea 
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Ex: I have 2 hours a day and $500 to spend..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-blue-500 outline-none min-h-[80px] transition-all text-white"
              />
            </div>

            <button
              onClick={handlePlan}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Agent Reasoning...
                </>
              ) : 'Develop Strategy'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {!plan && !loading && (
          <div className="h-full border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center text-slate-600 space-y-4">
             <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center">
               <div className="w-2 h-2 bg-slate-800 rounded-full animate-ping"></div>
             </div>
             <p className="max-w-[200px]">The agent will show its reasoning steps here once it starts planning.</p>
          </div>
        )}

        {loading && (
          <div className="h-full bg-slate-900/50 border border-slate-800 rounded-3xl p-12 flex flex-col justify-center items-center text-center space-y-6">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="space-y-2">
              <p className="text-white font-bold">Life OS is thinking...</p>
              <p className="text-xs text-slate-500 italic">"Analyzing your goal and mapping out paths..."</p>
            </div>
          </div>
        )}

        {plan && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4">Internal Reasoning</h3>
              <div className="space-y-4">
                {plan.reasoningSteps.map((step, i) => (
                  <div key={i} className="border-l-2 border-blue-500/30 pl-4 py-2 space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Step {i + 1}: {step.thought}</p>
                    <p className="text-sm text-slate-200">Action: {step.action}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Final Strategy</h3>
              <p className="text-2xl font-extrabold text-slate-900 leading-tight">
                {plan.finalStrategy}
              </p>
            </div>

            <div className="bg-orange-600/10 border border-orange-600/20 p-6 rounded-3xl">
              <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">Watch Out For:</h3>
              <ul className="space-y-2">
                {plan.potentialRisks.map((risk, i) => (
                  <li key={i} className="text-sm text-orange-200 flex items-center gap-2">
                    <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
            
            <button onClick={() => setPlan(null)} className="w-full text-xs text-slate-500 hover:text-white uppercase font-bold tracking-widest pt-4">
              New Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnginePanel;
