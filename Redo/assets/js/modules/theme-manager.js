// Theme Manager Module - Handles theme switching and preferences
// Supports light/dark mode with system preference detection

export class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.systemPreference = 'light';
    this.userPreference = null;
    this.mediaQuery = null;
    this.storageKey = 'mitch-portfolio-theme';
  }

  // Initialize theme manager
  init() {
    try {
      this.detectSystemPreference();
      this.loadUserPreference();
      this.applyTheme();
      this.setupEventListeners();
      this.createThemeToggle();
      console.log('✅ Theme manager initialized');
    } catch (error) {
      console.error('❌ Theme manager initialization failed:', error);
    }
  }

  // Detect system theme preference
  detectSystemPreference() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemPreference = this.mediaQuery.matches ? 'dark' : 'light';
  }

  // Load user preference from localStorage
  loadUserPreference() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && ['light', 'dark', 'auto'].includes(saved)) {
        this.userPreference = saved;
      }
    } catch (error) {
      console.warn('Could not load theme preference:', error);
    }
  }

  // Save user preference to localStorage
  saveUserPreference(theme) {
    try {
      localStorage.setItem(this.storageKey, theme);
      this.userPreference = theme;
    } catch (error) {
      console.warn('Could not save theme preference:', error);
    }
  }

  // Get effective theme (considering user preference and system preference)
  getEffectiveTheme() {
    if (this.userPreference === 'auto' || !this.userPreference) {
      return this.systemPreference;
    }
    return this.userPreference;
  }

  // Apply theme to document
  applyTheme(theme = null) {
    const effectiveTheme = theme || this.getEffectiveTheme();
    
    // Remove existing theme classes
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    
    // Add new theme class
    document.documentElement.classList.add(`theme-${effectiveTheme}`);
    
    // Set data attribute for CSS targeting
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    
    // Update current theme
    this.currentTheme = effectiveTheme;
    
    // Update theme color meta tag
    this.updateThemeColorMeta(effectiveTheme);
    
    // Dispatch theme change event
    this.dispatchThemeChange(effectiveTheme);
    
    console.log(`Theme applied: ${effectiveTheme}`);
  }

  // Update theme color meta tag for mobile browsers
  updateThemeColorMeta(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    const colors = {
      light: '#ffffff',
      dark: '#2c3e50'
    };
    
    metaThemeColor.content = colors[theme] || colors.light;
  }

  // Set up event listeners
  setupEventListeners() {
    // Listen for system theme changes
    if (this.mediaQuery) {
      this.mediaQuery.addEventListener('change', (e) => {
        this.systemPreference = e.matches ? 'dark' : 'light';
        
        // If user preference is auto, update theme
        if (this.userPreference === 'auto' || !this.userPreference) {
          this.applyTheme();
        }
      });
    }

    // Listen for storage changes (sync across tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey) {
        this.userPreference = e.newValue;
        this.applyTheme();
      }
    });
  }

  // Create theme toggle button
  createThemeToggle() {
    // Check if toggle already exists
    if (document.querySelector('.theme-toggle')) return;

    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle theme');
    toggle.setAttribute('title', 'Toggle light/dark theme');
    
    // Style the toggle button
    toggle.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1001;
      width: 48px;
      height: 48px;
      border: none;
      border-radius: 50%;
      background: var(--color-background);
      color: var(--color-text);
      box-shadow: var(--box-shadow-md);
      cursor: pointer;
      transition: var(--transition-normal);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    `;

    // Update button content based on current theme
    this.updateToggleButton(toggle);

    // Add click event
    toggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Add to document
    document.body.appendChild(toggle);
  }

  // Update toggle button appearance
  updateToggleButton(button) {
    const icons = {
      light: '🌙',
      dark: '☀️'
    };
    
    button.textContent = icons[this.currentTheme] || icons.light;
    button.setAttribute('aria-label', 
      `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} theme`
    );
  }

  // Toggle between light and dark themes
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  // Set specific theme
  setTheme(theme) {
    if (!['light', 'dark', 'auto'].includes(theme)) {
      console.warn(`Invalid theme: ${theme}`);
      return;
    }

    this.saveUserPreference(theme);
    this.applyTheme();
    
    // Update toggle button if it exists
    const toggleButton = document.querySelector('.theme-toggle');
    if (toggleButton) {
      this.updateToggleButton(toggleButton);
    }
  }

  // Dispatch theme change event
  dispatchThemeChange(theme) {
    const event = new CustomEvent('theme:changed', {
      detail: {
        theme,
        userPreference: this.userPreference,
        systemPreference: this.systemPreference
      }
    });
    document.dispatchEvent(event);
  }

  // Get current theme information
  getThemeInfo() {
    return {
      current: this.currentTheme,
      user: this.userPreference,
      system: this.systemPreference,
      effective: this.getEffectiveTheme()
    };
  }

  // Add CSS custom properties for theme switching
  addThemeCSS() {
    if (document.querySelector('#theme-css')) return;

    const style = document.createElement('style');
    style.id = 'theme-css';
    style.textContent = `
      /* Light theme (default) */
      :root,
      [data-theme="light"] {
        --color-primary: #2c3e50;
        --color-secondary: #3498db;
        --color-accent: #e74c3c;
        --color-text: #333333;
        --color-text-light: #666666;
        --color-text-muted: #999999;
        --color-background: #ffffff;
        --color-background-alt: #f8f9fa;
        --color-border: #e1e5e9;
        --color-shadow: rgba(0, 0, 0, 0.1);
      }

      /* Dark theme */
      [data-theme="dark"] {
        --color-primary: #ecf0f1;
        --color-secondary: #3498db;
        --color-accent: #e74c3c;
        --color-text: #ecf0f1;
        --color-text-light: #bdc3c7;
        --color-text-muted: #95a5a6;
        --color-background: #2c3e50;
        --color-background-alt: #34495e;
        --color-border: #4a5f7a;
        --color-shadow: rgba(0, 0, 0, 0.3);
      }

      /* Theme transition */
      *,
      *::before,
      *::after {
        transition: 
          background-color 0.3s ease,
          color 0.3s ease,
          border-color 0.3s ease,
          box-shadow 0.3s ease;
      }

      /* Disable transitions for theme toggle to prevent flash */
      .theme-transitioning *,
      .theme-transitioning *::before,
      .theme-transitioning *::after {
        transition: none !important;
      }

      /* Theme toggle button styles */
      .theme-toggle:hover {
        transform: scale(1.05);
        box-shadow: var(--box-shadow-lg);
      }

      .theme-toggle:active {
        transform: scale(0.95);
      }

      /* Dark theme specific adjustments */
      [data-theme="dark"] .hero-title {
        background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      [data-theme="dark"] .site-header {
        background: rgba(44, 62, 80, 0.95);
      }

      [data-theme="dark"] .content-card,
      [data-theme="dark"] .blog-card,
      [data-theme="dark"] .project-card,
      [data-theme="dark"] .academic-section,
      [data-theme="dark"] .contact-form-container {
        background: var(--color-background-alt);
      }

      [data-theme="dark"] .form-input,
      [data-theme="dark"] .form-textarea {
        background: var(--color-background);
        color: var(--color-text);
      }

      /* Scrollbar styling for dark theme */
      [data-theme="dark"] ::-webkit-scrollbar {
        width: 8px;
      }

      [data-theme="dark"] ::-webkit-scrollbar-track {
        background: var(--color-background-alt);
      }

      [data-theme="dark"] ::-webkit-scrollbar-thumb {
        background: var(--color-border);
        border-radius: 4px;
      }

      [data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
        background: var(--color-text-muted);
      }

      /* Image adjustments for dark theme */
      [data-theme="dark"] img {
        opacity: 0.9;
      }

      [data-theme="dark"] .profile-image {
        opacity: 1;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      }
    `;

    document.head.appendChild(style);
  }

  // Remove theme toggle
  removeThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.remove();
    }
  }

  // Destroy theme manager
  destroy() {
    this.removeThemeToggle();
    
    // Remove event listeners
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemChange);
    }
    
    // Remove theme classes
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.removeAttribute('data-theme');
    
    console.log('Theme manager destroyed');
  }
}