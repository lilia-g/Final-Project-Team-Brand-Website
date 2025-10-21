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
   INITIALIZATION
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing components...');
    new Navigation();
    new BackToTopButton();
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
}