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
        <div class="mt-4 relative">
            <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
                <input type="text" v-model="search" placeholder="ค้นหาชื่อคนไข้แบบ real-time..."
                    class="w-full pl-10 pr-10 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <button v-if="search" @click="search = ''" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div v-if="search && filteredPatients.length === 0" class="mt-2 text-sm text-center text-gray-600">
                ไม่พบคนไข้ที่ตรงกับ "{{ search }}"
            </div>
            <div v-if="search && filteredPatients.length > 0" class="mt-2 text-sm text-center text-gray-600">
                พบ {{ filteredPatients.length }} คนไข้ที่ตรงกับการค้นหา
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
                <div class="flex justify-between items-center">
                    <h2 class="text-lg font-semibold text-gray-700">เคสล่าสุด</h2>
                    <span v-if="search" class="text-sm text-blue-600">กำลังค้นหา: {{ search }}</span>
                </div>
                <ul class="mt-3">
                    <li v-for="(patientItem, index) in filteredPatients" :key="index" class="p-2 border-b">
                        <router-link :to="{
                            path: `/patient/${patientItem.patient_id}`,
                            query: { from: route.params.id }
                        }" class="text-blue-900 hover:underline">
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
import { computed, onMounted, ref } from "vue";
import { useRoute } from 'vue-router';

const route = useRoute();
const doctors = ref([]);
const doctor_REF = ref(null);
const searchQuery = ref("");
const patient = ref(null);
const patientNames = ref({});
const search = ref("");

// Add computed property for filtered patients
const filteredPatients = computed(() => {
    if (!doctor_REF.value?.patients) return [];

    if (!search.value.trim()) {
        return doctor_REF.value.patients;
    }

    return doctor_REF.value.patients.filter(patientItem => {
        const patientName = patientNames.value[patientItem.patient_id] || "";
        return patientName.toLowerCase().includes(search.value.toLowerCase());
    });
});

const fetchDoctorById = async () => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/doctors/get/${route.params.id}`);
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

const fetchPatientData = async (patientId) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/patients/get/${patientId}`);
        if (response.ok) {
            const data = await response.json();
            patientNames.value[patientId] = data.name;
        } else {
            patientNames.value[patientId] = "ไม่ทราบชื่อ";
        }
    } catch (error) {
        console.error(`Error fetching patient ${patientId}:`, error);
        patientNames.value[patientId] = "ไม่ทราบชื่อ";
    }
};

const fetchAllPatientNames = async () => {
    if (!doctor_REF.value?.patients) return;
    for (const patient of doctor_REF.value.patients) {
        await fetchPatientData(patient.patient_id);
    }
};

onMounted(async () => {
    await fetchDoctors();
    await fetchDoctorById();
    await fetchAllPatientNames();
});
</script>


<style>
body {
    font-family: "Noto Sans Thai", sans-serif;
}
</style>
