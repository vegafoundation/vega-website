import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const modules = [
  { name: 'Vision Engine', status: 'Live', description: 'Visual intelligence and asset streaming.', accent: 'neon.cyan' },
  { name: 'Storytelling Engine', status: 'Live', description: 'Narrative generation and sequencing.', accent: 'neon.purple' },
  { name: 'Context Engine', status: 'Listening', description: 'Conversation memory + retrieval.', accent: 'neon.teal' },
  { name: 'Whitepaper Portal', status: 'Available', description: 'Knowledge base with inline citations.', accent: 'neon.cyan' },
  { name: 'Soundscapes', status: 'Ready', description: '8D ambient audio mixer powered by Suno.', accent: 'neon.purple' },
  { name: 'Infinity Loop', status: 'Logging', description: 'Real-time telemetry + adaptive models.', accent: 'neon.teal' }
];

const ModuleCard = ({ name, status, description }) => (
  <div className="glass-panel rounded-2xl p-5 border border-white/10 transition hover:-translate-y-1 hover:shadow-neon">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xl font-semibold">{name}</h3>
      <span className="px-3 py-1 text-xs rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/40">
        {status}
      </span>
    </div>
    <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
  </div>
);

const TelemetryList = () => (
  <div className="glass-panel rounded-2xl p-5 space-y-2">
    <h4 className="text-lg font-semibold mb-2">Infinity Loop</h4>
    {['Session started', 'Story viewed: Nova Pulse', 'Soundscape switched: Aurora Drift', 'Whitepaper pinned: VEGA OS Spec'].map((item, index) => (
      <div key={index} className="flex items-center text-sm text-slate-300">
        <span className="w-2 h-2 rounded-full bg-neon-teal mr-2 animate-pulse" />
        {item}
      </div>
    ))}
  </div>
);

const AdminPanel = () => (
  <div className="glass-panel rounded-2xl p-5 space-y-3">
    <h4 className="text-lg font-semibold">Admin Quick Actions</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {["Rotate API Keys", "Deploy Update", "Sync Mobile", "Review Telemetry"].map((action) => (
        <button
          key={action}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:border-neon-cyan/40 hover:text-neon-cyan transition"
        >
          {action}
        </button>
      ))}
    </div>
    <div className="text-xs text-slate-400">Secure controls for credentials, module toggles, and rollout.</div>
  </div>
);

const SoundscapePanel = () => (
  <div className="glass-panel rounded-2xl p-5 space-y-3">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-lg font-semibold">Soundscape</h4>
        <p className="text-sm text-slate-300">Immersive 8D audio powered by Suno</p>
      </div>
      <button className="px-4 py-2 rounded-full bg-neon-purple/40 text-white border border-neon-purple/50 hover:bg-neon-purple/60 transition">Play</button>
    </div>
    <div className="space-y-2">
      {['Aurora Drift', 'Chrome Gardens', 'Nebula Pulse'].map((track) => (
        <div key={track} className="flex items-center justify-between text-sm text-slate-200">
          <span>{track}</span>
          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-neon-cyan animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const App = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-neon-cyan">VEGA OS</p>
          <h1 className="text-4xl md:text-5xl font-bold">Meta-operating system for every Vega module</h1>
          <p className="mt-3 text-slate-300 max-w-3xl">
            Unified dashboard for the Vision Engine, Storytelling Engine, Context Engine, Soundscapes, Whitepaper Portal, and Infinity Loop telemetry.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-full bg-white text-slate-950 font-semibold">Launch Admin</button>
          <button className="px-4 py-2 rounded-full border border-white/30 text-white hover:border-neon-cyan/60 hover:text-neon-cyan transition">Live Preview</button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-5">
            <h2 className="text-2xl font-semibold mb-4">Modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modules.map((module) => (
                <ModuleCard key={module.name} {...module} />
              ))}
            </div>
          </div>
          <SoundscapePanel />
        </div>
        <div className="space-y-6">
          <TelemetryList />
          <AdminPanel />
        </div>
      </section>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

