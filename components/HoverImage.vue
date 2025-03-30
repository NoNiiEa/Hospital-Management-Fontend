<template>
  <div class="hover-image">
    <img :src="smallImage" :alt="altText" @mouseover="showLargeImage" @mouseout="hideLargeImage" />
    <img v-if="isHovered" :src="largeImage" :alt="altText" class="large-image" />
  </div>
</template>

<script>
export default {
  props: {
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
  },
  data() {
    return {
      isHovered: false,
    };
  },
  methods: {
    showLargeImage() {
      this.isHovered = true;
    },
    hideLargeImage() {
      this.isHovered = false;
    },
  },
};
</script>

<style scoped>
.hover-image {
  position: relative;
}
.large-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  z-index: 10;
}
</style>
