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

// ====================================================
// 1. Interactive 3D Molecule Canvas Engine (Hero Showcase)
// ====================================================
const heroMolCanvas = document.getElementById('hero-mol-canvas');
const heroCtx = heroMolCanvas ? heroMolCanvas.getContext('2d') : null;
const molChips = document.querySelectorAll('.mol-chip');
const molCaptionText = document.getElementById('mol-caption-text');

const moleculeModels = {
    hsbf6: {
        caption: 'Example molecule drawing of <strong>HSbF<sub>6</sub></strong> (fluoroantimonic acid) &bull; Octahedral geometry',
        atoms: [
            { elem: 'Sb', x: 0, y: 0, z: 0, r: 24, color: '#00e5ff', glow: '#00e5ff' },
            { elem: 'F', x: 80, y: 0, z: 0, r: 16, color: '#39ff14', glow: '#00ff88' },
            { elem: 'F', x: -80, y: 0, z: 0, r: 16, color: '#39ff14', glow: '#00ff88' },
            { elem: 'F', x: 0, y: 80, z: 0, r: 16, color: '#39ff14', glow: '#00ff88' },
            { elem: 'F', x: 0, y: -80, z: 0, r: 16, color: '#39ff14', glow: '#00ff88' },
            { elem: 'F', x: 0, y: 0, z: 80, r: 16, color: '#39ff14', glow: '#00ff88' },
            { elem: 'F', x: 0, y: 0, z: -80, r: 16, color: '#39ff14', glow: '#00ff88' },
            { elem: 'H', x: 120, y: 35, z: 0, r: 11, color: '#ffffff', glow: '#ffffff' }
        ],
        bonds: [
            [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 7]
        ]
    },
    water: {
        caption: 'Water <strong>H<sub>2</sub>O</strong> &bull; Bent VSEPR Geometry (104.5° bond angle)',
        atoms: [
            { elem: 'O', x: 0, y: -15, z: 0, r: 24, color: '#ff3366', glow: '#ff3366' },
            { elem: 'H', x: -65, y: 55, z: 0, r: 14, color: '#ffffff', glow: '#ffffff' },
            { elem: 'H', x: 65, y: 55, z: 0, r: 14, color: '#ffffff', glow: '#ffffff' }
        ],
        bonds: [
            [0, 1], [0, 2]
        ]
    },
    benzene: {
        caption: 'Benzene <strong>C<sub>6</sub>H<sub>6</sub></strong> &bull; Planar Aromatic Ring with Delocalized Pi-Electrons',
        atoms: [
            // Carbon Ring
            { elem: 'C', x: 0, y: -60, z: 0, r: 17, color: '#444c56', glow: '#00f0ff' },
            { elem: 'C', x: 52, y: -30, z: 0, r: 17, color: '#444c56', glow: '#00f0ff' },
            { elem: 'C', x: 52, y: 30, z: 0, r: 17, color: '#444c56', glow: '#00f0ff' },
            { elem: 'C', x: 0, y: 60, z: 0, r: 17, color: '#444c56', glow: '#00f0ff' },
            { elem: 'C', x: -52, y: 30, z: 0, r: 17, color: '#444c56', glow: '#00f0ff' },
            { elem: 'C', x: -52, y: -30, z: 0, r: 17, color: '#444c56', glow: '#00f0ff' },
            // Hydrogen atoms
            { elem: 'H', x: 0, y: -105, z: 0, r: 11, color: '#ffffff', glow: '#ffffff' },
            { elem: 'H', x: 92, y: -52, z: 0, r: 11, color: '#ffffff', glow: '#ffffff' },
            { elem: 'H', x: 92, y: 52, z: 0, r: 11, color: '#ffffff', glow: '#ffffff' },
            { elem: 'H', x: 0, y: 105, z: 0, r: 11, color: '#ffffff', glow: '#ffffff' },
            { elem: 'H', x: -92, y: 52, z: 0, r: 11, color: '#ffffff', glow: '#ffffff' },
            { elem: 'H', x: -92, y: -52, z: 0, r: 11, color: '#ffffff', glow: '#ffffff' }
        ],
        bonds: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
            [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]
        ]
    },
    methane: {
        caption: 'Methane <strong>CH<sub>4</sub></strong> &bull; Perfect Tetrahedral VSEPR Geometry (109.5° bond angles)',
        atoms: [
            { elem: 'C', x: 0, y: 0, z: 0, r: 22, color: '#444c56', glow: '#ffaa00' },
            { elem: 'H', x: 0, y: -80, z: 0, r: 13, color: '#ffffff', glow: '#ffffff' },
            { elem: 'H', x: 75, y: 35, z: 35, r: 13, color: '#ffffff', glow: '#ffffff' },
            { elem: 'H', x: -75, y: 35, z: 35, r: 13, color: '#ffffff', glow: '#ffffff' },
            { elem: 'H', x: 0, y: 35, z: -85, r: 13, color: '#ffffff', glow: '#ffffff' }
        ],
        bonds: [
            [0, 1], [0, 2], [0, 3], [0, 4]
        ]
    },
    caffeine: {
        caption: 'Caffeine <strong>C<sub>8</sub>H<sub>10</sub>N<sub>4</sub>O<sub>2</sub></strong> &bull; Central Nervous Stimulant Xanthine Core',
        atoms: [
            { elem: 'N', x: -35, y: -45, z: 0, r: 16, color: '#2979ff', glow: '#2979ff' },
            { elem: 'C', x: 15, y: -55, z: 0, r: 17, color: '#444c56', glow: '#00f0ff' },
            { elem: 'O', x: 35, y: -95, z: 0, r: 16, color: '#ff3366', glow: '#ff3366' },
            { elem: 'N', x: 50, y: -20, z: 0, r: 16, color: '#2979ff', glow: '#2979ff' },
            { elem: 'C', x: 35, y: 25, z: 0, r: 17, color: '#444c56', glow: '#00f0ff' },
            { elem: 'C', x: -15, y: 35, z: 0, r: 17, color: '#444c56', glow: '#00f0ff' },
            { elem: 'C', x: -50, y: 0, z: 0, r: 17, color: '#444c56', glow: '#00f0ff' },
            { elem: 'O', x: -95, y: 10, z: 0, r: 16, color: '#ff3366', glow: '#ff3366' },
            { elem: 'N', x: -15, y: 75, z: 0, r: 16, color: '#2979ff', glow: '#2979ff' },
            { elem: 'C', x: 35, y: 85, z: 0, r: 17, color: '#444c56', glow: '#00f0ff' },
            { elem: 'N', x: 65, y: 55, z: 0, r: 16, color: '#2979ff', glow: '#2979ff' }
        ],
        bonds: [
            [0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 0], [6, 7],
            [5, 8], [8, 9], [9, 10], [10, 4]
        ]
    }
};

let currentMolKey = 'hsbf6';
let rotX = 0.25;
let rotY = 0;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let autoSpin = true;

if (heroMolCanvas) {
    heroMolCanvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        autoSpin = false;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        rotY += dx * 0.012;
        rotX += dy * 0.012;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        setTimeout(() => { autoSpin = true; }, 2500);
    });

    // Touch support for mobile devices
    heroMolCanvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            autoSpin = false;
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - lastMouseX;
        const dy = e.touches[0].clientY - lastMouseY;
        rotY += dx * 0.012;
        rotX += dy * 0.012;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDragging = false;
        setTimeout(() => { autoSpin = true; }, 2500);
    });
}

// Molecule Chips selection
molChips.forEach(chip => {
    chip.addEventListener('click', () => {
        molChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentMolKey = chip.getAttribute('data-mol');
        if (moleculeModels[currentMolKey] && molCaptionText) {
            molCaptionText.innerHTML = moleculeModels[currentMolKey].caption;
        }
    });
});

function draw3DMolecule() {
    if (!heroCtx) return;
    const w = heroMolCanvas.width;
    const h = heroMolCanvas.height;
    heroCtx.clearRect(0, 0, w, h);

    if (autoSpin) {
        rotY += 0.015;
    }

    const model = moleculeModels[currentMolKey] || moleculeModels.hsbf6;
    const cx = w / 2;
    const cy = h / 2;
    const fov = 320;

    // Transform and project atoms in 3D
    const projectedAtoms = model.atoms.map((atom, index) => {
        // Rotate around Y-axis
        let x1 = atom.x * Math.cos(rotY) + atom.z * Math.sin(rotY);
        let z1 = -atom.x * Math.sin(rotY) + atom.z * Math.cos(rotY);

        // Rotate around X-axis
        let y2 = atom.y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = atom.y * Math.sin(rotX) + z1 * Math.cos(rotX);

        // Perspective scale
        const scale = fov / (fov + z2 + 100);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;
        const pr = Math.max(4, atom.r * scale);

        return {
            index,
            elem: atom.elem,
            color: atom.color,
            glow: atom.glow,
            px, py, pr,
            z: z2,
            scale
        };
    });

    // 1. Draw Bonds in 3D (Cylinder / Lines with depth)
    for (let bond of model.bonds) {
        const a1 = projectedAtoms[bond[0]];
        const a2 = projectedAtoms[bond[1]];
        if (!a1 || !a2) continue;

        const avgZ = (a1.z + a2.z) / 2;
        const bondAlpha = Math.max(0.3, Math.min(1, 1 - (avgZ / 250)));

        heroCtx.save();
        heroCtx.strokeStyle = `rgba(200, 225, 255, ${bondAlpha * 0.75})`;
        heroCtx.lineWidth = Math.max(2.5, 5 * ((a1.scale + a2.scale) / 2));
        heroCtx.beginPath();
        heroCtx.moveTo(a1.px, a1.py);
        heroCtx.lineTo(a2.px, a2.py);
        heroCtx.stroke();
        heroCtx.restore();
    }

    // 2. Sort atoms from back to front (Painter's Algorithm)
    projectedAtoms.sort((a, b) => b.z - a.z);

    // 3. Draw Spherical Atoms with Shading & Element Labels
    for (let atom of projectedAtoms) {
        heroCtx.save();

        // Atmospheric glowing halo
        heroCtx.shadowBlur = 18 * atom.scale;
        heroCtx.shadowColor = atom.glow;

        // 3D Sphere Radial Gradient (Phong highlight)
        const grad = heroCtx.createRadialGradient(
            atom.px - atom.pr * 0.35,
            atom.py - atom.pr * 0.35,
            atom.pr * 0.1,
            atom.px,
            atom.py,
            atom.pr
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.35, atom.color);
        grad.addColorStop(1, '#08080c');

        heroCtx.fillStyle = grad;
        heroCtx.beginPath();
        heroCtx.arc(atom.px, atom.py, atom.pr, 0, Math.PI * 2);
        heroCtx.fill();

        // Element Symbol Text
        heroCtx.shadowBlur = 0;
        heroCtx.fillStyle = '#ffffff';
        heroCtx.font = `bold ${Math.max(8, Math.floor(13 * atom.scale))}px Inter, sans-serif`;
        heroCtx.textAlign = 'center';
        heroCtx.textBaseline = 'middle';
        heroCtx.fillText(atom.elem, atom.px, atom.py + 0.5);

        heroCtx.restore();
    }

    requestAnimationFrame(draw3DMolecule);
}
if (heroMolCanvas) {
    draw3DMolecule();
}

// ====================================================
// 2. Interactive Periodic Table Element Quick-Inspector (All 83 Sandbox Elements + Fr)
// ====================================================
const ptableData = [
    { num: 1, sym: 'H', name: 'Hydrogen', mass: '1.008 u', cat: 'nonmetal', phase: 'Gas', en: '2.20', conf: '1s¹', flame: 'Pale Blue Flame', flameType: 'flame', desc: 'Lightest element in the universe. Highly combustible diatomic gas yielding clean water vapor when burned.', role: 'Universal proton donor & primary building block of organic molecules' },
    { num: 2, sym: 'He', name: 'Helium', mass: '4.0026 u', cat: 'noble', phase: 'Gas', en: '—', conf: '1s²', flame: 'Peach / Gold Glow', flameType: 'glow', desc: 'Completely inert noble gas that does not burn or combust under any conditions. Glows peach-gold when excited in gas discharge tubes.', role: 'Cryogenic cooling & unreactive carrier gas in thermodynamics' },
    { num: 3, sym: 'Li', name: 'Lithium', mass: '6.94 u', cat: 'alkali', phase: 'Solid', en: '0.98', conf: '[He] 2s¹', flame: 'Crimson Red', flameType: 'flame', desc: 'Lightest metal. Burns with an intense crimson red flame and reacts vigorously with water.', role: 'High electrochemical potential batteries & organolithium synthesis' },
    { num: 4, sym: 'Be', name: 'Beryllium', mass: '9.0122 u', cat: 'alkaline', phase: 'Solid', en: '1.57', conf: '[He] 2s²', flame: 'White Sparks', flameType: 'flame', desc: 'Steel-gray alkaline earth metal with exceptional thermal conductivity and stiffness.', role: 'Aerospace structural alloys & specialized X-ray tube windows' },
    { num: 5, sym: 'B', name: 'Boron', mass: '10.81 u', cat: 'metalloid', phase: 'Solid', en: '2.04', conf: '[He] 2s² 2p¹', flame: 'Bright Green', flameType: 'flame', desc: 'Semimetal forming unique electron-deficient multicenter bonds. Imparts a vivid green flame.', role: 'Borane reduction chemistry & Lewis acid catalysis' },
    { num: 6, sym: 'C', name: 'Carbon', mass: '12.011 u', cat: 'nonmetal', phase: 'Solid', en: '2.55', conf: '[He] 2s² 2p²', flame: 'Yellow-Orange (Incandescent)', flameType: 'flame', desc: 'The backbone of all organic life. Incandesces yellow-orange during carbonaceous combustion.', role: 'Organic synthesis, catenation, aromatic rings, and graphene structures' },
    { num: 7, sym: 'N', name: 'Nitrogen', mass: '14.007 u', cat: 'nonmetal', phase: 'Gas', en: '3.04', conf: '[He] 2s² 2p³', flame: 'Blue-Violet (Discharge)', flameType: 'glow', desc: 'Diatomic gas with an exceptionally strong N≡N triple bond. Non-flammable at room temperature; glows blue-violet in discharge tubes.', role: 'Amines, nitrogenous bases, fertilizers, and energetic materials' },
    { num: 8, sym: 'O', name: 'Oxygen', mass: '15.999 u', cat: 'nonmetal', phase: 'Gas', en: '3.44', conf: '[He] 2s² 2p⁴', flame: 'Supports Combustion (Pale Blue)', flameType: 'flame', desc: 'Non-flammable by itself, but is the vital oxidizer that supports all aerobic flames and combustion.', role: 'Oxidation reactions, hydrogen bonding, and carbonyl chemistry' },
    { num: 9, sym: 'F', name: 'Fluorine', mass: '18.998 u', cat: 'halogen', phase: 'Gas', en: '3.98', conf: '[He] 2s² 2p⁵', flame: 'Blinding White (Hypergolic)', flameType: 'flame', desc: 'The most electronegative and reactive element. Spontaneously ignites nearly all organic materials on contact.', role: 'Superacids (HSbF₆), Teflon fluoropolymers, and extreme oxidation states' },
    { num: 10, sym: 'Ne', name: 'Neon', mass: '20.180 u', cat: 'noble', phase: 'Gas', en: '—', conf: '[He] 2s² 2p⁶', flame: 'Reddish-Orange Glow', flameType: 'glow', desc: 'Completely inert noble gas. Does not burn; emits the iconic brilliant red-orange glow in high-voltage neon discharge tubes.', role: 'Cryogenic refrigeration & high-voltage indicators' },
    { num: 11, sym: 'Na', name: 'Sodium', mass: '22.990 u', cat: 'alkali', phase: 'Solid', en: '0.93', conf: '[Ne] 3s¹', flame: 'Intense Yellow (589 nm D-line)', flameType: 'flame', desc: 'Soft alkali metal reacting rapidly with water; burns with an intense monochromatic yellow flame.', role: 'Salt electrolytes, sodium amide synthesis, and energetic reductions' },
    { num: 12, sym: 'Mg', name: 'Magnesium', mass: '24.305 u', cat: 'alkaline', phase: 'Solid', en: '1.31', conf: '[Ne] 3s²', flame: 'Blinding White', flameType: 'flame', desc: 'Light structural metal combusting in air with a famous blinding white ultraviolet flame.', role: 'Grignard reagents (R-Mg-X) for universal carbon-carbon coupling' },
    { num: 13, sym: 'Al', name: 'Aluminium', mass: '26.982 u', cat: 'post-transition', phase: 'Solid', en: '1.61', conf: '[Ne] 3s² 3p¹', flame: 'Brilliant Silver-White', flameType: 'flame', desc: 'Low density, high conductivity metal. Powdered aluminium burns violently in thermite reactions.', role: 'Alloy metallurgy, Friedel-Crafts AlCl₃ catalyst, and thermite fuels' },
    { num: 14, sym: 'Si', name: 'Silicon', mass: '28.085 u', cat: 'metalloid', phase: 'Solid', en: '1.90', conf: '[Ne] 3s² 3p²', flame: 'White Sparks', flameType: 'flame', desc: 'Tetravalent metalloid forming the foundation of microchips and silicate minerals.', role: 'Semiconductors, silicones, and quartz network structures' },
    { num: 15, sym: 'P', name: 'Phosphorus', mass: '30.974 u', cat: 'nonmetal', phase: 'Solid', en: '2.19', conf: '[Ne] 3s² 3p³', flame: 'Pale Green-White (Spontaneous)', flameType: 'flame', desc: 'White phosphorus ignites spontaneously in air with a dense white smoke of P₄O₁₀.', role: 'Phosphate DNA backbone, organophosphates, and Wittig reagents' },
    { num: 16, sym: 'S', name: 'Sulfur', mass: '32.06 u', cat: 'nonmetal', phase: 'Solid', en: '2.58', conf: '[Ne] 3s² 3p⁴', flame: 'Eerie Blue', flameType: 'flame', desc: 'Bright yellow nonmetal melting into red liquid and burning with a characteristic ethereal blue flame.', role: 'Sulfuric acid manufacturing, disulfide protein bridges, and vulcanization' },
    { num: 17, sym: 'Cl', name: 'Chlorine', mass: '35.45 u', cat: 'halogen', phase: 'Gas', en: '3.16', conf: '[Ne] 3s² 3p⁵', flame: 'Supports Flames (Greenish)', flameType: 'flame', desc: 'Pungent greenish-yellow halogen gas and powerful oxidizer supporting vigorous combustion of hydrogen and metals.', role: 'Halogenation reactions, chlorination, and hydrochloric acid synthesis' },
    { num: 18, sym: 'Ar', name: 'Argon', mass: '39.948 u', cat: 'noble', phase: 'Gas', en: '—', conf: '[Ne] 3s² 3p⁶', flame: 'Lilac / Blue-Violet Glow', flameType: 'glow', desc: 'Inert noble gas that cannot combust. Produces a pale violet-blue glow when electrically ionized in plasma tubes.', role: 'Inert gas blanket for high-temperature synthesis & arc welding' },
    { num: 19, sym: 'K', name: 'Potassium', mass: '39.098 u', cat: 'alkali', phase: 'Solid', en: '0.82', conf: '[Ar] 4s¹', flame: 'Lilac / Violet', flameType: 'flame', desc: 'Reacts violently with water with immediate lilac flame ignition.', role: 'Cellular ion pumps, superoxide formation, and potash fertilizers' },
    { num: 20, sym: 'Ca', name: 'Calcium', mass: '40.078 u', cat: 'alkaline', phase: 'Solid', en: '1.00', conf: '[Ar] 4s²', flame: 'Brick Red', flameType: 'flame', desc: 'Alkaline earth metal imparting a characteristic brick-red color to burner flames.', role: 'Desulfurization, biological signaling cascades, and calcium oxide flux' },
    { num: 21, sym: 'Sc', name: 'Scandium', mass: '44.956 u', cat: 'transition', phase: 'Solid', en: '1.36', conf: '[Ar] 3d¹ 4s²', flame: 'Yellow-Orange Sparks', flameType: 'flame', desc: 'Lightweight transition metal that strengthens high-performance aluminium alloys.', role: 'Aerospace structural alloys & metal-halide stadium lamps' },
    { num: 22, sym: 'Ti', name: 'Titanium', mass: '47.867 u', cat: 'transition', phase: 'Solid', en: '1.54', conf: '[Ar] 3d² 4s²', flame: 'Bright White Sparks', flameType: 'flame', desc: 'Corrosion-resistant metal with the highest strength-to-density ratio.', role: 'Ziegler-Natta polymerization catalysis & biocompatible implants' },
    { num: 23, sym: 'V', name: 'Vanadium', mass: '50.942 u', cat: 'transition', phase: 'Solid', en: '1.63', conf: '[Ar] 3d³ 4s²', flame: 'Yellow-Green Sparks', flameType: 'flame', desc: 'Transition metal with colorful oxidation states (V²⁺, V³⁺, VO²⁺, VO₂⁺).', role: 'Vanadium redox flow batteries & high-strength tool steels' },
    { num: 24, sym: 'Cr', name: 'Chromium', mass: '51.996 u', cat: 'transition', phase: 'Solid', en: '1.66', conf: '[Ar] 3d⁵ 4s¹', flame: 'Silver / Blue-White Sparks', flameType: 'flame', desc: 'Hard, lustrous metal providing corrosion resistance in stainless steel.', role: 'Jones reagent alcohol oxidation & decorative chrome electroplating' },
    { num: 25, sym: 'Mn', name: 'Manganese', mass: '54.938 u', cat: 'transition', phase: 'Solid', en: '1.55', conf: '[Ar] 3d⁵ 4s²', flame: 'Greenish-White Sparks', flameType: 'flame', desc: 'Versatile element key to photosynthesis water-splitting cluster (Mn₄CaO₅).', role: 'Potassium permanganate (KMnO₄) redox titrations & battery cathodes' },
    { num: 26, sym: 'Fe', name: 'Iron', mass: '55.845 u', cat: 'transition', phase: 'Solid', en: '1.83', conf: '[Ar] 3d⁶ 4s²', flame: 'Gold Sparkles', flameType: 'flame', desc: 'Most abundant element by mass on Earth; iron filings combust with beautiful golden branching sparks.', role: 'Haber-Bosch ammonia catalyst, steel alloy forger, and redox chemistry' },
    { num: 27, sym: 'Co', name: 'Cobalt', mass: '58.933 u', cat: 'transition', phase: 'Solid', en: '1.88', conf: '[Ar] 3d⁷ 4s²', flame: 'Silver-White Sparks', flameType: 'flame', desc: 'Ferromagnetic transition metal at the core of Vitamin B12 (cobalamin).', role: 'Lithium-ion battery cathodes (NMC) and superalloy turbine blades' },
    { num: 28, sym: 'Ni', name: 'Nickel', mass: '58.693 u', cat: 'transition', phase: 'Solid', en: '1.91', conf: '[Ar] 3d⁸ 4s²', flame: 'Silver Sparks', flameType: 'flame', desc: 'Corrosion-resistant metal vital for electroplating and coin minting.', role: 'Raney nickel catalytic hydrogenation of alkenes to alkanes' },
    { num: 29, sym: 'Cu', name: 'Copper', mass: '63.546 u', cat: 'transition', phase: 'Solid', en: '1.90', conf: '[Ar] 3d¹⁰ 4s¹', flame: 'Emerald Green / Azure', flameType: 'flame', desc: 'Famous flame-test metal: copper salts turn Bunsen flames a vivid emerald green or azure blue.', role: 'Click chemistry (CuAAC), organocuprates, and electrical wiring' },
    { num: 30, sym: 'Zn', name: 'Zinc', mass: '65.38 u', cat: 'transition', phase: 'Solid', en: '1.65', conf: '[Ar] 3d¹⁰ 4s²', flame: 'Bluish-Green', flameType: 'flame', desc: 'Burns with a distinctive bluish-green flame, generating white fluffy ZnO smoke.', role: 'Clemmensen reduction, brass alloys, and alkaline battery anodes' },
    { num: 31, sym: 'Ga', name: 'Gallium', mass: '69.723 u', cat: 'post-transition', phase: 'Solid (Melts 29.8°C)', en: '1.81', conf: '[Ar] 3d¹⁰ 4s² 4p¹', flame: 'Violet', flameType: 'flame', desc: 'Metal that literally melts in the palm of your hand at 29.8°C.', role: 'Gallium arsenide (GaAs) lasers, optoelectronics, and liquid metal alloys' },
    { num: 32, sym: 'Ge', name: 'Germanium', mass: '72.630 u', cat: 'metalloid', phase: 'Solid', en: '2.01', conf: '[Ar] 3d¹⁰ 4s² 4p²', flame: 'Pale Blue', flameType: 'flame', desc: 'Lustrous, hard metalloid pivotal in early transistor semiconductors.', role: 'Fiber optics, infrared spectroscopy lenses, and solar cells' },
    { num: 33, sym: 'As', name: 'Arsenic', mass: '74.922 u', cat: 'metalloid', phase: 'Solid', en: '2.18', conf: '[Ar] 3d¹⁰ 4s² 4p³', flame: 'Pale Blue', flameType: 'flame', desc: 'Notorious toxic metalloid forming sulfides and oxide complexes; burns with a pale blue flame.', role: 'Semiconductor n-type dopant and III-V optoelectronic compounds' },
    { num: 34, sym: 'Se', name: 'Selenium', mass: '78.971 u', cat: 'nonmetal', phase: 'Solid', en: '2.55', conf: '[Ar] 3d¹⁰ 4s² 4p⁴', flame: 'Azure Blue', flameType: 'flame', desc: 'Photoconductive nonmetal burning with a bright azure blue flame with a radish-like odor.', role: 'Photocells, selenoproteins (glutathione peroxidase), and glass coloring' },
    { num: 35, sym: 'Br', name: 'Bromine', mass: '79.904 u', cat: 'halogen', phase: 'Liquid', en: '2.96', conf: '[Ar] 3d¹⁰ 4s² 4p⁵', flame: 'Non-Combustible (Supports Reaction)', flameType: 'flame', desc: 'Fuming red-brown liquid that does not burn by itself, but vigorously oxidizes alkali metals.', role: 'Electrophilic alkene addition & radical allylic bromination (NBS)' },
    { num: 36, sym: 'Kr', name: 'Krypton', mass: '83.798 u', cat: 'noble', phase: 'Gas', en: '3.00', conf: '[Ar] 3d¹⁰ 4s² 4p⁶', flame: 'Whitish-Green Glow', flameType: 'glow', desc: 'Inert noble gas that does not combust. Emits a brilliant whitish-green glow when ionized in electric discharge tubes.', role: 'Excimer lasers (KrF) for semiconductor nanolithography' },
    { num: 37, sym: 'Rb', name: 'Rubidium', mass: '85.468 u', cat: 'alkali', phase: 'Solid', en: '0.82', conf: '[Kr] 5s¹', flame: 'Red-Violet', flameType: 'flame', desc: 'Pyrophoric alkali metal that ignites spontaneously in air with a red-violet flame and explodes in water.', role: 'Atomic clocks, photocells, and vapor cell laser spectroscopy' },
    { num: 38, sym: 'Sr', name: 'Strontium', mass: '87.62 u', cat: 'alkaline', phase: 'Solid', en: '0.95', conf: '[Kr] 5s²', flame: 'Deep Crimson', flameType: 'flame', desc: 'Soft alkaline earth metal imparting famous vivid crimson red colors in emergency highway flares and fireworks.', role: 'Pyrotechnic crimson illuminations and strontium titanate optics' },
    { num: 39, sym: 'Y', name: 'Yttrium', mass: '88.906 u', cat: 'transition', phase: 'Solid', en: '1.22', conf: '[Kr] 4d¹ 5s²', flame: 'Bright Red Sparks', flameType: 'flame', desc: 'Rare-earth-like transition metal key in YBCO high-temperature superconductors.', role: 'YAG laser crystals (Nd:YAG) and superconducting ceramic matrices' },
    { num: 40, sym: 'Zr', name: 'Zirconium', mass: '91.224 u', cat: 'transition', phase: 'Solid', en: '1.33', conf: '[Kr] 4d² 5s²', flame: 'Bright White Sparks', flameType: 'flame', desc: 'Extremely corrosion-resistant metal with very low thermal neutron absorption.', role: 'Nuclear reactor fuel cladding and cubic zirconia gemstone ceramics' },
    { num: 41, sym: 'Nb', name: 'Niobium', mass: '92.906 u', cat: 'transition', phase: 'Solid', en: '1.60', conf: '[Kr] 4d⁴ 5s¹', flame: 'Bluish-White Sparks', flameType: 'flame', desc: 'Superconducting transition metal used in MRI magnet windings (NbTi).', role: 'Superconducting particle accelerator RF cavities and microalloyed steel' },
    { num: 42, sym: 'Mo', name: 'Molybdenum', mass: '95.95 u', cat: 'transition', phase: 'Solid', en: '2.16', conf: '[Kr] 4d⁵ 5s¹', flame: 'Yellow-Green', flameType: 'flame', desc: 'Refractory metal with one of the highest melting points (2,623°C).', role: 'Nitrogenase biological nitrogen-fixation cofactor and molybdenum disulfide lubricant' },
    { num: 43, sym: 'Tc', name: 'Technetium', mass: '98 u', cat: 'transition', phase: 'Solid', en: '1.90', conf: '[Kr] 4d⁵ 5s²', flame: 'None (Radioactive)', flameType: 'flame', desc: 'The lowest atomic-numbered element with no stable isotopes; synthetically produced.', role: 'Nuclear medicine medical diagnostic imaging (Tc-99m radiotracers)' },
    { num: 44, sym: 'Ru', name: 'Ruthenium', mass: '101.07 u', cat: 'transition', phase: 'Solid', en: '2.20', conf: '[Kr] 4d⁷ 5s¹', flame: 'White-Hot Sparks', flameType: 'flame', desc: 'Platinum group metal renowned for Grubbs olefin metathesis catalysts.', role: 'Nobel-winning olefin metathesis catalysis in organic synthesis' },
    { num: 45, sym: 'Rh', name: 'Rhodium', mass: '102.91 u', cat: 'transition', phase: 'Solid', en: '2.28', conf: '[Kr] 4d⁸ 5s¹', flame: 'Non-Combustible (Noble Metal)', flameType: 'flame', desc: 'Noble metal completely unaffected by flame or oxygen at standard conditions.', role: 'Automotive 3-way catalytic converters and Wilkinson hydrogenation catalyst' },
    { num: 46, sym: 'Pd', name: 'Palladium', mass: '106.42 u', cat: 'transition', phase: 'Solid', en: '2.20', conf: '[Kr] 4d¹⁰', flame: 'Non-Combustible (Noble Metal)', flameType: 'flame', desc: 'Absorbs up to 900 times its own volume of hydrogen gas like a sponge; resistant to direct burning.', role: 'Suzuki-Miyaura cross-coupling catalysts and hydrogen fuel purification' },
    { num: 47, sym: 'Ag', name: 'Silver', mass: '107.87 u', cat: 'transition', phase: 'Solid', en: '1.93', conf: '[Kr] 4d¹⁰ 5s¹', flame: 'Faint Greenish Sparks', flameType: 'flame', desc: 'Highest electrical conductivity, thermal conductivity, and reflectivity of all metals.', role: 'Tollens silver-mirror aldehyde test, photography, and conductive inks' },
    { num: 48, sym: 'Cd', name: 'Cadmium', mass: '112.41 u', cat: 'transition', phase: 'Solid', en: '1.69', conf: '[Kr] 4d¹⁰ 5s²', flame: 'Brick Red Flame', flameType: 'flame', desc: 'Soft, bluish metal used in rechargeable NiCd batteries; burns with a brick-red flame.', role: 'Cadmium selenide (CdSe) quantum dot fluorescence and neutron shielding' },
    { num: 49, sym: 'In', name: 'Indium', mass: '114.82 u', cat: 'post-transition', phase: 'Solid', en: '1.78', conf: '[Kr] 4d¹⁰ 5s² 5p¹', flame: 'Deep Indigo Blue', flameType: 'flame', desc: 'Named for the brilliant indigo blue spectral line it emits in flame testing.', role: 'Indium tin oxide (ITO) transparent touchscreen conductor coatings' },
    { num: 50, sym: 'Sn', name: 'Tin', mass: '118.71 u', cat: 'post-transition', phase: 'Solid', en: '1.96', conf: '[Kr] 4d¹⁰ 5s² 5p²', flame: 'Faint Lilac / White', flameType: 'flame', desc: 'Ancient alloy component in bronze; burns in hot oxygen with faint lilac flame.', role: 'Soldering electronics, Stille cross-coupling organotins, and corrosion coating' },
    { num: 51, sym: 'Sb', name: 'Antimony', mass: '121.76 u', cat: 'metalloid', phase: 'Solid', en: '2.05', conf: '[Kr] 4d¹⁰ 5s² 5p³', flame: 'Pale Greenish-White', flameType: 'flame', desc: 'Lustrous metalloid whose pentafluoride (SbF₅) is the strongest known Lewis acid.', role: 'Core ingredient in Fluoroantimonic Acid (HSbF₆) superacid synthesis' },
    { num: 52, sym: 'Te', name: 'Tellurium', mass: '127.60 u', cat: 'metalloid', phase: 'Solid', en: '2.10', conf: '[Kr] 4d¹⁰ 5s² 5p⁴', flame: 'Greenish-Blue', flameType: 'flame', desc: 'Silvery metalloid that burns in air with a greenish-blue flame to form TeO₂.', role: 'High-efficiency thin-film solar photovoltaics and thermoelectric coolers' },
    { num: 53, sym: 'I', name: 'Iodine', mass: '126.90 u', cat: 'halogen', phase: 'Solid', en: '2.66', conf: '[Kr] 4d¹⁰ 5s² 5p⁵', flame: 'Sublimes to Violet Gas', flameType: 'flame', desc: 'Non-combustible solid that sublimes directly into a gorgeous dense purple vapor when heated.', role: 'Starch iodine test, thyroid hormone synthesis, and radical initiator' },
    { num: 54, sym: 'Xe', name: 'Xenon', mass: '131.29 u', cat: 'noble', phase: 'Gas', en: '2.60', conf: '[Kr] 4d¹⁰ 5s² 5p⁶', flame: 'Sky Blue Glow', flameType: 'glow', desc: 'Heavy noble gas that cannot combust in fire. Ionizes with a bright sky-blue glow in plasma thrusters and flash lamps.', role: 'Spacecraft ion propulsion thrusters and deep anesthesia agents' },
    { num: 55, sym: 'Cs', name: 'Caesium', mass: '132.91 u', cat: 'alkali', phase: 'Solid (Liquid >28°C)', en: '0.79', conf: '[Xe] 6s¹', flame: 'Sky Blue (Azure)', flameType: 'flame', desc: 'Named after the Latin caesius (sky blue) for the brilliant blue lines in its flame spectrum; detonates violently on contact with water or ice.', role: 'SI definition of the second (atomic hyperfine transition at 9.192 GHz)' },
    { num: 56, sym: 'Ba', name: 'Barium', mass: '137.33 u', cat: 'alkaline', phase: 'Solid', en: '0.89', conf: '[Xe] 6s²', flame: 'Apple Green', flameType: 'flame', desc: 'Highly reactive alkaline earth metal giving brilliant apple-green fireworks.', role: 'Barium sulfate GI contrast imaging and green pyrotechnics' },
    { num: 57, sym: 'La', name: 'Lanthanum', mass: '138.91 u', cat: 'lanthanide', phase: 'Solid', en: '1.10', conf: '[Xe] 5d¹ 6s²', flame: 'White Sparks', flameType: 'flame', desc: 'Soft silvery metal that names the entire Lanthanide series of 4f elements.', role: 'Hybrid vehicle battery nickel-metal hydride (NiMH) electrodes' },
    { num: 58, sym: 'Ce', name: 'Cerium', mass: '140.12 u', cat: 'lanthanide', phase: 'Solid', en: '1.12', conf: '[Xe] 4f¹ 5d¹ 6s²', flame: 'Blinding White Sparks (Flint)', flameType: 'flame', desc: 'Pyrophoric metal in lighter flints that showers hot white sparks when scraped.', role: 'Cerium(IV) ammonium nitrate (CAN) single-electron oxidant in organics' },
    { num: 59, sym: 'Pr', name: 'Praseodymium', mass: '140.91 u', cat: 'lanthanide', phase: 'Solid', en: '1.13', conf: '[Xe] 4f³ 6s²', flame: 'Pale Yellow Sparks', flameType: 'flame', desc: 'Soft ductile metal creating didymium glass to block intense sodium yellow glare.', role: 'Glassblowers safety goggles and ultra-strong neodymium alloy magnets' },
    { num: 60, sym: 'Nd', name: 'Neodymium', mass: '144.24 u', cat: 'lanthanide', phase: 'Solid', en: '1.14', conf: '[Xe] 4f⁴ 6s²', flame: 'Yellow Sparks', flameType: 'flame', desc: 'Forms the most powerful permanent magnets known to science (Nd₂Fe₁₄B).', role: 'Permanent magnets for electric vehicle motors, wind turbines, and hard drives' },
    { num: 61, sym: 'Pm', name: 'Promethium', mass: '145 u', cat: 'lanthanide', phase: 'Solid', en: '1.13', conf: '[Xe] 4f⁵ 6s²', flame: 'None (Radioactive)', flameType: 'flame', desc: 'Extremely rare radioactive lanthanide used in atomic batteries.', role: 'Miniature nuclear-powered batteries for spacecraft instruments' },
    { num: 62, sym: 'Sm', name: 'Samarium', mass: '150.36 u', cat: 'lanthanide', phase: 'Solid', en: '1.17', conf: '[Xe] 4f⁶ 6s²', flame: 'Yellow Sparks', flameType: 'flame', desc: 'Lanthanide forming heat-resistant Samarium-Cobalt (SmCo) magnets.', role: 'Samarium diiodide (SmI₂) Kagan reagent for single-electron reductions' },
    { num: 63, sym: 'Eu', name: 'Europium', mass: '151.96 u', cat: 'lanthanide', phase: 'Solid', en: '1.20', conf: '[Xe] 4f⁷ 6s²', flame: 'Crimson Red Glow', flameType: 'flame', desc: 'Most reactive lanthanide metal; glows brilliant red under UV light.', role: 'Anti-counterfeiting phosphors in Euro banknotes and color TV screens' },
    { num: 64, sym: 'Gd', name: 'Gadolinium', mass: '157.25 u', cat: 'lanthanide', phase: 'Solid', en: '1.20', conf: '[Xe] 4f⁷ 5d¹ 6s²', flame: 'White Sparks', flameType: 'flame', desc: 'Possesses 7 unpaired f-electrons giving extraordinary paramagnetic resonance.', role: 'MRI magnetic resonance contrast enhancement agents' },
    { num: 65, sym: 'Tb', name: 'Terbium', mass: '158.93 u', cat: 'lanthanide', phase: 'Solid', en: '1.20', conf: '[Xe] 4f⁹ 6s²', flame: 'Intense Green Glow', flameType: 'flame', desc: 'Rare-earth metal emitting a characteristic intense green fluorescent peak.', role: 'Magnetostrictive Terfenol-D naval sonars and fluorescent green lamps' },
    { num: 66, sym: 'Dy', name: 'Dysprosium', mass: '162.50 u', cat: 'lanthanide', phase: 'Solid', en: '1.22', conf: '[Xe] 4f¹⁰ 6s²', flame: 'Silver Sparks', flameType: 'flame', desc: 'Highest magnetic strength of any element at cryogenic temperatures.', role: 'Thermal stabilization of electric vehicle neodymium motor magnets' },
    { num: 67, sym: 'Ho', name: 'Holmium', mass: '164.93 u', cat: 'lanthanide', phase: 'Solid', en: '1.23', conf: '[Xe] 4f¹¹ 6s²', flame: 'Yellow Sparks', flameType: 'flame', desc: 'Has the highest magnetic moment of any naturally occurring element.', role: 'Medical holmium-YAG lasers for non-invasive surgical kidney stone ablation' },
    { num: 68, sym: 'Er', name: 'Erbium', mass: '167.26 u', cat: 'lanthanide', phase: 'Solid', en: '1.24', conf: '[Xe] 4f¹² 6s²', flame: 'Pink Glow', flameType: 'flame', desc: 'Pink-colored lanthanide ion amplifying optical communication signals.', role: 'Erbium-doped fiber amplifiers (EDFAs) powering global internet cables' },
    { num: 69, sym: 'Tm', name: 'Thulium', mass: '168.93 u', cat: 'lanthanide', phase: 'Solid', en: '1.25', conf: '[Xe] 4f¹³ 6s²', flame: 'Silver Sparks', flameType: 'flame', desc: 'Second rarest naturally occurring lanthanide; produces clean portable X-rays.', role: 'Portable medical X-ray sources and high-efficiency solid-state lasers' },
    { num: 70, sym: 'Yb', name: 'Ytterbium', mass: '173.05 u', cat: 'lanthanide', phase: 'Solid', en: '1.10', conf: '[Xe] 4f¹⁴ 6s²', flame: 'Silver Sparks', flameType: 'flame', desc: 'Soft ductile metal with a completely filled 4f¹⁴ subshell.', role: 'Atomic optical clocks with precision exceeding 1 part in 10¹⁸' },
    { num: 71, sym: 'Lu', name: 'Lutetium', mass: '174.97 u', cat: 'lanthanide', phase: 'Solid', en: '1.27', conf: '[Xe] 4f¹⁴ 5d¹ 6s²', flame: 'White Sparks', flameType: 'flame', desc: 'The heaviest and hardest of the lanthanide elements.', role: 'Lutetium-177 targeted radioligand cancer therapy (Lu-177 PSMA)' },
    { num: 72, sym: 'Hf', name: 'Hafnium', mass: '178.49 u', cat: 'transition', phase: 'Solid', en: '1.30', conf: '[Xe] 4f¹⁴ 5d² 6s²', flame: 'White Sparks', flameType: 'flame', desc: 'High neutron-capture transition metal that twins zirconium chemically.', role: 'High-k dielectric gate insulators in sub-10nm microprocessors' },
    { num: 73, sym: 'Ta', name: 'Tantalum', mass: '180.95 u', cat: 'transition', phase: 'Solid', en: '1.50', conf: '[Xe] 4f¹⁴ 5d³ 6s²', flame: 'Non-Combustible (Refractory)', flameType: 'flame', desc: 'Extremely inert refractory metal completely immune to attack by fire, acids, and bodily fluids.', role: 'Miniature high-capacitance smartphone capacitors & surgical implants' },
    { num: 74, sym: 'W', name: 'Tungsten', mass: '183.84 u', cat: 'transition', phase: 'Solid', en: '2.36', conf: '[Xe] 4f¹⁴ 5d⁴ 6s²', flame: 'Incandescent White Glow', flameType: 'flame', desc: 'Highest melting point of all elements (3,422°C); incandesces white-hot without melting in lamp filaments.', role: 'Ultra-hard tungsten carbide (WC) cutting bits and fusion reactor armor' },
    { num: 75, sym: 'Re', name: 'Rhenium', mass: '186.21 u', cat: 'transition', phase: 'Solid', en: '1.90', conf: '[Xe] 4f¹⁴ 5d⁵ 6s²', flame: 'Silver Sparks', flameType: 'flame', desc: 'One of the rarest elements in Earth crust with third highest melting point.', role: 'Single-crystal superalloys for jet engine combustion turbine blades' },
    { num: 76, sym: 'Os', name: 'Osmium', mass: '190.23 u', cat: 'transition', phase: 'Solid', en: '2.20', conf: '[Xe] 4f¹⁴ 5d⁶ 6s²', flame: 'Non-Combustible (Oxidizes to OsO4)', flameType: 'flame', desc: 'The densest naturally occurring element (22.59 g/cm³); does not burn with a flame, but forms toxic volatile OsO₄.', role: 'Osmium tetroxide (OsO₄) stereospecific syn-dihydroxylation of alkenes' },
    { num: 77, sym: 'Ir', name: 'Iridium', mass: '192.22 u', cat: 'transition', phase: 'Solid', en: '2.20', conf: '[Xe] 4f¹⁴ 5d⁷ 6s²', flame: 'Non-Combustible (Corrosion Immune)', flameType: 'flame', desc: 'The most corrosion-resistant metal known; utterly immune to air and fire oxidation.', role: 'Spark plug electrodes and polymer electrolyte membrane water electrolyzers' },
    { num: 78, sym: 'Pt', name: 'Platinum', mass: '195.08 u', cat: 'transition', phase: 'Solid', en: '2.28', conf: '[Xe] 4f¹⁴ 5d⁹ 6s¹', flame: 'Non-Combustible (Noble Metal)', flameType: 'flame', desc: 'Noble metal completely unaffected by flame or oxygen; used as the wire loop in flame tests because it has no flame color!', role: 'Cisplatin chemotherapy drug & hydrogen fuel cell catalytic electrodes' },
    { num: 79, sym: 'Au', name: 'Gold', mass: '196.97 u', cat: 'transition', phase: 'Solid', en: '2.54', conf: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', flame: 'None (Completely Noble)', flameType: 'flame', desc: 'Completely unreactive noble metal unaffected by air, moisture, heat, or pure single acids.', role: 'Aqua regia dissolution tests and relativistic electron contraction model' },
    { num: 80, sym: 'Hg', name: 'Mercury', mass: '200.59 u', cat: 'transition', phase: 'Liquid', en: '2.00', conf: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', flame: 'Bluish-Green Glow (Discharge)', flameType: 'glow', desc: 'Liquid metal that vaporizes into toxic vapors when heated; produces bluish-green light in mercury-vapor lamps.', role: 'Oxymercuration-demercuration Markovnikov hydration of alkenes' },
    { num: 81, sym: 'Tl', name: 'Thallium', mass: '204.38 u', cat: 'post-transition', phase: 'Solid', en: '1.62', conf: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', flame: 'Pure Emerald Green', flameType: 'flame', desc: 'Soft toxic metal named from Greek thallos (green twig) for the vivid green line in its flame spectrum.', role: 'Infrared optical materials and medical myocardial perfusion imaging' },
    { num: 82, sym: 'Pb', name: 'Lead', mass: '207.2 u', cat: 'post-transition', phase: 'Solid', en: '2.33', conf: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', flame: 'Faint Blue-White', flameType: 'flame', desc: 'Dense malleable metal that marks the terminus of natural radioactive decay chains.', role: 'Lead-acid vehicle batteries and high-energy radiation X-ray shielding' },
    { num: 83, sym: 'Bi', name: 'Bismuth', mass: '208.98 u', cat: 'post-transition', phase: 'Solid', en: '2.02', conf: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', flame: 'Azure Blue', flameType: 'flame', desc: 'Heaviest stable sandbox element. Burns with an iridescent azure blue flame into yellow Bi₂O₃.', role: 'Pepto-Bismol subsalicylate pharmaceuticals and non-toxic lead substitutes' },
    { num: 87, sym: 'Fr', name: 'Francium', mass: '223 u', cat: 'alkali', phase: 'Solid / Molten', en: '0.70', conf: '[Rn] 7s¹', flame: 'Intense Ionizing Green / Radiative', flameType: 'flame', desc: 'Extremely radioactive alkali metal; highest theoretical alkali detonation yield.', role: 'Maximum alkali blast detonation yield & nuclear ionization shockwave physics' }
];

const ptableGrid = document.getElementById('ptable-grid');
const hudNum = document.getElementById('hud-num');
const hudCategory = document.getElementById('hud-category');
const hudSymbol = document.getElementById('hud-symbol');
const hudName = document.getElementById('hud-name');
const hudMass = document.getElementById('hud-mass');
const hudPhase = document.getElementById('hud-phase');
const hudEn = document.getElementById('hud-en');
const hudConfig = document.getElementById('hud-config');
const hudFlame = document.getElementById('hud-flame');
const hudDesc = document.getElementById('hud-desc');
const hudRole = document.getElementById('hud-role');

function renderPeriodicGrid() {
    if (!ptableGrid) return;
    ptableGrid.innerHTML = '';

    ptableData.forEach((el, index) => {
        const tile = document.createElement('div');
        tile.className = `element-tile ${index === 0 ? 'active' : ''}`;
        tile.setAttribute('data-cat', el.cat);
        tile.innerHTML = `
            <span class="tile-atomic-num">${el.num}</span>
            <span class="tile-symbol">${el.sym}</span>
            <span class="tile-name">${el.name}</span>
        `;

        tile.addEventListener('click', () => {
            document.querySelectorAll('.element-tile').forEach(t => t.classList.remove('active'));
            tile.classList.add('active');
            displayElementHUD(el);
        });

        ptableGrid.appendChild(tile);
    });
}

function displayElementHUD(el) {
    if (!hudNum) return;
    hudNum.textContent = `#${el.num}`;
    hudCategory.textContent = el.cat;
    hudSymbol.textContent = el.sym;
    hudName.textContent = el.name;
    hudMass.textContent = el.mass;
    hudPhase.textContent = el.phase;
    hudEn.textContent = el.en;
    hudConfig.textContent = el.conf;
    hudFlame.textContent = el.flame;
    hudDesc.textContent = el.desc;
    hudRole.textContent = el.role;

    // Dynamically contextualize label: "Gas Discharge Glow" for noble gases, "Flame Color" for combustible elements
    const hudFlameLabel = document.getElementById('hud-flame-label');
    if (hudFlameLabel) {
        if (el.flameType === 'glow' || el.cat === 'noble') {
            hudFlameLabel.textContent = 'Discharge Glow';
        } else {
            hudFlameLabel.textContent = 'Flame Color';
        }
    }

    // Glowing tint on big symbol matching category
    let catColor = '#00e5ff';
    if (el.cat === 'alkali') catColor = '#ff3366';
    else if (el.cat === 'alkaline') catColor = '#ffaa00';
    else if (el.cat === 'halogen') catColor = '#d500f9';
    else if (el.cat === 'noble') catColor = '#76ff03';
    else if (el.cat === 'nonmetal') catColor = '#00ffaa';
    else if (el.cat === 'metalloid') catColor = '#ffd54f';
    else if (el.cat === 'post-transition') catColor = '#4fc3f7';
    else if (el.cat === 'lanthanide') catColor = '#ff80ab';

    hudSymbol.style.textShadow = `0 0 30px ${catColor}`;
    hudCategory.style.color = catColor;
    hudCategory.style.borderColor = catColor;
}

renderPeriodicGrid();

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
    Li: { name: 'Lithium', valency: 1, baseLevel: 1, color: '#ff3366', soundGain: 0.20, boomFreq: 140, particleCount: 60 },
    Na: { name: 'Sodium', valency: 1, baseLevel: 2, color: '#ffaa00', soundGain: 0.32, boomFreq: 110, particleCount: 110 },
    K:  { name: 'Potassium', valency: 1, baseLevel: 3, color: '#cc66ff', soundGain: 0.45, boomFreq: 85, particleCount: 180 },
    Rb: { name: 'Rubidium', valency: 1, baseLevel: 4, color: '#ff2200', soundGain: 0.60, boomFreq: 60, particleCount: 280 },
    Cs: { name: 'Caesium', valency: 1, baseLevel: 5, color: '#00e5ff', soundGain: 0.78, boomFreq: 45, particleCount: 400 },
    Fr: { name: 'Francium', valency: 1, baseLevel: 6, color: '#39ff14', soundGain: 0.95, boomFreq: 30, particleCount: 650 }
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
        soundMult: 1.15,
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
        soundMult: 1.35,
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
        soundMult: 1.55,
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
        soundMult: 1.8, // Heavy cinematic presence without physical clipping
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
let masterCompressor = null;
let masterSafeGain = null;

function initAudioSystem() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (!masterCompressor) {
        // Professional brickwall compressor / limiter:
        // Automatically clamps high-energy dynamic peaks and suppresses clipping
        masterCompressor = audioCtx.createDynamicsCompressor();
        masterCompressor.threshold.setValueAtTime(-12, audioCtx.currentTime); // Start gentle compression at -12dB
        masterCompressor.knee.setValueAtTime(10, audioCtx.currentTime);        // Smooth transition knee
        masterCompressor.ratio.setValueAtTime(16, audioCtx.currentTime);       // Strong limiting ratio (16:1)
        masterCompressor.attack.setValueAtTime(0.003, audioCtx.currentTime);   // Ultra-fast 3ms attack to protect against sudden transient spikes
        masterCompressor.release.setValueAtTime(0.25, audioCtx.currentTime);   // 250ms smooth release

        // Master safe gain output: hard-capped well below 0 dBFS (peak < 0.75) for 100% speaker & ear safety
        masterSafeGain = audioCtx.createGain();
        masterSafeGain.gain.setValueAtTime(0.72, audioCtx.currentTime);

        masterCompressor.connect(masterSafeGain);
        masterSafeGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playExplosionSound(metalKey, liquidKey) {
    try {
        initAudioSystem();

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
        // Do not drop below 28Hz to avoid violent inaudible DC excursion on physical speaker cones
        osc.frequency.exponentialRampToValueAtTime(28, now + duration);

        // Safe relative internal gain (normalized between 0.15 and 0.8)
        const safeOscGain = Math.min(0.8, details.soundGain * 0.65);
        oscGain.gain.setValueAtTime(safeOscGain, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(oscGain);
        oscGain.connect(masterCompressor); // Routed into brickwall safety limiter
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
        filter.frequency.setValueAtTime(600 + tierIndex * 120, now);
        filter.frequency.linearRampToValueAtTime(65, now + duration);

        const noiseGain = audioCtx.createGain();
        const safeNoiseGain = Math.min(0.85, details.soundGain * 0.75);
        noiseGain.gain.setValueAtTime(safeNoiseGain, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.9);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterCompressor); // Routed into brickwall safety limiter

        whiteNoise.start(now);
        whiteNoise.stop(now + duration);

        // Screen Crack Glass-Shatter Sound Effect (When crackTier > 0)
        if (details.crackTier > 0) {
            const crackCount = Math.min(details.crackTier, 4);
            for (let c = 0; c < crackCount; c++) {
                const crackOffset = c * 0.04;
                const crackOsc = audioCtx.createOscillator();
                const crackGain = audioCtx.createGain();
                crackOsc.type = 'sawtooth';
                crackOsc.frequency.setValueAtTime(1800 + Math.random() * 600, now + crackOffset);
                crackOsc.frequency.exponentialRampToValueAtTime(320, now + crackOffset + 0.22);
                
                // Keep crack volume comfortable and non-piercing
                const safeCrackGain = Math.min(0.35, 0.12 + details.crackTier * 0.035);
                crackGain.gain.setValueAtTime(safeCrackGain, now + crackOffset);
                crackGain.gain.exponentialRampToValueAtTime(0.001, now + crackOffset + 0.22);
                
                crackOsc.connect(crackGain);
                crackGain.connect(masterCompressor); // Routed into brickwall safety limiter
                crackOsc.start(now + crackOffset);
                crackOsc.stop(now + crackOffset + 0.22);
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
