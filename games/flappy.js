/**
 * FLAPPY DRAGON GAME - Retro Arcade Edition
 */
window.loadFlappy = function (el, autoStart = true) {
    el.innerHTML = `
        <div class="game-container glass-card" style="background: rgba(10, 10, 20, 0.95); padding: 20px; border-radius: 20px; border: 1px solid rgba(139, 92, 246, 0.3);">
            <div class="game-instructions" style="margin-bottom: 10px; color: #a78bfa; font-family: 'Orbitron'; font-size: 0.8rem;">
                🦇 FLAPPY DRAGON - Dodge the pipes and reach the nebula!
            </div>
            <div class="game-header" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-family: 'Orbitron';">
                <span style="color: #6366f1;">SCORE: <span id="flappy-score">0</span></span>
                <span style="color: #ec4899;">BEST: <span id="flappy-best">0</span></span>
            </div>
            <div style="position: relative; overflow: hidden; border-radius: 15px; border: 2px solid rgba(255,255,255,0.05);">
                <canvas id="flappy-canvas" width="400" height="500" style="background: #020205; display: block; margin: auto; cursor: crosshair;"></canvas>
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02)); background-size: 100% 4px, 3px 100%; z-index: 5;"></div>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 15px;">
                <button id="restartFlappy" class="btn btn-primary" style="min-width: 150px; font-family: 'Orbitron';">RESTART</button>
                <button class="btn btn-secondary" onclick="window.loadGame(null)" style="min-width: 150px; font-family: 'Orbitron';">CLOSE</button>
            </div>
        </div>`;

    const canvas = document.getElementById('flappy-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let bird, pipes, score, bestScore = 0, gameLoop, isGameOver;

    function reset() {
        bird = { x: 80, y: 250, vy: 0, w: 34, h: 24, rot: 0 };
        pipes = [{ x: 400, y: 150, gap: 160 }];
        score = 0;
        isGameOver = false;
        updateUI();
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(update, 1000 / 60);
    }

    function updateUI() {
        const sEl = document.getElementById('flappy-score');
        const bEl = document.getElementById('flappy-best');
        if (sEl) sEl.textContent = score;
        if (bEl) bEl.textContent = bestScore;
    }

    function update() {
        if (isGameOver) return;

        // Physics
        bird.vy += 0.4;
        bird.y += bird.vy;
        bird.rot = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.vy * 0.1));

        // Pipes
        pipes.forEach(p => p.x -= 3.5);
        if (pipes[pipes.length - 1].x < 180) {
            const gapY = 100 + Math.random() * 300;
            pipes.push({ x: 400, y: gapY, gap: 160 });
        }
        pipes = pipes.filter(p => p.x > -60);

        // Score
        pipes.forEach(p => {
            if (p.x + 50 < bird.x && !p.scored) {
                p.scored = true;
                score++;
                if (score > bestScore) bestScore = score;
                updateUI();
            }
        });

        // Collisions
        const hitPipe = pipes.some(p => {
            const inPipeX = bird.x + 15 > p.x && bird.x - 15 < p.x + 50;
            const hitTop = bird.y - 12 < p.y - p.gap / 2;
            const hitBottom = bird.y + 12 > p.y + p.gap / 2;
            return inPipeX && (hitTop || hitBottom);
        });

        if (bird.y < 0 || bird.y > 500 || hitPipe) {
            isGameOver = true;
            setTimeout(draw, 10);
            return;
        }

        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, 400, 500);

        // Retro Starfield
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        for (let i = 0; i < 30; i++) {
            const x = (i * 137) % 400;
            const y = (i * 213 + Date.now() / 50) % 500;
            ctx.fillRect(x, y, 1, 1);
        }

        // Draw Pipes (Neon Beer Pipes)
        pipes.forEach(p => {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#F59E0B';
            ctx.strokeStyle = '#F59E0B';
            ctx.lineWidth = 3;
            ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';

            // Top Pipe
            const topH = p.y - p.gap / 2;
            ctx.fillRect(p.x, 0, 50, topH);
            ctx.strokeRect(p.x, 0, 50, topH);

            // Bottom Pipe
            const botY = p.y + p.gap / 2;
            ctx.fillRect(p.x, botY, 50, 500 - botY);
            ctx.strokeRect(p.x, botY, 50, 500 - botY);

            // Neon Caps
            ctx.strokeRect(p.x - 5, topH - 15, 60, 15);
            ctx.strokeRect(p.x - 5, botY, 60, 15);
        });

        // Draw Bird (Retro Neon Dragon)
        ctx.save();
        ctx.translate(bird.x, bird.y);
        ctx.rotate(bird.rot);

        ctx.shadowBlur = 15;
        ctx.shadowColor = '#8B5CF6';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#000';

        // Wedge Body
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(-10, -12);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-10, 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Emoji Overlay
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText('🐲', 0, 0);

        ctx.restore();

        if (isGameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.85)';
            ctx.fillRect(0, 0, 400, 500);
            ctx.fillStyle = '#ff00ea';
            ctx.font = 'bold 40px Orbitron';
            ctx.textAlign = 'center';
            ctx.fillText('CRASHED!', 200, 220);
            ctx.fillStyle = '#fff';
            ctx.font = '18px Orbitron';
            ctx.fillText(`FINAL SCORE: ${score}`, 200, 270);
            ctx.fillText('PRESS RESTART TO FLAP AGAIN', 200, 320);
        }
    }

    const flap = () => {
        if (!isGameOver) bird.vy = -7.5;
    };

    const handleKey = (e) => {
        if (e.key === ' ' || e.key === 'ArrowUp') {
            e.preventDefault();
            flap();
        }
    };

    canvas.onclick = flap;
    window.addEventListener('keydown', handleKey);
    document.getElementById('restartFlappy').onclick = reset;

    window._activeGameCleanup = () => {
        if (gameLoop) clearInterval(gameLoop);
        window.removeEventListener('keydown', handleKey);
    };

    if (autoStart) {
        if (typeof window.showGameCountdown === 'function') {
            window.showGameCountdown(el, reset);
        } else {
            reset();
        }
    }
};
