/**
 * DRAGON WING RACE GAME - Arcade Synthwave Edition
 */
window.loadRace = function (el, autoStart = true) {
    el.innerHTML = `
        <div class="game-container glass-card" style="background: rgba(10, 10, 20, 0.95); padding: 20px; border-radius: 20px; border: 1px solid rgba(139, 92, 246, 0.3);">
            <div class="game-instructions" style="margin-bottom: 10px; color: #a78bfa; font-family: 'Orbitron'; font-size: 0.8rem;">
                🏎️ DRAGON WING RACE - High-speed arcade vector racing!
            </div>
            <div class="game-header" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-family: 'Orbitron';">
                <span style="color: #6366f1;">SCORE: <span id="race-score">0</span></span>
                <span style="color: #ec4899;">LEFT / RIGHT</span>
            </div>
            <div style="position: relative; overflow: hidden; border-radius: 15px; border: 2px solid rgba(255,255,255,0.05);">
                <canvas id="race-canvas" width="400" height="500" style="background: #020205; display: block; margin: auto; border-radius: 10px;"></canvas>
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02)); background-size: 100% 4px, 3px 100%; z-index: 5;"></div>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 15px;">
                <button id="restartRace" class="btn btn-primary" style="min-width: 150px; font-family: 'Orbitron';">RESTART</button>
                <button class="btn btn-secondary" onclick="window.loadGame(null)" style="min-width: 150px; font-family: 'Orbitron';">CLOSE</button>
            </div>
        </div>`;

    const canvas = document.getElementById('race-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let player, obstacles, score, gameLoop, speed;
    let gameOver = false;

    const drawCar = (x, y, color, isPlayer = false) => {
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = color;

        // Classic Wedge Body
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(x + 20, y);
        ctx.lineTo(x + 35, y + 45);
        ctx.lineTo(x + 35, y + 55);
        ctx.lineTo(x + 5, y + 55);
        ctx.lineTo(x + 5, y + 45);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cockpit
        ctx.strokeStyle = color;
        ctx.strokeRect(x + 16, y + 25, 8, 12);

        // Spoiler
        ctx.fillStyle = color;
        ctx.fillRect(x + 2, y + 50, 36, 5);

        // Tires
        const dt = (tx, ty, tw, th) => {
            ctx.fillStyle = '#000';
            ctx.fillRect(tx, ty, tw, th);
            ctx.strokeStyle = color;
            ctx.strokeRect(tx, ty, tw, th);
        };
        dt(x - 6, y + 8, 8, 14); dt(x + 38, y + 8, 8, 14);
        dt(x - 8, y + 40, 10, 18); dt(x + 38, y + 40, 10, 18);

        // Pilot
        ctx.font = '22px Arial';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 0;
        ctx.fillText(isPlayer ? '🐲' : '🤖', x + 20, y + 36);
        ctx.restore();
    };

    function reset() {
        player = { x: 180, y: 400, w: 40, h: 60 };
        obstacles = [];
        score = 0;
        speed = 5;
        gameOver = false;
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(update, 1000 / 60);
    }

    function update() {
        if (gameOver) return;

        score++;
        if (score % 200 === 0) speed += 0.5;

        // Spawn Enemies
        if (Math.random() < 0.02 + (score * 0.00001)) {
            const lane = Math.floor(Math.random() * 3) * 110 + 60;
            obstacles.push({
                x: lane,
                y: -100,
                w: 40,
                h: 60,
                color: ['#ff00ea', '#00ff00', '#ffff00'][Math.floor(Math.random() * 3)],
                speed: 4 + Math.random() * 3
            });
        }

        // Move Enemies
        obstacles.forEach(o => o.y += o.speed + (speed * 0.5));
        obstacles = obstacles.filter(o => o.y < 600);

        // Score Update
        const sEl = document.getElementById('race-score');
        if (sEl) sEl.textContent = Math.floor(score / 10);

        // Collisions
        const crash = obstacles.some(o =>
            player.x < o.x + o.w &&
            player.x + player.w > o.x &&
            player.y < o.y + o.h &&
            player.y + player.h > o.y
        );

        if (crash) {
            gameOver = true;
            setTimeout(draw, 10);
            return;
        }

        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, 400, 500);

        // Neo-Grid Floor
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
        ctx.lineWidth = 1;
        for (let i = -5; i <= 15; i++) {
            ctx.beginPath();
            ctx.moveTo(200 + i * 80, 0);
            ctx.lineTo(200 + i * 300, 500);
            ctx.stroke();
        }
        const offset = (Date.now() * 0.2) % 100;
        for (let i = 0; i < 10; i++) {
            const y = i * 100 + offset;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(400, y);
            ctx.stroke();
        }

        // Borders
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#6366f1';
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 4;
        ctx.strokeRect(40, 0, 320, 500);
        ctx.shadowBlur = 0;

        // Draw Entities
        obstacles.forEach(o => drawCar(o.x, o.y, o.color, false));
        drawCar(player.x, player.y, '#00ffff', true);

        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(0, 0, 400, 500);
            ctx.fillStyle = '#ff00ea';
            ctx.font = 'bold 40px Orbitron';
            ctx.textAlign = 'center';
            ctx.fillText('CRASHED!', 200, 240);
            ctx.fillStyle = '#fff';
            ctx.font = '16px Orbitron';
            ctx.fillText('PRESS RESTART TO RE-ENLIST', 200, 290);
        }
    }

    const onKey = (e) => {
        if (gameOver) return;
        if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            if (e.key === 'ArrowLeft') player.x = Math.max(50, player.x - 110);
            if (e.key === 'ArrowRight') player.x = Math.min(310, player.x + 110);
        }
    };

    window.addEventListener('keydown', onKey);
    document.getElementById('restartRace').onclick = reset;

    window._activeGameCleanup = () => {
        if (gameLoop) clearInterval(gameLoop);
        window.removeEventListener('keydown', onKey);
    };

    if (autoStart) {
        if (typeof window.showGameCountdown === 'function') {
            window.showGameCountdown(el, reset);
        } else {
            reset();
        }
    }
};
