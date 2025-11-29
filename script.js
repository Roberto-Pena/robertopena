document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.sidebar a');

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
    filmImages.forEach(img => {
        img.addEventListener('click', () => {
            const title = img.getAttribute('data-title') || 'Film Photo';
            const description = img.getAttribute('data-description') || '';
            const imageSrc = img.src;
            openModal(title, description, imageSrc);
        });
    });

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
});
