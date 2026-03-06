// ===== Fitflex — GYM FITNESS WEAR E-COMMERCE =====
// App State
const state = {
  cart: JSON.parse(localStorage.getItem('Fitflex_cart')) || [],
  currentPage: 'home',
  currentProduct: null,
  currentBlogPost: null,
  filters: { gender: 'all', category: 'all', sort: 'featured' }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroParticles();
  renderFeaturedProducts();
  renderShopProducts();
  renderBlogPosts();
  updateCartCount();
  initScrollAnimations();
  initMobileMenu();
  initNewsletter();
  initCheckout();
  initFilters();
  initCursorEffects();
  initThemeToggle();

  // Handle hash routing
  const hash = window.location.hash.slice(1);
  if (hash) {
    const parts = hash.split('/');
    navigateTo(parts[0], parts[1]);
  }
});

// ===== NAVIGATION =====
function initNavigation() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-page]');
    if (link) {
      e.preventDefault();
      const page = link.dataset.page;
      const productId = link.dataset.productId;
      const blogId = link.dataset.blogId;
      const gender = link.dataset.gender;
      const category = link.dataset.category;

      if (gender) {
        state.filters.gender = gender;
        document.querySelector(`input[name="gender"][value="${gender}"]`).checked = true;
      }
      if (category) {
        state.filters.category = category;
        document.querySelector(`input[name="category"][value="${category}"]`).checked = true;
      }

      navigateTo(page, productId || blogId);
    }
  });

  // Back/forward browser navigation
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const parts = hash.split('/');
      navigateTo(parts[0], parts[1], false);
    } else {
      navigateTo('home', null, false);
    }
  });
}

function navigateTo(page, id, pushState = true) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Update nav links
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Show target page
  state.currentPage = page;

  if (page === 'product' && id) {
    state.currentProduct = PRODUCTS.find(p => p.id === parseInt(id));
    renderProductDetail();
  } else if (page === 'blogpost' && id) {
    state.currentBlogPost = BLOG_POSTS.find(b => b.id === parseInt(id));
    renderBlogPostDetail();
  } else if (page === 'shop') {
    renderShopProducts();
  } else if (page === 'cart') {
    renderCart();
  } else if (page === 'checkout') {
    renderCheckoutSummary();
  }

  const targetPage = document.getElementById(`page-${page}`);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  // Update URL hash
  if (pushState) {
    const hash = id ? `${page}/${id}` : page;
    window.location.hash = hash;
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile menu
  document.getElementById('nav-links').classList.remove('open');
  document.getElementById('mobile-menu-btn').classList.remove('open');
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    document.getElementById('nav-links').classList.toggle('open');
  });
}

// ===== HERO PARTICLES =====
function initHeroParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  for (let i = 0; i < 70; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.animationDuration = (3 + Math.random() * 4) + 's';
    particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
    container.appendChild(particle);
  }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section-title, .section-subtitle, .category-card, .why-card, .product-card, .blog-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

// ===== PRODUCT RENDERING =====
function createProductCard(product) {
  return `
    <a href="#" class="product-card" data-page="product" data-product-id="${product.id}">
      <div class="product-image" style="background: ${product.color}">
        <span class="product-emoji">${product.image}</span>
        ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge === 'bestseller' ? '🔥 Best Seller' : '✨ New'}</span>` : ''}
      </div>
      <div class="product-info">
        <span class="product-category">${product.category} · ${product.gender}</span>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-meta">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <span class="product-rating">★ ${product.rating} (${product.reviews})</span>
        </div>
      </div>
    </a>
  `;
}

function renderFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;
  const featured = PRODUCTS.filter(p => p.badge === 'bestseller').slice(0, 8);
  container.innerHTML = featured.map(createProductCard).join('');
  // Re-observe for animations
  setTimeout(() => initScrollAnimations(), 100);
}

function renderShopProducts() {
  const container = document.getElementById('shop-products');
  if (!container) return;

  let filtered = [...PRODUCTS];

  if (state.filters.gender !== 'all') {
    filtered = filtered.filter(p => p.gender === state.filters.gender);
  }
  if (state.filters.category !== 'all') {
    filtered = filtered.filter(p => p.category === state.filters.category);
  }

  // Sort
  switch (state.filters.sort) {
    case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
    case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
    case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
  }

  container.innerHTML = filtered.length
    ? filtered.map(createProductCard).join('')
    : '<div class="no-results"><p>No products found matching your filters.</p></div>';

  document.getElementById('product-count').textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
}

// ===== FILTERS =====
function closeMobileFilters() {
  if (window.innerWidth <= 768) {
    document.getElementById('shop-sidebar').classList.remove('open');
  }
}

function initFilters() {
  document.querySelectorAll('input[name="gender"]').forEach(input => {
    input.addEventListener('change', () => {
      state.filters.gender = input.value;
      renderShopProducts();
    });
  });
  document.querySelectorAll('input[name="category"]').forEach(input => {
    input.addEventListener('change', () => {
      state.filters.category = input.value;
      renderShopProducts();
    });
  });
  document.getElementById('sort-select').addEventListener('change', (e) => {
    state.filters.sort = e.target.value;
    renderShopProducts();
  });
  document.getElementById('clear-filters').addEventListener('click', () => {
    state.filters = { gender: 'all', category: 'all', sort: 'featured' };
    document.querySelector('input[name="gender"][value="all"]').checked = true;
    document.querySelector('input[name="category"][value="all"]').checked = true;
    document.getElementById('sort-select').value = 'featured';
    renderShopProducts();
  });
  document.getElementById('filter-toggle-btn').addEventListener('click', () => {
    document.getElementById('shop-sidebar').classList.toggle('open');
  });
  document.getElementById('filter-close-btn').addEventListener('click', () => {
    document.getElementById('shop-sidebar').classList.remove('open');
  });
}

// ===== PRODUCT DETAIL =====
function renderProductDetail() {
  const p = state.currentProduct;
  if (!p) return;

  const container = document.getElementById('product-detail');
  container.innerHTML = `
    <a href="#" data-page="shop" class="breadcrumb">← Back to Shop</a>
    <div class="product-detail-layout">
      <div class="product-detail-image" style="background: ${p.color}">
        <span class="product-emoji-large">${p.image}</span>
        ${p.badge ? `<span class="product-badge ${p.badge}">${p.badge === 'bestseller' ? '🔥 Best Seller' : '✨ New'}</span>` : ''}
      </div>
      <div class="product-detail-info">
        <span class="product-category-tag">${p.category} · ${p.gender}</span>
        <h1>${p.name}</h1>
        <div class="product-detail-rating">
          <span class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}</span>
          <span>${p.rating} (${p.reviews} reviews)</span>
        </div>
        <p class="product-detail-price">$${p.price.toFixed(2)}</p>
        <p class="product-detail-desc">${p.description}</p>
        
        <div class="product-options">
          <div class="option-group">
            <label>Size</label>
            <div class="size-options" id="size-options">
              ${p.sizes.map((s, i) => `<button class="size-btn ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>`).join('')}
            </div>
          </div>
          <div class="option-group">
            <label>Quantity</label>
            <div class="qty-control">
              <button class="qty-btn" id="qty-minus">−</button>
              <span class="qty-value" id="qty-value">1</span>
              <button class="qty-btn" id="qty-plus">+</button>
            </div>
          </div>
        </div>

        <button class="btn btn-primary btn-lg btn-full add-to-cart-btn" id="add-to-cart-detail">
          ADD TO CART — $${p.price.toFixed(2)}
        </button>

        <div class="product-features">
          <h3>Features</h3>
          <ul>${p.features.map(f => `<li>✓ ${f}</li>`).join('')}</ul>
        </div>

        <div class="product-guarantees">
          <div class="guarantee"><span>🚚</span> Free shipping over $75</div>
          <div class="guarantee"><span>↩️</span> 30-day returns</div>
          <div class="guarantee"><span>🛡️</span> 1-year warranty</div>
        </div>
      </div>
    </div>

    <div class="related-products">
      <h2>You May Also Like</h2>
      <div class="products-grid">
        ${PRODUCTS.filter(rp => rp.category === p.category && rp.id !== p.id).slice(0, 4).map(createProductCard).join('')}
      </div>
    </div>
  `;

  // Size selection
  container.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Quantity
  let qty = 1;
  const qtyVal = document.getElementById('qty-value');
  document.getElementById('qty-minus').addEventListener('click', () => {
    if (qty > 1) { qty--; qtyVal.textContent = qty; }
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    if (qty < 10) { qty++; qtyVal.textContent = qty; }
  });

  // Add to cart
  document.getElementById('add-to-cart-detail').addEventListener('click', () => {
    const size = container.querySelector('.size-btn.active')?.dataset.size || p.sizes[0];
    addToCart(p, size, qty);
  });
}

// ===== CART =====
function addToCart(product, size, qty = 1) {
  const existing = state.cart.find(item => item.id === product.id && item.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size,
      qty: qty
    });
  }
  saveCart();
  updateCartCount();
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(index) {
  state.cart.splice(index, 1);
  saveCart();
  updateCartCount();
  renderCart();
}

function updateCartQty(index, newQty) {
  if (newQty < 1) {
    removeFromCart(index);
    return;
  }
  state.cart[index].qty = Math.min(newQty, 10);
  saveCart();
  updateCartCount();
  renderCart();
}

function saveCart() {
  localStorage.setItem('Fitflex_cart', JSON.stringify(state.cart));
}

function updateCartCount() {
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-count').classList.toggle('has-items', count > 0);
}

function getCartTotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCart() {
  const itemsContainer = document.getElementById('cart-items');
  const summaryContainer = document.getElementById('cart-summary');

  if (state.cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="empty-cart">
        <span class="empty-cart-icon">🛒</span>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <a href="#" data-page="shop" class="btn btn-primary">START SHOPPING</a>
      </div>
    `;
    summaryContainer.innerHTML = '';
    return;
  }

  itemsContainer.innerHTML = state.cart.map((item, index) => `
    <div class="cart-item">
      <div class="cart-item-image">${item.image}</div>
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <span class="cart-item-size">Size: ${item.size}</span>
        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
      </div>
      <div class="cart-item-actions">
        <div class="qty-control">
          <button class="qty-btn" onclick="updateCartQty(${index}, ${item.qty - 1})">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty(${index}, ${item.qty + 1})">+</button>
        </div>
        <span class="cart-item-total">$${(item.price * item.qty).toFixed(2)}</span>
        <button class="cart-remove-btn" onclick="removeFromCart(${index})">✕</button>
      </div>
    </div>
  `).join('');

  const subtotal = getCartTotal();
  const shipping = subtotal >= 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  summaryContainer.innerHTML = `
    <div class="summary-card">
      <h2>Order Summary</h2>
      <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span class="free-shipping">FREE</span>' : '$' + shipping.toFixed(2)}</span></div>
      <div class="summary-row"><span>Tax (8%)</span><span>$${tax.toFixed(2)}</span></div>
      <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
      ${shipping > 0 ? `<p class="shipping-note">Add $${(75 - subtotal).toFixed(2)} more for free shipping!</p>` : ''}
      <a href="#" data-page="checkout" class="btn btn-primary btn-lg btn-full">PROCEED TO CHECKOUT</a>
      <a href="#" data-page="shop" class="btn btn-outline btn-full" style="margin-top: 0.5rem;">Continue Shopping</a>
    </div>
  `;
}

// ===== CHECKOUT =====
function initCheckout() {
  // Payment method toggle
  document.querySelectorAll('.payment-option input').forEach(input => {
    input.addEventListener('change', () => {
      document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
      input.closest('.payment-option').classList.add('active');
      document.getElementById('card-fields').style.display = input.value === 'card' ? 'block' : 'none';
    });
  });

  // Form submission
  document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Generate order ID
    const orderId = 'IC-' + Date.now().toString(36).toUpperCase();
    document.querySelector('.confirmation-order-id').textContent = `Order #${orderId}`;
    // Clear cart
    state.cart = [];
    saveCart();
    updateCartCount();
    navigateTo('confirmation');
  });
}

function renderCheckoutSummary() {
  const container = document.getElementById('checkout-summary');
  if (!container) return;

  const subtotal = getCartTotal();
  const shipping = subtotal >= 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  container.innerHTML = `
    <div class="summary-card">
      <h2>Order Summary</h2>
      <div class="checkout-items">
        ${state.cart.map(item => `
          <div class="checkout-item">
            <span class="checkout-item-emoji">${item.image}</span>
            <div class="checkout-item-info">
              <span>${item.name}</span>
              <span class="checkout-item-meta">${item.size} × ${item.qty}</span>
            </div>
            <span>$${(item.price * item.qty).toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
      <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span class="free-shipping">FREE</span>' : '$' + shipping.toFixed(2)}</span></div>
      <div class="summary-row"><span>Tax (8%)</span><span>$${tax.toFixed(2)}</span></div>
      <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
    </div>
  `;
}

// ===== BLOG =====
function renderBlogPosts(filterCat = 'all') {
  const container = document.getElementById('blog-grid');
  if (!container) return;

  let filtered = filterCat === 'all' ? BLOG_POSTS : BLOG_POSTS.filter(b => b.category === filterCat);

  container.innerHTML = filtered.map(post => `
    <a href="#" class="blog-card" data-page="blogpost" data-blog-id="${post.id}">
      <div class="blog-card-image">
        <span class="blog-emoji">${post.image}</span>
        <span class="blog-cat-tag">${post.category}</span>
      </div>
      <div class="blog-card-content">
        <div class="blog-card-meta">
          <span>${post.date}</span>
          <span>·</span>
          <span>${post.readTime}</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <span class="blog-read-more">Read More →</span>
      </div>
    </a>
  `).join('');

  // Blog filter buttons
  document.querySelectorAll('.blog-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.blog-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderBlogPosts(btn.dataset.blogCat);
    });
  });
}

function renderBlogPostDetail() {
  const post = state.currentBlogPost;
  if (!post) return;

  const container = document.getElementById('blog-post-detail');
  container.innerHTML = `
    <a href="#" data-page="blog" class="breadcrumb">← Back to Blog</a>
    <div class="blog-post-header">
      <span class="blog-cat-tag large">${post.category}</span>
      <h1>${post.title}</h1>
      <div class="blog-post-meta">
        <span>📅 ${post.date}</span>
        <span>⏱️ ${post.readTime}</span>
      </div>
    </div>
    <div class="blog-post-hero">
      <span class="blog-post-hero-emoji">${post.image}</span>
    </div>
    <div class="blog-post-body">
      ${post.content}
    </div>
    <div class="blog-post-footer">
      <div class="blog-share">
        <span>Share this article:</span>
        <button class="share-btn" onclick="showToast('Link copied to clipboard!')">📋 Copy Link</button>
        <button class="share-btn">🐦 Twitter</button>
        <button class="share-btn">📘 Facebook</button>
      </div>
    </div>
    <div class="related-posts">
      <h2>More Articles</h2>
      <div class="blog-grid">
        ${BLOG_POSTS.filter(b => b.id !== post.id && b.category === post.category).slice(0, 3).map(p => `
          <a href="#" class="blog-card" data-page="blogpost" data-blog-id="${p.id}">
            <div class="blog-card-image"><span class="blog-emoji">${p.image}</span><span class="blog-cat-tag">${p.category}</span></div>
            <div class="blog-card-content">
              <div class="blog-card-meta"><span>${p.date}</span><span>·</span><span>${p.readTime}</span></div>
              <h3>${p.title}</h3>
              <p>${p.excerpt}</p>
              <span class="blog-read-more">Read More →</span>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

// ===== NEWSLETTER =====
function initNewsletter() {
  document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('🎉 Welcome to the Fitflex army! Check your inbox for 15% off.');
    e.target.reset();
  });
}

// ===== TOAST =====
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== NAV SCROLL EFFECT =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-nav');
  const currentScroll = window.scrollY;

  if (currentScroll > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// ===== CURSOR-REACTIVE HOMEPAGE EFFECTS =====
function initCursorEffects() {

  // 3D tilt + inner glow on interactive cards (homepage only)
  const tiltSelectors = '.category-card, #page-home .product-card, .why-card, .newsletter-card';

  document.addEventListener('mousemove', (e) => {
    const homePage = document.getElementById('page-home');
    if (!homePage || !homePage.classList.contains('active')) return;

    // Handle card tilt + radial glow position
    const cards = homePage.querySelectorAll(tiltSelectors);
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      const distX = e.clientX - cardCenterX;
      const distY = e.clientY - cardCenterY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      // Only tilt if cursor is reasonably close to the card
      if (dist < 500) {
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        const percX = (relX / rect.width) * 100;
        const percY = (relY / rect.height) * 100;

        // Set CSS custom properties for the radial glow pseudo-element
        card.style.setProperty('--mouse-x', percX + '%');
        card.style.setProperty('--mouse-y', percY + '%');

        // 3D tilt (only when actually hovering)
        if (relX >= 0 && relX <= rect.width && relY >= 0 && relY <= rect.height) {
          const tiltX = ((relY / rect.height) - 0.5) * -10; // rotate around X axis
          const tiltY = ((relX / rect.width) - 0.5) * 10;  // rotate around Y axis
          card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        }
      }
    });

    // Particles react to cursor in hero
    const hero = document.getElementById('hero-section');
    if (hero) {
      const heroRect = hero.getBoundingClientRect();
      if (e.clientY < heroRect.bottom) {
        const particles = hero.querySelectorAll('.particle');
        particles.forEach(p => {
          const pRect = p.getBoundingClientRect();
          const px = pRect.left + pRect.width / 2;
          const py = pRect.top + pRect.height / 2;
          const dx = e.clientX - px;
          const dy = e.clientY - py;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 250) {
            const pushX = (dx / d) * 15;
            const pushY = (dy / d) * 15;
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            p.style.transform = `translate(${pushX}px, ${pushY}px) scale(1.8)`;
            p.style.opacity = '0.9';
            p.style.boxShadow = isLight ? '0 0 12px rgba(0,0,0,0.4)' : '0 0 12px rgba(255,255,255,0.6)';
          } else {
            p.style.transform = '';
            p.style.opacity = '';
            p.style.boxShadow = '';
          }
        });
      }
    }
  });

  // Reset tilt when mouse leaves a card
  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest(tiltSelectors);
    if (card) {
      card.style.transform = '';
    }
  });
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  // Load saved theme
  const savedTheme = localStorage.getItem('Fitflex_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateToggleIcon(toggle, savedTheme);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('Fitflex_theme', next);
    updateToggleIcon(toggle, next);
  });
}

function updateToggleIcon(toggle, theme) {
  toggle.textContent = theme === 'light' ? '🌙' : '☀️';
  toggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
}
