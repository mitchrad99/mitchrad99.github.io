# Mitch Radakovich Portfolio - Modern Web Development Setup

A modern, responsive portfolio website built with semantic HTML5, CSS Grid/Flexbox, ES6+ JavaScript modules, and modern development tooling.

## 🚀 Features

### Modern Web Technologies
- **Semantic HTML5** with proper accessibility attributes
- **CSS Grid & Flexbox** for responsive layouts
- **CSS Custom Properties** for consistent theming
- **ES6+ JavaScript Modules** for modular architecture
- **Component-based architecture** for reusable code
- **Progressive Web App** ready structure

### Developer Experience
- **Live development server** with hot reload
- **Build system** with CSS/JS minification
- **Code linting** and formatting
- **Image optimization** pipeline
- **Accessibility testing** with axe-core
- **Performance testing** with Lighthouse

### Performance & Accessibility
- **Optimized loading** with resource hints
- **Responsive images** and lazy loading
- **ARIA labels** and semantic markup
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Color contrast** compliance

## 📁 Project Structure

```
Redo/
├── assets/
│   ├── css/
│   │   ├── main.css          # Core styles with CSS custom properties
│   │   ├── components.css    # Component-specific styles
│   │   └── responsive.css    # Responsive design and media queries
│   ├── js/
│   │   ├── main.js          # Main application entry point
│   │   ├── components.js     # Component system
│   │   └── modules/         # JavaScript modules
│   │       ├── navigation.js
│   │       ├── component-loader.js
│   │       ├── theme-manager.js
│   │       └── utils.js
│   ├── images/              # Optimized images
│   └── fonts/               # Web fonts
├── components/              # Reusable HTML components
│   ├── header.html
│   └── footer.html
├── pages/                   # Individual page content
├── index.html              # Main landing page
├── blog.html               # Blog listing page
├── academics.html          # Academic work showcase
├── contact.html            # Contact form and information
├── package.json            # Dependencies and build scripts
└── README.md              # This file
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+ and npm 8+
- Modern web browser with ES6+ support

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Available Scripts

#### Development
- `npm run dev` - Start live development server on port 3000
- `npm run watch` - Watch files for changes and rebuild automatically

#### Building
- `npm run build` - Complete production build
- `npm run build:css` - Compile, prefix, and minify CSS
- `npm run build:js` - Lint and minify JavaScript

#### Testing & Quality
- `npm test` - Run all tests (HTML, CSS, JS, accessibility)
- `npm run lighthouse` - Performance and accessibility audit
- `npm run format` - Format code with Prettier

#### Deployment
- `npm run deploy` - Build and deploy to GitHub Pages

## 🎨 CSS Architecture

### Custom Properties (CSS Variables)
The CSS uses a comprehensive custom property system for:
- **Colors**: Primary, secondary, text, backgrounds
- **Typography**: Font families, sizes, weights
- **Spacing**: Consistent spacing scale
- **Layout**: Container widths, borders, shadows

### Responsive Design
- **Mobile-first** approach with progressive enhancement
- **Fluid typography** using clamp() for scalable text
- **Flexible layouts** with CSS Grid and Flexbox
- **Responsive breakpoints**: Mobile (< 768px), Tablet (768px-1024px), Desktop (> 1024px)

### Component System
- **Modular CSS** with component-specific stylesheets
- **BEM methodology** for class naming
- **Utility classes** for common patterns

## 🧩 JavaScript Architecture

### Module System
- **ES6 Modules** for clean code organization
- **Component Registry** for managing UI components
- **Utility Library** for common functions
- **Event-driven architecture** for component communication

### Core Modules
1. **Navigation** - Responsive navigation with mobile menu
2. **Component Loader** - Dynamic HTML component loading
3. **Theme Manager** - Light/dark theme switching
4. **Utils** - Common utility functions

### Component Types
- **Cards** - Interactive content cards
- **Modals** - Accessible dialog boxes
- **Tabs** - Tabbed interfaces
- **Form Validators** - Client-side form validation

## 📱 Progressive Web App Features

### Performance
- **Resource hints** for faster loading
- **Lazy loading** for images and components
- **Code splitting** for optimal bundle sizes
- **Caching strategies** for offline support

### Accessibility
- **ARIA labels** and semantic markup
- **Keyboard navigation** throughout
- **Screen reader** compatibility
- **High contrast** support
- **Focus management** in interactive components

## 🎯 SEO & Social Media

### Meta Tags
- **Open Graph** tags for social sharing
- **Twitter Cards** for enhanced tweets
- **Structured data** for search engines
- **Mobile-optimized** viewport settings

### Performance
- **Optimized images** with appropriate formats
- **Minified assets** for faster loading
- **Critical CSS** inlined for above-fold content
- **Font loading** optimization

## 🚀 Deployment

### GitHub Pages
The site is configured for easy deployment to GitHub Pages:
```bash
npm run deploy
```

### Custom Deployment
For other hosting providers:
1. Run `npm run build`
2. Upload all files to your web server
3. Ensure server supports SPA routing (if needed)

## 🧪 Testing

### Automated Testing
- **HTML validation** with html-validate
- **CSS linting** with stylelint
- **JavaScript linting** with ESLint
- **Accessibility testing** with axe-core
- **Performance auditing** with Lighthouse

### Manual Testing Checklist
- [ ] Navigation works on all devices
- [ ] Forms submit successfully
- [ ] Images load and display correctly
- [ ] Responsive design works across breakpoints
- [ ] Keyboard navigation functions properly
- [ ] Screen reader compatibility

## 📈 Performance Optimization

### Build Process
- **CSS minification** and autoprefixing
- **JavaScript bundling** and minification
- **Image optimization** with compression
- **Asset fingerprinting** for cache busting

### Runtime Optimization
- **Component lazy loading**
- **Event delegation** for better performance
- **Debounced/throttled** event handlers
- **Memory leak prevention**

## 🔧 Configuration

### Browser Support
- Modern browsers (last 2 versions)
- Progressive enhancement for older browsers
- Polyfills available for ES6+ features

### Customization
- **CSS custom properties** for easy theming
- **Configuration objects** for component behavior
- **Environment variables** for build customization

## 📚 Documentation

### Code Documentation
- **JSDoc comments** for JavaScript functions
- **CSS comments** explaining complex styles
- **Component usage examples**

### Additional Resources
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Contact

**Mitch Radakovich**
- Email: radakovich.1@osu.edu
- GitHub: [@mitchrad99](https://github.com/mitchrad99)
- LinkedIn: [Connect with me](https://linkedin.com/in/mitchradakovich)

---

Built with ❤️ using modern web technologies