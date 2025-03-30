<!-- @format -->

<template>
  <div class="max-w-md mx-auto my-8 p-8 rounded-2xl bg-white shadow-md flex flex-col gap-8">
    <!-- Profile -->
    <div class="flex flex-col items-center p-4">
      <div
        class="relative w-28 h-28 mb-4 rounded-full overflow-hidden shadow-sm hover:scale-105 transition-transform duration-300">
        <img src="@/assets/Images/inwnot.png" alt="Admin Profile Image" class="w-full h-full object-cover" />
      </div>
      <div class="flex flex-col items-center text-center">
        <!-- name -->
        <h3 class="text-2xl font-semibold mt-2 mb-1 text-gray-800">นาย น็อต เทพน็อต</h3>
        <!-- role -->
        <p class="text-sm text-gray-500">Admin ประจำโรงบาล</p>
      </div>
    </div>
    <div class="flex flex-col items-center gap-4 w-full">
      <!-- Features text -->
      <p class="text-lg font-semibold text-gray-800">Features</p>
      <!-- DashBoard button-->
      <button
        class="w-64 py-3 px-4 rounded-lg text-base font-semibold text-center text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-300">
        Dashboard
      </button>
    </div>
    <!-- log-out zone -->
    <div class="flex justify-center">
      <button
        class="w-64 py-3 px-4 rounded-lg text-base font-semibold text-center text-white bg-red-500 hover:bg-red-600 transition-colors duration-300">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
// No state or methods needed for this component yet
// Can add authentication logic here when needed
</script>
