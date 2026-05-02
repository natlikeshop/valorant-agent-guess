'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export interface Agent {
  uuid: string;
  displayName: string;
  displayIcon: string;
  fullPortrait?: string;
  isPlayableCharacter: boolean;
  role?: {
    displayName: string;
    displayIcon: string;
  };
}

export function GameClient({ agents }: { agents: Agent[] }) {
  const [targetAgent, setTargetAgent] = useState<Agent | null>(null);
  const [eliminatedIds, setEliminatedIds] = useState<Set<string>>(new Set());

  // Randomize on initial load
  useEffect(() => {
    handleRandomize();
  }, [agents]);

  const handleRandomize = () => {
    if (agents.length === 0) return;
    const randomIndex = Math.floor(Math.random() * agents.length);
    setTargetAgent(agents[randomIndex]);
    setEliminatedIds(new Set());
  };

  const toggleEliminate = (agentId: string) => {
    setEliminatedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(agentId)) {
        newSet.delete(agentId);
      } else {
        newSet.add(agentId);
      }
      return newSet;
    });
  };

  if (!targetAgent) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0f141c] text-white font-sans selection:bg-[#ff4655]">
      {/* Top Section: Target Agent */}
      <div className="relative flex flex-col items-center pt-8 pb-6 w-full bg-gradient-to-b from-[#1a212b] to-[#0f141c]">
        {/* Refresh button placed absolutely or just rely on refresh page? Let's add a subtle refresh button */}
        <button 
          onClick={handleRandomize}
          className="absolute top-6 right-6 px-4 py-2 bg-[#ff4655]/10 hover:bg-[#ff4655]/20 text-[#ff4655] rounded text-sm font-bold uppercase tracking-widest transition-colors"
        >
          สุ่มใหม่ (Randomize)
        </button>

        <div className="relative w-full max-w-[400px] h-[300px] md:h-[400px] flex items-end justify-center">
          {/* Subtle glow behind target agent */}
          <div className="absolute inset-0 bg-[#ff4655]/10 blur-[80px] rounded-full top-1/4" />
          
          <Image
            src={targetAgent.fullPortrait || targetAgent.displayIcon}
            alt={targetAgent.displayName}
            fill
            className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-10"
            priority
          />
        </div>
        
        <div className="flex flex-col items-center mt-4 z-20">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-[0.2em] text-white">
            {targetAgent.displayName}
          </h1>
          {targetAgent.role && (
            <h2 className="text-[#ff4655] text-sm md:text-base font-bold uppercase tracking-[0.3em] mt-2">
              {targetAgent.role.displayName}
            </h2>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[2px] bg-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.5)]" />

      {/* Grid Section */}
      <div className="flex flex-col max-w-[1400px] mx-auto w-full px-4 md:px-8 py-6">
        <div className="text-neutral-400 text-sm mb-4 font-medium tracking-wide">
          กระดานตัวละครทั้งหมด — กดเพื่อตัดออก
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
          {agents.map((agent) => {
            const isEliminated = eliminatedIds.has(agent.uuid);
            return (
              <button
                key={agent.uuid}
                onClick={() => toggleEliminate(agent.uuid)}
                className="group relative flex flex-col items-center bg-[#1c232c] hover:bg-[#252e38] border border-transparent hover:border-neutral-600 transition-colors duration-200 overflow-hidden rounded-sm"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[3/4] p-2 flex items-center justify-center">
                  <Image
                    src={agent.fullPortrait || agent.displayIcon}
                    alt={agent.displayName}
                    fill
                    sizes="(max-width: 768px) 33vw, 20vw"
                    className={`object-contain transition-all duration-300 ${
                      isEliminated ? 'brightness-[0.25] grayscale' : 'drop-shadow-lg group-hover:scale-105'
                    }`}
                  />
                  
                  {/* Big Red X Overlay */}
                  {isEliminated && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 p-4">
                        <line x1="20" y1="20" x2="80" y2="80" stroke="#ff4655" strokeWidth="4" strokeLinecap="round" className="drop-shadow-[0_0_5px_rgba(255,70,85,1)]" />
                        <line x1="80" y1="20" x2="20" y2="80" stroke="#ff4655" strokeWidth="4" strokeLinecap="round" className="drop-shadow-[0_0_5px_rgba(255,70,85,1)]" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Name Label */}
                <div className={`w-full text-center py-2 text-xs md:text-sm font-bold uppercase tracking-wider ${
                  isEliminated ? 'text-neutral-600' : 'text-neutral-200'
                } bg-black/20`}>
                  {agent.displayName}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
