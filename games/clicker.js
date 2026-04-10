/**
 * DRAGON CLICKER - Retro Arcade Edition
 */
window.loadClicker = function (el, autoStart = true) {
    el.innerHTML = `
        <div class="game-container glass-card" style="background: rgba(10, 10, 20, 0.95); padding: 20px; border-radius: 20px; border: 1px solid rgba(139, 92, 246, 0.3);">
            <div class="game-instructions" style="margin-bottom: 10px; color: #a78bfa; font-family: 'Orbitron'; font-size: 0.8rem;">
                🎯 DRAGON CLICKER - Hunt the targets, gain the brew!
            </div>
            <div class="game-header" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-family: 'Orbitron'; font-size: 1.1rem;">
                <span style="color: #6366f1;">SCORE: <span id="gs">0</span></span>
                <span style="color: #ec4899;">TIME: <span id="gt-time">30</span>s</span>
            </div>
            <div style="position: relative; overflow: hidden; border-radius: 15px; border: 2px solid rgba(255,255,255,0.05);">
                <canvas id="clicker-canvas" width="360" height="400" style="background: #020205; display: block; margin: auto; cursor: crosshair;"></canvas>
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02)); background-size: 100% 4px, 3px 100%; z-index: 5;"></div>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 20px;">
                <button id="restartClicker" class="btn btn-primary" style="min-width: 150px; font-family: 'Orbitron';">RESTART</button>
                <button class="btn btn-secondary" onclick="window.loadGame(null)" style="min-width: 150px; font-family: 'Orbitron';">CLOSE</button>
            </div>
        </div>`;

    const canvas = document.getElementById('clicker-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let score = 0;
    let timeLeft = 30;
    let timerInterval;
    let gameLoop;
    let target = { x: 180, y: 200, radius: 25, color: '#00ffff' };
    let particles = [];
    let isGameOver = false;

    function reset() {
        score = 0;
        timeLeft = 30;
        isGameOver = false;
        particles = [];
        updateScore();
        moveTarget();
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) endGame();
            const timeEl = document.getElementById('gt-time');
            if (timeEl) timeEl.textContent = timeLeft;
        }, 1000);
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(update, 1000 / 60);
    }

    function updateScore() {
        const sEl = document.getElementById('gs');
        if (sEl) sEl.textContent = score;
    }

    function moveTarget() {
        target.x = 40 + Math.random() * (canvas.width - 80);
        target.y = 40 + Math.random() * (canvas.height - 80);
        const colors = ['#00ffff', '#ff00ea', '#00ff00', '#ffff00'];
        target.color = colors[Math.floor(Math.random() * colors.length)];
    }

    function createExplosion(x, y, color) {
        for (let i = 0; i < 15; i++) {
            particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                color
            });
        }
    }

    function update() {
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.03;
            if (p.life <= 0) particles.splice(i, 1);
        });
        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Neo-Grid Floor
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
        ctx.lineWidth = 1;
        for (let i = -5; i <= 15; i++) {
            ctx.beginPath();
            ctx.moveTo(180 + i * 40, 0);
            ctx.lineTo(180 + i * 120, 400);
            ctx.stroke();
        }
        for (let i = 0; i < 10; i++) {
            const y = i * 40 + (Date.now() * 0.05 % 40);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(360, y);
            ctx.stroke();
        }

        // Particles
        particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        if (!isGameOver) {
            // Draw Target (Neon Dragon Silhouette)
            ctx.save();
            ctx.translate(target.x, target.y);
            ctx.shadowBlur = 20;
            ctx.shadowColor = target.color;

            ctx.fillStyle = target.color;
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🐉', 0, 0);

            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, target.radius + Math.sin(Date.now() / 100) * 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        } else {
            ctx.fillStyle = 'rgba(0,0,0,0.85)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ff00ea';
            ctx.font = 'bold 40px Orbitron';
            ctx.textAlign = 'center';
            ctx.fillText('MISSION END', 180, 180);
            ctx.fillStyle = '#fff';
            ctx.font = '18px Orbitron';
            ctx.fillText(`DRAGONS HUNTED: ${score}`, 180, 230);
            ctx.fillText('RESTART TO CONTINUE', 180, 280);
        }
    }

    function endGame() {
        isGameOver = true;
        clearInterval(timerInterval);
    }

    canvas.onclick = (e) => {
        if (isGameOver) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dist = Math.hypot(x - target.x, y - target.y);
        if (dist < target.radius + 10) {
            score++;
            updateScore();
            createExplosion(target.x, target.y, target.color);
            moveTarget();
        }
    };

    document.getElementById('restartClicker').onclick = reset;
    if (autoStart) {
        if (typeof window.showGameCountdown === 'function') {
            window.showGameCountdown(el, reset);
        } else {
            reset();
        }
    }

    window._activeGameCleanup = () => {
        if (timerInterval) clearInterval(timerInterval);
        if (gameLoop) clearInterval(gameLoop);
    };
};
