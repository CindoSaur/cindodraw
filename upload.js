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

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    }
});

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

function makeTankInteractive() {
    const tank = document.getElementById('tank');
    if (!tank) return;
    tank.addEventListener('click', function() { addFish(); });
    startAutoSpawn();
}

function addFish() {
    const tankEl = document.getElementById('tank');
    if (!tankEl) return;

    const imgSrc = (typeof FISH_IMAGES !== 'undefined' && FISH_IMAGES.length > 0)
        ? FISH_IMAGES[Math.floor(Math.random() * FISH_IMAGES.length)]
        : 'images/PIC1.PNG';

    const f = document.createElement('div');
    const sizeRoll = Math.random();
    if (sizeRoll < 0.12) f.className = 'fish fish--tiny';
    else if (sizeRoll < 0.42) f.className = 'fish fish--small';
    else f.className = 'fish';

    const top = Math.floor(6 + Math.random() * 78);
    f.style.top = top + '%';

    const dir = Math.random() > 0.5 ? 'right' : 'left';

    const dur = (5 + Math.random() * 12).toFixed(2) + 's';
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

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = 'fish';
    img.loading = 'lazy';
    f.appendChild(img);

    tankEl.appendChild(f);

    const total = (parseFloat(dur) + 2) * 1000;
    setTimeout(() => { if (f.parentNode) f.parentNode.removeChild(f); }, total);
}

function initExistingFish() {
    const tankEl = document.getElementById('tank');
    if (!tankEl) return;
    const nodes = tankEl.querySelectorAll('.fish');
    nodes.forEach(f => {
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

document.addEventListener('DOMContentLoaded', function() {
    initExistingFish();
    collectFishImages();
    makeTankInteractive();
    initGalleryPagination();
});

const FISH_IMAGES = [];
function collectFishImages() {
    const imgs = document.querySelectorAll('.cards img');
    imgs.forEach(img => {
        const src = img.getAttribute('src');
        if (!src) return;
        if (src.indexOf('images/') !== -1 && !FISH_IMAGES.includes(src)) {
            FISH_IMAGES.push(src);
        }
    });
    if (FISH_IMAGES.length === 0) FISH_IMAGES.push('images/PIC1.PNG');
}

function initGalleryPagination() {
    const cardsContainer = document.getElementById('cardsContainer');
    if (!cardsContainer) return;

    const allCards = Array.from(cardsContainer.querySelectorAll('.card'));
    const perPage = 6;
    let currentPage = 1;
    const totalPages = Math.ceil(allCards.length / perPage);

    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    function renderPage(page) {
        const start = (page - 1) * perPage;
        const end = start + perPage;

        allCards.forEach((card, index) => {
            if (index >= start && index < end) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        if (pageInfo) pageInfo.textContent = 'Page ' + page + ' / ' + totalPages;
        if (prevBtn) prevBtn.disabled = page === 1;
        if (nextBtn) nextBtn.disabled = page === totalPages;
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function () {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
            }
        });

        nextBtn.addEventListener('click', function () {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(currentPage);
            }
        });
    }

    renderPage(currentPage);
}
