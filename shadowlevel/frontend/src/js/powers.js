const gesturesConfig = [
  { id: 'inventario', label: 'Inventário', circleEmoji: '📦', physicalEmoji: '🤙', physicalLabel: 'Tá tranquilo, tá favorável' },
  { id: 'sombras',    label: 'Arise',    circleEmoji: '🌑', physicalEmoji: '✊', physicalLabel: 'Punho fechado' },
  { id: 'habilidades',label: 'Habilidades',circleEmoji: '⚡', physicalEmoji: '☝️', physicalLabel: 'Apontando para cima' },
  { id: 'dominio',    label: 'Aura',    circleEmoji: '🌀', physicalEmoji: '✋', physicalLabel: 'Mão aberta' },
  { id: 'mana',       label: 'Mana', circleEmoji: '🔥', physicalEmoji: '✌️', physicalLabel: '2 com os dedos' },
];
const circle = document.getElementById('circle');
let existingButtons = circle.querySelectorAll('.gesture');

if (existingButtons.length !== gesturesConfig.length) {
  circle.innerHTML = '';
  gesturesConfig.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'gesture';
    btn.dataset.window = g.id;
    btn.innerHTML = `${g.circleEmoji}<span>${g.label}</span>`;
    circle.appendChild(btn);
  });
  existingButtons = circle.querySelectorAll('.gesture');
}

(function buildGestosPanel() {
  const panel = document.createElement('aside');
  panel.className = 'gestos-panel';
  panel.innerHTML = `
    <h2>Gestos disponíveis</h2>
    <ul>
      ${gesturesConfig.map(g => `
        <li>
          <span class="emo">${g.physicalEmoji}</span>
          <span>${g.label}</span>
          <span style="margin-left:auto; color:#9ad0ff; font-size:11px;">${g.physicalLabel}</span>
        </li>`).join('')}
    </ul>
  `;
  document.body.appendChild(panel);
})();
const gestures = Array.from(circle.querySelectorAll('.gesture'));
let angle = 0;            
const radius = Math.min(circle.offsetWidth, circle.offsetHeight) * 0.42; 

function positionGestures() {
  const cx = circle.offsetWidth / 2;
  const cy = circle.offsetHeight / 2;
  gestures.forEach((btn, i) => {
    const frac = i / gestures.length;
    const a = angle + frac * Math.PI * 2;         
    const x = cx + radius * Math.cos(a) - btn.offsetWidth / 2;
    const y = cy + radius * Math.sin(a) - btn.offsetHeight / 2;

    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;

    const deg = (a * 180) / Math.PI;
    btn.style.transform = `rotate(${-deg}deg)`;
  });
}

function animateRing() {
  angle += 0.006; 
  positionGestures();
  requestAnimationFrame(animateRing);
}
positionGestures();
animateRing();

const windows = document.querySelectorAll('.window');
let autoCloseTimer = null;

function cleanupSpecialAnimations() {
    console.log("Limpando animações especiais...");
    document.body.classList.remove('domain-expanded', 'shadows-active');
    const shadowFigure = document.querySelector('.shadow-figure-container');
    if (shadowFigure) {
        shadowFigure.classList.remove('active');
    }
}

gestures.forEach(btn => {
  btn.addEventListener('click', () => {
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
    }
    cleanupSpecialAnimations();

    const target = document.getElementById(btn.dataset.window);
    windows.forEach(w => w.classList.remove('active'));
    
    if (target) {
        target.classList.add('active');
        autoCloseTimer = setTimeout(() => {
            target.classList.remove('active');
            cleanupSpecialAnimations();
        }, 3000);
    }
  });
});

document.querySelectorAll('.window .close').forEach(closeBtn => {
  closeBtn.addEventListener('click', () => {
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
    }
    closeBtn.closest('.window').classList.remove('active');
    cleanupSpecialAnimations();
  });
});

(function magicParticles() {
  const canvas = document.getElementById('magicBg');
  const ctx = canvas.getContext('2d');

  const runes = document.createElement('canvas'); 
  runes.id = 'runesLayer';
  document.body.appendChild(runes);
  const rctx = runes.getContext('2d');

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    runes.width = w; runes.height = h;
  }
  resize(); window.addEventListener('resize', resize);

  const mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  
  const particles = Array.from({length: 150}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 1.2, 
    vy: (Math.random() - 0.5) * 1.2,
    color: Math.random() < 0.33 ? 'rgba(134,232,255,0.8)' :
           Math.random() < 0.66 ? 'rgba(169,140,255,0.8)' :
                                  'rgba(94,234,255,0.8)',
    trail: []
  }));

  const glyphs = 'ᚠᚢᚦᚨᚱᚲᚷᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜ';
  let t = 0;

  function drawParticles() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const pulse = Math.sin(t * 0.05 + p.x * 0.01) * 0.6;
      const radius = p.r + pulse;

      p.trail.push({x: p.x, y: p.y});
      if (p.trail.length > 8) p.trail.shift();

      ctx.beginPath();
      ctx.strokeStyle = p.color.replace('0.8','0.2');
      ctx.lineWidth = 1;
      for (let i = 0; i < p.trail.length-1; i++) {
        ctx.moveTo(p.trail[i].x, p.trail[i].y);
        ctx.lineTo(p.trail[i+1].x, p.trail[i+1].y);
      }
      ctx.stroke();

      ctx.beginPath();
      const grd = ctx.createRadialGradient(p.x, p.y, 0.5, p.x, p.y, radius*6);
      grd.addColorStop(0, p.color);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawRunes() {
    rctx.clearRect(0,0,runes.width,runes.height);
    rctx.save();
    rctx.translate(runes.width/2, runes.height/2.2);
    rctx.shadowColor = 'rgba(134,232,255,0.22)';
    rctx.shadowBlur = 12;

    const rings = 4;
    for (let r = 0; r < rings; r++) {
      const radius = 120 + r * 56;
      const count = Math.floor(radius / 18);
      for (let i = 0; i < count; i++) {
        const a = t * (0.004 + r*0.001) + (i / count) * Math.PI * 2;
        const x = Math.cos(a) * radius;
        const y = Math.sin(a) * radius;
        rctx.fillStyle = r % 2 ? 'rgba(169,140,255,0.28)' : 'rgba(134,232,255,0.28)';
        rctx.font = '12px Orbitron';
        rctx.fillText(glyphs[i % glyphs.length], x, y);
      }
    }
    rctx.restore();
  }

  function tick() {
    t += 1;
    drawParticles();
    drawRunes();
    requestAnimationFrame(tick);
  }
  tick();
})();
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
    }
    document.querySelectorAll('.window.active').forEach(w => w.classList.remove('active'));
    cleanupSpecialAnimations();
  }
});