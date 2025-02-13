<template lang="html">
  <div>
     <!-- name -->
      {{ name }}
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="css">
  
</style>