/* ============================================
   TypeRush — Typing Speed Test Engine
   ============================================ */

// Canvas roundRect polyfill for older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
        const r = Array.isArray(radii) ? radii : [radii, radii, radii, radii];
        this.moveTo(x + r[0], y);
        this.lineTo(x + w - r[1], y);
        this.quadraticCurveTo(x + w, y, x + w, y + r[1]);
        this.lineTo(x + w, y + h - r[2]);
        this.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
        this.lineTo(x + r[3], y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r[3]);
        this.lineTo(x, y + r[0]);
        this.quadraticCurveTo(x, y, x + r[0], y);
        this.closePath();
        return this;
    };
}

// ========== WORD BANKS ==========
const WORDS = {
    easy: [
        "the","be","to","of","and","a","in","that","have","it","for","not","on","with","he","as","you","do",
        "at","this","but","his","by","from","they","we","her","she","or","an","will","my","one","all","would",
        "there","their","what","so","up","out","if","about","who","get","which","go","me","when","make","can",
        "like","time","no","just","him","know","take","people","into","year","your","good","some","could","them",
        "see","other","than","then","now","look","only","come","its","over","think","also","back","after","use",
        "two","how","our","work","first","well","way","even","new","want","because","any","these","give","day",
        "most","us","great","between","need","large","often","hand","high","place","hold","keep","point","start",
        "close","small","night","real","life","few","north","open","seem","together","next","white","begin","got",
        "walk","example","ease","paper","group","always","music","those","both","mark","book","letter","until",
        "mile","river","car","feet","care","second","enough","plain","girl","usual","young","ready","above",
        "ever","red","list","though","feel","talk","bird","soon","body","dog","family","direct","pose","leave",
        "song","measure","door","product","black","short","number","class","wind","question","happen","complete",
        "ship","area","half","rock","order","fire","south","problem","piece","told","knew","pass","since","top",
        "whole","king","space","heard","best","hour","better","true","during","hundred","five","remember","step",
        "early","power","town","fine","fly","fall","lead","cry","dark","machine","note","wait","plan","figure",
        "star","noun","field","rest","correct","able","pound","done","beauty","drive","stood","contain","front"
    ],
    medium: [
        "information","important","development","environment","technology","management","experience","performance",
        "government","community","particular","understand","commercial","production","education","knowledge",
        "international","university","organization","population","application","construction","competition",
        "professional","relationship","significant","opportunity","traditional","individual","communication",
        "administration","programming","architecture","engineering","foundation","calculation","investigation",
        "entertainment","intelligence","recommendation","appreciation","characteristic","responsibility",
        "distribution","transportation","representative","consideration","determination","establishment",
        "implementation","concentration","configuration","documentation","visualization","optimization",
        "authentication","authorization","collaboration","infrastructure","specialization","transformation",
        "effectiveness","comprehensive","approximately","interpretation","demonstration","specification",
        "accomplishment","simultaneously","classification","congratulation","experimentation","acknowledgement",
        "algorithm","database","function","variable","parameter","interface","abstract","template","constant",
        "framework","component","structure","platform","protocol","security","resource","strategy","standard",
        "generate","validate","exchange","navigate","complete","maintain","progress","transfer","evaluate",
        "integrate","customize","implement","transform","challenge","objective","efficient","powerful"
    ],
    hard: [
        "juxtaposition","circumnavigation","psychophysiology","electroencephalogram","compartmentalization",
        "disproportionately","quintessential","uncharacteristically","internationalization","telecommunications",
        "straightforward","acknowledgement","counterproductive","anthropomorphism","autobiographical",
        "disenfranchisement","entrepreneurship","incomprehensible","interdisciplinary","microelectronics",
        "neuropsychological","onomatopoeia","paleontological","prestidigitation","psychopharmacology",
        "reconnaissance","serendipitous","thermodynamics","unconstitutional","vulnerabilities",
        "antidisestablishmentarianism","supercalifragilisticexpialidocious","pneumonoultramicroscopicsilicovolcanoconiosis",
        "pseudopseudohypoparathyroidism","floccinaucinihilipilification","honorificabilitudinity",
        "sesquipedalian","pulchritudinous","magniloquent","perspicacious","circumlocution","phantasmagoria",
        "syzygy","xylophone","zephyr","quixotic","ephemeral","labyrinthine","mellifluous","obfuscate",
        "serendipity","ubiquitous","verisimilitude","wherewithal","zeitgeist","discombobulate",
        "flabbergasted","gobbledygook","hullabaloo","idiosyncratic","kaleidoscope","loquacious",
        "nomenclature","oscillation","perpendicular","quarantine","rambunctious","surreptitious",
        "transcendental","unequivocal","vivacious","whimsical","xenophobia","colloquially","effervescent",
        "conundrum","paradoxical","sophisticated","philosophical","existentialism","transcontinental",
        "multidimensional"
    ]
};

const QUOTES = [
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    "In the middle of every difficulty lies opportunity. The greater the obstacle, the more glory in overcoming it.",
    "It does not matter how slowly you go as long as you do not stop. Persistence is the key to unlocking success.",
    "The future belongs to those who believe in the beauty of their dreams. Never stop dreaming and pursuing your passion.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts in the end.",
    "Life is what happens when you're busy making other plans. Take time to appreciate the moments you're living in.",
    "The best time to plant a tree was twenty years ago. The second best time is now. Start today.",
    "The only impossible journey is the one you never begin. So take that first step and see where it leads you.",
    "You miss one hundred percent of the shots you don't take. Every attempt brings you closer to your goal.",
    "Innovation distinguishes between a leader and a follower. Think different and challenge the status quo.",
    "Stay hungry, stay foolish. The people who are crazy enough to think they can change the world are the ones who do.",
    "Code is like humor. When you have to explain it, it's bad. Write clean, readable code that speaks for itself.",
    "First, solve the problem. Then, write the code. Understanding the problem is half the solution.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Programming isn't about what you know; it's about what you can figure out when you don't know.",
    "The most disastrous thing that you can ever learn is your first programming language. It shapes how you think forever.",
    "Talk is cheap. Show me the code. Actions speak louder than words in the world of software development.",
    "Simplicity is the soul of efficiency. Complex systems arise from simple components working together harmoniously.",
    "The best error message is the one that never shows up. Anticipate problems before they occur in your design.",
    "Before software can be reusable it first has to be usable. Focus on making things work well before making them generic."
];

// ========== STATE ==========
const state = {
    mode: 'time',         // time | words | quote
    duration: 30,         // seconds (for time mode)
    wordCount: 25,        // (for words mode)
    difficulty: 'easy',
    isRunning: false,
    isFinished: false,
    startTime: null,
    endTime: null,
    timer: null,
    elapsed: 0,
    text: '',
    charIndex: 0,
    correctChars: 0,
    incorrectChars: 0,
    correctedChars: 0,
    totalKeystrokes: 0,
    hadError: [],
    wpmHistory: [],
    charStats: {},
    bigramStats: {},
    lastKeystrokeTime: null,
    prevInputLength: 0,
    practiceMode: false,
    practiceText: null,
    soundEnabled: true,
    theme: localStorage.getItem('typerush-theme') || 'dark'
};

// ========== AUDIO ==========
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
    if (!state.soundEnabled) return;
    try {
        if (!audioCtx) audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

        if (type === 'key') {
            osc.frequency.setValueAtTime(600 + Math.random() * 200, audioCtx.currentTime);
            osc.type = 'sine';
        } else if (type === 'error') {
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.type = 'square';
        } else if (type === 'complete') {
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        }

        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) { /* ignore audio errors */ }
}

// ========== DOM ==========
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const els = {
    textDisplay: $('#text-display'),
    input: $('#typing-input'),
    caret: $('#typing-caret'),
    container: $('#typing-container'),
    focusHint: $('#focus-hint'),
    settingsBar: $('#settings-bar'),
    liveWpm: $('#live-wpm'),
    liveAccuracy: $('#live-accuracy'),
    liveTime: $('#live-time'),
    liveChars: $('#live-chars'),
    liveCorrected: $('#live-corrected'),
    wpmBar: $('#wpm-bar'),
    accuracyBar: $('#accuracy-bar'),
    timeBar: $('#time-bar'),
    resultsPanel: $('#results-panel'),
    resultWpm: $('#result-wpm'),
    resultAccuracy: $('#result-accuracy'),
    resultTime: $('#result-time'),
    resultCorrect: $('#result-correct'),
    resultErrors: $('#result-errors'),
    resultRaw: $('#result-raw'),
    resultCorrected: $('#result-corrected'),
    resultsGrade: $('#results-grade'),
    resultsTitle: $('#results-title'),
    weaknessBody: $('#weakness-body'),
    practiceWeaknessBody: $('#practice-weakness-body'),
    btnStartPractice: $('#btn-start-practice'),
    wpmChart: $('#wpm-chart'),
    saveModal: $('#save-modal'),
    playerName: $('#player-name'),
    toastContainer: $('#toast-container'),
    podium: $('#podium'),
    leaderboardBody: $('#leaderboard-body'),
    leaderboardEmpty: $('#leaderboard-empty'),
    historyChart: $('#history-chart'),
    noHistory: $('#no-history'),
    keyboardHeatmap: $('#keyboard-heatmap'),
    noHeatmap: $('#no-heatmap'),
    totalTests: $('#total-tests'),
    avgWpm: $('#avg-wpm'),
    bestWpm: $('#best-wpm'),
    avgAccuracy: $('#avg-accuracy'),
};

// ========== PARTICLES ==========
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 40;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.3 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 92, 252, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(124, 92, 252, ${0.05 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ========== TEXT GENERATION ==========
function generateText() {
    if (state.practiceMode && state.practiceText) {
        return state.practiceText;
    }

    if (state.mode === 'quote') {
        return QUOTES[Math.floor(Math.random() * QUOTES.length)];
    }

    const pool = WORDS[state.difficulty];
    const count = state.mode === 'words' ? state.wordCount : Math.max(60, state.duration * 3);
    const words = [];
    for (let i = 0; i < count; i++) {
        words.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    return words.join(' ');
}

// ========== RENDER TEXT ==========
function renderText() {
    els.textDisplay.innerHTML = '';
    for (let i = 0; i < state.text.length; i++) {
        const span = document.createElement('span');
        span.className = 'char upcoming';
        span.textContent = state.text[i];
        span.dataset.index = i;
        els.textDisplay.appendChild(span);
    }
    // Set first char as current
    const firstChar = els.textDisplay.querySelector('.char');
    if (firstChar) {
        firstChar.classList.remove('upcoming');
        firstChar.classList.add('current');
    }
}

// ========== CARET POSITION ==========
function updateCaret() {
    const chars = els.textDisplay.querySelectorAll('.char');
    const target = chars[state.charIndex] || chars[chars.length - 1];
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const containerRect = els.container.getBoundingClientRect();
    els.caret.style.left = (rect.left - containerRect.left + (state.charIndex >= chars.length ? rect.width : 0)) + 'px';
    els.caret.style.top = (rect.top - containerRect.top) + 'px';
    els.caret.style.height = rect.height + 'px';

    // Auto-scroll text display
    if (target.offsetTop > els.textDisplay.offsetHeight * 0.6) {
        els.textDisplay.style.transform = `translateY(-${target.offsetTop - 40}px)`;
    }
}

// ========== START TEST ==========
function startTest() {
    if (state.isRunning) return;
    state.isRunning = true;
    state.startTime = performance.now();
    state.wpmHistory = [];
    els.settingsBar.classList.add('disabled');
    els.container.classList.add('typing');

    let lastHistorySecond = -1;
    if (state.mode === 'time') {
        state.timer = setInterval(() => {
            state.elapsed = (performance.now() - state.startTime) / 1000;
            const remaining = Math.max(0, state.duration - state.elapsed);
            els.liveTime.textContent = Math.ceil(remaining);
            els.timeBar.style.width = ((remaining / state.duration) * 100) + '%';

            // Record WPM once per second
            const currentSecond = Math.floor(state.elapsed);
            if (currentSecond > lastHistorySecond) {
                lastHistorySecond = currentSecond;
                const mins = state.elapsed / 60;
                const wpm = mins > 0 ? Math.round((state.correctChars / 5) / mins) : 0;
                state.wpmHistory.push(wpm);
            }

            updateLiveStats();

            if (remaining <= 0) {
                finishTest();
            }
        }, 100);
    } else {
        state.timer = setInterval(() => {
            state.elapsed = (performance.now() - state.startTime) / 1000;
            els.liveTime.textContent = Math.floor(state.elapsed);

            // Record WPM once per second
            const currentSecond = Math.floor(state.elapsed);
            if (currentSecond > lastHistorySecond) {
                lastHistorySecond = currentSecond;
                const mins = state.elapsed / 60;
                const wpm = mins > 0 ? Math.round((state.correctChars / 5) / mins) : 0;
                state.wpmHistory.push(wpm);
            }

            updateLiveStats();
        }, 100);
    }
}

// ========== FINISH TEST ==========
function finishTest() {
    state.isRunning = false;
    state.isFinished = true;
    clearInterval(state.timer);
    state.endTime = performance.now();
    state.elapsed = (state.endTime - state.startTime) / 1000;

    els.container.classList.remove('typing');
    els.input.blur();
    playSound('complete');

    showResults();
}

// ========== LIVE STATS ==========
function updateLiveStats() {
    const elapsed = state.elapsed || 0;
    const mins = elapsed / 60;
    const wpm = mins > 0 ? Math.round((state.correctChars / 5) / mins) : 0;
    const total = state.correctChars + state.incorrectChars;
    const accuracy = total > 0 ? Math.round((state.correctChars / total) * 100) : 100;

    els.liveWpm.textContent = wpm;
    els.liveAccuracy.innerHTML = accuracy + '<span class="stat-unit">%</span>';
    els.liveChars.textContent = state.charIndex;
    els.liveCorrected.textContent = state.correctedChars;

    // Animate bars
    els.wpmBar.style.width = Math.min(100, (wpm / 150) * 100) + '%';
    els.accuracyBar.style.width = accuracy + '%';

    if (state.mode !== 'time') {
        els.liveTime.textContent = Math.floor(elapsed);
    }
}

// ========== RESULTS ==========
function showResults() {
    const mins = state.elapsed / 60;
    const wpm = mins > 0 ? Math.round((state.correctChars / 5) / mins) : 0;
    const rawWpm = mins > 0 ? Math.round((state.totalKeystrokes / 5) / mins) : 0;
    const total = state.correctChars + state.incorrectChars;
    const accuracy = total > 0 ? Math.round((state.correctChars / total) * 100) : 100;

    els.resultWpm.textContent = wpm;
    els.resultAccuracy.textContent = accuracy + '%';
    els.resultTime.textContent = Math.round(state.elapsed) + 's';
    els.resultCorrect.textContent = state.correctChars;
    els.resultErrors.textContent = state.incorrectChars;
    els.resultRaw.textContent = rawWpm;
    els.resultCorrected.textContent = state.correctedChars;
    els.resultsTitle.textContent = state.practiceMode ? 'Practice Drill Complete!' : 'Test Complete!';

    // Grade
    let grade = 'F';
    if (wpm >= 120) grade = 'S';
    else if (wpm >= 100) grade = 'A+';
    else if (wpm >= 80) grade = 'A';
    else if (wpm >= 60) grade = 'B';
    else if (wpm >= 40) grade = 'C';
    else if (wpm >= 25) grade = 'D';
    els.resultsGrade.textContent = grade;

    // Show panel
    els.resultsPanel.classList.remove('hidden');
    els.container.style.display = 'none';
    $('#action-bar').style.display = 'none';

    // Draw WPM chart
    drawWpmChart();

    // Weak-point analysis
    renderWeaknessPanel(els.weaknessBody, state.charStats, state.bigramStats);

    // Save to history
    saveToHistory(wpm, accuracy);
    saveWeakPointStats();
}

// ========== WEAK POINT ANALYSIS ==========
const MIN_CHAR_ATTEMPTS = 3;
const MIN_BIGRAM_ATTEMPTS = 2;

function computeWeakPoints(charStats, bigramStats) {
    // "Trouble score" blends error rate (weighted heavily) with relative slowness,
    // so a key that's both mistyped often AND slow to reach rises to the top.
    const charEntries = Object.entries(charStats || {})
        .filter(([, s]) => s.attempts >= MIN_CHAR_ATTEMPTS)
        .map(([ch, s]) => ({
            key: ch,
            attempts: s.attempts,
            errorRate: s.errors / s.attempts,
            avgMs: s.timedSamples > 0 ? s.totalMs / s.timedSamples : null,
        }));

    const bigramEntries = Object.entries(bigramStats || {})
        .filter(([, s]) => s.attempts >= MIN_BIGRAM_ATTEMPTS && s.timedSamples > 0)
        .map(([bg, s]) => ({
            key: bg,
            attempts: s.attempts,
            errorRate: s.errors / s.attempts,
            avgMs: s.totalMs / s.timedSamples,
        }));

    if (charEntries.length === 0 && bigramEntries.length === 0) {
        return null; // not enough data for a confident read
    }

    const avgCharMs = average(charEntries.filter(c => c.avgMs != null).map(c => c.avgMs));
    const scoreChar = (c) => c.errorRate * 100 + (c.avgMs != null && avgCharMs > 0 ? Math.max(0, (c.avgMs - avgCharMs) / avgCharMs) * 20 : 0);
    const weakChars = charEntries
        .filter(c => c.errorRate > 0 || (avgCharMs > 0 && c.avgMs > avgCharMs * 1.15))
        .sort((a, b) => scoreChar(b) - scoreChar(a))
        .slice(0, 5);

    const avgBigramMs = average(bigramEntries.map(b => b.avgMs));
    const scoreBigram = (b) => b.errorRate * 100 + (avgBigramMs > 0 ? Math.max(0, (b.avgMs - avgBigramMs) / avgBigramMs) * 20 : 0);
    const weakBigrams = bigramEntries
        .filter(b => b.errorRate > 0 || (avgBigramMs > 0 && b.avgMs > avgBigramMs * 1.15))
        .sort((a, b) => scoreBigram(b) - scoreBigram(a))
        .slice(0, 5);

    // Headline insight: the single worst signal, whichever is more telling
    let insight = null;
    const topChar = weakChars[0];
    const topBigram = weakBigrams[0];
    if (topChar && topChar.errorRate >= 0.25) {
        const pct = Math.round(topChar.errorRate * 100);
        insight = `You miss "${displayKey(topChar.key)}" about ${pct}% of the time it comes up — a few minutes of focused practice on words with that letter should help.`;
    } else if (topBigram && topBigram.errorRate >= 0.2) {
        const pct = Math.round(topBigram.errorRate * 100);
        insight = `The "${displayKey(topBigram.key)}" combo trips you up ${pct}% of the time — that transition is worth slowing down for.`;
    } else if (topBigram && avgBigramMs > 0) {
        insight = `Your biggest hesitation is the "${displayKey(topBigram.key)}" transition — it's noticeably slower than your average keystroke.`;
    } else if (topChar) {
        insight = `"${displayKey(topChar.key)}" is your slowest key right now — nothing wrong with your accuracy, just a touch of extra reach time.`;
    }

    return { weakChars, weakBigrams, insight };
}

function average(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function displayKey(key) {
    return key.replace(/ /g, '␣');
}

function renderWeaknessPanel(targetEl, charStats, bigramStats, emptyMessage) {
    const result = computeWeakPoints(charStats, bigramStats);

    if (!result) {
        targetEl.innerHTML = `
            <div class="weakness-empty">
                ${emptyMessage || 'Not enough data yet to spot patterns — take a longer test (more words or more time) and we\'ll pinpoint the keys and letter combos slowing you down.'}
            </div>
        `;
        return;
    }

    const { weakChars, weakBigrams, insight } = result;
    const maxCharScore = Math.max(1, ...weakChars.map(c => c.errorRate * 100 + (c.avgMs || 0) / 20));

    const charRows = weakChars.length > 0
        ? weakChars.map(c => {
            const pct = Math.round(c.errorRate * 100);
            const barPct = Math.min(100, Math.round(((c.errorRate * 100 + (c.avgMs || 0) / 20) / maxCharScore) * 100));
            const speedLabel = c.avgMs != null ? `${Math.round(c.avgMs)}ms avg` : 'no timing data';
            return `
                <div class="weak-key-row">
                    <div class="weak-key-chip">${escapeHtml(displayKey(c.key))}</div>
                    <div class="weak-key-bar-wrap">
                        <div class="weak-key-bar-track"><div class="weak-key-bar-fill" style="width:${barPct}%"></div></div>
                        <div class="weak-key-meta">${pct}% error rate &middot; ${speedLabel}</div>
                    </div>
                </div>
            `;
        }).join('')
        : `<div class="weakness-empty">No standout problem keys — nice and even!</div>`;

    const bigramRows = weakBigrams.length > 0
        ? weakBigrams.map(b => {
            const pct = Math.round(b.errorRate * 100);
            return `
                <div class="weak-bigram-row">
                    <div class="weak-key-chip">${escapeHtml(displayKey(b.key))}</div>
                    <div class="weak-key-bar-wrap">
                        <div class="weak-key-meta">${pct}% error rate &middot; ${Math.round(b.avgMs)}ms avg transition</div>
                    </div>
                </div>
            `;
        }).join('')
        : `<div class="weakness-empty">No slow letter combos detected.</div>`;

    targetEl.innerHTML = `
        <div class="weakness-columns">
            <div>
                <div class="weakness-col-label">Problem Keys</div>
                ${charRows}
            </div>
            <div>
                <div class="weakness-col-label">Slow Combos</div>
                ${bigramRows}
            </div>
        </div>
        ${insight ? `<div class="weakness-insight">💡 ${escapeHtml(insight)}</div>` : ''}
    `;

    return result;
}

// ========== PRACTICE MODE ==========
let practiceStatsCache = null;

async function loadPracticeWeakPoints() {
    els.practiceWeaknessBody.innerHTML = `<div class="weakness-empty">Loading your typing history…</div>`;
    els.btnStartPractice.disabled = true;

    const result = await API.get('/api/weakpoints');
    if (!result.success) {
        els.practiceWeaknessBody.innerHTML = `<div class="weakness-empty">Couldn't load your weak-point history. Is the server running?</div>`;
        return;
    }

    practiceStatsCache = { charStats: result.charStats, bigramStats: result.bigramStats };

    const analysis = renderWeaknessPanel(
        els.practiceWeaknessBody,
        result.charStats,
        result.bigramStats,
        'Complete a few tests first — practice drills are built from your typing history.'
    );

    els.btnStartPractice.disabled = !analysis;
}

// Builds practice text biased toward whatever keys/combos are currently weakest,
// while still mixing in ordinary words so it reads naturally rather than as drill repetition.
function generatePracticeText(charStats, bigramStats, count = 40) {
    const analysis = computeWeakPoints(charStats, bigramStats);
    if (!analysis) return null;

    const troubleChars = {};
    analysis.weakChars.forEach(c => {
        troubleChars[c.key] = c.errorRate * 100 + (c.avgMs || 0) / 20;
    });
    const troubleBigrams = new Set(analysis.weakBigrams.map(b => b.key));

    // Easy + medium words only — "hard" words are long enough that they rack up a high
    // raw hit count just by being long, not because they're actually good drill material.
    const pool = [...WORDS.easy, ...WORDS.medium];

    function wordDensity(word) {
        const w = word.toLowerCase();
        let score = 0;
        for (let i = 0; i < w.length; i++) {
            if (troubleChars[w[i]]) score += troubleChars[w[i]];
            if (i > 0 && troubleBigrams.has(w[i - 1] + w[i])) score += 15;
        }
        return score / w.length; // density, so short words stay competitive with long ones
    }

    const weighted = pool.map(word => ({ word, weight: 1 + wordDensity(word) * 3 }));
    const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);

    const chosen = [];
    for (let i = 0; i < count; i++) {
        let r = Math.random() * totalWeight;
        for (const w of weighted) {
            r -= w.weight;
            if (r <= 0) { chosen.push(w.word); break; }
        }
    }
    return chosen.join(' ');
}

// ========== WPM CHART ==========
function drawWpmChart() {
    const canvas = els.wpmChart;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    // Read offsetWidth BEFORE resizing the canvas — setting canvas.width changes its
    // own layout size (no CSS constrains it), so reading offsetWidth after would read
    // back the already-inflated value and push all drawing off the visible buffer.
    const w = canvas.offsetWidth;
    const h = 200;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const data = state.wpmHistory;

    if (data.length < 2) return;

    const max = Math.max(...data, 10);
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    const isDark = state.theme === 'dark';
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#55536a' : '#9590b0';
        ctx.font = '11px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(max - (max / 4) * i), padding.left - 8, y + 4);
    }

    // X-axis labels
    ctx.fillStyle = isDark ? '#55536a' : '#9590b0';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    const step = Math.max(1, Math.floor(data.length / 6));
    for (let i = 0; i < data.length; i += step) {
        const x = padding.left + (i / (data.length - 1)) * chartW;
        ctx.fillText(i + 's', x, h - 8);
    }

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, 'rgba(124, 92, 252, 0.3)');
    gradient.addColorStop(1, 'rgba(124, 92, 252, 0)');

    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartH);
    data.forEach((v, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartW;
        const y = padding.top + chartH - (v / max) * chartH;
        if (i === 0) ctx.lineTo(x, y);
        else {
            const prevX = padding.left + ((i - 1) / (data.length - 1)) * chartW;
            const prevY = padding.top + chartH - (data[i - 1] / max) * chartH;
            const cpX = (prevX + x) / 2;
            ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
        }
    });
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((v, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartW;
        const y = padding.top + chartH - (v / max) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else {
            const prevX = padding.left + ((i - 1) / (data.length - 1)) * chartW;
            const prevY = padding.top + chartH - (data[i - 1] / max) * chartH;
            const cpX = (prevX + x) / 2;
            ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
        }
    });
    ctx.strokeStyle = '#7c5cfc';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // End dot
    const lastX = padding.left + chartW;
    const lastY = padding.top + chartH - (data[data.length - 1] / max) * chartH;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#7c5cfc';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(124, 92, 252, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// ========== RESET ==========
function resetTest(newText = true) {
    clearInterval(state.timer);
    state.isRunning = false;
    state.isFinished = false;
    state.startTime = null;
    state.endTime = null;
    state.elapsed = 0;
    state.charIndex = 0;
    state.correctChars = 0;
    state.incorrectChars = 0;
    state.correctedChars = 0;
    state.totalKeystrokes = 0;
    state.wpmHistory = [];
    state.charStats = {};
    state.bigramStats = {};
    state.lastKeystrokeTime = null;
    state.prevInputLength = 0;

    if (newText) {
        state.text = generateText();
    }
    state.hadError = new Array(state.text.length).fill(false);

    els.input.value = '';
    els.settingsBar.classList.remove('disabled');
    els.container.classList.remove('typing', 'focused');
    els.container.style.display = '';
    $('#action-bar').style.display = '';
    els.resultsPanel.classList.add('hidden');
    els.textDisplay.style.transform = '';
    els.focusHint.classList.remove('hidden');

    els.liveWpm.textContent = '0';
    els.liveAccuracy.innerHTML = '100<span class="stat-unit">%</span>';
    els.liveTime.textContent = state.mode === 'time' ? state.duration : '0';
    els.liveChars.textContent = '0';
    els.liveCorrected.textContent = '0';
    els.wpmBar.style.width = '0%';
    els.accuracyBar.style.width = '100%';
    els.timeBar.style.width = state.mode === 'time' ? '100%' : '0%';

    renderText();
}

// ========== KEYSTROKE TRACKING (for weak-point analysis) ==========
function trackKeystroke(inputVal) {
    const now = performance.now();

    if (inputVal.length > state.prevInputLength) {
        // A forward keystroke landed at this index
        const idx = inputVal.length - 1;
        if (idx < state.text.length) {
            const targetChar = state.text[idx].toLowerCase();
            const wasCorrect = inputVal[idx] === state.text[idx];
            const dt = state.lastKeystrokeTime != null ? now - state.lastKeystrokeTime : null;
            const validTiming = dt != null && dt > 0 && dt < 3000; // ignore pauses (e.g. tab-switch)

            const cs = state.charStats[targetChar] || (state.charStats[targetChar] = { attempts: 0, errors: 0, totalMs: 0, timedSamples: 0 });
            cs.attempts++;
            if (!wasCorrect) cs.errors++;
            if (validTiming) { cs.totalMs += dt; cs.timedSamples++; }

            if (idx > 0) {
                const bigram = state.text[idx - 1].toLowerCase() + targetChar;
                const bs = state.bigramStats[bigram] || (state.bigramStats[bigram] = { attempts: 0, errors: 0, totalMs: 0, timedSamples: 0 });
                bs.attempts++;
                if (!wasCorrect) bs.errors++;
                if (validTiming) { bs.totalMs += dt; bs.timedSamples++; }
            }
        }
        state.lastKeystrokeTime = now;
    } else if (inputVal.length < state.prevInputLength) {
        // Backspace — don't let the pause before it skew the next timing sample
        state.lastKeystrokeTime = now;
    }

    state.prevInputLength = inputVal.length;
}

// ========== HANDLE INPUT ==========
function handleInput(e) {
    if (state.isFinished) return;

    const inputVal = els.input.value;
    const chars = els.textDisplay.querySelectorAll('.char');

    if (!state.isRunning && inputVal.length > 0) {
        startTest();
    }

    // Process each character up to current input length
    state.totalKeystrokes = inputVal.length;

    // Track per-character and per-bigram accuracy + speed for weak-point analysis
    trackKeystroke(inputVal);

    let correctCount = 0;
    let incorrectCount = 0;
    let correctedCount = 0;

    for (let i = 0; i < state.text.length; i++) {
        const charEl = chars[i];
        if (!charEl) continue;

        charEl.className = 'char';

        if (i < inputVal.length) {
            if (inputVal[i] === state.text[i]) {
                charEl.classList.add('correct');
                correctCount++;
                if (state.hadError[i]) {
                    charEl.classList.add('corrected');
                    correctedCount++;
                }
            } else {
                charEl.classList.add('incorrect');
                incorrectCount++;
                state.hadError[i] = true;
                if (state.text[i] === ' ') charEl.classList.add('space-error');
            }
        } else if (i === inputVal.length) {
            charEl.classList.add('current');
        } else {
            charEl.classList.add('upcoming');
        }
    }

    state.charIndex = inputVal.length;
    state.correctChars = correctCount;
    state.incorrectChars = incorrectCount;
    state.correctedChars = correctedCount;

    // Play sound
    if (inputVal.length > 0) {
        const lastCharIndex = inputVal.length - 1;
        if (lastCharIndex < state.text.length) {
            if (inputVal[lastCharIndex] === state.text[lastCharIndex]) {
                playSound('key');
            } else {
                playSound('error');
                els.container.classList.add('shake');
                setTimeout(() => els.container.classList.remove('shake'), 300);
            }
        }
    }

    updateCaret();
    updateLiveStats();

    // Check completion (for words/quote mode)
    if (state.mode !== 'time' && inputVal.length >= state.text.length) {
        finishTest();
    }
}

// ========== API HELPERS ==========
const API = {
    async get(url) {
        try {
            const res = await fetch(url);
            return await res.json();
        } catch (err) {
            console.error('API GET error:', err);
            return { success: false, error: err.message };
        }
    },
    async post(url, data) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (err) {
            console.error('API POST error:', err);
            return { success: false, error: err.message };
        }
    },
    async delete(url) {
        try {
            const res = await fetch(url, { method: 'DELETE' });
            return await res.json();
        } catch (err) {
            console.error('API DELETE error:', err);
            return { success: false, error: err.message };
        }
    }
};

// ========== LEADERBOARD ==========
async function addToLeaderboard(name, wpm, rawWpm, accuracy, mode, difficulty) {
    const result = await API.post('/api/scores', {
        name, wpm, rawWpm, accuracy, mode, difficulty,
        duration: state.elapsed,
        correctChars: state.correctChars,
        incorrectChars: state.incorrectChars,
        totalChars: state.charIndex
    });

    if (result.success) {
        showToast('✅ Score saved to leaderboard!', 'success');
        renderLeaderboard();
    } else {
        showToast('❌ Failed to save score', 'error');
    }
}

async function deleteFromLeaderboard(id) {
    const result = await API.delete(`/api/scores/${id}`);
    if (result.success) {
        showToast('🗑️ Score removed', 'error');
        renderLeaderboard();
    } else {
        showToast('❌ Failed to delete score', 'error');
    }
}

async function renderLeaderboard(filter = 'all') {
    const query = filter !== 'all' ? `?mode=${filter}` : '';
    const result = await API.get(`/api/scores${query}`);

    if (!result.success) {
        els.leaderboardEmpty.classList.remove('hidden');
        $$('.leaderboard-table').forEach(t => t.style.display = 'none');
        return;
    }

    const lb = result.scores;

    // Podium (top 3)
    els.podium.innerHTML = '';
    const top3 = lb.slice(0, 3);
    if (top3.length >= 3) {
        // Order: 2nd, 1st, 3rd
        const order = [top3[1], top3[0], top3[2]];
        order.forEach((entry, i) => {
            const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const initial = entry.name.charAt(0).toUpperCase();
            els.podium.innerHTML += `
                <div class="podium-item">
                    <div class="podium-avatar">
                        ${rank === 1 ? '<span class="podium-crown">👑</span>' : ''}
                        ${initial}
                    </div>
                    <div class="podium-name">${escapeHtml(entry.name)}</div>
                    <div class="podium-wpm">${entry.wpm} WPM</div>
                    <div class="podium-pedestal">
                        <span style="position:relative">${rank}</span>
                    </div>
                </div>
            `;
        });
    } else if (top3.length > 0) {
        els.podium.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:40px;">Need at least 3 scores for podium display.</div>';
    }

    // Table
    els.leaderboardBody.innerHTML = '';
    if (lb.length === 0) {
        els.leaderboardEmpty.classList.remove('hidden');
        $$('.leaderboard-table').forEach(t => t.style.display = 'none');
        return;
    }

    els.leaderboardEmpty.classList.add('hidden');
    $$('.leaderboard-table').forEach(t => t.style.display = '');

    lb.forEach((entry, i) => {
        const rank = i + 1;
        let rankContent;
        if (rank <= 3) {
            const badges = ['🥇', '🥈', '🥉'];
            rankContent = `<span class="rank-badge rank-${rank}">${badges[rank - 1]}</span>`;
        } else {
            rankContent = rank;
        }

        const date = new Date(entry.created_at);
        const dateStr = date.toLocaleDateString('default', { month: 'short', day: 'numeric' });

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="td-rank">${rankContent}</td>
            <td class="td-name">${escapeHtml(entry.name)}</td>
            <td class="td-wpm">${entry.wpm}</td>
            <td>${entry.accuracy}%</td>
            <td class="td-mode">${entry.mode}</td>
            <td class="td-date">${dateStr}</td>
            <td>
                <button class="delete-btn" data-id="${entry.id}" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </td>
        `;
        els.leaderboardBody.appendChild(row);
    });
}

// ========== HISTORY & STATS ==========
async function saveToHistory(wpm, accuracy) {
    const mins = state.elapsed / 60;
    const rawWpm = mins > 0 ? Math.round((state.totalKeystrokes / 5) / mins) : 0;

    await API.post('/api/history', {
        wpm, rawWpm, accuracy,
        mode: state.mode,
        difficulty: state.difficulty,
        duration: state.elapsed,
        correctChars: state.correctChars,
        incorrectChars: state.incorrectChars,
        sessionId: state.sessionId || null
    });
}

async function saveWeakPointStats() {
    if (Object.keys(state.charStats).length === 0 && Object.keys(state.bigramStats).length === 0) return;
    await API.post('/api/weakpoints', {
        charStats: state.charStats,
        bigramStats: state.bigramStats
    });
}

async function renderStats() {
    const result = await API.get('/api/stats?limit=30');
    renderKeyboardHeatmap();

    if (!result.success || result.stats.totalTests === 0) {
        els.totalTests.textContent = '0';
        els.avgWpm.textContent = '0';
        els.bestWpm.textContent = '0';
        els.avgAccuracy.textContent = '0%';
        els.noHistory.classList.remove('hidden');
        return;
    }

    els.noHistory.classList.add('hidden');
    els.totalTests.textContent = result.stats.totalTests;
    els.avgWpm.textContent = result.stats.avgWpm;
    els.bestWpm.textContent = result.stats.bestWpm;
    els.avgAccuracy.textContent = result.stats.avgAccuracy + '%';

    if (result.history && result.history.length >= 2) {
        drawHistoryChart(result.history);
    } else {
        els.noHistory.classList.remove('hidden');
    }
}

// ========== KEYBOARD HEATMAP ==========
const HEATMAP_ROWS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];
const HEATMAP_MIN_ATTEMPTS = 2;
const HEATMAP_GOOD_RGB = [0, 212, 170];  // matches --char-correct
const HEATMAP_BAD_RGB = [255, 107, 107]; // matches --char-incorrect

function lerpColor(a, b, t) {
    const r = Math.round(a[0] + (b[0] - a[0]) * t);
    const g = Math.round(a[1] + (b[1] - a[1]) * t);
    const bl = Math.round(a[2] + (b[2] - a[2]) * t);
    return `rgb(${r}, ${g}, ${bl})`;
}

async function renderKeyboardHeatmap() {
    const result = await API.get('/api/weakpoints');
    if (!result.success) {
        els.noHeatmap.classList.remove('hidden');
        return;
    }

    const charStats = result.charStats || {};
    const measured = {};
    let maxBadness = 0;

    const avgMs = average(
        Object.values(charStats)
            .filter(s => s.timedSamples > 0)
            .map(s => s.totalMs / s.timedSamples)
    );

    for (const [ch, s] of Object.entries(charStats)) {
        if (s.attempts < HEATMAP_MIN_ATTEMPTS) continue;
        const errorRate = s.errors / s.attempts;
        const charAvgMs = s.timedSamples > 0 ? s.totalMs / s.timedSamples : null;
        const slowness = charAvgMs != null && avgMs > 0 ? Math.max(0, (charAvgMs - avgMs) / avgMs) : 0;
        const badness = errorRate * 100 + slowness * 20;
        measured[ch] = { badness, errorRate, avgMs: charAvgMs };
        if (badness > maxBadness) maxBadness = badness;
    }

    if (Object.keys(measured).length === 0) {
        els.keyboardHeatmap.innerHTML = '';
        els.noHeatmap.classList.remove('hidden');
        return;
    }
    els.noHeatmap.classList.add('hidden');

    function renderKey(ch, label, extraClass = '') {
        const m = measured[ch];
        if (!m) {
            return `<div class="hm-key hm-inactive ${extraClass}" data-tip="No data yet">${escapeHtml(label)}</div>`;
        }
        const t = maxBadness > 0 ? m.badness / maxBadness : 0;
        const color = lerpColor(HEATMAP_GOOD_RGB, HEATMAP_BAD_RGB, Math.min(1, t));
        const pct = Math.round(m.errorRate * 100);
        const speedPart = m.avgMs != null ? ` &middot; ${Math.round(m.avgMs)}ms avg` : '';
        const tip = `${pct}% errors${speedPart}`;
        return `<div class="hm-key hm-measured ${extraClass}" style="--key-color:${color};--key-glow:${Math.min(1, t).toFixed(2)}" data-tip="${tip}">${escapeHtml(label)}</div>`;
    }

    const rowsHtml = HEATMAP_ROWS.map(row => {
        const keysHtml = row.map(ch => renderKey(ch, ch)).join('');
        return `<div class="hm-row">${keysHtml}</div>`;
    }).join('');

    els.keyboardHeatmap.innerHTML = `
        ${rowsHtml}
        <div class="hm-row">${renderKey(' ', 'space', 'hm-space')}</div>
    `;
}

function drawHistoryChart(history) {
    const canvas = els.historyChart;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    // Read offsetWidth BEFORE resizing the canvas — setting canvas.width changes its
    // own layout size (no CSS constrains it), so reading offsetWidth after would read
    // back the already-inflated value and push all drawing off the visible buffer.
    const w = canvas.offsetWidth;
    const h = 250;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const data = history.slice(-30); // Last 30 tests

    if (data.length < 2) {
        els.noHistory.classList.remove('hidden');
        return;
    }

    const max = Math.max(...data.map(d => d.wpm), 10) * 1.1;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    const isDark = state.theme === 'dark';

    // Grid
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#55536a' : '#9590b0';
        ctx.font = '11px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(max - (max / 4) * i), padding.left - 8, y + 4);
    }

    // WPM bars
    const barWidth = Math.max(4, (chartW / data.length) * 0.6);
    const gap = chartW / data.length;

    data.forEach((d, i) => {
        const x = padding.left + i * gap + (gap - barWidth) / 2;
        const barH = (d.wpm / max) * chartH;
        const y = padding.top + chartH - barH;

        const gradient = ctx.createLinearGradient(x, y, x, y + barH);
        gradient.addColorStop(0, '#7c5cfc');
        gradient.addColorStop(1, 'rgba(124, 92, 252, 0.3)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, [3, 3, 0, 0]);
        ctx.fill();
    });

    // Trend line
    if (data.length > 2) {
        ctx.beginPath();
        const avgWindow = 3;
        const smoothed = data.map((d, i) => {
            const start = Math.max(0, i - avgWindow + 1);
            const slice = data.slice(start, i + 1);
            return slice.reduce((s, e) => s + e.wpm, 0) / slice.length;
        });

        smoothed.forEach((v, i) => {
            const x = padding.left + i * gap + gap / 2;
            const y = padding.top + chartH - (v / max) * chartH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.strokeStyle = '#00d4aa';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

// ========== UTILS ==========
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    els.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function switchSection(sectionId) {
    $$('.section').forEach(s => s.classList.remove('active'));
    $$('.nav-btn').forEach(b => b.classList.remove('active'));
    $(`#section-${sectionId}`).classList.add('active');
    $(`#nav-${sectionId}`).classList.add('active');

    if (sectionId === 'leaderboard') renderLeaderboard();
    if (sectionId === 'stats') renderStats();
    if (sectionId === 'practice') loadPracticeWeakPoints();
}

function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('typerush-theme', theme);
}

// ========== EVENT LISTENERS ==========
function initEvents() {
    // Navigation
    $$('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });

    // Theme
    $('#theme-toggle').addEventListener('click', () => {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    });

    // Sound
    $('#sound-toggle').addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        document.body.classList.toggle('sound-muted', !state.soundEnabled);
    });

    // Mode pills
    $$('#mode-pills .pill').forEach(pill => {
        pill.addEventListener('click', () => {
            $$('#mode-pills .pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            state.mode = pill.dataset.mode;
            state.practiceMode = false;

            // Toggle duration/word settings visibility
            $('#time-settings').classList.toggle('hidden', state.mode !== 'time');
            $('#word-settings').classList.toggle('hidden', state.mode !== 'words');

            resetTest();
        });
    });

    // Time pills
    $$('#time-pills .pill').forEach(pill => {
        pill.addEventListener('click', () => {
            $$('#time-pills .pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            state.duration = parseInt(pill.dataset.time);
            state.practiceMode = false;
            resetTest();
        });
    });

    // Word pills
    $$('#word-pills .pill').forEach(pill => {
        pill.addEventListener('click', () => {
            $$('#word-pills .pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            state.wordCount = parseInt(pill.dataset.words);
            state.practiceMode = false;
            resetTest();
        });
    });

    // Difficulty pills
    $$('#diff-pills .pill').forEach(pill => {
        pill.addEventListener('click', () => {
            $$('#diff-pills .pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            state.difficulty = pill.dataset.diff;
            state.practiceMode = false;
            resetTest();
        });
    });

    // Typing container focus
    els.container.addEventListener('click', () => {
        els.input.focus();
    });

    els.input.addEventListener('focus', () => {
        els.container.classList.add('focused');
        els.focusHint.classList.add('hidden');
        updateCaret();
    });

    els.input.addEventListener('blur', () => {
        if (!state.isRunning) {
            els.container.classList.remove('focused');
            if (state.charIndex === 0) {
                els.focusHint.classList.remove('hidden');
            }
        }
    });

    // Typing input
    els.input.addEventListener('input', handleInput);

    // Prevent paste
    els.input.addEventListener('paste', (e) => e.preventDefault());

    // Restart
    $('#btn-restart').addEventListener('click', () => resetTest(false));
    $('#btn-new-text').addEventListener('click', () => resetTest(true));
    $('#btn-retry').addEventListener('click', () => resetTest(true));

    // Start a practice drill built from all-time weak points
    els.btnStartPractice.addEventListener('click', () => {
        if (!practiceStatsCache) return;
        const text = generatePracticeText(practiceStatsCache.charStats, practiceStatsCache.bigramStats, 40);
        if (!text) return;

        state.mode = 'words';
        state.practiceMode = true;
        state.practiceText = text;

        $$('#mode-pills .pill').forEach(p => p.classList.toggle('active', p.dataset.mode === 'words'));
        $('#time-settings').classList.add('hidden');
        $('#word-settings').classList.remove('hidden');

        switchSection('test');
        resetTest(true);
        els.container.click();
    });

    // Save to leaderboard
    $('#btn-save-score').addEventListener('click', () => {
        els.saveModal.classList.remove('hidden');
        els.playerName.focus();

        // Pre-fill with last used name
        const lastName = localStorage.getItem('typerush-lastname');
        if (lastName) els.playerName.value = lastName;
    });

    $('#btn-confirm-save').addEventListener('click', () => {
        const name = els.playerName.value.trim();
        if (!name) {
            els.playerName.classList.add('shake');
            setTimeout(() => els.playerName.classList.remove('shake'), 300);
            return;
        }
        localStorage.setItem('typerush-lastname', name);
        const mins = state.elapsed / 60;
        const wpm = mins > 0 ? Math.round((state.correctChars / 5) / mins) : 0;
        const rawWpm = mins > 0 ? Math.round((state.totalKeystrokes / 5) / mins) : 0;
        const total = state.correctChars + state.incorrectChars;
        const accuracy = total > 0 ? Math.round((state.correctChars / total) * 100) : 100;
        addToLeaderboard(name, wpm, rawWpm, accuracy, state.mode, state.difficulty);
        els.saveModal.classList.add('hidden');
    });

    $('#btn-cancel-save').addEventListener('click', () => {
        els.saveModal.classList.add('hidden');
    });

    els.playerName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') $('#btn-confirm-save').click();
        if (e.key === 'Escape') $('#btn-cancel-save').click();
    });

    // Leaderboard filters
    $$('#lb-filter-pills .pill').forEach(pill => {
        pill.addEventListener('click', () => {
            $$('#lb-filter-pills .pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            renderLeaderboard(pill.dataset.filter);
        });
    });

    // Leaderboard delete
    els.leaderboardBody.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete-btn');
        if (btn) {
            deleteFromLeaderboard(parseInt(btn.dataset.id));
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Tab + Enter to restart
        if (e.key === 'Tab' && !state.isRunning) {
            e.preventDefault();
            resetTest(true);
            els.input.focus();
        }

        // Escape to reset
        if (e.key === 'Escape') {
            if (!els.saveModal.classList.contains('hidden')) {
                els.saveModal.classList.add('hidden');
            } else {
                resetTest(true);
            }
        }

        // Focus input when typing starts (if on test section)
        if ($('#section-test').classList.contains('active') &&
            !state.isFinished &&
            !e.ctrlKey && !e.altKey && !e.metaKey &&
            e.key.length === 1 &&
            document.activeElement !== els.input &&
            document.activeElement !== els.playerName) {
            els.input.focus();
        }
    });
}

// ========== INIT ==========
function init() {
    applyTheme(state.theme);
    initParticles();
    initEvents();
    resetTest();
}

document.addEventListener('DOMContentLoaded', init);
