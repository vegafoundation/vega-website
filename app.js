let isLoopActive = false;
let statusInterval = null;
let currentPhase = 3;
let phaseInterval = null;
const PHASES = [3, 5, 8];

let visualSoundscapeCanvas = null;
let visualSoundscapeCtx = null;
let visualSoundscapeAnimationId = null;
let visualSoundscapeTime = 0;
let activeVisualEffects = {
  alpha: false,
  omega: false,
  vega: false,
  ambient: false,
  cosmic: false,
  neural: false
};
let visualTransitionProgress = {};
let visualParticles = [];

const SOUNDSCAPE_TRACK_MAPPING = {
  alpha: 'https://soundcloud.com/anlaetan/sets/resonance-core',
  omega: 'https://soundcloud.com/anlaetan/sets/infinity-loop',
  vega: 'https://soundcloud.com/anlaetan/sets/vega-sessions',
  ambient: 'https://soundcloud.com/anlaetan/sets/cosmic-drift',
  cosmic: 'https://soundcloud.com/anlaetan/sets',
  neural: 'https://soundcloud.com/anlaetan/sets/infinity-loop'
};

let musicSoundscapeSync = true;

// ═══════════════════════════════════════════════════════════════════════════════
// PERFECT ORCHESTRATION SYSTEM - Unified Visual, Resonance & Soundscape Control
// ═══════════════════════════════════════════════════════════════════════════════

const ORCHESTRATION_PRESETS = {
  alpha_resonance: {
    name: 'Alpha Resonance',
    description: 'Ice crystal clarity • 63Hz-126Hz • Mental focus',
    visuals: ['alpha'],
    soundscapes: ['alpha'],
    resonance: { alpha: 100, omega: 30, vega: 50 },
    phase: 3,
    color: '#00ffff'
  },
  omega_wave: {
    name: 'Omega Wave',
    description: 'Aurora flow • 285Hz-396Hz • Deep relaxation',
    visuals: ['omega'],
    soundscapes: ['omega'],
    resonance: { alpha: 30, omega: 100, vega: 50 },
    phase: 5,
    color: '#8b5cf6'
  },
  vega_crystal: {
    name: 'Vega Crystal',
    description: 'Cosmic glow • 528Hz-639Hz • Heart opening',
    visuals: ['vega'],
    soundscapes: ['vega'],
    resonance: { alpha: 50, omega: 50, vega: 100 },
    phase: 8,
    color: '#ffd700'
  },
  cosmic_unity: {
    name: 'Cosmic Unity',
    description: 'Starfield nebula • Full spectrum • Universal connection',
    visuals: ['cosmic', 'vega'],
    soundscapes: ['cosmic'],
    resonance: { alpha: 80, omega: 80, vega: 100 },
    phase: 8,
    color: '#ff00ff'
  },
  neural_sync: {
    name: 'Neural Sync',
    description: 'Rainbow prismatic • All frequencies • Complete activation',
    visuals: ['neural', 'alpha', 'omega'],
    soundscapes: ['neural'],
    resonance: { alpha: 100, omega: 100, vega: 100 },
    phase: 8,
    color: '#00ff88'
  },
  ambient_drift: {
    name: 'Ambient Drift',
    description: 'Fog mist • Low frequencies • Deep meditation',
    visuals: ['ambient'],
    soundscapes: ['ambient'],
    resonance: { alpha: 40, omega: 60, vega: 40 },
    phase: 3,
    color: '#2d2d44'
  },
  infinity_loop: {
    name: 'Infinity Loop 3-5-8',
    description: 'Complete cycle • All resonance • Perfect harmony',
    visuals: ['alpha', 'omega', 'vega', 'cosmic'],
    soundscapes: ['cosmic'],
    resonance: { alpha: 100, omega: 100, vega: 100 },
    phase: 8,
    color: '#00ffff'
  }
};

let currentOrchestration = null;
let orchestrationCycleInterval = null;
let orchestrationPhase = 0;
const ORCHESTRATION_CYCLE_ORDER = ['alpha_resonance', 'omega_wave', 'vega_crystal', 'cosmic_unity', 'infinity_loop'];

function activateOrchestration(presetKey, options = {}) {
  const preset = ORCHESTRATION_PRESETS[presetKey];
  if (!preset) return;
  
  currentOrchestration = presetKey;
  console.log(`[ORCHESTRATION] Activating: ${preset.name}`);
  
  // Deactivate all visuals first
  Object.keys(activeVisualEffects).forEach(name => {
    updateVisualEffect(name, false);
  });
  
  // Activate preset visuals with slight delay for smooth transition
  setTimeout(() => {
    preset.visuals.forEach((visual, i) => {
      setTimeout(() => updateVisualEffect(visual, true), i * 200);
    });
  }, 300);
  
  // Activate soundscapes
  if (preset.soundscapes.length > 0 && !options.skipSound) {
    const primarySoundscape = preset.soundscapes[0];
    toggleSoundscape(primarySoundscape);
    syncMusicWithSoundscape(primarySoundscape);
  }
  
  // Update resonance core display
  updateResonanceCores(preset.resonance);
  
  // Update phase
  currentPhase = preset.phase;
  
  // Emit orchestration event
  dispatchOrchestrationEvent(presetKey, preset);
  
  return preset;
}

function updateResonanceCores(resonance) {
  if (resonance.alpha !== undefined) {
    const alphaCore = document.querySelector('[data-core="alpha"] .core-power');
    if (alphaCore) alphaCore.textContent = `${resonance.alpha}%`;
  }
  if (resonance.omega !== undefined) {
    const omegaCore = document.querySelector('[data-core="omega"] .core-power');
    if (omegaCore) omegaCore.textContent = `${resonance.omega}%`;
  }
  if (resonance.vega !== undefined) {
    const vegaCore = document.querySelector('[data-core="vega"] .core-power');
    if (vegaCore) vegaCore.textContent = `${resonance.vega}%`;
  }
}

function dispatchOrchestrationEvent(presetKey, preset) {
  const event = new CustomEvent('orchestrationChange', {
    detail: { preset: presetKey, name: preset.name, phase: preset.phase, color: preset.color }
  });
  window.dispatchEvent(event);
}

function startOrchestrationCycle(intervalMs = 30000) {
  if (orchestrationCycleInterval) {
    clearInterval(orchestrationCycleInterval);
  }
  
  orchestrationPhase = 0;
  activateOrchestration(ORCHESTRATION_CYCLE_ORDER[0]);
  
  orchestrationCycleInterval = setInterval(() => {
    orchestrationPhase = (orchestrationPhase + 1) % ORCHESTRATION_CYCLE_ORDER.length;
    activateOrchestration(ORCHESTRATION_CYCLE_ORDER[orchestrationPhase]);
  }, intervalMs);
  
  console.log('[ORCHESTRATION] Cycle started - rotating every', intervalMs / 1000, 'seconds');
}

function stopOrchestrationCycle() {
  if (orchestrationCycleInterval) {
    clearInterval(orchestrationCycleInterval);
    orchestrationCycleInterval = null;
    console.log('[ORCHESTRATION] Cycle stopped');
  }
}

function perfectOrchestration() {
  // Activate all systems in perfect harmony
  console.log('[ORCHESTRATION] ═══ PERFECT ORCHESTRATION ACTIVATED ═══');
  
  // Start with Infinity Loop preset
  activateOrchestration('infinity_loop');
  
  // Activate all visual effects with staggered timing for smooth blend
  const allVisuals = ['alpha', 'omega', 'vega', 'cosmic'];
  allVisuals.forEach((visual, i) => {
    setTimeout(() => updateVisualEffect(visual, true), i * 500);
  });
  
  // Set all resonance cores to maximum
  updateResonanceCores({ alpha: 100, omega: 100, vega: 100 });
  
  // Start the cosmic soundscape
  if (audioContext) {
    toggleSoundscape('cosmic');
  } else {
    createSoundscape();
  }
  
  // Sync music
  syncMusicWithSoundscape('cosmic');
  
  // Activate SoundCloud player
  activateSoundCloudMusic();
  
  // Start visual animation
  startVisualSoundscapeAnimation();
  
  return {
    status: 'activated',
    message: 'Perfect Orchestration Active - All systems synchronized',
    visuals: allVisuals,
    resonance: { alpha: 100, omega: 100, vega: 100 },
    phase: 8
  };
}

function changeTrack(trackUrl) {
  const player = document.getElementById('soundcloud-player');
  if (player) {
    const encodedUrl = encodeURIComponent(trackUrl);
    player.src = `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
  }
  const scWidget = document.getElementById('sc-widget');
  if (scWidget) {
    const encodedUrl = encodeURIComponent(trackUrl);
    scWidget.src = `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%2300ffff&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
  }
}

function syncMusicWithSoundscape(soundscapeName) {
  if (!musicSoundscapeSync) return;
  
  const trackUrl = SOUNDSCAPE_TRACK_MAPPING[soundscapeName];
  if (trackUrl) {
    changeTrack(trackUrl);
    console.log(`[MUSIC SYNC] Synced to ${soundscapeName} soundscape → ${trackUrl}`);
  }
}

const VISUAL_EFFECTS_CONFIG = {
  alpha: {
    colors: ['#00ffff', '#0088ff', '#00ddff', '#66ffff'],
    type: 'ice_crystals',
    opacity: 0.15
  },
  omega: {
    colors: ['#8b5cf6', '#a855f7', '#c084fc', '#7c3aed'],
    type: 'aurora_waves',
    opacity: 0.2
  },
  vega: {
    colors: ['#ffd700', '#00ff88', '#88ff00', '#ffaa00'],
    type: 'cosmic_glow',
    opacity: 0.18
  },
  ambient: {
    colors: ['#1a1a2e', '#2d2d44', '#0a0a15', '#15152a'],
    type: 'fog_mist',
    opacity: 0.25
  },
  cosmic: {
    colors: ['#00ffff', '#8b5cf6', '#ff00ff', '#00ff88', '#ffd700'],
    type: 'starfield_nebula',
    opacity: 0.2
  },
  neural: {
    colors: ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#0077ff', '#8b00ff'],
    type: 'rainbow_prismatic',
    opacity: 0.22
  }
};

function initVisualSoundscapeLayer() {
  if (visualSoundscapeCanvas) return;
  
  visualSoundscapeCanvas = document.createElement('canvas');
  visualSoundscapeCanvas.id = 'visual-soundscape-canvas';
  visualSoundscapeCanvas.className = 'visual-soundscape-layer';
  document.body.insertBefore(visualSoundscapeCanvas, document.body.firstChild);
  
  visualSoundscapeCtx = visualSoundscapeCanvas.getContext('2d');
  
  resizeVisualCanvas();
  window.addEventListener('resize', resizeVisualCanvas);
  
  initVisualParticles();
  startVisualSoundscapeAnimation();
}

function resizeVisualCanvas() {
  if (!visualSoundscapeCanvas) return;
  visualSoundscapeCanvas.width = window.innerWidth;
  visualSoundscapeCanvas.height = window.innerHeight;
}

function initVisualParticles() {
  visualParticles = [];
  const count = 150;
  for (let i = 0; i < count; i++) {
    visualParticles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.random() * 360,
      phase: Math.random() * Math.PI * 2
    });
  }
}

function startVisualSoundscapeAnimation() {
  if (visualSoundscapeAnimationId) return;
  
  function animate() {
    visualSoundscapeTime += 0.016;
    renderVisualSoundscape();
    visualSoundscapeAnimationId = requestAnimationFrame(animate);
  }
  animate();
}

function updateVisualEffect(name, active) {
  activeVisualEffects[name] = active;
  if (!visualTransitionProgress[name]) {
    visualTransitionProgress[name] = 0;
  }
}

function renderVisualSoundscape() {
  if (!visualSoundscapeCtx || !visualSoundscapeCanvas) return;
  
  const ctx = visualSoundscapeCtx;
  const w = visualSoundscapeCanvas.width;
  const h = visualSoundscapeCanvas.height;
  
  ctx.clearRect(0, 0, w, h);
  
  Object.keys(activeVisualEffects).forEach(name => {
    const target = activeVisualEffects[name] ? 1 : 0;
    const current = visualTransitionProgress[name] || 0;
    visualTransitionProgress[name] = current + (target - current) * 0.02;
  });
  
  Object.keys(VISUAL_EFFECTS_CONFIG).forEach(name => {
    const progress = visualTransitionProgress[name] || 0;
    if (progress > 0.01) {
      const config = VISUAL_EFFECTS_CONFIG[name];
      const effectOpacity = config.opacity * progress;
      
      switch (config.type) {
        case 'ice_crystals':
          renderIceCrystals(ctx, w, h, config.colors, effectOpacity);
          break;
        case 'aurora_waves':
          renderAuroraWaves(ctx, w, h, config.colors, effectOpacity);
          break;
        case 'cosmic_glow':
          renderCosmicGlow(ctx, w, h, config.colors, effectOpacity);
          break;
        case 'fog_mist':
          renderFogMist(ctx, w, h, config.colors, effectOpacity);
          break;
        case 'starfield_nebula':
          renderStarfieldNebula(ctx, w, h, config.colors, effectOpacity);
          break;
        case 'rainbow_prismatic':
          renderRainbowPrismatic(ctx, w, h, config.colors, effectOpacity);
          break;
      }
    }
  });
}

function renderIceCrystals(ctx, w, h, colors, opacity) {
  const time = visualSoundscapeTime;
  const crystalCount = 12;
  
  ctx.save();
  ctx.globalAlpha = opacity;
  
  for (let i = 0; i < crystalCount; i++) {
    const cx = (w / crystalCount) * i + (w / crystalCount / 2);
    const cy = h / 2 + Math.sin(time * 0.3 + i) * h * 0.3;
    const size = 80 + Math.sin(time * 0.5 + i * 0.5) * 30;
    const rotation = time * 0.1 + i * 0.5;
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, colors[i % colors.length] + '80');
    gradient.addColorStop(0.5, colors[(i + 1) % colors.length] + '40');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    
    ctx.beginPath();
    for (let j = 0; j < 6; j++) {
      const angle = (j / 6) * Math.PI * 2;
      const x = Math.cos(angle) * size;
      const y = Math.sin(angle) * size;
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = colors[0] + '60';
    ctx.lineWidth = 1;
    for (let j = 0; j < 6; j++) {
      const angle = (j / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * size * 1.2, Math.sin(angle) * size * 1.2);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  ctx.restore();
}

function renderAuroraWaves(ctx, w, h, colors, opacity) {
  const time = visualSoundscapeTime;
  
  ctx.save();
  ctx.globalAlpha = opacity;
  
  for (let layer = 0; layer < 4; layer++) {
    const yOffset = h * 0.3 + layer * 60;
    
    ctx.beginPath();
    ctx.moveTo(0, h);
    
    for (let x = 0; x <= w; x += 10) {
      const wave1 = Math.sin((x * 0.003) + time * 0.5 + layer) * 80;
      const wave2 = Math.sin((x * 0.007) + time * 0.3 + layer * 2) * 40;
      const wave3 = Math.sin((x * 0.002) + time * 0.8) * 60;
      const y = yOffset + wave1 + wave2 + wave3;
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(w, h);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, yOffset - 100, 0, h);
    gradient.addColorStop(0, colors[layer % colors.length] + '00');
    gradient.addColorStop(0.3, colors[layer % colors.length] + '40');
    gradient.addColorStop(0.6, colors[(layer + 1) % colors.length] + '30');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  ctx.restore();
}

function renderCosmicGlow(ctx, w, h, colors, opacity) {
  const time = visualSoundscapeTime;
  
  ctx.save();
  ctx.globalAlpha = opacity;
  
  const glowCount = 8;
  for (let i = 0; i < glowCount; i++) {
    const cx = w * 0.5 + Math.cos(time * 0.2 + i * 0.8) * w * 0.3;
    const cy = h * 0.5 + Math.sin(time * 0.15 + i * 0.8) * h * 0.3;
    const size = 150 + Math.sin(time * 0.4 + i) * 50;
    const pulse = 0.7 + Math.sin(time * 0.8 + i * 0.5) * 0.3;
    
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size);
    const color = colors[i % colors.length];
    gradient.addColorStop(0, color + Math.floor(pulse * 80).toString(16).padStart(2, '0'));
    gradient.addColorStop(0.4, color + '40');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }
  
  ctx.restore();
}

function renderFogMist(ctx, w, h, colors, opacity) {
  const time = visualSoundscapeTime;
  
  ctx.save();
  ctx.globalAlpha = opacity * 0.8;
  
  for (let layer = 0; layer < 5; layer++) {
    const yBase = h * 0.4 + layer * h * 0.12;
    const xOffset = Math.sin(time * 0.1 + layer) * 100;
    
    ctx.beginPath();
    ctx.moveTo(-100, h);
    
    for (let x = -100; x <= w + 100; x += 50) {
      const noise1 = Math.sin((x + xOffset) * 0.005 + time * 0.2) * 100;
      const noise2 = Math.sin((x + xOffset) * 0.01 + time * 0.1 + layer) * 50;
      const y = yBase + noise1 + noise2;
      
      if (x === -100) ctx.moveTo(x, y);
      else {
        const prevX = x - 50;
        const prevY = yBase + Math.sin((prevX + xOffset) * 0.005 + time * 0.2) * 100 +
                      Math.sin((prevX + xOffset) * 0.01 + time * 0.1 + layer) * 50;
        const cpX = (prevX + x) / 2;
        const cpY = (prevY + y) / 2;
        ctx.quadraticCurveTo(prevX, prevY, cpX, cpY);
      }
    }
    
    ctx.lineTo(w + 100, h);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, yBase - 150, 0, h);
    gradient.addColorStop(0, colors[layer % colors.length] + '00');
    gradient.addColorStop(0.3, colors[layer % colors.length] + '60');
    gradient.addColorStop(1, colors[(layer + 1) % colors.length] + '30');
    
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  ctx.restore();
}

function renderStarfieldNebula(ctx, w, h, colors, opacity) {
  const time = visualSoundscapeTime;
  
  ctx.save();
  ctx.globalAlpha = opacity;
  
  visualParticles.forEach((p, i) => {
    p.x += p.vx + Math.sin(time * 0.5 + p.phase) * 0.2;
    p.y += p.vy + Math.cos(time * 0.3 + p.phase) * 0.2;
    
    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;
    
    const twinkle = 0.5 + Math.sin(time * 3 + p.phase) * 0.5;
    const color = colors[i % colors.length];
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * twinkle, 0, Math.PI * 2);
    ctx.fillStyle = color + Math.floor(p.opacity * twinkle * 255).toString(16).padStart(2, '0');
    ctx.fill();
  });
  
  for (let i = 0; i < 3; i++) {
    const cx = w * (0.2 + i * 0.3) + Math.sin(time * 0.1 + i) * 50;
    const cy = h * (0.3 + i * 0.2) + Math.cos(time * 0.08 + i) * 50;
    const size = 200 + Math.sin(time * 0.2 + i) * 50;
    
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size);
    gradient.addColorStop(0, colors[i % colors.length] + '30');
    gradient.addColorStop(0.5, colors[(i + 1) % colors.length] + '15');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }
  
  ctx.restore();
}

function renderRainbowPrismatic(ctx, w, h, colors, opacity) {
  const time = visualSoundscapeTime;
  
  ctx.save();
  ctx.globalAlpha = opacity;
  
  const cx = w / 2;
  const cy = h / 2;
  const maxRadius = Math.max(w, h) * 0.7;
  
  for (let ring = 0; ring < 6; ring++) {
    const radius = 100 + ring * 80 + Math.sin(time * 0.5 + ring * 0.5) * 30;
    const rotation = time * 0.2 * (ring % 2 === 0 ? 1 : -1);
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    
    for (let segment = 0; segment < colors.length; segment++) {
      const startAngle = (segment / colors.length) * Math.PI * 2;
      const endAngle = ((segment + 1) / colors.length) * Math.PI * 2;
      
      const gradient = ctx.createRadialGradient(0, 0, radius - 40, 0, 0, radius + 40);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, colors[segment] + '50');
      gradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.lineWidth = 60;
      ctx.strokeStyle = gradient;
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  const pulseSize = 150 + Math.sin(time) * 50;
  const pulseGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseSize);
  pulseGradient.addColorStop(0, '#ffffff30');
  pulseGradient.addColorStop(0.5, '#ffffff10');
  pulseGradient.addColorStop(1, 'transparent');
  ctx.fillStyle = pulseGradient;
  ctx.fillRect(0, 0, w, h);
  
  ctx.restore();
}

function makePanelDraggable(panel, handleSelector) {
  if (!panel) return;
  
  const storageKey = `panel_position_${panel.id}`;
  const hiddenKey = `panel_hidden_${panel.id}`;
  const EDGE_THRESHOLD = 60;
  const HIDE_OFFSET = 280;
  
  let isDragging = false;
  let startX, startY, initialX, initialY;
  let isHiddenLeft = false, isHiddenRight = false, isHiddenTop = false, isHiddenBottom = false;
  
  const savedHidden = localStorage.getItem(hiddenKey);
  if (savedHidden) {
    try {
      const hidden = JSON.parse(savedHidden);
      if (hidden.left) { isHiddenLeft = true; hideToEdge('left'); }
      else if (hidden.right) { isHiddenRight = true; hideToEdge('right'); }
      else if (hidden.top) { isHiddenTop = true; hideToEdge('top'); }
      else if (hidden.bottom) { isHiddenBottom = true; hideToEdge('bottom'); }
    } catch(e) {}
  }
  
  const savedPos = localStorage.getItem(storageKey);
  if (savedPos && !isHiddenLeft && !isHiddenRight && !isHiddenTop && !isHiddenBottom) {
    try {
      const { x, y } = JSON.parse(savedPos);
      panel.style.left = `${x}px`;
      panel.style.top = `${y}px`;
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    } catch (e) {}
  }
  
  const handle = handleSelector ? panel.querySelector(handleSelector) : panel.firstElementChild;
  if (!handle) return;
  
  handle.classList.add('draggable-header');
  
  if (!handle.querySelector('.drag-handle')) {
    const dragHandle = document.createElement('span');
    dragHandle.className = 'drag-handle';
    dragHandle.textContent = '⋮⋮';
    handle.insertBefore(dragHandle, handle.firstChild);
  }
  
  function hideToEdge(edge) {
    panel.classList.add('panel-edge-hidden');
    const rect = panel.getBoundingClientRect();
    if (edge === 'left') {
      panel.style.left = `-${rect.width - 40}px`;
      panel.style.top = `${rect.top}px`;
    } else if (edge === 'right') {
      panel.style.left = `${window.innerWidth - 40}px`;
      panel.style.top = `${rect.top}px`;
    } else if (edge === 'top') {
      panel.style.top = `-${rect.height - 40}px`;
    } else if (edge === 'bottom') {
      panel.style.top = `${window.innerHeight - 40}px`;
    }
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    panel.dataset.hiddenEdge = edge;
  }
  
  function restoreFromEdge() {
    panel.classList.remove('panel-edge-hidden');
    isHiddenLeft = isHiddenRight = isHiddenTop = isHiddenBottom = false;
    delete panel.dataset.hiddenEdge;
    localStorage.removeItem(hiddenKey);
  }
  
  function checkEdgeHide(x, y) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    if (x < EDGE_THRESHOLD) return 'left';
    if (x > w - EDGE_THRESHOLD) return 'right';
    if (y < EDGE_THRESHOLD) return 'top';
    if (y > h - EDGE_THRESHOLD) return 'bottom';
    return null;
  }
  
  function showEdgeIndicator(edge) {
    let indicator = document.getElementById('edge-hide-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'edge-hide-indicator';
      indicator.style.cssText = 'position:fixed;background:linear-gradient(90deg,rgba(0,255,255,0.3),rgba(255,215,0,0.3));z-index:9999;pointer-events:none;transition:opacity 0.2s ease;';
      document.body.appendChild(indicator);
    }
    
    indicator.style.opacity = '1';
    if (edge === 'left') {
      indicator.style.left = '0'; indicator.style.top = '0';
      indicator.style.width = '8px'; indicator.style.height = '100vh';
    } else if (edge === 'right') {
      indicator.style.left = 'auto'; indicator.style.right = '0'; indicator.style.top = '0';
      indicator.style.width = '8px'; indicator.style.height = '100vh';
    } else if (edge === 'top') {
      indicator.style.left = '0'; indicator.style.top = '0';
      indicator.style.width = '100vw'; indicator.style.height = '8px';
    } else if (edge === 'bottom') {
      indicator.style.left = '0'; indicator.style.top = 'auto'; indicator.style.bottom = '0';
      indicator.style.width = '100vw'; indicator.style.height = '8px';
    }
  }
  
  function hideEdgeIndicator() {
    const indicator = document.getElementById('edge-hide-indicator');
    if (indicator) indicator.style.opacity = '0';
  }
  
  panel.addEventListener('click', () => {
    if (panel.dataset.hiddenEdge) {
      restoreFromEdge();
      const rect = panel.getBoundingClientRect();
      panel.style.left = `${Math.max(50, window.innerWidth / 2 - rect.width / 2)}px`;
      panel.style.top = `${Math.max(50, window.innerHeight / 2 - rect.height / 2)}px`;
    }
  });
  
  handle.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    
    if (panel.dataset.hiddenEdge) {
      restoreFromEdge();
    }
    
    isDragging = true;
    const rect = panel.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    initialX = rect.left;
    initialY = rect.top;
    
    panel.style.left = `${rect.left}px`;
    panel.style.top = `${rect.top}px`;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    
    handle.style.cursor = 'grabbing';
    panel.style.transition = 'none';
    panel.classList.add('panel-dragging-active');
    document.body.style.userSelect = 'none';
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    let newX = initialX + dx;
    let newY = initialY + dy;
    
    const maxX = window.innerWidth - panel.offsetWidth;
    const maxY = window.innerHeight - panel.offsetHeight;
    newX = Math.max(-panel.offsetWidth + 50, Math.min(newX, maxX + panel.offsetWidth - 50));
    newY = Math.max(-panel.offsetHeight + 50, Math.min(newY, maxY + panel.offsetHeight - 50));
    
    panel.style.left = `${newX}px`;
    panel.style.top = `${newY}px`;
    
    const edge = checkEdgeHide(e.clientX, e.clientY);
    if (edge) {
      showEdgeIndicator(edge);
      panel.classList.add('panel-near-edge');
    } else {
      hideEdgeIndicator();
      panel.classList.remove('panel-near-edge');
    }
  });
  
  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    handle.style.cursor = '';
    panel.style.transition = '';
    panel.classList.remove('panel-dragging-active');
    document.body.style.userSelect = '';
    hideEdgeIndicator();
    panel.classList.remove('panel-near-edge');
    
    const edge = checkEdgeHide(e.clientX, e.clientY);
    if (edge) {
      if (edge === 'left') isHiddenLeft = true;
      else if (edge === 'right') isHiddenRight = true;
      else if (edge === 'top') isHiddenTop = true;
      else if (edge === 'bottom') isHiddenBottom = true;
      
      panel.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
      hideToEdge(edge);
      localStorage.setItem(hiddenKey, JSON.stringify({ [edge]: true }));
    } else {
      localStorage.setItem(storageKey, JSON.stringify({
        x: parseInt(panel.style.left),
        y: parseInt(panel.style.top)
      }));
    }
  });
  
  handle.addEventListener('touchstart', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    
    if (panel.dataset.hiddenEdge) {
      restoreFromEdge();
    }
    
    const touch = e.touches[0];
    isDragging = true;
    const rect = panel.getBoundingClientRect();
    startX = touch.clientX;
    startY = touch.clientY;
    initialX = rect.left;
    initialY = rect.top;
    
    panel.style.left = `${rect.left}px`;
    panel.style.top = `${rect.top}px`;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    panel.style.transition = 'none';
    panel.classList.add('panel-dragging-active');
  }, { passive: true });
  
  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    
    let newX = initialX + dx;
    let newY = initialY + dy;
    
    const maxX = window.innerWidth - panel.offsetWidth;
    const maxY = window.innerHeight - panel.offsetHeight;
    newX = Math.max(-panel.offsetWidth + 50, Math.min(newX, maxX + panel.offsetWidth - 50));
    newY = Math.max(-panel.offsetHeight + 50, Math.min(newY, maxY + panel.offsetHeight - 50));
    
    panel.style.left = `${newX}px`;
    panel.style.top = `${newY}px`;
    
    const edge = checkEdgeHide(touch.clientX, touch.clientY);
    if (edge) {
      showEdgeIndicator(edge);
      panel.classList.add('panel-near-edge');
    } else {
      hideEdgeIndicator();
      panel.classList.remove('panel-near-edge');
    }
  }, { passive: true });
  
  document.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    panel.style.transition = '';
    panel.classList.remove('panel-dragging-active');
    hideEdgeIndicator();
    panel.classList.remove('panel-near-edge');
    
    const touch = e.changedTouches[0];
    const edge = checkEdgeHide(touch.clientX, touch.clientY);
    if (edge) {
      if (edge === 'left') isHiddenLeft = true;
      else if (edge === 'right') isHiddenRight = true;
      else if (edge === 'top') isHiddenTop = true;
      else if (edge === 'bottom') isHiddenBottom = true;
      
      panel.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
      hideToEdge(edge);
      localStorage.setItem(hiddenKey, JSON.stringify({ [edge]: true }));
    } else {
      localStorage.setItem(storageKey, JSON.stringify({
        x: parseInt(panel.style.left),
        y: parseInt(panel.style.top)
      }));
    }
  });
  
  window.addEventListener('resize', () => {
    if (panel.dataset.hiddenEdge) {
      hideToEdge(panel.dataset.hiddenEdge);
    }
  });
}

async function fetchStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();
    
    if (data.alpha_resonance) {
      updateCoreStatus('alpha', data.alpha_resonance);
    }
    if (data.omega_resonance) {
      updateCoreStatus('omega', data.omega_resonance);
    }
    if (data.vega_resonance) {
      updateCoreStatus('vega', data.vega_resonance);
    }
    
    if (data.infinity_loop) {
      updateLoopStatus(data.infinity_loop);
    }
    
    if (data.meta) {
      const iterEl = document.getElementById('iteration-count');
      if (iterEl) {
        iterEl.textContent = data.meta.infinity_loop_iteration || 0;
      }
    }
  } catch (e) {
    console.log('Status fetch error:', e);
  }
}

function updateCoreStatus(name, core) {
  const statusEl = document.querySelector(`#${name}-status .core-value`);
  if (statusEl) {
    statusEl.textContent = (core.status || 'offline').toUpperCase();
    statusEl.style.color = getStatusColor(core.status);
  }
  
  const miniEl = document.getElementById(`${name}-mini`);
  if (miniEl) {
    const powerEl = miniEl.querySelector('.core-power');
    if (powerEl) {
      powerEl.textContent = `${core.power || 0}%`;
    }
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'online': return '#00ff88';
    case 'active': return '#00ffff';
    case 'initializing': return '#ffd700';
    default: return '#ff4444';
  }
}

function updateLoopStatus(loop) {
  const statusEl = document.getElementById('loop-status');
  if (statusEl) {
    statusEl.textContent = loop.active ? 'ACTIVE' : 'STANDBY';
    statusEl.style.color = loop.active ? '#00ff88' : '#ffd700';
  }
  isLoopActive = loop.active;
}

async function fetchAgents() {
  try {
    const res = await fetch('/api/agents');
    const agents = await res.json();
    displayAgents(agents);
  } catch (e) {
    console.log('Agents fetch error:', e);
  }
}

function displayAgents(agents) {
  const container = document.getElementById('agents-container');
  if (!container || !agents) return;
  
  container.innerHTML = '';
  
  const agentList = Array.isArray(agents) ? agents : Object.entries(agents).map(([key, val]) => ({
    name: key,
    ...val
  }));
  
  agentList.forEach(agent => {
    const card = document.createElement('div');
    card.className = 'agent-card';
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'agent-name';
    nameDiv.textContent = formatAgentName(agent.name);
    
    const descDiv = document.createElement('div');
    descDiv.className = 'agent-description';
    descDiv.textContent = agent.description || getAgentDescription(agent.name);
    
    const stateDiv = document.createElement('div');
    stateDiv.className = 'agent-state ' + (agent.state || 'idle').replace(/[^a-zA-Z0-9_-]/g, '');
    stateDiv.textContent = (agent.state || 'idle').toUpperCase();
    
    card.appendChild(nameDiv);
    card.appendChild(descDiv);
    card.appendChild(stateDiv);
    container.appendChild(card);
  });
}

function formatAgentName(name) {
  const names = {
    'ae_agent': 'Æ Agent',
    'biolab': 'BioLab',
    'creative_hub': 'Creative Hub',
    'finance_core': 'Finance Core',
    'health_monitor': 'Health Monitor',
    'playbox': 'Playbox',
    'atlas': 'Atlas'
  };
  return names[name] || name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getAgentDescription(name) {
  const descriptions = {
    'ae_agent': 'Primary autonomous intelligence orchestrator',
    'biolab': 'Bio-monitoring & wellness research systems',
    'creative_hub': 'Generative AI & artistic synthesis engine',
    'finance_core': 'Quantum-inspired financial modeling',
    'health_monitor': 'Real-time health analytics & optimization',
    'playbox': 'Experimental sandbox & prototyping environment',
    'atlas': 'Navigation & spatial intelligence systems'
  };
  return descriptions[name] || 'Autonomous intelligence module';
}

async function fetchModules() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();
    if (data.modules) {
      displayModules(data.modules);
    }
  } catch (e) {
    console.log('Modules fetch error:', e);
  }
}

function displayModules(modules) {
  const container = document.getElementById('modules-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  const moduleList = Array.isArray(modules) ? modules : Object.entries(modules).map(([key, val]) => ({
    name: key,
    ...val
  }));
  
  moduleList.forEach(mod => {
    const card = document.createElement('div');
    card.className = 'module-card';
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'module-name';
    nameDiv.textContent = formatModuleName(mod.name);
    
    const descDiv = document.createElement('div');
    descDiv.className = 'module-description';
    descDiv.textContent = mod.description || getModuleDescription(mod.name);
    
    const statusDiv = document.createElement('div');
    statusDiv.className = 'module-status ' + (mod.status || 'inactive').replace(/[^a-zA-Z0-9_-]/g, '');
    statusDiv.textContent = (mod.status || 'inactive').toUpperCase();
    
    card.appendChild(nameDiv);
    card.appendChild(descDiv);
    card.appendChild(statusDiv);
    container.appendChild(card);
  });
}

function formatModuleName(name) {
  const names = {
    'health': 'VEGA Health',
    'consciousness': 'VEGA Consciousness',
    'relax': 'VEGA Relax',
    'spirits': 'VEGA Spirits',
    'creative_hub': 'VEGA Creative Hub',
    'playbox': 'VEGA Playbox',
    'atlas': 'VEGA Atlas',
    'vision': 'VEGA Vision',
    'finance': 'VEGA Finance',
    'beyond': 'VEGA Beyond',
    'mind': 'VEGA Mind',
    'tongue': 'VEGA Tongue',
    'roots': 'VEGA Roots',
    'desire': 'VEGA Desire',
    'safety': 'VEGA Safety',
    'anlaetan': 'ANLÆTAN'
  };
  return names[name] || 'VEGA ' + name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getModuleDescription(name) {
  const descriptions = {
    'health': 'Bio-monitoring & wellness optimization',
    'consciousness': 'Cognitive enhancement & awareness systems',
    'relax': 'Stress reduction & relaxation protocols',
    'spirits': 'Mood enhancement & emotional balance',
    'creative_hub': 'Generative AI & artistic synthesis',
    'playbox': 'Experimental sandbox environment',
    'atlas': 'Navigation & spatial intelligence',
    'vision': 'Computer vision & perception systems',
    'finance': 'Quantum-inspired financial modeling',
    'beyond': 'Transcendental exploration systems',
    'mind': 'Neural enhancement & cognition',
    'tongue': 'Language processing & communication',
    'roots': 'Heritage & ancestral connections',
    'desire': 'Goal setting & motivation systems',
    'safety': 'Security & protection protocols',
    'anlaetan': 'The ANLÆTAN Collective'
  };
  return descriptions[name] || 'Integrated intelligence module';
}

async function fetchAssets() {
  try {
    const res = await fetch('/api/assets');
    const data = await res.json();
    displayAssets(data.curated || data.dalle_generated || []);
  } catch (e) {
    console.log('Assets fetch error:', e);
  }
}

function displayAssets(assets) {
  const container = document.getElementById('portfolio-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  assets.forEach(asset => {
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    
    const img = document.createElement('img');
    img.src = typeof asset === 'string' ? asset : asset.path;
    img.alt = typeof asset === 'string' ? 'VEGA Asset' : asset.title;
    img.loading = 'lazy';
    img.onerror = function() { this.style.display = 'none'; };
    
    const overlay = document.createElement('div');
    overlay.className = 'portfolio-overlay';
    
    const title = document.createElement('div');
    title.className = 'portfolio-title';
    title.textContent = typeof asset === 'string' 
      ? asset.split('/').pop().replace(/[_-]/g, ' ').replace('.png', '')
      : asset.title;
    
    const category = document.createElement('div');
    category.className = 'portfolio-category';
    category.textContent = typeof asset === 'string' ? 'Visual Design' : asset.category;
    
    overlay.appendChild(title);
    overlay.appendChild(category);
    item.appendChild(img);
    item.appendChild(overlay);
    container.appendChild(item);
  });
}

async function fetchWhitepapers() {
  try {
    const res = await fetch('/api/whitepapers');
    const papers = await res.json();
    displayWhitepapers(papers);
  } catch (e) {
    console.log('Whitepapers fetch error:', e);
  }
}

function displayWhitepapers(papers) {
  const container = document.getElementById('whitepapers-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  papers.forEach(paper => {
    const card = document.createElement('div');
    card.className = 'whitepaper-card';
    
    const title = document.createElement('div');
    title.className = 'whitepaper-title';
    title.textContent = paper.title;
    
    const link = document.createElement('a');
    link.className = 'whitepaper-link';
    link.href = '#';
    link.textContent = 'View Document →';
    
    card.appendChild(title);
    card.appendChild(link);
    container.appendChild(card);
  });
}

let audioContext = null;
let soundscapeNodes = [];
let masterGainNode = null;
let soundscapes = {
  alpha: { nodes: [], gainNode: null, active: false },
  omega: { nodes: [], gainNode: null, active: false },
  vega: { nodes: [], gainNode: null, active: false },
  ambient: { nodes: [], gainNode: null, active: false },
  cosmic: { nodes: [], gainNode: null, active: false },
  neural: { nodes: [], gainNode: null, active: false }
};
let masterVolume = 0.35;

async function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  if (!masterGainNode) {
    masterGainNode = audioContext.createGain();
    masterGainNode.gain.value = masterVolume;
    masterGainNode.connect(audioContext.destination);
    window.vegaSoundscapeGain = masterGainNode;
  }
  return audioContext;
}

function createOscillatorWithLFO(ctx, freq, type, gainValue, outputNode) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = gainValue;
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.1 + Math.random() * 0.2;
  lfoGain.gain.value = freq * 0.02;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  lfo.start();
  osc.connect(gain);
  gain.connect(outputNode);
  osc.start();
  return { osc, gain, lfo, lfoGain };
}

async function createAlphaSoundscape() {
  const ctx = await ensureAudioContext();
  const name = 'alpha';
  if (soundscapes[name].active) return;
  
  const scapeGain = ctx.createGain();
  scapeGain.gain.value = 0;
  scapeGain.connect(masterGainNode);
  soundscapes[name].gainNode = scapeGain;
  
  const frequencies = [
    { freq: 63, type: 'sine', gain: 0.5 },
    { freq: 126, type: 'sine', gain: 0.35 }
  ];
  
  frequencies.forEach(f => {
    const nodes = createOscillatorWithLFO(ctx, f.freq, f.type, f.gain, scapeGain);
    soundscapes[name].nodes.push(nodes);
  });
  
  const vol = parseFloat(document.getElementById('alpha-volume')?.value || 50) / 100;
  scapeGain.gain.setValueAtTime(0, ctx.currentTime);
  scapeGain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 1);
  soundscapes[name].active = true;
}

async function createOmegaSoundscape() {
  const ctx = await ensureAudioContext();
  const name = 'omega';
  if (soundscapes[name].active) return;
  
  const scapeGain = ctx.createGain();
  scapeGain.gain.value = 0;
  scapeGain.connect(masterGainNode);
  soundscapes[name].gainNode = scapeGain;
  
  const frequencies = [
    { freq: 285, type: 'sine', gain: 0.3 },
    { freq: 396, type: 'sine', gain: 0.25 }
  ];
  
  frequencies.forEach(f => {
    const nodes = createOscillatorWithLFO(ctx, f.freq, f.type, f.gain, scapeGain);
    soundscapes[name].nodes.push(nodes);
  });
  
  const vol = parseFloat(document.getElementById('omega-volume')?.value || 50) / 100;
  scapeGain.gain.setValueAtTime(0, ctx.currentTime);
  scapeGain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 1);
  soundscapes[name].active = true;
}

async function createVegaSoundscape() {
  const ctx = await ensureAudioContext();
  const name = 'vega';
  if (soundscapes[name].active) return;
  
  const scapeGain = ctx.createGain();
  scapeGain.gain.value = 0;
  scapeGain.connect(masterGainNode);
  soundscapes[name].gainNode = scapeGain;
  
  const frequencies = [
    { freq: 528, type: 'sine', gain: 0.2 },
    { freq: 639, type: 'sine', gain: 0.15 }
  ];
  
  frequencies.forEach(f => {
    const nodes = createOscillatorWithLFO(ctx, f.freq, f.type, f.gain, scapeGain);
    soundscapes[name].nodes.push(nodes);
  });
  
  const vol = parseFloat(document.getElementById('vega-volume')?.value || 50) / 100;
  scapeGain.gain.setValueAtTime(0, ctx.currentTime);
  scapeGain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 1);
  soundscapes[name].active = true;
}

async function createAmbientSoundscape() {
  const ctx = await ensureAudioContext();
  const name = 'ambient';
  if (soundscapes[name].active) return;
  
  const scapeGain = ctx.createGain();
  scapeGain.gain.value = 0;
  scapeGain.connect(masterGainNode);
  soundscapes[name].gainNode = scapeGain;
  
  const subBass = createOscillatorWithLFO(ctx, 40, 'sine', 0.4, scapeGain);
  soundscapes[name].nodes.push(subBass);
  
  const noise = ctx.createBufferSource();
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = (Math.random() * 2 - 1) * 0.03;
  }
  noise.buffer = noiseBuffer;
  noise.loop = true;
  
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 300;
  
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.4;
  
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(scapeGain);
  noise.start();
  
  soundscapes[name].nodes.push({ noise, noiseFilter, noiseGain });
  
  const vol = parseFloat(document.getElementById('ambient-volume')?.value || 50) / 100;
  scapeGain.gain.setValueAtTime(0, ctx.currentTime);
  scapeGain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 1);
  soundscapes[name].active = true;
}

async function createCosmicSoundscape() {
  const ctx = await ensureAudioContext();
  const name = 'cosmic';
  if (soundscapes[name].active) return;
  
  const scapeGain = ctx.createGain();
  scapeGain.gain.value = 0;
  scapeGain.connect(masterGainNode);
  soundscapes[name].gainNode = scapeGain;
  
  const frequencies = [
    { freq: 63, type: 'sine', gain: 0.25 },
    { freq: 126, type: 'sine', gain: 0.2 },
    { freq: 174, type: 'sine', gain: 0.15 },
    { freq: 285, type: 'sine', gain: 0.12 },
    { freq: 396, type: 'sine', gain: 0.1 },
    { freq: 528, type: 'sine', gain: 0.08 },
    { freq: 639, type: 'sine', gain: 0.06 }
  ];
  
  frequencies.forEach(f => {
    const nodes = createOscillatorWithLFO(ctx, f.freq, f.type, f.gain, scapeGain);
    soundscapes[name].nodes.push(nodes);
  });
  
  const vol = parseFloat(document.getElementById('cosmic-volume')?.value || 50) / 100;
  scapeGain.gain.setValueAtTime(0, ctx.currentTime);
  scapeGain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 1);
  soundscapes[name].active = true;
}

async function createNeuralSoundscape() {
  const ctx = await ensureAudioContext();
  const name = 'neural';
  if (soundscapes[name].active) return;
  
  const scapeGain = ctx.createGain();
  scapeGain.gain.value = 0;
  scapeGain.connect(masterGainNode);
  soundscapes[name].gainNode = scapeGain;
  
  const baseFreq = 200;
  const binauralDiff = 10;
  
  const oscLeft = ctx.createOscillator();
  const oscRight = ctx.createOscillator();
  const gainLeft = ctx.createGain();
  const gainRight = ctx.createGain();
  const merger = ctx.createChannelMerger(2);
  
  oscLeft.frequency.value = baseFreq;
  oscRight.frequency.value = baseFreq + binauralDiff;
  oscLeft.type = 'sine';
  oscRight.type = 'sine';
  gainLeft.gain.value = 0.3;
  gainRight.gain.value = 0.3;
  
  oscLeft.connect(gainLeft);
  oscRight.connect(gainRight);
  gainLeft.connect(merger, 0, 0);
  gainRight.connect(merger, 0, 1);
  merger.connect(scapeGain);
  
  oscLeft.start();
  oscRight.start();
  
  soundscapes[name].nodes.push({ osc: oscLeft, gain: gainLeft });
  soundscapes[name].nodes.push({ osc: oscRight, gain: gainRight });
  soundscapes[name].nodes.push({ merger });
  
  const carrier = ctx.createOscillator();
  const carrierGain = ctx.createGain();
  carrier.frequency.value = 432;
  carrier.type = 'sine';
  carrierGain.gain.value = 0.15;
  carrier.connect(carrierGain);
  carrierGain.connect(scapeGain);
  carrier.start();
  soundscapes[name].nodes.push({ osc: carrier, gain: carrierGain });
  
  const vol = parseFloat(document.getElementById('neural-volume')?.value || 50) / 100;
  scapeGain.gain.setValueAtTime(0, ctx.currentTime);
  scapeGain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 1);
  soundscapes[name].active = true;
}

function stopSingleSoundscape(name) {
  if (!soundscapes[name]) return;
  
  soundscapes[name].nodes.forEach(nodes => {
    Object.values(nodes).forEach(node => {
      if (node && node.stop) {
        try { node.stop(); } catch(e) {}
      }
      if (node && node.disconnect) {
        try { node.disconnect(); } catch(e) {}
      }
    });
  });
  
  if (soundscapes[name].gainNode) {
    try { soundscapes[name].gainNode.disconnect(); } catch(e) {}
  }
  
  soundscapes[name].nodes = [];
  soundscapes[name].gainNode = null;
  soundscapes[name].active = false;
}

async function toggleSoundscape(name) {
  if (soundscapes[name].active) {
    stopSingleSoundscape(name);
    updateVisualEffect(name, false);
  } else {
    switch(name) {
      case 'alpha': await createAlphaSoundscape(); break;
      case 'omega': await createOmegaSoundscape(); break;
      case 'vega': await createVegaSoundscape(); break;
      case 'ambient': await createAmbientSoundscape(); break;
      case 'cosmic': await createCosmicSoundscape(); break;
      case 'neural': await createNeuralSoundscape(); break;
    }
    updateVisualEffect(name, true);
    syncMusicWithSoundscape(name);
  }
  updateSoundscapeUI(name);
}

function updateSoundscapeUI(name) {
  const toggle = document.getElementById(`${name}-toggle`);
  const control = toggle?.closest('.soundscape-control');
  
  if (soundscapes[name].active) {
    toggle?.classList.add('active');
    control?.classList.add('active');
  } else {
    toggle?.classList.remove('active');
    control?.classList.remove('active');
  }
}

function setSoundscapeVolume(name, value) {
  if (soundscapes[name].gainNode && audioContext) {
    soundscapes[name].gainNode.gain.setValueAtTime(value, audioContext.currentTime);
  }
}

function setMasterVolume(value) {
  masterVolume = value;
  if (masterGainNode && audioContext) {
    masterGainNode.gain.setValueAtTime(value, audioContext.currentTime);
  }
}

async function createSoundscape() {
  await createCosmicSoundscape();
  updateSoundscapeUI('cosmic');
  updateVisualEffect('cosmic', true);
  const toggle = document.getElementById('cosmic-toggle');
  toggle?.classList.add('active');
  toggle?.closest('.soundscape-control')?.classList.add('active');
}

function stopSoundscape() {
  Object.keys(soundscapes).forEach(name => {
    stopSingleSoundscape(name);
    updateSoundscapeUI(name);
    updateVisualEffect(name, false);
  });
  
  if (audioContext) {
    audioContext.close();
    audioContext = null;
    masterGainNode = null;
  }
}

function initAudioControlPanel() {
  const panel = document.getElementById('audio-control-panel');
  const toggleBtn = document.getElementById('audio-panel-toggle');
  const panelTab = document.getElementById('audio-panel-tab');
  
  // Tab click to slide panel in/out
  panelTab?.addEventListener('click', () => {
    panel.classList.toggle('panel-visible');
  });
  
  // Make draggable after panel is visible
  const header = panel?.querySelector('.audio-panel-header');
  if (header) {
    header.addEventListener('mousedown', () => {
      if (panel.classList.contains('panel-visible')) {
        panel.classList.add('panel-dragging');
      }
    });
    document.addEventListener('mouseup', () => {
      panel?.classList.remove('panel-dragging');
    });
  }
  
  makePanelDraggable(panel, '.audio-panel-header');
  
  toggleBtn?.addEventListener('click', () => {
    panel.classList.toggle('minimized');
    toggleBtn.textContent = panel.classList.contains('minimized') ? '+' : '−';
  });
  
  const masterSlider = document.getElementById('master-volume');
  const masterValue = document.getElementById('master-volume-value');
  masterSlider?.addEventListener('input', (e) => {
    const val = e.target.value / 100;
    setMasterVolume(val);
    masterValue.textContent = `${e.target.value}%`;
  });
  
  ['alpha', 'omega', 'vega', 'ambient', 'cosmic', 'neural'].forEach(name => {
    const toggle = document.getElementById(`${name}-toggle`);
    const slider = document.getElementById(`${name}-volume`);
    const valueDisplay = document.getElementById(`${name}-volume-value`);
    
    toggle?.addEventListener('click', () => toggleSoundscape(name));
    
    slider?.addEventListener('input', (e) => {
      const val = e.target.value / 100;
      setSoundscapeVolume(name, val);
      if (valueDisplay) valueDisplay.textContent = `${e.target.value}%`;
    });
  });
  
  const scSlider = document.getElementById('soundcloud-volume');
  const scValue = document.getElementById('soundcloud-volume-value');
  scSlider?.addEventListener('input', (e) => {
    scValue.textContent = `${e.target.value}%`;
  });
}

let soundcloudWidget = null;

function activateSoundCloudMusic() {
  let scContainer = document.getElementById('sc-hidden-player');
  if (!scContainer) {
    scContainer = document.createElement('div');
    scContainer.id = 'sc-hidden-player';
    scContainer.className = 'sc-player-panel';
    scContainer.style.cssText = 'position:fixed;bottom:50%;right:-280px;transform:translateY(50%);width:320px;height:300px;z-index:1000;border-radius:15px 0 0 15px;overflow:visible;box-shadow:0 0 30px rgba(0,255,255,0.4),0 0 60px rgba(255,215,0,0.2);border:1px solid rgba(0,255,255,0.4);border-right:none;transition:right 0.4s cubic-bezier(0.4, 0, 0.2, 1);background:rgba(10,10,15,0.95);';
    
    // Create slide-out tab
    const tab = document.createElement('div');
    tab.className = 'panel-tab panel-tab-left';
    tab.id = 'sc-panel-tab';
    tab.innerHTML = '<span class="tab-icon">♫</span><span>MUSIC</span>';
    tab.style.cssText = 'position:absolute;left:-40px;top:50%;transform:translateY(-50%);width:40px;height:100px;background:linear-gradient(135deg,rgba(255,215,0,0.3),rgba(0,255,255,0.2));border:1px solid rgba(255,215,0,0.4);border-right:none;border-radius:12px 0 0 12px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;writing-mode:vertical-rl;text-orientation:mixed;font-family:Orbitron,sans-serif;font-size:10px;font-weight:600;color:#ffd700;letter-spacing:2px;text-shadow:0 0 10px rgba(255,215,0,0.5);transition:all 0.3s ease;backdrop-filter:blur(10px);';
    
    tab.addEventListener('click', () => {
      scContainer.classList.toggle('panel-visible');
      if (scContainer.classList.contains('panel-visible')) {
        scContainer.style.right = '0';
      } else {
        scContainer.style.right = '-280px';
      }
    });
    
    const header = document.createElement('div');
    header.className = 'sc-player-header';
    header.style.cssText = 'padding:10px 15px;background:linear-gradient(135deg,rgba(0,255,255,0.2),rgba(255,215,0,0.1));border-bottom:1px solid rgba(0,255,255,0.3);display:flex;justify-content:space-between;align-items:center;cursor:grab;';
    header.innerHTML = '<span class="drag-handle" style="color:#00ffff;margin-right:8px;font-size:14px;opacity:0.6;">⋮⋮</span><span style="color:#00ffff;font-family:Orbitron,sans-serif;font-size:12px;font-weight:600;flex:1;">ANLÆTAN SOUNDSCAPE</span><button id="sc-minimize" style="background:none;border:none;color:#00ffff;cursor:pointer;font-size:16px;">−</button>';
    
    const iframe = document.createElement('iframe');
    iframe.id = 'sc-widget';
    iframe.width = '100%';
    iframe.height = '250';
    iframe.scrolling = 'no';
    iframe.frameBorder = 'no';
    iframe.allow = 'autoplay';
    iframe.src = 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/anlaetan/sets&color=%2300ffff&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false';
    
    scContainer.appendChild(tab);
    scContainer.appendChild(header);
    scContainer.appendChild(iframe);
    document.body.appendChild(scContainer);
    
    document.getElementById('sc-minimize').addEventListener('click', () => {
      const container = document.getElementById('sc-hidden-player');
      if (container.dataset.minimized === 'true') {
        container.style.height = '300px';
        iframe.style.display = 'block';
        container.dataset.minimized = 'false';
      } else {
        container.style.height = '40px';
        iframe.style.display = 'none';
        container.dataset.minimized = 'true';
      }
    });
    
    makePanelDraggable(scContainer, '.sc-player-header');
    
    console.log('ANLÆTAN SoundCloud playlist activated - ALL SONGS');
  }
}

async function speakGrokWelcome() {
  try {
    const res = await fetch('/api/xai/welcome');
    const data = await res.json();
    
    if (data.success && data.message) {
      const utterance = new SpeechSynthesisUtterance(data.message);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      utterance.volume = 0.8;
      
      const voices = speechSynthesis.getVoices();
      const germanVoice = voices.find(v => v.lang.startsWith('de') && v.name.toLowerCase().includes('male')) ||
                          voices.find(v => v.lang.startsWith('de')) ||
                          voices.find(v => v.lang === 'de-DE');
      if (germanVoice) {
        utterance.voice = germanVoice;
      }
      
      showGrokMessage(data.message, data.source);
      
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 500);
      
      console.log(`[GROK] Welcome message (${data.source}):`, data.message);
    }
  } catch (e) {
    console.log('[GROK] Welcome fetch error:', e);
    const fallback = 'Willkommen im VEGA x ANLÆTAN Kollektiv. Die Infinity Loop erwartet dich.';
    const utterance = new SpeechSynthesisUtterance(fallback);
    utterance.lang = 'de-DE';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  }
}

function showGrokMessage(message, source) {
  let grokPanel = document.getElementById('grok-welcome-panel');
  if (!grokPanel) {
    grokPanel = document.createElement('div');
    grokPanel.id = 'grok-welcome-panel';
    grokPanel.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      width: 350px;
      background: rgba(10, 10, 20, 0.95);
      border: 1px solid rgba(0, 255, 255, 0.4);
      border-radius: 15px;
      padding: 20px;
      z-index: 9998;
      box-shadow: 0 0 40px rgba(0, 255, 255, 0.3), 0 0 80px rgba(139, 92, 246, 0.2);
      animation: grokPanelFadeIn 0.5s ease-out;
      backdrop-filter: blur(20px);
    `;
    
    grokPanel.innerHTML = `
      <div class="grok-panel-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px; cursor: grab;">
        <span class="drag-handle" style="color: #00ffff; font-size: 14px; opacity: 0.6;">⋮⋮</span>
        <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #00ffff, #8b5cf6); display: flex; align-items: center; justify-content: center; font-family: Orbitron, sans-serif; font-weight: bold; color: #000;">G</div>
        <div>
          <div style="font-family: Orbitron, sans-serif; font-size: 14px; color: #00ffff;">GROK</div>
          <div style="font-size: 10px; color: rgba(255,255,255,0.5);">XAI · VEGA VOICE</div>
        </div>
        <button id="grok-close" style="margin-left: auto; background: none; border: none; color: #ff4444; cursor: pointer; font-size: 18px;">×</button>
      </div>
      <div id="grok-message" style="font-family: Rajdhani, sans-serif; font-size: 15px; line-height: 1.6; color: #fff;"></div>
      <div style="margin-top: 15px; display: flex; gap: 10px;">
        <button id="grok-replay" style="flex: 1; padding: 8px; background: linear-gradient(135deg, rgba(0,255,255,0.2), rgba(139,92,246,0.2)); border: 1px solid rgba(0,255,255,0.4); border-radius: 8px; color: #00ffff; cursor: pointer; font-family: Orbitron, sans-serif; font-size: 11px;">🔊 REPLAY</button>
        <button id="grok-stop" style="flex: 1; padding: 8px; background: rgba(255,68,68,0.1); border: 1px solid rgba(255,68,68,0.4); border-radius: 8px; color: #ff4444; cursor: pointer; font-family: Orbitron, sans-serif; font-size: 11px;">⏹ STOP</button>
      </div>
    `;
    
    document.body.appendChild(grokPanel);
    
    document.getElementById('grok-close').addEventListener('click', () => {
      speechSynthesis.cancel();
      grokPanel.style.animation = 'grokPanelFadeOut 0.3s ease-out forwards';
      setTimeout(() => grokPanel.remove(), 300);
    });
    
    document.getElementById('grok-replay').addEventListener('click', () => {
      const msg = document.getElementById('grok-message').dataset.message;
      const utterance = new SpeechSynthesisUtterance(msg);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      speechSynthesis.speak(utterance);
    });
    
    document.getElementById('grok-stop').addEventListener('click', () => {
      speechSynthesis.cancel();
    });
    
    makePanelDraggable(grokPanel, '.grok-panel-header');
    
    if (!document.getElementById('grok-panel-styles')) {
      const style = document.createElement('style');
      style.id = 'grok-panel-styles';
      style.textContent = `
        @keyframes grokPanelFadeIn {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes grokPanelFadeOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(50px); }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  const msgEl = document.getElementById('grok-message');
  msgEl.textContent = message;
  msgEl.dataset.message = message;
}

async function startInfinityLoop() {
  const btn = document.querySelector('.btn-primary');
  if (btn) {
    btn.textContent = 'ORCHESTRATING...';
    btn.disabled = true;
  }
  
  try {
    // Start Perfect Orchestration - unified system activation
    const orchestrationResult = perfectOrchestration();
    
    // Speak welcome
    speakGrokWelcome();
    
    // Start backend loop
    const loopRes = await fetch('/api/infinity-loop/start', { method: 'POST' });
    const loopData = await loopRes.json();
    
    if (loopData.success) {
      console.log('Infinity Loop started with Perfect Orchestration');
      fetchStatus();
      
      // Try to get AI-generated description
      const aiRes = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Generate a brief immersive soundscape description for the VEGA meta-system PERFECT ORCHESTRATION activation. Include resonance frequencies (63Hz Alpha, 285Hz Omega, 528Hz Vega), visual effects (ice crystals, aurora waves, cosmic glow), and the 3-5-8 Infinity Loop phase. Keep it under 100 words. Make it mystical and immersive.'
        })
      });
      
      if (aiRes.ok) {
        const aiData = await aiRes.json();
        showOrchestrationModal(aiData.output || generateOrchestrationMessage());
      } else {
        showOrchestrationModal(generateOrchestrationMessage());
      }
    }
  } catch (e) {
    console.log('Orchestration error:', e);
    // Fallback - still activate orchestration
    perfectOrchestration();
    showOrchestrationModal(generateOrchestrationMessage());
  } finally {
    if (btn) {
      btn.textContent = '∞ ORCHESTRATED';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = 'Activate System'; }, 5000);
    }
  }
}

function generateOrchestrationMessage() {
  return `═══ PERFECT ORCHESTRATION ACTIVE ═══

RESONANCE CORES
◈ Alpha Core: 100% • 63Hz-126Hz
◈ Omega Core: 100% • 285Hz-396Hz
◈ Vega Core: 100% • 528Hz-639Hz

VISUAL EFFECTS
✦ Ice Crystals • Aurora Waves
✦ Cosmic Glow • Starfield Nebula

INFINITY LOOP
∞ Phase 3-5-8 Cycling
∞ All frequencies synchronized
∞ Perfect harmony achieved

🔊 Soundscape resonating...`;
}

function showOrchestrationModal(message) {
  let modal = document.getElementById('orchestration-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'orchestration-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;z-index:9999;animation:orchestrationFadeIn 0.5s ease;';
    modal.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(10,10,20,0.98),rgba(0,30,40,0.95));border:2px solid #00ffff;border-radius:20px;padding:40px;max-width:550px;text-align:center;box-shadow:0 0 80px rgba(0,255,255,0.4),0 0 120px rgba(255,215,0,0.2);position:relative;overflow:hidden;">
        <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#00ffff,#ffd700,#00ff88,#8b5cf6,#00ffff);animation:orchestrationGradient 3s linear infinite;"></div>
        <div style="font-family:Orbitron,sans-serif;font-size:20px;color:#ffd700;margin-bottom:8px;text-shadow:0 0 20px rgba(255,215,0,0.5);">∞ VEGA ∞</div>
        <div style="font-family:Orbitron,sans-serif;font-size:28px;color:#00ffff;margin-bottom:25px;text-shadow:0 0 30px rgba(0,255,255,0.6);">PERFECT ORCHESTRATION</div>
        <div id="orchestration-content" style="font-family:Rajdhani,sans-serif;font-size:15px;color:#fff;line-height:1.9;white-space:pre-wrap;text-align:left;padding:20px;background:rgba(0,0,0,0.3);border-radius:12px;border:1px solid rgba(0,255,255,0.2);"></div>
        <div style="margin-top:30px;display:flex;gap:15px;justify-content:center;flex-wrap:wrap;">
          <button onclick="document.getElementById('orchestration-modal').remove()" style="padding:14px 35px;background:linear-gradient(135deg,#00ffff,#00ff88);border:none;border-radius:25px;color:#000;font-family:Orbitron,sans-serif;font-weight:600;cursor:pointer;box-shadow:0 0 20px rgba(0,255,255,0.4);transition:all 0.3s ease;">CONTINUE</button>
          <button onclick="startOrchestrationCycle(20000);this.textContent='CYCLING...'" style="padding:14px 35px;background:transparent;border:2px solid #ffd700;border-radius:25px;color:#ffd700;font-family:Orbitron,sans-serif;font-weight:600;cursor:pointer;transition:all 0.3s ease;">AUTO CYCLE</button>
          <button onclick="stopSoundscape();stopOrchestrationCycle();this.textContent='STOPPED'" style="padding:14px 35px;background:transparent;border:2px solid #ff4444;border-radius:25px;color:#ff4444;font-family:Orbitron,sans-serif;font-weight:600;cursor:pointer;transition:all 0.3s ease;">STOP ALL</button>
        </div>
      </div>
    `;
    
    if (!document.getElementById('orchestration-modal-styles')) {
      const style = document.createElement('style');
      style.id = 'orchestration-modal-styles';
      style.textContent = `
        @keyframes orchestrationFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes orchestrationGradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(modal);
  }
  document.getElementById('orchestration-content').textContent = message;
  modal.style.display = 'flex';
}

function showActivationModal(message) {
  let modal = document.getElementById('activation-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'activation-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:9999;';
    modal.innerHTML = `
      <div style="background:rgba(10,10,20,0.95);border:1px solid #00ffff;border-radius:15px;padding:40px;max-width:500px;text-align:center;box-shadow:0 0 50px rgba(0,255,255,0.3);">
        <div style="font-family:Orbitron,sans-serif;font-size:24px;color:#00ffff;margin-bottom:20px;">∞ SYSTEM ACTIVATED ∞</div>
        <div id="modal-content" style="font-family:Rajdhani,sans-serif;color:#fff;line-height:1.8;white-space:pre-wrap;"></div>
        <div style="margin-top:25px;display:flex;gap:15px;justify-content:center;">
          <button onclick="document.getElementById('activation-modal').remove()" style="padding:12px 30px;background:linear-gradient(135deg,#00ffff,#00ff88);border:none;border-radius:20px;color:#000;font-family:Orbitron,sans-serif;cursor:pointer;">CONTINUE</button>
          <button onclick="stopSoundscape();this.textContent='STOPPED'" style="padding:12px 30px;background:transparent;border:1px solid #ff4444;border-radius:20px;color:#ff4444;font-family:Orbitron,sans-serif;cursor:pointer;">STOP AUDIO</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  document.getElementById('modal-content').textContent = message;
  modal.style.display = 'flex';
}

async function iterateLoop() {
  try {
    const res = await fetch('/api/infinity-loop/iterate', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      console.log('Loop iteration:', data.iteration, 'Phase:', data.phase);
      fetchStatus();
      fetchAgents();
    }
  } catch (e) {
    console.log('Iterate loop error:', e);
  }
}

function initScrollAnimations() {
  const fadeInSections = document.querySelectorAll('.fade-in-section');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  fadeInSections.forEach(section => {
    sectionObserver.observe(section);
  });
}

function initStickyHeader() {
  const header = document.querySelector('header');
  const heroSection = document.getElementById('home');
  
  if (!header || !heroSection) return;
  
  const headerHeight = header.offsetHeight;
  
  function handleScroll() {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    const threshold = heroHeight - headerHeight - 50;
    
    if (scrollY > threshold) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul li a');
  
  if (!sections.length || !navLinks.length) return;
  
  let currentSection = 'home';
  
  function highlightNav() {
    const scrollY = window.scrollY;
    const headerHeight = document.querySelector('header')?.offsetHeight || 80;
    const offset = headerHeight + 100;
    
    navLinks.forEach(link => link.classList.remove('active'));
    
    if (scrollY < 100) {
      currentSection = 'home';
    } else {
      sections.forEach(section => {
        const sectionTop = section.offsetTop - offset;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
          currentSection = sectionId;
        }
      });
    }
    
    const activeLink = document.querySelector(`nav ul li a[href="#${currentSection}"]`);
    if (activeLink) activeLink.classList.add('active');
  }
  
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();
}

function initSmoothScroll() {
  const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function initParallaxBackground() {
  const infinityBg = document.querySelector('.infinity-bg');
  const gridOverlay = document.querySelector('.grid-overlay');
  
  if (!infinityBg || !gridOverlay) return;
  
  let ticking = false;
  
  function updateParallax() {
    const scrollY = window.scrollY;
    const bgOffset = scrollY * 0.3;
    const gridOffset = scrollY * 0.15;
    
    infinityBg.style.transform = `translateY(${bgOffset}px)`;
    gridOverlay.style.transform = `translateY(${gridOffset}px)`;
    
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

function initFloatingParticles() {
  const container = document.createElement('div');
  container.className = 'particles-container';
  document.body.appendChild(container);
  
  const PHI = 1.618033988749895;
  const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21];
  const colors = ['', 'gold', 'green'];
  
  const particleCount = 12;
  const infinityCount = 10;
  const spiralCount = 8;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const goldenPos = (i * PHI * 100) % 100;
    particle.style.left = `${goldenPos}%`;
    const fibDuration = FIBONACCI[i % FIBONACCI.length];
    particle.style.animationDelay = `${(i * PHI) % 15}s`;
    particle.style.animationDuration = `${fibDuration * 3 + 8}s`;
    particle.dataset.baseLeft = goldenPos;
    container.appendChild(particle);
  }
  
  for (let i = 0; i < infinityCount; i++) {
    const infinity = document.createElement('div');
    const colorClass = colors[i % colors.length];
    infinity.className = `particle-infinity ${colorClass}`.trim();
    infinity.textContent = '∞';
    const goldenPos = ((i * PHI * 100) + 50) % 100;
    infinity.style.left = `${goldenPos}%`;
    const fibDuration = FIBONACCI[(i + 2) % FIBONACCI.length];
    infinity.style.animationDelay = `${(i * PHI * 1.5) % 20}s`;
    infinity.style.animationDuration = `${fibDuration * 2 + 5}s`;
    const sizes = [14, 18, 22, 26, 30];
    infinity.style.fontSize = `${sizes[i % sizes.length]}px`;
    infinity.dataset.baseLeft = goldenPos;
    container.appendChild(infinity);
  }
  
  for (let i = 0; i < spiralCount; i++) {
    const spiral = document.createElement('div');
    const colorClass = colors[(i + 1) % colors.length];
    spiral.className = `particle-spiral ${colorClass}`.trim();
    const strokeColor = colorClass === 'gold' ? '#ffd700' : colorClass === 'green' ? '#00ff88' : '#00ffff';
    spiral.innerHTML = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,50 Q55,45 60,50 Q65,60 55,65 Q40,70 35,55 Q30,35 50,30 Q75,25 80,50 Q85,80 50,85 Q15,90 10,50 Q5,10 50,5"
        fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
    const goldenPos = ((i * PHI * 100) + 25) % 100;
    spiral.style.left = `${goldenPos}%`;
    const fibDuration = FIBONACCI[(i + 4) % FIBONACCI.length];
    spiral.style.animationDelay = `${(i * PHI * 2) % 25}s`;
    const spinDuration = FIBONACCI[(i + 1) % FIBONACCI.length] * 2 + 8;
    const floatDuration = fibDuration * 3 + 13;
    spiral.style.animation = `spiralSpin ${spinDuration}s linear infinite, floatParticle ${floatDuration}s ease-in-out infinite`;
    spiral.style.animationDelay = `${(i * PHI * 2) % 25}s, ${(i * PHI * 2) % 25}s`;
    const sizes = [16, 20, 24, 28, 32];
    spiral.style.width = `${sizes[i % sizes.length]}px`;
    spiral.style.height = `${sizes[i % sizes.length]}px`;
    spiral.dataset.baseLeft = goldenPos;
    container.appendChild(spiral);
  }
  
  initParticleMouseInteraction(container);
}

function initParticleMouseInteraction(container) {
  let mouseX = -1000;
  let mouseY = -1000;
  let lastRippleTime = 0;
  const RIPPLE_COOLDOWN = 200;
  const PUSH_RADIUS = 150;
  const PUSH_STRENGTH = 80;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    const now = Date.now();
    if (now - lastRippleTime > RIPPLE_COOLDOWN) {
      createMouseRipple(e.clientX, e.clientY);
      lastRippleTime = now;
    }
    
    const particles = container.querySelectorAll('.particle, .particle-infinity, .particle-spiral');
    particles.forEach(particle => {
      const rect = particle.getBoundingClientRect();
      const particleX = rect.left + rect.width / 2;
      const particleY = rect.top + rect.height / 2;
      
      const dx = particleX - mouseX;
      const dy = particleY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < PUSH_RADIUS) {
        const force = (1 - distance / PUSH_RADIUS) * PUSH_STRENGTH;
        const angle = Math.atan2(dy, dx);
        const pushX = Math.cos(angle) * force;
        const pushY = Math.sin(angle) * force;
        
        particle.style.transform = `translate(${pushX}px, ${pushY}px)`;
        particle.style.opacity = '0.9';
      } else {
        particle.style.transform = '';
        particle.style.opacity = '';
      }
    });
  });
  
  document.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
    const particles = container.querySelectorAll('.particle, .particle-infinity, .particle-spiral');
    particles.forEach(particle => {
      particle.style.transform = '';
      particle.style.opacity = '';
    });
  });
}

function createMouseRipple(x, y) {
  const ripple = document.createElement('div');
  ripple.className = 'mouse-ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  document.body.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 800);
}

function init3DTiltEffects() {
  const tiltCards = document.querySelectorAll('.service-card, .agent-card, .module-card, .portfolio-item');
  
  const maxTilt = 12;
  
  tiltCards.forEach(card => {
    let glowEl = card.querySelector('.tilt-glow');
    if (!glowEl && card.classList.contains('service-card')) {
      glowEl = document.createElement('div');
      glowEl.className = 'tilt-glow';
      card.appendChild(glowEl);
    }
    
    card.addEventListener('mouseenter', () => {
      card.classList.add('tilt-active');
    });
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / (rect.height / 2)) * -maxTilt;
      const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      if (glowEl) {
        const glowX = ((e.clientX - rect.left) / rect.width) * 100;
        const glowY = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--glow-x', `${glowX}%`);
        card.style.setProperty('--glow-y', `${glowY}%`);
      }
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilt-active');
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

function initDynamicCardObserver() {
  const agentsContainer = document.getElementById('agents-container');
  const modulesContainer = document.getElementById('modules-container');
  const portfolioContainer = document.getElementById('portfolio-container');
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        init3DTiltEffects();
      }
    });
  });
  
  const config = { childList: true, subtree: true };
  
  if (agentsContainer) observer.observe(agentsContainer, config);
  if (modulesContainer) observer.observe(modulesContainer, config);
  if (portfolioContainer) observer.observe(portfolioContainer, config);
}

function initPhaseIndicator() {
  const phaseDots = document.querySelectorAll('.phase-dot');
  const infinitySymbol = document.querySelector('.infinity-symbol');
  let phaseIndex = 0;
  
  function updatePhase() {
    phaseIndex = (phaseIndex + 1) % PHASES.length;
    currentPhase = PHASES[phaseIndex];
    
    phaseDots.forEach((dot, idx) => {
      if (idx === phaseIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    if (infinitySymbol) {
      const colors = {
        3: 'linear-gradient(135deg, #00ff88, #00ffff)',
        5: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        8: 'linear-gradient(135deg, #8b5cf6, #00ffff, #00ff88)'
      };
      infinitySymbol.style.background = colors[currentPhase];
      infinitySymbol.style.webkitBackgroundClip = 'text';
      infinitySymbol.style.backgroundClip = 'text';
    }
    
    const loopStatusEl = document.getElementById('loop-status');
    if (loopStatusEl && isLoopActive) {
      loopStatusEl.textContent = `PHASE ${currentPhase}`;
    }
  }
  
  phaseInterval = setInterval(updatePhase, 3000);
}

function init8DEffects() {
  const body = document.body;
  
  const depthLayer1 = document.createElement('div');
  depthLayer1.className = 'depth-layer-1';
  body.insertBefore(depthLayer1, body.firstChild);
  
  const depthLayer2 = document.createElement('div');
  depthLayer2.className = 'depth-layer-2';
  body.insertBefore(depthLayer2, body.firstChild);
  
  const depthLayer3 = document.createElement('div');
  depthLayer3.className = 'depth-layer-3';
  body.insertBefore(depthLayer3, body.firstChild);
  
  const infinityPulse = document.createElement('div');
  infinityPulse.className = 'infinity-pulse';
  body.insertBefore(infinityPulse, body.firstChild);
  
  const hologram = document.createElement('div');
  hologram.className = 'hologram-overlay';
  body.appendChild(hologram);
  
  const scanlines = document.createElement('div');
  scanlines.className = 'scanline-effect';
  body.appendChild(scanlines);
  
  const mouseGlow = document.createElement('div');
  mouseGlow.className = 'mouse-glow';
  mouseGlow.style.opacity = '0';
  body.appendChild(mouseGlow);
  
  const streamPositions = [10, 25, 40, 60, 75, 90];
  const streamColors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--indigo)', 'var(--primary)', 'var(--secondary)'];
  streamPositions.forEach((pos, i) => {
    const stream = document.createElement('div');
    stream.className = 'data-stream';
    stream.style.left = `${pos}%`;
    stream.style.setProperty('--primary', streamColors[i]);
    stream.style.animationDelay = `${i * 0.7}s`;
    body.insertBefore(stream, body.firstChild);
  });
  
  const hero = document.querySelector('.hero');
  if (hero) {
    const rings = [150, 250, 350, 450];
    rings.forEach((size, i) => {
      const ring = document.createElement('div');
      ring.className = 'portal-ring';
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.top = '50%';
      ring.style.left = '50%';
      ring.style.marginTop = `-${size/2}px`;
      ring.style.marginLeft = `-${size/2}px`;
      ring.style.animationDuration = `${15 + i * 5}s`;
      ring.style.animationDirection = i % 2 === 0 ? 'normal' : 'reverse';
      ring.style.borderColor = i % 2 === 0 ? 'rgba(0, 255, 255, 0.15)' : 'rgba(139, 92, 246, 0.15)';
      hero.appendChild(ring);
    });
  }
  
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseGlow.style.opacity = '1';
  });
  
  document.addEventListener('mouseleave', () => {
    mouseGlow.style.opacity = '0';
  });
  
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    mouseGlow.style.left = `${glowX}px`;
    mouseGlow.style.top = `${glowY}px`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
  
  let depthTicking = false;
  document.addEventListener('mousemove', (e) => {
    if (!depthTicking) {
      requestAnimationFrame(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = (e.clientX - centerX) / centerX;
        const deltaY = (e.clientY - centerY) / centerY;
        
        depthLayer1.style.transform = `translate(${deltaX * 20}px, ${deltaY * 15}px)`;
        depthLayer2.style.transform = `translate(${deltaX * -15}px, ${deltaY * -10}px)`;
        depthLayer3.style.transform = `translate(${deltaX * 10}px, ${deltaY * 8}px)`;
        
        depthTicking = false;
      });
      depthTicking = true;
    }
  });
  
  const cards = document.querySelectorAll('.service-card, .agent-card, .module-card');
  cards.forEach(card => {
    card.classList.add('depth-card', 'chrome-shine');
  });
  
  const glassPanels = document.querySelectorAll('.hero-glass-panel, .glass-card');
  glassPanels.forEach(panel => {
    panel.classList.add('chrome-shine');
  });
}

async function loadVisionEngines() {
  try {
    const res = await fetch('/api/vision/all');
    const data = await res.json();
    
    if (data.Versioning) {
      const versionEl = document.getElementById('engines-version');
      if (versionEl) {
        versionEl.textContent = `Version: ${data.Versioning.current_version}`;
      }
    }
    
    if (data.VEGA_Engines) {
      const engines = data.VEGA_Engines;
      
      if (engines.VisionEngine) {
        const descEl = document.getElementById('vision-engine-desc');
        const modulesEl = document.getElementById('vision-engine-modules');
        const outputEl = document.getElementById('vision-engine-output');
        const statusEl = document.getElementById('vision-engine-status');
        
        if (descEl) descEl.textContent = engines.VisionEngine.description;
        if (statusEl) {
          statusEl.classList.add(engines.VisionEngine.status === 'active' ? 'active' : 'inactive');
        }
        if (modulesEl && engines.VisionEngine.modules) {
          modulesEl.innerHTML = engines.VisionEngine.modules.map(m => 
            `<span class="engine-module-tag">${m}</span>`
          ).join('');
        }
        if (outputEl && engines.VisionEngine.output_format) {
          outputEl.innerHTML = `<strong>Output:</strong> ${engines.VisionEngine.output_format}`;
        }
      }
      
      if (engines.ContextEngine) {
        const descEl = document.getElementById('context-engine-desc');
        const featuresEl = document.getElementById('context-engine-features');
        const statusEl = document.getElementById('context-engine-status');
        
        if (descEl) descEl.textContent = engines.ContextEngine.description;
        if (statusEl) {
          statusEl.classList.add(engines.ContextEngine.status === 'active' ? 'active' : 'inactive');
        }
        if (featuresEl && engines.ContextEngine.key_features) {
          featuresEl.innerHTML = engines.ContextEngine.key_features.map(f => 
            `<span class="engine-feature-tag">${f}</span>`
          ).join('');
        }
      }
      
      if (engines.StorytellingEngine) {
        const descEl = document.getElementById('storytelling-engine-desc');
        const featuresEl = document.getElementById('storytelling-engine-features');
        const statusEl = document.getElementById('storytelling-engine-status');
        
        if (descEl) descEl.textContent = engines.StorytellingEngine.description;
        if (statusEl) {
          statusEl.classList.add(engines.StorytellingEngine.status === 'active' ? 'active' : 'inactive');
        }
        if (featuresEl && engines.StorytellingEngine.key_features) {
          featuresEl.innerHTML = engines.StorytellingEngine.key_features.map(f => 
            `<span class="engine-feature-tag">${f}</span>`
          ).join('');
        }
      }
    }
    
    if (data.Resonanzraeume) {
      const raeume = data.Resonanzraeume;
      const alphaDesc = document.getElementById('alpha-core-desc');
      const omegaDesc = document.getElementById('omega-core-desc');
      const mirrorDesc = document.getElementById('mirror-core-desc');
      const aeDesc = document.getElementById('ae-center-desc');
      
      if (alphaDesc) alphaDesc.textContent = raeume.AlphaCore || 'Primary Resonance';
      if (omegaDesc) omegaDesc.textContent = raeume.OmegaCore || 'Secondary Resonance';
      if (mirrorDesc) mirrorDesc.textContent = raeume.MirrorCore || 'Mirror Resonance';
      if (aeDesc) aeDesc.textContent = raeume.AE_Center || 'Central Hub';
    }
    
    if (data.NEOM_Vision) {
      const neom = data.NEOM_Vision;
      const sustainableEl = document.getElementById('neom-sustainable');
      const resonanceEl = document.getElementById('neom-resonance');
      const aiEl = document.getElementById('neom-ai');
      
      if (sustainableEl && neom.sustainable_projects) sustainableEl.classList.add('active');
      if (resonanceEl && neom.resonance_city) resonanceEl.classList.add('active');
      if (aiEl && neom.AI_integration) aiEl.classList.add('active');
    }
    
    if (data.InfinityLoop && data.InfinityLoop.processes) {
      const processList = document.getElementById('loop-processes-list');
      if (processList) {
        processList.innerHTML = data.InfinityLoop.processes.map((p, i) => `
          <div class="loop-process-item">
            <span class="process-number">${i + 1}</span>
            <span>${p}</span>
          </div>
          ${i < data.InfinityLoop.processes.length - 1 ? '<span class="loop-process-arrow">→</span>' : ''}
        `).join('');
      }
    }
    
    console.log('[VISION ENGINES] Loaded successfully');
  } catch (e) {
    console.log('Vision Engines fetch error:', e);
  }
}

function init() {
  fetchStatus();
  fetchAgents();
  fetchModules();
  fetchAssets();
  fetchWhitepapers();
  loadVisionEngines();
  
  initScrollAnimations();
  initPhaseIndicator();
  initStickyHeader();
  initActiveNavHighlight();
  initSmoothScroll();
  initParallaxBackground();
  initVisualSoundscapeLayer();
  initFloatingParticles();
  init3DTiltEffects();
  initDynamicCardObserver();
  initAudioControlPanel();
  init8DEffects();
  
  statusInterval = setInterval(fetchStatus, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  init();
  
  setTimeout(() => {
    activateSoundCloudMusic();
  }, 1500);
});
