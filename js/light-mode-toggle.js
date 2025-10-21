// Light/Dark Mode Toggle - Legacy support
// This file provides backward compatibility for existing light mode toggle functionality

class LightModeToggle {
    constructor() {
        this.init();
    }
    
    init() {
        // Check if navigation is already handling dark mode
        if (document.getElementById('dark-mode-toggle')) {
            console.log('Navigation component is handling dark mode toggle');
            return;
        }
        
        // Fallback for pages without navigation component
        this.setupFallbackToggle();
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
    document.addEventListener('DOMContentLoaded', () => new LightModeToggle());
} else {
    new LightModeToggle();
}