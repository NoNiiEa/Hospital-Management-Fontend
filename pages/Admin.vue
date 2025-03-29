<!-- @format -->

<template>
  <!-- Admin page with dashboard -->
  <div class="flex w-full h-full">
    <div class="mt-5 w-0">
      <!-- Left side space (formerly for AdminProfile) -->
    </div>
    <div class="flex-1 bg-blue-50">
      <AdminDashBoard />
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminDashBoard from '../components/Admin/AdminDashBoard.vue';
</script>

<style>
</style>
