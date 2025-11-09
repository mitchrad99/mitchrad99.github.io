// Blog Manager Module - Dynamically loads and displays blog posts
// Enables dynamic blog content with JSON data source

export class BlogManager {
  constructor() {
    this.blogContainer = null;
    this.filterContainer = null;
    this.blogPosts = [];
    this.filteredPosts = [];
    this.postsPerPage = 6;
    this.currentPage = 1;
    this.currentFilter = 'all';
  }

  // Initialize blog manager
  async init() {
    try {
      this.blogContainer = document.getElementById('blog-posts');
      this.filterContainer = document.getElementById('blog-filters');
      
      if (!this.blogContainer) {
        console.error('❌ Blog container (#blog-posts) not found in DOM!');
        return;
      }

      await this.loadBlogPosts();
      this.setupFilters();
      this.renderBlogPosts();
      
      console.log('✅ Blog manager initialized successfully');
    } catch (error) {
      console.error('❌ Blog manager initialization failed:', error);
    }
  }

  // Load blog posts from posts.json
  async loadBlogPosts() {
    try {
      const response = await fetch('assets/data/posts.json');
      if (!response.ok) {
        throw new Error(`Failed to load posts: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Sort posts by date (newest first)
      this.blogPosts = data.posts.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      this.filteredPosts = [...this.blogPosts];
      console.log(`✅ Loaded ${this.blogPosts.length} blog posts from JSON`);
    } catch (error) {
      console.error('Error loading blog posts from JSON:', error);
      console.log('📦 Falling back to static posts');
      this.loadFallbackPosts();
    }
  }

  // Fallback to existing static posts if JSON fails
  loadFallbackPosts() {
    this.blogPosts = [
      {
        id: "data-ethics",
        title: "Data Ethics",
        excerpt: "Exploring ethical considerations in data science and the impact of surveillance capitalism on our society...",
        date: "2021-03-07",
        category: "Data Science",
        url: "pages/data_ethics_blog.html",
        image: null,
        tags: ["ethics", "privacy", "surveillance"],
        readTime: "8 min read"
      },
      {
        id: "mapbox-challenge",
        title: "Mapbox Challenge",
        excerpt: "Analyzing voting patterns and gerrymandering through data visualization using Mapbox tools...",
        date: "2020-11-30",
        category: "Data Visualization",
        url: "pages/mapbox_challenge_blog.html",
        image: null,
        tags: ["visualization", "mapping", "politics"],
        readTime: "6 min read"
      },
      {
        id: "pg-internship",
        title: "Procter & Gamble, Take Two",
        excerpt: "My virtual internship experience building supply chain models and the lessons learned about engineering process...",
        date: "2020-08-04",
        category: "Experience",
        url: "pages/online_internship_blog.html",
        image: null,
        tags: ["internship", "supply-chain", "remote-work"],
        readTime: "5 min read"
      },
      {
        id: "uncertain-spring",
        title: "Uncertain Spring",
        excerpt: "Adapting to life during the pandemic and finding new routines during an unprecedented time...",
        date: "2020-04-22",
        category: "Personal",
        url: "pages/uncertain_spring_blog.html",
        image: null,
        tags: ["pandemic", "reflection", "adaptation"],
        readTime: "4 min read"
      },
      {
        id: "data-in-dc",
        title: "Data in DC",
        excerpt: "My STEP project experience learning about data usage in government, business, and nonprofits in Washington DC...",
        date: "2020-03-01",
        category: "Experience",
        url: "pages/data_in_dc_blog.html",
        image: null,
        tags: ["government", "nonprofits", "policy"],
        readTime: "7 min read"
      },
      {
        id: "hack-ohio-2019",
        title: "Hack OHI/O 2019",
        excerpt: "Reflections on my hackathon experience at Ohio State...",
        date: "2019-11-25",
        category: "Hackathon",
        url: "pages/hack_ohio_2019_blog.html",
        image: null,
        tags: ["hackathon", "coding", "teamwork"],
        readTime: "3 min read"
      }
    ];
    
    this.filteredPosts = [...this.blogPosts];
    console.log('Using fallback blog posts');
  }

  // Set up category filters
  setupFilters() {
    if (!this.filterContainer) return;

    const filterButtons = this.filterContainer.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const category = e.target.getAttribute('data-category');
        this.filterByCategory(category);
        
        // Update active filter button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
  }

  // Render blog posts to the grid
  renderBlogPosts() {
    if (!this.blogContainer) {
      console.error('❌ Blog container not found! Looking for #blog-posts');
      return;
    }
    
    if (!this.filteredPosts.length) {
      this.showEmptyState();
      return;
    }

    // Clear existing content
    this.blogContainer.innerHTML = '';

    // Calculate pagination
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    const postsToShow = this.filteredPosts.slice(startIndex, endIndex);

    // Render each post
    postsToShow.forEach((post, index) => {
      const blogCard = this.createBlogCard(post);
      this.blogContainer.appendChild(blogCard);
      
      // Add staggered animation
      setTimeout(() => {
        blogCard.classList.add('animate-in');
      }, index * 100);
    });

    // Add pagination if needed
    this.renderPagination();
  }

  // Create individual blog card HTML
  createBlogCard(post) {
    const article = document.createElement('article');
    article.className = 'blog-card';
    article.setAttribute('data-category', post.category.toLowerCase().replace(/\s+/g, '-'));

    const formattedDate = this.formatDate(post.date);
    const imageElement = post.image ? 
      `<img src="${post.image}" alt="${post.title}" class="blog-image" loading="lazy">` :
      `<div class="img-placeholder blog-icon" title="${post.title} blog image placeholder"></div>`;

    // Create tags HTML if available
    const tagsHtml = post.tags ? 
      `<div class="blog-tags">
        ${post.tags.slice(0, 3).map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
      </div>` : '';

    article.innerHTML = `
      ${imageElement}
      <div class="blog-card-content">
        <h2 class="blog-title">${post.title}</h2>
        <p class="blog-excerpt">${post.excerpt}</p>
        ${tagsHtml}
        <div class="blog-meta">
          <time class="blog-date" datetime="${post.date}">${formattedDate}</time>
          <span class="blog-category">${post.category}</span>
          ${post.readTime ? `<span class="blog-read-time">${post.readTime}</span>` : ''}
        </div>
        <a href="${post.url}" class="blog-link">Read More</a>
      </div>
    `;

    return article;
  }

  // Format date for display
  formatDate(dateString) {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  // Filter posts by category
  filterByCategory(category = 'all') {
    this.currentFilter = category;
    this.currentPage = 1; // Reset to first page
    
    if (category === 'all') {
      this.filteredPosts = [...this.blogPosts];
    } else {
      this.filteredPosts = this.blogPosts.filter(post => 
        post.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
      );
    }

    this.renderBlogPosts();
  }

  // Show empty state when no posts found
  showEmptyState() {
    if (!this.blogContainer) return;

    this.blogContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <h3>No posts found</h3>
        <p>No blog posts found${this.currentFilter !== 'all' ? ` in the ${this.currentFilter} category` : ''}.</p>
        ${this.currentFilter !== 'all' ? 
          `<button class="btn btn-primary" onclick="document.querySelector('[data-category=\"all\"]').click()">
            Show All Posts
          </button>` : ''
        }
      </div>
    `;
  }

  // Render pagination controls
  renderPagination() {
    const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
    
    // Remove existing pagination
    const existingPagination = document.querySelector('.blog-pagination');
    if (existingPagination) {
      existingPagination.remove();
    }
    
    if (totalPages <= 1) return;

    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'blog-pagination';
    
    // Previous button
    if (this.currentPage > 1) {
      const prevButton = this.createPaginationButton(this.currentPage - 1, '← Previous');
      paginationContainer.appendChild(prevButton);
    }

    // Page numbers (show current page and 2 pages on each side)
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(totalPages, this.currentPage + 2);

    if (startPage > 1) {
      const firstButton = this.createPaginationButton(1, '1');
      paginationContainer.appendChild(firstButton);
      if (startPage > 2) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';
        paginationContainer.appendChild(ellipsis);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageButton = this.createPaginationButton(i, i.toString());
      if (i === this.currentPage) {
        pageButton.classList.add('active');
      }
      paginationContainer.appendChild(pageButton);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';
        paginationContainer.appendChild(ellipsis);
      }
      const lastButton = this.createPaginationButton(totalPages, totalPages.toString());
      paginationContainer.appendChild(lastButton);
    }

    // Next button
    if (this.currentPage < totalPages) {
      const nextButton = this.createPaginationButton(this.currentPage + 1, 'Next →');
      paginationContainer.appendChild(nextButton);
    }

    // Add pagination after blog container
    this.blogContainer.parentNode.appendChild(paginationContainer);
  }

  // Create pagination button
  createPaginationButton(pageNumber, text) {
    const button = document.createElement('button');
    button.className = 'pagination-btn';
    button.textContent = text;
    button.setAttribute('aria-label', `Go to page ${pageNumber}`);
    
    button.addEventListener('click', () => {
      this.currentPage = pageNumber;
      this.renderBlogPosts();
      
      // Smooth scroll to top of blog section
      const blogSection = document.querySelector('.blog-content');
      if (blogSection) {
        blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    
    return button;
  }

  // Add new blog post (for future use)
  async addNewPost(postData) {
    // Validate post data
    const requiredFields = ['id', 'title', 'excerpt', 'date', 'category', 'url'];
    const missingFields = requiredFields.filter(field => !postData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Add to posts array
    this.blogPosts.unshift(postData); // Add to beginning (newest first)
    
    // Update filtered posts if current filter includes this post
    this.filterByCategory(this.currentFilter);
    
    console.log(`✅ Added new blog post: ${postData.title}`);
  }

  // Get blog statistics
  getStats() {
    const categories = [...new Set(this.blogPosts.map(post => post.category))];
    const totalPosts = this.blogPosts.length;
    const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
    
    return {
      totalPosts,
      totalPages,
      categories,
      currentFilter: this.currentFilter,
      currentPage: this.currentPage,
      filteredCount: this.filteredPosts.length
    };
  }
}