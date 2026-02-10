
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createAI } from '../services/gemini';
import { Modality } from '@google/genai';

const VoiceDiagnostic: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const nextStartTimeRef = useRef(0);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const stopDiagnostic = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    setIsActive(false);
  }, []);

  const startDiagnostic = async () => {
    try {
      const ai = createAI();
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message) => {
            if (message.serverContent?.outputTranscription) {
              setTranscripts(prev => [...prev, `[ENGINE]: ${message.serverContent?.outputTranscription?.text}`]);
            }
            if (message.serverContent?.inputTranscription) {
              setTranscripts(prev => [...prev, `[USER]: ${message.serverContent?.inputTranscription?.text}`]);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live Error:', e);
            stopDiagnostic();
          },
          onclose: () => {
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: "You are the Human Optimization Engine Voice Interface. Treat the user as a software system. Use engineering terminology (bottlenecks, latency, loops). Be direct, brief, and objective. No comfort. No motivation.",
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error("Diagnostic initialization failed:", e);
      stopDiagnostic();
      alert("System Error: Unable to access microphone or connect to voice service. Please check browser permissions.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 space-y-8">
      <div className="relative">
        <div className={`w-32 h-32 rounded-full border-2 ${isActive ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'border-neutral-800'} flex items-center justify-center transition-all duration-500`}>
          <div className={`w-24 h-24 rounded-full bg-neutral-900 border ${isActive ? 'border-cyan-400 animate-pulse' : 'border-neutral-800'} flex items-center justify-center`}>
            {isActive && (
              <div className="flex items-end gap-1 h-8">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-1 bg-cyan-500 animate-[wave_1s_infinite]" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>

      <div className="max-w-md text-center space-y-4">
        <h2 className="text-xl mono font-bold text-neutral-100 uppercase tracking-tighter">Diagnostic Voice Protocol</h2>
        <p className="text-sm text-neutral-500 mono leading-relaxed">
          Initialize real-time vocal analysis. Speak clearly to allow the Engine to detect audio-based system bugs and stress markers.
        </p>
      </div>

      <button
        onClick={isActive ? stopDiagnostic : startDiagnostic}
        className={`px-12 py-4 mono font-bold text-sm uppercase transition-all rounded-sm border ${
          isActive 
            ? 'border-red-500 text-red-500 hover:bg-red-500/10' 
            : 'border-cyan-500 text-cyan-500 hover:bg-cyan-500/10'
        }`}
      >
        {isActive ? 'Terminate Connection' : 'Establish Voice Link'}
      </button>

      {transcripts.length > 0 && (
        <div className="w-full max-w-2xl bg-neutral-900/40 border border-neutral-800 rounded p-4 h-48 overflow-y-auto font-mono text-[10px] space-y-2">
          {transcripts.map((t, i) => (
            <div key={i} className={t.startsWith('[ENGINE]') ? 'text-cyan-400' : 'text-neutral-400'}>
              {t}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceDiagnostic;
