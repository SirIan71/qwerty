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
  initImageFallback();
  initNavigation();
  initHeroParticles();
  renderFeaturedProducts();
  renderCategoryImages();
  renderShopProducts();
  renderBlogPosts();
  updateCartCount();
  initScrollAnimations();
  initMobileMenu();
  initNewsletter();
  initCheckout();
  initFilters();
  initBlogFilters();
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
    resetCursorEffects();
    // Re-rack the bar: every lift on the incoming page starts from the floor.
    if (window.Lifts) {
      Lifts.scan();
      Lifts.reset(targetPage);
    }
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

// A photo that fails to load hides itself, revealing the emoji placeholder
// still sitting behind it. Registered in the capture phase because `load` and
// `error` do not bubble.
function initImageFallback() {
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (img.tagName !== 'IMG') return;
    if (img.classList.contains('product-photo')) {
      img.classList.add('failed');
    } else if (img.classList.contains('category-photo')) {
      const card = img.closest('.category-card');
      if (card) card.classList.remove('has-photo');
      img.remove();
    }
  }, true);
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
    // Anything the lift engine drives runs its own reveal — including
    // children of a block that lifts as a single unit.
    if (el.closest('[data-lift], [data-lift-group]')) return;
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

// ===== PRODUCT IMAGERY =====
// Unsplash ids resolve against their CDN, which crops and resizes on the fly,
// so the browser only ever downloads the size it will paint. Any other value
// is passed through untouched as a path, which makes swapping in your own
// shoot a one-field edit in PRODUCT_PHOTOS.
const PHOTO_WIDTHS = [400, 600, 900, 1300];
const PHOTO_RATIO = 1.25; // 4:5 portrait, the shape apparel photography wants

function photoUrl(photo, width, ratio = PHOTO_RATIO) {
  if (!photo.id.startsWith('photo-')) return photo.id;
  const height = Math.round(width * ratio);
  return `https://images.unsplash.com/${photo.id}?auto=format&fit=crop&crop=entropy&w=${width}&h=${height}&q=72`;
}

function photoSrcset(photo, ratio = PHOTO_RATIO) {
  if (!photo.id.startsWith('photo-')) return '';
  return PHOTO_WIDTHS.map(w => `${photoUrl(photo, w, ratio)} ${w}w`).join(', ');
}

// Shop By Category tiles are wide rather than tall, so they crop landscape.
const CATEGORY_RATIO = 0.72;

// The emoji stays in the markup as the fallback here too: if the photo fails,
// has-photo comes off the card and the icon is visible again.
function renderCategoryImages() {
  if (typeof CATEGORY_PHOTOS === 'undefined') return;
  document.querySelectorAll('.category-card[data-category]').forEach(card => {
    const photo = CATEGORY_PHOTOS[card.dataset.category];
    if (!photo || card.querySelector('.category-photo')) return;

    const img = document.createElement('img');
    img.className = 'category-photo';
    img.src = photoUrl(photo, 600, CATEGORY_RATIO);
    img.srcset = photoSrcset(photo, CATEGORY_RATIO);
    img.sizes = '(max-width: 700px) 88vw, (max-width: 1100px) 46vw, 400px';
    img.alt = '';           // decorative: the card already carries its name
    img.loading = 'lazy';
    img.decoding = 'async';
    card.prepend(img);
    card.classList.add('has-photo');
  });
}

function getPhotos(product) {
  return (typeof PRODUCT_PHOTOS !== 'undefined' && PRODUCT_PHOTOS[product.id]) || [];
}

// The emoji stays in the markup underneath as the fallback: if a photo fails
// to load it is hidden and the original icon shows through.
function productMedia(product, sizes) {
  return getPhotos(product).slice(0, 2).map((photo, i) => `
        <img class="product-photo${i === 1 ? ' product-photo-alt' : ''}"
             src="${photoUrl(photo, 600)}"
             srcset="${photoSrcset(photo)}"
             sizes="${sizes}"
             alt="${i === 0 ? product.name : product.name + ' — alternate view'}"
             loading="lazy" decoding="async">`).join('');
}

function photoCredit(photo) {
  if (!photo || !photo.user) return '';
  const ref = '?utm_source=fitflex&utm_medium=referral';
  return `Photo by <a href="https://unsplash.com/@${photo.user}${ref}" target="_blank" rel="noopener noreferrer">${photo.by}</a> on <a href="https://unsplash.com${ref}" target="_blank" rel="noopener noreferrer">Unsplash</a>`;
}

// ===== PRODUCT RENDERING =====
function createProductCard(product) {
  return `
    <a href="#" class="product-card" data-page="product" data-product-id="${product.id}">
      <div class="product-image" style="background: ${product.color}">
        <span class="product-emoji">${product.image}</span>
        ${productMedia(product, '(max-width: 700px) 88vw, (max-width: 1100px) 44vw, 380px')}
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
  if (window.Lifts) Lifts.scan();
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

  const photos = getPhotos(p);
  const container = document.getElementById('product-detail');
  container.innerHTML = `
    <a href="#" data-page="shop" class="breadcrumb">← Back to Shop</a>
    <div class="product-detail-layout">
      <div class="product-detail-media">
        <div class="product-detail-image" style="background: ${p.color}">
          <span class="product-emoji-large">${p.image}</span>
          ${photos.length ? `<img class="product-photo" id="detail-photo"
               src="${photoUrl(photos[0], 900)}"
               srcset="${photoSrcset(photos[0])}"
               sizes="(max-width: 900px) 92vw, 560px"
               alt="${p.name}" decoding="async">` : ''}
          ${p.badge ? `<span class="product-badge ${p.badge}">${p.badge === 'bestseller' ? '🔥 Best Seller' : '✨ New'}</span>` : ''}
        </div>
        ${photos.length > 1 ? `
        <div class="product-gallery" id="product-gallery">
          ${photos.map((ph, i) => `
            <button type="button" class="gallery-thumb${i === 0 ? ' active' : ''}" data-photo-index="${i}" aria-label="View photo ${i + 1} of ${photos.length}">
              <img src="${photoUrl(ph, 200)}" alt="" loading="lazy" decoding="async">
            </button>`).join('')}
        </div>` : ''}
        ${photos.length ? `<p class="photo-credit" id="photo-credit">${photoCredit(photos[0])}</p>` : ''}
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
            <label>${p.category === 'nutrition' ? 'Flavor / Size' : 'Size'}</label>
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

  // Gallery
  const detailPhoto = document.getElementById('detail-photo');
  const creditLine = document.getElementById('photo-credit');
  container.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const photo = photos[parseInt(thumb.dataset.photoIndex)];
      if (!photo || !detailPhoto) return;
      container.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      detailPhoto.classList.remove('failed');
      detailPhoto.srcset = photoSrcset(photo);
      detailPhoto.src = photoUrl(photo, 900);
      if (creditLine) creditLine.innerHTML = photoCredit(photo);
    });
  });

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

  if (window.Lifts) Lifts.scan();
}

function initBlogFilters() {
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

  // Every pass settles every element rather than only the ones under the
  // cursor: a card the pointer has left has its tilt cleared, a particle out
  // of range returns to rest. Nothing is left holding a pose because a leave
  // event never arrived — which is what happens when the pointer exits the
  // window, when the page scrolls out from under it, or when the cursor moves
  // between two children of the same card.
  const pointer = { x: 0, y: 0, active: false };
  let queued = false;

  function clearCard(card) {
    if (!card.style.transform) return;
    card.style.transform = '';
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
  }

  function clearParticle(particle) {
    if (!particle.style.transform) return;
    particle.style.transform = '';
    particle.style.opacity = '';
    particle.style.boxShadow = '';
  }

  function apply() {
    const homePage = document.getElementById('page-home');
    const live = pointer.active && homePage && homePage.classList.contains('active');
    const hero = document.getElementById('hero-section');

    // Nothing to track: send everything home and skip the geometry reads.
    if (!live) {
      document.querySelectorAll(tiltSelectors).forEach(clearCard);
      if (hero) hero.querySelectorAll('.particle').forEach(clearParticle);
      return;
    }

    homePage.querySelectorAll(tiltSelectors).forEach(card => {
      const rect = card.getBoundingClientRect();
      const relX = pointer.x - rect.left;
      const relY = pointer.y - rect.top;
      const inside = relX >= 0 && relX <= rect.width && relY >= 0 && relY <= rect.height;

      if (!inside) {
        clearCard(card);
        return;
      }

      // Radial glow follows the cursor across the card
      card.style.setProperty('--mouse-x', (relX / rect.width) * 100 + '%');
      card.style.setProperty('--mouse-y', (relY / rect.height) * 100 + '%');

      const tiltX = ((relY / rect.height) - 0.5) * -10; // rotate around X axis
      const tiltY = ((relX / rect.width) - 0.5) * 10;  // rotate around Y axis
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });

    // Particles react to cursor in hero
    if (!hero) return;
    const heroRect = hero.getBoundingClientRect();
    const inHero = pointer.y >= heroRect.top && pointer.y < heroRect.bottom;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    hero.querySelectorAll('.particle').forEach(particle => {
      if (!inHero) {
        clearParticle(particle);
        return;
      }
      const pRect = particle.getBoundingClientRect();
      const dx = pointer.x - (pRect.left + pRect.width / 2);
      const dy = pointer.y - (pRect.top + pRect.height / 2);
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d >= 250 || d === 0) {
        clearParticle(particle);
        return;
      }
      particle.style.transform = `translate(${(dx / d) * 15}px, ${(dy / d) * 15}px) scale(1.8)`;
      particle.style.opacity = '0.9';
      particle.style.boxShadow = isLight ? '0 0 12px rgba(0,0,0,0.4)' : '0 0 12px rgba(255,255,255,0.6)';
    });
  }

  function request() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; apply(); });
  }

  document.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
    request();
  });

  // The pointer left the window entirely: relatedTarget is null on the way out.
  document.addEventListener('mouseout', (e) => {
    if (e.relatedTarget === null) {
      pointer.active = false;
      request();
    }
  });

  // Losing focus (alt-tab, devtools) ends the hover just as leaving does.
  window.addEventListener('blur', () => {
    pointer.active = false;
    request();
  });

  // Scrolling moves cards out from under a stationary cursor, so re-settle
  // against the last known pointer position.
  window.addEventListener('scroll', request, { passive: true });
}

// Called when a page swap happens, so nothing carries a tilt across pages.
function resetCursorEffects() {
  document.querySelectorAll('.category-card, .product-card, .why-card, .newsletter-card').forEach(card => {
    card.style.transform = '';
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
  });
  document.querySelectorAll('.particle').forEach(particle => {
    particle.style.transform = '';
    particle.style.opacity = '';
    particle.style.boxShadow = '';
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
