// Main JavaScript Module - Entry point for the application
// Uses modern ES6+ features and modular architecture

// ===== IMPORTS ===== 
import { Navigation } from './modules/navigation.js';
import { ComponentLoader } from './modules/component-loader.js';
import { ThemeManager } from './modules/theme-manager.js';
import { Utils } from './modules/utils.js';

// ===== MAIN APPLICATION CLASS =====
class App {
  constructor() {
    this.navigation = null;
    this.componentLoader = null;
    this.themeManager = null;
    this.isInitialized = false;
  }

  // Initialize the application
  async init() {
    try {
      console.log('🚀 Initializing Mitch Radakovich Portfolio...');
      
      // Initialize core modules
      this.componentLoader = new ComponentLoader();
      this.navigation = new Navigation();
      this.themeManager = new ThemeManager();
      
      // Load components first
      await this.loadComponents();
      
      // Initialize navigation after components are loaded
      this.navigation.init();
      
      // Initialize theme manager
      this.themeManager.init();
      
      // Initialize page-specific functionality
      this.initPageSpecific();
      
      // Set up global event listeners
      this.setupGlobalEvents();
      
      // Update copyright year
      this.updateCopyrightYear();
      
      this.isInitialized = true;
      console.log('✅ Application initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
    }
  }

  // Load shared components
  async loadComponents() {
    try {
      await Promise.all([
        this.componentLoader.loadComponent('header', '#header-component'),
        this.componentLoader.loadComponent('footer', '#footer-component')
      ]);
    } catch (error) {
      console.error('Failed to load components:', error);
    }
  }

  // Initialize page-specific functionality
  initPageSpecific() {
    const page = Utils.getCurrentPage();
    
    switch (page) {
      case 'index':
        this.initHomePage();
        break;
      case 'blog':
        this.initBlogPage();
        break;
      case 'contact':
        this.initContactPage();
        break;
      case 'academics':
        this.initAcademicsPage();
        break;
      default:
        console.log(`No specific initialization for page: ${page}`);
    }
  }

  // Initialize home page specific features
  initHomePage() {
    console.log('🏠 Initializing home page features');
    
    // Animate hero section on load
    this.animateHeroSection();
    
    // Set up smooth scrolling for internal links
    this.setupSmoothScrolling();
  }

  // Initialize blog page specific features
  initBlogPage() {
    console.log('📝 Initializing blog page features');
    
    // Could add blog-specific features like:
    // - Search functionality
    // - Filter by category
    // - Load more posts
    // - Reading time calculation
  }

  // Initialize contact page specific features
  initContactPage() {
    console.log('📧 Initializing contact page features');
    
    // Set up form handling
    this.setupContactForm();
  }

  // Initialize academics page specific features
  initAcademicsPage() {
    console.log('🎓 Initializing academics page features');
    
    // Could add features like:
    // - Interactive project showcases
    // - Course timeline
    // - Skills progress bars
  }

  // Animate hero section elements
  animateHeroSection() {
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-actions');
    
    heroElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }

  // Set up smooth scrolling for anchor links
  setupSmoothScrolling() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  }

  // Set up contact form handling
  setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      try {
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission (replace with actual submission logic)
        await this.submitContactForm(data);
        
        // Show success message
        this.showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
        
      } catch (error) {
        console.error('Form submission error:', error);
        this.showFormMessage('There was an error sending your message. Please try again.', 'error');
      } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
  }

  // Simulate form submission (replace with actual API call)
  async submitContactForm(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form submitted:', data);
        resolve();
      }, 1000);
    });
  }

  // Show form message
  showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message--${type}`;
    messageDiv.textContent = message;
    
    // Add styles
    messageDiv.style.cssText = `
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 8px;
      font-weight: 500;
      ${type === 'success' 
        ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;'
        : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
      }
    `;

    // Insert message
    const form = document.getElementById('contact-form');
    form.insertBefore(messageDiv, form.firstChild);

    // Remove message after 5 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }

  // Set up global event listeners
  setupGlobalEvents() {
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 150);
    });

    // Handle page visibility change
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });
  }

  // Handle window resize
  handleResize() {
    // Update navigation if needed
    if (this.navigation) {
      this.navigation.handleResize();
    }
    
    // Dispatch custom resize event
    window.dispatchEvent(new CustomEvent('app:resize'));
  }

  // Handle page visibility change
  handleVisibilityChange() {
    if (document.hidden) {
      console.log('🔍 Page hidden');
    } else {
      console.log('👁️ Page visible');
    }
  }

  // Handle keyboard navigation
  handleKeyboardNavigation(e) {
    // Escape key - close mobile menu if open
    if (e.key === 'Escape' && this.navigation) {
      this.navigation.closeMobileMenu();
    }
  }

  // Update copyright year in footer
  updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // Public method to get app status
  getStatus() {
    return {
      initialized: this.isInitialized,
      modules: {
        navigation: !!this.navigation,
        componentLoader: !!this.componentLoader,
        themeManager: !!this.themeManager
      }
    };
  }
}

// ===== APPLICATION INITIALIZATION =====
// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

async function initApp() {
  try {
    // Create global app instance
    window.App = new App();
    await window.App.init();
  } catch (error) {
    console.error('Failed to start application:', error);
  }
}

// ===== ERROR HANDLING =====
// Global error handler
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// ===== EXPORTS =====
export { App };