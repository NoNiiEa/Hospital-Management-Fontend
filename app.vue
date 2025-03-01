<!-- @format -->

<template>
  <div>
    <!-- <nav>
      <nuxt-link to="/login">Login</nuxt-link>
      <nuxt-link to="/admin">Admin</nuxt-link>
    </nav> -->
    <NuxtPage />
  </div>
</template>

<script>
import './assets/css/main.css'
import Doctor from '@/pages/Doctor.vue';
import Admin from '@/pages/Admin.vue';
import Login from '@/pages/Login.vue'; 

export default {
  components: {
    Doctor,
    Admin,
    Login, 
  },
};
</script>

<style lang=""></style>
