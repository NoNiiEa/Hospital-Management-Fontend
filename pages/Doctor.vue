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

      <div v-if="doctor_REF" class="ml-4">
        <h2 class="text-xl font-semibold">คุณหมอ {{ doctor_REF.name }}</h2>
        <p class="text-sm opacity-75">ผู้เชี่ยวชาญด้าน {{ doctor_REF.specialization }}</p>
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
          <li v-for="(scheduleItem, index) in doctor_REF?.schedule || []" :key="index" class="p-2 border-b">
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
          <li v-for="(patientItem, index) in doctor_REF?.patients || []" :key="index" class="p-2 border-b">
            <!-- <strong>{{ patientNames[patientItem.patient_id] || "กำลังโหลด..." }}</strong> -->
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

    <!-- Fetched Doctors List -->
    <!-- <div class="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 class="text-lg font-semibold text-gray-700">รายชื่อแพทย์</h2>
      <ul class="mt-3">
        <li v-for="(doctor, index) in doctors" :key="index" class="p-2 border-b">
          {{ doctor.name }} - {{ doctor.specialty }}
        </li>
      </ul>
    </div> -->
  </div>

  <!-- {{ doctor_REF }} -->

</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router"; // Import for route params

const doctors = ref([]);
const doctor_REF = ref(null);
const searchQuery = ref("");
const patient = ref(null);
const patientNames = ref({}); // Store fetched patient names

const fetchDoctorById = async () => {
  try {
    const id = "67b304ad4aa1f361628ad2ad";
    const response = await fetch(`http://127.0.0.1:8000/doctors/get/${id}`);
    doctor_REF.value = await response.json();
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
  }
};

const fetchDoctors = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/doctors/");
    doctors.value = await response.json();
  } catch (error) {
    console.error("Error fetching doctors:", error);
  }
};

// Fetch patient details dynamically
const fetchPatientData = async (patientId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/patients/get/${patientId}`);
    if (response.ok) {
      const data = await response.json();
      patientNames.value[patientId] = data.name; // Store patient's name
    } else {
      patientNames.value[patientId] = "ไม่ทราบชื่อ"; // Handle error cases
    }
  } catch (error) {
    console.error(`Error fetching patient ${patientId}:`, error);
    patientNames.value[patientId] = "ไม่ทราบชื่อ";
  }
};

// Fetch all patient names when doctor_REF is loaded
const fetchAllPatientNames = async () => {
  if (!doctor_REF.value?.patients) return;
  for (const patient of doctor_REF.value.patients) {
    await fetchPatientData(patient.patient_id);
  }
};

// Run functions on component mount
onMounted(async () => {
  await fetchDoctors();
  await fetchDoctorById();
  await fetchAllPatientNames(); // Fetch all patient names
});
</script>


<style>
body
{
  font-family: "Noto Sans Thai", sans-serif;
}
</style>