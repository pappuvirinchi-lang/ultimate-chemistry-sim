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
let mushroomClouds = [];

class BlastParticle {
    constructor(x, y, color, speedMultiplier) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 8 + 3) * speedMultiplier;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - Math.random() * 5;
        this.color = color;
        this.radius = Math.random() * 6 + 3;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.012;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.12; // gravity
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

// Specialized High-Yield Mushroom Cloud Simulation
class MushroomCloud {
    constructor(originX, originY, color, isNuclear) {
        this.originX = originX;
        this.originY = originY;
        this.color = color;
        this.isNuclear = isNuclear;
        this.cloudParticles = [];
        this.torusRadius = 0;
        this.maxTorusRadius = isNuclear ? 220 : 160;
        this.stemHeight = 0;
        this.targetStemHeight = isNuclear ? 260 : 190;
        this.alpha = 1.0;
        this.stemPuffs = [];
        this.capPuffs = [];

        // Pre-seed cap puffs that expand into the characteristic curling mushroom head
        const capPuffCount = isNuclear ? 90 : 60;
        for (let i = 0; i < capPuffCount; i++) {
            const angle = (Math.PI * 2 / capPuffCount) * i + (Math.random() - 0.5) * 0.3;
            this.capPuffs.push({
                angle: angle,
                dist: Math.random() * 15,
                targetDist: (Math.random() * 0.7 + 0.5) * this.maxTorusRadius,
                yOffset: (Math.random() - 0.5) * 20,
                radius: Math.random() * 25 + 18,
                growth: Math.random() * 0.4 + 0.3,
                color: Math.random() > 0.4 ? color : (Math.random() > 0.5 ? '#ffeedd' : '#ff4400'),
                rotSpeed: (Math.random() - 0.5) * 0.02
            });
        }
    }

    update() {
        // Rise stem upward
        if (this.stemHeight < this.targetStemHeight) {
            this.stemHeight += (this.targetStemHeight - this.stemHeight) * 0.07;
            
            // Add billowing stem puffs while rising
            if (Math.random() < 0.8) {
                this.stemPuffs.push({
                    x: this.originX + (Math.random() - 0.5) * 35,
                    y: this.originY - this.stemHeight + (Math.random() - 0.5) * 15,
                    radius: Math.random() * 18 + 12,
                    maxRadius: Math.random() * 32 + 20,
                    alpha: 0.9,
                    color: Math.random() > 0.3 ? this.color : '#ffaa33'
                });
            }
        }

        // Expand torus mushroom cap sideways and roll vortex edges downward
        if (this.torusRadius < this.maxTorusRadius) {
            this.torusRadius += (this.maxTorusRadius - this.torusRadius) * 0.05;
        }

        // Update stem puffs
        for (let puff of this.stemPuffs) {
            if (puff.radius < puff.maxRadius) puff.radius += 0.3;
            puff.y -= 0.4; // gentle thermal convection
        }

        // Dissipation
        if (this.stemHeight >= this.targetStemHeight * 0.85) {
            this.alpha -= 0.008;
        }
    }

    draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);

        const capY = this.originY - this.stemHeight;

        // 1. Draw Rising Central Stem / Column
        const stemGrad = ctx.createLinearGradient(this.originX - 25, this.originY, this.originX + 25, capY);
        stemGrad.addColorStop(0, 'rgba(255, 120, 0, 0.85)');
        stemGrad.addColorStop(0.5, this.color);
        stemGrad.addColorStop(1, '#ffffff');

        // Draw stem puffs
        for (let p of this.stemPuffs) {
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = p.color;
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // 2. Draw Mushroom Condensation Ring / Torus Head
        for (let cp of this.capPuffs) {
            const curDist = (this.torusRadius / this.maxTorusRadius) * cp.targetDist;
            const px = this.originX + Math.cos(cp.angle) * curDist;
            // Curling downward at the rim (vortex effect)
            const py = capY + cp.yOffset + Math.sin(curDist * 0.05) * 18;

            ctx.beginPath();
            ctx.fillStyle = cp.color;
            ctx.shadowBlur = 25;
            ctx.shadowColor = cp.color;
            ctx.arc(px, py, cp.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3. Central Cap Fireball Core (Intense nuclear luminescence)
        const coreGrad = ctx.createRadialGradient(this.originX, capY, 10, this.originX, capY, this.torusRadius * 0.6);
        coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        coreGrad.addColorStop(0.3, this.color);
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.ellipse(this.originX, capY, this.torusRadius * 0.8, this.torusRadius * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // 4. Wilson Shockwave Condensation Rings (Nuclear Rb/Cs/Fr feature)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(this.originX, capY + 15, this.torusRadius * 1.25, 22, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, explosionCanvas.width, explosionCanvas.height);

    // Update & draw mushroom clouds
    for (let m = mushroomClouds.length - 1; m >= 0; m--) {
        mushroomClouds[m].update();
        mushroomClouds[m].draw(ctx);
        if (mushroomClouds[m].alpha <= 0) {
            mushroomClouds.splice(m, 1);
        }
    }

    // Update & draw debris particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    if (particles.length > 0 || mushroomClouds.length > 0) {
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

        // 4. Violent screen shake & Instant Screen Shatter
        document.body.className = ''; // Reset any previous shake
        void document.body.offsetWidth; // Force reflow
        document.body.classList.add(`shake-${data.level}`);

        // Francium Screen Cracks: Shatter violently the exact millisecond screen begins shaking!
        if (activeMetal === 'Fr') {
            screenCracks.classList.add('active');
        }

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

        // 6. Authentic Mushroom Cloud for the last three alkali metals (Rb, Cs, Fr)
        if (activeMetal === 'Rb' || activeMetal === 'Cs' || activeMetal === 'Fr') {
            const isNuclear = activeMetal === 'Fr';
            mushroomClouds.push(new MushroomCloud(originX, originY, data.color, isNuclear));
        }

        animateParticles();

        // 7. Reset screen and fade cracks once the natural damped oscillation finishes
        // Francium shake is 3.5s of smooth physical decaying oscillation right into rest (0, 0)
        setTimeout(() => {
            document.body.className = ''; // Screen naturally settled to resting position
            if (activeMetal === 'Fr') {
                // Dissolve cracks only after the screen is completely at rest
                screenCracks.classList.remove('active');
            }
        }, 3550);

        // 8. Reset metal piece and controls after full event completes
        setTimeout(() => {
            metalPiece.style.transition = 'none';
            metalPiece.style.transform = 'translateY(0) rotate(0deg)';
            isReacting = false;
            reactBtn.disabled = false;
            reactBtn.style.opacity = '1';
        }, 3600);

    }, 450);
});

