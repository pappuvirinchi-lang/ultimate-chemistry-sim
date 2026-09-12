document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Reviews System
const starRating = document.getElementById('star-rating');
const stars = starRating.querySelectorAll('span');
let currentRating = 0;

stars.forEach(star => {
    star.addEventListener('click', () => {
        currentRating = parseInt(star.getAttribute('data-value'));
        updateStars(currentRating);
    });
    
    star.addEventListener('mouseover', () => {
        updateStars(parseInt(star.getAttribute('data-value')));
    });
    
    star.addEventListener('mouseout', () => {
        updateStars(currentRating);
    });
});

function updateStars(rating) {
    stars.forEach(s => {
        if (parseInt(s.getAttribute('data-value')) <= rating) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
}

// Initial fake reviews
const defaultReviews = [
    { name: 'Alex M.', rating: 5, text: 'Absolutely incredible. Watching the VSEPR geometries snap into place in real-time is mind-blowing.' },
    { name: 'Sarah K.', rating: 5, text: 'The AI reaction predictor is a game changer for my chemistry homework!' }
];

function renderReviews() {
    const list = document.getElementById('reviews-list');
    list.innerHTML = '';
    
    // Load local storage reviews
    const savedReviews = JSON.parse(localStorage.getItem('chemSimReviews')) || [];
    const allReviews = [...savedReviews, ...defaultReviews];
    
    allReviews.forEach(rev => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-header">
                <span class="review-name">${rev.name}</span>
                <span class="review-stars">${'★'.repeat(rev.rating)}${'☆'.repeat(5-rev.rating)}</span>
            </div>
            <p class="review-text">${rev.text}</p>
        `;
        list.appendChild(card);
    });
}

document.getElementById('submit-review').addEventListener('click', () => {
    const name = document.getElementById('reviewer-name').value;
    const text = document.getElementById('review-text').value;
    
    if (!name || !text || currentRating === 0) {
        alert('Please provide a name, rating, and review text!');
        return;
    }
    
    const newReview = { name, rating: currentRating, text };
    const savedReviews = JSON.parse(localStorage.getItem('chemSimReviews')) || [];
    savedReviews.unshift(newReview);
    localStorage.setItem('chemSimReviews', JSON.stringify(savedReviews));
    
    document.getElementById('reviewer-name').value = '';
    document.getElementById('review-text').value = '';
    currentRating = 0;
    updateStars(0);
    
    renderReviews();
});

renderReviews();

// ----------------------------------------------------
// Alkali Metal + Water Explosion Minigame Engine
// ----------------------------------------------------
const metalButtons = document.querySelectorAll('.metal-btn');
const reactBtn = document.getElementById('react-btn');
const metalPiece = document.getElementById('metal-piece');
const reactionEquation = document.getElementById('reaction-equation');
const blastFlash = document.getElementById('blast-flash');
const screenCracks = document.getElementById('screen-cracks');
const explosionCanvas = document.getElementById('explosion-canvas');
const ctx = explosionCanvas.getContext('2d');

let activeMetal = 'Li';
let activeLevel = 'medium';

const metalData = {
    Li: { name: 'Lithium', level: 'medium', color: '#ff3366', formula: '2Li + 2H2O &rarr; 2LiOH + H2&uarr; + <strong>Heat & Pops</strong>', soundGain: 0.35, boomFreq: 140, blastRadius: 60, particleCount: 50 },
    Na: { name: 'Sodium', level: 'large', color: '#ffaa00', formula: '2Na + 2H2O &rarr; 2NaOH + H2&uarr; + <strong>Large Fireball</strong>', soundGain: 0.6, boomFreq: 110, blastRadius: 100, particleCount: 90 },
    K:  { name: 'Potassium', level: 'giant', color: '#cc66ff', formula: '2K + 2H2O &rarr; 2KOH + H2&uarr; + <strong>Giant Lilac Detonation</strong>', soundGain: 0.9, boomFreq: 85, blastRadius: 160, particleCount: 150 },
    Rb: { name: 'Rubidium', level: 'insane', color: '#ff2200', formula: '2Rb + 2H2O &rarr; 2RbOH + H2&uarr; + <strong>Insane Shockwave</strong>', soundGain: 1.3, boomFreq: 60, blastRadius: 240, particleCount: 240 },
    Cs: { name: 'Caesium', level: 'almost-nuclear', color: '#00e5ff', formula: '2Cs + 2H2O &rarr; 2CsOH + H2&uarr; + <strong>Almost Nuclear Blast</strong>', soundGain: 1.8, boomFreq: 45, blastRadius: 320, particleCount: 350 },
    Fr: { name: 'Francium', level: 'nuclear', color: '#39ff14', formula: '2Fr + 2H2O &rarr; 2FrOH + H2&uarr; + <strong>☢️ NUCLEAR SCREEN-CRACKING DETONATION!</strong>', soundGain: 2.6, boomFreq: 30, blastRadius: 450, particleCount: 550 }
};

// Handle Metal Selection
metalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        metalButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeMetal = btn.getAttribute('data-metal');
        activeLevel = btn.getAttribute('data-level');
        metalPiece.textContent = activeMetal;
        reactionEquation.innerHTML = metalData[activeMetal].formula;
        metalPiece.style.transform = 'translateY(0) rotate(0deg)';
    });
});

// Resize Canvas
function resizeExplosionCanvas() {
    if (explosionCanvas) {
        explosionCanvas.width = explosionCanvas.parentElement.clientWidth;
        explosionCanvas.height = explosionCanvas.parentElement.clientHeight;
    }
}
window.addEventListener('resize', resizeExplosionCanvas);
resizeExplosionCanvas();

// Web Audio API procedural sound synthesizer for realistic explosion sounds
let audioCtx = null;
function playExplosionSound(metalKey) {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const data = metalData[metalKey];
        const now = audioCtx.currentTime;
        const duration = metalKey === 'Fr' ? 3.5 : (metalKey === 'Cs' ? 2.5 : 1.6);

        // 1. Synthesize sub-bass rumble
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(data.boomFreq * 1.5, now);
        osc.frequency.exponentialRampToValueAtTime(20, now + duration);

        oscGain.gain.setValueAtTime(data.soundGain * 0.9, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(oscGain);
        oscGain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + duration);

        // 2. Synthesize bursting noise shockwave buffer
        const bufferSize = audioCtx.sampleRate * duration;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.linearRampToValueAtTime(60, now + duration);

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(data.soundGain * 1.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.9);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);

        whiteNoise.start(now);
        whiteNoise.stop(now + duration);

        // Francium Screen Crack Sound Effect
        if (metalKey === 'Fr') {
            const crackOsc = audioCtx.createOscillator();
            const crackGain = audioCtx.createGain();
            crackOsc.type = 'sawtooth';
            crackOsc.frequency.setValueAtTime(2500, now);
            crackOsc.frequency.exponentialRampToValueAtTime(400, now + 0.3);
            crackGain.gain.setValueAtTime(0.7, now);
            crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            crackOsc.connect(crackGain);
            crackGain.connect(audioCtx.destination);
            crackOsc.start(now);
            crackOsc.stop(now + 0.3);
        }
    } catch (e) {
        console.warn('Audio context error:', e);
    }
}

// Particle System
let particles = [];
class BlastParticle {
    constructor(x, y, color, speedMultiplier) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 8 + 3) * speedMultiplier;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - Math.random() * 4;
        this.color = color;
        this.radius = Math.random() * 5 + 2;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.15; // gravity
        this.alpha -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, explosionCanvas.width, explosionCanvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }
    if (particles.length > 0) {
        requestAnimationFrame(animateParticles);
    }
}

// Trigger Reaction
let isReacting = false;
reactBtn.addEventListener('click', () => {
    if (isReacting) return;
    isReacting = true;
    reactBtn.disabled = true;
    reactBtn.style.opacity = '0.6';

    const data = metalData[activeMetal];

    // 1. Drop metal into water
    metalPiece.style.transition = 'transform 0.45s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
    metalPiece.style.transform = 'translateY(160px) rotate(180deg)';

    setTimeout(() => {
        // 2. Play explosion sound
        playExplosionSound(activeMetal);

        // 3. Flash effect
        blastFlash.style.opacity = activeMetal === 'Fr' ? '1' : (activeMetal === 'Cs' ? '0.85' : '0.6');
        setTimeout(() => {
            blastFlash.style.opacity = '0';
        }, 120);

        // 4. Violent screen shake
        document.body.className = ''; // Reset any previous shake
        void document.body.offsetWidth; // Force reflow
        document.body.classList.add(`shake-${data.level}`);

        // 5. Spawn burst particles
        resizeExplosionCanvas();
        const originX = explosionCanvas.width / 2;
        const originY = explosionCanvas.height - 70;
        const speedMult = activeMetal === 'Fr' ? 2.5 : (activeMetal === 'Cs' ? 2.0 : 1.3);

        for (let i = 0; i < data.particleCount; i++) {
            particles.push(new BlastParticle(originX, originY, data.color, speedMult));
            if (i % 2 === 0) {
                particles.push(new BlastParticle(originX, originY, '#ffffff', speedMult * 0.9));
            }
        }
        animateParticles();

        // 6. Francium Screen Cracks: disappear after 3 seconds!
        if (activeMetal === 'Fr') {
            screenCracks.classList.add('active');
            setTimeout(() => {
                screenCracks.classList.remove('active');
            }, 3000);
        }

        // 7. Reset metal piece after blast
        setTimeout(() => {
            metalPiece.style.transition = 'none';
            metalPiece.style.transform = 'translateY(0) rotate(0deg)';
            document.body.className = '';
            isReacting = false;
            reactBtn.disabled = false;
            reactBtn.style.opacity = '1';
        }, 2200);

    }, 450);
});

