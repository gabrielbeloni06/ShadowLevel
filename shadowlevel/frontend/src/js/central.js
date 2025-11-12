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

  const glyphs = 'ᚠᚢᚦᚨᚱᚲᚷᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜ';
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

(function previewPong() {
  const c = document.getElementById('previewPong');
  const ctx = c.getContext('2d');
  function resize() { c.width = c.parentElement.clientWidth; c.height = c.parentElement.clientHeight; }
  resize(); window.addEventListener('resize', resize);

  let ball = { x: 30, y: 30, vx: 2.2, vy: 1.6, r: 6 };
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = 'rgba(134,232,255,0.35)';
    ctx.fillRect(8, c.height/2-24, 6, 48);
    ctx.fillRect(c.width-14, c.height/2-18, 6, 36);
    const grad = ctx.createRadialGradient(ball.x, ball.y, 1, ball.x, ball.y, 16);
    grad.addColorStop(0, 'rgba(134,232,255,0.9)');
    grad.addColorStop(1, 'rgba(134,232,255,0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2); ctx.fill();

    ball.x += ball.vx; ball.y += ball.vy;
    if (ball.y < ball.r || ball.y > c.height - ball.r) ball.vy *= -1;
    if (ball.x < ball.r || ball.x > c.width - ball.r) ball.vx *= -1;
    requestAnimationFrame(draw);
  }
  draw();
})();

(function previewPowers() {
  const c = document.getElementById('previewPowers');
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
