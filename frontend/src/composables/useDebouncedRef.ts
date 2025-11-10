import { onBeforeUnmount, ref, watch } from 'vue';
import type { Ref } from 'vue';

export function useDebouncedRef<T>(source: Ref<T>, delay = 300): Ref<T> {
  const debounced = ref(source.value) as Ref<T>;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const clear = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  watch(
    source,
    (newValue) => {
      clear();
      timeoutId = setTimeout(() => {
        debounced.value = newValue;
      }, delay);
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    clear();
  });

  return debounced;
}
