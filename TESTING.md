# 🧪 Testing Your Modern Portfolio Website

## Quick Testing Options

### 1. 🚀 Simple Local Server (Recommended)
```bash
cd /Users/mitch/Documents/mitchrad99.github.io/Redo
./test-server.sh
```
Then open: **http://localhost:8000**

### 2. 🎯 VS Code Live Server Extension
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### 3. 🌐 Direct File Opening (Limited functionality)
```bash
open index.html
```
⚠️ Note: Some features won't work due to CORS restrictions

## 🔍 What to Test

### ✅ Basic Functionality Checklist
- [ ] **Navigation**: Click between pages (Home, Blog, Academics, Contact)
- [ ] **Mobile Menu**: Resize browser window, test hamburger menu
- [ ] **Theme Toggle**: Look for theme toggle button (top-right)
- [ ] **Responsive Design**: Test different screen sizes
- [ ] **Components**: Check if header/footer load properly
- [ ] **Accessibility**: Tab through navigation, test keyboard shortcuts

### 🎨 Visual Elements to Check
- [ ] **Typography**: Custom fonts loading correctly
- [ ] **Layout**: CSS Grid and Flexbox layouts working
- [ ] **Colors**: CSS custom properties applied
- [ ] **Hover Effects**: Interactive elements respond to mouse
- [ ] **Images**: Profile image displays correctly

### 📱 Device Testing
- [ ] **Desktop**: Full layout with sidebar
- [ ] **Tablet**: Responsive grid adjustments
- [ ] **Mobile**: Stacked layout, mobile menu

### ⌨️ Keyboard Shortcuts to Test
- `Alt + T`: Toggle light/dark theme
- `Alt + M`: Toggle mobile menu (on mobile)
- `Escape`: Close open menus
- `Tab`: Navigate through interactive elements

## 🛠️ Advanced Testing (After npm setup)

Once you fix the npm permissions, you can run:

### Install Dependencies
```bash
npm install
```

### Development Server with Hot Reload
```bash
npm run dev
```

### Code Quality Checks
```bash
npm run test          # Run all tests
npm run test:html     # Validate HTML
npm run test:css      # Lint CSS
npm run test:js       # Lint JavaScript
npm run lighthouse    # Performance audit
```

### Build for Production
```bash
npm run build
```

## 🐛 Common Issues to Watch For

### JavaScript Console Errors
Open browser DevTools (F12) and check:
- Component loading errors
- Module import issues
- Theme switching problems

### CSS Layout Issues
- Custom properties not applied
- Grid/Flexbox not working
- Responsive breakpoints

### Component Loading
- Header/footer not appearing
- Navigation not interactive
- Theme toggle missing

## 🔧 Debugging Tips

### Browser DevTools
1. **Console Tab**: Check for JavaScript errors
2. **Network Tab**: Verify all files load
3. **Elements Tab**: Inspect CSS custom properties
4. **Application Tab**: Check localStorage for theme preference

### Quick Fixes
If something doesn't work:
1. **Hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. **Clear cache**: In DevTools → Application → Storage → Clear storage
3. **Check file paths**: Ensure all assets load correctly

## 📊 Performance Testing

### Lighthouse Audit
1. Open DevTools
2. Go to "Lighthouse" tab
3. Run audit for Performance, Accessibility, Best Practices, SEO

### Expected Scores
- **Performance**: 90+ (with optimizations)
- **Accessibility**: 95+ (semantic HTML + ARIA)
- **Best Practices**: 95+ (modern standards)
- **SEO**: 90+ (meta tags + structure)

## 🚀 Next Steps

After testing locally:
1. **Fix any issues** found during testing
2. **Optimize performance** based on Lighthouse results
3. **Deploy to GitHub Pages** using `npm run deploy`
4. **Test on real devices** for final validation

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify all file paths are correct
3. Test in different browsers
4. Clear browser cache and try again