<template lang="html">
  <div class="doctor-card">
    <!-- card profile doctor -->
    <div class="information">
      <!-- name -->
      <p class="name">{{ name }}</p>
      <p class="role">หมอเฉพาะทางด้าน สมอง</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // mockdata
    name: {
      type: String,
      default: 'คุณหมอ น็อต ไทยเงิน ปินตา',
    },
  },
};
</script>
<style lang="css">
  .doctor-card {
    background-color: #193288;
    padding: 2% 5%;
    border-radius: 10px;
  }
  .information {
  }
  .information p {
    color: #FFFFFF;
  }
  .role {
    font-size: larger;
  }
  .role {
    font-size: small;
  }
</style>