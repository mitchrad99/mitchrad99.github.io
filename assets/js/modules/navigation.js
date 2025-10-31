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
      throw new Error('Navigation elements not found');
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
      if (this.isMenuOpen && !this.navbar.contains(e.target)) {
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

    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
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

    // Dispatch custom event
    this.dispatchEvent('navigation:menu-opened');
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

    // Dispatch custom event
    this.dispatchEvent('navigation:menu-closed');
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

      // Dispatch custom event
      this.dispatchEvent('navigation:scroll-change', { scrolled: this.isScrolled });
    }
  }

  // Handle window resize
  handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    // Close mobile menu on desktop
    if (!isMobile && this.isMenuOpen) {
      this.closeMobileMenu();
    }

    // Dispatch custom event
    this.dispatchEvent('navigation:resize', { isMobile });
  }

  // Handle keyboard navigation
  handleKeyboard(e) {
    if (!this.isMenuOpen) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.closeMobileMenu();
        this.navbarToggle?.focus();
        break;
      
      case 'Tab':
        this.handleTabNavigation(e);
        break;
    }
  }

  // Handle tab navigation within mobile menu
  handleTabNavigation(e) {
    const focusableElements = this.navbarMenu.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
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

  // Smooth scroll to section
  scrollToSection(sectionId, offset = 80) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
      top: sectionTop,
      behavior: 'smooth'
    });
  }

  // Add navigation link programmatically
  addNavLink(text, href, position = 'end') {
    const navList = document.querySelector('.navbar-nav');
    if (!navList) return;

    const listItem = document.createElement('li');
    listItem.className = 'nav-item';
    listItem.setAttribute('role', 'none');

    const link = document.createElement('a');
    link.href = href;
    link.className = 'nav-link';
    link.textContent = text;
    link.setAttribute('role', 'menuitem');

    listItem.appendChild(link);

    if (position === 'start') {
      navList.insertBefore(listItem, navList.firstChild);
    } else {
      navList.appendChild(listItem);
    }

    // Update cached nav links
    this.navLinks = document.querySelectorAll('.nav-link');
    
    // Add event listener to new link
    link.addEventListener('click', () => {
      if (this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  // Remove navigation link
  removeNavLink(href) {
    const link = document.querySelector(`.nav-link[href="${href}"]`);
    if (link) {
      const listItem = link.closest('.nav-item');
      if (listItem) {
        listItem.remove();
        // Update cached nav links
        this.navLinks = document.querySelectorAll('.nav-link');
      }
    }
  }

  // Dispatch custom events
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }

  // Get navigation state
  getState() {
    return {
      isMenuOpen: this.isMenuOpen,
      isScrolled: this.isScrolled,
      activeLink: document.querySelector('.nav-link.active')?.href || null,
      isMobile: window.innerWidth <= 768
    };
  }

  // Destroy navigation (cleanup)
  destroy() {
    // Remove event listeners and clean up
    if (this.navbarToggle) {
      this.navbarToggle.replaceWith(this.navbarToggle.cloneNode(true));
    }
    
    document.body.style.overflow = '';
    this.closeMobileMenu();
    
    console.log('Navigation destroyed');
  }
}