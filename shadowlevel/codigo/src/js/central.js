const uptimeEl = document.getElementById('uptime');
const latencyEl = document.getElementById('latency');
const modulesEl = document.getElementById('modules');

let startTime = Date.now();
function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${sec}`;
}
setInterval(() => {
  uptimeEl.textContent = formatUptime(Date.now() - startTime);
  latencyEl.textContent = `${Math.floor(2 + Math.random() * 6)} ms`;
  modulesEl.textContent = `${3 + Math.floor(Math.random() * 2)}`;
}, 1000);

document.querySelectorAll('.hub-card').forEach(card => {
  card.addEventListener('click', () => {
    const href = card.getAttribute('data-href');
    if (href) window.location.href = href;
  });
});

document.querySelectorAll('[data-tilt]').forEach(el => {
  let rect;
  function updateRect() { rect = el.getBoundingClientRect(); }
  updateRect();
  window.addEventListener('resize', updateRect);

  el.addEventListener('mousemove', (e) => {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -6;
    const ry = ((x / rect.width) - 0.5) * 6;
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

(function grid3D() {
  const canvas = document.getElementById('grid3d');
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.strokeStyle = 'rgba(134, 232, 255, 0.18)';
    ctx.lineWidth = 1;

    const cols = 30;
    const rows = 18;
    const w = canvas.width;
    const h = canvas.height;
    const mx = w / 2;
    const my = h * 0.75;

    for (let i = 0; i <= cols; i++) {
      ctx.beginPath();
      for (let j = 0; j <= rows; j++) {
        const u = (i - cols / 2) * 28;
        const v = j * 28;
        const z = Math.sin((i * 0.3) + (j * 0.25) + t) * 12;
        const x = mx + (u / (1 + v * 0.003));
        const y = my - (v / (1 + v * 0.003)) + z;
        if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    for (let j = 0; j <= rows; j++) {
      ctx.beginPath();
      for (let i = 0; i <= cols; i++) {
        const u = (i - cols / 2) * 28;
        const v = j * 28;
        const z = Math.sin((i * 0.3) + (j * 0.25) + t) * 12;
        const x = mx + (u / (1 + v * 0.003));
        const y = my - (v / (1 + v * 0.003)) + z;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();

    t += 0.02;
    requestAnimationFrame(draw);
  }
  draw();
})();

(function orbits() {
  const canvas = document.getElementById('orbits');
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);

  const glyphs = 'ᚠᚢᚦᚨᚱᚲᚷᚺᚾᛁᛃᛇᛈᛉᛊTᛒᛖᛗᛚᛜ';
  const circles = Array.from({ length: 4 }, (_, i) => ({
    r: 120 + i * 60,
    speed: 0.002 + i * 0.0008,
    angle: Math.random() * Math.PI * 2,
    color: i % 2 ? 'rgba(169,140,255,0.25)' : 'rgba(134,232,255,0.25)'
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2.5;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.shadowColor = 'rgba(134,232,255,0.2)';
    ctx.shadowBlur = 12;

    circles.forEach(c => {
      ctx.beginPath();
      ctx.arc(0, 0, c.r, 0, Math.PI * 2);
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 1;
      ctx.stroke();
      const count = Math.floor(c.r / 20);
      for (let i = 0; i < count; i++) {
        const a = c.angle + (i / count) * Math.PI * 2;
        const x = Math.cos(a) * c.r;
        const y = Math.sin(a) * c.r;
        ctx.fillStyle = c.color;
        ctx.font = '12px Orbitron';
        ctx.fillText(glyphs[i % glyphs.length], x, y);
      }

      c.angle += c.speed;
    });

    ctx.restore();
    requestAnimationFrame(draw);
  }
  draw();
})();

(function previewDuelo() {
  const c = document.getElementById('previewDuelo');
  if (!c) return;
  const ctx = c.getContext('2d');

  function resize() {
    if (!c.parentElement) return;
    c.width = c.parentElement.clientWidth;
    c.height = c.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let swordX, swordY, swordRotation;
  let shieldX, shieldY;
  let impactAlpha, impactRadius;
  let state;
  let frameCount;

  function initAnimation() {
    swordX = -40;
    swordY = c.height / 2;
    swordRotation = Math.PI / 2; 
    
    shieldX = c.width / 2;
    shieldY = c.height / 2;

    impactAlpha = 0;
    impactRadius = 0;
    state = 'attack';
    frameCount = 0;
  }
  initAnimation();
  function drawShield(x, y) {
    ctx.save();
    ctx.translate(x, y);
    
    ctx.strokeStyle = 'rgba(134, 232, 255, 0.9)';
    ctx.fillStyle = 'rgba(134, 232, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(134, 232, 255, 0.6)';
    ctx.shadowBlur = 10;

    const s = 25; 
    ctx.beginPath();
    ctx.moveTo(-s, -s * 0.6);
    ctx.quadraticCurveTo(0, -s * 0.2, s, -s * 0.6);
    ctx.quadraticCurveTo(s, s * 0.5, 0, s * 1.2); 
    ctx.quadraticCurveTo(-s, s * 0.5, -s, -s * 0.6); 
    
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    const is = s * 0.7; 
    ctx.moveTo(-is, -is * 0.6);
    ctx.quadraticCurveTo(0, -is * 0.2, is, -is * 0.6);
    ctx.quadraticCurveTo(is, is * 0.5, 0, is * 1.2);
    ctx.quadraticCurveTo(-is, is * 0.5, -is, -is * 0.6);
    ctx.stroke();

    ctx.restore();
  }

  function drawSword(x, y, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = 'rgba(169, 140, 255, 0.9)';
    ctx.shadowColor = 'rgba(169, 140, 255, 0.6)';
    ctx.shadowBlur = 10;
    const size = 22; 
    ctx.beginPath();
    ctx.moveTo(0, -size * 2.5);
    ctx.lineTo(size * 0.3, -size * 0.5);
    ctx.lineTo(size * 0.5, size * 0.2); 
    ctx.lineTo(-size * 0.5, size * 0.2);
    ctx.lineTo(-size * 0.3, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size * 1.2, -size * 0.4);
    ctx.lineTo(size * 0.4, size * 0.5);
    ctx.lineTo(-size * 0.4, size * 0.5);
    ctx.lineTo(-size * 1.2, -size * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#cfe8ff'; 
    ctx.fillRect(-size * 0.1, size * 0.5, size * 0.2, size * 0.8); 
    ctx.beginPath();
    ctx.arc(0, size * 1.4, size * 0.2, 0, Math.PI*2); 
    ctx.fill();
    ctx.restore();
  }
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    if (c.width === 0 || c.height === 0) {
      requestAnimationFrame(draw);
      return;
    }
    
    frameCount++;
    drawShield(shieldX, shieldY);
    if (state === 'attack') {
      swordX += 4; 
      if (swordX >= shieldX - 35) { 
        state = 'impact';
        impactAlpha = 1;
        impactRadius = 5;
        swordX -= 15; 
        swordRotation += Math.PI / 12;
      }
    } else if (state === 'impact') {
      impactAlpha -= 0.06; 
      impactRadius += 2; 
      if (impactAlpha <= 0) {
        state = 'reset';
        frameCount = 0; 
      }
      swordX -= 0.8;
      swordRotation += Math.PI / 64;
    } else if (state === 'reset') {
      if (frameCount > 50) { 
        swordX = -40;
        swordY = c.height / 2;
        swordRotation = Math.PI / 2;
        state = 'attack';
        frameCount = 0;
      }
    }
    drawSword(swordX, swordY, swordRotation);
    if (impactAlpha > 0) {
      ctx.save();
      ctx.translate(shieldX - 10, shieldY); 
      ctx.strokeStyle = `rgba(255, 238, 138, ${impactAlpha})`; 
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15 * impactAlpha;
      ctx.shadowColor = `rgba(255, 154, 0, ${impactAlpha})`; 
      
      for (let i = 0; i < 12; i++) { 
        const angle = (i / 12) * Math.PI * 2 + (frameCount * 0.1);
        const sparkLen = 5 + Math.random() * 15;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * impactRadius, Math.sin(angle) * impactRadius);
        ctx.lineTo(Math.cos(angle) * (impactRadius + sparkLen), Math.sin(angle) * (impactRadius + sparkLen));
        ctx.stroke();
      }
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

(function previewPowers() {
  const c = document.getElementById('previewPowers');
  if (!c) return;
  const ctx = c.getContext('2d');
  function resize() { c.width = c.parentElement.clientWidth; c.height = c.parentElement.clientHeight; }
  resize(); window.addEventListener('resize', resize);
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    const cx = c.width/2, cy = c.height/2;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, 20 + i*14 + Math.sin(t + i)*5, 0, Math.PI*2);
      ctx.strokeStyle = i % 2 ? 'rgba(169,140,255,0.35)' : 'rgba(134,232,255,0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    t += 0.04;
    requestAnimationFrame(draw);
  }
  draw();
})();

(function previewMusic() {
  const c = document.getElementById('previewMusic');
  if (!c) return;
  const ctx = c.getContext('2d');
  function resize() { c.width = c.parentElement.clientWidth; c.height = c.parentElement.clientHeight; }
  resize(); window.addEventListener('resize', resize);

  const bars = 24;
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    const w = c.width / bars;
    for (let i = 0; i < bars; i++) {
      const h = (Math.sin(t + i*0.3) * 0.5 + 0.5) * (c.height * 0.8);
      ctx.fillStyle = i % 2 ? 'rgba(134,232,255,0.4)' : 'rgba(169,140,255,0.35)';
      ctx.fillRect(i*w + w*0.2, c.height - h, w*0.6, h);
    }
    t += 0.06;
    requestAnimationFrame(draw);
  }
  draw();
})();