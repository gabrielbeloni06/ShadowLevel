(function bgLines() {
  const c = document.getElementById('bgLines');
  const ctx = c.getContext('2d');
  function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);

  let t = 0;
  function draw() {
    ctx.clearRect(0,0,c.width,c.height);
    ctx.strokeStyle = 'rgba(94,234,255,0.12)';
    for (let i=0; i<c.width; i+=40) {
      ctx.beginPath();
      ctx.moveTo(i,0);
      ctx.lineTo(i, c.height);
      ctx.stroke();
    }
    t += 0.02;
    requestAnimationFrame(draw);
  }
  draw();
})();
(function bgParticles() {
  const c = document.getElementById('bgParticles');
  const ctx = c.getContext('2d');
  function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);

  const particles = Array.from({length:80}, () => ({
    x: Math.random()*c.width,
    y: Math.random()*c.height,
    vx: (Math.random()*0.6+0.2),
    r: Math.random()*2+1
  }));

  function draw() {
    ctx.clearRect(0,0,c.width,c.height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(94,234,255,0.25)';
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
      p.x += p.vx;
      if (p.x > c.width) p.x = -p.r;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

document.querySelectorAll('[data-expand]').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('expanded');
  });
});
