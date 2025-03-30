<template>
  <div class="p-4">
    <!-- Dashboard header with search -->
    <div class="flex items-center justify-between px-2 my-10">
      <h1 class="text-4xl font-bold text-blue-900">Dashboard</h1>
      <div class="flex-1 max-w-md ml-50">
        <form class="mx-auto">
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="search" id="default-search" v-model="searchInput"
              class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-transform hover:translate-y-[-2px] hover:shadow-md focus:translate-y-[-2px] focus:shadow-lg"
              placeholder="Search Name, Role or Shift" required />
          </div>
        </form>
      </div>
    </div>

    <!-- Main content area -->
    <div class="px-[4%] py-[2%]">
      <div class="flex justify-between bg-white rounded-lg">
        <!-- Patients section -->
        <div class="flex-1 mx-[2%] my-[10px]">
          <div class="flex">
            <h3 class="text-2xl font-semibold text-blue-900 mt-[3%] mb-[5%]">Patients</h3>
            <!-- Add/Delete Buttons -->
            <div class="ml-auto gap-2.5">
              <button @click="addPatients"
                class="px-5 py-1.5 mx-2.5 my-2.5 text-sm font-bold text-green-700 border-2 border-green-700 rounded-md hover:bg-green-700 hover:text-white transition-all">
                Add
              </button>
              <button @click="deletePatients"
                class="px-3 py-1.5 text-sm font-bold text-red-700 border-2 border-red-700 rounded-md hover:bg-red-700 hover:text-white transition-all">
                Delete
              </button>
            </div>
          </div>
          <ul>
            <li v-for="patient in patients" :key="patient.id">
              <Card :name="patient.name" :id="patient.id" type="patient" @deleted="handleDeleted" />
            </li>
          </ul>
          <!-- Pagination for Patients -->
          <div class="flex justify-center items-center mt-5 gap-5">
            <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)"
              class="px-4 py-2 text-sm font-medium text-white uppercase bg-blue-700 rounded-lg shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed hover:shadow-lg hover:translate-y-[-2px] active:shadow-sm active:translate-y-[1px] transition-all">
              Previous
            </button>
            <span class="text-sm font-medium">
              Page {{ currentPage }} of {{ totalPatientPages }}
            </span>
            <button :disabled="currentPage === totalPatientPages" @click="changePage(currentPage + 1)"
              class="px-4 py-2 text-sm font-medium text-white uppercase bg-blue-700 rounded-lg shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed hover:shadow-lg hover:translate-y-[-2px] active:shadow-sm active:translate-y-[1px] transition-all">
              Next
            </button>
          </div>
        </div>

        <!-- Medical Personnel section -->
        <div class="flex-1 mx-[2%] my-[10px]">
          <div class="flex">
            <h3 class="text-2xl font-semibold text-blue-900 mt-[3%] mb-[5%]">Medical Personnels</h3>
            <!-- Add/Delete Buttons -->
            <div class="ml-auto gap-2.5">
              <button @click="addMedicalPersonnel"
                class="px-5 py-1.5 mx-2.5 my-2.5 text-sm font-bold text-green-700 border-2 border-green-700 rounded-md hover:bg-green-700 hover:text-white transition-all">
                Add
              </button>
              <button @click="deleteMedicalPersonnel"
                class="px-3 py-1.5 text-sm font-bold text-red-700 border-2 border-red-700 rounded-md hover:bg-red-700 hover:text-white transition-all">
                Delete
              </button>
            </div>
          </div>
          <ul>
            <li v-for="person in medicalPersonnel" :key="person.id">
              <Card :name="person.name" :id="person.id" type="doctor" @deleted="handleDeleted" />
            </li>
          </ul>
          <!-- Pagination for Medical Personnel -->
          <div class="flex justify-center items-center mt-5 gap-5">
            <button :disabled="currentDoctorPage === 1" @click="changeDoctorPage(currentDoctorPage - 1)"
              class="px-4 py-2 text-sm font-medium text-white uppercase bg-blue-700 rounded-lg shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed hover:shadow-lg hover:translate-y-[-2px] active:shadow-sm active:translate-y-[1px] transition-all">
              Previous
            </button>
            <span class="text-sm font-medium">
              Page {{ currentDoctorPage }} of {{ totalDoctorPages }}
            </span>
            <button :disabled="currentDoctorPage === totalDoctorPages" @click="changeDoctorPage(currentDoctorPage + 1)"
              class="px-4 py-2 text-sm font-medium text-white uppercase bg-blue-700 rounded-lg shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed hover:shadow-lg hover:translate-y-[-2px] active:shadow-sm active:translate-y-[1px] transition-all">
              Next
            </button>
          </div>
        </div>

        <!-- Staff section -->
        <div class="flex-1 mx-[2%] my-[10px]">
          <div class="flex">
            <h3 class="text-2xl font-semibold text-blue-900 mt-[3%] mb-[5%]">Staff</h3>
            <!-- Add/Delete Buttons -->
            <div class="ml-auto gap-2.5">
              <button @click="addStaff"
                class="px-5 py-1.5 mx-2.5 my-2.5 text-sm font-bold text-green-700 border-2 border-green-700 rounded-md hover:bg-green-700 hover:text-white transition-all">
                Add
              </button>
              <button @click="deleteStaff"
                class="px-3 py-1.5 text-sm font-bold text-red-700 border-2 border-red-700 rounded-md hover:bg-red-700 hover:text-white transition-all">
                Delete
              </button>
            </div>
          </div>
          <ul>
            <li v-for="staff in staffMembers" :key="staff.id">
              <Card :name="staff.name" :id="staff.id" type="staff" @deleted="handleDeleted" />
            </li>
          </ul>
          <!-- Pagination for Staff -->
          <div class="flex justify-center items-center mt-5 gap-5">
            <button :disabled="currentStaffPage === 1" @click="changeStaffPage(currentStaffPage - 1)"
              class="px-4 py-2 text-sm font-medium text-white uppercase bg-blue-700 rounded-lg shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed hover:shadow-lg hover:translate-y-[-2px] active:shadow-sm active:translate-y-[1px] transition-all">
              Previous
            </button>
            <span class="text-sm font-medium">
              Page {{ currentStaffPage }} of {{ totalStaffPages }}
            </span>
            <button :disabled="currentStaffPage === totalStaffPages" @click="changeStaffPage(currentStaffPage + 1)"
              class="px-4 py-2 text-sm font-medium text-white uppercase bg-blue-700 rounded-lg shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed hover:shadow-lg hover:translate-y-[-2px] active:shadow-sm active:translate-y-[1px] transition-all">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { useRouter } from 'nuxt/app';
import { computed, onMounted, ref, watch } from 'vue';

// Setup router
const router = useRouter();

// Define model classes (converted to factory functions)
const createPatient = (id, name) => ({ id, name });
const createMedicalPersonnel = (id, name) => ({ id, name });
const createStaff = (id, name, role, contact, shift) => ({ id, name, role, contact, shift });

// State variables
const searchInput = ref('');
const allPatients = ref([]);
const allMedicalPersonnel = ref([]);
const allStaff = ref([]);
const patients = ref([]);
const medicalPersonnel = ref([]);
const staffMembers = ref([]);

// Pagination state
const currentPage = ref(1);
const totalPatientPages = ref(10);
const itemsPerPage = ref(10);

const currentDoctorPage = ref(1);
const totalDoctorPages = ref(10);
const itemsPerDoctorPage = ref(10);

const currentStaffPage = ref(1);
const totalStaffPages = ref(10);
const itemsPerStaffPage = ref(10);

// Computed properties
const filteredPatients = computed(() => {
  if (!searchInput.value || !allPatients.value) return allPatients.value || [];

  return allPatients.value.filter(patient =>
    patient.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );
});

const filteredMedicalPersonnel = computed(() => {
  if (!searchInput.value || !allMedicalPersonnel.value) return allMedicalPersonnel.value || [];

  return allMedicalPersonnel.value.filter(person =>
    person.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );
});

const filteredStaff = computed(() => {
  if (!searchInput.value || !allStaff.value) return allStaff.value || [];

  return allStaff.value.filter(staff =>
    staff.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    staff.shift.toLowerCase().includes(searchInput.value.toLowerCase())
  );
});

// Methods
const fetchPatients = async () => {
  try {
    const { data: patientData } = await axios.get("http://127.0.0.1:8000/patients/");
    allPatients.value = patientData.map(
      (patient) => createPatient(patient.id, patient.name)
    );
    totalPatientPages.value = Math.ceil(filteredPatients.value.length / itemsPerPage.value);
    updateCurrentPagePatients();
  } catch (error) {
    console.error("Error fetching patients:", error);
    allPatients.value = [];
    patients.value = [];
    totalPatientPages.value = 1;
  }
};

const updateCurrentPagePatients = () => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  patients.value = filteredPatients.value.slice(startIndex, endIndex);
};

const changePage = (newPage) => {
  const maxPages = Math.ceil(filteredPatients.value.length / itemsPerPage.value) || 1;
  if (newPage >= 1 && newPage <= maxPages) {
    currentPage.value = newPage;
    updateCurrentPagePatients();
  }
};

const fetchMedicalPersonnel = async () => {
  try {
    const { data: doctorData } = await axios.get("http://127.0.0.1:8000/doctors/");
    allMedicalPersonnel.value = doctorData.map(
      (doctor) => createMedicalPersonnel(doctor.id, doctor.name)
    );
    totalDoctorPages.value = Math.ceil(filteredMedicalPersonnel.value.length / itemsPerDoctorPage.value);
    updateCurrentPageMedicalPersonnel();
  } catch (error) {
    console.error("Error fetching medical personnel:", error);
    allMedicalPersonnel.value = [];
    medicalPersonnel.value = [];
    totalDoctorPages.value = 1;
  }
};

const updateCurrentPageMedicalPersonnel = () => {
  const startIndex = (currentDoctorPage.value - 1) * itemsPerDoctorPage.value;
  const endIndex = startIndex + itemsPerDoctorPage.value;
  medicalPersonnel.value = filteredMedicalPersonnel.value.slice(startIndex, endIndex);
};

const changeDoctorPage = (newPage) => {
  const maxPages = Math.ceil(filteredMedicalPersonnel.value.length / itemsPerDoctorPage.value) || 1;
  if (newPage >= 1 && newPage <= maxPages) {
    currentDoctorPage.value = newPage;
    updateCurrentPageMedicalPersonnel();
  }
};

const fetchStaff = async () => {
  try {
    const { data: staffData } = await axios.get("http://127.0.0.1:8000/staffs/");
    allStaff.value = staffData.map(
      (staff) => createStaff(staff.id, staff.name, staff.role, staff.contact, staff.shift)
    );
    totalStaffPages.value = Math.ceil(filteredStaff.value.length / itemsPerStaffPage.value);
    updateCurrentPageStaff();
  } catch (error) {
    console.error("Error fetching staff:", error);
    allStaff.value = [];
    staffMembers.value = [];
    totalStaffPages.value = 1;
  }
};

const updateCurrentPageStaff = () => {
  const startIndex = (currentStaffPage.value - 1) * itemsPerStaffPage.value;
  const endIndex = startIndex + itemsPerStaffPage.value;
  staffMembers.value = filteredStaff.value.slice(startIndex, endIndex);
};

const changeStaffPage = (newPage) => {
  const maxPages = Math.ceil(filteredStaff.value.length / itemsPerStaffPage.value) || 1;
  if (newPage >= 1 && newPage <= maxPages) {
    currentStaffPage.value = newPage;
    updateCurrentPageStaff();
  }
};

// Navigation methods
const addStaff = () => {
  router.push("/staff/add_staff");
};

const deleteStaff = () => {
  router.push("/staff/delete_staff");
};

const addPatients = () => {
  router.push("/patient/add_patient");
};

const deletePatients = () => {
  router.push("/patient/delete_patient");
};

const addMedicalPersonnel = () => {
  router.push("/medical/add_medical");
};

const deleteMedicalPersonnel = () => {
  router.push("/medical/delete_medical");
};

// Delete handler
const handleDeleted = ({ id, type }) => {
  if (type === "patient") {
    allPatients.value = allPatients.value.filter((patient) => patient.id !== id);
    totalPatientPages.value = Math.ceil(filteredPatients.value.length / itemsPerPage.value) || 1;
    updateCurrentPagePatients();
  } else if (type === "staff") {
    allStaff.value = allStaff.value.filter((staff) => staff.id !== id);
    totalStaffPages.value = Math.ceil(filteredStaff.value.length / itemsPerStaffPage.value) || 1;
    updateCurrentPageStaff();
  } else {
    allMedicalPersonnel.value = allMedicalPersonnel.value.filter((person) => person.id !== id);
    totalDoctorPages.value = Math.ceil(filteredMedicalPersonnel.value.length / itemsPerDoctorPage.value) || 1;
    updateCurrentPageMedicalPersonnel();
  }
};

// Watch handlers
watch(searchInput, () => {
  // Reset to first page for patients
  currentPage.value = 1;
  totalPatientPages.value = Math.ceil(filteredPatients.value.length / itemsPerPage.value) || 1;
  updateCurrentPagePatients();

  // Reset to first page for medical personnel
  currentDoctorPage.value = 1;
  totalDoctorPages.value = Math.ceil(filteredMedicalPersonnel.value.length / itemsPerDoctorPage.value) || 1;
  updateCurrentPageMedicalPersonnel();

  // Reset to first page for staff
  currentStaffPage.value = 1;
  totalStaffPages.value = Math.ceil(filteredStaff.value.length / itemsPerStaffPage.value) || 1;
  updateCurrentPageStaff();
});

// Lifecycle hooks
onMounted(() => {
  // Check if we need to refresh
  const needsRefresh = sessionStorage.getItem("needsRefresh");
  if (needsRefresh) {
    sessionStorage.removeItem("needsRefresh");
    window.location.reload();
  }

  // Fetch data
  fetchPatients();
  fetchMedicalPersonnel();
  fetchStaff();
});
</script>
