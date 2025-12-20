import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { loadConfig, saveConfig } from './config.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';
const SESSIONS = new Map();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '..', 'public')));

function authenticate(req, res, next) {
  const token = req.headers['x-vega-token'] || req.query.token;
  if (!token || !SESSIONS.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.session = SESSIONS.get(token);
  next();
}

app.get('/api/config', (req, res) => {
  res.json(loadConfig());
});

app.get('/api/manifest', (req, res) => {
  const manifestPath = path.join(__dirname, '..', 'public', 'data', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const config = loadConfig();
  res.json({
    ...manifest,
    generatedAt: new Date().toISOString(),
    site: config.site,
    endpoints: {
      ...manifest.endpoints,
      config: '/api/config',
      manifest: '/api/manifest',
      whitepaper: '/api/whitepaper',
      soundscapes: '/api/soundscapes',
      modules: '/api/modules'
    }
  });
});

app.post('/api/config', authenticate, (req, res) => {
  const updated = { ...loadConfig(), ...req.body };
  saveConfig(updated);
  res.json(updated);
});

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Invalid credentials' });
  }
  const token = uuidv4();
  const expiresAt = Date.now() + 1000 * 60 * 60 * 4;
  SESSIONS.set(token, { issued: Date.now(), expiresAt });
  res.json({ token, expiresAt });
});

app.post('/api/logout', authenticate, (req, res) => {
  const token = req.headers['x-vega-token'] || req.query.token;
  SESSIONS.delete(token);
  res.json({ success: true });
});

app.get('/api/whitepaper', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'data', 'whitepaper.json'));
});

app.get('/api/modules', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'data', 'modules.json'));
});

app.get('/api/soundscapes', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'data', 'soundscapes.json'));
});

app.get('/api/infinity', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'data', 'infinity.json'));
});

app.get('/api/heartbeat', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vega server running at http://localhost:${PORT}`);
});
