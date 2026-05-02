import { GameClient, Agent } from './game-client';

export default async function Home() {
  // Fetch agents data from Valorant API
  const res = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  
  if (!res.ok) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-neutral-950 text-white">
        <h1 className="text-3xl font-bold text-[#ff4655]">Error Loading Agents</h1>
        <p className="mt-4 text-neutral-400">Please try again later.</p>
      </main>
    );
  }

  const data = await res.json();
  // Filter out any potential duplicates or non-playable characters just in case
  const agents: Agent[] = data.data.filter((agent: any) => agent.isPlayableCharacter);

  // Sort alphabetically
  agents.sort((a, b) => a.displayName.localeCompare(b.displayName));

  return (
    <main className="flex min-h-screen flex-col items-center bg-neutral-950 text-white selection:bg-[#ff4655] selection:text-white font-outfit">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#ff4655 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="z-10 w-full flex-1 flex flex-col">
        <GameClient agents={agents} />
      </div>
    </main>
  );
}
