// Component Loader Module - Dynamically loads HTML components
// Enables modular HTML architecture with reusable components

export class ComponentLoader {
  constructor() {
    this.cache = new Map();
    this.loadingComponents = new Map();
  }

  // Load a component into a target element
  async loadComponent(componentName, targetSelector) {
    try {
      const target = document.querySelector(targetSelector);
      if (!target) {
        throw new Error(`Target element not found: ${targetSelector}`);
      }

      // Check if already loading this component
      const loadingKey = `${componentName}-${targetSelector}`;
      if (this.loadingComponents.has(loadingKey)) {
        return await this.loadingComponents.get(loadingKey);
      }

      // Create loading promise
      const loadingPromise = this._loadComponentInternal(componentName, target);
      this.loadingComponents.set(loadingKey, loadingPromise);

      const result = await loadingPromise;
      
      // Clean up loading state
      this.loadingComponents.delete(loadingKey);
      
      return result;

    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
      throw error;
    }
  }

  // Internal component loading logic
  async _loadComponentInternal(componentName, target) {
    try {
      // Check cache first
      if (this.cache.has(componentName)) {
        const cachedHtml = this.cache.get(componentName);
        this._insertComponent(target, cachedHtml);
        return { success: true, fromCache: true };
      }

      // Fetch component HTML
      const componentPath = `components/${componentName}.html`;
      const html = await this._fetchWithTimeout(componentPath);

      // Cache the component
      this.cache.set(componentName, html);

      // Insert component into target
      this._insertComponent(target, html);

      // Initialize component-specific functionality
      await this._initializeComponent(componentName, target);
      
      console.log(`✅ Component loaded: ${componentName}`);
      return { success: true, fromCache: false };

    } catch (error) {
      throw error;
    }
  }

  // Fetch HTML with timeout
  async _fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        cache: 'default'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      return html;

    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`Component fetch timeout: ${url}`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Insert component HTML into target element
  _insertComponent(target, html) {
    // Clear existing content and insert new content
    target.innerHTML = html;

    // Dispatch custom event
    const event = new CustomEvent('component:loaded', {
      detail: { target, html }
    });
    target.dispatchEvent(event);
  }

  // Initialize component-specific functionality
  async _initializeComponent(componentName, target) {
    switch (componentName) {
      case 'header':
        this._initHeaderComponent(target);
        break;
      case 'footer':
        this._initFooterComponent(target);
        break;
    }
  }

  // Initialize header component
  _initHeaderComponent(target) {
    // Set up ARIA attributes for mobile menu
    const toggle = target.querySelector('.navbar-toggle');
    const menu = target.querySelector('.navbar-menu');
    
    if (toggle && menu) {
      toggle.setAttribute('aria-controls', 'navbar-menu');
      toggle.setAttribute('aria-expanded', 'false');
    }

    // Add scroll listener for header styling
    this._setupHeaderScrollEffect(target);
  }

  // Initialize footer component
  _initFooterComponent(target) {
    // Update copyright year
    const yearElement = target.querySelector('#current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // Set up header scroll effect
  _setupHeaderScrollEffect(headerTarget) {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const header = headerTarget.querySelector('.site-header');
      
      if (!header) return;

      if (currentScrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide/show header on scroll
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }

      lastScrollY = currentScrollY;
    };

    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 10);
    });
  }
}