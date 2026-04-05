document.addEventListener('DOMContentLoaded', () => {
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultModal = document.getElementById('result-modal');
    const grid = document.getElementById('treasure-grid');
    const turnsDisplay = document.getElementById('turns-left');
    const scoreDisplay = document.getElementById('current-score');
    const highScoreDisplay = document.getElementById('high-score');
    const finalScoreDisplay = document.getElementById('final-score');
    const newRecordMsg = document.getElementById('new-record');

    let score = 0;
    let turns = 0;
    let highScore = localStorage.getItem('treasure-high-score') || 0;
    highScoreDisplay.textContent = highScore;

    const config = {
        easy: { size: 5, turns: 10 },
        hard: { size: 8, turns: 15 }
    };

    // Initialize Game
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.dataset.level;
            startGame(config[level]);
        });
    });

    function startGame(settings) {
        score = 0;
        turns = settings.turns;
        updateUI();
        
        setupScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        createGrid(settings.size);
    }

    function createGrid(size) {
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        
        for (let i = 0; i < size * size; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.addEventListener('click', () => handleTileClick(tile), { once: true });
            grid.appendChild(tile);
        }
    }

    function handleTileClick(tile) {
        if (turns <= 0) return;

        turns--;
        const result = getRandomTreasure();
        revealTile(tile, result);
        
        score += result.points;
        updateUI();

        if (turns <= 0) {
            setTimeout(endGame, 800);
        }
    }

    function getRandomTreasure() {
        const rand = Math.random();
        if (rand < 0.05) return { type: 'chest', icon: '🎁', points: 100 };
        if (rand < 0.15) return { type: 'gem', icon: '💎', points: 50 };
        if (rand < 0.40) return { type: 'coin', icon: '💰', points: 10 };
        return { type: 'empty', icon: '💨', points: 0 };
    }

    function revealTile(tile, result) {
        tile.classList.add('revealed', result.type);
        tile.textContent = result.icon;
    }

    function updateUI() {
        scoreDisplay.textContent = score;
        turnsDisplay.textContent = turns;
    }

    function endGame() {
        finalScoreDisplay.textContent = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('treasure-high-score', highScore);
            highScoreDisplay.textContent = highScore;
            newRecordMsg.classList.remove('hidden');
        } else {
            newRecordMsg.classList.add('hidden');
        }
        resultModal.classList.remove('hidden');
    }

    // Controls
    document.getElementById('reset-btn').addEventListener('click', () => {
        gameScreen.classList.add('hidden');
        setupScreen.classList.remove('hidden');
    });

    document.getElementById('modal-close-btn').addEventListener('click', () => {
        resultModal.classList.add('hidden');
        gameScreen.classList.add('hidden');
        setupScreen.classList.remove('hidden');
    });
});
