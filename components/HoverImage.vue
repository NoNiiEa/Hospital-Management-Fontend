<template>
  <div class="relative">
    <img :src="smallImage" :alt="altText" @mouseover="showLargeImage" @mouseout="hideLargeImage" />
    <img v-if="isHovered" :src="largeImage" :alt="altText" class="absolute top-0 left-0 w-[200%] h-[200%] z-10" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  smallImage: {
    type: String,
    required: true,
  },
  largeImage: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    required: true,
  },
});

const isHovered = ref(false);

const showLargeImage = () => {
  isHovered.value = true;
};

const hideLargeImage = () => {
  isHovered.value = false;
};
</script>
