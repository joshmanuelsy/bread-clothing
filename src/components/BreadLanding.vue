<template>
  <div class="site-wrapper">
    <div class="grain"></div>

    <!-- Navbar -->
    <nav class="navbar" :class="{ scrolled: isScrolled, hidden: isNavHidden }">
      <div class="nav-inner">
        <a href="#" class="nav-logo" @click.prevent="scrollToTop">
          <span class="logo-mark">B</span>
          <span class="logo-text">READ</span>
        </a>
        <ul class="nav-links">
          <li><a href="#" @click.prevent="scrollToTop">Home</a></li>
          <li><a href="#" @click.prevent="scrollToShop">Shop</a></li>
          <li><a href="#" @click.prevent="scrollToCollection">Collection</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <div class="nav-actions">
          <button class="sizing-nav-btn" @click="sizingOpen = true">Sizing</button>
          <button class="login-btn" @click="toggleLogin">Login</button>
          <button class="bag-btn" @click="toggleCart">
            <span>Bag</span>
            <span class="bag-count" v-if="cartCount > 0">{{ cartCount }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg" :style="{ backgroundImage: 'url(/src/assets/landing.jpg)' }"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Bread Studios</h1>
        <p class="hero-tagline">Simple. Timeless. Staple.</p>
        <p class="hero-desc">
          BREAD is a clothing brand that embodies the essentials—simple, timeless, and made for everyday wear.
        </p>
        <div class="hero-cta">
          <button class="btn-primary" @click="scrollToShop">
            <span>Shop the Collection</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button class="btn-outline-light" @click="showStory">Our Story</button>
        </div>
      </div>
      <div class="hero-scroll-hint">
        <div class="scroll-line"></div>
        <span>Scroll</span>
      </div>
    </section>

    <!-- ========== FRESH FROM THE OVEN (MINIMALIST + NO BADGES) ========== -->
    <section class="products-section" id="shop">
      <div class="products-header">
        <p class="products-eyebrow">Selection</p>
        <h2 class="section-title">Fresh from<br>the oven</h2>
      </div>
      <div class="filter-tabs">
        <button v-for="tab in tabs" :key="tab" class="filter-tab"
          :class="{ active: activeTab === tab }" @click="activeTab = tab">{{ tab }}</button>
      </div>
      <div class="product-grid">
        <template v-if="loading">
          <SkeletonCard v-for="i in 3" :key="i" />
        </template>
        <template v-else>
          <div v-for="product in filteredProducts" :key="product.id"
            class="product-card" @click="openModal(product)">
            <div class="card-img-wrap">
              <div class="product-img" :style="{ backgroundImage: 'url(' + product.images[0] + ')' }"></div>
              <!-- Minimalist hover hint -->
              <div class="card-minimal-hint">
                <span class="hint-plus">+</span>
                <span class="hint-size">XS-XL</span>
              </div>
              <!-- BADGE REMOVED -->
            </div>
            <div class="card-info">
              <h3 class="card-name">{{ product.name }}</h3>
              <p class="card-price">₱{{ product.price }}</p>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- ========== THE COLLECTION (FIXED WIDTH, TIGHT GAP) ========== -->
    <section class="collection-section" id="collection">
      <div class="collection-header">
        <p class="collection-eyebrow">Lookbook</p>
        <h2 class="section-title">The Collection</h2>
      </div>
      <div class="lookbook-horizontal">
        <div
          v-for="(item, i) in lookbook"
          :key="i"
          class="lookbook-item"
          @click="openModal(item)"
        >
          <div class="lookbook-image-stack">
            <div class="lookbook-front"
              :style="{ backgroundImage: 'url(/src/assets/' + item.front + ')' }">
            </div>
            <div class="lookbook-back"
              :style="{ backgroundImage: 'url(/src/assets/' + item.back + ')' }">
            </div>
          </div>
          <div class="lookbook-caption">
            <span class="lookbook-num">0{{ i + 1 }}</span>
            <span class="lookbook-name">{{ item.name }}</span>
            <span class="lookbook-price">₱{{ item.price }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Sizing modal -->
    <Transition name="modal">
      <div v-if="sizingOpen" class="modal-overlay" @click.self="sizingOpen = false" @keydown.esc="sizingOpen = false">
        <div class="sizing-modal">
          <button class="modal-close" @click="sizingOpen = false" aria-label="Close">×</button>
          <p class="modal-eyebrow">Guide</p>
          <h2 class="modal-name" style="margin-bottom:1.2rem">Find Your Fit</h2>
          <img src="/src/assets/sizing.jpg" alt="Sizing Chart" class="sizing-modal-img" />
        </div>
      </div>
    </Transition>

    <!-- ========== ENLARGED PRODUCT MODAL (WIDER, TALLER, MORE SPACING) ========== -->
    <Transition name="modal">
      <div v-if="modalVisible" class="modal-overlay" @click.self="closeModal" @keydown.esc="closeModal">
        <div class="modal-card">
          <button class="modal-close" @click="closeModal" aria-label="Close">×</button>
          <div class="modal-gallery">
            <div class="modal-img-main"
              :style="{ backgroundImage: 'url(' + selectedProduct?.images[currentImageIndex] + ')' }"></div>
            <div v-if="selectedProduct?.images.length > 1" class="gallery-thumbs-side">
              <button v-for="(img, i) in selectedProduct.images" :key="i"
                class="thumb-side" :class="{ active: i === currentImageIndex }"
                :style="{ backgroundImage: 'url(' + img + ')' }"
                @click="currentImageIndex = i"></button>
            </div>
          </div>
          <div class="modal-info">
            <p class="modal-eyebrow">{{ selectedProduct?.category }}</p>
            <h2 class="modal-name">{{ selectedProduct?.name }}</h2>
            <p class="modal-price">₱{{ selectedProduct?.price }}</p>
            <p class="modal-desc">100% pre-shrunk cotton, relaxed fit. Earth tones.</p>
            <div class="size-label">Select Size</div>
            <div class="modal-sizes">
              <button v-for="size in sizes" :key="size" class="size-btn"
                :class="{ active: selectedSize === size }"
                @click="selectedSize = size">{{ size }}</button>
            </div>
            <button class="btn-dark full" @click="handleAddToBag">
              Add to Bag — ₱{{ selectedProduct?.price }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Cart drawer -->
    <Transition name="drawer">
      <div v-if="cartOpen" class="cart-overlay" @click.self="toggleCart" @keydown.esc="toggleCart">
        <div class="cart-drawer">
          <div class="cart-header">
            <h3>Your Bag</h3>
            <button class="cart-close-btn" @click="toggleCart">×</button>
          </div>
          <div class="cart-empty" v-if="cartItems.length === 0">
            <p>Your bag is empty.</p>
            <button class="btn-dark" style="margin-top:1.5rem" @click="toggleCart(); scrollToShop()">Browse</button>
          </div>
          <div v-else>
            <div class="cart-items">
              <div class="cart-item" v-for="(item, i) in cartItems" :key="i">
                <div class="cart-item-img" :style="{ backgroundImage: 'url(' + item.images[0] + ')' }"></div>
                <div class="cart-item-info">
                  <p class="cart-item-name">{{ item.name }}</p>
                  <p class="cart-item-size">Size: {{ item.size }}</p>
                  <div class="cart-item-quantity">
                    <button @click="updateQuantity(i, item.quantity - 1)" class="qty-btn">-</button>
                    <span>{{ item.quantity }}</span>
                    <button @click="updateQuantity(i, item.quantity + 1)" class="qty-btn">+</button>
                  </div>
                  <p class="cart-item-price">₱{{ item.price * item.quantity }}</p>
                </div>
                <button class="cart-item-remove" @click="removeFromCart(i)">×</button>
              </div>
            </div>
            <div class="cart-total">
              <span>Total</span>
              <span>₱{{ cartTotal }}</span>
            </div>
            <button class="btn-dark full" @click="checkout">Checkout</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Login modal -->
    <Transition name="modal">
      <div v-if="loginOpen" class="modal-overlay" @click.self="closeLogin" @keydown.esc="closeLogin">
        <div class="login-modal">
          <button class="modal-close" @click="closeLogin">×</button>
          <div v-if="!loginView.forgotPassword && !loginView.register">
            <h2 class="login-title">Sign In</h2>
            <form @submit.prevent="handleLogin" class="login-form">
              <div class="form-group"><label>Email</label><input type="email" v-model="loginForm.email" required></div>
              <div class="form-group"><label>Password</label><input type="password" v-model="loginForm.password" required></div>
              <button type="submit" class="btn-dark full">Sign In</button>
            </form>
            <div class="login-footer">
              <a href="#" @click.prevent="loginView.forgotPassword = true" class="login-link">Forgot Password?</a>
              <p class="login-register">Don't have an account? <a href="#" @click.prevent="loginView.register = true" class="login-link">Register</a></p>
            </div>
          </div>
          <div v-else-if="loginView.forgotPassword">
            <h2 class="login-title">Reset Password</h2>
            <form @submit.prevent="handleForgotPassword" class="login-form">
              <div class="form-group"><label>Email</label><input type="email" v-model="loginForm.resetEmail" required></div>
              <button type="submit" class="btn-dark full">Send Reset Link</button>
            </form>
            <p class="login-back"><a href="#" @click.prevent="loginView.forgotPassword = false" class="login-link">Back</a></p>
          </div>
          <div v-else-if="loginView.register">
            <h2 class="login-title">Create Account</h2>
            <form @submit.prevent="handleRegister" class="login-form">
              <div class="form-group"><label>Full Name</label><input type="text" v-model="loginForm.fullName" required></div>
              <div class="form-group"><label>Email</label><input type="email" v-model="loginForm.registerEmail" required></div>
              <div class="form-group"><label>Password</label><input type="password" v-model="loginForm.registerPassword" required></div>
              <button type="submit" class="btn-dark full">Create Account</button>
            </form>
            <p class="login-back"><a href="#" @click.prevent="loginView.register = false" class="login-link">Back</a></p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-top">
        <div class="footer-brand">
          <p class="footer-logo">BREAD</p>
          <p class="footer-tagline">Simple. Timeless. Everyday.</p>
          <p class="footer-about">A daily staple, crafted to bring comfort, style, and substance.</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Bread Studios. Baked fresh daily.</p>
        <div class="footer-socials"><a href="#">Instagram</a><a href="#">TikTok</a><a href="#">Pinterest</a></div>
      </div>
    </footer>

    <ToastContainer :toasts="toasts" :removeToast="removeToast" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { products as productList, lookbook as lookbookData } from '../data/products';
import { useCart } from '../composables/useCart';
import { useModal } from '../composables/useModal';
import { useToast } from '../composables/useToast';
import ToastContainer from './ToastContainer.vue';
import SkeletonCard from './SkeletonCard.vue';

const isScrolled = ref(false);
const isNavHidden = ref(false);
const lastScrollY = ref(0);
const sizingOpen = ref(false);
const activeTab = ref('All');
const cartOpen = ref(false);
const loginOpen = ref(false);
const loginView = ref({ forgotPassword: false, register: false });
const loginForm = ref({ email:'', password:'', resetEmail:'', fullName:'', registerEmail:'', registerPassword:'' });
const loading = ref(true);

const tabs = ['All', 'Tops', 'Bottoms'];
const sizes = ['XS','S','M','L','XL'];
const products = ref(productList);
const lookbook = ref(lookbookData);

const { cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity } = useCart();
const { modalVisible, selectedProduct, selectedSize, currentImageIndex, openModal, closeModal } = useModal();
const { toasts, addToast, removeToast } = useToast();

const filteredProducts = computed(() =>
  activeTab.value === 'All' ? products.value : products.value.filter(p => p.category === activeTab.value)
);

const handleAddToBag = () => {
  if (!selectedProduct.value) return;
  addToCart(selectedProduct.value, selectedSize.value);
  addToast(`Added ${selectedProduct.value.name} (${selectedSize.value})`, 'success');
  closeModal();
};
const toggleCart = () => { cartOpen.value = !cartOpen.value; };
const toggleLogin = () => { loginOpen.value = !loginOpen.value; };
const closeLogin = () => { loginOpen.value = false; loginView.value = { forgotPassword:false, register:false }; };
const handleLogin = () => { addToast(`Logged in as ${loginForm.value.email}`, 'info'); closeLogin(); };
const handleForgotPassword = () => { addToast(`Reset link sent to ${loginForm.value.resetEmail}`, 'info'); loginView.value.forgotPassword = false; };
const handleRegister = () => { addToast(`Account created for ${loginForm.value.fullName}`, 'success'); closeLogin(); };
const showStory = () => { addToast('Our story: simple, timeless essentials.', 'info'); };
const checkout = () => { addToast('Checkout demo', 'info'); };

const scrollToShop = () => document.getElementById('shop')?.scrollIntoView({ behavior:'smooth' });
const scrollToCollection = () => document.getElementById('collection')?.scrollIntoView({ behavior:'smooth' });
const scrollToTop = () => window.scrollTo({ top:0, behavior:'smooth' });

const handleScroll = () => {
  const y = window.scrollY;
  isScrolled.value = y > 60;
  isNavHidden.value = y > lastScrollY.value && y > 200;
  lastScrollY.value = y;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  setTimeout(() => { loading.value = false; }, 800);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalVisible.value) closeModal();
      if (sizingOpen.value) sizingOpen.value = false;
      if (cartOpen.value) cartOpen.value = false;
      if (loginOpen.value) loginOpen.value = false;
    }
  });
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* ========== ORIGINAL BASE STYLES ========== */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Syne:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

.site-wrapper {
  --cream:      #f5f0e8;
  --warm-white: #faf8f4;
  --tan:        #c9a87c;
  --tan-light:  #eddfc8;
  --brown:      #8b6748;
  --dark:       #1a1714;
  --mid:        #5a4f44;
  --border:     #e4dcd2;
  font-family: 'Syne', sans-serif;
  background: var(--warm-white);
  color: var(--dark);
  overflow-x: hidden;
}

/* Grain overlay */
.grain {
  position:fixed; inset:-50%; width:200%; height:200%;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity:0.03; pointer-events:none;
  animation:grain 0.5s steps(1) infinite;
  z-index: 1;
}
@keyframes grain {
  0%  { transform:translate(0,0); }    20% { transform:translate(-2%,-3%); }
  40% { transform:translate(2%,2%); }  60% { transform:translate(-1%,3%); }
  80% { transform:translate(3%,-2%); }
}

/* Navbar */
.navbar {
  position:fixed; top:0; width:100%; z-index:500;
  transition:transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s, border-color 0.4s;
  border-bottom:1px solid transparent;
}
.navbar.scrolled {
  background:rgba(250,248,244,0.96);
  backdrop-filter:blur(16px); border-bottom-color:var(--border);
}
.navbar.hidden { transform:translateY(-100%); }
.nav-inner {
  display:flex; align-items:center; justify-content:space-between;
  padding:1.4rem 3rem; max-width:1400px; margin:0 auto;
}
.nav-actions { display:flex; align-items:center; gap:0.6rem; }
.nav-logo {
  text-decoration:none; display:flex; align-items:baseline; gap:0.08rem;
  color:#fff; transition:color 0.4s;
}
.navbar.scrolled .nav-logo { color:var(--dark); }
.logo-mark { font-family:'Cormorant Garamond',serif; font-size:2.2rem; font-style:italic; font-weight:300; line-height:1; }
.logo-text  { font-size:0.6rem; font-weight:800; letter-spacing:0.3em; padding-bottom:0.3rem; }
.nav-links  { list-style:none; display:flex; gap:2.5rem; }
.nav-links a {
  text-decoration:none; color:rgba(255,255,255,0.9);
  font-size:0.68rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase;
  transition:color 0.25s; position:relative;
}
.nav-links a::after { content:''; position:absolute; bottom:-3px; left:0; width:0; height:1px; background:currentColor; transition:width 0.3s; }
.nav-links a:hover::after { width:100%; }
.navbar.scrolled .nav-links a { color:var(--mid); }
.navbar.scrolled .nav-links a:hover { color:var(--dark); }

.sizing-nav-btn, .login-btn, .bag-btn {
  font-family:'Syne',sans-serif; font-size:0.68rem; font-weight:700;
  letter-spacing:0.12em; text-transform:uppercase;
  padding:0.55rem 1.2rem; border-radius:40px; cursor:pointer;
  display:flex; align-items:center; gap:0.5rem;
  transition:background 0.25s, color 0.25s, border-color 0.4s;
}
.sizing-nav-btn {
  background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.4); color:#fff;
}
.login-btn {
  background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.4); color:#fff;
}
.bag-btn {
  background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.4); color:#fff;
}
.navbar.scrolled .sizing-nav-btn,
.navbar.scrolled .login-btn,
.navbar.scrolled .bag-btn {
  background:transparent; border-color:var(--border); color:var(--dark);
}
.sizing-nav-btn:hover, .login-btn:hover, .bag-btn:hover { background:#fff; color:var(--dark); }
.navbar.scrolled .sizing-nav-btn:hover,
.navbar.scrolled .login-btn:hover,
.navbar.scrolled .bag-btn:hover { background:var(--dark); color:#fff; border-color:var(--dark); }
.bag-count {
  background:var(--tan); color:#fff; width:18px; height:18px; border-radius:50%;
  font-size:0.6rem; display:flex; align-items:center; justify-content:center;
}

/* Hero */
.hero {
  position:relative; height:100vh; min-height:680px;
  display:flex; align-items:center; overflow:hidden;
}
.hero-bg {
  position:absolute; inset:0; background-size:cover; background-position:center;
  background-color:#2a2320; animation:hero-zoom 14s ease-out forwards;
}
@keyframes hero-zoom { from { transform:scale(1.07); } to { transform:scale(1); } }
.hero-overlay {
  position:absolute; inset:0;
  background:linear-gradient(110deg, rgba(10,8,6,0.82) 0%, rgba(10,8,6,0.58) 50%, rgba(10,8,6,0.68) 100%);
}
.hero-content {
  position:relative; z-index:2; padding:0 3rem;
  max-width:1400px; width:100%; margin:0 auto;
  animation:fade-up 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s both;
}
@keyframes fade-up { from { opacity:0; transform:translateY(36px); } to { opacity:1; transform:translateY(0); } }
.hero-title {
  font-family:'Cormorant Garamond',serif; font-size:clamp(5rem,9vw,8rem);
  font-weight:300; color:#fff; line-height:0.88; letter-spacing:-0.02em;
  margin-bottom:1.2rem; text-shadow:0 4px 40px rgba(0,0,0,0.5);
}
.hero-tagline { font-size:0.75rem; font-weight:700; letter-spacing:0.35em; text-transform:uppercase; color:var(--tan); margin-bottom:1.4rem; }
.hero-desc {
  font-family:'Cormorant Garamond',serif; font-size:1.25rem; font-style:italic;
  font-weight:300; color:rgba(255,255,255,0.85); line-height:1.65; max-width:480px; margin-bottom:2.5rem;
}
.hero-cta { display:flex; gap:1rem; align-items:center; flex-wrap:wrap; }
.hero-scroll-hint { display:none; }
.scroll-line {
  width:1px; height:48px;
  background:linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
  animation:scroll-pulse 2.2s ease-in-out infinite;
}
@keyframes scroll-pulse {
  0%,100% { opacity:1; transform:scaleY(1); }
  50%      { opacity:0.35; transform:scaleY(0.5); }
}

/* Buttons */
.btn-primary {
  display:inline-flex; align-items:center; gap:0.7rem;
  background:var(--tan); color:#fff; border:none;
  font-family:'Syne',sans-serif; font-size:0.7rem; font-weight:700;
  letter-spacing:0.12em; text-transform:uppercase; padding:0.9rem 1.8rem; border-radius:4px;
  cursor:pointer; transition:background 0.3s, transform 0.2s, box-shadow 0.3s;
}
.btn-primary:hover { background:#b8945e; transform:translateY(-2px); box-shadow:0 8px 24px rgba(201,168,124,0.35); }
.btn-primary svg { transition:transform 0.3s; }
.btn-primary:hover svg { transform:translateX(4px); }
.btn-outline-light {
  background:transparent; border:1px solid rgba(255,255,255,0.55); color:#fff;
  font-family:'Syne',sans-serif; font-size:0.7rem; font-weight:600;
  letter-spacing:0.12em; text-transform:uppercase; padding:0.9rem 1.8rem;
  border-radius:4px; cursor:pointer; transition:background 0.25s, border-color 0.25s;
}
.btn-outline-light:hover { background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.85); }
.btn-dark {
  display:inline-flex; align-items:center; justify-content:center; gap:0.5rem;
  background:var(--dark); color:#fff; border:none;
  font-family:'Syne',sans-serif; font-size:0.7rem; font-weight:700;
  letter-spacing:0.12em; text-transform:uppercase; padding:0.9rem 1.8rem;
  border-radius:4px; cursor:pointer; transition:background 0.25s, transform 0.2s;
}
.btn-dark:hover { background:var(--mid); transform:translateY(-1px); }
.btn-dark.full { width:100%; margin-top:1rem; }

/* ========== FRESH FROM THE OVEN – MINIMALIST PRODUCT GRID ========== */
.products-section {
  padding:5rem 3rem 2.5rem;
  max-width:1400px; margin:0 auto;
  min-height:100vh; display:flex; flex-direction:column; justify-content:center;
  background:linear-gradient(135deg, rgba(26,23,20,0.95) 0%, rgba(26,23,20,0.92) 100%);
  position:relative;
}
.products-section::before {
  content:''; position:absolute; inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity:0.02; pointer-events:none;
}
.products-section > * { position:relative; z-index:1; }
.products-header { margin-bottom:1rem; }
.products-eyebrow {
  font-size:0.62rem; font-weight:700; letter-spacing:0.28em;
  text-transform:uppercase; color:var(--tan); margin-bottom:0.5rem;
}
.section-title {
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(2rem,4vw,3rem); font-weight:300; line-height:0.95; color:#fff;
}
.filter-tabs { display:flex; gap:0.4rem; flex-wrap:wrap; margin-bottom:1.2rem; }
.filter-tab {
  background:none; border:1px solid rgba(255,255,255,0.2);
  font-family:'Syne',sans-serif; font-size:0.65rem; font-weight:700;
  letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.6);
  padding:0.4rem 1rem; border-radius:40px; cursor:pointer; transition:all 0.22s;
}
.filter-tab.active, .filter-tab:hover { background:var(--tan); color:#fff; border-color:var(--tan); }

.product-grid {
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:1.5rem;
}
.product-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}
.product-card:hover {
  transform: translateY(-4px);
}
.card-img-wrap {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  background: #2a2620;
}
.product-img {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}
.product-card:hover .product-img {
  transform: scale(1.03);
}
.card-minimal-hint {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.25s, transform 0.25s;
  pointer-events: none;
}
.product-card:hover .card-minimal-hint {
  opacity: 1;
  transform: translateY(0);
}
.hint-plus {
  background: var(--tan);
  color: var(--dark);
  width: 28px;
  height: 28px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
}
.hint-size {
  background: rgba(26, 23, 20, 0.7);
  backdrop-filter: blur(4px);
  color: #fff;
  padding: 0 10px;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
}
.card-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 12px;
}
.card-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  font-weight: 400;
  color: #fff;
  letter-spacing: 0.02em;
}
.card-price {
  font-family: 'Syne', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--tan);
}

/* ========== THE COLLECTION – HORIZONTAL LOOKBOOK (FIXED WIDTH, TIGHT GAP) ========== */
.collection-section {
  background:linear-gradient(135deg, rgba(26,23,20,0.95) 0%, rgba(26,23,20,0.92) 100%);
  padding:5rem 3rem 2.5rem;
  max-width:1400px;
  margin:0 auto;
  position:relative;
}
.collection-section::before {
  content:''; position:absolute; inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity:0.02; pointer-events:none;
}
.collection-header { margin-bottom:1rem; position:relative; z-index:1; }
.collection-eyebrow {
  font-size:0.62rem; font-weight:700; letter-spacing:0.28em;
  text-transform:uppercase; color:var(--tan); margin-bottom:0.5rem;
}

.lookbook-horizontal {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 0.5rem;
  padding: 0.5rem 0 1rem 0;
  scrollbar-width: thin;
  cursor: grab;
}
.lookbook-horizontal:active {
  cursor: grabbing;
}
.lookbook-item {
  flex: 0 0 auto;
  width: 280px;
  scroll-snap-align: start;
  cursor: pointer;
}
@media (min-width: 768px) {
  .lookbook-item {
    width: 360px;
  }
}
@media (min-width: 1024px) {
  .lookbook-item {
    width: 420px;
  }
}
.lookbook-image-stack {
  position: relative;
  aspect-ratio: 3 / 4;
  max-height: 70vh;
  border-radius: 16px;
  overflow: hidden;
  background: #2a2620;
}
.lookbook-front, .lookbook-back {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: opacity 0.4s ease, transform 0.4s ease;
  border-radius: 16px;
}
.lookbook-front {
  opacity: 1;
  z-index: 2;
  transform: scale(1);
}
.lookbook-back {
  opacity: 0;
  z-index: 1;
  transform: scale(1.02);
}
.lookbook-item:hover .lookbook-front {
  opacity: 0;
  transform: scale(0.98);
}
.lookbook-item:hover .lookbook-back {
  opacity: 1;
  transform: scale(1);
}
.lookbook-caption {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 1rem;
  padding: 0 0.2rem;
  font-family: 'Syne', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
}
.lookbook-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  text-transform: none;
  color: #fff;
  letter-spacing: 0;
}
.lookbook-price {
  font-weight: 600;
  color: var(--tan);
}
.col-grid { display: none; }

/* ========== ENLARGED PRODUCT MODAL (WIDER, TALLER, MORE SPACING) ========== */
.modal-card {
  background: var(--warm-white);
  border-radius: 12px;
  max-width: 1100px;
  width: 90vw;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  position: relative;
  max-height: 90vh;
}
.modal-img-main {
  flex: 1;
  min-height: 450px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #111;
}
.modal-info {
  padding: 2.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
/* keep existing modal close, thumb, etc. styles */
.modal-overlay {
  position:fixed; inset:0; background:rgba(10,8,6,0.8);
  backdrop-filter:blur(8px); z-index:800;
  display:flex; align-items:center; justify-content:center; padding:1rem;
}
.modal-close {
  position:absolute; top:1rem; right:1rem;
  background:#fff; border:1px solid var(--border);
  border-radius:50%; width:36px; height:36px;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; z-index:10; color:var(--dark); transition:background 0.2s, color 0.2s;
}
.modal-close:hover { background:var(--dark); color:#fff; border-color:var(--dark); }
.modal-gallery { display:flex; flex-direction:column; background:var(--cream); overflow:hidden; }
.gallery-thumbs-side {
  display:flex; flex-direction:row; gap:0.4rem; padding:0.6rem 0.8rem;
  background:var(--cream); overflow-x:auto; flex-shrink:0;
  border-top:1px solid var(--border);
}
.gallery-thumbs-side::-webkit-scrollbar { height:3px; }
.gallery-thumbs-side::-webkit-scrollbar-thumb { background:var(--border); border-radius:2px; }
.thumb-side {
  width:40px; height:52px; flex-shrink:0;
  background-size:contain;
  background-repeat:no-repeat;
  background-position:center;
  background-color:#111;
  border:2px solid transparent; border-radius:4px; cursor:pointer;
  opacity:0.6; transition:opacity 0.2s, border-color 0.2s;
}
.thumb-side:hover { opacity:0.85; }
.thumb-side.active { border-color:var(--dark); opacity:1; }
.modal-eyebrow { font-size:0.6rem; font-weight:700; letter-spacing:0.25em; text-transform:uppercase; color:var(--tan); margin-bottom:0.4rem; }
.modal-name { font-family:'Cormorant Garamond',serif; font-size:2.2rem; font-weight:300; color:var(--dark); margin-bottom:0.2rem; }
.modal-price { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:600; color:var(--brown); margin-bottom:1.4rem; }
.modal-desc { font-family:'Cormorant Garamond',serif; font-size:1.05rem; color:var(--mid); line-height:1.7; margin-bottom:1.6rem; }
.size-label { font-size:0.6rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:var(--mid); margin-bottom:0.7rem; }
.modal-sizes { display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.5rem; }
.size-btn {
  background:none; border:1px solid var(--border); font-family:'Syne',sans-serif;
  font-size:0.65rem; font-weight:700; color:var(--mid);
  width:42px; height:42px; border-radius:6px; cursor:pointer; transition:all 0.2s;
}
.size-btn.active, .size-btn:hover { background:var(--dark); color:#fff; border-color:var(--dark); }
.modal-enter-active, .modal-leave-active { transition:opacity 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1); }
.modal-enter-from, .modal-leave-to { opacity:0; transform:scale(0.96); }

/* other modals (sizing, login) unchanged */
.sizing-modal {
  background:var(--warm-white); border-radius:12px;
  max-width:700px; width:100%; padding:2.5rem;
  position:relative; max-height:90vh; overflow-y:auto;
}
.sizing-modal-img { width:100%; height:auto; display:block; border-radius:6px; margin-top:0.5rem; }
.login-modal {
  background:var(--warm-white); border-radius:12px; max-width:420px; width:100%;
  padding:3rem; position:relative; max-height:90vh; overflow-y:auto;
}
.login-title { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:300; color:var(--dark); margin-bottom:1.6rem; text-align:center; }
.login-form { display:flex; flex-direction:column; gap:1.2rem; margin-bottom:1.8rem; }
.form-group { display:flex; flex-direction:column; gap:0.5rem; }
.form-group label { font-size:0.65rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--mid); }
.form-group input {
  padding:0.8rem; border:1px solid var(--border); border-radius:6px;
  font-family:'Syne',sans-serif; font-size:0.95rem; color:var(--dark); transition:border-color 0.2s;
}
.form-group input:focus { outline:none; border-color:var(--tan); }
.login-footer { text-align:center; padding-top:1rem; border-top:1px solid var(--border); }
.login-link { color:var(--tan); text-decoration:none; font-size:0.9rem; font-weight:600; transition:color 0.2s; }
.login-link:hover { color:var(--brown); }
.login-register { font-size:0.85rem; color:var(--mid); margin-top:1rem; line-height:1.6; }
.login-back { text-align:center; margin-top:1.6rem; font-size:0.85rem; color:var(--mid); }

/* Cart drawer */
.cart-overlay { position:fixed; inset:0; background:rgba(10,8,6,0.5); backdrop-filter:blur(4px); z-index:700; }
.cart-drawer {
  position:absolute; right:0; top:0; height:100%;
  width:min(420px,100vw); background:var(--warm-white); padding:2rem;
  overflow-y:auto; display:flex; flex-direction:column;
}
.cart-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; padding-bottom:1rem; border-bottom:1px solid var(--border); }
.cart-header h3 { font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:400; color:var(--dark); }
.cart-close-btn { background:none; border:none; cursor:pointer; color:var(--mid); display:flex; align-items:center; transition:color 0.2s; }
.cart-close-btn:hover { color:var(--dark); }
.cart-empty { text-align:center; padding-top:4rem; }
.cart-empty p { font-family:'Cormorant Garamond',serif; font-size:1.2rem; color:var(--dark); }
.cart-empty-sub { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:1rem; color:var(--mid); margin-top:0.4rem; }
.cart-item { display:flex; gap:1rem; align-items:flex-start; padding:1rem 0; border-bottom:1px solid var(--border); }
.cart-item-img { width:72px; height:92px; background-size:cover; background-position:center top; background-color:#111; border-radius:6px; flex-shrink:0; }
.cart-item-info { flex:1; }
.cart-item-name { font-family:'Cormorant Garamond',serif; font-size:1.05rem; font-weight:400; color:var(--dark); }
.cart-item-size { font-size:0.62rem; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#aaa; margin-top:0.3rem; }
.cart-item-price { font-family:'Cormorant Garamond',serif; font-size:1rem; font-weight:600; color:var(--brown); margin-top:0.5rem; }
.cart-item-remove { background:none; border:none; font-size:1.3rem; color:#bbb; cursor:pointer; transition:color 0.2s; line-height:1; padding:0.2rem; }
.cart-item-remove:hover { color:var(--dark); }
.cart-total { display:flex; justify-content:space-between; font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:600; padding:1.3rem 0; color:var(--dark); border-top:1px solid var(--border); margin-top:0.5rem; }
.drawer-enter-active, .drawer-leave-active { transition:opacity 0.3s; }
.drawer-enter-from, .drawer-leave-to { opacity:0; }

/* Footer */
.footer { background:var(--dark); padding:5rem 3rem 2rem; }
.footer-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:3.5rem; padding-bottom:3.5rem; border-bottom:1px solid rgba(255,255,255,0.07); gap:3rem; flex-wrap:wrap; }
.footer-logo { font-family:'Cormorant Garamond',serif; font-size:4.5rem; font-weight:300; color:#fff; line-height:1; margin-bottom:0.5rem; }
.footer-tagline { font-size:0.62rem; font-weight:700; letter-spacing:0.25em; text-transform:uppercase; color:var(--tan); margin-bottom:1rem; }
.footer-about { font-family:'Cormorant Garamond',serif; font-size:1rem; color:rgba(255,255,255,0.38); line-height:1.7; max-width:260px; }
.footer-bottom { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; }
.footer-bottom p { font-size:0.6rem; color:rgba(255,255,255,0.18); letter-spacing:0.1em; }
.footer-socials { display:flex; gap:1.5rem; }
.footer-socials a { text-decoration:none; font-size:0.62rem; font-weight:700; letter-spacing:0.12em; color:rgba(255,255,255,0.28); transition:color 0.2s; }
.footer-socials a:hover { color:var(--tan); }

/* Responsive */
@media (max-width:1024px) {
  .product-grid { grid-template-columns:repeat(2,1fr); }
}
@media (max-width:768px) {
  .nav-inner { padding:1rem 1.5rem; }
  .nav-links { display:none; }
  .hero-content { padding:0 1.5rem; }
  .hero-scroll-hint { display:none; }
  .products-section { padding:5rem 1.5rem 2rem; min-height:unset; }
  .collection-section { padding:3.5rem 1.5rem; }
  .modal-card {
    grid-template-columns: 1fr;
    max-width: 95vw;
  }
  .modal-img-main {
    min-height: 320px;
  }
  .modal-info {
    padding: 1.5rem;
  }
  .footer-top { flex-direction:column; }
}
@media (max-width:480px) {
  .product-grid { grid-template-columns:repeat(2,1fr); gap:0.7rem; }
  .hero-cta { flex-direction:column; align-items:flex-start; }
}

/* Cart quantity and toast z-index */
.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.qty-btn {
  background: #e4dcd2;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
.qty-btn:hover {
  background: #c9a87c;
  color: white;
}
.modal-overlay, .cart-overlay, .toast-container {
  z-index: 2000;
}
</style>