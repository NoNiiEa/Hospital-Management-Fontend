<template>
  <div class="min-h-screen bg-blue-50 p-6">
    <!-- Dashboard Header -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-blue-900">Dashboard</h1>
    </div>

    <!-- Doctor Info -->
    <div class="bg-blue-900 text-white p-6 mt-4 rounded-lg flex items-center">
      <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-xl font-bold">
        👨‍⚕️
      </div>

      <div v-if="doctor" class="ml-4">
        <h2 class="text-xl font-semibold">คุณหมอ {{ doctor.name }}</h2>
        <p class="text-sm opacity-75">ผู้เชี่ยวชาญด้าน {{ doctor.specialization }}</p>
      </div>
      <div v-else class="ml-4 text-sm opacity-75">กำลังโหลดข้อมูลแพทย์...</div>
    </div>

    <!-- Search Bar -->
    <div class="mt-4">
      <input type="text" v-model="searchQuery" placeholder="ค้นหา..." class="w-full p-3 border rounded-lg shadow-sm" />
    </div>

    <!-- Two-Column Layout (Schedule & Recent Cases) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <!-- Schedule -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold text-gray-700">ตารางงาน</h2>
        <ul class="mt-3">
          <li v-for="(scheduleItem, index) in doctor?.schedule || []" :key="index" class="p-2 border-b">
            <strong>{{ scheduleItem.day }}</strong>:
            <span v-for="(time, tIndex) in scheduleItem.timeslot" :key="tIndex">
              {{ time }}<span v-if="tIndex !== scheduleItem.timeslot.length - 1">, </span>
            </span>
          </li>
        </ul>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold text-gray-700">เคสล่าสุด</h2>
        <ul class="mt-3">
          <li v-for="(patientItem, index) in doctor?.patients || []" :key="index" class="p-2 border-b">
            <router-link :to="`/patient/${patientItem.patient_id}`" class="text-blue-900 hover:underline">
              <strong>{{ patientNames[patientItem.patient_id] || "กำลังโหลด..." }}</strong>
            </router-link>
            <br>
            {{ patientItem.diagnosis }}
            <span v-if="patientItem.last_visit !== 'N/A'">
              (เยี่ยมล่าสุด: {{ patientItem.last_visit }})
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useApi } from "~/composables/useApi";

// Type definitions
interface Schedule {
  day: string;
  timeslot: string[];
}

interface Patient {
  patient_id: string;
  diagnosis: string;
  last_visit: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  schedule: Schedule[];
  patients: Patient[];
}

// State
const doctors = ref<Doctor[]>([]);
const doctor = ref<Doctor | null>(null);
const searchQuery = ref<string>("");
const patientNames = ref<Record<string, string>>({});

// API service
const api = useApi();

// Methods
const fetchDoctorById = async (): Promise<void> => {
  try {
    const id = "67b304ad4aa1f361628ad2ad";
    const data = await api.get<Doctor>(`/doctors/get/${id}`);
    doctor.value = data;
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
  }
};

const fetchDoctors = async (): Promise<void> => {
  try {
    const data = await api.get<Doctor[]>("/doctors/");
    doctors.value = data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
  }
};

// Fetch patient details dynamically
const fetchPatientData = async (patientId: string): Promise<void> => {
  try {
    const data = await api.get<{ name: string }>(`/patients/get/${patientId}`);
    patientNames.value[patientId] = data.name;
  } catch (error) {
    console.error(`Error fetching patient ${patientId}:`, error);
    patientNames.value[patientId] = "ไม่ทราบชื่อ";
  }
};

// Fetch all patient names when doctor is loaded
const fetchAllPatientNames = async (): Promise<void> => {
  if (!doctor.value?.patients) return;

  for (const patient of doctor.value.patients) {
    await fetchPatientData(patient.patient_id);
  }
};

// Run functions on component mount
onMounted(async () => {
  await fetchDoctors();
  await fetchDoctorById();
  await fetchAllPatientNames();
});
</script>

<style>
body
{
  font-family: "Noto Sans Thai", sans-serif;
}
</style>
