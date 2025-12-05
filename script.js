document.addEventListener('DOMContentLoaded', () => {
    console.log('=== SCRIPT.JS DOM CONTENT LOADED - STARTING ===');
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
        // Use softer rotation on mobile (0.1 deg/px) vs desktop (0.25 deg/px)
        const rotationMultiplier = window.innerWidth <= 768 ? 0.08 : 0.25;
        logo.style.transform = `rotate(${scrollY * rotationMultiplier}deg)`;
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
        modalDescription.innerHTML = description; // Changed to innerHTML for formatted text

        if (imageSrc) {
            modalImage.src = imageSrc;
            modalImage.alt = title;
            modalImage.style.display = 'block';
        } else {
            modalImage.style.display = 'none';
        }

        modalOverlay.classList.add('active');

        // Calculate scrollbar width to prevent layout shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
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

    // Event Listeners for Writings
    const writingItems = document.querySelectorAll('.writing-item[data-i18n-content]');
    writingItems.forEach(item => {
        item.addEventListener('click', () => {
            // Get keys
            const titleKey = item.getAttribute('data-i18n-title');
            const contentKey = item.getAttribute('data-i18n-content');

            // Get content based on current language
            const title = translations[currentLang][titleKey] || 'Writing';
            const content = translations[currentLang][contentKey] || '';

            openModal(title, content);
        });
    });

    // Film Gallery - Manual Layout Logic
    const filmImages = document.querySelectorAll('.film-tapestry img');
    const showMoreBtn = document.getElementById('showMoreFilm');

    // Add click listeners to all images
    filmImages.forEach(img => {
        img.addEventListener('click', () => {
            const title = img.getAttribute('data-title') || 'Film Photo';
            const description = img.getAttribute('data-description') || '';
            const imageSrc = img.src;
            openModal(title, description, imageSrc);
        });
    });

    // Show More Button Logic
    if (showMoreBtn) {
        // Check if there are any hidden images
        const hiddenImages = document.querySelectorAll('.film-tapestry img.hidden');

        if (hiddenImages.length === 0) {
            showMoreBtn.style.display = 'none';
        }

        showMoreBtn.addEventListener('click', () => {
            // Reveal all hidden images
            document.querySelectorAll('.film-tapestry img.hidden').forEach(img => {
                img.classList.remove('hidden');
            });
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
    let currentLang = 'es'; // Default language

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
    // Initialize with default language or from URL
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && (langParam === 'en' || langParam === 'es')) {
        setLanguage(langParam);
    } else {
        setLanguage('es');
    }

    // Check for writing query param to open modal directly
    const writingParam = urlParams.get('writing');
    if (writingParam) {
        // Find the item with this title key
        const targetItem = document.querySelector(`.writing-item[data-i18n-title="${writingParam}"]`);
        if (targetItem) {
            // Scroll to writings section
            const writingsSection = document.getElementById('writings');
            if (writingsSection) {
                writingsSection.scrollIntoView({ behavior: 'smooth' });
            }
            // Open modal
            // We need to wait a bit for the language to be set and DOM to be ready? 
            // setLanguage is synchronous.
            // Just trigger click
            setTimeout(() => {
                targetItem.click();
            }, 500);
        }
    }

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

    // Lazy Load Spotify Embed
    const spotifyContainer = document.getElementById('spotify-container');

    function loadSpotifyEmbed() {
        if (!spotifyContainer || spotifyContainer.querySelector('iframe')) return;

        const src = spotifyContainer.dataset.src;
        if (src) {
            const iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.style.borderRadius = '12px';
            iframe.width = '100%';
            iframe.height = '352';
            iframe.frameBorder = '0';
            iframe.allowFullscreen = true;
            iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';

            // Remove placeholder and add iframe
            const placeholder = document.getElementById('spotify-placeholder');
            if (placeholder) {
                placeholder.remove();
            }
            spotifyContainer.appendChild(iframe);
        }
    }

    if (spotifyContainer) {
        // Use Intersection Observer if available
        if ('IntersectionObserver' in window) {
            const spotifyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadSpotifyEmbed();
                        spotifyObserver.disconnect();
                    }
                });
            }, {
                rootMargin: '200px',
                threshold: 0
            });
            spotifyObserver.observe(spotifyContainer);
        } else {
            // Fallback: load after a short delay
            setTimeout(loadSpotifyEmbed, 2000);
        }
    }

    // PDF Viewer Logic
    const url = 'documents/CV-RTPR-2026.pdf';
    let pdfDoc = null,
        pageNum = 1,
        pageRendering = false,
        pageNumPending = null,
        scale = 2.0, // Increased base scale for better resolution
        canvas = document.getElementById('pdf-render'),
        ctx = canvas ? canvas.getContext('2d') : null;

    console.log('PDF Viewer initialization:');
    console.log('- pdfjsLib available:', typeof pdfjsLib !== 'undefined');
    console.log('- Canvas element:', canvas);
    console.log('- Canvas context:', ctx);

    if (!canvas) {
        console.error('Canvas element not found!');
    }

    if (typeof pdfjsLib === 'undefined') {
        console.error('pdfjsLib is not defined! PDF.js library may not have loaded.');
        const cvContainer = document.getElementById('cv-viewer-container');
        if (cvContainer) {
            cvContainer.innerHTML = '<p style="color: red;">PDF library failed to load. <a href="' + url + '">Download CV</a> instead.</p>';
        }
    } else if (canvas && ctx) {
        /**
         * Get page info from document, resize canvas accordingly, and render page.
         * @param num Page number.
         */
        function renderPage(num) {
            console.log('renderPage called with pageNum:', num);
            pageRendering = true;
            // Fetch page
            pdfDoc.getPage(num).then(function (page) {
                console.log('Page fetched successfully:', page);
                const containerWidth = document.getElementById('cv-viewer-container').clientWidth;
                console.log('Container width:', containerWidth);

                // Calculate scale to fit width
                // We use a higher base scale but limit it by container width
                const viewport = page.getViewport({ scale: 1.0 });
                console.log('Base viewport:', viewport);

                // Determine the scale needed to fit the container width
                // We subtract some padding to be safe
                const fitScale = (containerWidth - 32) / viewport.width;
                console.log('Fit scale:', fitScale);

                // Use the larger of fitScale or our base scale, but ensure it fits
                // Actually, we want to render at a high resolution (pixel density)
                // but display at the fitScale size.

                const outputScale = window.devicePixelRatio || 1;
                console.log('Output scale (devicePixelRatio):', outputScale);

                // The display scale should fit the container
                const displayScale = fitScale;

                const scaledViewport = page.getViewport({ scale: displayScale });
                console.log('Scaled viewport:', scaledViewport);

                // Set dimensions for high DPI
                canvas.width = Math.floor(scaledViewport.width * outputScale);
                canvas.height = Math.floor(scaledViewport.height * outputScale);
                console.log('Canvas dimensions set to:', canvas.width, 'x', canvas.height);

                // Set CSS dimensions to match the display size
                canvas.style.width = Math.floor(scaledViewport.width) + "px";
                canvas.style.height = Math.floor(scaledViewport.height) + "px";
                console.log('Canvas CSS dimensions:', canvas.style.width, canvas.style.height);

                // Transform the context to handle the scaling
                const transform = outputScale !== 1
                    ? [outputScale, 0, 0, outputScale, 0, 0]
                    : null;

                // Render PDF page into canvas context
                const renderContext = {
                    canvasContext: ctx,
                    transform: transform,
                    viewport: scaledViewport
                };
                console.log('Starting render with context:', renderContext);
                const renderTask = page.render(renderContext);

                // Wait for render to finish
                renderTask.promise.then(function () {
                    console.log('Page rendered successfully!');
                    pageRendering = false;
                    if (pageNumPending !== null) {
                        // New page rendering is pending
                        renderPage(pageNumPending);
                        pageNumPending = null;
                    }
                }).catch(function (error) {
                    console.error('Error rendering page:', error);
                    pageRendering = false;
                });
            }).catch(function (error) {
                console.error('Error fetching page:', error);
                pageRendering = false;
            });

            // Update page counters
            const pageNumEl = document.getElementById('page-num');
            if (pageNumEl) {
                pageNumEl.textContent = num;
            }
        }

        /**
         * If another page rendering in progress, waits until the rendering is
         * finised. Otherwise, executes rendering immediately.
         */
        function queueRenderPage(num) {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                renderPage(num);
            }
        }

        /**
         * Displays previous page.
         */
        function onPrevPage() {
            if (pageNum <= 1) {
                return;
            }
            pageNum--;
            queueRenderPage(pageNum);
        }

        const prevButton = document.getElementById('prev-page');
        if (prevButton) {
            prevButton.addEventListener('click', onPrevPage);
        }

        /**
         * Displays next page.
         */
        function onNextPage() {
            if (pageNum >= pdfDoc.numPages) {
                return;
            }
            pageNum++;
            queueRenderPage(pageNum);
        }

        const nextButton = document.getElementById('next-page');
        if (nextButton) {
            nextButton.addEventListener('click', onNextPage);
        }

        /**
         * Asynchronously downloads PDF.
         */
        console.log('Starting PDF load, URL:', url);
        console.log('Canvas element:', canvas);
        console.log('Canvas context:', ctx);

        pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
            console.log('PDF document loaded successfully!', pdfDoc_);
            pdfDoc = pdfDoc_; const pageCountEl = document.getElementById('page-count');
            console.log('Number of pages:', pdfDoc.numPages);
            console.log('Page count element:', pageCountEl);

            if (pageCountEl) {
                pageCountEl.textContent = pdfDoc.numPages;
            }

            // Initial/first page rendering
            console.log('About to render page', pageNum);
            renderPage(pageNum);
        }).catch(function (error) {
            console.error('Error loading PDF:', error);
            console.error('Error details:', error.message, error.stack);
            // Fallback or error message could go here
            const cvContainer = document.getElementById('cv-viewer-container');
            if (cvContainer) {
                cvContainer.innerHTML =
                    '<p>Unable to load PDF viewer. <a href="' + url + '">Download CV</a> instead.</p>';
            }
        });

        // Handle window resize to re-render responsively
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (pdfDoc) {
                    renderPage(pageNum);
                }
            }, 100); // Debounce resize
        });
    }
});
