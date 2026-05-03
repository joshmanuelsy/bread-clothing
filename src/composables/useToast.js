import { ref } from 'vue';

export function useToast() {
  const toasts = ref([]);
  let nextId = 0;

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = nextId++;
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id);
    }, duration);
  };

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  return {
    toasts,
    addToast,
    removeToast
  };
}