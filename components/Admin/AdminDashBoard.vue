<template>
  <div>
    <!-- Dashboard header with search -->
    <div class="flex items-center justify-between px-4 md:px-8 my-10">
      <h1 class="text-4xl font-bold text-blue-900">Dashboard</h1>
      <div class="flex-1 max-w-md ml-8 md:ml-20">
        <form class="mx-auto">
          <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="search" id="default-search" v-model="search_input"
              class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 hover:shadow-md hover:-translate-y-0.5 focus:shadow-lg focus:-translate-y-0.5 transition-all duration-300"
              placeholder="Search Name, Role or Shift" required />
          </div>
        </form>
      </div>
    </div>

    <!-- Content Area -->
    <div class="px-4 md:px-8 py-4">
      <div class="flex flex-col md:flex-row justify-between gap-6 bg-white rounded-lg">
        <!-- Patients Section -->
        <div class="flex-1 m-3">
          <div class="flex items-center mb-5">
            <h3 class="text-2xl font-semibold text-gray-800">Patients</h3>
            <div class="ml-auto flex gap-2">
              <button @click="addPatients"
                class="text-green-700 border-2 border-green-700 hover:bg-green-700 hover:text-white rounded-md px-5 py-1.5 text-sm font-medium transition-all duration-200">
                Add
              </button>
              <button @click="deletePatients"
                class="text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200">
                Delete
              </button>
            </div>
          </div>
          <ul>
            <li v-for="patient in patients" :key="patient.id">
              <Card :name="patient.name" :id="patient.id" type="patient" @deleted="handleDeleted" />
            </li>
          </ul>
          <!-- Pagination controls -->
          <div class="flex justify-center items-center mt-5 gap-5">
            <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)"
              class="uppercase text-sm font-medium px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 disabled:bg-blue-200 disabled:cursor-not-allowed">
              Previous
            </button>
            <span class="text-sm font-medium">
              Page {{ currentPage }} of {{ totalPatientPages }}
            </span>
            <button :disabled="currentPage === totalPatientPages" @click="changePage(currentPage + 1)"
              class="uppercase text-sm font-medium px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 disabled:bg-blue-200 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>

        <!-- Medical Personnel Section -->
        <div class="flex-1 m-3">
          <div class="flex items-center mb-5">
            <h3 class="text-2xl font-semibold text-gray-800">Medical Personnels</h3>
            <div class="ml-auto flex gap-2">
              <button @click="addMedicalPersonnel"
                class="text-green-700 border-2 border-green-700 hover:bg-green-700 hover:text-white rounded-md px-5 py-1.5 text-sm font-medium transition-all duration-200">
                Add
              </button>
              <button @click="deleteMedicalPersonnel"
                class="text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200">
                Delete
              </button>
            </div>
          </div>
          <ul>
            <li v-for="person in medicalPersonnel" :key="person.id">
              <Card :name="person.name" :id="person.id" type="doctor" @deleted="handleDeleted" />
            </li>
          </ul>
          <!-- Pagination controls -->
          <div class="flex justify-center items-center mt-5 gap-5">
            <button :disabled="currentDoctorPage === 1" @click="changeDoctorPage(currentDoctorPage - 1)"
              class="uppercase text-sm font-medium px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 disabled:bg-blue-200 disabled:cursor-not-allowed">
              Previous
            </button>
            <span class="text-sm font-medium">
              Page {{ currentDoctorPage }} of {{ totalDoctorPages }}
            </span>
            <button :disabled="currentDoctorPage === totalDoctorPages" @click="changeDoctorPage(currentDoctorPage + 1)"
              class="uppercase text-sm font-medium px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 disabled:bg-blue-200 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>

        <!-- Staff Section -->
        <div class="flex-1 m-3">
          <div class="flex items-center mb-5">
            <h3 class="text-2xl font-semibold text-gray-800">Staff</h3>
            <div class="ml-auto flex gap-2">
              <button @click="addStaff"
                class="text-green-700 border-2 border-green-700 hover:bg-green-700 hover:text-white rounded-md px-5 py-1.5 text-sm font-medium transition-all duration-200">
                Add
              </button>
              <button @click="deleteStaff"
                class="text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200">
                Delete
              </button>
            </div>
          </div>
          <ul>
            <li v-for="staff in staffMembers" :key="staff.id">
              <Card :name="staff.name" :id="staff.id" type="staff" @deleted="handleDeleted" />
            </li>
          </ul>
          <!-- Pagination controls -->
          <div class="flex justify-center items-center mt-5 gap-5">
            <button :disabled="currentStaffPage === 1" @click="changeStaffPage(currentStaffPage - 1)"
              class="uppercase text-sm font-medium px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 disabled:bg-blue-200 disabled:cursor-not-allowed">
              Previous
            </button>
            <span class="text-sm font-medium">
              Page {{ currentStaffPage }} of {{ totalStaffPages }}
            </span>
            <button :disabled="currentStaffPage === totalStaffPages" @click="changeStaffPage(currentStaffPage + 1)"
              class="uppercase text-sm font-medium px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 disabled:bg-blue-200 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '~/composables/useApi';
import Card from '../Card.vue';

// Interfaces instead of classes
interface Patient {
  id: number;
  name: string;
}

interface MedicalPersonnel {
  id: number;
  name: string;
}

interface Staff {
  id: number;
  name: string;
  role: string;
  contact: string;
  shift: string;
}

// Router
const router = useRouter();

// API service with caching
const api = useApi();

// State with TypeScript types
const allPatients = ref<Patient[]>([]);
const allMedicalPersonnel = ref<MedicalPersonnel[]>([]);
const allStaff = ref<Staff[]>([]);
const patients = ref<Patient[]>([]);
const medicalPersonnel = ref<MedicalPersonnel[]>([]);
const staffMembers = ref<Staff[]>([]);
const search_input = ref<string>('');

// Pagination
const currentPage = ref<number>(1);
const totalPatientPages = ref<number>(10);
const itemsPerPage = ref<number>(10);
const currentDoctorPage = ref<number>(1);
const totalDoctorPages = ref<number>(10);
const itemsPerDoctorPage = ref<number>(10);
const currentStaffPage = ref<number>(1);
const totalStaffPages = ref<number>(10);
const itemsPerStaffPage = ref<number>(10);

// Type for delete event
interface DeleteEvent {
  id: number;
  type: string;
}

// Computed properties
const filteredPatients = computed<Patient[]>(() => {
  if (!search_input.value || !allPatients.value) return allPatients.value || [];
  return allPatients.value.filter(patient =>
    patient.name.toLowerCase().includes(search_input.value.toLowerCase())
  );
});

const filteredMedicalPersonnel = computed<MedicalPersonnel[]>(() => {
  if (!search_input.value || !allMedicalPersonnel.value) return allMedicalPersonnel.value || [];
  return allMedicalPersonnel.value.filter(person =>
    person.name.toLowerCase().includes(search_input.value.toLowerCase())
  );
});

const filteredStaff = computed<Staff[]>(() => {
  if (!search_input.value || !allStaff.value) return allStaff.value || [];
  return allStaff.value.filter(staff =>
    staff.name.toLowerCase().includes(search_input.value.toLowerCase()) ||
    staff.role.toLowerCase().includes(search_input.value.toLowerCase()) ||
    staff.shift.toLowerCase().includes(search_input.value.toLowerCase())
  );
});

// Methods
const fetchPatients = async (): Promise<void> => {
  try {
    // Using api composable with caching
    const fetchedPatients = await api.get<any[]>("/patients/");
    allPatients.value = fetchedPatients.map(
      (patient): Patient => ({ id: patient.id, name: patient.name })
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

const updateCurrentPagePatients = (): void => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  patients.value = filteredPatients.value.slice(startIndex, endIndex);
};

const changePage = (newPage: number): void => {
  const maxPages = Math.ceil(filteredPatients.value.length / itemsPerPage.value) || 1;
  if (newPage >= 1 && newPage <= maxPages) {
    currentPage.value = newPage;
    updateCurrentPagePatients();
  }
};

const fetchMedicalPersonnel = async (): Promise<void> => {
  try {
    // Using api composable with caching
    const fetchedDoctors = await api.get<any[]>("/doctors/");
    allMedicalPersonnel.value = fetchedDoctors.map(
      (doctor): MedicalPersonnel => ({ id: doctor.id, name: doctor.name })
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

const updateCurrentPageMedicalPersonnel = (): void => {
  const startIndex = (currentDoctorPage.value - 1) * itemsPerDoctorPage.value;
  const endIndex = startIndex + itemsPerDoctorPage.value;
  medicalPersonnel.value = filteredMedicalPersonnel.value.slice(startIndex, endIndex);
};

const changeDoctorPage = (newPage: number): void => {
  const maxPages = Math.ceil(filteredMedicalPersonnel.value.length / itemsPerDoctorPage.value) || 1;
  if (newPage >= 1 && newPage <= maxPages) {
    currentDoctorPage.value = newPage;
    updateCurrentPageMedicalPersonnel();
  }
};

const fetchStaff = async (): Promise<void> => {
  try {
    // Using api composable with caching
    const fetchedStaff = await api.get<any[]>("/staffs/");
    allStaff.value = fetchedStaff.map(
      (staff): Staff => ({
        id: staff.id,
        name: staff.name,
        role: staff.role,
        contact: staff.contact,
        shift: staff.shift
      })
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

const updateCurrentPageStaff = (): void => {
  const startIndex = (currentStaffPage.value - 1) * itemsPerStaffPage.value;
  const endIndex = startIndex + itemsPerStaffPage.value;
  staffMembers.value = filteredStaff.value.slice(startIndex, endIndex);
};

const changeStaffPage = (newPage: number): void => {
  const maxPages = Math.ceil(filteredStaff.value.length / itemsPerStaffPage.value) || 1;
  if (newPage >= 1 && newPage <= maxPages) {
    currentStaffPage.value = newPage;
    updateCurrentPageStaff();
  }
};

const addStaff = (): void => {
  router.push("/staff/add_staff");
};

const deleteStaff = (): void => {
  router.push("/staff/delete_staff");
};

const addPatients = (): void => {
  router.push("/patient/add_patient");
};

const deletePatients = (): void => {
  router.push("/patient/delete_patient");
};

const addMedicalPersonnel = (): void => {
  router.push("/medical/add_medical");
};

const deleteMedicalPersonnel = (): void => {
  router.push("/medical/delete_medical");
};

const handleDeleted = ({ id, type }: DeleteEvent): void => {
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

// Watchers
watch(search_input, () => {
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
  fetchPatients();
  fetchMedicalPersonnel();
  fetchStaff();
});
</script>
