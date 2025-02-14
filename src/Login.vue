<template lang="html">
  <div class="page">
    <div>
      hello world
    </div>
    <div>
      Login to your account.
    </div>
    <!-- from -->
     <div>
      E-mail Address
      <input v-model="text"/>
     </div>
     <div>
      Password
      <input v-model="text"/>
     </div>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="css">
  .page {
    /* background-color: #253D90; */
    background-color: #FFFFFF;
    justify-content: center;
    height: 100vh; 
    width: 100vw; 
    /* display: flex; */
    align-items: center;
  }
  
</style>