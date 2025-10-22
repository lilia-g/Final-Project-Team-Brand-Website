/* ========================================
   BACK TO TOP BUTTON FUNCTIONALITY
   ======================================== */

class BackToTopButton {
    constructor() {
        this.button = document.getElementById('back-to-top');
        this.scrollThreshold = 300; // Show button after scrolling 300px
        
        this.init();
    }
    
    init() {
        if (!this.button) {
            console.error('Back to Top button not found!');
            return;
        }
        
        console.log('Back to Top button initialized');
        
        // Add scroll event listener
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Add click event listener
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Back to Top button clicked');
            this.scrollToTop();
        });
        
        // Initial check
        this.handleScroll();
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > this.scrollThreshold) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
    
    scrollToTop() {
        console.log('Scrolling to top...');
        
        // Simple and reliable scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

/* ========================================
   NAVIGATION COMPONENT
   ======================================== */

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navMenu = document.getElementById('nav-menu');
        this.navToggle = document.getElementById('nav-toggle');
        this.darkModeToggle = document.getElementById('dark-mode-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        
        this.init();
    }
    
    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupDarkMode();
        this.setupActiveLinks();
        
        // Update active state on page load
        this.updateActiveState();
        
        // Update active state when navigating back/forward
        window.addEventListener('popstate', () => {
            this.updateActiveState();
        });
    }
    
    setupScrollEffect() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    setupMobileMenu() {
        if (!this.navToggle || !this.navMenu) return;
        
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on a link
        const navLinks = this.navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    setupDarkMode() {
        if (!this.darkModeToggle || !this.themeIcon) return;
        
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        this.updateThemeIcon(savedTheme);
        
        this.darkModeToggle.addEventListener('click', () => {
            const isDarkMode = document.body.classList.contains('dark-mode');
            const newTheme = isDarkMode ? 'light' : 'dark';
            
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
        });
    }
    
    updateThemeIcon(theme) {
        if (!this.themeIcon) return;
        
        if (theme === 'dark') {
            // Moon icon for dark mode
            this.themeIcon.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            `;
        } else {
            // Sun icon for light mode
            this.themeIcon.innerHTML = `
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            `;
        }
    }
    
    setupActiveLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Set active state based on current page
        this.setActivePage();
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Smooth scroll to section if it's an anchor link
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href.substring(1));
                }
            });
        });
    }
    
    setActivePage() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPage = this.getCurrentPage();
        
        console.log('Current page:', currentPage);
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkPage = this.getPageFromHref(linkHref);
            
            // Remove active class from all links first
            link.classList.remove('active');
            
            // Add active class if this link matches current page
            if (linkPage === currentPage) {
                link.classList.add('active');
                console.log('Active link set:', linkPage);
            }
        });
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        
        // Handle different page formats
        if (page === '' || page === 'index.html' || page === 'index') {
            return 'index.html';
        }
        
        return page;
    }
    
    getPageFromHref(href) {
        if (!href) return '';
        
        // Handle different href formats
        if (href === 'index.html' || href === '/' || href === '') {
            return 'index.html';
        }
        
        return href;
    }
    
    updateActiveState() {
        // Small delay to ensure DOM is fully loaded
        setTimeout(() => {
            this.setActivePage();
        }, 100);
    }
    
    smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 60; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

/* ========================================
   HERO SLIDER COMPONENT
   ======================================== */

class HeroSlider {
    constructor() {
        this.slider = document.querySelector('.hero-slider');
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;
        this.autoSlideDelay = 5000; // 5 seconds
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        if (!this.slider || this.slides.length === 0) {
            console.error('Hero slider elements not found!');
            return;
        }
        
        console.log('Hero slider initialized with', this.totalSlides, 'slides');
        
        this.setupEventListeners();
        this.startAutoSlide();
        this.updateSlider();
    }
    
    setupEventListeners() {
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (!this.isTransitioning) {
                    this.goToSlide(index);
                }
            });
        });
        
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isTransitioning) {
                if (e.key === 'ArrowLeft') {
                    this.previousSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            }
        });
        
        // Touch/swipe support
        this.setupTouchEvents();
        
        // Pause auto-slide on hover
        this.slider.addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });
        
        this.slider.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
        
        // Pause auto-slide when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoSlide();
            } else {
                this.startAutoSlide();
            }
        });
    }
    
    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.slider.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
        });
        
        this.slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Only trigger swipe if horizontal movement is greater than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
    }
    
    goToSlide(slideIndex) {
        if (slideIndex === this.currentSlide || this.isTransitioning) {
            return;
        }
        
        this.isTransitioning = true;
        this.stopAutoSlide();
        
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        // Update current slide
        this.currentSlide = slideIndex;
        
        // Add active class to new slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
        
        // Reset transition flag after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
            this.startAutoSlide();
        }, 800);
        
        console.log('Switched to slide:', this.currentSlide + 1);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }
    
    startAutoSlide() {
        this.stopAutoSlide(); // Clear any existing interval
        
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoSlideDelay);
        
        console.log('Auto-slide started');
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
            console.log('Auto-slide stopped');
        }
    }
    
    updateSlider() {
        // Ensure only the current slide is active
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    // Public method to manually control the slider
    pause() {
        this.stopAutoSlide();
    }
    
    resume() {
        this.startAutoSlide();
    }
    
    // Method to get current slide info
    getCurrentSlideInfo() {
        return {
            current: this.currentSlide + 1,
            total: this.totalSlides,
            isAutoPlaying: this.autoSlideInterval !== null
        };
    }
}

/* ========================================
   INITIALIZATION
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing components...');
    new Navigation();
    new BackToTopButton();
    new HeroSlider();
    console.log('All components initialized');
});

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
    console.log('DOM is loading, waiting for DOMContentLoaded');
} else {
    // DOM is already loaded, initialize immediately
    console.log('DOM already loaded, initializing immediately');
    new Navigation();
    new BackToTopButton();
    new HeroSlider();
}