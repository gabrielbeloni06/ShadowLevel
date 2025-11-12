const particlesCanvas = document.getElementById('particles');
const runesCanvas     = document.getElementById('runes');
const content         = document.getElementById('content');
const menu            = document.getElementById('menu');
const typewriterEl    = document.getElementById('typewriter');
const ambienceAudio   = document.getElementById('ambience');
const pingAudio       = document.getElementById('ping');
const hoverAudio      = document.getElementById('hover');
function resizeCanvas() {
  [particlesCanvas, runesCanvas].forEach(c => {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  });
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

(function initParticles() {
  const ctx = particlesCanvas.getContext('2d');
  const particles = [];
  const count = Math.min(140, Math.floor(window.innerWidth / 12));

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * particlesCanvas.width,
      y: Math.random() * particlesCanvas.height,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * 0.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15
    });
  }

  function draw() {
    ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    for (const p of particles) {
      ctx.beginPath();
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      glow.addColorStop(0, `rgba(120, 220, 255, ${0.35 * p.a})`);
      glow.addColorStop(1, 'rgba(120, 220, 255, 0)');
      ctx.fillStyle = glow;
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = `rgba(170, 235, 255, ${0.9 * p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > particlesCanvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > particlesCanvas.height) p.vy *= -1;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

(function initRunes() {
  const ctx = runesCanvas.getContext('2d');
  const glyphs = 'ᚠᚢᚦᚨᚱᚲᚷᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜ0123456789<>/{}[]()∷≡';
  const lines = [];
  const lineCount = 26;

  for (let i = 0; i < lineCount; i++) {
    lines.push({
      x: Math.random() * runesCanvas.width,
      y: Math.random() * runesCanvas.height,
      speed: Math.random() * 0.5 + 0.15,
      text: Array.from({ length: Math.floor(Math.random() * 10) + 6 }, () => glyphs[Math.floor(Math.random() * glyphs.length)]).join(' ')
    });
  }

  function draw() {
    ctx.clearRect(0, 0, runesCanvas.width, runesCanvas.height);
    ctx.font = '14px Orbitron';
    ctx.shadowColor = 'rgba(120, 220, 255, 0.2)';
    ctx.shadowBlur = 8;

    for (const l of lines) {
      ctx.fillStyle = 'rgba(120, 220, 255, 0.25)';
      ctx.fillText(l.text, l.x, l.y);
      l.y += l.speed;
      if (l.y > runesCanvas.height + 20) {
        l.y = -20;
        l.x = Math.random() * runesCanvas.width;
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

const fullMessage = 'Você foi escolhido para acessar o Sistema…';

function typewriter(el, text, speed = 38) {
  el.textContent = '';
  let i = 0;
  const tick = () => {
    el.textContent = text.slice(0, i + 1);
    i++;
    if (i < text.length) {
      setTimeout(tick, speed);
    } else {
      try { pingAudio.currentTime = 0; pingAudio.play().catch(()=>{}); } catch {}
      menu.classList.add('active');
    }
  };
  tick();
}

function startIntro() {
  try { ambienceAudio.volume = 0.35; ambienceAudio.play().catch(()=>{}); } catch {}
  content.classList.add('active');
  setTimeout(() => typewriter(typewriterEl, fullMessage), 650);
}

menu.addEventListener('mouseover', (e) => {
  if (e.target.matches('a')) {
    try { hoverAudio.currentTime = 0; hoverAudio.play().catch(()=>{}); } catch {}
  }
});

document.querySelectorAll('[data-link]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const href = a.getAttribute('href');
    document.body.classList.add('fade-out');
    content.classList.add('fade-out');
    setTimeout(() => { window.location.href = href; }, 420);
  });
});

const levelUpAudio = document.getElementById('levelup');
document.querySelectorAll('[data-link]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    try { levelUpAudio.currentTime = 0; levelUpAudio.play().catch(()=>{}); } catch {}
    document.body.classList.add('fade-out');
    content.classList.add('fade-out');
    setTimeout(() => { window.location.href = a.getAttribute('href'); }, 600);
  });
});

const soundToggleBtn = document.getElementById('sound-toggle');
let soundEnabled = true;

function updateSoundIcon() {
  soundToggleBtn.textContent = soundEnabled ? "🔊" : "🔇";
}

soundToggleBtn.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  updateSoundIcon();
  ambienceAudio.muted = !soundEnabled;
  pingAudio.muted = !soundEnabled;
  hoverAudio.muted = !soundEnabled;
  levelUpAudio.muted = !soundEnabled;
});

updateSoundIcon();
window.addEventListener('load', startIntro);
