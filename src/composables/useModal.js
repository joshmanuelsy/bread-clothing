import { ref } from 'vue';

export function useModal() {
  const modalVisible = ref(false);
  const selectedProduct = ref(null);
  const selectedSize = ref('M');
  const currentImageIndex = ref(0);

  const openModal = (product) => {
    selectedProduct.value = product;
    selectedSize.value = 'M';
    currentImageIndex.value = 0;
    modalVisible.value = true;
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalVisible.value = false;
    selectedProduct.value = null;
    currentImageIndex.value = 0;
    document.body.style.overflow = '';
  };

  return {
    modalVisible,
    selectedProduct,
    selectedSize,
    currentImageIndex,
    openModal,
    closeModal
  };
}