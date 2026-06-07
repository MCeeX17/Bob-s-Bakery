// ═══════════════════════════════════════════════════════════
//  APP.JS — Customer Site (reads from Firestore)
// ═══════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ── State ────────────────────────────────────────────────
    let products        = [];
    let activeProduct   = null;
    let activeImgIndex  = 0;

    // ── DOM ──────────────────────────────────────────────────
    const loader          = document.getElementById('loader');
    const catalogGrid     = document.getElementById('catalog-grid');
    const catalogLoading  = document.getElementById('catalog-loading');
    const catalogEmpty    = document.getElementById('catalog-empty');
    const modalOverlay    = document.getElementById('modal-overlay');
    const productModal    = document.getElementById('product-modal');
    const modalClose      = document.getElementById('modal-close');
    const modalImg        = document.getElementById('modal-img');
    const modalTitle      = document.getElementById('modal-title');
    const modalPrice      = document.getElementById('modal-price');
    const modalDesc       = document.getElementById('modal-desc');
    const modalTags       = document.getElementById('modal-tags');
    const modalWhatsapp   = document.getElementById('modal-whatsapp');
    const modalPrev       = document.getElementById('modal-prev');
    const modalNext       = document.getElementById('modal-next');
    const modalDots       = document.getElementById('modal-dots');
    const navWhatsapp     = document.getElementById('nav-whatsapp');
    const footerWhatsapp  = document.getElementById('footer-whatsapp');

    // ── WhatsApp helpers ─────────────────────────────────────
    const WA = window.WHATSAPP_NUMBER;

    function waLink(msg) {
        return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    }

    function generalWaLink() {
        return waLink("Hey! I'd like to enquire about your baked goods. What do you have available today? 😊");
    }

    function productWaLink(p) {
        return waLink(`Hey! I'd like to enquire about the *${p.name}* (${p.price}). Is it available? 😊`);
    }

    navWhatsapp.href    = generalWaLink();
    footerWhatsapp.href = generalWaLink();

    // ── Loading screen ───────────────────────────────────────
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => { loader.style.display = 'none'; }, 700);
        }, 2000);
    });

    // ── Firebase: listen for real-time product updates ───────
    function initFirestore() {
        const db = window.__db;
        const { collection, onSnapshot, orderBy, query } = window.__fsLib;

        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

        onSnapshot(q, (snapshot) => {
            products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderCatalog();
        }, (err) => {
            console.error('Firestore error:', err);
            catalogLoading.style.display = 'none';
            catalogEmpty.style.display   = 'block';
            catalogEmpty.querySelector('p').textContent = '⚠️ Could not load products. Check Firebase config.';
        });
    }

    // Wait for firebase module to initialise
    if (window.__db) {
        initFirestore();
    } else {
        window.addEventListener('firebase-ready', initFirestore);
    }

    // ── Render catalog grid ──────────────────────────────────
    function renderCatalog() {
        catalogLoading.style.display = 'none';

        if (products.length === 0) {
            catalogEmpty.style.display  = 'block';
            catalogGrid.style.display   = 'none';
            return;
        }

        catalogEmpty.style.display = 'none';
        catalogGrid.style.display  = 'grid';
        catalogGrid.innerHTML      = '';

        products.forEach((product, i) => {
            const card = document.createElement('article');
            card.className = 'product-card';

            const imgSrc  = (product.images && product.images[0]) || 'images/bg-pattern.png';
            const tagsHTML = (product.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('');
            const multiPhoto = product.images && product.images.length > 1;

            card.innerHTML = `
                <div class="card-img-wrap">
                    <img class="card-img" src="${imgSrc}" alt="${product.name}"
                         onerror="this.src='images/bg-pattern.png';this.style.opacity='0.35'"/>
                    <div class="card-img-overlay"></div>
                    ${multiPhoto ? `<div class="card-multi-badge">+${product.images.length - 1} photos</div>` : ''}
                </div>
                <div class="card-body">
                    <div class="card-tags">${tagsHTML}</div>
                    <h3 class="card-title">${product.name}</h3>
                    <p class="card-desc">${(product.description || '').substring(0, 90)}…</p>
                    <div class="card-footer">
                        <span class="card-price">${product.price}</span>
                        <button class="card-btn">View Details</button>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => openModal(product.id));
            catalogGrid.appendChild(card);

            // Stagger reveal
            setTimeout(() => card.classList.add('revealed'), i * 100);
        });
    }

    // ── Modal ────────────────────────────────────────────────
    function openModal(productId) {
        activeProduct  = products.find(p => p.id === productId);
        activeImgIndex = 0;
        if (!activeProduct) return;

        modalTitle.textContent = activeProduct.name;
        modalPrice.textContent = activeProduct.price;
        modalDesc.textContent  = activeProduct.description || '';
        modalWhatsapp.href     = productWaLink(activeProduct);
        modalTags.innerHTML    = (activeProduct.tags || []).map(t => `<span class="modal-tag">${t}</span>`).join('');

        renderModalGallery();

        document.body.style.overflow = 'hidden';
        modalOverlay.classList.add('active');
        requestAnimationFrame(() => productModal.classList.add('active'));
    }

    function closeModal() {
        productModal.classList.remove('active');
        setTimeout(() => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }, 400);
    }

    function renderModalGallery() {
        const imgs       = activeProduct?.images || [];
        const hasMulti   = imgs.length > 1;

        modalImg.src             = imgs[activeImgIndex] || 'images/bg-pattern.png';
        modalPrev.style.display  = hasMulti ? 'flex' : 'none';
        modalNext.style.display  = hasMulti ? 'flex' : 'none';
        modalDots.innerHTML      = '';

        if (hasMulti) {
            imgs.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'modal-dot' + (i === activeImgIndex ? ' active' : '');
                dot.addEventListener('click', () => setImg(i));
                modalDots.appendChild(dot);
            });
        }
    }

    function setImg(index) {
        const imgs = activeProduct?.images || [];
        if (index < 0) index = imgs.length - 1;
        if (index >= imgs.length) index = 0;
        activeImgIndex = index;

        modalImg.style.opacity   = '0';
        modalImg.style.transform = 'scale(0.97)';
        setTimeout(() => {
            modalImg.src             = imgs[activeImgIndex];
            modalImg.style.opacity   = '1';
            modalImg.style.transform = 'scale(1)';
        }, 180);

        document.querySelectorAll('.modal-dot').forEach((d, i) => {
            d.classList.toggle('active', i === activeImgIndex);
        });
    }

    // ── Events ───────────────────────────────────────────────
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
    modalPrev.addEventListener('click', e => { e.stopPropagation(); setImg(activeImgIndex - 1); });
    modalNext.addEventListener('click', e => { e.stopPropagation(); setImg(activeImgIndex + 1); });

    document.addEventListener('keydown', e => {
        if (!modalOverlay.classList.contains('active')) return;
        if (e.key === 'Escape')      closeModal();
        if (e.key === 'ArrowLeft')   setImg(activeImgIndex - 1);
        if (e.key === 'ArrowRight')  setImg(activeImgIndex + 1);
    });

    window.addEventListener('scroll', () => {
        document.getElementById('site-header').classList.toggle('scrolled', window.scrollY > 60);
    });

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const t = document.querySelector(a.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    // Scroll reveal
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.section-header, .about-text, .about-visual').forEach(el => observer.observe(el));

})();
