<template>
  <div class="hover-image-container">
    <img :src="smallImage" :alt="altText" class="small-image" @mouseover="isHovered = true" @mouseleave="isHovered = false" />
    <div v-if="isHovered" class="overlay">
      <img :src="largeImage" :alt="altText" class="large-image" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    smallImage: {
      type: String,
      required: true
    },
    largeImage: {
      type: String,
      required: true
    },
    altText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isHovered: false
    };
  }
};
</script>

<style scoped>
.hover-image-container {
  position: relative;
  display: inline-block;
}

.small-image {
  width: 100px; /* Adjust as needed */
  height: auto;
  cursor: pointer;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10; /* Ensure it's on top */
}

.large-image {
  max-width: 80%; /* Adjust as needed */
  max-height: 80%; /* Adjust as needed */
  border-radius: 5px;
}
</style>
