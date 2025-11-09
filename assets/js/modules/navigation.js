// Navigation Module - Handles navigation functionality
// Modern ES6 module for responsive navigation

export class Navigation {
  constructor() {
    this.navbar = null;
    this.navbarToggle = null;
    this.navbarMenu = null;
    this.navLinks = [];
    this.isMenuOpen = false;
    this.isScrolled = false;
    this.scrollThreshold = 50;
  }

  // Initialize navigation
  init() {
    try {
      this.cacheElements();
      this.setupEventListeners();
      this.setActiveNavLink();
      this.handleScroll();
      console.log('✅ Navigation initialized');
    } catch (error) {
      console.error('❌ Navigation initialization failed:', error);
    }
  }

  // Cache DOM elements
  cacheElements() {
    this.navbar = document.querySelector('.site-header');
    this.navbarToggle = document.querySelector('.navbar-toggle');
    this.navbarMenu = document.querySelector('.navbar-menu');
    this.navLinks = document.querySelectorAll('.nav-link');

    if (!this.navbar) {
      console.warn('Navigation elements not found');
    }
  }

  // Set up event listeners
  setupEventListeners() {
    // Mobile menu toggle
    if (this.navbarToggle) {
      this.navbarToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });
    }

    // Close mobile menu when clicking nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isMenuOpen) {
          this.closeMobileMenu();
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && this.navbar && !this.navbar.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Handle scroll for navbar styling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
      }, 10);
    });
  }

  // Toggle mobile menu
  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  // Open mobile menu
  openMobileMenu() {
    this.isMenuOpen = true;
    
    if (this.navbarMenu) {
      this.navbarMenu.classList.add('active');
    }
    
    if (this.navbarToggle) {
      this.navbarToggle.classList.add('active');
      this.navbarToggle.setAttribute('aria-expanded', 'true');
    }

    // Prevent body scrolling when menu is open
    document.body.style.overflow = 'hidden';

    // Focus first nav link for accessibility
    const firstNavLink = this.navLinks[0];
    if (firstNavLink) {
      setTimeout(() => firstNavLink.focus(), 100);
    }
  }

  // Close mobile menu
  closeMobileMenu() {
    this.isMenuOpen = false;
    
    if (this.navbarMenu) {
      this.navbarMenu.classList.remove('active');
    }
    
    if (this.navbarToggle) {
      this.navbarToggle.classList.remove('active');
      this.navbarToggle.setAttribute('aria-expanded', 'false');
    }

    // Restore body scrolling
    document.body.style.overflow = '';
  }

  // Handle scroll events
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const shouldBeScrolled = scrollTop > this.scrollThreshold;

    if (shouldBeScrolled !== this.isScrolled) {
      this.isScrolled = shouldBeScrolled;
      
      if (this.navbar) {
        this.navbar.classList.toggle('scrolled', this.isScrolled);
      }
    }
  }

  // Handle window resize (called from main.js global events)
  handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    // Close mobile menu on desktop
    if (!isMobile && this.isMenuOpen) {
      this.closeMobileMenu();
    }
  }

  // Set active navigation link based on current page
  setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === currentPage || 
                      (currentPage === '' && href === 'index.html') ||
                      (currentPage === 'index.html' && href === 'index.html');
      
      link.classList.toggle('active', isActive);
      
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }
}