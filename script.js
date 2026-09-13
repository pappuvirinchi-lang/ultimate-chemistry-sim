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
// 1. Authentic In-Simulator 3D Revolving Molecule Showcase
// ====================================================
const revolvingMolImg = document.getElementById('revolving-mol-img');
const molChips = document.querySelectorAll('.mol-chip');
const molCaptionText = document.getElementById('mol-caption-text');

const moleculeModels = {
    hsbf6: {
        src: 'hsbf6-molecule.png',
        alt: 'Real in-simulator 3D drawing of Fluoroantimonic Acid HSbF6',
        caption: 'Example molecule drawing of <strong>HSbF<sub>6</sub></strong> (fluoroantimonic acid) &bull; Octahedral geometry'
    },
    water: {
        src: 'water-molecule.png',
        alt: 'Real in-simulator 3D drawing of Water H2O',
        caption: 'In-Simulator 3D Drawing of <strong>H<sub>2</sub>O</strong> &bull; Bent VSEPR Geometry (104.5° bond angle)'
    },
    cyclopropyne: {
        src: 'cyclopropyne-molecule.png',
        alt: 'Real in-simulator 3D drawing of Cyclopropyne C3H2',
        caption: 'In-Simulator 3D Drawing of <strong>C<sub>3</sub>H<sub>2</sub></strong> (Cyclopropyne) &bull; Extreme ring-strain cyclic alkyne with a C:H ratio of 3:2'
    },
    benzene: {
        src: 'benzene-molecule.png',
        alt: 'Real in-simulator 3D drawing of Benzene C6H6',
        caption: 'In-Simulator 3D Drawing of <strong>C<sub>6</sub>H<sub>6</sub></strong> (Benzene) &bull; Planar aromatic resonance ring'
    }
};

molChips.forEach(chip => {
    chip.addEventListener('click', () => {
        molChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const key = chip.getAttribute('data-mol');
        const data = moleculeModels[key];

        if (data && revolvingMolImg) {
            // Smooth fade transition
            revolvingMolImg.style.opacity = '0.2';
            revolvingMolImg.style.transform = 'scale(0.92)';

            setTimeout(() => {
                revolvingMolImg.src = data.src;
                revolvingMolImg.alt = data.alt;
                if (molCaptionText) {
                    molCaptionText.innerHTML = data.caption;
                }
                revolvingMolImg.style.opacity = '1';
                revolvingMolImg.style.transform = 'scale(1)';
            }, 180);
        }
    });
});

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
const screenShatterContainer = document.getElementById('screen-shatter-container');
const cataclysmBlackout = document.getElementById('cataclysm-blackout');
const cataclysmCanvas = document.getElementById('cataclysm-canvas');
const cataclysmCtx = cataclysmCanvas ? cataclysmCanvas.getContext('2d') : null;
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
        if (activeMetal === 'Fr') {
            eq = `2Fr + 2HSbF<sub>6</sub> &rarr; 2FrSbF<sub>6</sub> + H<sub>2</sub>&uarr; + <strong style="color:#00ffff; text-shadow:0 0 10px #00ffff;">⚡ APOCALYPTIC REALITY-SHATTERING VOID DETONATION! 💥</strong>`;
        } else {
            eq = `2${activeMetal} + 2HSbF<sub>6</sub> &rarr; 2${activeMetal}SbF<sub>6</sub> + H<sub>2</sub>&uarr; + <strong>⚡ CATACLYSMIC SUPERACID BLAST!</strong>`;
        }
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

let sharedNoiseBuffer = null;
function getSharedNoiseBuffer(ctx, duration) {
    if (!sharedNoiseBuffer || sharedNoiseBuffer.duration < duration) {
        const bufferSize = Math.floor(ctx.sampleRate * Math.max(duration, 3.5));
        sharedNoiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = sharedNoiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
    }
    return sharedNoiseBuffer;
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

        // 2. Play bursting noise shockwave from cached buffer
        const noiseBuffer = getSharedNoiseBuffer(audioCtx, duration);
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
            const crackCount = Math.min(details.crackTier, 3);
            for (let c = 0; c < crackCount; c++) {
                const crackOffset = c * 0.05;
                const crackOsc = audioCtx.createOscillator();
                const crackGain = audioCtx.createGain();
                crackOsc.type = 'sawtooth';
                crackOsc.frequency.setValueAtTime(1800 + Math.random() * 600, now + crackOffset);
                crackOsc.frequency.exponentialRampToValueAtTime(320, now + crackOffset + 0.2);
                
                const safeCrackGain = Math.min(0.35, 0.12 + details.crackTier * 0.035);
                crackGain.gain.setValueAtTime(safeCrackGain, now + crackOffset);
                crackGain.gain.exponentialRampToValueAtTime(0.001, now + crackOffset + 0.2);
                
                crackOsc.connect(crackGain);
                crackGain.connect(masterCompressor);
                crackOsc.start(now + crackOffset);
                crackOsc.stop(now + crackOffset + 0.2);
            }
        }

        // Cataclysmic Glass Shatter Burst Sound (Francium + HSbF6)
        if (metalKey === 'Fr' && liquidKey === 'hsbf6') {
            for (let s = 0; s < 4; s++) {
                const sOffset = 0.04 + s * 0.04;
                const sOsc = audioCtx.createOscillator();
                const sGain = audioCtx.createGain();
                sOsc.type = 'sawtooth';
                sOsc.frequency.setValueAtTime(2400 + Math.random() * 1200, now + sOffset);
                sOsc.frequency.exponentialRampToValueAtTime(180, now + sOffset + 0.25);
                
                sGain.gain.setValueAtTime(0.25, now + sOffset);
                sGain.gain.exponentialRampToValueAtTime(0.001, now + sOffset + 0.25);
                
                sOsc.connect(sGain);
                sGain.connect(masterCompressor);
                sOsc.start(now + sOffset);
                sOsc.stop(now + sOffset + 0.25);
            }
        }
    } catch (e) {
        console.warn('Audio context error:', e);
    }
}

// -------------------------------------------------------------------------
// Cataclysmic Reality Shatter & Void Collapse Engine (Fr + HSbF6)
// Ultra-fast zero-lag execution: Pure CSS tectonic fractures
// -------------------------------------------------------------------------
function triggerCataclysmShatterEffect() {
    if (!screenShatterContainer || !cataclysmBlackout || !siteWrapper) return;

    // 1. Prepare shatter container
    screenShatterContainer.innerHTML = '';
    screenShatterContainer.classList.add('active');

    // 2. Generate 8 clean jagged tectonic plates without canvas encoding overhead
    const fragment = document.createDocumentFragment();
    const cols = 4;
    const rows = 2;
    const widthPct = 100 / cols;
    const heightPct = 100 / rows;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x1 = c * widthPct;
            const y1 = r * heightPct;
            const x2 = (c + 1) * widthPct;
            const y2 = (r + 1) * heightPct;

            const jitterX = (Math.random() - 0.5) * (widthPct * 0.35);
            const jitterY = (Math.random() - 0.5) * (heightPct * 0.35);
            const midX = Math.max(2, Math.min(98, (x1 + x2) / 2 + jitterX));
            const midY = Math.max(2, Math.min(98, (y1 + y2) / 2 + jitterY));

            const clipPath = `polygon(${x1}% ${y1}%, ${x2}% ${y1}%, ${midX}% ${midY}%, ${x1}% ${y2}%)`;

            const plate = document.createElement('div');
            plate.className = 'reality-shard';
            plate.style.clipPath = clipPath;

            const centerX = 50;
            const centerY = 50;
            const dx = midX - centerX;
            const dy = midY - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 300 + Math.random() * 300;

            const tx = (dx / dist) * force;
            const ty = (dy / dist) * force;
            const rz = (Math.random() - 0.5) * 80;

            plate.style.setProperty('--tx', `${tx.toFixed(0)}px`);
            plate.style.setProperty('--ty', `${ty.toFixed(0)}px`);
            plate.style.setProperty('--rz', `${rz.toFixed(0)}deg`);

            fragment.appendChild(plate);
        }
    }
    screenShatterContainer.appendChild(fragment);

    // 3. Prepare dedicated Cataclysm Canvas (placed outside site-wrapper, above the blackout void!)
    if (cataclysmCanvas) {
        cataclysmCanvas.width = window.innerWidth;
        cataclysmCanvas.height = window.innerHeight;
        cataclysmCanvas.classList.add('active');
    }

    // Immediately disappear the actual website so it looks like it was smashed to pieces into the void!
    siteWrapper.style.transition = 'opacity 0.08s ease-out';
    siteWrapper.style.opacity = '0';

    // 4. Trigger pitch-black void overlay cleanly
    setTimeout(() => {
        cataclysmBlackout.className = 'cataclysm-blackout flash-instant';

        // Clear shatter plates and screen cracks while hidden in blackness (keeping the mushroom cloud alive!)
        setTimeout(() => {
            screenShatterContainer.classList.remove('active');
            screenShatterContainer.innerHTML = '';
            if (screenCracks) {
                screenCracks.classList.remove('active');
                screenCracks.removeAttribute('data-crack-tier');
            }
        }, 150);

        // 5. Rest in the void (with mushroom cloud towering), then smoothly fade back into reality
        setTimeout(() => {
            siteWrapper.style.transition = 'opacity 2.5s cubic-bezier(0.16, 1, 0.3, 1)';
            siteWrapper.style.opacity = '1';
            cataclysmBlackout.className = 'cataclysm-blackout recovering';

            setTimeout(() => {
                cataclysmBlackout.className = 'cataclysm-blackout';
                // Reset and hide cataclysm canvas once reality has settled back
                if (cataclysmCanvas) {
                    cataclysmCanvas.classList.remove('active');
                    if (cataclysmCtx) {
                        cataclysmCtx.clearRect(0, 0, cataclysmCanvas.width, cataclysmCanvas.height);
                    }
                }
            }, 2800);
        }, 1200);

    }, 280);
}

// Particle System
let particles = [];
let mushroomClouds = [];

class BlastParticle {
    constructor(x, y, color, speedMultiplier, isCataclysm = false) {
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
        this.isCataclysm = isCataclysm;
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
        this.isCataclysm = metalKey === 'Fr' && liquidKey === 'hsbf6';
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

        // Slow cinematic smoke dispersal (slower for Fr + HSbF6 so it billows and remains clearly visible in the void)
        if (this.torusRadius > this.maxTorusRadius * 0.85) {
            const decayRate = (this.metalKey === 'Fr' && this.liquidKey === 'hsbf6') ? 0.0035 : 0.007;
            this.alpha -= decayRate;
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
    if (cataclysmCtx && cataclysmCanvas) {
        cataclysmCtx.clearRect(0, 0, cataclysmCanvas.width, cataclysmCanvas.height);
    }

    // Update & draw mushroom clouds
    for (let m = mushroomClouds.length - 1; m >= 0; m--) {
        const cloud = mushroomClouds[m];
        cloud.update();
        // Route to dedicated Cataclysm Canvas if in cataclysm mode, otherwise standard arena canvas
        const targetCtx = (cloud.isCataclysm && cataclysmCtx) ? cataclysmCtx : ctx;
        cloud.draw(targetCtx);
        if (cloud.alpha <= 0) {
            mushroomClouds.splice(m, 1);
        }
    }

    // Update & draw debris particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        const targetCtx = (p.isCataclysm && cataclysmCtx) ? cataclysmCtx : ctx;
        p.draw(targetCtx);
        if (p.alpha <= 0) {
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
        shakeTarget.classList.add(`shake-${details.shakeLevel}`);

        // Screen Cracks: Trigger instantaneously at exact onset of shaking if crackTier > 0!
        if (details.crackTier > 0) {
            screenCracks.setAttribute('data-crack-tier', details.crackTier);
            screenCracks.classList.add('active');
        }

        // Special Screen Shatter & Blackout Sequence for Francium + HSbF6
        if (activeMetal === 'Fr' && activeLiquid === 'hsbf6') {
            triggerCataclysmShatterEffect();
        }

        // 5. Spawn burst particles & mushroom cloud
        const isCataclysm = activeMetal === 'Fr' && activeLiquid === 'hsbf6';
        if (!isCataclysm && (explosionCanvas.width !== explosionCanvas.offsetWidth || explosionCanvas.height !== explosionCanvas.offsetHeight)) {
            resizeExplosionCanvas();
        }
        
        let originX, originY;
        if (isCataclysm) {
            originX = window.innerWidth / 2;
            originY = window.innerHeight * 0.78;
        } else {
            const arenaRect = reactionArena ? reactionArena.getBoundingClientRect() : { width: 900, height: 420 };
            const canvasRect = explosionCanvas.getBoundingClientRect();
            originX = (arenaRect.left + arenaRect.width / 2) - canvasRect.left;
            originY = (arenaRect.bottom - 75) - canvasRect.top;
        }
        
        let speedMult = 1.4;
        if (details.shakeLevel === 'apocalyptic') speedMult = 3.8;
        else if (details.shakeLevel === 'cataclysmic') speedMult = 3.3;
        else if (details.shakeLevel === 'hyper-nuclear') speedMult = 2.9;
        else if (activeMetal === 'Fr') speedMult = 2.8;
        else if (activeMetal === 'Cs') speedMult = 2.2;

        const totalParticles = isCataclysm ? 120 : Math.floor(data.particleCount * (1 + (shakeTiers.indexOf(details.shakeLevel) * 0.18)));
        for (let i = 0; i < totalParticles; i++) {
            particles.push(new BlastParticle(originX, originY, data.color, speedMult, isCataclysm));
            if (i % 2 === 0) {
                const particleTint = details.isNuclearTint ? '#76ff03' : (activeLiquid === 'triflic' ? '#e040fb' : '#ffffff');
                particles.push(new BlastParticle(originX, originY, particleTint, speedMult * 0.9, isCataclysm));
            }
        }

        // 6. Mushroom Cloud: Rb, Cs, Fr for normal liquids; ALL 6 metals for Triflic & HSbF6!
        if (details.hasMushroom) {
            mushroomClouds.push(new MushroomCloud(originX, originY, data.color, activeMetal, activeLiquid));
        }

        animateParticles();

        // 7. Reset screen and fade cracks once the damped shake oscillation completes smoothly
        // Higher tiers have longer natural decay oscillations (3.5s to 4.8s)
        const isCataclysmPair = activeMetal === 'Fr' && activeLiquid === 'hsbf6';
        const settleTime = isCataclysmPair ? 4800 : (details.shakeLevel === 'apocalyptic' || details.shakeLevel === 'cataclysmic' ? 4200 : (activeMetal === 'Fr' ? 3550 : 2500));

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


// =========================================================================
// SECTION: THERMAL AUTO-IGNITION & COMBUSTION LAB ENGINE
// =========================================================================
// =========================================================================
// 59 Stable Metals: Thermal Auto-Ignition & Pyrotechnic Profile Compendium
// =========================================================================
const metalCombustionData = {
    Li: {
        num: 3, sym: 'Li', name: 'Lithium', series: 'Alkali Metal', img: 'assets/metals/png/li_lithium.png',
        ignTemp: 180, isCombustible: true, flameColorName: 'Crimson Red',
        flamePalette: ['#ffffff', '#ff1744', '#d50000', '#ff5252', '#ff8a80'],
        sparkColor: '#ff8a80', hasSparks: false, flameScale: 1.1,
        oxide: 'Lithium Oxide (Li₂O)', deltaH: '-598.8 kJ/mol',
        equation: '4Li + O₂ → 2Li₂O',
        notes: 'ignites in hot air (near its melting point) and burns with a vivid crimson red flame into white Li₂O smoke.',
        use: 'Used in pyrotechnic red signal stars and lithium battery electrode processing.'
    },
    Be: {
        num: 4, sym: 'Be', name: 'Beryllium', series: 'Alkaline Earth Metal', img: 'assets/metals/png/be_beryllium.png',
        ignTemp: 1200, isCombustible: true, flameColorName: 'Dazzling White Sparks',
        flamePalette: ['#ffffff', '#e0f7fa', '#80deea', '#ffffff', '#b2ebf2'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.15,
        oxide: 'Beryllium Oxide (BeO)', deltaH: '-609.4 kJ/mol',
        equation: '2Be + O₂ → 2BeO',
        notes: 'Resists oxidation due to a dense BeO passivation layer until high temperature (high heat), where it combusts with brilliant white sparks.',
        use: 'Rocket nozzle ceramics, specialized aerospace mirrors, and neutron moderators.'
    },
    Na: {
        num: 11, sym: 'Na', name: 'Sodium', series: 'Alkali Metal', img: 'assets/metals/png/na_sodium.png',
        ignTemp: 115, isCombustible: true, flameColorName: 'Intense Golden Yellow (589 nm D-line)',
        flamePalette: ['#ffffff', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'],
        sparkColor: '#ffeb3b', hasSparks: false, flameScale: 1.3,
        oxide: 'Sodium Peroxide (Na₂O₂)', deltaH: '-510.9 kJ/mol',
        equation: '2Na + O₂ → Na₂O₂',
        notes: 'Melts when heated and catches fire in air at its ignition point, burning with an intensely bright monochromatic yellow flame.',
        use: 'Sodium vapor highway lamps, pyrotechnic yellow flares, and chemical reductions.'
    },
    Mg: {
        num: 12, sym: 'Mg', name: 'Magnesium', series: 'Alkaline Earth Metal', img: 'assets/metals/png/mg_magnesium.png',
        ignTemp: 473, isCombustible: true, flameColorName: 'Blinding White Ultraviolet',
        flamePalette: ['#ffffff', '#ffffff', '#e0ffff', '#ffffff', '#80d8ff'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.45,
        oxide: 'Magnesium Oxide (MgO)', deltaH: '-601.6 kJ/mol',
        equation: '2Mg + O₂ → 2MgO',
        notes: 'Famous demonstration metal: once ignited under the blowtorch, it burns at over 3,100°C with an unmistakable blinding ultraviolet-white brilliance.',
        use: 'Emergency naval flares, stage sparklers, military incendiaries, and flash photography.'
    },
    Al: {
        num: 13, sym: 'Al', name: 'Aluminium', series: 'Post-Transition Metal', img: 'assets/metals/png/al_aluminium.png',
        ignTemp: 660, isCombustible: true, flameColorName: 'Brilliant Silver-White',
        flamePalette: ['#ffffff', '#ffffff', '#cfd8dc', '#eceff1', '#90caf9'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.35,
        oxide: 'Aluminium Oxide (Al₂O₃)', deltaH: '-1675.7 kJ/mol',
        equation: '4Al + 3O₂ → 2Al₂O₃',
        notes: 'Extremely exothermic combustion once the 660°C melting point disrupts its protective oxide coating, generating cascading silver starbursts.',
        use: 'Space Shuttle solid rocket boosters, pyrotechnic flash powder, and thermite welding.'
    },
    K: {
        num: 19, sym: 'K', name: 'Potassium', series: 'Alkali Metal', img: 'assets/metals/png/k_potassium.png',
        ignTemp: 65, isCombustible: true, flameColorName: 'Lilac / Violet',
        flamePalette: ['#ffffff', '#ea80fc', '#aa00ff', '#e040fb', '#7c4dff'],
        sparkColor: '#ea80fc', hasSparks: false, flameScale: 1.25,
        oxide: 'Potassium Superoxide (KO₂)', deltaH: '-284.5 kJ/mol',
        equation: 'K + O₂ → KO₂',
        notes: 'Pyrophoric metal: catches fire spontaneously or at slight warmth , forming potassium superoxide with a stunning lilac-violet flame.',
        use: 'Submarine oxygen generation canisters (KO₂ scrubbers) and specialized atomic spectroscopy.'
    },
    Ca: {
        num: 20, sym: 'Ca', name: 'Calcium', series: 'Alkaline Earth Metal', img: 'assets/metals/png/ca_calcium.png',
        ignTemp: 600, isCombustible: true, flameColorName: 'Brick Red',
        flamePalette: ['#ffffff', '#ff6d00', '#dd2c00', '#ff3d00', '#ffab91'],
        sparkColor: '#ff6d00', hasSparks: true, flameScale: 1.2,
        oxide: 'Calcium Oxide (CaO / Quicklime)', deltaH: '-635.1 kJ/mol',
        equation: '2Ca + O₂ → 2CaO',
        notes: 'Burns vigorously in hot air when sufficiently heated with an intense brick-red flame and showers of white-hot embers, leaving quicklime ash.',
        use: 'Steel desulfurization flux, pyrotechnic orange fire stars, and cement chemistry.'
    },
    Sc: {
        num: 21, sym: 'Sc', name: 'Scandium', series: 'Transition Metal', img: 'assets/metals/png/sc_scandium.png',
        ignTemp: 850, isCombustible: true, flameColorName: 'Yellow-Orange Sparks',
        flamePalette: ['#ffffff', '#ffb74d', '#ff9800', '#f57c00', '#ffe0b2'],
        sparkColor: '#ffb74d', hasSparks: true, flameScale: 1.05,
        oxide: 'Scandium Oxide (Sc₂O₃)', deltaH: '-1908.8 kJ/mol',
        equation: '4Sc + 3O₂ → 2Sc₂O₃',
        notes: 'Burns in air when heated sufficiently to form yellowish-white Sc₂O₃ with golden sparks.',
        use: 'High-intensity stadium metal-halide lamps and aerospace alloys.'
    },
    Ti: {
        num: 22, sym: 'Ti', name: 'Titanium', series: 'Transition Metal', img: 'assets/metals/png/ti_titanium.png',
        ignTemp: 610, isCombustible: true, flameColorName: 'Explosive White Crackling Starbursts',
        flamePalette: ['#ffffff', '#ffffff', '#e1f5fe', '#81d4fa', '#ffffff'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.4,
        oxide: 'Titanium Dioxide (TiO₂)', deltaH: '-944.0 kJ/mol',
        equation: 'Ti + O₂ → TiO₂',
        notes: 'Renowned in pyrotechnics: titanium shavings ignite with signature branching white crackling starburst sparks that pop loudly.',
        use: 'Indoor concert pyrotechnics, stage fireworks, and titanium dioxide white pigment.'
    },
    V: {
        num: 23, sym: 'V', name: 'Vanadium', series: 'Transition Metal', img: 'assets/metals/png/v_vanadium.png',
        ignTemp: 660, isCombustible: true, flameColorName: 'Yellow-Green Sparks',
        flamePalette: ['#ffffff', '#cddc39', '#8bc34a', '#afb42b', '#dce775'],
        sparkColor: '#cddc39', hasSparks: true, flameScale: 1.1,
        oxide: 'Vanadium Pentoxide (V₂O₅)', deltaH: '-1550.6 kJ/mol',
        equation: '4V + 5O₂ → 2V₂O₅',
        notes: 'Burns in air when heated sufficiently with yellow-green sparks, producing red-orange molten drops of V₂O₅.',
        use: 'Industrial contact process catalyst for sulfuric acid and vanadium flow batteries.'
    },
    Cr: {
        num: 24, sym: 'Cr', name: 'Chromium', series: 'Transition Metal', img: 'assets/metals/png/cr_chromium.png',
        ignTemp: 1900, isCombustible: true, flameColorName: 'Silver-Blue Sparks',
        flamePalette: ['#ffffff', '#90caf9', '#64b5f6', '#42a5f5', '#bbdefb'],
        sparkColor: '#90caf9', hasSparks: true, flameScale: 1.0,
        oxide: 'Chromium(III) Oxide (Cr₂O₃)', deltaH: '-1139.7 kJ/mol',
        equation: '4Cr + 3O₂ → 2Cr₂O₃',
        notes: 'Highly resistant to combustion; bulk chromium requires intense blowtorch heat (high heat) to spark and form dark green Cr₂O₃.',
        use: 'Stainless steel oxidation resistance, hard chrome plating, and green ceramic glazes.'
    },
    Mn: {
        num: 25, sym: 'Mn', name: 'Manganese', series: 'Transition Metal', img: 'assets/metals/png/mn_manganese.png',
        ignTemp: 800, isCombustible: true, flameColorName: 'Greenish-White Sparks',
        flamePalette: ['#ffffff', '#b2dfdb', '#80cbc4', '#4db6ac', '#e0f2f1'],
        sparkColor: '#b2dfdb', hasSparks: true, flameScale: 1.1,
        oxide: 'Manganese(II,III) Oxide (Mn₃O₄)', deltaH: '-1387.8 kJ/mol',
        equation: '3Mn + 2O₂ → Mn₃O₄',
        notes: 'Powder burns in air with bright greenish-white sparks to form brownish Mn₃O₄.',
        use: 'Aluminium beverage cans, dry-cell batteries, and potassium permanganate oxidizers.'
    },
    Fe: {
        num: 26, sym: 'Fe', name: 'Iron', series: 'Transition Metal', img: 'assets/metals/png/fe_iron.png',
        ignTemp: 800, isCombustible: true, flameColorName: 'Golden Branching Sparks',
        flamePalette: ['#ffffff', '#ffb300', '#ff8f00', '#ff6f00', '#ffe082'],
        sparkColor: '#ffb300', hasSparks: true, flameScale: 1.35,
        oxide: 'Iron(II,III) Oxide (Fe₃O₄ / Magnetite)', deltaH: '-1118.4 kJ/mol',
        equation: '3Fe + 2O₂ → Fe₃O₄',
        notes: 'Iron wool or filings ignite readily when sufficiently heated, burning with the quintessential golden branching sparks seen in holiday sparklers.',
        use: 'Traditional Fourth of July sparklers, thermite reactions, and steel metallurgy.'
    },
    Co: {
        num: 27, sym: 'Co', name: 'Cobalt', series: 'Transition Metal', img: 'assets/metals/png/co_cobalt.png',
        ignTemp: 900, isCombustible: true, flameColorName: 'Silver-White Sparks',
        flamePalette: ['#ffffff', '#cfd8dc', '#b0bec5', '#90a4ae', '#eceff1'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.0,
        oxide: 'Cobalt(II,III) Oxide (Co₃O₄)', deltaH: '-891.0 kJ/mol',
        equation: '3Co + 2O₂ → Co₃O₄',
        notes: 'Combusts at red heat (high heat) with bright sparks, turning into black cobalt oxide.',
        use: 'Lithium-ion EV batteries (NMC), Alnico permanent magnets, and cobalt blue pigments.'
    },
    Ni: {
        num: 28, sym: 'Ni', name: 'Nickel', series: 'Transition Metal', img: 'assets/metals/png/ni_nickel.png',
        ignTemp: 950, isCombustible: true, flameColorName: 'Silver Sparks',
        flamePalette: ['#ffffff', '#eceff1', '#cfd8dc', '#b0bec5', '#ffffff'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 0.95,
        oxide: 'Nickel(II) Oxide (NiO)', deltaH: '-239.7 kJ/mol',
        equation: '2Ni + O₂ → 2NiO',
        notes: 'Burns sluggishly in air when sufficiently heated with silver-white sparks, forming a green-black NiO crust.',
        use: 'Raney nickel hydrogenation catalysts, coin alloys, and rechargeable batteries.'
    },
    Cu: {
        num: 29, sym: 'Cu', name: 'Copper', series: 'Transition Metal', img: 'assets/metals/png/cu_copper.png',
        ignTemp: 1050, isCombustible: true, flameColorName: 'Emerald Green / Azure Blue',
        flamePalette: ['#ffffff', '#00e676', '#00c853', '#00b0ff', '#1de9b6'],
        sparkColor: '#00e676', hasSparks: false, flameScale: 1.3,
        oxide: 'Copper(II) Oxide (CuO)', deltaH: '-157.3 kJ/mol',
        equation: '2Cu + O₂ → 2CuO',
        notes: 'Iconic flame test: heated copper vaporizes and tints the entire flame a brilliant, glowing emerald green and turquoise azure.',
        use: 'Pyrotechnic green/blue firework stars, copper wiring, and architectural bronze.'
    },
    Zn: {
        num: 30, sym: 'Zn', name: 'Zinc', series: 'Transition Metal', img: 'assets/metals/png/zn_zinc.png',
        ignTemp: 500, isCombustible: true, flameColorName: 'Ghostly Cyan-Green with Dense White Smoke',
        flamePalette: ['#ffffff', '#00e5ff', '#18ffff', '#00b8d4', '#84ffff'],
        sparkColor: '#00e5ff', hasSparks: true, flameScale: 1.3,
        oxide: 'Zinc Oxide (ZnO / Philosopher\'s Wool)', deltaH: '-350.5 kJ/mol',
        equation: '2Zn + O₂ → 2ZnO',
        notes: 'Boils when heated and burns vigorously with a ghostly cyan-green flame, billowing thick plumes of fluffy white ZnO smoke.',
        use: 'Military smoke screen pots, galvanized anti-rust coatings, and sunscreen UV blockers.'
    },
    Ga: {
        num: 31, sym: 'Ga', name: 'Gallium', series: 'Post-Transition Metal', img: 'assets/metals/png/ga_gallium.png',
        ignTemp: 1000, isCombustible: true, flameColorName: 'Violet Flame',
        flamePalette: ['#ffffff', '#ba68c8', '#ab47bc', '#8e24aa', '#e1bee7'],
        sparkColor: '#ba68c8', hasSparks: false, flameScale: 1.0,
        oxide: 'Gallium(III) Oxide (Ga₂O₃)', deltaH: '-1089.1 kJ/mol',
        equation: '4Ga + 3O₂ → 2Ga₂O₃',
        notes: 'Melts in hands at 29.8°C; liquid gallium requires blowtorch heat (high heat) to combust, emitting a delicate violet flame.',
        use: 'Gallium nitride (GaN) fast chargers, blue LED lasers, and Galinstan liquid metal.'
    },
    Rb: {
        num: 37, sym: 'Rb', name: 'Rubidium', series: 'Alkali Metal', img: 'assets/metals/png/rb_rubidium.png',
        ignTemp: 20, isCombustible: true, flameColorName: 'Vivid Red-Violet',
        flamePalette: ['#ffffff', '#ff1744', '#d500f9', '#aa00ff', '#ff4081'],
        sparkColor: '#ff1744', hasSparks: false, flameScale: 1.35,
        oxide: 'Rubidium Superoxide (RbO₂)', deltaH: '-279.0 kJ/mol',
        equation: 'Rb + O₂ → RbO₂',
        notes: 'SPONTANEOUSLY PYROPHORIC! Ignites in open room air spontaneously with an aggressive red-violet flame and reacts explosively with moisture.',
        use: 'Global GPS atomic clocks, photocells, and quantum Bose-Einstein condensates.'
    },
    Sr: {
        num: 38, sym: 'Sr', name: 'Strontium', series: 'Alkaline Earth Metal', img: 'assets/metals/png/sr_strontium.png',
        ignTemp: 540, isCombustible: true, flameColorName: 'Deep Crimson Red',
        flamePalette: ['#ffffff', '#ff1744', '#d50000', '#b71c1c', '#ff8a80'],
        sparkColor: '#ff1744', hasSparks: true, flameScale: 1.35,
        oxide: 'Strontium Oxide (SrO)', deltaH: '-592.0 kJ/mol',
        equation: '2Sr + O₂ → 2SrO',
        notes: 'The undisputed king of red fire: ignites at its ignition point and burns with a deep, rich crimson red flame.',
        use: 'Highway emergency road flares, fireworks crimson shells, and strontium titanate optics.'
    },
    Y: {
        num: 39, sym: 'Y', name: 'Yttrium', series: 'Transition Metal', img: 'assets/metals/png/y_yttrium.png',
        ignTemp: 700, isCombustible: true, flameColorName: 'Bright Red Sparks',
        flamePalette: ['#ffffff', '#ff5252', '#ff1744', '#d50000', '#ff8a80'],
        sparkColor: '#ff5252', hasSparks: true, flameScale: 1.1,
        oxide: 'Yttrium Oxide (Y₂O₃)', deltaH: '-1905.3 kJ/mol',
        equation: '4Y + 3O₂ → 2Y₂O₃',
        notes: 'Burns in air when heated sufficiently with brilliant red sparks to yield white Y₂O₃ powder.',
        use: 'YBCO high-temperature superconductors and Nd:YAG surgical lasers.'
    },
    Zr: {
        num: 40, sym: 'Zr', name: 'Zirconium', series: 'Transition Metal', img: 'assets/metals/png/zr_zirconium.png',
        ignTemp: 500, isCombustible: true, flameColorName: 'Blinding Golden-White Flash',
        flamePalette: ['#ffffff', '#fff9c4', '#fff59d', '#ffffff', '#ffe082'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.45,
        oxide: 'Zirconium Dioxide (ZrO₂)', deltaH: '-1100.6 kJ/mol',
        equation: 'Zr + O₂ → ZrO₂',
        notes: 'Extremely combustible when powdered: burns at ~4,400°C with a blinding sunburst flash and cascading white sparks.',
        use: 'Photographic flashbulbs, nuclear fuel rod cladding, and cubic zirconia gems.'
    },
    Nb: {
        num: 41, sym: 'Nb', name: 'Niobium', series: 'Transition Metal', img: 'assets/metals/png/nb_niobium.png',
        ignTemp: 800, isCombustible: true, flameColorName: 'Bluish-White Sparks',
        flamePalette: ['#ffffff', '#80d8ff', '#40c4ff', '#00b0ff', '#e1f5fe'],
        sparkColor: '#80d8ff', hasSparks: true, flameScale: 1.05,
        oxide: 'Niobium Pentoxide (Nb₂O₅)', deltaH: '-1899.5 kJ/mol',
        equation: '4Nb + 5O₂ → 2Nb₂O₅',
        notes: 'Combusts when heated sufficiently in oxygen with bluish-white sparks, forming dense white Nb₂O₅.',
        use: 'Superconducting MRI magnet coils (NbTi) and jet engine rocket nozzles.'
    },
    Mo: {
        num: 42, sym: 'Mo', name: 'Molybdenum', series: 'Transition Metal', img: 'assets/metals/png/mo_molybdenum.png',
        ignTemp: 600, isCombustible: true, flameColorName: 'Yellow-Green',
        flamePalette: ['#ffffff', '#cddc39', '#afb42b', '#d4e157', '#e8f5e9'],
        sparkColor: '#cddc39', hasSparks: false, flameScale: 1.1,
        oxide: 'Molybdenum Trioxide (MoO₃)', deltaH: '-745.1 kJ/mol',
        equation: '2Mo + 3O₂ → 2MoO₃',
        notes: 'Oxidizes to yellow MoO₃ vapor that sublimes and colors the hot gas a distinct yellow-green.',
        use: 'Ultra-high strength alloy steels and molybdenum disulfide industrial grease.'
    },
    Ru: {
        num: 44, sym: 'Ru', name: 'Ruthenium', series: 'Transition Metal', img: 'assets/metals/png/ru_ruthenium.png',
        ignTemp: 800, isCombustible: true, flameColorName: 'White-Hot Sparks (Forms Toxic RuO₄)',
        flamePalette: ['#ffffff', '#eceff1', '#cfd8dc', '#90a4ae', '#ffffff'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.0,
        oxide: 'Ruthenium Dioxide (RuO₂) & Tetroxide (RuO₄)', deltaH: '-305.0 kJ/mol',
        equation: 'Ru + O₂ → RuO₂',
        notes: 'Burns in air when heated sufficiently with white sparks, generating volatile toxic RuO₄ fumes.',
        use: 'Nobel-winning Grubbs olefin metathesis catalysts and hard disk write heads.'
    },
    Rh: {
        num: 45, sym: 'Rh', name: 'Rhodium', series: 'Noble Transition Metal', img: 'assets/metals/png/rh_rhodium.png',
        ignTemp: 9999, isCombustible: false, flameColorName: 'Non-Combustible (Noble Metal)',
        flamePalette: ['#ffffff', '#e0f7fa', '#b2ebf2', '#80deea'],
        sparkColor: '#ffffff', hasSparks: false, flameScale: 0,
        oxide: 'None (Immune to oxidation)', deltaH: '0.0 kJ/mol',
        equation: 'Rh + O₂ → No Reaction (Noble)',
        notes: 'Completely noble: will NOT burn or oxidize even under extreme blowtorch heat.',
        use: 'Automotive 3-way catalytic converters and corrosion-proof jewelry plating.'
    },
    Pd: {
        num: 46, sym: 'Pd', name: 'Palladium', series: 'Noble Transition Metal', img: 'assets/metals/png/pd_palladium.png',
        ignTemp: 9999, isCombustible: false, flameColorName: 'Non-Combustible (Absorbs H₂)',
        flamePalette: ['#ffffff', '#eceff1', '#cfd8dc'],
        sparkColor: '#ffffff', hasSparks: false, flameScale: 0,
        oxide: 'None (Immune to open combustion)', deltaH: '0.0 kJ/mol',
        equation: 'Pd + O₂ → No Reaction (Noble)',
        notes: 'Noble transition metal that absorbs 900x its volume in hydrogen gas but does not burn in air.',
        use: 'Suzuki-Miyaura carbon coupling catalysis and hydrogen fuel purification.'
    },
    Ag: {
        num: 47, sym: 'Ag', name: 'Silver', series: 'Transition Metal', img: 'assets/metals/png/ag_silver.png',
        ignTemp: 9999, isCombustible: false, flameColorName: 'Non-Combustible (Spits Oxygen When Molten)',
        flamePalette: ['#ffffff', '#e8f5e9', '#c8e6c9'],
        sparkColor: '#ffffff', hasSparks: false, flameScale: 0,
        oxide: 'None (Ag₂O decomposes above 200°C)', deltaH: '-31.1 kJ/mol (Unstable)',
        equation: 'Ag + O₂ → No Reaction (Oxide decomposes)',
        notes: 'Silver will not burn; its oxide Ag₂O decomposes back to pure silver when sufficiently heated. Molten silver absorbs oxygen and "spits" it out upon cooling.',
        use: 'Highest electrical conductivity wiring, solar panels, and antimicrobial coatings.'
    },
    Cd: {
        num: 48, sym: 'Cd', name: 'Cadmium', series: 'Transition Metal', img: 'assets/metals/png/cd_cadmium.png',
        ignTemp: 350, isCombustible: true, flameColorName: 'Brick Red / Yellowish Flame',
        flamePalette: ['#ffffff', '#ff7043', '#d84315', '#bf360c', '#ffab91'],
        sparkColor: '#ff7043', hasSparks: false, flameScale: 1.15,
        oxide: 'Cadmium Oxide (CdO)', deltaH: '-258.2 kJ/mol',
        equation: '2Cd + O₂ → 2CdO',
        notes: 'Ignites at its ignition point and burns with a brick-red flame to generate toxic brown CdO fumes.',
        use: 'Rechargeable NiCad batteries, solar panels, and neutron absorber control rods.'
    },
    In: {
        num: 49, sym: 'In', name: 'Indium', series: 'Post-Transition Metal', img: 'assets/metals/png/in_indium.png',
        ignTemp: 800, isCombustible: true, flameColorName: 'Deep Indigo Blue',
        flamePalette: ['#ffffff', '#3d5afe', '#2979ff', '#00b0ff', '#8c9eff'],
        sparkColor: '#3d5afe', hasSparks: false, flameScale: 1.25,
        oxide: 'Indium(III) Oxide (In₂O₃)', deltaH: '-925.8 kJ/mol',
        equation: '4In + 3O₂ → 2In₂O₃',
        notes: 'Famous origin: named from the brilliant, glowing deep indigo blue spectral line it emits when burned.',
        use: 'Indium Tin Oxide (ITO) transparent conductive screens in every smartphone.'
    },
    Sn: {
        num: 50, sym: 'Sn', name: 'Tin', series: 'Post-Transition Metal', img: 'assets/metals/png/sn_tin.png',
        ignTemp: 1000, isCombustible: true, flameColorName: 'Faint Lilac / White',
        flamePalette: ['#ffffff', '#e1bee7', '#ce93d8', '#ba68c8', '#f3e5f5'],
        sparkColor: '#e1bee7', hasSparks: false, flameScale: 1.0,
        oxide: 'Tin(IV) Oxide (SnO₂ / Cassiterite)', deltaH: '-577.6 kJ/mol',
        equation: 'Sn + O₂ → SnO₂',
        notes: 'Melts when heated but requires intense heat (high heat) to burn with a gentle lilac-white flame.',
        use: 'Lead-free circuit board solder, bronze alloys, and food tinplate cans.'
    },
    Cs: {
        num: 55, sym: 'Cs', name: 'Caesium', series: 'Alkali Metal', img: 'assets/metals/png/cs_caesium.png',
        ignTemp: 20, isCombustible: true, flameColorName: 'Brilliant Sky Blue (Azure)',
        flamePalette: ['#ffffff', '#00b0ff', '#0091ea', '#00e5ff', '#80d8ff'],
        sparkColor: '#00b0ff', hasSparks: false, flameScale: 1.4,
        oxide: 'Caesium Superoxide (CsO₂)', deltaH: '-295.0 kJ/mol',
        equation: 'Cs + O₂ → CsO₂',
        notes: 'SPONTANEOUSLY PYROPHORIC! Catches fire immediately upon exposure to air spontaneously with an exquisite sky blue flame (Latin caesius).',
        use: 'Primary SI standard for atomic clocks (defining 1 second) and ion rocket engines.'
    },
    Ba: {
        num: 56, sym: 'Ba', name: 'Barium', series: 'Alkaline Earth Metal', img: 'assets/metals/png/ba_barium.png',
        ignTemp: 400, isCombustible: true, flameColorName: 'Electric Apple Green',
        flamePalette: ['#ffffff', '#76ff03', '#64dd17', '#00e676', '#b2ff59'],
        sparkColor: '#76ff03', hasSparks: true, flameScale: 1.35,
        oxide: 'Barium Oxide (BaO) & Peroxide (BaO₂)', deltaH: '-553.5 kJ/mol',
        equation: '2Ba + O₂ → 2BaO',
        notes: 'The pyrotechnic standard for vibrant green: ignites when heated sufficiently with an electric apple-green fireball.',
        use: 'Emerald-green fireworks shells and medical barium GI contrast meals.'
    },
    La: {
        num: 57, sym: 'La', name: 'Lanthanum', series: 'Lanthanide', img: 'assets/metals/png/la_lanthanum.png',
        ignTemp: 440, isCombustible: true, flameColorName: 'White Sparks',
        flamePalette: ['#ffffff', '#eceff1', '#cfd8dc', '#ffffff'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.1,
        oxide: 'Lanthanum Oxide (La₂O₃)', deltaH: '-1793.7 kJ/mol',
        equation: '4La + 3O₂ → 2La₂O₃',
        notes: 'Ignites at its ignition point in air, showering white sparks to yield white La₂O₃.',
        use: 'Hybrid car NiMH batteries and camera lens optical glass.'
    },
    Ce: {
        num: 58, sym: 'Ce', name: 'Cerium', series: 'Lanthanide', img: 'assets/metals/png/ce_cerium.png',
        ignTemp: 160, isCombustible: true, flameColorName: 'Blinding White Lighter Flint Sparks',
        flamePalette: ['#ffffff', '#fff9c4', '#ffffff', '#e0f7fa'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.4,
        oxide: 'Cerium(IV) Oxide (CeO₂)', deltaH: '-1089.9 kJ/mol',
        equation: 'Ce + O₂ → CeO₂',
        notes: 'The pyrophoric metal inside lighter flints (Mischmetal): friction generates hot white spark showers instantly when heated sufficiently.',
        use: 'Cigarette lighter flints, catalytic converter oxygen buffers, and glass polishing.'
    },
    Pr: {
        num: 59, sym: 'Pr', name: 'Praseodymium', series: 'Lanthanide', img: 'assets/metals/png/pr_praseodymium.png',
        ignTemp: 290, isCombustible: true, flameColorName: 'Pale Yellow Sparks',
        flamePalette: ['#ffffff', '#fff59d', '#ffee58', '#fdd835'],
        sparkColor: '#ffee58', hasSparks: true, flameScale: 1.15,
        oxide: 'Praseodymium(III,IV) Oxide (Pr₆O₁₁)', deltaH: '-1809.6 kJ/mol',
        equation: '12Pr + 11O₂ → 2Pr₆O₁₁',
        notes: 'Ignites in air when heated with pale yellow sparks, forming dark brown Pr₆O₁₁.',
        use: 'Didymium welder goggles (filtering sodium glare) and neodymium magnets.'
    },
    Nd: {
        num: 60, sym: 'Nd', name: 'Neodymium', series: 'Lanthanide', img: 'assets/metals/png/nd_neodymium.png',
        ignTemp: 340, isCombustible: true, flameColorName: 'Golden-Yellow Sparks',
        flamePalette: ['#ffffff', '#ffe082', '#ffca28', '#ffb300'],
        sparkColor: '#ffe082', hasSparks: true, flameScale: 1.2,
        oxide: 'Neodymium Oxide (Nd₂O₃)', deltaH: '-1807.9 kJ/mol',
        equation: '4Nd + 3O₂ → 2Nd₂O₃',
        notes: 'Ignites when heated sufficiently with a shower of golden sparks, forming blue-gray Nd₂O₃.',
        use: 'World\'s strongest permanent magnets (Nd₂Fe₁₄B) in EV motors and wind turbines.'
    },
    Sm: {
        num: 62, sym: 'Sm', name: 'Samarium', series: 'Lanthanide', img: 'assets/metals/png/sm_samarium.png',
        ignTemp: 150, isCombustible: true, flameColorName: 'Yellow Sparks',
        flamePalette: ['#ffffff', '#fff176', '#ffee58', '#fbc02d'],
        sparkColor: '#fff176', hasSparks: true, flameScale: 1.2,
        oxide: 'Samarium Oxide (Sm₂O₃)', deltaH: '-1823.0 kJ/mol',
        equation: '4Sm + 3O₂ → 2Sm₂O₃',
        notes: 'Pyrophoric: ignites when heated sufficiently with brilliant yellow sparks, forming off-white Sm₂O₃.',
        use: 'High-temperature Samarium-Cobalt (SmCo) aerospace magnets.'
    },
    Eu: {
        num: 63, sym: 'Eu', name: 'Europium', series: 'Lanthanide', img: 'assets/metals/png/eu_europium.png',
        ignTemp: 180, isCombustible: true, flameColorName: 'Crimson Red Glow',
        flamePalette: ['#ffffff', '#ff1744', '#d50000', '#ff5252'],
        sparkColor: '#ff1744', hasSparks: false, flameScale: 1.2,
        oxide: 'Europium(III) Oxide (Eu₂O₃)', deltaH: '-1662.7 kJ/mol',
        equation: '4Eu + 3O₂ → 2Eu₂O₃',
        notes: 'Most reactive rare-earth: ignites at its ignition point and oxidizes with a rich crimson glow.',
        use: 'Anti-counterfeiting phosphors in Euro banknotes and red color phosphors.'
    },
    Gd: {
        num: 64, sym: 'Gd', name: 'Gadolinium', series: 'Lanthanide', img: 'assets/metals/png/gd_gadolinium.png',
        ignTemp: 600, isCombustible: true, flameColorName: 'White Sparks',
        flamePalette: ['#ffffff', '#eceff1', '#cfd8dc', '#ffffff'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.05,
        oxide: 'Gadolinium Oxide (Gd₂O₃)', deltaH: '-1819.6 kJ/mol',
        equation: '4Gd + 3O₂ → 2Gd₂O₃',
        notes: 'Burns in air when heated sufficiently with sparkling white flashes to yield white Gd₂O₃.',
        use: 'Intravenous MRI magnetic contrast agents and magnetic refrigeration.'
    },
    Tb: {
        num: 65, sym: 'Tb', name: 'Terbium', series: 'Lanthanide', img: 'assets/metals/png/tb_terbium.png',
        ignTemp: 500, isCombustible: true, flameColorName: 'Intense Green Glow',
        flamePalette: ['#ffffff', '#00e676', '#00c853', '#76ff03', '#b9f6ca'],
        sparkColor: '#00e676', hasSparks: false, flameScale: 1.15,
        oxide: 'Terbium(III,IV) Oxide (Tb₄O₇)', deltaH: '-1865.2 kJ/mol',
        equation: '8Tb + 7O₂ → 2Tb₄O₇',
        notes: 'Burns when heated sufficiently, emitting a characteristic glowing green spectral emission.',
        use: 'Green phosphors in display tubes and naval sonar transducers.'
    },
    Dy: {
        num: 66, sym: 'Dy', name: 'Dysprosium', series: 'Lanthanide', img: 'assets/metals/png/dy_dysprosium.png',
        ignTemp: 650, isCombustible: true, flameColorName: 'Silver Sparks',
        flamePalette: ['#ffffff', '#cfd8dc', '#b0bec5', '#ffffff'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.05,
        oxide: 'Dysprosium Oxide (Dy₂O₃)', deltaH: '-1863.1 kJ/mol',
        equation: '4Dy + 3O₂ → 2Dy₂O₃',
        notes: 'Combusts when heated sufficiently with silver-white sparks into white Dy₂O₃.',
        use: 'Heat stabilization of electric car drive motor magnets.'
    },
    Ho: {
        num: 67, sym: 'Ho', name: 'Holmium', series: 'Lanthanide', img: 'assets/metals/png/ho_holmium.png',
        ignTemp: 800, isCombustible: true, flameColorName: 'Yellow Sparks',
        flamePalette: ['#ffffff', '#ffeb3b', '#fdd835', '#ffee58'],
        sparkColor: '#ffeb3b', hasSparks: true, flameScale: 1.05,
        oxide: 'Holmium Oxide (Ho₂O₃)', deltaH: '-1880.7 kJ/mol',
        equation: '4Ho + 3O₂ → 2Ho₂O₃',
        notes: 'Burns in air when heated sufficiently with yellow sparks, leaving pale yellow Ho₂O₃.',
        use: 'Medical Holmium:YAG lasers for kidney stone fragmentation.'
    },
    Er: {
        num: 68, sym: 'Er', name: 'Erbium', series: 'Lanthanide', img: 'assets/metals/png/er_erbium.png',
        ignTemp: 850, isCombustible: true, flameColorName: 'Pink / Violet Glow',
        flamePalette: ['#ffffff', '#f48fb1', '#ec407a', '#d81b60', '#f8bbd0'],
        sparkColor: '#f48fb1', hasSparks: false, flameScale: 1.1,
        oxide: 'Erbium Oxide (Er₂O₃)', deltaH: '-1897.9 kJ/mol',
        equation: '4Er + 3O₂ → 2Er₂O₃',
        notes: 'Burns in air when heated sufficiently, producing distinct pink-tinted Er₂O₃ oxide crystals.',
        use: 'Erbium-doped fiber amplifiers (EDFAs) carrying global internet traffic.'
    },
    Tm: {
        num: 69, sym: 'Tm', name: 'Thulium', series: 'Lanthanide', img: 'assets/metals/png/tm_thulium.png',
        ignTemp: 900, isCombustible: true, flameColorName: 'Silver Sparks',
        flamePalette: ['#ffffff', '#cfd8dc', '#eceff1', '#ffffff'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.0,
        oxide: 'Thulium Oxide (Tm₂O₃)', deltaH: '-1888.7 kJ/mol',
        equation: '4Tm + 3O₂ → 2Tm₂O₃',
        notes: 'Burns sluggishly in air when sufficiently heated with silver sparks, forming white Tm₂O₃.',
        use: 'Portable medical X-ray sources and specialized tactical lasers.'
    },
    Yb: {
        num: 70, sym: 'Yb', name: 'Ytterbium', series: 'Lanthanide', img: 'assets/metals/png/yb_ytterbium.png',
        ignTemp: 400, isCombustible: true, flameColorName: 'Silver Sparks',
        flamePalette: ['#ffffff', '#e0e0e0', '#cfd8dc', '#ffffff'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.1,
        oxide: 'Ytterbium Oxide (Yb₂O₃)', deltaH: '-1814.6 kJ/mol',
        equation: '4Yb + 3O₂ → 2Yb₂O₃',
        notes: 'Combusts when heated sufficiently with white-silver sparks to form white Yb₂O₃.',
        use: 'Next-generation optical atomic clocks with precision beyond 1 second in billions of years.'
    },
    Lu: {
        num: 71, sym: 'Lu', name: 'Lutetium', series: 'Lanthanide', img: 'assets/metals/png/lu_lutetium.png',
        ignTemp: 950, isCombustible: true, flameColorName: 'White Sparks',
        flamePalette: ['#ffffff', '#eceff1', '#cfd8dc', '#ffffff'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.0,
        oxide: 'Lutetium Oxide (Lu₂O₃)', deltaH: '-1878.2 kJ/mol',
        equation: '4Lu + 3O₂ → 2Lu₂O₃',
        notes: 'Heaviest lanthanide: burns when heated sufficiently with white sparks, yielding white Lu₂O₃.',
        use: 'PET scan detector crystals and cancer radioligand therapy.'
    },
    Hf: {
        num: 72, sym: 'Hf', name: 'Hafnium', series: 'Transition Metal', img: 'assets/metals/png/hf_hafnium.png',
        ignTemp: 600, isCombustible: true, flameColorName: 'White Sparks',
        flamePalette: ['#ffffff', '#eceff1', '#ffffff', '#cfd8dc'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.15,
        oxide: 'Hafnium Dioxide (HfO₂)', deltaH: '-1144.7 kJ/mol',
        equation: 'Hf + O₂ → HfO₂',
        notes: 'Pyrophoric when finely powdered; bulk metal burns when sufficiently heated with bright white sparks.',
        use: 'High-k dielectric insulation in modern smartphone and PC processor gates.'
    },
    Ta: {
        num: 73, sym: 'Ta', name: 'Tantalum', series: 'Refractory Transition Metal', img: 'assets/metals/png/ta_tantalum.png',
        ignTemp: 9999, isCombustible: false, flameColorName: 'Non-Combustible (Extreme Refractory)',
        flamePalette: ['#ffffff', '#90a4ae', '#78909c'],
        sparkColor: '#ffffff', hasSparks: false, flameScale: 0,
        oxide: 'Tantalum Pentoxide (Ta₂O₅ at extreme heat)', deltaH: '-2046.0 kJ/mol',
        equation: 'Ta + O₂ → No Open Flame Combustion',
        notes: 'Almost completely immune to attack by air, flames, and acids up to 1500°C. Does not burn with a flame.',
        use: 'Miniature smartphone electrolytic capacitors and biocompatible bone implants.'
    },
    W: {
        num: 74, sym: 'W', name: 'Tungsten', series: 'Transition Metal', img: 'assets/metals/png/w_tungsten.png',
        ignTemp: 900, isCombustible: true, flameColorName: 'Incandescent White-Hot Glow',
        flamePalette: ['#ffffff', '#ffffff', '#fff9c4', '#fff59d', '#ffe082'],
        sparkColor: '#ffffff', hasSparks: false, flameScale: 1.2,
        oxide: 'Tungsten Trioxide (WO₃)', deltaH: '-842.9 kJ/mol',
        equation: '2W + 3O₂ → 2WO₃',
        notes: 'Highest melting point of all elements (3,422°C): incandesces blindingly white-hot in air when heated as it slowly oxidizes into yellow WO₃ smoke.',
        use: 'Incandescent bulb filaments, rocket engine nozzles, and armor-piercing sabots.'
    },
    Re: {
        num: 75, sym: 'Re', name: 'Rhenium', series: 'Transition Metal', img: 'assets/metals/png/re_rhenium.png',
        ignTemp: 1000, isCombustible: true, flameColorName: 'Silver Sparks',
        flamePalette: ['#ffffff', '#eceff1', '#b0bec5', '#90a4ae'],
        sparkColor: '#ffffff', hasSparks: true, flameScale: 1.0,
        oxide: 'Rhenium Heptoxide (Re₂O₇)', deltaH: '-1240.0 kJ/mol',
        equation: '4Re + 7O₂ → 2Re₂O₇',
        notes: 'One of the rarest elements: burns when sufficiently heated with silver sparks, vaporizing into yellow Re₂O₇ smoke.',
        use: 'Jet engine turbine blade superalloys and lead-free octane catalysts.'
    },
    Os: {
        num: 76, sym: 'Os', name: 'Osmium', series: 'Transition Metal', img: 'assets/metals/png/os_osmium.png',
        ignTemp: 9999, isCombustible: false, flameColorName: 'Non-Combustible (Forms Toxic OsO₄)',
        flamePalette: ['#ffffff', '#80deea', '#4dd0e1'],
        sparkColor: '#ffffff', hasSparks: false, flameScale: 0,
        oxide: 'Osmium Tetroxide (OsO₄)', deltaH: '-394.1 kJ/mol',
        equation: 'Os + 2O₂ → OsO₄ (No Open Flame)',
        notes: 'Densest element on Earth (22.59 g/cm³); does not burn with an open flame, but slowly oxidizes to toxic, volatile OsO₄.',
        use: 'Fountain pen tipping pellets and forensic fingerprint staining.'
    },
    Ir: {
        num: 77, sym: 'Ir', name: 'Iridium', series: 'Noble Transition Metal', img: 'assets/metals/png/ir_iridium.png',
        ignTemp: 9999, isCombustible: false, flameColorName: 'Non-Combustible (Corrosion Immune)',
        flamePalette: ['#ffffff', '#b2ebf2', '#80deea'],
        sparkColor: '#ffffff', hasSparks: false, flameScale: 0,
        oxide: 'None (Immune to fire)', deltaH: '0.0 kJ/mol',
        equation: 'Ir + O₂ → No Reaction (Noble)',
        notes: 'The most corrosion-resistant metal known: completely immune to attack by air, fire, water, and aqua regia.',
        use: 'High-performance aircraft spark plugs and crucible vessels for laser single crystals.'
    },
    Pt: {
        num: 78, sym: 'Pt', name: 'Platinum', series: 'Noble Transition Metal', img: 'assets/metals/png/pt_platinum.png',
        ignTemp: 9999, isCombustible: false, flameColorName: 'Non-Combustible (Noble Metal - Standard Flame Wire)',
        flamePalette: ['#ffffff', '#eceff1', '#cfd8dc'],
        sparkColor: '#ffffff', hasSparks: false, flameScale: 0,
        oxide: 'None (Immune to open combustion)', deltaH: '0.0 kJ/mol',
        equation: 'Pt + O₂ → No Reaction (Noble)',
        notes: 'Noble metal that never oxidizes in flame. Used as the wire loop in laboratory flame tests specifically because it has zero flame color!',
        use: 'Flame test loops, automotive catalytic converters, and cisplatin cancer drugs.'
    },
    Au: {
        num: 79, sym: 'Au', name: 'Gold', series: 'Noble Transition Metal', img: 'assets/metals/png/au_gold.png',
        ignTemp: 9999, isCombustible: false, flameColorName: 'None (Completely Noble)',
        flamePalette: ['#ffffff', '#fff9c4', '#ffd54f'],
        sparkColor: '#ffd54f', hasSparks: false, flameScale: 0,
        oxide: 'None (Thermodynamically unreactive)', deltaH: '0.0 kJ/mol',
        equation: 'Au + O₂ → No Reaction (Completely Noble)',
        notes: 'The quintessential noble metal: completely unreactive with oxygen at any temperature. Melts into yellow liquid with zero oxidation.',
        use: 'Gold bullion, electronics interconnect wire bonds, and James Webb Space Telescope mirrors.'
    },
    Hg: {
        num: 80, sym: 'Hg', name: 'Mercury', series: 'Transition Metal', img: 'assets/metals/png/hg_mercury.png',
        ignTemp: 350, isCombustible: true, flameColorName: 'Bluish-Green Glow with Toxic Vapor',
        flamePalette: ['#ffffff', '#00e5ff', '#18ffff', '#00b0ff', '#80d8ff'],
        sparkColor: '#00e5ff', hasSparks: false, flameScale: 1.0,
        oxide: 'Mercury(II) Oxide (HgO)', deltaH: '-90.8 kJ/mol',
        equation: '2Hg + O₂ → 2HgO',
        notes: 'Liquid metal that reacts at its ignition point with air to form red HgO scales while emitting a faint bluish-green glow.',
        use: 'Mercury-vapor street lamps and historic thermometer barometers.'
    },
    Tl: {
        num: 81, sym: 'Tl', name: 'Thallium', series: 'Post-Transition Metal', img: 'assets/metals/png/tl_thallium.png',
        ignTemp: 300, isCombustible: true, flameColorName: 'Pure Emerald Green',
        flamePalette: ['#ffffff', '#00e676', '#00c853', '#69f0ae', '#b9f6ca'],
        sparkColor: '#00e676', hasSparks: false, flameScale: 1.3,
        oxide: 'Thallium(I) Oxide (Tl₂O)', deltaH: '-178.6 kJ/mol',
        equation: '4Tl + O₂ → 2Tl₂O',
        notes: 'Named from Greek thallos (green twig): heated thallium burns when heated sufficiently with an intensely pure, beautiful emerald green flame.',
        use: 'Low-melting optical glasses and medical cardiac perfusion scintigraphy.'
    },
    Pb: {
        num: 82, sym: 'Pb', name: 'Lead', series: 'Post-Transition Metal', img: 'assets/metals/png/pb_lead.png',
        ignTemp: 600, isCombustible: true, flameColorName: 'Faint Blue-White',
        flamePalette: ['#ffffff', '#90caf9', '#64b5f6', '#42a5f5', '#bbdefb'],
        sparkColor: '#90caf9', hasSparks: false, flameScale: 1.0,
        oxide: 'Lead(II) Oxide (PbO / Litharge)', deltaH: '-217.3 kJ/mol',
        equation: '2Pb + O₂ → 2PbO',
        notes: 'Melts when heated; at red heat (high heat), liquid lead burns sluggishly with a faint blue-white flame into yellow litharge (PbO).',
        use: 'Lead-acid car batteries and hospital radiation X-ray aprons.'
    },
    Bi: {
        num: 83, sym: 'Bi', name: 'Bismuth', series: 'Post-Transition Metal', img: 'assets/metals/png/bi_bismuth.png',
        ignTemp: 500, isCombustible: true, flameColorName: 'Iridescent Azure Blue',
        flamePalette: ['#ffffff', '#00b0ff', '#0091ea', '#80d8ff', '#e1f5fe'],
        sparkColor: '#00b0ff', hasSparks: false, flameScale: 1.2,
        oxide: 'Bismuth(III) Oxide (Bi₂O₃)', deltaH: '-573.9 kJ/mol',
        equation: '4Bi + 3O₂ → 2Bi₂O₃',
        notes: 'Heaviest non-toxic metal: burns in air when heated sufficiently with a magnificent iridescent azure blue flame into canary-yellow Bi₂O₃.',
        use: 'Pepto-Bismol bismuth subsalicylate medicine and non-toxic shot.'
    }
};



// Pure Oxygen (100% O2) Thermal Auto-Ignition Temperatures (°C)
// Elevated O2 partial pressure accelerates chemical oxidation kinetics,
// lowering ignition thresholds dramatically while causing far more incandescent, violent deflagration.
const metalOxygenIgnitionData = {
    Li: 100, Be: 950, Na: 70, Mg: 380, Al: 550, K: 20, Ca: 420, Sc: 650, Ti: 450, V: 500,
    Cr: 1250, Mn: 550, Fe: 550, Co: 700, Ni: 750, Cu: 800, Zn: 380, Ga: 750, Rb: 20, Sr: 380,
    Y: 520, Zr: 350, Nb: 620, Mo: 450, Ru: 600, Rh: 9999, Pd: 9999, Ag: 9999, Cd: 260, In: 580,
    Sn: 600, Cs: 20, Ba: 240, La: 280, Ce: 160, Pr: 230, Nd: 210, Sm: 180, Eu: 120, Gd: 220,
    Tb: 200, Dy: 210, Ho: 210, Er: 220, Tm: 220, Yb: 280, Lu: 240, Hf: 450, Ta: 9999, W: 650,
    Re: 750, Os: 9999, Ir: 9999, Pt: 9999, Au: 9999, Hg: 280, Tl: 220, Pb: 450, Bi: 380
};

(function initCombustionLab() {
    let currentTemp = 20;
    let selectedMetalKey = 'Mg';
    let currentFilter = 'all';
    let currentAtmosphere = 'air'; // 'air' or 'oxygen'
    let isIgnited = false;
    let animFrameId = null;

    // Helper to get active ignition threshold based on atmosphere
    function getActiveIgnitionThreshold(metalKey) {
        const m = metalCombustionData[metalKey];
        if (!m || !m.isCombustible) return 9999;
        if (currentAtmosphere === 'oxygen') {
            return metalOxygenIgnitionData[metalKey] !== undefined ? metalOxygenIgnitionData[metalKey] : m.ignTemp;
        }
        return m.ignTemp;
    }

    // DOM Elements
    const tray = document.getElementById('metal-inventory-tray');
    const filterTabs = document.querySelectorAll('.comb-tab');
    const atmosBtns = document.querySelectorAll('.atmos-btn');
    const slider = document.getElementById('blowtorch-temp-slider');
    const tempNum = document.getElementById('temp-val-display');
    const tempF = document.getElementById('temp-f-display');
    const targetBadge = document.getElementById('temp-threshold-badge');
    const presetBtns = document.querySelectorAll('.preset-btn');

    const specimenImg = document.getElementById('combustion-specimen-img');
    const specimenGlow = document.getElementById('specimen-glow-overlay');
    const torchRig = document.getElementById('blowtorch-rig');
    const torchFlameJet = document.getElementById('torch-flame-jet');
    const furnaceGlow = document.getElementById('furnace-glow');
    const statusBadge = document.getElementById('chamber-status-badge');
    const statusText = document.getElementById('chamber-status-text');

    // Pyro Card Elements
    const pyroNum = document.getElementById('pyro-num');
    const pyroName = document.getElementById('pyro-name');
    const pyroSymbol = document.getElementById('pyro-symbol');
    const pyroStatusChip = document.getElementById('pyro-status-chip');
    const pyroIgnTemp = document.getElementById('pyro-ign-temp');
    const pyroFlameColor = document.getElementById('pyro-flame-color');
    const pyroOxide = document.getElementById('pyro-oxide');
    const pyroHeat = document.getElementById('pyro-heat');
    const pyroEquationLabel = document.getElementById('pyro-equation-label');
    const pyroEquation = document.getElementById('pyro-equation');
    const pyroNotes = document.getElementById('pyro-notes');
    const pyroUse = document.getElementById('pyro-use');

    // Canvas Setup
    const canvas = document.getElementById('combustion-flame-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = canvas.parentElement.clientWidth || 600;
        canvas.height = canvas.parentElement.clientHeight || 450;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Audio SFX using Web Audio API
    let audioCtx = null;
    let torchGain = null;
    let fireGain = null;

    function initAudio() {
        if (audioCtx) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();

            // Blowtorch Hiss (White Noise via BufferSource)
            const bufferSize = audioCtx.sampleRate * 2;
            const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            // Torch sound
            const whiteNoise = audioCtx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;

            const torchFilter = audioCtx.createBiquadFilter();
            torchFilter.type = 'bandpass';
            torchFilter.frequency.value = 850;
            torchFilter.Q.value = 1.2;

            torchGain = audioCtx.createGain();
            torchGain.gain.value = 0;

            whiteNoise.connect(torchFilter);
            torchFilter.connect(torchGain);
            torchGain.connect(audioCtx.destination);
            whiteNoise.start();

            // Fire Crackle (Lowpass filtered noise with crackle pops)
            const fireNoiseSrc = audioCtx.createBufferSource();
            fireNoiseSrc.buffer = noiseBuffer;
            fireNoiseSrc.loop = true;

            const fireFilter = audioCtx.createBiquadFilter();
            fireFilter.type = 'lowpass';
            fireFilter.frequency.value = 400;

            fireGain = audioCtx.createGain();
            fireGain.gain.value = 0;

            fireNoiseSrc.connect(fireFilter);
            fireFilter.connect(fireGain);
            fireGain.connect(audioCtx.destination);
            fireNoiseSrc.start();
        } catch (e) {
            console.warn('Web Audio could not be initialized:', e);
        }
    }

    function updateAudio(temp, burning) {
        if (!audioCtx) return;
        try {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            // Torch volume scales with temperature (0 at 20°C, max ~0.25 at 3500°C)
            if (torchGain) {
                const targetTorchVol = temp > 50 ? Math.min(0.22, 0.03 + (temp / 3500) * 0.19) : 0;
                torchGain.gain.setTargetAtTime(targetTorchVol, audioCtx.currentTime, 0.1);
            }

            // Fire roar/crackle volume when ignited (boosted in pure oxygen & scales with temperature!)
            if (fireGain) {
                let targetFireVol = 0;
                if (burning) {
                    const baseVol = currentAtmosphere === 'oxygen' ? 0.35 : 0.24;
                    const tempOver = Math.min(1, Math.max(0, (temp - 300) / 3200));
                    targetFireVol = Math.min(0.55, baseVol + tempOver * 0.22);
                }
                fireGain.gain.setTargetAtTime(targetFireVol, audioCtx.currentTime, 0.15);
            }
        } catch (e) {}
    }

    // Populate Inventory Carousel
    function renderInventory() {
        if (!tray) return;
        tray.innerHTML = '';
        const keys = Object.keys(metalCombustionData);

        keys.forEach(key => {
            const m = metalCombustionData[key];
            const activeThreshold = getActiveIgnitionThreshold(key);
            const isPyrophoric = m.isCombustible && activeThreshold <= 100;
            const isNoble = !m.isCombustible;

            let show = false;
            if (currentFilter === 'all') show = true;
            else if (currentFilter === 'combustible' && m.isCombustible) show = true;
            else if (currentFilter === 'pyrophoric' && isPyrophoric) show = true;
            else if (currentFilter === 'noble' && isNoble) show = true;

            if (!show) return;

            const card = document.createElement('div');
            card.className = `metal-card-item ${key === selectedMetalKey ? 'active' : ''}`;
            card.dataset.sym = key;

            card.innerHTML = `
                <span class="card-atomic-badge">${m.num}</span>
                <img src="${m.img}" alt="${m.name}" loading="lazy" class="card-metal-thumb" onerror="this.src='assets/metals/png/mg_magnesium.png'">
                <div class="card-metal-name">${m.name}</div>
                <div class="card-metal-sym">${m.sym}</div>
            `;

            card.addEventListener('click', () => {
                selectMetal(key);
            });

            tray.appendChild(card);
        });
    }

    // Filter Buttons
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.cat;
            renderInventory();
        });
    });

    // Atmosphere Toggle Buttons (Standard Air vs Pure Oxygen)
    atmosBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            initAudio();
            atmosBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentAtmosphere = btn.dataset.atmos;

            // Update dynamic labels
            if (pyroEquationLabel) {
                pyroEquationLabel.textContent = currentAtmosphere === 'oxygen' 
                    ? 'Balanced Oxidation Reaction in Pure Oxygen (100% O₂):' 
                    : 'Balanced Oxidation Reaction in Air (21% O₂):';
            }

            particles = [];
            sparks = [];
            updateCombustionState();
            renderInventory();
        });
    });

    // Select Metal
    function selectMetal(key) {
        if (!metalCombustionData[key]) return;
        selectedMetalKey = key;
        const m = metalCombustionData[key];

        // Update active class in tray
        const cards = tray.querySelectorAll('.metal-card-item');
        cards.forEach(c => {
            if (c.dataset.sym === key) {
                c.classList.add('active');
                c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                c.classList.remove('active');
            }
        });

        // Specimen image
        if (specimenImg) {
            specimenImg.src = m.img;
            specimenImg.alt = `${m.name} specimen`;
        }

        // Update Pyro Card Info
        if (pyroNum) pyroNum.textContent = m.num;
        if (pyroName) pyroName.textContent = m.name;
        if (pyroSymbol) pyroSymbol.innerHTML = `${m.sym} &bull; ${m.series}`;
        
        if (pyroStatusChip) {
            if (!m.isCombustible) {
                pyroStatusChip.textContent = 'Noble / Non-Combustible';
                pyroStatusChip.style.background = 'rgba(168, 85, 247, 0.2)';
                pyroStatusChip.style.color = '#c084fc';
                pyroStatusChip.style.borderColor = 'rgba(168, 85, 247, 0.4)';
            } else {
                pyroStatusChip.textContent = 'Combustible Metal';
                pyroStatusChip.style.background = 'rgba(34, 197, 94, 0.2)';
                pyroStatusChip.style.color = '#4ade80';
                pyroStatusChip.style.borderColor = 'rgba(34, 197, 94, 0.4)';
            }
        }

        if (pyroIgnTemp) {
            if (!m.isCombustible) {
                pyroIgnTemp.textContent = 'Immune (Does Not Burn)';
                pyroIgnTemp.style.color = '#a78bfa';
            } else {
                pyroIgnTemp.textContent = 'Unignited (Dial heat to test)';
                pyroIgnTemp.style.color = '#8892b0';
            }
        }

        if (pyroFlameColor) {
            pyroFlameColor.textContent = m.flameColorName;
            const primaryColor = m.flamePalette && m.flamePalette.length > 1 ? m.flamePalette[1] : '#ffffff';
            pyroFlameColor.style.color = primaryColor;
            pyroFlameColor.style.textShadow = `0 0 10px ${primaryColor}`;
        }

        if (pyroOxide) pyroOxide.textContent = m.oxide;
        if (pyroHeat) pyroHeat.textContent = m.deltaH;
        if (pyroEquation) pyroEquation.textContent = m.equation;
        if (pyroNotes) pyroNotes.textContent = m.notes;
        if (pyroUse) pyroUse.textContent = m.use;

        if (pyroEquationLabel) {
            pyroEquationLabel.textContent = currentAtmosphere === 'oxygen' 
                ? 'Balanced Oxidation Reaction in Pure Oxygen (100% O₂):' 
                : 'Balanced Oxidation Reaction in Air (21% O₂):';
        }

        // Target badge (discovery mode - never reveal exact threshold)
        if (targetBadge) {
            if (!m.isCombustible) {
                targetBadge.innerHTML = 'Status: <strong style="color:#c084fc;">NOBLE (IMMUNE)</strong>';
            } else {
                targetBadge.innerHTML = 'Status: <strong style="color:#8892b0;">UNIGNITED</strong>';
            }
        }

        particles = [];
        sparks = [];
        updateCombustionState();
    }

    // Particle Classes for Realistic Flame & Sparks
    let particles = [];
    let sparks = [];

    class FlameParticle {
        constructor(x, y, palette, scale, speedMultiplier = 1.0, spread = 36) {
            this.x = x + (Math.random() - 0.5) * spread;
            this.y = y + (Math.random() - 0.5) * 14;
            this.palette = palette || ['#ffffff', '#ff9800', '#f44336'];
            this.vx = (Math.random() - 0.5) * 2.2 * Math.sqrt(speedMultiplier);
            this.vy = -(Math.random() * 3.8 + 2.6) * (scale || 1) * speedMultiplier;
            this.size = (Math.random() * 22 + 14) * (scale || 1);
            this.maxLife = (Math.random() * 30 + 22) * Math.min(1.4, 0.8 + 0.3 * speedMultiplier);
            this.life = this.maxLife;
            this.growth = (Math.random() * 0.45 + 0.22) * Math.min(1.3, speedMultiplier);
            this.turbulence = (Math.random() * 0.15 + 0.06) * Math.min(1.5, speedMultiplier);
            this.turbPhase = Math.random() * Math.PI * 2;
        }

        update() {
            this.turbPhase += this.turbulence;
            this.vx += Math.sin(this.turbPhase) * 0.35;
            this.x += this.vx;
            this.y += this.vy;
            this.size += this.growth;
            this.life--;
        }

        draw(ctx) {
            if (this.life <= 0) return;
            const progress = 1 - (this.life / this.maxLife);
            const colorIdx = Math.min(this.palette.length - 1, Math.floor(progress * this.palette.length));
            const baseColor = this.palette[colorIdx];

            const alpha = Math.max(0, (1 - progress) * (currentAtmosphere === 'oxygen' ? 0.9 : 0.75));

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const rad = Math.max(1, this.size);
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, rad);
            grad.addColorStop(0, hexToRgba(this.palette[0], alpha));
            grad.addColorStop(0.4, hexToRgba(baseColor, alpha * 0.85));
            grad.addColorStop(1, hexToRgba(baseColor, 0));

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(this.x, this.y, rad, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class SparkParticle {
        constructor(x, y, color, speedMultiplier = 1.0) {
            this.x = x + (Math.random() - 0.5) * (20 * Math.min(1.8, speedMultiplier));
            this.y = y + (Math.random() - 0.5) * 12;
            this.color = color || '#ffeb3b';
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * (currentAtmosphere === 'oxygen' ? 2.0 : 1.5);
            const speed = (Math.random() * 7 + 4) * (currentAtmosphere === 'oxygen' ? 1.4 : 1.0) * speedMultiplier;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.gravity = 0.18;
            this.size = (Math.random() * 2.6 + 1.3) * (currentAtmosphere === 'oxygen' ? 1.3 : 1.0) * Math.min(1.5, Math.sqrt(speedMultiplier));
            this.life = (Math.random() * 35 + 20) * Math.min(1.4, speedMultiplier);
            this.maxLife = this.life;
        }

        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
        }

        draw(ctx) {
            if (this.life <= 0) return;
            const alpha = this.life / this.maxLife;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.strokeStyle = hexToRgba(this.color, alpha);
            ctx.lineWidth = this.size;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.vx * 1.8, this.y - this.vy * 1.8);
            ctx.stroke();
            ctx.restore();
        }
    }

    function hexToRgba(hex, alpha) {
        if (!hex || hex[0] !== '#') return `rgba(255, 200, 50, ${alpha})`;
        let c = hex.substring(1);
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        const num = parseInt(c, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Animation Loop
    function renderFlameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const m = metalCombustionData[selectedMetalKey];
        const activeThreshold = getActiveIgnitionThreshold(selectedMetalKey);
        const isBurning = m && m.isCombustible && currentTemp >= activeThreshold;

        // Origin of combustion: ceramic crucible center
        const originX = canvas.width / 2;
        const originY = canvas.height * 0.72;

        if (isBurning) {
            // Thermal overdrive ratio: how much hotter than ignition threshold (1.0 at threshold up to 2.3 at 3500°C)
            const tempSurplus = Math.max(0, currentTemp - activeThreshold);
            const tempBoostFactor = Math.min(1.35, (tempSurplus / (3500 - activeThreshold || 1)) * 1.35);
            const intensityMult = 1.0 + tempBoostFactor; // ranges from 1.0 to ~2.35
            
            // Atmosphere boost (pure oxygen further enhances turbulence and energy)
            const atmosMult = currentAtmosphere === 'oxygen' ? 1.35 : 1.0;
            const totalScale = m.flameScale * atmosMult * (0.85 + 0.45 * intensityMult);
            const speedMultiplier = 0.9 + 0.55 * intensityMult;

            // Spawn count scales dynamically with temperature
            const baseCount = Math.floor(m.flameScale * (currentAtmosphere === 'oxygen' ? 6 : 4.5));
            const count = Math.min(24, Math.max(3, Math.floor(baseCount * intensityMult)));
            
            const spreadWidth = 32 + tempBoostFactor * 30; // wider flame base as heat surges
            for (let i = 0; i < count; i++) {
                particles.push(new FlameParticle(originX, originY, m.flamePalette, totalScale, speedMultiplier, spreadWidth));
            }

            // Spawn sparks if applicable (accelerates in frequency, count, and velocity at higher temperatures)
            const sparkChance = Math.min(0.98, (currentAtmosphere === 'oxygen' ? 0.75 : 0.55) + tempBoostFactor * 0.3);
            if (m.hasSparks && Math.random() < sparkChance) {
                const sparkCount = Math.floor(Math.random() * (currentAtmosphere === 'oxygen' ? 5 : 3) * intensityMult) + 1;
                for (let s = 0; s < sparkCount; s++) {
                    sparks.push(new SparkParticle(originX, originY, m.sparkColor, speedMultiplier));
                }
            }
        } else if (currentTemp >= (currentAtmosphere === 'oxygen' ? 450 : 600)) {
            // Hot incandescence heat shimmer
            if (Math.random() < 0.25) {
                particles.push(new FlameParticle(originX, originY, ['#ff3d00', '#ff1744', '#212121'], 0.45, 0.8, 24));
            }
        }

        // Update and draw flame particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw(ctx);
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }

        // Update and draw sparks
        for (let i = sparks.length - 1; i >= 0; i--) {
            sparks[i].update();
            sparks[i].draw(ctx);
            if (sparks[i].life <= 0) {
                sparks.splice(i, 1);
            }
        }

        animFrameId = requestAnimationFrame(renderFlameLoop);
    }

    // Update Combustion Status & Visuals based on Temperature
    function updateCombustionState() {
        const m = metalCombustionData[selectedMetalKey];
        if (!m) return;

        const activeThreshold = getActiveIgnitionThreshold(selectedMetalKey);
        const isBurning = m.isCombustible && currentTemp >= activeThreshold;
        const tempRatio = (currentTemp - 20) / (3500 - 20);

        // Blowtorch Flame Jet dynamic length and intensity
        if (torchFlameJet) {
            const jetLength = Math.max(8, tempRatio * (currentAtmosphere === 'oxygen' ? 175 : 155));
            const jetWidth = Math.max(5, (currentAtmosphere === 'oxygen' ? 8 : 7) + tempRatio * 16);
            torchFlameJet.style.width = `${jetLength}px`;
            torchFlameJet.style.height = `${jetWidth}px`;
            
            if (currentAtmosphere === 'oxygen') {
                torchFlameJet.style.opacity = '1';
                torchFlameJet.style.background = 'linear-gradient(90deg, #ffffff, #00f0ff 40%, #7928ca 80%, transparent)';
            } else if (currentTemp <= 100) {
                torchFlameJet.style.opacity = '0.2';
                torchFlameJet.style.background = 'linear-gradient(90deg, #60a5fa, transparent)';
            } else if (currentTemp <= 1200) {
                torchFlameJet.style.opacity = '0.75';
                torchFlameJet.style.background = 'linear-gradient(90deg, #38bdf8, #0284c7 60%, transparent)';
            } else {
                torchFlameJet.style.opacity = '1';
                torchFlameJet.style.background = 'linear-gradient(90deg, #ffffff, #67e8f9 35%, #0284c7 75%, transparent)';
            }
        }

        // Specimen incandescence glow (scales dynamically with temperature surplus)
        if (specimenGlow) {
            if (isBurning) {
                const primaryColor = m.flamePalette && m.flamePalette.length > 1 ? m.flamePalette[1] : '#ff9800';
                specimenGlow.style.opacity = '1';
                const tempSurplus = Math.max(0, currentTemp - activeThreshold);
                const surplusRatio = Math.min(1, tempSurplus / Math.max(1, 3500 - activeThreshold));
                const spread = Math.round((currentAtmosphere === 'oxygen' ? 45 : 35) + surplusRatio * 40);
                const insetSpread = Math.round(25 + surplusRatio * 20);
                specimenGlow.style.boxShadow = `inset 0 0 ${insetSpread}px ${primaryColor}, 0 0 ${spread}px ${primaryColor}`;
            } else if (currentTemp >= 500) {
                // Thermal incandescence (blackbody radiation)
                const incRatio = Math.min(1, (currentTemp - 500) / 1500);
                specimenGlow.style.opacity = (incRatio * 0.85).toString();
                specimenGlow.style.boxShadow = `inset 0 0 20px #ff3d00, 0 0 ${10 + incRatio * 20}px #ff5722`;
            } else {
                specimenGlow.style.opacity = '0';
                specimenGlow.style.boxShadow = 'none';
            }
        }

        // Specimen image filter (intensifies radiance as temperature ascends)
        if (specimenImg) {
            if (isBurning) {
                const tempSurplus = Math.max(0, currentTemp - activeThreshold);
                const surplusRatio = Math.min(1, tempSurplus / Math.max(1, 3500 - activeThreshold));
                const brightness = (currentAtmosphere === 'oxygen' ? 1.75 : 1.45) + surplusRatio * 0.8;
                const contrast = (currentAtmosphere === 'oxygen' ? 1.35 : 1.2) + surplusRatio * 0.35;
                const shadowRadius = Math.round((currentAtmosphere === 'oxygen' ? 22 : 16) + surplusRatio * 22);
                specimenImg.style.filter = `brightness(${brightness.toFixed(2)}) contrast(${contrast.toFixed(2)}) drop-shadow(0 0 ${shadowRadius}px rgba(255,255,255,0.9))`;
            } else if (currentTemp >= 500) {
                const b = 1 + (currentTemp - 500) / 3000;
                const sep = Math.min(0.6, (currentTemp - 500) / 2000);
                specimenImg.style.filter = `brightness(${b}) sepia(${sep}) hue-rotate(-25deg)`;
            } else {
                specimenImg.style.filter = 'none';
            }
        }

        // Furnace chamber ambient glow (scales with flame intensity)
        if (furnaceGlow) {
            if (isBurning) {
                const primaryColor = m.flamePalette && m.flamePalette.length > 1 ? m.flamePalette[1] : '#ffaa00';
                const tempSurplus = Math.max(0, currentTemp - activeThreshold);
                const surplusRatio = Math.min(1, tempSurplus / Math.max(1, 3500 - activeThreshold));
                furnaceGlow.style.opacity = Math.min(1.0, (currentAtmosphere === 'oxygen' ? 0.95 : 0.85) + surplusRatio * 0.15).toString();
                const centerAlpha = (currentAtmosphere === 'oxygen' ? 0.6 : 0.45) + surplusRatio * 0.3;
                const midAlpha = 0.18 + surplusRatio * 0.18;
                const radSpread = Math.round(55 + surplusRatio * 20);
                furnaceGlow.style.background = `radial-gradient(circle at 50% 65%, ${hexToRgba(primaryColor, centerAlpha)} 0%, ${hexToRgba(primaryColor, midAlpha)} ${radSpread}%, transparent 85%)`;
            } else {
                const heatAlpha = Math.min(0.6, tempRatio * 0.6);
                furnaceGlow.style.opacity = heatAlpha.toString();
                furnaceGlow.style.background = `radial-gradient(circle at 50% 65%, rgba(255, 69, 0, ${heatAlpha}) 0%, rgba(255, 140, 0, ${heatAlpha * 0.4}) 50%, transparent 75%)`;
            }
        }

        // Status Badge & HUD
        const atmosName = currentAtmosphere === 'oxygen' ? 'PURE OXYGEN' : 'AIR';
        if (statusBadge && statusText) {
            if (!m.isCombustible) {
                statusBadge.className = 'chamber-status-badge noble';
                statusText.textContent = `NOBLE METAL: IMMUNE TO IGNITION IN ${atmosName} (TESTED AT ${currentTemp}°C)`;
                if (targetBadge) targetBadge.innerHTML = 'Status: <strong style="color:#c084fc;">NOBLE (IMMUNE)</strong>';
                if (pyroIgnTemp) {
                    pyroIgnTemp.textContent = 'Immune (Does Not Burn)';
                    pyroIgnTemp.style.color = '#a78bfa';
                }
            } else if (isBurning) {
                statusBadge.className = 'chamber-status-badge burning';
                statusText.textContent = `IGNITED! ACTIVE COMBUSTION IN ${atmosName} AT ${currentTemp}°C (${m.flameColorName.toUpperCase()})`;
                if (targetBadge) targetBadge.innerHTML = 'Status: <strong style="color:#ffaa00;">🔥 IGNITED & BURNING</strong>';
                if (pyroIgnTemp) {
                    pyroIgnTemp.textContent = `🔥 Ignited in ${atmosName} (${currentTemp}°C)`;
                    pyroIgnTemp.style.color = '#ffaa00';
                }
            } else {
                statusBadge.className = 'chamber-status-badge';
                statusText.textContent = currentTemp >= 600 ? `HEATING UP IN ${atmosName}... (INCANDESCENT, NOT YET IGNITED)` : `UNIGNITED IN ${atmosName} (INCREASE BLOWTORCH HEAT)`;
                if (targetBadge) targetBadge.innerHTML = 'Status: <strong style="color:#8892b0;">UNIGNITED</strong>';
                if (pyroIgnTemp) {
                    pyroIgnTemp.textContent = currentTemp >= 600 ? `Incandescent in ${atmosName} (Not Ignited)` : `Unignited in ${atmosName}`;
                    pyroIgnTemp.style.color = '#8892b0';
                }
            }
        }

        // Audio
        updateAudio(currentTemp, isBurning);
    }

    // Slider Event
    if (slider) {
        slider.addEventListener('input', (e) => {
            initAudio();
            currentTemp = parseInt(e.target.value, 10);
            if (tempNum) tempNum.textContent = currentTemp;
            if (tempF) tempF.textContent = `(${Math.round(currentTemp * 9 / 5 + 32)} °F)`;
            updateCombustionState();
        });
    }

    // Preset Buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            initAudio();
            const targetT = parseInt(btn.dataset.temp, 10);
            animateSliderTo(targetT);
        });
    });

    function animateSliderTo(targetT) {
        const startT = currentTemp;
        const diff = targetT - startT;
        const duration = 400; // ms
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            const ease = 1 - (1 - progress) * (1 - progress);
            currentTemp = Math.round(startT + diff * ease);

            if (slider) slider.value = currentTemp;
            if (tempNum) tempNum.textContent = currentTemp;
            if (tempF) tempF.textContent = `(${Math.round(currentTemp * 9 / 5 + 32)} °F)`;
            updateCombustionState();

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    // Initial boot
    renderInventory();
    selectMetal('Mg');
    renderFlameLoop();
})();
