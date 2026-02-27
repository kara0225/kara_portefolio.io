/**
 * Portfolio Kara - Script Principal
 * ================================
 * Gère les interactions du portfolio :
 * - Navigation mobile
 * - Animations au scroll
 * - Upload de documents
 * - Formulaire de contact
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // VARIABLES GLOBALES
    // ========================================
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const fileInput = document.getElementById('file-upload');
    const documentsList = document.getElementById('documents-list');
    const contactForm = document.getElementById('contact-form');

    // Stockage des documents
    let documents = [];

    // ========================================
    // NAVIGATION MOBILE
    // ========================================
    if (menuToggle && nav) { // Sécurité : vérifier si les éléments existent
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Fermer le menu mobile lors du clic sur un lien
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // ========================================
    // SCROLL FLUIDE
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // On vérifie que c'est bien un lien interne (#)
            if(targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement && header) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ========================================
    // ANIMATIONS AU SCROLL
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observer tous les éléments animés
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ========================================
    // GESTION DES DOCUMENTS
    // ========================================
    // (On garde votre code de gestion de documents tel quel)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    const ACCEPTED_TYPES = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/webp'
    ];

    if(fileInput) {
        fileInput.addEventListener('change', function(e) {
            const files = e.target.files;
            if (!files) return;

            Array.from(files).forEach(file => {
                if (!ACCEPTED_TYPES.includes(file.type)) {
                    alert(`Type de fichier non accepté : ${file.name}\nTypes acceptés : PDF, PNG, JPG, GIF, WebP`);
                    return;
                }
                if (file.size > MAX_FILE_SIZE) {
                    alert(`Fichier trop volumineux (max 10MB) : ${file.name}`);
                    return;
                }
                const doc = {
                    id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    name: file.name,
                    type: file.type,
                    size: file.size
                };
                documents.push(doc);
            });
            renderDocuments();
            fileInput.value = '';
        });
    }

    function renderDocuments() {
        if (!documentsList) return;
        if (documents.length === 0) {
            documentsList.innerHTML = `
                <div class="documents-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17,8 12,3 7,8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <p>Aucun document ajouté</p>
                    <span>PDF, Images (PNG, JPG, WebP) - Max 10MB</span>
                </div>
            `;
            return;
        }

        documentsList.innerHTML = documents.map(doc => `
            <div class="document-item" data-id="${doc.id}">
                <div class="document-info">
                    <div class="document-icon ${getDocumentIconClass(doc.type)}">
                        ${getDocumentIcon(doc.type)}
                    </div>
                    <div>
                        <div class="document-name">${escapeHtml(doc.name)}</div>
                        <div class="document-size">${formatFileSize(doc.size)}</div>
                    </div>
                </div>
                <button class="document-remove" onclick="removeDocument('${doc.id}')" title="Supprimer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    function getDocumentIconClass(type) {
        if (type === 'application/pdf') return 'pdf';
        if (type.startsWith('image/')) return 'image';
        return '';
    }

    function getDocumentIcon(type) {
        if (type === 'application/pdf') {
            return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
            </svg>`;
        }
        if (type.startsWith('image/')) {
            return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
            </svg>`;
        }
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
        </svg>`;
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    window.removeDocument = function(docId) {
        documents = documents.filter(doc => doc.id !== docId);
        renderDocuments();
    };

    // ========================================
    // FORMULAIRE DE CONTACT
    // ========================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            console.log('Formulaire soumis:', formData);
            alert('Message envoyé avec succès !\n\n(Démo - En production, ce message serait envoyé à votre email)');
            contactForm.reset();
        });
    }

    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    let lastScrollY = 0;
    
    if(header) {
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }

            lastScrollY = currentScrollY;
        });
    }

    // ========================================
    // ACTIVATION DU LIEN DE NAVIGATION ACTIF
    // ========================================
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        let current = '';
        if(header) {
            const headerHeight = header.offsetHeight;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 100;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }
    });
});