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

    <!-- Patient Management Section -->
    <div class="bg-white p-6 mt-4 rounded-lg shadow-md">
      <h2 class="text-lg font-semibold text-gray-700 mb-3">เพิ่มผู้ป่วย</h2>

      <div class="flex gap-2 mb-4">
        <input type="text" v-model="patientSearchQuery" placeholder="ค้นหาผู้ป่วย..."
          class="flex-1 p-3 border rounded-lg shadow-sm" @input="searchPatients" />
      </div>

      <!-- Search Results -->
      <div v-if="patientSearchResults.length > 0" class="mt-2 border rounded-lg overflow-hidden">
        <div class="max-h-60 overflow-y-auto">
          <div v-for="(patient, index) in patientSearchResults" :key="patient.id"
            class="p-3 border-b hover:bg-blue-50 flex justify-between items-center cursor-pointer"
            @click="selectPatient(patient)">
            <div>
              <span class="font-medium">{{ patient.name }}</span>
              <span class="text-sm text-gray-500 ml-2">({{ patient.age }} ปี, {{ patient.gender }})</span>
            </div>
            <button @click.stop="addPatientToDoctor(patient.id)"
              class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
              เพิ่ม
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="patientSearchQuery && !isLoading" class="mt-2 p-3 text-center text-gray-500">
        ไม่พบผู้ป่วยที่ค้นหา
      </div>

      <!-- Selected Patient Details -->
      <div v-if="selectedPatient" class="mt-4 p-4 border rounded-lg bg-blue-50">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold text-lg">{{ selectedPatient.name }}</h3>
            <p class="text-gray-600">อายุ: {{ selectedPatient.age }} ปี, เพศ: {{ selectedPatient.gender }}</p>
            <p class="text-gray-600">
              <span class="font-medium">ติดต่อ:</span> {{ selectedPatient.contact?.phone }}
            </p>
          </div>
          <button @click="addPatientToDoctor(selectedPatient.id)"
            class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            เพิ่มเป็นผู้ป่วยของแพทย์
          </button>
        </div>

        <div class="mt-3" v-if="selectedPatient.medical_history?.length > 0">
          <p class="font-medium">ประวัติการรักษา:</p>
          <ul class="mt-1 text-sm">
            <li v-for="(history, idx) in selectedPatient.medical_history" :key="idx" class="mb-1">
              {{ history.disease }} (วันที่: {{ history.diagnosed_date }}) - {{ history.treatment }}
            </li>
          </ul>
        </div>
      </div>
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


<script setup>
import axios from 'axios';
import { onMounted, ref, watch } from "vue";

const doctors = ref([]);
const doctor_REF = ref(null);
const searchQuery = ref("");
const patient = ref(null);
const patientNames = ref({}); // Store fetched patient names

// Patient search and management
const allPatients = ref([]);
const patientSearchQuery = ref("");
const patientSearchResults = ref([]);
const selectedPatient = ref(null);
const isLoading = ref(false);

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

// Fetch all patients data
const fetchAllPatients = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get("http://127.0.0.1:8000/patients/");
    if (response.status === 200) {
      allPatients.value = response.data;
    } else {
      console.error("Error fetching patients data");
    }
  } catch (error) {
    console.error("Error fetching patients:", error);
  } finally {
    isLoading.value = false;
  }
};

// Search patients based on the query
const searchPatients = () => {
  if (!patientSearchQuery.value.trim()) {
    patientSearchResults.value = [];
    return;
  }

  const query = patientSearchQuery.value.toLowerCase();
  patientSearchResults.value = allPatients.value.filter(patient =>
    patient.name.toLowerCase().includes(query)
  );
};

// Select a patient to view details
const selectPatient = (patient) => {
  selectedPatient.value = patient;
};

// Add a patient to the doctor's patient list
const addPatientToDoctor = async (patientId) => {
  if (!doctor_REF.value || !patientId) return;

  // Check if patient already exists
  const patientExists = doctor_REF.value.patients.some(p => p.patient_id === patientId);
  if (patientExists) {
    alert("ผู้ป่วยนี้อยู่ในรายชื่อของแพทย์แล้ว");
    return;
  }

  try {
    // Make sure we have the doctor ID and it's not undefined
    const doctorId = doctor_REF.value.id;
    if (!doctorId) {
      alert("ไม่พบรหัสแพทย์ กรุณาลองใหม่อีกครั้ง");
      return;
    }

    console.log(`Adding patient ${patientId} to doctor ${doctorId}`);

    // Prepare the data to send
    const patientData = {
      diagnosis: "รอการวินิจฉัย",
      last_visit: new Date().toISOString().split('T')[0] // Today's date
    };

    // Make the request with the correct URL format and send data in the request body
    const response = await axios.put(
      `http://127.0.0.1:8000/doctors/${doctorId}/add_patient/${patientId}`,
      patientData
    );

    if (response.status === 200) {
      alert("เพิ่มผู้ป่วยเรียบร้อยแล้ว");
      // Refresh doctor data
      await fetchDoctorById();
      // Fetch new patient name
      await fetchPatientData(patientId);
    } else {
      alert("เกิดข้อผิดพลาดในการเพิ่มผู้ป่วย: " + response.statusText);
    }
  } catch (error) {
    console.error("Error adding patient to doctor:", error);
    alert("เกิดข้อผิดพลาดในการเพิ่มผู้ป่วย: " + (error.response?.data?.detail || error.message));
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

// Watch for changes in search query
watch(patientSearchQuery, searchPatients);

// Run functions on component mount
onMounted(async () => {
  await fetchDoctors();
  await fetchDoctorById();
  await fetchAllPatientNames(); // Fetch all patient names
  await fetchAllPatients(); // Fetch all patients for search
});
</script>


<style>
body {
  font-family: "Noto Sans Thai", sans-serif;
}
</style>