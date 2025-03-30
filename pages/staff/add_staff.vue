<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// ---------------------- IMPORTS SECTION ----------------------
// Core Vue imports - Managed by developer team only

// Nuxt-specific imports (if needed)
// import { useNuxtApp } from '#app'

// Store/State management imports (if needed)
// import { useStore } from '~/store'

// Service/API imports (if needed)
// import { apiService } from '~/services/api'

// Utility imports (if needed)
// import { formatDate } from '~/utils/formatters'

// -------------------- TYPE DEFINITIONS ----------------------
// All interfaces and types - Modified only by development team
interface Contact {
  phone: string
  email: string
  address: string
}

interface staff {
  name: string;
  role: string;
  contact: Contact
  shift: string
}

const inputName = ref<string>("");
const inputRole = ref<string>("");
const inputContact = ref<Contact>();
const inputShift = ref<string>("");

// Create a reactive object for contact information to make form binding easier
const contactForm = ref<Contact>({
  phone: '',
  email: '',
  address: ''
});

// Form options for role selection dropdown
const roleOptions = [
  { label: 'Professor', value: 'professor' },
  { label: 'Assistant Professor', value: 'assistant_professor' },
  { label: 'Lecturer', value: 'lecturer' },
  { label: 'Administrator', value: 'administrator' },
  { label: 'Support Staff', value: 'support' },
  { label: 'Technician', value: 'technician' },
  { label: 'Research Assistant', value: 'research_assistant' }
];

// Form options for shift selection
const shiftOptions = [
  { label: 'Morning (8:00 AM - 4:00 PM)', value: 'morning' },
  { label: 'Afternoon (12:00 PM - 8:00 PM)', value: 'afternoon' },
  { label: 'Evening (4:00 PM - 12:00 AM)', value: 'evening' },
  { label: 'Night (12:00 AM - 8:00 AM)', value: 'night' },
  { label: 'Flexible Hours', value: 'flexible' },
  { label: 'Weekend Only', value: 'weekend' }
];

// Form validation state
const isFormValid = ref(false);
const validationErrors = ref<Record<string, string>>({});

// Import router for navigation
const router = useRouter();

// Form submission handling
const submitForm = async () => {
  // Validate the form before submission
  if (validateForm()) {
    isSubmitting.value = true;
    try {
      // Update inputContact with current values from contactForm
      inputContact.value = { ...contactForm.value };

      // Create a complete staff object from form inputs
      const staffData = {
        name: inputName.value,
        role: inputRole.value,
        contact: inputContact.value,
        shift: inputShift.value
      };

      // Send data to API
      const response = await fetch('http://127.0.0.1:8000/staffs/create', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(staffData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Staff created with ID:', result.id);

        // Show success message
        showSuccessNotification();

        // Add flag for refreshing data if needed
        sessionStorage.setItem('needsRefresh', 'true');

        // Navigate back to staff list page
        router.push('/admin');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create staff member');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.message || 'Failed to add staff member. Please try again.');
    } finally {
      isSubmitting.value = false;
    }
  }
};

// Add cancel method to return to staff list
const cancel = () => {
  router.push('/staff');
};

// Form validation
const validateForm = (): boolean => {
  validationErrors.value = {};
  let isValid = true;

  // Validate name
  if (!inputName.value || inputName.value.trim() === '') {
    validationErrors.value.name = 'Full name is required';
    isValid = false;
  }

  // Validate role
  if (!inputRole.value) {
    validationErrors.value.role = 'Role selection is required';
    isValid = false;
  }

  // Validate contact phone
  if (!contactForm.value.phone || contactForm.value.phone.trim() === '') {
    validationErrors.value['contact.phone'] = 'Phone number is required';
    isValid = false;
  } else if (!/^[0-9+\-\s()]{10,15}$/.test(contactForm.value.phone)) {
    validationErrors.value['contact.phone'] = 'Please enter a valid phone number';
    isValid = false;
  }

  // Validate email
  if (!contactForm.value.email || contactForm.value.email.trim() === '') {
    validationErrors.value['contact.email'] = 'Email address is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.value.email)) {
    validationErrors.value['contact.email'] = 'Please enter a valid email address';
    isValid = false;
  }

  // Validate shift
  if (!inputShift.value) {
    validationErrors.value.shift = 'Shift selection is required';
    isValid = false;
  }

  isFormValid.value = isValid;
  return isValid;
};

// Reset form data
const resetFormData = () => {
  // Reset main form fields
  inputName.value = '';
  inputRole.value = '';
  inputShift.value = '';

  // Reset contact form
  contactForm.value = {
    phone: '',
    email: '',
    address: ''
  };

  // Reset validation state
  validationErrors.value = {};
  isFormValid.value = false;

  // Reset the contact reference
  inputContact.value = undefined;
};

// Success notification
const showSuccessNotification = () => {
  // Use Nuxt UI's toast notification if available
  if (typeof $toast !== 'undefined') {
    $toast.success('Staff member added successfully!', {
      position: 'top-right',
      duration: 3000
    });
  } else {
    // Fallback to alert if toast is not available
    alert('Staff member added successfully!');
  }
};

// Loading state for form submission
const isSubmitting = ref(false);
</script>

<template>
  <div class="bg-gray-100 min-h-screen p-6">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Add New Staff Member</h2>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Basic Information Section -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Basic Information</h3>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name:</label>
            <input type="text" v-model="inputName" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            <p v-if="validationErrors.name" class="mt-1 text-sm text-red-600">
              {{ validationErrors.name }}
            </p>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Role:</label>
            <select v-model="inputRole" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select role</option>
              <option v-for="option in roleOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <p v-if="validationErrors.role" class="mt-1 text-sm text-red-600">
              {{ validationErrors.role }}
            </p>
          </div>
        </div>

        <!-- Contact Information Section -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Contact Information</h3>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number:</label>
            <input type="tel" v-model="contactForm.phone" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            <p v-if="validationErrors['contact.phone']" class="mt-1 text-sm text-red-600">
              {{ validationErrors['contact.phone'] }}
            </p>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address:</label>
            <input type="email" v-model="contactForm.email" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            <p v-if="validationErrors['contact.email']" class="mt-1 text-sm text-red-600">
              {{ validationErrors['contact.email'] }}
            </p>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Address:</label>
            <textarea v-model="contactForm.address" required rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
        </div>

        <!-- Work Schedule Section -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Work Schedule</h3>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Shift:</label>
            <div class="space-y-2 mt-2">
              <div v-for="option in shiftOptions" :key="option.value" class="flex items-center">
                <input type="radio" :id="option.value" :value="option.value" v-model="inputShift" name="shift" required
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                <label :for="option.value" class="ml-2 block text-sm text-gray-700">{{ option.label }}</label>
              </div>
            </div>
            <p v-if="validationErrors.shift" class="mt-1 text-sm text-red-600">
              {{ validationErrors.shift }}
            </p>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button type="button" @click="cancel"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200">
            Cancel
          </button>
          <button type="button" @click="resetFormData"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200">
            Reset
          </button>
          <button type="submit"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Save Staff Member' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
