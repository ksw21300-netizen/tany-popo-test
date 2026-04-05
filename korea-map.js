const TREASURES = [
    {
        id: 1,
        name: '경복궁',
        subtitle: '서울특별시 종로구',
        x: 196, y: 183,
        treasure: '조선왕조의 금관',
        emoji: '👑',
        clue: '조선이 세운 으뜸 궁궐, 북악산 아래 500년 왕조의 황금 왕관이 깊은 곳에 잠들어 있다!',
        points: 100,
        color: '#ffd700'
    },
    {
        id: 2,
        name: '강화도',
        subtitle: '인천광역시 강화군',
        x: 106, y: 200,
        treasure: '고려청자 비색 항아리',
        emoji: '🏺',
        clue: '강화해협이 품은 섬, 고려 도공의 혼이 빚어낸 신비로운 비색(翡色) 청자가 땅 속에 잠들어 있다!',
        points: 80,
        color: '#4fc3f7'
    },
    {
        id: 3,
        name: '설악산',
        subtitle: '강원특별자치도 속초',
        x: 357, y: 152,
        treasure: '산신령의 신비 구슬',
        emoji: '🔮',
        clue: '천불동계곡 깊은 바위 틈, 수천 년 동안 산신령이 지켜온 오색빛 신비로운 구슬을 찾아라!',
        points: 90,
        color: '#ab47bc'
    },
    {
        id: 4,
        name: '안동 하회마을',
        subtitle: '경상북도 안동시',
        x: 320, y: 274,
        treasure: '별신굿 하회탈',
        emoji: '🎭',
        clue: '낙동강이 S자로 감싸 도는 마을, 양반의 위선을 비웃던 탈 속에 천년의 비밀이 숨겨져 있다!',
        points: 75,
        color: '#ef5350'
    },
    {
        id: 5,
        name: '전주 한옥마을',
        subtitle: '전라북도 전주시',
        x: 182, y: 336,
        treasure: '판소리 춘향가 원본 악보',
        emoji: '📜',
        clue: '비빔밥과 막걸리의 고장, 8대 소리꾼이 평생 숨겨온 춘향가 원본 악보가 오래된 기와 아래에 있다!',
        points: 75,
        color: '#ff8f00'
    },
    {
        id: 6,
        name: '합천 해인사',
        subtitle: '경상남도 합천군',
        x: 263, y: 358,
        treasure: '팔만대장경 비밀 경판',
        emoji: '📚',
        clue: '가야산 깊은 산사(山寺), 몽골 대군도 물리친 부처의 힘이 깃든 팔만대장경 숨겨진 경판을 발견하라!',
        points: 120,
        color: '#8d6e63'
    },
    {
        id: 7,
        name: '경주 불국사',
        subtitle: '경상북도 경주시',
        x: 337, y: 350,
        treasure: '성덕대왕신종 에밀레 파편',
        emoji: '🔔',
        clue: '신라 천년의 도읍, 어린아이의 울음소리가 담긴 성덕대왕신종의 황금 파편이 석굴 아래 잠들어 있다!',
        points: 110,
        color: '#78909c'
    },
    {
        id: 8,
        name: '부산 용두산',
        subtitle: '부산광역시 중구',
        x: 348, y: 444,
        treasure: '이순신 장군의 보물검',
        emoji: '⚔️',
        clue: '거북선이 누빈 남해 바다의 관문, 왜군을 물리친 이순신 장군이 숨겨 놓은 신비의 검이 항구에 있다!',
        points: 150,
        color: '#f44336'
    },
    {
        id: 9,
        name: '진도 앞바다',
        subtitle: '전라남도 진도군',
        x: 160, y: 434,
        treasure: '진도 아리랑 원본 악보',
        emoji: '🎵',
        clue: '천 개의 섬이 빛나는 다도해, 슬픔과 기쁨이 뒤섞인 진도 아리랑의 신비로운 원본 악보를 찾아라!',
        points: 85,
        color: '#29b6f6'
    },
    {
        id: 10,
        name: '한라산 백록담',
        subtitle: '제주특별자치도',
        x: 230, y: 558,
        treasure: '삼다도(三多島)의 삼색 보석',
        emoji: '💎',
        clue: '바람·돌·여자의 섬 제주, 한라산 정상 백록담 깊은 곳에 잠든 붉은·파란·흰 세 가지 신비 보석!',
        points: 200,
        color: '#ec407a'
    }
];

// ── State ──
let foundTreasures = new Set();
let totalScore = 0;
let currentTreasure = null;
let highScore = parseInt(localStorage.getItem('korea-map-high-score') || '0');

// ── DOM refs ──
const popupOverlay = document.getElementById('popup-overlay');
const victoryOverlay = document.getElementById('victory-overlay');
const markersGroup = document.getElementById('treasure-markers');
const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
}

// ── Init ──
function init() {
    renderProgressDots();
    renderMarkers();
    updateScoreBar();

    document.getElementById('explore-btn').addEventListener('click', exploreTreasure);
    document.getElementById('close-btn').addEventListener('click', closePopup);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) closePopup();
    });
}

// ── Progress Dots ──
function renderProgressDots() {
    const container = document.getElementById('progress-dots');
    container.innerHTML = '';
    TREASURES.forEach(t => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot' + (foundTreasures.has(t.id) ? ' found' : '');
        dot.textContent = foundTreasures.has(t.id) ? t.emoji : '';
        dot.title = t.name;
        container.appendChild(dot);
    });
}

// ── Markers ──
function renderMarkers() {
    markersGroup.innerHTML = '';
    TREASURES.forEach(t => {
        const isFound = foundTreasures.has(t.id);
        const g = svgEl('g', {
            class: 'treasure-marker',
            id: `marker-${t.id}`,
            transform: `translate(${t.x}, ${t.y})`
        });

        if (isFound) {
            // Found: green checkmark badge
            const bg = svgEl('circle', {
                r: '10', fill: '#2e7d32',
                stroke: '#81c784', 'stroke-width': '1.5', opacity: '0.9'
            });
            const check = svgEl('text', {
                'text-anchor': 'middle', 'dominant-baseline': 'central',
                'font-size': '10', fill: 'white', 'font-weight': 'bold'
            });
            check.textContent = '✓';
            g.appendChild(bg);
            g.appendChild(check);
        } else {
            // Not found: pulsing gold X marker
            const pulse = svgEl('circle', { r: '11', fill: t.color, opacity: '0.3' });

            const animR = svgEl('animate', {
                attributeName: 'r',
                values: '9;18;9',
                dur: `${2.2 + Math.random() * 0.8}s`,
                repeatCount: 'indefinite'
            });
            const animO = svgEl('animate', {
                attributeName: 'opacity',
                values: '0.4;0;0.4',
                dur: `${2.2 + Math.random() * 0.8}s`,
                repeatCount: 'indefinite'
            });
            pulse.appendChild(animR);
            pulse.appendChild(animO);
            g.appendChild(pulse);

            const circle = svgEl('circle', {
                r: '9', fill: t.color,
                stroke: 'white', 'stroke-width': '1.8',
                class: 'marker-circle', filter: 'url(#glow)'
            });
            g.appendChild(circle);

            const xMark = svgEl('text', {
                'text-anchor': 'middle', 'dominant-baseline': 'central',
                'font-size': '11', fill: 'white', 'font-weight': 'bold',
                'pointer-events': 'none'
            });
            xMark.textContent = '✕';
            g.appendChild(xMark);
        }

        // Location label
        const label = svgEl('text', {
            'text-anchor': 'middle', y: '21',
            'font-size': '7.5',
            fill: isFound ? '#81c784' : '#f4ecd8',
            'font-weight': 'bold',
            filter: 'url(#text-shadow)',
            'font-family': 'sans-serif',
            class: 'marker-label',
            'pointer-events': 'none'
        });
        label.textContent = t.name;
        g.appendChild(label);

        g.addEventListener('click', () => openPopup(t));
        markersGroup.appendChild(g);
    });
}

// ── Popup ──
function openPopup(treasure) {
    currentTreasure = treasure;
    const isFound = foundTreasures.has(treasure.id);

    document.getElementById('popup-name').textContent = treasure.name;
    document.getElementById('popup-subtitle').textContent = treasure.subtitle;
    document.getElementById('popup-clue').textContent = treasure.clue;

    const badge = document.getElementById('popup-badge');
    const exploreBtn = document.getElementById('explore-btn');
    const revealDiv = document.getElementById('treasure-reveal');

    if (isFound) {
        badge.classList.remove('hidden');
        exploreBtn.classList.add('hidden');
        revealDiv.classList.remove('hidden');
        document.getElementById('reveal-emoji').textContent = treasure.emoji;
        document.getElementById('reveal-name').textContent = treasure.treasure;
        document.getElementById('reveal-points').textContent = `${treasure.points}점 획득 완료!`;
    } else {
        badge.classList.add('hidden');
        exploreBtn.classList.remove('hidden');
        revealDiv.classList.add('hidden');
    }

    popupOverlay.classList.add('active');
}

function closePopup() {
    popupOverlay.classList.remove('active');
    currentTreasure = null;
}

// ── Explore / Collect ──
function exploreTreasure() {
    if (!currentTreasure || foundTreasures.has(currentTreasure.id)) return;

    const t = currentTreasure;
    foundTreasures.add(t.id);
    totalScore += t.points;

    document.getElementById('reveal-emoji').textContent = t.emoji;
    document.getElementById('reveal-name').textContent = t.treasure;
    document.getElementById('reveal-points').textContent = `+${t.points}점 획득!`;
    document.getElementById('treasure-reveal').classList.remove('hidden');
    document.getElementById('explore-btn').classList.add('hidden');
    document.getElementById('popup-badge').classList.remove('hidden');

    updateScoreBar();
    renderProgressDots();
    renderMarkers();

    if (foundTreasures.size === TREASURES.length) {
        setTimeout(() => {
            closePopup();
            showVictory();
        }, 1600);
    }
}

// ── Score Bar ──
function updateScoreBar() {
    const found = foundTreasures.size;
    document.getElementById('found-display').textContent = found;
    document.getElementById('treasure-count').textContent = `${found} / ${TREASURES.length}`;
    document.getElementById('score-display').textContent = totalScore;

    if (totalScore > highScore) {
        highScore = totalScore;
        localStorage.setItem('korea-map-high-score', highScore);
    }
    document.getElementById('high-score-display').textContent = highScore;
}

// ── Victory ──
function showVictory() {
    const container = document.getElementById('victory-treasures');
    container.innerHTML = '';
    TREASURES.forEach((t, i) => {
        const span = document.createElement('span');
        span.className = 'victory-treasure-item';
        span.textContent = t.emoji;
        span.title = t.treasure;
        span.style.animationDelay = `${i * 0.08}s`;
        container.appendChild(span);
    });
    document.getElementById('victory-score').textContent = totalScore;
    victoryOverlay.classList.add('active');
}

// ── Restart ──
function restartGame() {
    foundTreasures.clear();
    totalScore = 0;
    currentTreasure = null;
    victoryOverlay.classList.remove('active');
    updateScoreBar();
    renderProgressDots();
    renderMarkers();
}

init();
