// ════════════════════════════════════════════════════════════
//  APP.JS — Bakery Catalog
// ════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ── State ──────────────────────────────────────────────────
    let activeProduct = null;
    let activeImageIndex = 0;

    // ── DOM Refs ───────────────────────────────────────────────
    const loader          = document.getElementById('loader');
    const catalogGrid     = document.getElementById('catalog-grid');
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

    // ── Helpers ────────────────────────────────────────────────
    function waLink(message) {
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    }

    function generalWaLink() {
        return waLink("Hi! I'd like to place an order. Can you tell me what's available today?");
    }

    function productWaLink(product) {
        return waLink(`Hi! I'd like to order the *${product.name}* (${product.price}). Is it currently available?`);
    }

    // ── Loading Screen ─────────────────────────────────────────
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
                revealCards();
            }, 700);
        }, 2000);
    });

    // ── Render Catalog ─────────────────────────────────────────
    function renderCatalog() {
        catalogGrid.innerHTML = '';
        PRODUCTS.forEach((product, i) => {
            const card = document.createElement('article');
            card.className = 'product-card';
            card.style.animationDelay = `${i * 0.1}s`;

            const imgSrc = product.images && product.images.length > 0
                ? product.images[0]
                : 'images/placeholder.jpg';

            const tagsHTML = product.tags
                ? product.tags.map(t => `<span class="card-tag">${t}</span>`).join('')
                : '';

            card.innerHTML = `
                <div class="card-img-wrap">
                    <img class="card-img" src="${imgSrc}" alt="${product.name}" 
                         onerror="this.src='images/bg-pattern.png'; this.style.objectFit='cover'; this.style.opacity='0.4'"/>
                    <div class="card-img-overlay"></div>
                    ${product.images && product.images.length > 1 ? '<div class="card-multi-badge">+' + (product.images.length - 1) + ' photos</div>' : ''}
                </div>
                <div class="card-body">
                    <div class="card-tags">${tagsHTML}</div>
                    <h3 class="card-title">${product.name}</h3>
                    <p class="card-desc">${product.description.substring(0, 90)}…</p>
                    <div class="card-footer">
                        <span class="card-price">${product.price}</span>
                        <button class="card-btn" data-id="${product.id}">View Details</button>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => openModal(product.id));
            catalogGrid.appendChild(card);
        });
    }

    function revealCards() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('revealed'), i * 120);
        });
    }

    // ── Modal ──────────────────────────────────────────────────
    function openModal(productId) {
        activeProduct = PRODUCTS.find(p => p.id === productId);
        if (!activeProduct) return;
        activeImageIndex = 0;

        modalTitle.textContent = activeProduct.name;
        modalPrice.textContent = activeProduct.price;
        modalDesc.textContent  = activeProduct.description;
        modalWhatsapp.href     = productWaLink(activeProduct);

        // Tags
        modalTags.innerHTML = activeProduct.tags
            ? activeProduct.tags.map(t => `<span class="modal-tag">${t}</span>`).join('')
            : '';

        // Gallery
        renderModalGallery();

        // Show
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
        if (!activeProduct) return;
        const imgs = activeProduct.images || [];

        modalImg.src = imgs[activeImageIndex] || '';
        modalImg.onerror = () => {
            modalImg.src = 'images/bg-pattern.png';
            modalImg.style.opacity = '0.4';
            modalImg.style.objectFit = 'cover';
        };

        // Arrows
        const hasMultiple = imgs.length > 1;
        modalPrev.style.display = hasMultiple ? 'flex' : 'none';
        modalNext.style.display = hasMultiple ? 'flex' : 'none';

        // Dots
        modalDots.innerHTML = '';
        if (hasMultiple) {
            imgs.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'modal-dot' + (i === activeImageIndex ? ' active' : '');
                dot.addEventListener('click', () => setModalImage(i));
                modalDots.appendChild(dot);
            });
        }
    }

    function setModalImage(index) {
        const imgs = activeProduct?.images || [];
        if (index < 0) index = imgs.length - 1;
        if (index >= imgs.length) index = 0;
        activeImageIndex = index;

        modalImg.style.opacity = '0';
        modalImg.style.transform = 'scale(0.97)';
        setTimeout(() => {
            modalImg.src = imgs[activeImageIndex] || '';
            modalImg.style.opacity = '1';
            modalImg.style.transform = 'scale(1)';
        }, 200);

        // Update dots
        document.querySelectorAll('.modal-dot').forEach((d, i) => {
            d.classList.toggle('active', i === activeImageIndex);
        });
    }

    // ── Events ─────────────────────────────────────────────────
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    modalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        setModalImage(activeImageIndex - 1);
    });
    modalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        setModalImage(activeImageIndex + 1);
    });

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
        if (!modalOverlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') setModalImage(activeImageIndex - 1);
        if (e.key === 'ArrowRight') setModalImage(activeImageIndex + 1);
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('site-header');
        header.classList.toggle('scrolled', window.scrollY > 60);
    });

    // WhatsApp links
    navWhatsapp.href    = generalWaLink();
    footerWhatsapp.href = generalWaLink();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Intersection Observer for scroll reveals
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.section-header, .about-text, .about-visual').forEach(el => {
        observer.observe(el);
    });

    // ── Init ───────────────────────────────────────────────────
    renderCatalog();

})();
