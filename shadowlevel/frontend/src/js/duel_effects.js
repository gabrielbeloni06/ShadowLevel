window.duelEffects = (function() {
    const canvas = document.getElementById('fx-canvas');
    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];
    const particleColors = {
        parry: ['#86e8ff', '#a98cff', '#ffffff'],
        attack: ['#a98cff', '#5e2d9b', '#f0cfff'], 
        break: ['#ffee8a', '#ff9a00', '#ffffff'], 
        super: ['#000000', '#5e2d9b', '#1a0d33']
    };
    const effectImages = {};
    const imagePaths = {
        shield: '../img/duel/effects/shield_effect.png',
        shadowFigure: '../img/duel/effects/shadow_figure_super.png',
    };

    function loadImages(callback) {
        let loadedCount = 0;
        const totalImages = Object.keys(imagePaths).length;
        if (totalImages === 0) {
            if(callback) callback();
            return;
        }
        for (const key in imagePaths) {
            const img = new Image();
            img.src = imagePaths[key];
            img.onload = () => {
                effectImages[key] = img;
                loadedCount++;
                if (loadedCount === totalImages) {
                    if(callback) callback();
                }
            };
            img.onerror = () => {
                console.warn(`Failed to load image: ${imagePaths[key]}`);
                effectImages[key] = null;
                loadedCount++;
                if (loadedCount === totalImages) {
                    if(callback) callback();
                }
            };
        }
    }
    function initCanvas() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
        ctx.clearRect(0, 0, W, H);
    }

    window.addEventListener('resize', initCanvas);
    loadImages(initCanvas);
    function createParticles(x, y, count, colorPalette, speed, size) {
        for (let i = 0; i < count; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                size: Math.random() * size + 2,
                color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
                alpha: 1,
                decay: Math.random() * 0.03 + 0.01,
                gravity: 0
            });
        }
    }

    function updateParticles() {
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy + p.gravity;
            p.alpha -= p.decay;
            if (p.alpha <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
    }

    function drawParticles() {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }
    function drawLightning(startX, startY, endX, endY, segments, displacement, color, width, alpha) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.globalAlpha = alpha;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        let deltaX = endX - startX;
        let deltaY = endY - startY;
        for (let i = 1; i < segments; i++) {
            let nextX = startX + (deltaX / segments) * i;
            let nextY = startY + (deltaY / segments) * i;
            let currentX = nextX + (Math.random() * 2 - 1) * displacement;
            let currentY = nextY + (Math.random() * 2 - 1) * displacement;
            ctx.lineTo(currentX, currentY);
        }
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        ctx.save();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.restore();
    }
    function animateFx() {
        ctx.clearRect(0, 0, W, H);
        updateParticles();
        drawParticles();
        requestAnimationFrame(animateFx);
    }
    animateFx();
    function doParryFx() {
        initCanvas(); 
        const shieldImg = effectImages.shield;
        const imgX = W / 2;
        const imgY = H / 2.5; 
        if (shieldImg) {
            const shieldSize = 250;
            let alpha = 1;
            let size = shieldSize;
            const animateShield = () => {
                ctx.clearRect(0, 0, W, H);
                if (alpha > 0) {
                    alpha -= 0.05;
                    size += 5; 
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.shadowBlur = 30 * alpha;
                    ctx.shadowColor = `rgba(134, 232, 255, ${alpha})`;
                    ctx.drawImage(shieldImg, imgX - size / 2, imgY - size / 2, size, size);
                    ctx.restore();
                    requestAnimationFrame(animateShield);
                } else {
                    initCanvas();
                }
            };
            requestAnimationFrame(animateShield);
        } else {
            ctx.strokeStyle = 'rgba(134, 232, 255, 0.8)';
            ctx.lineWidth = 5;
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(134, 232, 255, 0.6)';
            let radius = 0;
            let alpha = 1.0;
            const animateWave = () => {
                ctx.clearRect(0,0,W,H);
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(imgX, imgY, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
                radius += 10;
                alpha -= 0.05;
                if (radius < 150 && alpha > 0) {
                    requestAnimationFrame(animateWave);
                } else {
                    initCanvas();
                }
            };
            requestAnimationFrame(animateWave);
        }
        createParticles(imgX, imgY, 30, particleColors.parry, 10, 8);
    }
    function doAttackFx() {
        initCanvas(); 
        const centerX = W / 2;
        const centerY = H / 2.5;
        let pulseAlpha = 0.8;
        let pulseRadius = 0;
        const animatePulse = () => {
            if (pulseAlpha > 0) {
                ctx.save();
                ctx.globalAlpha = pulseAlpha;
                ctx.fillStyle = 'rgba(169, 140, 255, 0.4)';
                ctx.beginPath();
                ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                pulseAlpha -= 0.1;
                pulseRadius += 10;
                requestAnimationFrame(animatePulse);
            }
        }
        requestAnimationFrame(animatePulse);

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const angle = (Math.random() - 0.5) * (Math.PI / 2);
                const length = 200 + Math.random() * 100;
                const startX = centerX - Math.cos(angle) * (length / 2);
                const startY = centerY - Math.sin(angle) * (length / 2);
                const endX = centerX + Math.cos(angle) * (length / 2);
                const endY = centerY + Math.sin(angle) * (length / 2);

                ctx.save();
                ctx.strokeStyle = particleColors.attack[0];
                ctx.lineWidth = 8;
                ctx.lineCap = 'round';
                ctx.shadowBlur = 20;
                ctx.shadowColor = particleColors.attack[2];
                ctx.globalAlpha = 0.9;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                ctx.restore();

                createParticles((startX + endX) / 2, (startY + endY) / 2, 15, particleColors.attack, 8, 5);
                
                if (i === 2) {
                    setTimeout(initCanvas, 500);
                }
            }, i * 100);
        }
    }
    function doBreakFx() {
        initCanvas(); 
        const centerX = W / 2;
        const centerY = H / 2.5;
        let radius = 0;
        let alpha = 0.9;
        const animateShockwave = () => {
            ctx.clearRect(0, 0, W, H);
            if (alpha > 0) {
                ctx.save();
                ctx.strokeStyle = 'rgba(255, 238, 138, 0.8)';
                ctx.lineWidth = 10;
                ctx.shadowBlur = 25;
                ctx.shadowColor = 'rgba(255, 154, 0, 0.8)';
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
                radius += 15;
                alpha -= 0.04;
                requestAnimationFrame(animateShockwave);
            } else {
                initCanvas();
            }
        };
        requestAnimationFrame(animateShockwave);
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const angle = Math.random() * Math.PI * 2;
                const endX = centerX + Math.cos(angle) * 300;
                const endY = centerY + Math.sin(angle) * 300;
                drawLightning(centerX, centerY, endX, endY, 10, 20, 'rgba(255, 238, 138, 0.8)', 3, 0.8);
            }, i * 50);
        }
        createParticles(centerX, centerY, 40, particleColors.break, 15, 10);
    }

    function doSuperFx() {
        initCanvas();

        const shadowImg = effectImages.shadowFigure;
        const centerX = W / 2;
        const centerY = H / 2.5;
        let frame = 0;
        let animationStage = 0;
        for(let i = 0; i < 150; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * W/2 + W/3;
            particles.push({
                x: centerX + Math.cos(angle) * dist,
                y: centerY + Math.sin(angle) * dist,
                vx: -(Math.cos(angle) * dist) / 50,
                vy: -(Math.sin(angle) * dist) / 50,
                size: Math.random() * 5 + 2,
                color: particleColors.super[Math.floor(Math.random() * particleColors.super.length)],
                alpha: 1,
                decay: 0.005,
                gravity: 0
            });
        }
        let imgAlpha = 0;
        let imgScale = 0.5;
        const targetScale = 1.3;
        let slashAlpha = 0;
        let flashAlpha = 0;
        let slashProgress = 0;

        const animateSuper = () => {
            initCanvas();
            frame++;
            if (animationStage === 0) {
                if (shadowImg) {
                    imgAlpha = Math.min(1, imgAlpha + 0.03);
                    imgScale = Math.min(targetScale, imgScale + 0.015);
                    const drawW = shadowImg.width * imgScale;
                    const drawH = shadowImg.height * imgScale;
                    ctx.save();
                    ctx.globalAlpha = imgAlpha;
                    ctx.shadowBlur = 40;
                    ctx.shadowColor = 'rgba(169, 140, 255, 0.7)';
                    ctx.drawImage(shadowImg, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH);
                    ctx.restore();
                }
                for (let i = 0; i < 7; i++) {
                    const angle = (i / 7) * Math.PI * 2 + (frame * 0.02);
                    const startX = centerX + Math.cos(angle) * W * 0.7;
                    const startY = centerY + Math.sin(angle) * H * 0.7;
                    drawLightning(startX, startY, centerX, centerY, 15, 30, 'rgba(0,0,0,0.8)', 4, 0.7);
                }

                if (imgScale >= targetScale) {
                    animationStage = 1;
                    flashAlpha = 1.0;
                    slashAlpha = 1.0;
                }
            }
            if (animationStage === 1) {
                 if (shadowImg) {
                    const drawW = shadowImg.width * targetScale;
                    const drawH = shadowImg.height * targetScale;
                    ctx.save();
                    ctx.globalAlpha = imgAlpha * (flashAlpha * 0.5 + 0.5);
                    ctx.shadowBlur = 40;
                    ctx.shadowColor = 'rgba(169, 140, 255, 0.7)';
                    ctx.drawImage(shadowImg, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH);
                    ctx.restore();
                }
                slashProgress = Math.min(1, slashProgress + 0.1);
                const startX = W * 0.1;
                const startY = H * 0.2;
                const endX = W * 0.9;
                const endY = H * 0.8;
                ctx.save();
                ctx.strokeStyle = 'rgba(169, 140, 255, 0.5)';
                ctx.lineWidth = 30;
                ctx.lineCap = 'round';
                ctx.shadowBlur = 40;
                ctx.shadowColor = '#fff';
                ctx.globalAlpha = slashAlpha * 0.5;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(startX + (endX - startX) * slashProgress, startY + (endY - startY) * slashProgress);
                ctx.stroke();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 10;
                ctx.globalAlpha = slashAlpha;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(startX + (endX - startX) * slashProgress, startY + (endY - startY) * slashProgress);
                ctx.stroke();
                ctx.restore();
                if (flashAlpha > 0) {
                    ctx.save();
                    ctx.globalAlpha = flashAlpha;
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, W, H);
                    ctx.restore();
                    flashAlpha -= 0.08;
                }
                
                if (slashProgress >= 1 && flashAlpha <= 0) {
                    animationStage = 2;
                }
            }
            if (animationStage === 2) {
                imgAlpha = Math.max(0, imgAlpha - 0.05);
                slashAlpha = Math.max(0, slashAlpha - 0.05);
                if (shadowImg && imgAlpha > 0) {
                }
                if (slashAlpha > 0) {
                }
                if (imgAlpha <= 0 && slashAlpha <= 0) {
                    initCanvas();
                    return;
                }
            }

            requestAnimationFrame(animateSuper);
        };
        
        requestAnimationFrame(animateSuper);
    }
    return {
        doParryFx: doParryFx,
        doAttackFx: doAttackFx,
        doBreakFx: doBreakFx,
        doSuperFx: doSuperFx,
        init: initCanvas
    };

})();