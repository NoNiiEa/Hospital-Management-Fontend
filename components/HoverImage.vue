<template>
  <div class="relative">
    <img
      :src="smallImage"
      :alt="altText"
      @mouseover="showLargeImage"
      @mouseout="hideLargeImage"
      class="transition-all duration-300"
    />
    <img
      v-if="isHovered"
      :src="largeImage"
      :alt="altText"
      class="absolute top-0 left-0 w-[200%] h-[200%] z-10"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Props
const props = defineProps({
  smallImage: {
    type: String as () => string,
    required: true,
  },
  largeImage: {
    type: String as () => string,
    required: true,
  },
  altText: {
    type: String as () => string,
    required: true,
  },
});

// State
const isHovered = ref<boolean>(false);

// Methods
const showLargeImage = (): void => {
  isHovered.value = true;
};

const hideLargeImage = (): void => {
  isHovered.value = false;
};
</script>
