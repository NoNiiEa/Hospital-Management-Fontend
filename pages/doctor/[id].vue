<template>
    <div class="min-h-screen bg-blue-50 p-6">
        <!-- Back button -->
        <div class="mb-4">
            <button @click="$router.back()"
                class="flex items-center text-blue-900 hover:text-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

        <!-- Doctor information -->
        <div v-else-if="doctor" class="space-y-6">
            <!-- Profile header -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="bg-blue-900 text-white p-6 flex items-center">
                    <div
                        class="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-3xl font-bold mr-6">
                        👨‍⚕️
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold">คุณหมอ {{ doctor.name }}</h1>
                        <p class="text-lg opacity-80">ผู้เชี่ยวชาญด้าน {{ doctor.specialization }}</p>
                    </div>
                </div>

                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Contact information -->
                        <div>
                            <h2 class="text-xl font-semibold text-blue-900 mb-4">ข้อมูลติดต่อ</h2>
                            <div class="space-y-3">
                                <div class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-3"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>{{ doctor.contact?.phone || 'ไม่มีข้อมูล' }}</span>
                                </div>
                                <div class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-3"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>{{ doctor.contact?.email || 'ไม่มีข้อมูล' }}</span>
                                </div>
                                <div class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-3"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{{ doctor.contact?.address || 'ไม่มีข้อมูล' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Schedule -->
                        <div>
                            <h2 class="text-xl font-semibold text-blue-900 mb-4">ตารางงาน</h2>
                            <div v-if="doctor.schedule && doctor.schedule.length > 0" class="bg-gray-50 p-4 rounded-lg">
                                <ul class="space-y-2">
                                    <li v-for="(scheduleItem, index) in doctor.schedule" :key="index"
                                        class="flex justify-between">
                                        <span class="font-medium">{{ scheduleItem.day }}</span>
                                        <span class="text-gray-600">
                                            <span v-for="(time, tIndex) in scheduleItem.timeslot" :key="tIndex">
                                                {{ time }}<span v-if="tIndex !== scheduleItem.timeslot.length - 1">,
                                                </span>
                                            </span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div v-else class="text-gray-500 italic">ไม่มีข้อมูลตารางงาน</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Patient Management Section -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold text-blue-900">รายชื่อผู้ป่วย</h2>
                    <button @click="showPatientSearch = !showPatientSearch"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        {{ showPatientSearch ? 'ซ่อนการค้นหา' : 'เพิ่มผู้ป่วย' }}
                    </button>
                </div>

                <!-- Patient Search Section (Collapsible) -->
                <div v-if="showPatientSearch" class="mb-6 border-b pb-6">
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
                                    <span class="text-sm text-gray-500 ml-2">({{ patient.age }} ปี, {{ patient.gender
                                        }})</span>
                                </div>
                                <button @click.stop="addPatientToDoctor(patient.id)"
                                    class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
                                    เพิ่ม
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="patientSearchQuery && !isSearchLoading" class="mt-2 p-3 text-center text-gray-500">
                        ไม่พบผู้ป่วยที่ค้นหา
                    </div>

                    <!-- Selected Patient Details -->
                    <div v-if="selectedPatient" class="mt-4 p-4 border rounded-lg bg-blue-50">
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="font-semibold text-lg">{{ selectedPatient.name }}</h3>
                                <p class="text-gray-600">อายุ: {{ selectedPatient.age }} ปี, เพศ: {{
                                    selectedPatient.gender }}</p>
                                <p class="text-gray-600">
                                    <span class="font-medium">ติดต่อ:</span> {{ selectedPatient.contact?.phone ||
                                        'ไม่มีข้อมูล' }}
                                </p>
                            </div>
                            <button @click="addPatientToDoctor(selectedPatient.id)"
                                class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                                เพิ่มเป็นผู้ป่วยของแพทย์
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Patient List -->
                <div v-if="doctor.patients && doctor.patients.length > 0">
                    <!-- Patient Search Input -->
                    <div class="mb-4">
                        <input v-model="patientListSearchQuery" type="text" placeholder="ค้นหาผู้ป่วย..."
                            class="w-full p-2 border rounded-lg shadow-sm" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th
                                        class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ชื่อผู้ป่วย</th>
                                    <th
                                        class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        การวินิจฉัย</th>
                                    <th
                                        class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        วันที่พบล่าสุด</th>
                                    <th
                                        class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        การดำเนินการ</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="(patientItem, index) in filteredPatients" :key="index"
                                    class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-blue-900">
                                            <router-link :to="`/patient/${patientItem.patient_id}`"
                                                class="hover:underline">
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
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button @click="removePatientFromDoctor(patientItem.patient_id)"
                                            class="text-red-600 hover:text-red-900">
                                            ลบออก
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div v-else class="text-center py-10 text-gray-500">
                    ไม่มีผู้ป่วยในความดูแล
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const doctorId = route.params.id;

// State
const doctor = ref(null);
const isLoading = ref(true);
const error = ref(null);
const patientNames = ref({});
const showPatientSearch = ref(false);

// Patient search and management
const allPatients = ref([]);
const patientSearchQuery = ref("");
const patientSearchResults = ref([]);
const selectedPatient = ref(null);
const isSearchLoading = ref(false);

// Patient list filtering
const patientListSearchQuery = ref("");

// Computed property for filtered patients
const filteredPatients = computed(() => {
    if (!doctor.value?.patients) return [];
    if (!patientListSearchQuery.value.trim()) return doctor.value.patients;

    const query = patientListSearchQuery.value.toLowerCase();
    return doctor.value.patients.filter(patient => {
        // Search by patient name (if available)
        const nameMatch = patientNames.value[patient.patient_id]?.toLowerCase().includes(query);
        // Search by diagnosis
        const diagnosisMatch = patient.diagnosis?.toLowerCase().includes(query);
        // Search by visit date
        const visitMatch = patient.last_visit?.toLowerCase().includes(query);

        return nameMatch || diagnosisMatch || visitMatch;
    });
});

// Fetch doctor data
const fetchDoctor = async () => {
    try {
        isLoading.value = true;
        error.value = null;

        const response = await axios.get(`http://127.0.0.1:8000/doctors/get/${doctorId}`);
        doctor.value = response.data;

        // Fetch patient names
        if (doctor.value?.patients && doctor.value.patients.length > 0) {
            await fetchAllPatientNames();
        }
    } catch (err) {
        console.error("Error fetching doctor:", err);
        error.value = "ไม่สามารถโหลดข้อมูลแพทย์ได้ กรุณาลองใหม่อีกครั้ง";
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
    if (!doctor.value?.patients) return;
    for (const patient of doctor.value.patients) {
        await fetchPatientData(patient.patient_id);
    }
};

// Fetch all patients data
const fetchAllPatients = async () => {
    try {
        isSearchLoading.value = true;
        const response = await axios.get("http://127.0.0.1:8000/patients/");
        if (response.status === 200) {
            allPatients.value = response.data;
        } else {
            console.error("Error fetching patients data");
        }
    } catch (error) {
        console.error("Error fetching patients:", error);
    } finally {
        isSearchLoading.value = false;
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
    if (!doctor.value || !patientId) return;

    // Check if patient already exists
    const patientExists = doctor.value.patients.some(p => p.patient_id === patientId);
    if (patientExists) {
        alert("ผู้ป่วยนี้อยู่ในรายชื่อของแพทย์แล้ว");
        return;
    }

    try {
        // Make sure we have the doctor ID and it's not undefined
        const doctorId = doctor.value.id;
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
            await fetchDoctor();
            // Clear selection
            selectedPatient.value = null;
        } else {
            alert("เกิดข้อผิดพลาดในการเพิ่มผู้ป่วย: " + response.statusText);
        }
    } catch (error) {
        console.error("Error adding patient to doctor:", error);
        alert("เกิดข้อผิดพลาดในการเพิ่มผู้ป่วย: " + (error.response?.data?.detail || error.message));
    }
};

// Remove a patient from the doctor's patient list
const removePatientFromDoctor = async (patientId) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบผู้ป่วยนี้ออกจากรายชื่อ?")) return;

    try {
        const doctorId = doctor.value.id;
        if (!doctorId) {
            alert("ไม่พบรหัสแพทย์ กรุณาลองใหม่อีกครั้ง");
            return;
        }

        console.log(`Removing patient ${patientId} from doctor ${doctorId}`);

        // CORRECTED ENDPOINT
        const response = await axios.delete(`http://127.0.0.1:8000/doctors/${doctorId}/remove_patient/${patientId}`);

        if (response.status === 200) {
            alert("ลบผู้ป่วยออกจากรายชื่อเรียบร้อยแล้ว");
            await fetchDoctor();
        } else {
            alert("เกิดข้อผิดพลาดในการลบผู้ป่วย: " + response.statusText);
        }
    } catch (error) {
        console.error("Error removing patient:", error);
        alert("เกิดข้อผิดพลาดในการลบผู้ป่วย: " + (error.response?.data?.detail || error.message));
    }
};

// Watch for changes in search query
watch(patientSearchQuery, searchPatients);

// Run functions on component mount
onMounted(async () => {
    await fetchDoctor();
    await fetchAllPatients(); // Fetch all patients for search
});
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
