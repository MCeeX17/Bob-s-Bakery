// ═══════════════════════════════════════════════════════════
//  ADMIN.JS — Cloudinary (images) + Firestore (data) + Auth
// ═══════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ── State ────────────────────────────────────────────────
    let products         = [];
    let pendingFiles     = [];   // new File objects to upload
    let existingImages   = [];   // already-saved Cloudinary URLs
    let editingProductId = null;
    let deleteTargetId   = null;

    // ── DOM ──────────────────────────────────────────────────
    const loginScreen       = document.getElementById('login-screen');
    const adminApp          = document.getElementById('admin-app');
    const googleSigninBtn   = document.getElementById('google-signin-btn');
    const signoutBtn        = document.getElementById('signout-btn');
    const loginError        = document.getElementById('login-error');

    const uploadZone        = document.getElementById('upload-zone');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const uploadPreviews    = document.getElementById('upload-previews');
    const imgInput          = document.getElementById('img-input');

    const fName             = document.getElementById('f-name');
    const fPrice            = document.getElementById('f-price');
    const fDesc             = document.getElementById('f-desc');
    const fTags             = document.getElementById('f-tags');
    const submitBtn         = document.getElementById('submit-btn');
    const submitLabel       = document.getElementById('submit-label');
    const submitSpinner     = document.getElementById('submit-spinner');
    const formError         = document.getElementById('form-error');
    const formSuccess       = document.getElementById('form-success');

    const productsLoading   = document.getElementById('products-loading');
    const productsEmpty     = document.getElementById('products-empty');
    const adminGrid         = document.getElementById('admin-product-grid');

    // ── Auth ─────────────────────────────────────────────────
    function initAuth() {
        const { onAuthStateChanged } = window.__authLib;
        const auth = window.__auth;

        onAuthStateChanged(auth, (user) => {
            if (user) {
                loginScreen.style.display = 'none';
                adminApp.style.display    = 'flex';
                initFirestore();
            } else {
                loginScreen.style.display = 'flex';
                adminApp.style.display    = 'none';
            }
        });

        googleSigninBtn.addEventListener('click', async () => {
            const { GoogleAuthProvider, signInWithPopup } = window.__authLib;
            try {
                loginError.style.display = 'none';
                googleSigninBtn.disabled = true;
                googleSigninBtn.textContent = 'Signing in…';
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
            } catch (e) {
                console.error(e);
                loginError.style.display = 'block';
                googleSigninBtn.disabled = false;
                googleSigninBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google`;
            }
        });

        signoutBtn.addEventListener('click', async () => {
            const { signOut } = window.__authLib;
            await signOut(auth);
        });
    }

    // ── Firestore ────────────────────────────────────────────
    function initFirestore() {
        const { collection, onSnapshot, orderBy, query } = window.__fsLib;
        const db = window.__db;
        const q  = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

        onSnapshot(q, (snapshot) => {
            products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            renderAdminGrid();
        }, err => {
            console.error('Firestore error:', err);
        });
    }

    // ── Render admin grid ────────────────────────────────────
    function renderAdminGrid() {
        productsLoading.style.display = 'none';

        if (products.length === 0) {
            productsEmpty.style.display = 'flex';
            adminGrid.style.display     = 'none';
            return;
        }

        productsEmpty.style.display = 'none';
        adminGrid.style.display     = 'grid';
        adminGrid.innerHTML         = '';

        products.forEach(p => {
            const card   = document.createElement('div');
            card.className = 'admin-card';
            const imgSrc = (p.images && p.images[0]) || '';
            const tags   = (p.tags || []).map(t => `<span class="admin-tag">${t}</span>`).join('');

            card.innerHTML = `
                <div class="admin-card-img">
                    ${imgSrc
                        ? `<img src="${imgSrc}" alt="${p.name}" onerror="this.style.display='none'"/>`
                        : `<div class="no-img">No Image</div>`}
                    <div class="admin-card-img-count">${(p.images||[]).length} photo${(p.images||[]).length!==1?'s':''}</div>
                </div>
                <div class="admin-card-body">
                    <div class="admin-tags">${tags}</div>
                    <h3 class="admin-card-title">${p.name}</h3>
                    <p class="admin-card-price">${p.price}</p>
                    <p class="admin-card-desc">${(p.description||'').substring(0,80)}…</p>
                </div>
                <div class="admin-card-actions">
                    <button class="btn-edit" data-id="${p.id}">✏️ Edit</button>
                    <button class="btn-del"  data-id="${p.id}" data-name="${p.name}">🗑 Delete</button>
                </div>
            `;

            card.querySelector('.btn-edit').addEventListener('click', () => openEditMode(p.id));
            card.querySelector('.btn-del').addEventListener('click',  () => openDeleteModal(p.id, p.name));
            adminGrid.appendChild(card);
        });
    }

    // ── View switching ───────────────────────────────────────
    window.switchView = function (viewId) {
        document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`view-${viewId}`).classList.add('active');
        document.querySelector(`[data-view="${viewId}"]`)?.classList.add('active');
    };

    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    document.getElementById('open-add-btn').addEventListener('click', () => {
        openAddMode();
        switchView('add');
    });

    // ── Add mode ─────────────────────────────────────────────
    function openAddMode() {
        editingProductId = null;
        existingImages   = [];
        pendingFiles     = [];
        clearForm();
        document.getElementById('form-view-title').textContent = 'Add Product';
        document.getElementById('form-view-sub').textContent   = 'Fill in the details and upload images';
        submitLabel.textContent = 'Publish Product';
    }

    // ── Edit mode ─────────────────────────────────────────────
    function openEditMode(productId) {
        const p = products.find(x => x.id === productId);
        if (!p) return;

        editingProductId = productId;
        existingImages   = [...(p.images || [])];
        pendingFiles     = [];
        clearForm();

        fName.value  = p.name        || '';
        fPrice.value = p.price       || '';
        fDesc.value  = p.description || '';
        fTags.value  = (p.tags || []).join(', ');

        existingImages.forEach((url, i) => addExistingPreview(url, i));
        updatePlaceholderVisibility();

        document.getElementById('form-view-title').textContent = 'Edit Product';
        document.getElementById('form-view-sub').textContent   = `Editing: ${p.name}`;
        submitLabel.textContent = 'Save Changes';
        switchView('add');
    }

    window.cancelEdit = function () {
        editingProductId = null;
        existingImages   = [];
        pendingFiles     = [];
        clearForm();
        switchView('products');
    };

    // ── Image upload UI ──────────────────────────────────────
    uploadZone.addEventListener('click', e => {
        if (e.target.closest('.preview-remove')) return;
        imgInput.click();
    });

    uploadZone.addEventListener('dragover', e => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));

    uploadZone.addEventListener('drop', e => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        handleFiles([...e.dataTransfer.files]);
    });

    imgInput.addEventListener('change', () => {
        handleFiles([...imgInput.files]);
        imgInput.value = '';
    });

    function handleFiles(files) {
        const imageFiles = files.filter(f => f.type.startsWith('image/'));
        const totalSlots = existingImages.length + pendingFiles.length;
        const canAdd     = Math.min(imageFiles.length, 5 - totalSlots);

        for (let i = 0; i < canAdd; i++) {
            const file = imageFiles[i];
            if (file.size > 10 * 1024 * 1024) {
                showFormError(`"${file.name}" is over 10MB — please use a smaller image.`);
                continue;
            }
            pendingFiles.push(file);
            addNewPreview(file, pendingFiles.length - 1);
        }
        updatePlaceholderVisibility();
    }

    function addExistingPreview(url, index) {
        const wrap = document.createElement('div');
        wrap.className     = 'preview-item';
        wrap.dataset.type  = 'existing';
        wrap.dataset.index = index;
        wrap.innerHTML = `
            <img src="${url}" alt="Product image"/>
            <button class="preview-remove" data-type="existing" data-index="${index}">✕</button>
            <div class="preview-label">Saved</div>
        `;
        wrap.querySelector('.preview-remove').addEventListener('click', e => {
            e.stopPropagation();
            existingImages.splice(index, 1);
            wrap.remove();
            rebuildIndexes('existing');
            updatePlaceholderVisibility();
        });
        uploadPreviews.appendChild(wrap);
    }

    function addNewPreview(file, index) {
        const url  = URL.createObjectURL(file);
        const wrap = document.createElement('div');
        wrap.className     = 'preview-item';
        wrap.dataset.type  = 'new';
        wrap.dataset.index = index;
        wrap.innerHTML = `
            <img src="${url}" alt="Preview"/>
            <button class="preview-remove" data-type="new" data-index="${index}">✕</button>
            <div class="preview-label">New</div>
        `;
        wrap.querySelector('.preview-remove').addEventListener('click', e => {
            e.stopPropagation();
            pendingFiles.splice(index, 1);
            wrap.remove();
            rebuildIndexes('new');
            updatePlaceholderVisibility();
        });
        uploadPreviews.appendChild(wrap);
    }

    function rebuildIndexes(type) {
        document.querySelectorAll(`.preview-item[data-type="${type}"]`).forEach((el, i) => {
            el.dataset.index = i;
            el.querySelector('.preview-remove').dataset.index = i;
        });
    }

    function updatePlaceholderVisibility() {
        const total = existingImages.length + pendingFiles.length;
        uploadPlaceholder.style.display = total === 0 ? 'flex' : 'none';
    }

    // ── Cloudinary upload ─────────────────────────────────────
    // Uses the unsigned upload API — no server needed, no credit card
    async function uploadToCloudinary(file) {
        const { cloudName, uploadPreset } = window.CLOUDINARY_CONFIG;

        if (!cloudName || cloudName.includes('PASTE')) {
            throw new Error('Cloudinary config not set. Open js/firebase-config.js and add your cloud name and upload preset.');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', 'bakery-products');

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: 'POST', body: formData }
        );

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error?.message || 'Cloudinary upload failed');
        }

        const data = await res.json();
        return data.secure_url; // permanent HTTPS image URL
    }

    // Upload all pending files, show per-file progress in the UI
    async function uploadAllImages(files) {
        if (!files.length) return [];

        // Show progress bar
        showUploadProgress(0, files.length);

        const urls = [];
        for (let i = 0; i < files.length; i++) {
            showUploadProgress(i, files.length);
            const url = await uploadToCloudinary(files[i]);
            urls.push(url);
        }
        hideUploadProgress();
        return urls;
    }

    // ── Progress UI ───────────────────────────────────────────
    function showUploadProgress(done, total) {
        let bar = document.getElementById('upload-progress');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'upload-progress';
            bar.className = 'upload-progress';
            bar.innerHTML = `
                <div class="upload-progress-text" id="upload-progress-text"></div>
                <div class="upload-progress-track">
                    <div class="upload-progress-fill" id="upload-progress-fill"></div>
                </div>
            `;
            uploadZone.parentElement.insertBefore(bar, uploadZone.nextSibling);
        }
        const pct = total === 0 ? 0 : Math.round((done / total) * 100);
        document.getElementById('upload-progress-text').textContent = `Uploading image ${done + 1} of ${total}…`;
        document.getElementById('upload-progress-fill').style.width = `${pct}%`;
        bar.style.display = 'block';
    }

    function hideUploadProgress() {
        const bar = document.getElementById('upload-progress');
        if (bar) bar.style.display = 'none';
    }

    // ── Submit ────────────────────────────────────────────────
    window.submitProduct = async function () {
        hideMessages();

        const name  = fName.value.trim();
        const price = fPrice.value.trim();
        const desc  = fDesc.value.trim();
        const tags  = fTags.value.split(',').map(t => t.trim()).filter(Boolean);

        if (!name || !price || !desc) {
            showFormError('Please fill in Name, Price and Description.');
            return;
        }

        setSubmitting(true);

        try {
            // 1. Upload new images to Cloudinary
            const newUrls = await uploadAllImages(pendingFiles);

            // 2. Merge with kept existing images
            const allImages = [...existingImages, ...newUrls];

            const productData = { name, price, description: desc, tags, images: allImages };

            const { collection, addDoc, updateDoc, doc, serverTimestamp } = window.__fsLib;
            const db = window.__db;

            if (editingProductId) {
                await updateDoc(doc(db, 'products', editingProductId), {
                    ...productData,
                    updatedAt: serverTimestamp()
                });
                showFormSuccess('✓ Product updated successfully!');
            } else {
                await addDoc(collection(db, 'products'), {
                    ...productData,
                    createdAt: serverTimestamp()
                });
                showFormSuccess('✓ Product published to your catalog!');
                clearForm();
            }

            editingProductId = null;
            existingImages   = [];
            pendingFiles     = [];
            setTimeout(() => switchView('products'), 1600);

        } catch (err) {
            console.error(err);
            showFormError('Upload failed: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Delete ────────────────────────────────────────────────
    function openDeleteModal(id, name) {
        deleteTargetId = id;
        document.getElementById('delete-product-name').textContent = name;
        document.getElementById('delete-modal').style.display      = 'flex';
    }

    window.closeDeleteModal = function () {
        deleteTargetId = null;
        document.getElementById('delete-modal').style.display = 'none';
    };

    document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
        if (!deleteTargetId) return;
        const { doc, deleteDoc } = window.__fsLib;
        try {
            await deleteDoc(doc(window.__db, 'products', deleteTargetId));
            closeDeleteModal();
        } catch (e) {
            alert('Could not delete: ' + e.message);
        }
    });

    // ── Helpers ───────────────────────────────────────────────
    function clearForm() {
        fName.value = fPrice.value = fDesc.value = fTags.value = '';
        uploadPreviews.innerHTML = '';
        pendingFiles = [];
        existingImages = [];
        hideUploadProgress();
        updatePlaceholderVisibility();
        hideMessages();
    }

    function setSubmitting(on) {
        submitBtn.disabled          = on;
        submitLabel.style.display   = on ? 'none'  : 'inline';
        submitSpinner.style.display = on ? 'block' : 'none';
    }

    function showFormError(msg) {
        formError.textContent     = msg;
        formError.style.display   = 'block';
        formSuccess.style.display = 'none';
        formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function showFormSuccess(msg) {
        formSuccess.textContent   = msg;
        formSuccess.style.display = 'block';
        formError.style.display   = 'none';
    }

    function hideMessages() {
        formError.style.display   = 'none';
        formSuccess.style.display = 'none';
    }

    // ── Init ──────────────────────────────────────────────────
    if (window.__auth) {
        initAuth();
    } else {
        window.addEventListener('firebase-ready', initAuth);
    }

})();
