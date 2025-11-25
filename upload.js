/* =============================
   Modal behavior (About, Contact) and image preview
   - openModal / closeModal: generic handlers
   - click outside modal closes it
   - Escape key closes any open modal
   - image preview keeps its own helper but uses same modal element
============================= */

function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = 'block';
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = 'none';
}

// Attach click handlers for nav links
const contactLink = document.getElementById('contactLink');
if (contactLink) {
    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal('contactModal');
    });
}

const aboutLink = document.getElementById('aboutLink');
if (aboutLink) {
    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal('aboutModal');
    });
}

// Close when clicking outside modal-content
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Close on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    }
});

// IMAGE PREVIEW modal helpers
function openImgPreview(src) {
    const modal = document.getElementById('imgPreviewModal');
    const img = document.getElementById('previewImg');
    if (!modal || !img) return;
    img.src = src;
    modal.style.display = 'block';
}

function closeImgPreview() {
    const modal = document.getElementById('imgPreviewModal');
    if (!modal) return;
    modal.style.display = 'none';
    const img = document.getElementById('previewImg');
    if (img) img.src = '';
}

/* Note: the contact form uses FormSubmit.co and does not require extra JS. */

// ---------------------------
// Tank interactions
// ---------------------------
function makeTankInteractive() {
    const tank = document.getElementById('tank');
    if (!tank) return;

    // Keep click-to-add as an optional manual control,
    // but also start automatic random spawning.
    tank.addEventListener('click', function(e) { addFish(); });
    startAutoSpawn();
}

function addFish() {
    const tankEl = document.getElementById('tank');
    if (!tankEl) return;
    // pick a random image from the collected fish image list
    const imgSrc = (typeof FISH_IMAGES !== 'undefined' && FISH_IMAGES.length > 0)
        ? FISH_IMAGES[Math.floor(Math.random() * FISH_IMAGES.length)]
        : 'images/PIC1.PNG';

    const f = document.createElement('div');
    // random size class
    const sizeRoll = Math.random();
    if (sizeRoll < 0.12) f.className = 'fish fish--tiny';
    else if (sizeRoll < 0.42) f.className = 'fish fish--small';
    else f.className = 'fish';

    // vertical position within tank
    const top = Math.floor(6 + Math.random() * 78);
    f.style.top = top + '%';

    // random direction: 'right' or 'left'
    const dir = Math.random() > 0.5 ? 'right' : 'left';

    const dur = (5 + Math.random() * 12).toFixed(2) + 's';
    const delay = (Math.random() * 1.2).toFixed(2) + 's';
    f.style.animationDuration = dur;
    f.style.animationDelay = delay;

    if (dir === 'right') {
        // start just left outside the tank
        f.style.left = '-20%';
        f.style.animationName = 'swim-right';
        f.style.transform = 'scaleX(1)';
    } else {
        // start just right outside the tank
        f.style.left = '120%';
        f.style.animationName = 'swim-left';
        // make image face left
        f.style.transform = 'scaleX(-1)';
    }

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = 'fish';
    img.loading = 'lazy';
    f.appendChild(img);

    tankEl.appendChild(f);

    // remove after it finishes swimming (duration + small buffer)
    const total = (parseFloat(dur) + 2) * 1000;
    setTimeout(() => { if (f.parentNode) f.parentNode.removeChild(f); }, total);
}

// init tank when DOM is ready
function initExistingFish() {
    const tankEl = document.getElementById('tank');
    if (!tankEl) return;
    const nodes = tankEl.querySelectorAll('.fish');
    nodes.forEach(f => {
        // if already configured, skip
        if (f.style.animationName) return;

        const dir = Math.random() > 0.5 ? 'right' : 'left';
        const dur = (6 + Math.random() * 10).toFixed(2) + 's';
        const delay = (Math.random() * 1.2).toFixed(2) + 's';
        f.style.animationDuration = dur;
        f.style.animationDelay = delay;

        if (dir === 'right') {
            f.style.left = '-20%';
            f.style.animationName = 'swim-right';
            f.style.transform = 'scaleX(1)';
        } else {
            f.style.left = '120%';
            f.style.animationName = 'swim-left';
            f.style.transform = 'scaleX(-1)';
        }
    });
}

// auto-spawn helpers
let _autoSpawnTimer = null;
function startAutoSpawn(minMs = 900, maxMs = 3000) {
    stopAutoSpawn();
    function scheduleNext() {
        const delay = Math.floor(minMs + Math.random() * (maxMs - minMs));
        _autoSpawnTimer = setTimeout(() => {
            addFish();
            scheduleNext();
        }, delay);
    }
    scheduleNext();
}

function stopAutoSpawn() {
    if (_autoSpawnTimer) {
        clearTimeout(_autoSpawnTimer);
        _autoSpawnTimer = null;
    }
}

// init tank when DOM is ready
document.addEventListener('DOMContentLoaded', function() { initExistingFish(); collectFishImages(); makeTankInteractive(); });

// Build fish image list from existing artwork images on the page so
// adding a new image to the `.cards` area will automatically include it.
const FISH_IMAGES = [];
function collectFishImages() {
    // look for images inside .cards (your artwork thumbnails)
    const imgs = document.querySelectorAll('.cards img');
    imgs.forEach(img => {
        const src = img.getAttribute('src');
        if (!src) return;
        // only include images from the images/ folder to avoid UI icons
        if (src.indexOf('images/') !== -1 && !FISH_IMAGES.includes(src)) {
            FISH_IMAGES.push(src);
        }
    });
    // fallback to a default if nothing found
    if (FISH_IMAGES.length === 0) FISH_IMAGES.push('images/PIC1.PNG');
}
// collect at load
document.addEventListener('DOMContentLoaded', collectFishImages);

