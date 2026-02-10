
import React, { useState, useEffect } from 'react';
import { generateSystemVisual, editVisual, simulateVideo } from '../services/gemini';
import { ImageSize } from '../types';

const Visualizer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const ok = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(ok);
    };
    checkKey();
  }, []);

  const handleAuth = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    // CRITICAL: Per hackathon rules, assume success after triggering openSelectKey()
    setHasApiKey(true);
  };

  const handleGenerateImage = async () => {
    if (!prompt) return;
    setLoading(true);
    setStatusMessage('Generating Blueprint...');
    try {
      const url = await generateSystemVisual(prompt, imageSize);
      setImageUrl(url);
      setVideoUrl(null);
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        setStatusMessage('Error: Valid API key not found. Please re-select.');
      } else if (e.message?.includes("API Key Expired") || e.message?.includes("API key expired")) {
        setHasApiKey(false);
        setStatusMessage('Session Expired. Please select key again.');
      } else if (e.message?.includes("System Overloaded") || e.message?.includes("429")) {
        setStatusMessage('Traffic High: Usage limits reached. Please wait 60s.');
      } else if (e.message?.includes("Blueprint data not found")) {
        setStatusMessage('Generation failed. Please try a simpler prompt.');
      } else {
        setStatusMessage('System Error. Retrying usually fixes this.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditImage = async () => {
    if (!imageUrl || !editPrompt) return;
    setLoading(true);
    setStatusMessage('Applying Refinement...');
    try {
      const url = await editVisual(imageUrl, editPrompt);
      setImageUrl(url);
      setEditPrompt('');
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("API Key Expired") || e.message?.includes("API key expired")) {
        setHasApiKey(false);
        setStatusMessage('Session Expired. Please select key again.');
      } else if (e.message?.includes("System Overloaded")) {
        setStatusMessage('Traffic High: Usage limits reached. Please wait 60s.');
      } else {
        setStatusMessage('Edit Failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateVideo = async () => {
    if (!prompt) return;
    setLoading(true);
    setStatusMessage('Preparing Simulation (this may take a minute)...');
    try {
      const url = await simulateVideo(prompt);
      setVideoUrl(url);
      setImageUrl(null);
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("API Key Expired") || e.message?.includes("API key expired")) {
        setHasApiKey(false);
        setStatusMessage('Session Expired. Please select key again.');
      } else {
        setStatusMessage('Simulation Failed. Check quota or key.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="flex flex-col items-center justify-center p-12 md:p-20 text-center space-y-6 bg-slate-900 border border-white/5 rounded-3xl">
        <div className="max-w-md space-y-6">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/30">
            <span className="text-2xl font-bold text-blue-400">?</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Key Selection Required</h2>
            <p className="text-sm text-slate-400">
              Advanced system visualization (Gemini 3 Pro & Veo) requires a paid API key from a Google Cloud Project with billing enabled.
            </p>
          </div>
          <div className="pt-2">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-xs text-blue-500 font-bold underline block mb-6">VIEW BILLING DOCS</a>
            <button 
              onClick={handleAuth}
              className="w-full px-8 py-4 bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all rounded-xl shadow-lg shadow-blue-900/20"
            >
              Select Paid API Key
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom duration-500 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 shadow-xl">
            <h3 className="text-xs font-bold text-blue-400 tracking-widest uppercase">Visual Engine</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">Concept Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: A workflow for a long-running business agent..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-blue-500 outline-none min-h-[100px] text-white transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">BluePrint Quality</label>
              <div className="flex gap-2">
                {(['1K', '2K', '4K'] as ImageSize[]).map(size => (
                  <button
                    key={size}
                    onClick={() => setImageSize(size)}
                    className={`flex-1 py-2 text-xs font-bold border rounded-lg transition-all ${imageSize === size ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-800 text-slate-500'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                disabled={loading || !prompt}
                onClick={handleGenerateImage}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm uppercase disabled:opacity-30 transition-all"
              >
                Generate Blueprint
              </button>
              <button
                disabled={loading || !prompt}
                onClick={handleSimulateVideo}
                className="w-full border border-blue-600/50 text-blue-400 py-3 rounded-xl font-bold text-sm uppercase disabled:opacity-30 hover:bg-blue-600/5 transition-all"
              >
                Simulate Process
              </button>
            </div>
          </div>

          {imageUrl && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl animate-in zoom-in duration-300">
              <h3 className="text-xs font-bold text-blue-400 tracking-widest uppercase">Refinement</h3>
              <input
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Ex: Make it high contrast..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-blue-500 outline-none text-white"
              />
              <button
                disabled={loading || !editPrompt}
                onClick={handleEditImage}
                className="w-full bg-blue-600/10 border border-blue-600/30 text-blue-400 py-3 rounded-xl font-bold text-sm uppercase disabled:opacity-30"
              >
                Update Visual
              </button>
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="aspect-video bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center overflow-hidden relative shadow-2xl">
            {!imageUrl && !videoUrl && !loading && (
              <div className="text-center space-y-2 opacity-30">
                <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center mx-auto">
                   <div className="w-1 h-1 bg-slate-800 rounded-full animate-ping"></div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Waiting for command</p>
              </div>
            )}
            
            {loading && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-blue-500/20"></div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white tracking-tight">{statusMessage}</p>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">System Processing</p>
                </div>
              </div>
            )}
            
            {videoUrl && !loading && (
              <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
            )}
            
            {imageUrl && !videoUrl && !loading && (
              <img src={imageUrl} alt="System Visual" className="w-full h-full object-contain p-4" />
            )}
            
            {(imageUrl || videoUrl) && (
              <button 
                onClick={() => { setImageUrl(null); setVideoUrl(null); }}
                className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-3 py-1.5 hover:bg-black text-white rounded-lg font-bold text-[10px] uppercase border border-white/10"
              >
                Clear Visual
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900/40">
               <span className="text-[10px] font-bold text-slate-500 block mb-3 uppercase tracking-widest">Engine Status</span>
               <div className="space-y-2">
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                   <span className="text-[10px] font-semibold text-slate-400 uppercase">Visual: Gemini 3 Pro</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                   <span className="text-[10px] font-semibold text-slate-400 uppercase">Simulation: Veo 3.1</span>
                 </div>
               </div>
             </div>
             <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900/40">
               <span className="text-[10px] font-bold text-slate-500 block mb-3 uppercase tracking-widest">Metrics</span>
               <div className="space-y-2">
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] font-semibold text-slate-400 uppercase">Latency</span>
                   <span className="text-[10px] font-bold text-blue-400">240ms</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] font-semibold text-slate-400 uppercase">Load</span>
                   <span className="text-[10px] font-bold text-blue-400">Normal</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
