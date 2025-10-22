// Light/Dark Mode Toggle - Legacy support
// This file provides backward compatibility for existing light mode toggle functionality

class LightModeToggle {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait a bit to ensure main.js has had a chance to initialize
        setTimeout(() => {
            const darkModeToggle = document.getElementById('dark-mode-toggle');
            if (darkModeToggle) {
                // Check if the button already has event listeners (from main.js)
                const hasExistingListeners = this.hasEventListeners(darkModeToggle);
                
                if (!hasExistingListeners) {
                    console.log('Dark mode toggle found without existing handlers, setting up fallback handler');
                    this.setupToggleHandler(darkModeToggle);
                } else {
                    console.log('Dark mode toggle already handled by main.js, skipping fallback');
                    // Just ensure the theme is applied on page load
                    this.applySavedTheme();
                }
            } else {
                // Fallback for pages without navigation component
                this.setupFallbackToggle();
            }
        }, 100);
    }
    
    hasEventListeners(element) {
        // Check if element has any event listeners by looking for common properties
        // This is a simple check - in practice, we'll rely on timing
        return element.onclick !== null || element.getAttribute('data-handled') === 'true';
    }
    
    applySavedTheme() {
        // Load saved theme and apply it
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        
        // Update theme icon on load
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            this.updateThemeIcon(themeIcon, savedTheme);
        }
    }
    
    setupToggleHandler(toggleButton) {
        // Mark this button as handled to prevent conflicts
        toggleButton.setAttribute('data-handled', 'true');
        
        // Ensure the toggle button has proper event handling
        toggleButton.addEventListener('click', () => {
            const isDarkMode = document.body.classList.contains('dark-mode');
            const newTheme = isDarkMode ? 'light' : 'dark';
            
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', newTheme);
            
            // Update theme icon if it exists
            const themeIcon = document.getElementById('theme-icon');
            if (themeIcon) {
                this.updateThemeIcon(themeIcon, newTheme);
            }
        });
        
        // Load saved theme
        this.applySavedTheme();
    }
    
    updateThemeIcon(themeIcon, theme) {
        if (theme === 'dark') {
            // Moon icon for dark mode
            themeIcon.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            `;
        } else {
            // Sun icon for light mode
            themeIcon.innerHTML = `
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            `;
        }
    }
    
    setupFallbackToggle() {
        // Create a simple toggle button if navigation is not present
        const toggleButton = document.createElement('button');
        toggleButton.id = 'fallback-dark-toggle';
        toggleButton.innerHTML = '🌙';
        toggleButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            font-size: 20px;
        `;
        
        document.body.appendChild(toggleButton);
        
        toggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            toggleButton.innerHTML = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            toggleButton.innerHTML = '☀️';
        }
    }
}

// Initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('LightModeToggle: DOM loaded, initializing...');
        new LightModeToggle();
    });
} else {
    console.log('LightModeToggle: DOM already loaded, initializing immediately...');
    new LightModeToggle();
}