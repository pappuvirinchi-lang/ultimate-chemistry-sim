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
const liquidButtons = document.querySelectorAll('.liquid-btn');
const reactBtn = document.getElementById('react-btn');
const metalPiece = document.getElementById('metal-piece');
const reactionEquation = document.getElementById('reaction-equation');
const blastFlash = document.getElementById('blast-flash');
const reactionArena = document.getElementById('reaction-arena');
const screenCracks = document.getElementById('screen-cracks');
const siteWrapper = document.getElementById('site-wrapper');
const liquidPool = document.getElementById('liquid-pool');
const explosionCanvas = document.getElementById('explosion-canvas');
const ctx = explosionCanvas.getContext('2d');

let activeMetal = 'Li';
let activeLevel = 'medium';
let activeLiquid = 'water';

const metalData = {
    Li: { name: 'Lithium', valency: 1, baseLevel: 1, color: '#ff3366', soundGain: 0.45, boomFreq: 140, particleCount: 60 },
    Na: { name: 'Sodium', valency: 1, baseLevel: 2, color: '#ffaa00', soundGain: 0.75, boomFreq: 110, particleCount: 110 },
    K:  { name: 'Potassium', valency: 1, baseLevel: 3, color: '#cc66ff', soundGain: 1.15, boomFreq: 85, particleCount: 180 },
    Rb: { name: 'Rubidium', valency: 1, baseLevel: 4, color: '#ff2200', soundGain: 1.65, boomFreq: 60, particleCount: 280 },
    Cs: { name: 'Caesium', valency: 1, baseLevel: 5, color: '#00e5ff', soundGain: 2.35, boomFreq: 45, particleCount: 400 },
    Fr: { name: 'Francium', valency: 1, baseLevel: 6, color: '#39ff14', soundGain: 3.4, boomFreq: 30, particleCount: 650 }
};

const liquidData = {
    water: {
        name: 'Water',
        formulaName: 'H2O',
        colorGrad: 'linear-gradient(180deg, rgba(0, 180, 255, 0.6) 0%, rgba(0, 90, 200, 0.85) 100%)',
        borderColor: 'rgba(0, 240, 255, 0.5)',
        glowColor: 'rgba(0, 240, 255, 0.35)',
        soundMult: 1.0,
        shakeOffset: 0,
        allMushroom: false,
        allCracks: false,
        desc: 'Water Basin standard reaction'
    },
    acetic: {
        name: 'Acetic Acid',
        formulaName: 'CH3COOH',
        colorGrad: 'linear-gradient(180deg, rgba(220, 240, 180, 0.7) 0%, rgba(160, 200, 100, 0.9) 100%)',
        borderColor: 'rgba(180, 240, 100, 0.6)',
        glowColor: 'rgba(180, 240, 100, 0.4)',
        soundMult: 1.45,
        shakeOffset: 1, // Stronger shake
        allMushroom: false,
        allCracks: false,
        desc: 'Exothermic Acetate formation with boosted shockwave'
    },
    sulfuric: {
        name: 'Sulfuric Acid 98%',
        formulaName: 'H2SO4',
        colorGrad: 'linear-gradient(180deg, rgba(255, 170, 0, 0.75) 0%, rgba(200, 70, 0, 0.92) 100%)',
        borderColor: 'rgba(255, 150, 0, 0.8)',
        glowColor: 'rgba(255, 120, 0, 0.55)',
        soundMult: 2.2,
        shakeOffset: 2, // Absolutely insane shake!
        allMushroom: false,
        allCracks: false,
        desc: 'Violent dehydrating acidolysis detonation'
    },
    triflic: {
        name: 'Triflic Acid',
        formulaName: 'CF3SO3H',
        colorGrad: 'linear-gradient(180deg, rgba(200, 0, 255, 0.75) 0%, rgba(100, 0, 220, 0.95) 100%)',
        borderColor: 'rgba(210, 0, 255, 0.85)',
        glowColor: 'rgba(200, 0, 255, 0.6)',
        soundMult: 3.2,
        shakeOffset: 3, // Even more insane than H2SO4, ALL 6 metals spawn mushroom clouds!
        allMushroom: true,
        allCracks: false,
        desc: 'Superacid ionization: ALL 6 alkali metals trigger massive mushroom clouds!'
    },
    hsbf6: {
        name: 'Fluoroantimonic Acid',
        formulaName: 'HSbF6',
        colorGrad: 'linear-gradient(180deg, rgba(255, 0, 85, 0.85) 0%, rgba(60, 0, 30, 0.98) 100%)',
        borderColor: 'rgba(255, 0, 85, 0.95)',
        glowColor: 'rgba(255, 0, 85, 0.75)',
        soundMult: 4.5, // Insanely loud!
        shakeOffset: 4, // Stronger shake than triflic acid
        allMushroom: true,
        allCracks: true, // ALL metals have screen cracks scaled by size!
        desc: 'Strongest superacid known: universal screen-shattering blast & cataclysmic shockwaves!'
    }
};

const shakeTiers = ['medium', 'large', 'giant', 'insane', 'almost-nuclear', 'nuclear', 'hyper-nuclear', 'cataclysmic', 'apocalyptic'];

function getReactionDetails(metalKey, liquidKey) {
    const m = metalData[metalKey];
    const l = liquidData[liquidKey];

    // Compute shake tier (clamped to max tier)
    const tierIndex = Math.min(shakeTiers.length - 1, (m.baseLevel - 1) + l.shakeOffset);
    const shakeLevel = shakeTiers[tierIndex];

    // Sound gain & frequency
    const soundGain = m.soundGain * l.soundMult;
    const boomFreq = Math.max(20, m.boomFreq - (l.shakeOffset * 6));

    // Mushroom cloud decision:
    // For water & acetic & sulfuric: Rb, Cs, Fr have mushroom cloud
    // For triflic & hsbf6: ALL 6 alkali metals have mushroom cloud!
    const hasMushroom = l.allMushroom || (metalKey === 'Rb' || metalKey === 'Cs' || metalKey === 'Fr');

    // Screen cracks decision:
    // For HSbF6: ALL metals trigger screen cracks (intensity 1 to 6 based on metal size)
    // For other liquids: Francium triggers screen cracks (intensity 6)
    let crackTier = 0;
    if (liquidKey === 'hsbf6') {
        crackTier = m.baseLevel; // Li=1, Na=2, K=3, Rb=4, Cs=5, Fr=6
    } else if (metalKey === 'Fr') {
        crackTier = 6;
    }

    return {
        shakeLevel,
        soundGain,
        boomFreq,
        hasMushroom,
        crackTier,
        isNuclearTint: metalKey === 'Fr' || liquidKey === 'hsbf6'
    };
}

function updateReactionEquation() {
    const m = metalData[activeMetal];
    const l = liquidData[activeLiquid];
    let eq = '';

    if (activeLiquid === 'water') {
        eq = `2${activeMetal} + 2H<sub>2</sub>O &rarr; 2${activeMetal}OH + H<sub>2</sub>&uarr; + <strong>Exothermic Blast!</strong>`;
    } else if (activeLiquid === 'acetic') {
        eq = `2${activeMetal} + 2CH<sub>3</sub>COOH &rarr; 2CH<sub>3</sub>COO${activeMetal} + H<sub>2</sub>&uarr; + <strong>Violent Acetate Shock!</strong>`;
    } else if (activeLiquid === 'sulfuric') {
        eq = `2${activeMetal} + H<sub>2</sub>SO<sub>4</sub> (98%) &rarr; ${activeMetal}<sub>2</sub>SO<sub>4</sub> + H<sub>2</sub>&uarr; + <strong>Insane Thermal Detonation!</strong>`;
    } else if (activeLiquid === 'triflic') {
        eq = `2${activeMetal} + 2CF<sub>3</sub>SO<sub>3</sub>H &rarr; 2${activeMetal}CF<sub>3</sub>SO<sub>3</sub> + H<sub>2</sub>&uarr; + <strong>☢️ Superacid Mushroom Cloud!</strong>`;
    } else if (activeLiquid === 'hsbf6') {
        eq = `2${activeMetal} + 2HSbF<sub>6</sub> &rarr; 2${activeMetal}SbF<sub>6</sub> + H<sub>2</sub>&uarr; + <strong>⚡ CATACLYSMIC SCREEN-SHATTERING SUPERDETONATION!</strong>`;
    }

    reactionEquation.innerHTML = eq;
    reactBtn.innerHTML = `🔥 React ${m.name} with ${l.name}!`;

    // Update liquid basin appearance
    if (liquidPool) {
        liquidPool.style.background = l.colorGrad;
        liquidPool.style.borderColor = l.borderColor;
        liquidPool.style.boxShadow = `inset 0 10px 25px ${l.glowColor}, 0 0 35px ${l.glowColor}`;
    }
}

// Handle Metal Selection
metalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        metalButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeMetal = btn.getAttribute('data-metal');
        metalPiece.textContent = activeMetal;
        updateReactionEquation();
        metalPiece.style.transform = 'translateY(0) rotate(0deg)';
    });
});

// Handle Liquid Selection
liquidButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        liquidButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeLiquid = btn.getAttribute('data-liquid');
        updateReactionEquation();
    });
});
updateReactionEquation();

// Resize Canvas
function resizeExplosionCanvas() {
    if (explosionCanvas) {
        explosionCanvas.width = explosionCanvas.offsetWidth;
        explosionCanvas.height = explosionCanvas.offsetHeight;
    }
}
window.addEventListener('resize', resizeExplosionCanvas);
resizeExplosionCanvas();

// Web Audio API procedural sound synthesizer for realistic explosion sounds
let audioCtx = null;
function playExplosionSound(metalKey, liquidKey) {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const details = getReactionDetails(metalKey, liquidKey);
        const data = metalData[metalKey];
        const now = audioCtx.currentTime;
        // Escalating rumble duration for higher shake tiers
        const tierIndex = shakeTiers.indexOf(details.shakeLevel);
        const duration = 1.4 + (tierIndex * 0.35);

        // 1. Synthesize sub-bass rumble
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(details.boomFreq * 1.5, now);
        osc.frequency.exponentialRampToValueAtTime(15, now + duration);

        // Clamp soundGain to prevent browser distortion clipping issues while delivering intense impact
        const clampedOscGain = Math.min(2.5, details.soundGain * 0.85);
        oscGain.gain.setValueAtTime(clampedOscGain, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(oscGain);
        oscGain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + duration);

        // 2. Synthesize bursting noise shockwave buffer
        const bufferSize = Math.floor(audioCtx.sampleRate * duration);
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800 + tierIndex * 150, now);
        filter.frequency.linearRampToValueAtTime(50, now + duration);

        const noiseGain = audioCtx.createGain();
        const clampedNoiseGain = Math.min(3.2, details.soundGain * 1.15);
        noiseGain.gain.setValueAtTime(clampedNoiseGain, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.9);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);

        whiteNoise.start(now);
        whiteNoise.stop(now + duration);

        // Screen Crack Glass-Shatter Sound Effect (When crackTier > 0)
        if (details.crackTier > 0) {
            const crackCount = details.crackTier;
            for (let c = 0; c < Math.min(crackCount, 4); c++) {
                const crackOffset = c * 0.04;
                const crackOsc = audioCtx.createOscillator();
                const crackGain = audioCtx.createGain();
                crackOsc.type = 'sawtooth';
                crackOsc.frequency.setValueAtTime(2200 + Math.random() * 800, now + crackOffset);
                crackOsc.frequency.exponentialRampToValueAtTime(300, now + crackOffset + 0.25);
                crackGain.gain.setValueAtTime(Math.min(1.2, 0.4 + details.crackTier * 0.12), now + crackOffset);
                crackGain.gain.exponentialRampToValueAtTime(0.001, now + crackOffset + 0.25);
                crackOsc.connect(crackGain);
                crackGain.connect(audioCtx.destination);
                crackOsc.start(now + crackOffset);
                crackOsc.stop(now + crackOffset + 0.25);
            }
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
    constructor(originX, originY, color, metalKey, liquidKey) {
        this.originX = originX;
        this.originY = originY;
        this.metalKey = metalKey;
        this.liquidKey = liquidKey;
        this.color = color;
        this.isNuclear = metalKey === 'Fr' || liquidKey === 'hsbf6';
        this.cloudParticles = [];
        this.torusRadius = 0;
        
        // Dynamic scale based on metal & liquid pairing
        let scaleBase = 220;
        if (metalKey === 'Fr') scaleBase = 380;
        else if (metalKey === 'Cs') scaleBase = 320;
        else if (metalKey === 'Rb') scaleBase = 270;
        else if (metalKey === 'K') scaleBase = 240;
        else if (metalKey === 'Na') scaleBase = 210;
        else scaleBase = 180;

        if (liquidKey === 'hsbf6') scaleBase *= 1.35;
        else if (liquidKey === 'triflic') scaleBase *= 1.2;

        this.maxTorusRadius = scaleBase;
        this.stemHeight = 0;
        this.targetStemHeight = scaleBase * 0.95;
        this.alpha = 1.0;
        this.stemPuffs = [];
        this.capPuffs = [];

        // Pre-seed cap puffs that expand into the characteristic curling mushroom head
        const capPuffCount = Math.min(150, Math.floor(scaleBase * 0.38));
        for (let i = 0; i < capPuffCount; i++) {
            const angle = (Math.PI * 2 / capPuffCount) * i + (Math.random() - 0.5) * 0.35;
            let puffColor;
            if (this.isNuclear) {
                // Intense radioactive green tints for Francium or HSbF6
                const greenPalette = ['#39ff14', '#00ff66', '#76ff03', '#b2ff59', '#10e050', '#ffffff', '#004d1a', '#ff0055'];
                puffColor = greenPalette[Math.floor(Math.random() * greenPalette.length)];
            } else if (liquidKey === 'triflic') {
                const triflicPalette = ['#d500f9', '#aa00ff', '#e040fb', '#ffffff', color];
                puffColor = triflicPalette[Math.floor(Math.random() * triflicPalette.length)];
            } else {
                puffColor = Math.random() > 0.35 ? color : (Math.random() > 0.5 ? '#ffeedd' : '#ff5500');
            }

            this.capPuffs.push({
                angle: angle,
                dist: Math.random() * 20,
                targetDist: (Math.random() * 0.75 + 0.45) * this.maxTorusRadius,
                yOffset: (Math.random() - 0.5) * 35,
                radius: (Math.random() * 32 + 25) * (this.isNuclear ? 1.35 : 1.15),
                color: puffColor,
                rotSpeed: (Math.random() - 0.5) * 0.02
            });
        }
    }

    update() {
        // Rise stem upward with powerful convective surge
        if (this.stemHeight < this.targetStemHeight) {
            this.stemHeight += (this.targetStemHeight - this.stemHeight) * 0.08;
            
            // Add billowing stem puffs while rising
            if (Math.random() < 0.9) {
                let stemColor;
                if (this.isNuclear) {
                    const greenStem = ['#39ff14', '#00ff88', '#2e7d32', '#76ff03', '#ffffff', '#ff0055'];
                    stemColor = greenStem[Math.floor(Math.random() * greenStem.length)];
                } else if (this.liquidKey === 'triflic') {
                    stemColor = Math.random() > 0.3 ? '#aa00ff' : this.color;
                } else {
                    stemColor = Math.random() > 0.3 ? this.color : '#ffaa33';
                }

                this.stemPuffs.push({
                    x: this.originX + (Math.random() - 0.5) * (this.isNuclear ? 65 : 45),
                    y: this.originY - this.stemHeight + (Math.random() - 0.5) * 20,
                    radius: Math.random() * 24 + 16,
                    maxRadius: Math.random() * 45 + 30,
                    alpha: 0.95,
                    color: stemColor
                });
            }
        }

        // Expand torus mushroom cap sideways and roll vortex edges downward
        if (this.torusRadius < this.maxTorusRadius) {
            this.torusRadius += (this.maxTorusRadius - this.torusRadius) * 0.06;
        }

        // Update stem puffs
        for (let puff of this.stemPuffs) {
            if (puff.radius < puff.maxRadius) puff.radius += 0.4;
            puff.y -= 0.5; // thermal convective rise
        }

        // Update torus cap puffs
        for (let cap of this.capPuffs) {
            if (cap.dist < cap.targetDist) {
                cap.dist += (cap.targetDist - cap.dist) * 0.05;
            }
            cap.angle += cap.rotSpeed;
        }

        // Slow cinematic smoke dispersal
        if (this.torusRadius > this.maxTorusRadius * 0.85) {
            this.alpha -= 0.007;
        }
    }

    draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);

        // 1. Draw rising fire/smoke column stem
        for (let puff of this.stemPuffs) {
            ctx.fillStyle = puff.color;
            ctx.shadowBlur = this.isNuclear ? 25 : 15;
            ctx.shadowColor = puff.color;
            ctx.beginPath();
            ctx.arc(puff.x, puff.y, puff.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        const capY = this.originY - this.stemHeight;

        // 2. Draw curling mushroom torus cap puffs
        for (let cap of this.capPuffs) {
            const px = this.originX + Math.cos(cap.angle) * cap.dist;
            // Elliptical downward flare simulating toroidal vortex roll
            const py = capY + Math.sin(cap.angle) * (cap.dist * 0.35) + cap.yOffset;
            ctx.fillStyle = cap.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = cap.color;
            ctx.beginPath();
            ctx.arc(px, py, cap.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3. Central dense core fireball cap
        const coreGradient = ctx.createRadialGradient(
            this.originX, capY, 10,
            this.originX, capY, this.torusRadius * 0.85
        );
        if (this.isNuclear) {
            coreGradient.addColorStop(0, '#ffffff');
            coreGradient.addColorStop(0.3, '#39ff14');
            coreGradient.addColorStop(0.7, '#00ff88');
            coreGradient.addColorStop(1, 'rgba(0, 50, 20, 0)');
        } else if (this.liquidKey === 'triflic') {
            coreGradient.addColorStop(0, '#ffffff');
            coreGradient.addColorStop(0.35, '#d500f9');
            coreGradient.addColorStop(0.75, '#6200ea');
            coreGradient.addColorStop(1, 'rgba(40, 0, 80, 0)');
        } else {
            coreGradient.addColorStop(0, '#ffffff');
            coreGradient.addColorStop(0.3, this.color);
            coreGradient.addColorStop(0.7, '#ff3300');
            coreGradient.addColorStop(1, 'rgba(255, 60, 0, 0)');
        }

        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.ellipse(this.originX, capY, this.torusRadius * 0.85, this.torusRadius * 0.48, 0, 0, Math.PI * 2);
        ctx.fill();

        // 4. Wilson Shockwave Condensation Rings (Atmospheric ionization blast rings)
        ctx.strokeStyle = this.isNuclear ? 'rgba(57, 255, 20, 0.85)' : (this.liquidKey === 'triflic' ? 'rgba(224, 64, 251, 0.85)' : 'rgba(255, 255, 255, 0.75)');
        ctx.lineWidth = this.isNuclear ? 4.5 : 3;
        ctx.shadowBlur = this.isNuclear ? 25 : 15;
        ctx.shadowColor = this.isNuclear ? '#00ff66' : (this.liquidKey === 'triflic' ? '#e040fb' : '#ffffff');
        ctx.beginPath();
        ctx.ellipse(this.originX, capY + 20, this.torusRadius * 1.3, 30, 0, 0, Math.PI * 2);
        ctx.stroke();

        if (this.isNuclear) {
            // Secondary ionization shock ring
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.ellipse(this.originX, capY + 45, this.torusRadius * 1.5, 38, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

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
    const details = getReactionDetails(activeMetal, activeLiquid);

    // 1. Drop metal into liquid basin
    metalPiece.style.transition = 'transform 0.45s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
    metalPiece.style.transform = 'translateY(160px) rotate(180deg)';

    setTimeout(() => {
        // 2. Play escalating realistic explosion sound
        playExplosionSound(activeMetal, activeLiquid);

        // 3. Flash effect matching metal/liquid pairing
        if (details.isNuclearTint) {
            blastFlash.style.background = 'radial-gradient(circle at 50% 50%, #ffffff 0%, #39ff14 70%, #00e676 100%)';
            blastFlash.style.opacity = '1';
        } else if (activeLiquid === 'triflic') {
            blastFlash.style.background = 'radial-gradient(circle at 50% 50%, #ffffff 0%, #d500f9 70%, #651fff 100%)';
            blastFlash.style.opacity = '0.95';
        } else if (activeLiquid === 'sulfuric') {
            blastFlash.style.background = 'radial-gradient(circle at 50% 50%, #ffffff 0%, #ff6d00 75%, #d50000 100%)';
            blastFlash.style.opacity = '0.9';
        } else {
            blastFlash.style.background = '#ffffff';
            blastFlash.style.opacity = activeMetal === 'Cs' ? '0.85' : '0.6';
        }
        setTimeout(() => {
            blastFlash.style.opacity = '0';
        }, 130);

        // 4. Violent screen shake & Instant Screen Shatter
        const shakeTarget = siteWrapper || document.body;
        shakeTarget.className = siteWrapper ? 'site-wrapper' : '';
        document.body.className = '';
        void shakeTarget.offsetWidth; // Force reflow
        shakeTarget.classList.add(`shake-${details.shakeLevel}`);

        // Screen Cracks: Trigger instantaneously at exact onset of shaking if crackTier > 0!
        if (details.crackTier > 0) {
            screenCracks.setAttribute('data-crack-tier', details.crackTier);
            screenCracks.classList.add('active');
        }

        // 5. Spawn burst particles
        resizeExplosionCanvas();
        const arenaRect = reactionArena ? reactionArena.getBoundingClientRect() : { width: 900, height: 420 };
        const canvasRect = explosionCanvas.getBoundingClientRect();
        // Exact flask center inside canvas coordinate system
        const originX = (arenaRect.left + arenaRect.width / 2) - canvasRect.left;
        const originY = (arenaRect.bottom - 75) - canvasRect.top;
        
        let speedMult = 1.4;
        if (details.shakeLevel === 'apocalyptic') speedMult = 3.8;
        else if (details.shakeLevel === 'cataclysmic') speedMult = 3.3;
        else if (details.shakeLevel === 'hyper-nuclear') speedMult = 2.9;
        else if (activeMetal === 'Fr') speedMult = 2.8;
        else if (activeMetal === 'Cs') speedMult = 2.2;

        const totalParticles = Math.floor(data.particleCount * (1 + (shakeTiers.indexOf(details.shakeLevel) * 0.18)));
        for (let i = 0; i < totalParticles; i++) {
            particles.push(new BlastParticle(originX, originY, data.color, speedMult));
            if (i % 2 === 0) {
                const particleTint = details.isNuclearTint ? '#76ff03' : (activeLiquid === 'triflic' ? '#e040fb' : '#ffffff');
                particles.push(new BlastParticle(originX, originY, particleTint, speedMult * 0.9));
            }
        }

        // 6. Mushroom Cloud: Rb, Cs, Fr for normal liquids; ALL 6 metals for Triflic & HSbF6!
        if (details.hasMushroom) {
            mushroomClouds.push(new MushroomCloud(originX, originY, data.color, activeMetal, activeLiquid));
        }

        animateParticles();

        // 7. Reset screen and fade cracks once the damped shake oscillation completes smoothly
        // Higher tiers have longer natural decay oscillations (3.5s to 4.2s)
        const settleTime = details.shakeLevel === 'apocalyptic' || details.shakeLevel === 'cataclysmic' ? 4200 : (activeMetal === 'Fr' ? 3550 : 2500);

        setTimeout(() => {
            shakeTarget.className = siteWrapper ? 'site-wrapper' : '';
            document.body.className = '';
            if (details.crackTier > 0) {
                // Dissolve cracks only after the screen is completely at rest
                screenCracks.classList.remove('active');
                setTimeout(() => {
                    screenCracks.removeAttribute('data-crack-tier');
                }, 600);
            }
        }, settleTime);

        // 8. Reset metal piece and controls after full event completes
        setTimeout(() => {
            metalPiece.style.transition = 'none';
            metalPiece.style.transform = 'translateY(0) rotate(0deg)';
            isReacting = false;
            reactBtn.disabled = false;
            reactBtn.style.opacity = '1';
        }, settleTime + 100);

    }, 450);
});
