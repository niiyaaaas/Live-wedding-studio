document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth Scroll Reveal sections
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    let countDone = false;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Trigger Counter if statistics section is visible
                if (entry.target.classList.contains('statistics') && !countDone) {
                    startCounters();
                    countDone = true;
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });

    // Counting Animation Logic
    function startCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; // lower is slower

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }
    // Portfolio Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                masonryItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => item.style.opacity = '1', 10);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => item.style.display = 'none', 300);
                    }
                });
            });
        });
    }
}); // End DOMContentLoaded

// Lightbox logic
let currentLightboxIndex = 0;
const masonryItemsArray = Array.from(document.querySelectorAll('.masonry-item'));

function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    if (!lightbox) return; // Not on portfolio page

    currentLightboxIndex = masonryItemsArray.indexOf(element);

    const imgElement = element.querySelector('img');
    const captionElement = element.querySelector('h3');

    lightboxImg.src = imgElement.src;
    lightboxCaption.innerText = captionElement ? captionElement.innerText : '';

    lightbox.style.display = 'block';
    setTimeout(() => lightbox.style.opacity = '1', 10);
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.opacity = '0';
    setTimeout(() => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

function changeImage(direction) {
    const visibleItems = masonryItemsArray.filter(item => item.style.display !== 'none');
    if (visibleItems.length === 0) return;

    let currentIndexInVisible = visibleItems.findIndex(item => item === masonryItemsArray[currentLightboxIndex]);

    let newIndexInVisible = currentIndexInVisible + direction;
    if (newIndexInVisible >= visibleItems.length) newIndexInVisible = 0;
    if (newIndexInVisible < 0) newIndexInVisible = visibleItems.length - 1;

    const nextElement = visibleItems[newIndexInVisible];
    openLightbox(nextElement);
}

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});
