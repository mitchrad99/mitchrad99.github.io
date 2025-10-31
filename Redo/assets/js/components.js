// Components JavaScript - Component initialization and management
// Handles dynamic component loading and initialization

import { ComponentLoader } from './modules/component-loader.js';
import { Utils } from './modules/utils.js';

// ===== COMPONENT REGISTRY =====
class ComponentRegistry {
  constructor() {
    this.components = new Map();
    this.initialized = new Set();
  }

  // Register a component
  register(name, component) {
    this.components.set(name, component);
  }

  // Get a component
  get(name) {
    return this.components.get(name);
  }

  // Initialize a component
  async init(name, element, options = {}) {
    const Component = this.get(name);
    if (!Component) {
      console.warn(`Component not found: ${name}`);
      return null;
    }

    try {
      const instance = new Component(element, options);
      if (instance.init && typeof instance.init === 'function') {
        await instance.init();
      }
      
      this.initialized.add(name);
      return instance;
    } catch (error) {
      console.error(`Failed to initialize component ${name}:`, error);
      return null;
    }
  }

  // Check if component is initialized
  isInitialized(name) {
    return this.initialized.has(name);
  }

  // Get all registered components
  list() {
    return Array.from(this.components.keys());
  }
}

// ===== COMPONENT DEFINITIONS =====

// Card Component - Interactive cards with hover effects
class CardComponent {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      hoverEffect: true,
      clickable: true,
      ...options
    };
  }

  init() {
    if (this.options.hoverEffect) {
      this.setupHoverEffect();
    }
    
    if (this.options.clickable) {
      this.setupClickHandling();
    }

    this.element.classList.add('component-card');
  }

  setupHoverEffect() {
    this.element.addEventListener('mouseenter', () => {
      this.element.style.transform = 'translateY(-4px)';
      this.element.style.boxShadow = 'var(--box-shadow-lg)';
    });

    this.element.addEventListener('mouseleave', () => {
      this.element.style.transform = '';
      this.element.style.boxShadow = '';
    });
  }

  setupClickHandling() {
    const link = this.element.querySelector('a, [data-href]');
    if (link) {
      this.element.style.cursor = 'pointer';
      this.element.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
          const href = link.href || link.dataset.href;
          if (href) {
            window.location.href = href;
          }
        }
      });
    }
  }
}

// Modal Component - Accessible modal dialogs
class ModalComponent {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      closeOnEscape: true,
      closeOnBackdrop: true,
      focusTrap: true,
      ...options
    };
    this.isOpen = false;
    this.previousFocus = null;
  }

  init() {
    this.setupModal();
    this.setupEventListeners();
  }

  setupModal() {
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');
    this.element.style.display = 'none';
    
    // Create backdrop if it doesn't exist
    if (!this.element.querySelector('.modal-backdrop')) {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
      `;
      this.element.appendChild(backdrop);
    }
  }

  setupEventListeners() {
    // Close button
    const closeBtn = this.element.querySelector('[data-modal-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Backdrop click
    if (this.options.closeOnBackdrop) {
      const backdrop = this.element.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', () => this.close());
      }
    }

    // Escape key
    if (this.options.closeOnEscape) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }
  }

  open() {
    this.previousFocus = document.activeElement;
    this.element.style.display = 'flex';
    this.isOpen = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus first focusable element
    const firstFocusable = this.element.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Setup focus trap
    if (this.options.focusTrap) {
      this.focusTrap = Utils.createFocusTrap(this.element);
      this.focusTrap.activate();
    }

    this.element.dispatchEvent(new CustomEvent('modal:opened'));
  }

  close() {
    this.element.style.display = 'none';
    this.isOpen = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Restore focus
    if (this.previousFocus) {
      this.previousFocus.focus();
    }

    // Deactivate focus trap
    if (this.focusTrap) {
      this.focusTrap.deactivate();
    }

    this.element.dispatchEvent(new CustomEvent('modal:closed'));
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

// Tab Component - Accessible tabbed interfaces
class TabComponent {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      activeClass: 'active',
      keyboardNavigation: true,
      ...options
    };
    this.tabs = [];
    this.panels = [];
    this.activeIndex = 0;
  }

  init() {
    this.tabs = Array.from(this.element.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(this.element.querySelectorAll('[role="tabpanel"]'));
    
    this.setupTabs();
    this.setupEventListeners();
    this.activateTab(0);
  }

  setupTabs() {
    this.tabs.forEach((tab, index) => {
      tab.setAttribute('aria-controls', this.panels[index]?.id || `panel-${index}`);
      tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
      
      if (!this.panels[index]?.id) {
        this.panels[index].id = `panel-${index}`;
      }
      
      this.panels[index].setAttribute('aria-labelledby', tab.id || `tab-${index}`);
      
      if (!tab.id) {
        tab.id = `tab-${index}`;
      }
    });
  }

  setupEventListeners() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        this.activateTab(index);
      });

      if (this.options.keyboardNavigation) {
        tab.addEventListener('keydown', (e) => {
          this.handleKeydown(e, index);
        });
      }
    });
  }

  handleKeydown(e, currentIndex) {
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
        break;
      case 'ArrowRight':
        newIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = this.tabs.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    this.activateTab(newIndex);
    this.tabs[newIndex].focus();
  }

  activateTab(index) {
    if (index < 0 || index >= this.tabs.length) return;

    // Deactivate all tabs and panels
    this.tabs.forEach((tab, i) => {
      tab.classList.remove(this.options.activeClass);
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
      
      if (this.panels[i]) {
        this.panels[i].classList.remove(this.options.activeClass);
        this.panels[i].setAttribute('aria-hidden', 'true');
      }
    });

    // Activate selected tab and panel
    this.tabs[index].classList.add(this.options.activeClass);
    this.tabs[index].setAttribute('aria-selected', 'true');
    this.tabs[index].setAttribute('tabindex', '0');
    
    if (this.panels[index]) {
      this.panels[index].classList.add(this.options.activeClass);
      this.panels[index].setAttribute('aria-hidden', 'false');
    }

    this.activeIndex = index;
    
    this.element.dispatchEvent(new CustomEvent('tab:changed', {
      detail: { index, tab: this.tabs[index], panel: this.panels[index] }
    }));
  }
}

// Form Validator Component - Client-side form validation
class FormValidatorComponent {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      validateOnInput: true,
      validateOnBlur: true,
      showErrors: true,
      ...options
    };
    this.validators = new Map();
    this.errors = new Map();
  }

  init() {
    this.setupValidators();
    this.setupEventListeners();
  }

  setupValidators() {
    // Default validators
    this.addValidator('required', (value) => {
      return value.trim() !== '' || 'This field is required';
    });

    this.addValidator('email', (value) => {
      return Utils.isValidEmail(value) || 'Please enter a valid email address';
    });

    this.addValidator('minLength', (value, min) => {
      return value.length >= min || `Minimum length is ${min} characters`;
    });

    this.addValidator('maxLength', (value, max) => {
      return value.length <= max || `Maximum length is ${max} characters`;
    });
  }

  setupEventListeners() {
    const inputs = this.element.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      if (this.options.validateOnInput) {
        input.addEventListener('input', () => this.validateField(input));
      }
      
      if (this.options.validateOnBlur) {
        input.addEventListener('blur', () => this.validateField(input));
      }
    });

    this.element.addEventListener('submit', (e) => {
      if (!this.validateForm()) {
        e.preventDefault();
      }
    });
  }

  addValidator(name, validatorFn) {
    this.validators.set(name, validatorFn);
  }

  validateField(field) {
    const rules = this.getValidationRules(field);
    const errors = [];

    for (const rule of rules) {
      const validator = this.validators.get(rule.type);
      if (validator) {
        const result = validator(field.value, rule.param);
        if (result !== true) {
          errors.push(result);
        }
      }
    }

    this.errors.set(field.name || field.id, errors);
    
    if (this.options.showErrors) {
      this.displayErrors(field, errors);
    }

    return errors.length === 0;
  }

  validateForm() {
    const inputs = this.element.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  getValidationRules(field) {
    const rules = [];
    
    if (field.hasAttribute('required')) {
      rules.push({ type: 'required' });
    }
    
    if (field.type === 'email') {
      rules.push({ type: 'email' });
    }
    
    if (field.hasAttribute('minlength')) {
      rules.push({ type: 'minLength', param: parseInt(field.getAttribute('minlength')) });
    }
    
    if (field.hasAttribute('maxlength')) {
      rules.push({ type: 'maxLength', param: parseInt(field.getAttribute('maxlength')) });
    }

    return rules;
  }

  displayErrors(field, errors) {
    // Remove existing error messages
    const existingError = this.element.querySelector(`[data-error-for="${field.name || field.id}"]`);
    if (existingError) {
      existingError.remove();
    }

    // Add error styling
    field.classList.toggle('error', errors.length > 0);

    // Display new error messages
    if (errors.length > 0) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'field-error';
      errorDiv.setAttribute('data-error-for', field.name || field.id);
      errorDiv.style.cssText = `
        color: var(--color-accent);
        font-size: var(--font-size-sm);
        margin-top: var(--space-xs);
      `;
      errorDiv.textContent = errors[0]; // Show first error
      
      field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
  }
}

// ===== GLOBAL COMPONENT REGISTRY =====
const componentRegistry = new ComponentRegistry();

// Register components
componentRegistry.register('card', CardComponent);
componentRegistry.register('modal', ModalComponent);
componentRegistry.register('tabs', TabComponent);
componentRegistry.register('form-validator', FormValidatorComponent);

// ===== AUTO-INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initializeComponents();
});

// Also initialize on dynamic content load
document.addEventListener('component:loaded', () => {
  initializeComponents();
});

function initializeComponents() {
  // Auto-initialize components with data attributes
  const elements = document.querySelectorAll('[data-component]');
  
  elements.forEach(async (element) => {
    const componentName = element.dataset.component;
    const options = element.dataset.componentOptions ? 
      JSON.parse(element.dataset.componentOptions) : {};
    
    if (!componentRegistry.isInitialized(componentName + element.id)) {
      await componentRegistry.init(componentName, element, options);
    }
  });
}

// ===== EXPORTS =====
export { 
  componentRegistry,
  CardComponent,
  ModalComponent,
  TabComponent,
  FormValidatorComponent
};