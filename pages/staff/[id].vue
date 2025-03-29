<script setup lang="ts">
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Define interfaces for staff data
interface Contact {
  phone: string;
  email: string;
  address: string;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  contact: Contact;
  shift: string;
  department?: string;
  hire_date?: string;
  supervisor?: string;
  qualifications?: string[];
  certifications?: string[];
  performance_reviews?: PerformanceReview[];
  attendance_records?: AttendanceRecord[];
}

interface PerformanceReview {
  date: string;
  rating: number;
  reviewer: string;
  comments: string;
}

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  hours_worked?: number;
  notes?: string;
}

// Route and router
const route = useRoute();
const router = useRouter();

// Reactive state
const staff = ref<Staff | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);
const showEditForm = ref<boolean>(false);

// Get role display name from role value
const getRoleDisplayName = computed(() => {
  const roleMap: { [key: string]: string } = {
    'professor': 'Professor',
    'assistant_professor': 'Assistant Professor',
    'lecturer': 'Lecturer',
    'administrator': 'Administrator',
    'support': 'Support Staff',
    'technician': 'Technician',
    'research_assistant': 'Research Assistant'
  };

  return staff.value?.role ? (roleMap[staff.value.role] || staff.value.role) : '';
});

// Get shift display name
const getShiftDisplayName = computed(() => {
  const shiftMap: { [key: string]: string } = {
    'morning': 'Morning (8:00 AM - 4:00 PM)',
    'afternoon': 'Afternoon (12:00 PM - 8:00 PM)',
    'evening': 'Evening (4:00 PM - 12:00 AM)',
    'night': 'Night (12:00 AM - 8:00 AM)',
    'flexible': 'Flexible Hours',
    'weekend': 'Weekend Only'
  };

  return staff.value?.shift ? (shiftMap[staff.value.shift] || staff.value.shift) : '';
});

// Methods
const fetchStaffData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await axios.get(`http://127.0.0.1:8000/staffs/get/${route.params.id}`);
    staff.value = response.data;

    // If the API doesn't provide these fields, initialize them for display
    if (!staff.value.performance_reviews) {
      staff.value.performance_reviews = [];
    }

    if (!staff.value.attendance_records) {
      staff.value.attendance_records = [];
    }
  } catch (err) {
    console.error('Error fetching staff data:', err);
    error.value = err instanceof Error ? err.message : 'An unknown error occurred';
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const goBack = () => {
  router.push('/admin');
};

const confirmDelete = async () => {
  if (!staff.value?.id) return;

  if (confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/staffs/delete/${staff.value.id}`, {
        headers: {
          'accept': 'application/json'
        }
      });

      alert('Staff member deleted successfully');
      sessionStorage.setItem('needsRefresh', 'true');
      router.push('/admin');
    } catch (err: any) {
      console.error('Error deleting staff:', err);
      alert(err.response?.data?.detail || 'Failed to delete staff member');
    }
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchStaffData();
});
</script>

<template>
  <div class="bg-gray-100 min-h-screen p-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-4xl mx-auto">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline"> {{ error }}</span>
      <button @click="goBack" class="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Return to Staff List
      </button>
    </div>

    <!-- Staff Data -->
    <div v-else-if="staff" class="max-w-5xl mx-auto">
      <!-- Header with Actions -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-t-lg shadow-md border-b border-gray-200">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800">{{ staff.name }}</h1>
          <p class="text-lg text-blue-600 font-medium">{{ getRoleDisplayName }}</p>
        </div>

        <div class="flex mt-4 md:mt-0 space-x-3">
          <button
            @click="goBack"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
          >
            Back to List
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <!-- Staff Information -->
      <div class="bg-white rounded-b-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Information -->
          <div class="border rounded-lg p-5">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">Basic Information</h2>

            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-500">ID</p>
                <p class="font-medium">{{ staff.id }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-500">Role</p>
                <p class="font-medium">{{ getRoleDisplayName }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-500">Shift</p>
                <p class="font-medium">{{ getShiftDisplayName }}</p>
              </div>

              <div v-if="staff.department">
                <p class="text-sm text-gray-500">Department</p>
                <p class="font-medium">{{ staff.department }}</p>
              </div>

              <div v-if="staff.hire_date">
                <p class="text-sm text-gray-500">Hire Date</p>
                <p class="font-medium">{{ formatDate(staff.hire_date) }}</p>
              </div>

              <div v-if="staff.supervisor">
                <p class="text-sm text-gray-500">Supervisor</p>
                <p class="font-medium">{{ staff.supervisor }}</p>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="border rounded-lg p-5">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">Contact Information</h2>

            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-500">Phone</p>
                <p class="font-medium">{{ staff.contact?.phone }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-500">Email</p>
                <p class="font-medium break-all">{{ staff.contact?.email }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-500">Address</p>
                <p class="font-medium">{{ staff.contact?.address }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Qualifications and Certifications -->
      <div v-if="staff.qualifications?.length || staff.certifications?.length" class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Qualifications -->
          <div v-if="staff.qualifications?.length" class="border rounded-lg p-5">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">Qualifications</h2>

            <ul class="list-disc pl-5 space-y-1">
              <li v-for="(qualification, index) in staff.qualifications" :key="index" class="text-gray-700">
                {{ qualification }}
              </li>
            </ul>
          </div>

          <!-- Certifications -->
          <div v-if="staff.certifications?.length" class="border rounded-lg p-5">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">Certifications</h2>

            <ul class="list-disc pl-5 space-y-1">
              <li v-for="(certification, index) in staff.certifications" :key="index" class="text-gray-700">
                {{ certification }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Performance Reviews -->
      <div v-if="staff.performance_reviews?.length" class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">Performance Reviews</h2>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(review, index) in staff.performance_reviews" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(review.date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    :class="{
                      'bg-green-100 text-green-800': review.rating >= 4,
                      'bg-yellow-100 text-yellow-800': review.rating >= 3 && review.rating < 4,
                      'bg-red-100 text-red-800': review.rating < 3
                    }"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ review.rating }} / 5
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ review.reviewer }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ review.comments }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Attendance Records -->
      <div v-if="staff.attendance_records?.length" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">Attendance Records</h2>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours Worked</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(record, index) in staff.attendance_records" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(record.date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    :class="{
                      'bg-green-100 text-green-800': record.status === 'present',
                      'bg-red-100 text-red-800': record.status === 'absent',
                      'bg-yellow-100 text-yellow-800': record.status === 'late',
                      'bg-blue-100 text-blue-800': record.status === 'leave'
                    }"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ record.status.charAt(0).toUpperCase() + record.status.slice(1) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.hours_worked || 'N/A' }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ record.notes || 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No additional records message -->
      <div v-if="!staff.performance_reviews?.length && !staff.attendance_records?.length && !staff.qualifications?.length && !staff.certifications?.length" class="bg-white rounded-lg shadow-md p-6 text-center">
        <p class="text-gray-500">No additional records available for this staff member.</p>
      </div>
    </div>
  </div>
</template>
