import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const configPath = path.resolve('public/data/config.json');

export function loadConfig() {
  const defaultConfig = {
    site: {
      title: 'Vega Foundation',
      theme: 'chrome-glass',
      primaryColor: '#7ef9ff',
      accentColor: '#e645ff'
    },
    apis: {
      openai: { endpoint: 'https://api.openai.com', key: process.env.OPENAI_API_KEY || 'set-me' },
      suno: { endpoint: 'https://api.suno.ai', key: process.env.SUNO_API_KEY || 'set-me' },
      croc: { endpoint: 'https://api.croc.ai', key: process.env.CROC_API_KEY || 'set-me' },
      xai: { endpoint: 'https://api.x.ai', key: process.env.XAI_API_KEY || 'set-me' }
    },
    whitepaper: {
      url: '/data/whitepaper.json',
      lastUpdated: new Date().toISOString()
    },
    soundscapes: {
      defaultEngine: 'stellar',
      options: [
        { id: 'stellar', name: 'Stellar Drift', mode: '8D spatial' },
        { id: 'crystal', name: 'Crystal Bloom', mode: 'live generation' },
        { id: 'orbit', name: 'Orbit Trails', mode: 'dynamic prompts' }
      ]
    },
    engines: [
      { id: 'vision', name: 'Vision Engine', status: 'synced', latency: 120, description: 'Prompt-to-visual narratives with chrome-glass aesthetic.' },
      { id: 'context', name: 'Context Engine', status: 'live', latency: 80, description: 'Memory-backed context flows for web + API.' },
      { id: 'story', name: 'Storytelling Engine', status: 'live', latency: 95, description: 'Narrative weaving with safety filters and dynamic cues.' },
      { id: 'sound', name: 'Soundscape Engine', status: 'stable', latency: 60, description: '8D spatial mixing with admin-tuned layers.' }
    ],
    changelog: [
      { date: new Date().toISOString(), summary: 'Autosync bootstrap with API placeholders and admin token guard.' },
      { date: new Date().toISOString(), summary: 'Engines unified with status and latency targets.' }
    ]
  };

  try {
    const file = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(file);
  } catch (err) {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
}

export function saveConfig(data) {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
  return data;
}
