<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// State
const staffId = ref('');
const staffName = ref('');
const deleteByName = ref(false);
const isDeleting = ref(false);
const errorMessage = ref('');

// Router
const router = useRouter();

// Methods
const toggleDeleteMethod = () => {
  deleteByName.value = !deleteByName.value;
  // Clear fields when switching methods
  staffId.value = '';
  staffName.value = '';
  errorMessage.value = '';
};

const deleteStaff = async () => {
  // Validate input
  if (deleteByName.value && !staffName.value.trim()) {
    errorMessage.value = 'Staff name is required';
    return;
  }

  if (!deleteByName.value && !staffId.value.trim()) {
    errorMessage.value = 'Staff ID is required';
    return;
  }

  // Confirm deletion
  if (!confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
    return;
  }

  isDeleting.value = true;
  errorMessage.value = '';

  try {
    // Use the correct endpoint based on deletion method
    const endpoint = deleteByName.value
      ? `http://127.0.0.1:8000/staffs/delete/by-name/${encodeURIComponent(staffName.value)}`
      : `http://127.0.0.1:8000/staffs/delete/${staffId.value}`;

    // Replace fetch with axios
    const response = await axios.delete(endpoint, {
      headers: {
        'accept': 'application/json'
      }
    });

    // Handle API response - with axios, successful responses come here
    alert('Staff member deleted successfully!');
    sessionStorage.setItem('needsRefresh', 'true');
    router.push('/staff');

  } catch (error: any) {
    console.error('Error deleting staff:', error);

    // Handle axios error responses
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const data = error.response.data;

      if (status === 400) {
        errorMessage.value = data.detail || 'Invalid staff information provided';
      } else if (status === 404) {
        errorMessage.value = 'Staff member not found';
      } else {
        errorMessage.value = data.detail || 'Failed to delete staff member';
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage.value = 'No response from server. Please try again later.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage.value = error.message || 'Error deleting staff member';
    }
  } finally {
    isDeleting.value = false;
  }
};

const cancel = () => {
  router.push('/staff');
};
</script>

<template>
  <div class="bg-gray-100 min-h-screen p-6">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-red-600 mb-6 text-center">Delete Staff Member</h2>

      <!-- Delete Method Toggle -->
      <div class="mb-6">
        <div class="flex items-center justify-center space-x-4">
          <button
            @click="toggleDeleteMethod"
            :class="[
              'px-4 py-2 rounded-md font-medium transition-colors duration-200',
              !deleteByName ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            ]"
          >
            Delete by ID
          </button>
          <button
            @click="toggleDeleteMethod"
            :class="[
              'px-4 py-2 rounded-md font-medium transition-colors duration-200',
              deleteByName ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            ]"
          >
            Delete by Name
          </button>
        </div>
      </div>

      <!-- Delete Form -->
      <div class="space-y-4">
        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span class="block sm:inline">{{ errorMessage }}</span>
        </div>

        <!-- ID Input -->
        <div v-if="!deleteByName" class="space-y-2">
          <label for="staffId" class="block text-sm font-medium text-gray-700">Staff ID:</label>
          <input
            type="text"
            id="staffId"
            v-model="staffId"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Enter staff ID (e.g., 123123213)"
          />
          <p class="text-xs text-gray-500 mt-1">Enter the MongoDB ObjectID of the staff member</p>
        </div>

        <!-- Name Input -->
        <div v-else class="space-y-2">
          <label for="staffName" class="block text-sm font-medium text-gray-700">Staff Name:</label>
          <input
            type="text"
            id="staffName"
            v-model="staffName"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Enter exact staff name"
          />
          <p class="text-xs text-gray-500 mt-1">Name must match exactly as stored in the database</p>
        </div>

        <!-- Warning Message -->
        <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 my-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm">Are you sure you want to delete this staff member?</p>
              <p class="text-sm font-bold mt-1">This action cannot be undone.</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center space-x-4 pt-4">
          <button
            type="button"
            @click="cancel"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="deleteStaff"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-red-300 disabled:cursor-not-allowed"
            :disabled="isDeleting"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete Staff Member' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
