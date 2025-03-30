<template>
  <div class="min-h-screen bg-blue-50 p-6">
    <!-- Back button -->
    <div class="mb-4">
      <button @click="$router.back()" class="flex items-center text-blue-900 hover:text-blue-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        ย้อนกลับ
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="text-xl text-gray-600">กำลังโหลดข้อมูล...</div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-100 p-4 rounded-lg text-red-800">
      <h2 class="text-xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
      <p>{{ error }}</p>
    </div>

    <!-- Medical personnel information -->
    <div v-else-if="medicalStaff" class="space-y-6">
      <!-- Profile header -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-blue-900 text-white p-6 flex items-center">
          <div class="w-20 h-20 bg-teal-400 rounded-full flex items-center justify-center text-3xl font-bold mr-6">
            {{ getInitials(medicalStaff.name) }}
          </div>
          <div>
            <h1 class="text-2xl font-bold">{{ medicalStaff.name }}</h1>
            <p class="text-lg opacity-80">{{ medicalStaff.role || 'บุคลากรทางการแพทย์' }}</p>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Contact information -->
            <div>
              <h2 class="text-xl font-semibold text-blue-900 mb-4">ข้อมูลติดต่อ</h2>
              <div class="space-y-3">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-3" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{{ medicalStaff.contact?.phone || 'ไม่มีข้อมูล' }}</span>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-3" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{{ medicalStaff.contact?.email || 'ไม่มีข้อมูล' }}</span>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-3" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ medicalStaff.contact?.address || 'ไม่มีข้อมูล' }}</span>
                </div>
              </div>
            </div>

            <!-- Department / Role information -->
            <div>
              <h2 class="text-xl font-semibold text-blue-900 mb-4">ข้อมูลการทำงาน</h2>
              <div class="space-y-3">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-3" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{{ medicalStaff.department || 'ไม่มีข้อมูล' }}</span>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-3" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>{{ medicalStaff.position || 'ไม่มีข้อมูล' }}</span>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-3" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ medicalStaff.shift || 'ไม่มีข้อมูลกะการทำงาน' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Qualifications / Expertise -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-blue-900 mb-4">คุณวุฒิและความเชี่ยวชาญ</h2>
        <div v-if="medicalStaff.qualifications && medicalStaff.qualifications.length > 0">
          <ul class="list-disc pl-5 space-y-2">
            <li v-for="(qualification, index) in medicalStaff.qualifications" :key="index" class="text-gray-700">
              {{ qualification }}
            </li>
          </ul>
        </div>
        <div v-else-if="medicalStaff.specialization" class="text-gray-700">
          <p>ผู้เชี่ยวชาญด้าน {{ medicalStaff.specialization }}</p>
        </div>
        <div v-else class="text-gray-500 italic">
          ไม่มีข้อมูลคุณวุฒิและความเชี่ยวชาญ
        </div>
      </div>

      <!-- Schedule Section (if applicable) -->
      <div v-if="medicalStaff.schedule && medicalStaff.schedule.length > 0" class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-blue-900 mb-4">ตารางเวร</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วัน</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ช่วงเวลา</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(scheduleItem, index) in medicalStaff.schedule" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ scheduleItem.day }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    <span v-for="(time, tIndex) in scheduleItem.timeslot" :key="tIndex">
                      {{ time }}<span v-if="tIndex !== scheduleItem.timeslot.length - 1">, </span>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Patient List (if doctor) -->
      <div v-if="medicalStaff.patients && medicalStaff.patients.length > 0" class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-blue-900 mb-4">ผู้ป่วยในความดูแล</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อผู้ป่วย</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  การวินิจฉัย</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่พบล่าสุด</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(patientItem, index) in medicalStaff.patients" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-blue-900">
                    <router-link :to="`/patient/${patientItem.patient_id}`" class="hover:underline">
                      {{ patientNames[patientItem.patient_id] || "กำลังโหลด..." }}
                    </router-link>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ patientItem.diagnosis }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ patientItem.last_visit || 'N/A' }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const medicalId = route.params.id;

// State
const medicalStaff = ref(null);
const isLoading = ref(true);
const error = ref(null);
const patientNames = ref({});

// Fetch medical staff data
const fetchMedicalStaff = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const response = await axios.get(`http://127.0.0.1:8000/doctors/get/${medicalId}`);
    medicalStaff.value = response.data;

    // Fetch patient names if this is a doctor with patients
    if (medicalStaff.value?.patients && medicalStaff.value.patients.length > 0) {
      await fetchAllPatientNames();
    }
  } catch (err) {
    console.error("Error fetching medical staff:", err);
    error.value = "ไม่สามารถโหลดข้อมูลบุคลากรทางการแพทย์ได้ กรุณาลองใหม่อีกครั้ง";
  } finally {
    isLoading.value = false;
  }
};

// Fetch patient details dynamically
const fetchPatientData = async (patientId) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/patients/get/${patientId}`);
    if (response.status === 200) {
      patientNames.value[patientId] = response.data.name;
    } else {
      patientNames.value[patientId] = "ไม่ทราบชื่อ";
    }
  } catch (error) {
    console.error(`Error fetching patient ${patientId}:`, error);
    patientNames.value[patientId] = "ไม่ทราบชื่อ";
  }
};

// Fetch all patient names
const fetchAllPatientNames = async () => {
  if (!medicalStaff.value?.patients) return;
  for (const patient of medicalStaff.value.patients) {
    await fetchPatientData(patient.patient_id);
  }
};

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return "?";
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// NOTE: If you add functionality to add/remove patients in this file,
// make sure to use the correct endpoints:
// - For adding: PUT /doctors/{doctor_id}/add_patient/{patient_id}
// - For removing: DELETE /doctors/{doctor_id}/remove_patient/{patient_id}

// Run functions on component mount
onMounted(async () => {
  await fetchMedicalStaff();
});
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
