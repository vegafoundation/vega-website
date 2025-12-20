import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const apiConfig = {
  openai: process.env.OPENAI_API_KEY ? 'configured' : 'missing',
  suno: process.env.SUNO_API_KEY ? 'configured' : 'missing',
  vision: process.env.VISION_ENGINE_KEY ? 'configured' : 'missing',
  storytelling: process.env.STORY_ENGINE_KEY ? 'configured' : 'missing',
  context: process.env.CONTEXT_ENGINE_KEY ? 'configured' : 'missing',
  whitepaper: process.env.WHITEPAPER_ENGINE_KEY ? 'configured' : 'missing'
};

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/admin/config', (_req, res) => {
  res.json({
    message: 'Vega OS admin configuration',
    apis: apiConfig
  });
});

app.post('/telemetry', (req, res) => {
  const payload = req.body || {};
  console.log('[telemetry]', payload);
  res.status(202).json({ received: true, payload });
});

app.post('/story', (_req, res) => {
  res.json({
    engine: 'storytelling',
    status: 'stub',
    message: 'Connect to OpenAI + Storytelling Engine here'
  });
});

app.listen(port, () => {
  console.log(`VEGA backend listening on :${port}`);
});
