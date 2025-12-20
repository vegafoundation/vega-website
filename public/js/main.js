async function fetchWithFallback(primary, fallback, label) {
  try {
    const res = await fetch(primary);
    if (!res.ok) throw new Error(`${label} failed via API`);
    return { data: await res.json(), source: 'api' };
  } catch (err) {
    console.warn(`${label} API unavailable, using fallback`, err);
    const res = await fetch(fallback);
    if (!res.ok) throw new Error(`${label} fallback failed`);
    return { data: await res.json(), source: 'fallback' };
  }
}

const fetchConfig = () => fetchWithFallback('/api/config', '/data/config.json', 'Config');
const fetchManifest = () => fetchWithFallback('/api/manifest', '/data/manifest.json', 'Manifest');
const fetchModules = () => fetchWithFallback('/api/modules', '/data/modules.json', 'Modules');
const fetchSoundscapesData = () => fetchWithFallback('/api/soundscapes', '/data/soundscapes.json', 'Soundscapes');
const fetchWhitepaper = () => fetchWithFallback('/api/whitepaper', '/data/whitepaper.json', 'Whitepaper');
const fetchInfinity = () => fetchWithFallback('/api/infinity', '/data/infinity.json', 'Infinity loop');

async function fetchHeartbeat() {
  try {
    const res = await fetch('/api/heartbeat');
    if (!res.ok) throw new Error('Heartbeat failed');
    return { data: await res.json(), source: 'api' };
  } catch (err) {
    console.warn('Heartbeat degraded; marking offline', err);
    return { data: { status: 'degraded', timestamp: Date.now() }, source: 'fallback' };
  }
}

function renderAPIs(config) {
  const grid = document.getElementById('api-grid');
  grid.innerHTML = '';
  Object.entries(config.apis).forEach(([id, api]) => {
    const card = document.createElement('div');
    card.className = 'card';
    const state = api.key === 'set-me' ? '<span class="pill pill--soft">pending</span>' : '<span class="pill pill--soft">ready</span>';
    card.innerHTML = `<div class="card__meta"><h4>${id.toUpperCase()}</h4>${state}</div><p>${api.endpoint}</p><small>Token stored env-side</small>`;
    grid.appendChild(card);
  });
}

function renderSources(sources) {
  const grid = document.getElementById('source-grid');
  const status = document.getElementById('sync-status');
  grid.innerHTML = '';
  let degradedCount = 0;
  sources.forEach(source => {
    if (source.source === 'fallback') degradedCount++;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card__meta">
        <h4>${source.label}</h4>
        <span class="badge ${source.source === 'fallback' ? 'badge--fallback' : 'badge--api'}">${source.source}</span>
      </div>
      <p>${source.description}</p>
      <small>${source.path}</small>
    `;
    grid.appendChild(card);
  });
  status.textContent = degradedCount > 0 ? `${degradedCount} using fallback` : 'Live via API';
  status.classList.toggle('status--degraded', degradedCount > 0);
}

function renderWhitepaper(data) {
  const container = document.getElementById('whitepaper-content');
  container.innerHTML = '';
  const meta = document.getElementById('whitepaper-meta');
  meta.textContent = `Version ${data.version} • Updated ${new Date(data.lastUpdated || Date.now()).toLocaleString()}`;
  const toc = document.getElementById('whitepaper-toc');
  toc.innerHTML = '';
  (data.toc || []).forEach(entry => {
    const pill = document.createElement('span');
    pill.className = 'pill';
    pill.textContent = entry.label;
    toc.appendChild(pill);
  });
  data.sections.forEach(section => {
    const entry = document.createElement('div');
    entry.className = 'entry';
    entry.innerHTML = `<h4>${section.heading}</h4><p>${section.content}</p>`;
    container.appendChild(entry);
  });
}

function renderSoundscapes(config, playlists, audioEl) {
  const list = document.getElementById('soundscape-list');
  list.innerHTML = '';
  const available = playlists?.playlists || [];
  let defaultSrc = '';
  available.forEach(track => {
    const isDefault = track.id === config.soundscapes.defaultEngine;
    const li = document.createElement('li');
    li.innerHTML = `<div><strong>${track.title}</strong> — ${track.engine} • ${track.mode}</div><small>${track.length}${isDefault ? ' • default' : ''}</small>`;
    li.onclick = () => {
      audioEl.src = track.preview;
      audioEl.play();
    };
    list.appendChild(li);
    if (isDefault) {
      defaultSrc = track.preview;
    }
  });

  if (defaultSrc && !audioEl.src) {
    audioEl.src = defaultSrc;
  }
}

function renderEngines(config) {
  const grid = document.getElementById('engine-grid');
  grid.innerHTML = '';
  config.engines.forEach(engine => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="card__meta"><h4>${engine.name}</h4><span class="pill pill--soft">${engine.status}</span></div><p>${engine.description}</p><small>Latency target: ${engine.latency}ms</small>`;
    grid.appendChild(card);
  });
}

function renderChangelog(log) {
  const list = document.getElementById('changelog-list');
  list.innerHTML = '';
  log.forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${entry.summary}</span><small>${entry.date}</small>`;
    list.appendChild(li);
  });
}

function renderManifest(manifest) {
  const manifestEl = document.getElementById('manifest-version');
  manifestEl.textContent = `v${manifest.version}${manifest.cached ? ' • cached' : ''}`;
  manifestEl.classList.toggle('status--degraded', Boolean(manifest.cached));
  const moduleGrid = document.getElementById('module-grid');
  moduleGrid.innerHTML = '';
  (manifest.modules || []).forEach(mod => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="card__meta"><h4>${mod.name}</h4><span class="pill pill--soft">${mod.id}</span></div><p>${mod.description || mod.summary}</p><small>Entry: ${mod.path || mod.entry}</small>`;
    moduleGrid.appendChild(card);
  });
  const assetList = document.getElementById('asset-list');
  assetList.innerHTML = '';
  const sections = Object.entries(manifest.assets || {});
  sections.forEach(([kind, items]) => {
    (items || []).forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${item}</span><small>${kind}</small>`;
      assetList.appendChild(li);
    });
  });
}

function renderMetrics({ config, manifest, soundData }) {
  const metrics = document.getElementById('hero-metrics');
  metrics.innerHTML = '';
  const entries = [
    { label: 'Engines', value: config.engines?.length || 0 },
    { label: 'Modules', value: manifest.modules?.length || 0 },
    { label: 'Assets', value: Object.values(manifest.assets || {}).reduce((acc, arr) => acc + arr.length, 0) },
    { label: 'Soundscapes', value: soundData.playlists?.length || 0 }
  ];
  entries.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'metric';
    card.innerHTML = `<h4>${entry.label}</h4><strong>${entry.value}</strong>`;
    metrics.appendChild(card);
  });
}

function renderInfinity(loop) {
  document.getElementById('loop-status').textContent = `Status: ${loop.status}`;
  const meta = document.getElementById('loop-meta');
  meta.innerHTML = `Version ${loop.version} • Latency budget ${loop.telemetry.latencyBudgetMs}ms • Last ${new Date(loop.telemetry.lastCycle).toLocaleString()} • Next ${new Date(loop.telemetry.nextCycle).toLocaleString()}`;
  const grid = document.getElementById('loop-grid');
  grid.innerHTML = '';
  (loop.loops || []).forEach(step => {
    const card = document.createElement('div');
    card.className = 'loop-card';
    card.innerHTML = `<h4>${step.label}<span class="loop-signal">${step.signal}</span></h4><p>${step.summary}</p>`;
    const list = document.createElement('ul');
    (step.checks || []).forEach(check => {
      const li = document.createElement('li');
      li.textContent = check;
      list.appendChild(li);
    });
    card.appendChild(list);
    grid.appendChild(card);
  });
}

function applyTheme(config) {
  document.documentElement.style.setProperty('--primary', config.site.primaryColor);
  document.documentElement.style.setProperty('--accent', config.site.accentColor);
  document.title = config.site.title;
}

function setupCanvas() {
  const canvas = document.getElementById('vega-grid');
  const ctx = canvas.getContext('2d');
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  window.addEventListener('resize', resize);
  resize();
  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(126,249,255,0.2)';
    ctx.lineWidth = 1;
    const size = 40;
    targetX += (mouseX - targetX) * 0.08;
    targetY += (mouseY - targetY) * 0.08;
    const shiftX = targetX * 12;
    const shiftY = targetY * 12;
    for (let x = -size; x < canvas.width + size; x += size) {
      for (let y = -size; y < canvas.height + size; y += size) {
        ctx.strokeRect(x + Math.sin(Date.now()/800 + y)*2 + shiftX, y + Math.cos(Date.now()/700 + x)*2 + shiftY, size, size);
      }
    }
    ctx.fillStyle = 'rgba(230,69,255,0.08)';
    for (let i = 0; i < 30; i++) {
      const px = ((i * 97) % canvas.width) + Math.sin(Date.now() / 400 + i) * 10 + shiftX;
      const py = ((i * 53) % canvas.height) + Math.cos(Date.now() / 500 + i) * 10 + shiftY;
      ctx.beginPath();
      ctx.arc(px, py, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

function bindAdmin(config, soundData) {
  const modal = document.getElementById('admin-modal');
  const open = document.getElementById('open-admin');
  const close = document.getElementById('close-admin');
  const loginBtn = document.getElementById('admin-login');
  const logoutBtn = document.getElementById('logout');
  const saveBtn = document.getElementById('save-config');
  const primaryInput = document.getElementById('primary-color');
  const accentInput = document.getElementById('accent-color');
  const controls = document.getElementById('admin-controls');
  const passwordInput = document.getElementById('admin-password');

  let token = null;
  const audioEl = document.getElementById('soundscape-player');
  const toggleSound = document.getElementById('toggle-sound');

  open.onclick = () => { modal.classList.add('open'); };
  close.onclick = () => { modal.classList.remove('open'); };

  loginBtn.onclick = async () => {
    const password = passwordInput.value;
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      const data = await res.json();
      token = data.token;
      controls.classList.remove('hidden');
      primaryInput.value = config.site.primaryColor;
      accentInput.value = config.site.accentColor;
    } else {
      alert('Invalid password');
    }
  };

  logoutBtn.onclick = async () => {
    await fetch('/api/logout', { method: 'POST', headers: { 'x-vega-token': token } });
    token = null;
    controls.classList.add('hidden');
  };

  saveBtn.onclick = async () => {
    if (!token) return alert('Login first');
    const updated = {
      ...config,
      site: { ...config.site, primaryColor: primaryInput.value, accentColor: accentInput.value }
    };
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-vega-token': token },
      body: JSON.stringify(updated)
    });
    if (res.ok) {
      const saved = await res.json();
      Object.assign(config, saved);
      applyTheme(config);
      renderAPIs(config);
      renderSoundscapes(config, soundData, audioEl);
    }
  };

  toggleSound.onclick = () => {
    if (!audioEl.src) return;
    if (audioEl.paused) {
      audioEl.play();
      toggleSound.textContent = 'Soundscape ▐▐';
    } else {
      audioEl.pause();
      toggleSound.textContent = 'Soundscape ▶';
    }
  };
}

async function init() {
  try {
    const [configResp, manifestResp, modulesResp, soundDataResp, loopResp] = await Promise.all([
      fetchConfig(),
      fetchManifest(),
      fetchModules(),
      fetchSoundscapesData(),
      fetchInfinity()
    ]);
    const config = configResp.data;
    applyTheme(config);
    const whitepaperResp = await fetchWhitepaper();
    const heartbeatResp = await fetchHeartbeat();
    const heartbeat = heartbeatResp.data;
    const heartbeatLabel = heartbeat.status === 'degraded' ? 'Offline mirror' : 'Alive';
    const heartbeatEl = document.getElementById('heartbeat-status');
    heartbeatEl.textContent = `${heartbeatLabel} • ${new Date(heartbeat.timestamp).toLocaleTimeString()}`;
    heartbeatEl.classList.toggle('status--degraded', heartbeatResp.source === 'fallback');
    renderMetrics({ config, manifest: manifestResp.data, soundData: soundDataResp.data });
    renderSources([
      { label: 'Config', source: configResp.source, description: 'Theme, keys, and defaults', path: configResp.source === 'fallback' ? '/data/config.json' : '/api/config' },
      { label: 'Manifest', source: manifestResp.source, description: 'Deploy-ready asset map', path: manifestResp.source === 'fallback' ? '/data/manifest.json' : '/api/manifest' },
      { label: 'Modules', source: modulesResp.source, description: 'Engines and paths', path: modulesResp.source === 'fallback' ? '/data/modules.json' : '/api/modules' },
      { label: 'Soundscapes', source: soundDataResp.source, description: 'Playlists and previews', path: soundDataResp.source === 'fallback' ? '/data/soundscapes.json' : '/api/soundscapes' },
      { label: 'Whitepaper', source: whitepaperResp.source, description: 'Versioned blueprint', path: whitepaperResp.source === 'fallback' ? '/data/whitepaper.json' : '/api/whitepaper' },
      { label: 'Infinity Loop', source: loopResp.source, description: 'Telemetry and cadence', path: loopResp.source === 'fallback' ? '/data/infinity.json' : '/api/infinity' },
      { label: 'Heartbeat', source: heartbeatResp.source, description: 'Liveness and uptime', path: heartbeatResp.source === 'fallback' ? 'Local mirror' : '/api/heartbeat' }
    ]);
    renderAPIs(config);
    renderEngines(config);
    renderWhitepaper({ ...whitepaperResp.data, lastUpdated: config.whitepaper.lastUpdated });
    const audioEl = document.getElementById('soundscape-player');
    renderSoundscapes(config, soundDataResp.data, audioEl);
    renderManifest({ ...manifestResp.data, modules: modulesResp.data, cached: manifestResp.source === 'fallback' });
    renderInfinity(loopResp.data);
    renderChangelog(config.changelog || []);
    bindAdmin(config, soundDataResp.data);
    setupCanvas();
  } catch (err) {
    console.error(err);
    alert('Failed to load experience. Please retry. If offline, the static mirror is available via /data/*.json.');
  }
}

init();
