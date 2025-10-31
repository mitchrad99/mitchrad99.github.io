// Component Loader Module - Dynamically loads HTML components
// Enables modular HTML architecture with reusable components

export class ComponentLoader {
  constructor() {
    this.cache = new Map();
    this.loadingComponents = new Map();
  }

  // Load a component into a target element
  async loadComponent(componentName, targetSelector, options = {}) {
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
      const loadingPromise = this._loadComponentInternal(componentName, target, options);
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
  async _loadComponentInternal(componentName, target, options) {
    const {
      useCache = true,
      showLoading = false,
      onLoad = null,
      onError = null,
      timeout = 5000
    } = options;

    try {
      // Show loading indicator if requested
      if (showLoading) {
        this._showLoadingIndicator(target);
      }

      // Check cache first
      if (useCache && this.cache.has(componentName)) {
        const cachedHtml = this.cache.get(componentName);
        this._insertComponent(target, cachedHtml);
        
        if (onLoad) onLoad(componentName, target);
        return { success: true, fromCache: true };
      }

      // Fetch component HTML
      const componentPath = `components/${componentName}.html`;
      const html = await this._fetchWithTimeout(componentPath, timeout);

      // Cache the component
      if (useCache) {
        this.cache.set(componentName, html);
      }

      // Insert component into target
      this._insertComponent(target, html);

      // Initialize component-specific functionality
      await this._initializeComponent(componentName, target);

      if (onLoad) onLoad(componentName, target);
      
      console.log(`✅ Component loaded: ${componentName}`);
      return { success: true, fromCache: false };

    } catch (error) {
      if (onError) {
        onError(error, componentName, target);
      } else {
        this._showErrorState(target, componentName);
      }
      throw error;
    }
  }

  // Fetch HTML with timeout
  async _fetchWithTimeout(url, timeout) {
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
    // Clear existing content
    target.innerHTML = '';
    
    // Insert new content
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
      default:
        // Generic initialization
        this._initGenericComponent(target, componentName);
    }
  }

  // Initialize header component
  _initHeaderComponent(target) {
    // Set up mobile menu toggle if navigation module hasn't handled it yet
    const toggle = target.querySelector('.navbar-toggle');
    const menu = target.querySelector('.navbar-menu');
    
    if (toggle && menu) {
      // This will be handled by the Navigation module
      // Just ensure proper ARIA attributes are set
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

    // Initialize social links with analytics tracking
    const socialLinks = target.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this._trackSocialClick(link);
      });
    });
  }

  // Initialize generic component
  _initGenericComponent(target, componentName) {
    // Handle any data attributes
    const elements = target.querySelectorAll('[data-component-init]');
    elements.forEach(element => {
      const initFunction = element.dataset.componentInit;
      if (this[initFunction] && typeof this[initFunction] === 'function') {
        this[initFunction](element);
      }
    });

    console.log(`Generic initialization for: ${componentName}`);
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

  // Track social link clicks
  _trackSocialClick(link) {
    const platform = this._getSocialPlatform(link.href);
    console.log(`Social click tracked: ${platform}`);
    
    // Here you could integrate with analytics services
    // gtag('event', 'social_click', { platform });
  }

  // Get social platform from URL
  _getSocialPlatform(url) {
    if (url.includes('linkedin')) return 'LinkedIn';
    if (url.includes('github')) return 'GitHub';
    if (url.includes('twitter')) return 'Twitter';
    if (url.includes('mailto:')) return 'Email';
    return 'Unknown';
  }

  // Show loading indicator
  _showLoadingIndicator(target) {
    target.innerHTML = `
      <div class="component-loading" style="
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        color: #666;
      ">
        <div style="
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 10px;
        "></div>
        Loading...
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
  }

  // Show error state
  _showErrorState(target, componentName) {
    target.innerHTML = `
      <div class="component-error" style="
        padding: 1rem;
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        border-radius: 8px;
        text-align: center;
      ">
        <strong>Error:</strong> Failed to load ${componentName} component.
        <button onclick="location.reload()" style="
          display: block;
          margin: 0.5rem auto 0;
          padding: 0.25rem 0.5rem;
          background: none;
          border: 1px solid currentColor;
          border-radius: 4px;
          color: inherit;
          cursor: pointer;
        ">
          Retry
        </button>
      </div>
    `;
  }

  // Preload components
  async preloadComponents(componentNames, options = {}) {
    const promises = componentNames.map(name => 
      this._preloadComponent(name, options)
    );

    try {
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      console.log(`Preloaded ${successful}/${componentNames.length} components`);
      return results;
    } catch (error) {
      console.error('Component preloading failed:', error);
      throw error;
    }
  }

  // Preload single component
  async _preloadComponent(componentName, options) {
    try {
      const componentPath = `components/${componentName}.html`;
      const html = await this._fetchWithTimeout(componentPath, options.timeout || 5000);
      this.cache.set(componentName, html);
      return { componentName, success: true };
    } catch (error) {
      console.warn(`Failed to preload component: ${componentName}`, error);
      return { componentName, success: false, error };
    }
  }

  // Clear component cache
  clearCache(componentName = null) {
    if (componentName) {
      this.cache.delete(componentName);
      console.log(`Cache cleared for: ${componentName}`);
    } else {
      this.cache.clear();
      console.log('All component cache cleared');
    }
  }

  // Get cache statistics
  getCacheStats() {
    return {
      totalCached: this.cache.size,
      cachedComponents: Array.from(this.cache.keys()),
      loading: Array.from(this.loadingComponents.keys())
    };
  }

  // Reload component with fresh data
  async reloadComponent(componentName, targetSelector, options = {}) {
    // Clear from cache
    this.cache.delete(componentName);
    
    // Reload with fresh data
    return await this.loadComponent(componentName, targetSelector, {
      ...options,
      useCache: false
    });
  }
}