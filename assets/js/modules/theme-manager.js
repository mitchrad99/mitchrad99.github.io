// Theme Manager Module - Handles light/dark theme switching
// Simple theme toggle with localStorage persistence

export class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.storageKey = 'mitch-portfolio-theme';
  }

  // Initialize theme manager
  init() {
    try {
      this.loadUserPreference();
      this.applyTheme();
      this.setupEventListeners();
      this.createThemeToggle();
      this.addThemeCSS();
      console.log('✅ Theme manager initialized');
    } catch (error) {
      console.error('❌ Theme manager initialization failed:', error);
    }
  }

  // Load user preference from localStorage
  loadUserPreference() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && ['light', 'dark'].includes(saved)) {
        this.currentTheme = saved;
      }
    } catch (error) {
      console.warn('Could not load theme preference:', error);
      this.currentTheme = 'light';
    }
  }

  // Save user preference to localStorage
  saveUserPreference(theme) {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (error) {
      console.warn('Could not save theme preference:', error);
    }
  }

  // Apply theme to document
  applyTheme() {
    // Remove existing theme classes
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    
    // Add new theme class
    document.documentElement.classList.add(`theme-${this.currentTheme}`);
    
    // Set data attribute for CSS targeting
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    console.log(`Theme applied: ${this.currentTheme}`);
  }

  // Set up event listeners for storage changes (sync across tabs)
  setupEventListeners() {
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey && e.newValue) {
        this.currentTheme = e.newValue;
        this.applyTheme();
        this.updateToggleButton();
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
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    `;

    // Update button content
    this.updateToggleButton(toggle);

    // Add click event
    toggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Add hover effect
    toggle.addEventListener('mouseenter', () => {
      toggle.style.transform = 'scale(1.05)';
    });
    
    toggle.addEventListener('mouseleave', () => {
      toggle.style.transform = 'scale(1)';
    });

    // Add to document
    document.body.appendChild(toggle);
  }

  // Update toggle button appearance
  updateToggleButton(button = null) {
    const toggleButton = button || document.querySelector('.theme-toggle');
    if (!toggleButton) return;

    const icons = {
      light: '🌙',
      dark: '☀️'
    };
    
    toggleButton.textContent = icons[this.currentTheme];
    toggleButton.setAttribute('aria-label', 
      `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} theme`
    );
  }

  // Toggle between light and dark themes
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.saveUserPreference(this.currentTheme);
    this.applyTheme();
    this.updateToggleButton();
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
        --color-background: #ffffff;
        --color-background-alt: #f8f9fa;
        --color-border: #e1e5e9;
      }

      /* Dark theme */
      [data-theme="dark"] {
        --color-primary: #ecf0f1;
        --color-secondary: #3498db;
        --color-accent: #e74c3c;
        --color-text: #ecf0f1;
        --color-text-light: #bdc3c7;
        --color-background: #2c3e50;
        --color-background-alt: #34495e;
        --color-border: #4a5f7a;
      }

      /* Theme transition */
      * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      }

      /* Dark theme specific adjustments */
      [data-theme="dark"] .site-header {
        background: rgba(44, 62, 80, 0.95);
      }

      [data-theme="dark"] .hero-title {
        background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      [data-theme="dark"] .content-card,
      [data-theme="dark"] .blog-card,
      [data-theme="dark"] .project-card {
        background: var(--color-background-alt);
      }

      [data-theme="dark"] .form-input,
      [data-theme="dark"] .form-textarea {
        background: var(--color-background);
        color: var(--color-text);
      }
    `;

    document.head.appendChild(style);
  }
}