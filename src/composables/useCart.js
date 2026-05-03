import { ref, computed, watch } from 'vue';

const STORAGE_KEY = 'bread_cart';

export function useCart() {
  const cartItems = ref([]);

  // Load from localStorage on init
  const savedCart = localStorage.getItem(STORAGE_KEY);
  if (savedCart) {
    cartItems.value = JSON.parse(savedCart);
  }

  // Persist to localStorage whenever cart changes
  watch(cartItems, (newCart) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
  }, { deep: true });

  const cartCount = computed(() => 
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  const cartTotal = computed(() => 
    cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  const addToCart = (product, selectedSize) => {
    const existing = cartItems.value.find(
      item => item.id === product.id && item.size === selectedSize
    );
    if (existing) {
      existing.quantity++;
    } else {
      cartItems.value.push({
        ...product,
        size: selectedSize,
        quantity: 1
      });
    }
  };

  const removeFromCart = (index) => {
    cartItems.value.splice(index, 1);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
    } else {
      cartItems.value[index].quantity = newQuantity;
    }
  };

  const clearCart = () => {
    cartItems.value = [];
  };

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
}