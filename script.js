document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.sidebar a');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    // Mobile Menu Toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mobileMenuToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            }
        });
    });

    // Intersection Observer for active nav highlighting
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active class to corresponding link
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.sidebar a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Staggered animation for sections
    sections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
    });

    // Logo Rotation on Scroll
    const logo = document.querySelector('.logo');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        // Rotate 0.25 degree per pixel scrolled (faster than 0.1)
        logo.style.transform = `rotate(${scrollY * 0.25}deg)`;
    });

    // Blue Light Cursor
    const cursorLight = document.createElement('div');
    cursorLight.classList.add('cursor-light');
    document.body.appendChild(cursorLight);

    document.addEventListener('mousemove', (e) => {
        cursorLight.style.left = e.clientX + 'px';
        cursorLight.style.top = e.clientY + 'px';
    });
    // Modal Functionality
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.querySelector('.modal-close');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    function openModal(title, description, imageSrc = null) {
        modalTitle.textContent = title;
        modalDescription.textContent = description;

        if (imageSrc) {
            modalImage.src = imageSrc;
            modalImage.alt = title;
            modalImage.style.display = 'block';
        } else {
            modalImage.style.display = 'none';
        }

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event Listeners for Projects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title');
            const description = card.getAttribute('data-description');
            openModal(title, description);
        });
    });

    // Event Listeners for Film Images
    const filmImages = document.querySelectorAll('.film-tapestry img');
    const showMoreBtn = document.getElementById('showMoreFilm');
    const INITIAL_FILM_COUNT = 6;

    // Initially hide images > INITIAL_FILM_COUNT
    filmImages.forEach((img, index) => {
        if (index >= INITIAL_FILM_COUNT) {
            img.classList.add('hidden');
        }

        img.addEventListener('click', () => {
            const title = img.getAttribute('data-title') || 'Film Photo';
            const description = img.getAttribute('data-description') || '';
            const imageSrc = img.src;
            openModal(title, description, imageSrc);
        });
    });

    // Show More Button Logic
    if (showMoreBtn) {
        // Hide button if no hidden images
        if (filmImages.length <= INITIAL_FILM_COUNT) {
            showMoreBtn.style.display = 'none';
        }

        showMoreBtn.addEventListener('click', () => {
            filmImages.forEach(img => img.classList.remove('hidden'));
            showMoreBtn.style.display = 'none';
        });
    }

    // Close Modal Event Listeners
    modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Language Switcher Logic
    const langToggleBtn = document.getElementById('lang-toggle');
    const langLabels = document.querySelectorAll('.lang-label');
    let currentLang = 'en'; // Default language

    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;

        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Update placeholder translations
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });

        // Update project card data attributes for modal
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const titleKey = element.getAttribute('data-i18n-title');
            // For titles that are just the name (like "Solomon"), we might not have a translation key
            // If no key exists, we keep the original text or use the key itself if it's a direct string
            // In this case, the titles are names, so we might not need to translate them, 
            // but if we did, we'd look them up.
            // Let's assume the key is the translation key if it exists in the dictionary.
            // If not, we check if there's a specific key for it.
            // Actually, for names like "Solomon", "Pale Fire", they are proper nouns.
            // But let's support it if needed.
            // The plan said: Add data-i18n-title and data-i18n-desc to project cards

            // Update data-title attribute
            // If the key exists in translations, use it. Otherwise keep current.
            // For the projects, the titles are "Solomon", "Pale Fire" which are names.
            // The descriptions are keys like "project_solomon_desc".

            const descKey = element.getAttribute('data-i18n-desc');
            if (translations[lang][descKey]) {
                element.setAttribute('data-description', translations[lang][descKey]);
            }
        });

        // Update toggle button state and labels
        if (langToggleBtn) {
            if (lang === 'es') {
                langToggleBtn.classList.add('es');
            } else {
                langToggleBtn.classList.remove('es');
            }
        }

        // Update label active states
        langLabels.forEach((label, index) => {
            if ((lang === 'en' && index === 0) || (lang === 'es' && index === 1)) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'es' : 'en';
            setLanguage(newLang);
        });
    }

    // Initialize with default language
    setLanguage('en');

    // Contact Form Submission Handler
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            // Simple validation
            if (!data.name || !data.email || !data.subject || !data.message) {
                showFormStatus('error', 'Please fill in all fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showFormStatus('error', 'Please enter a valid email address.');
                return;
            }

            // For now, just simulate a successful submission
            // In production, you would send this to a backend API
            try {
                const response = await fetch('https://formspree.io/f/mvgepzed', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    // Show success message
                    const successMessage = currentLang === 'en'
                        ? 'Thank you for your message! I\'ll get back to you soon.'
                        : '¡Gracias por tu mensaje! Te responderé pronto.';
                    showFormStatus('success', successMessage);

                    // Reset form
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    console.error('Formspree error:', errorData);
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                const errorMessage = currentLang === 'en'
                    ? 'There was an error sending your message. Please try again.'
                    : 'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.';
                showFormStatus('error', errorMessage);
            }
        });
    }

    function showFormStatus(type, message) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;

        // Hide status message after 5 seconds for success
        if (type === 'success') {
            setTimeout(() => {
                formStatus.className = 'form-status';
                formStatus.textContent = '';
            }, 5000);
        }
    }
});
