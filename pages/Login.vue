<template>
  <div class="flex flex-col items-center justify-center min-h-screen w-screen bg-white p-4">
    <div class="w-full max-w-md">
      <h1 class="text-2xl font-bold mb-1 text-center">Login</h1>
      <p class="text-gray-600 mb-6 text-center">Login to your account.</p>

      <!-- Login Form -->
      <div class="mb-6 w-full">
        <div class="mb-4 text-left">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-700">E-mail Address</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div class="mb-6 text-left">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
        {{ error }}
      </div>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="mb-4 flex justify-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
      </div>

      <!-- Login Button -->
      <button
        type="button"
        @click="login"
        :disabled="isLoading"
        class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200 focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '~/composables/useApi';

// Interface for login credentials
interface LoginCredentials {
  email: string;
  password: string;
}

// Interface for login response
interface LoginResponse {
  success: boolean;
  role?: string;
  message?: string;
}

const router = useRouter();
const api = useApi();
const email = ref<string>('');
const password = ref<string>('');
const error = ref<string | null>(null);
const isLoading = ref<boolean>(false);

const login = async (): Promise<void> => {
  // Reset error state
  error.value = null;

  // Basic validation
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password';
    return;
  }

  // Create credentials object
  const credentials: LoginCredentials = {
    email: email.value,
    password: password.value
  };

  isLoading.value = true;

  try {
    // In a real app, you would call your auth API
    // const response = await api.post<LoginResponse>('/auth/login', credentials);

    // For demonstration purposes, simulate a successful login
    const simulatedResponse: LoginResponse = {
      success: true,
      role: email.value.includes('admin') ? 'admin' : 'user'
    };

    // Set session cookie
    document.cookie = `session=${credentials.email}; path=/; max-age=3600; secure; samesite=strict`;

    // Redirect based on role
    if (simulatedResponse.role === 'admin') {
      router.push('/Admin');
    } else {
      router.push('/');
    }
  } catch (err) {
    error.value = 'Login failed. Please check your credentials.';
    console.error('Login error:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>
