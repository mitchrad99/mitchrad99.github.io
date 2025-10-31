// Utilities Module - Common utility functions and helpers
// Provides reusable functionality across the application

export class Utils {
  // ===== DOM UTILITIES =====
  
  // Get current page name from URL
  static getCurrentPage() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop();
    
    if (!fileName || fileName === '' || fileName === '/') {
      return 'index';
    }
    
    return fileName.replace('.html', '');
  }

  // Safely query selector with error handling
  static safeQuerySelector(selector, context = document) {
    try {
      return context.querySelector(selector);
    } catch (error) {
      console.warn(`Invalid selector: ${selector}`, error);
      return null;
    }
  }

  // Safely query all selectors with error handling
  static safeQuerySelectorAll(selector, context = document) {
    try {
      return Array.from(context.querySelectorAll(selector));
    } catch (error) {
      console.warn(`Invalid selector: ${selector}`, error);
      return [];
    }
  }

  // Check if element is in viewport
  static isInViewport(element, threshold = 0) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
      rect.top >= -threshold &&
      rect.left >= -threshold &&
      rect.bottom <= windowHeight + threshold &&
      rect.right <= windowWidth + threshold
    );
  }

  // Smooth scroll to element
  static scrollToElement(element, offset = 0, behavior = 'smooth') {
    if (!element) return;
    
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
      top: elementTop,
      behavior
    });
  }

  // Get element's offset from document top
  static getElementOffset(element) {
    if (!element) return { top: 0, left: 0 };
    
    let top = 0;
    let left = 0;
    let current = element;
    
    while (current) {
      top += current.offsetTop;
      left += current.offsetLeft;
      current = current.offsetParent;
    }
    
    return { top, left };
  }

  // ===== STRING UTILITIES =====
  
  // Capitalize first letter
  static capitalize(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Convert string to kebab-case
  static toKebabCase(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  // Convert string to camelCase
  static toCamelCase(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  // Truncate string with ellipsis
  static truncate(str, length = 100, suffix = '...') {
    if (!str || typeof str !== 'string') return '';
    if (str.length <= length) return str;
    return str.substring(0, length).trim() + suffix;
  }

  // Strip HTML tags from string
  static stripHtml(str) {
    if (!str || typeof str !== 'string') return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = str;
    return tempDiv.textContent || tempDiv.innerText || '';
  }

  // ===== ARRAY UTILITIES =====
  
  // Shuffle array (Fisher-Yates algorithm)
  static shuffleArray(array) {
    if (!Array.isArray(array)) return [];
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  }

  // Get random item from array
  static getRandomItem(array) {
    if (!Array.isArray(array) || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
  }

  // Remove duplicates from array
  static uniqueArray(array) {
    if (!Array.isArray(array)) return [];
    return [...new Set(array)];
  }

  // Chunk array into smaller arrays
  static chunkArray(array, size) {
    if (!Array.isArray(array) || size <= 0) return [];
    const chunks = [];
    
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    
    return chunks;
  }

  // ===== OBJECT UTILITIES =====
  
  // Deep clone object
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const cloned = {};
      Object.keys(obj).forEach(key => {
        cloned[key] = this.deepClone(obj[key]);
      });
      return cloned;
    }
  }

  // Merge objects deeply
  static deepMerge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.deepMerge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.deepMerge(target, ...sources);
  }

  // Check if value is an object
  static isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  // ===== DATE UTILITIES =====
  
  // Format date to readable string
  static formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-US', formatOptions);
    } catch (error) {
      console.warn('Invalid date:', date);
      return 'Invalid Date';
    }
  }

  // Get relative time (e.g., "2 days ago")
  static getRelativeTime(date) {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const diffInMs = now - dateObj;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
      return `${Math.floor(diffInDays / 365)} years ago`;
    } catch (error) {
      console.warn('Invalid date for relative time:', date);
      return 'Unknown';
    }
  }

  // ===== URL UTILITIES =====
  
  // Get URL parameters as object
  static getUrlParams() {
    const params = {};
    const urlParams = new URLSearchParams(window.location.search);
    
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
    
    return params;
  }

  // Update URL parameter without page reload
  static updateUrlParam(key, value) {
    const url = new URL(window.location);
    
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
    
    window.history.replaceState({}, '', url);
  }

  // ===== PERFORMANCE UTILITIES =====
  
  // Debounce function
  static debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  // Throttle function
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // ===== VALIDATION UTILITIES =====
  
  // Validate email address
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate URL
  static isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // ===== DEVICE DETECTION =====
  
  // Check if device is mobile
  static isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Check if device is tablet
  static isTablet() {
    return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(navigator.userAgent);
  }

  // Check if device is desktop
  static isDesktop() {
    return !this.isMobile() && !this.isTablet();
  }

  // Get device type
  static getDeviceType() {
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    return 'desktop';
  }

  // ===== STORAGE UTILITIES =====
  
  // Safe localStorage setItem
  static setLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('LocalStorage not available:', error);
      return false;
    }
  }

  // Safe localStorage getItem
  static getLocalStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('LocalStorage read error:', error);
      return defaultValue;
    }
  }

  // Safe localStorage removeItem
  static removeLocalStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('LocalStorage remove error:', error);
      return false;
    }
  }

  // ===== ACCESSIBILITY UTILITIES =====
  
  // Announce to screen readers
  static announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    
    document.body.appendChild(announcement);
    announcement.textContent = message;
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Focus trap for modals/menus
  static createFocusTrap(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    });

    return {
      activate: () => firstFocusable?.focus(),
      deactivate: () => element.removeEventListener('keydown', this)
    };
  }

  // ===== ANIMATION UTILITIES =====
  
  // Simple fade in animation
  static fadeIn(element, duration = 300) {
    return new Promise((resolve) => {
      element.style.opacity = '0';
      element.style.transition = `opacity ${duration}ms ease`;
      
      requestAnimationFrame(() => {
        element.style.opacity = '1';
        setTimeout(resolve, duration);
      });
    });
  }

  // Simple fade out animation
  static fadeOut(element, duration = 300) {
    return new Promise((resolve) => {
      element.style.opacity = '1';
      element.style.transition = `opacity ${duration}ms ease`;
      
      requestAnimationFrame(() => {
        element.style.opacity = '0';
        setTimeout(resolve, duration);
      });
    });
  }

  // ===== LOGGING UTILITIES =====
  
  // Enhanced console.log with timestamp and context
  static log(message, context = '', level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = context ? `[${context}]` : '';
    const fullMessage = `${timestamp} ${prefix} ${message}`;
    
    switch (level) {
      case 'error':
        console.error(fullMessage);
        break;
      case 'warn':
        console.warn(fullMessage);
        break;
      case 'debug':
        console.debug(fullMessage);
        break;
      default:
        console.log(fullMessage);
    }
  }
}