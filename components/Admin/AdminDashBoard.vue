<template lang="html">
  <div>
    <!-- Search box -->
    <div class="search-container">
      <div class="search-box">

        <form class="max-w-md mx-auto">
          <label for="default-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="search" id="default-search" v-model="search_input"
              class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Mockups, Logos..." required />
            <button type="submit"
              class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
          </div>
        </form>

      </div>
    </div>

    <!-- Dashboard -->
    <div>
      <h2 class="text-Dashboard">Dashboard</h2>
    </div>

    <!-- Recent History -->
    <div class="space">
      <div class="history-dashboard">
        <!-- Recent History left - Patients -->
        <div class="left">
          <div class="button-add-delete">
            <h3 class="head-card">Patient</h3>
            <!-- icon add patient -->
            <div class="add-delete-right">
              <button v-on:click="addPatients">
                <img src="@/assets/Images/add.png" :height="imagesize" :width="imagesize" />
              </button>
              <!-- icon delete paitnet -->
              <button v-on:click="deletePatients">
                <img src="@/assets/Images/minus.png" :height="imagesize" :width="imagesize" />
              </button>
            </div>
          </div>
          <ul>
            <li v-for="patient in patients" :key="patient.id">
              <Card :name="patient.name" :id="patient.id" type="patient" @deleted="handleDeleted" />
            </li>
          </ul>
          <!-- Add pagination controls -->
          <div class="pagination">
            <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="pagination-btn">
              Previous
            </button>
            <span class="page-info">
              Page {{ currentPage }} of {{ totalPatientPages }}
            </span>
            <button :disabled="currentPage === totalPatientPages" @click="changePage(currentPage + 1)"
              class="pagination-btn">
              Next
            </button>
          </div>
        </div>

        <!-- Where you display patients -->
        <div v-for="patient in filteredPatients" :key="patient.id">
          <!-- patient display content -->
        </div>

        <!-- Recent History right - Medical Personnel -->
        <div class="right">
          <div class="button-add-delete">
            <h3 class="head-card">Medical Personnel</h3>
            <!-- icon add medical personnel -->
            <div class="add-delete-right">
              <button v-on:click="addMedicalPersonnel">
                <img src="@/assets/Images/add.png" :height="imagesize" :width="imagesize" />
              </button>
              <!-- icon delete medical personnel -->
              <button v-on:click="deleteMedicalPersonnel">
                <img src="@/assets/Images/minus.png" :height="imagesize" :width="imagesize" />
              </button>
            </div>
          </div>
          <ul>
            <li v-for="person in medicalPersonnel" :key="person.id">
              <Card :name="person.name" :id="person.id" type="doctor" @deleted="handleDeleted" />
            </li>
          </ul>
          <!-- New pagination controls for Medical Personnel -->
          <div class="pagination">
            <button :disabled="currentDoctorPage === 1" @click="changeDoctorPage(currentDoctorPage - 1)"
              class="pagination-btn">
              Previous
            </button>
            <span class="page-info">
              Page {{ currentDoctorPage }} of {{ totalDoctorPages }}
            </span>
            <button :disabled="currentDoctorPage === totalDoctorPages" @click="changeDoctorPage(currentDoctorPage + 1)"
              class="pagination-btn">
              Next
            </button>
          </div>
        </div>

        <!-- Where you display medical personnel -->
        <div v-for="person in filteredMedicalPersonnel" :key="person.id">
          <!-- medical personnel display content -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "../Card.vue";
import { useRouter } from "vue-router";
import axios from "axios";

class Patient {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}
class MedicalPersonnel {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

const imagesize = "40px";
export default {
  components: {
    Card,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      // Add this new property to store all patients
      allPatients: [],
      // Add this new property to store all medical personnel
      allMedicalPersonnel: [],
      // Keep existing properties
      patients: [],
      medicalPersonnel: [],
      input: "",
      imagesize,
      currentPage: 1,
      totalPatientPages: 10, // Changed from totalPages
      itemsPerPage: 10,
      // Doctor pagination
      currentDoctorPage: 1,
      totalDoctorPages: 10,
      itemsPerDoctorPage: 10,
      search_input: ""
    };
  },
  computed: {
    // First filter all patients by search term
    filteredPatients() {
      if (!this.search_input || !this.allPatients) return this.allPatients || [];

      return this.allPatients.filter(patient =>
        patient.name.toLowerCase().includes(this.search_input.toLowerCase())
      );
    },

    // Update the filteredMedicalPersonnel computed property
    filteredMedicalPersonnel() {
      if (!this.search_input || !this.allMedicalPersonnel) return this.allMedicalPersonnel || [];

      return this.allMedicalPersonnel.filter(person =>
        person.name.toLowerCase().includes(this.search_input.toLowerCase())
      );
    }
  },
  methods: {

    async fetchPatients() {
      try {
        // Fetch ALL patients at once
        const { data: allPatients } = await axios.get("http://127.0.0.1:8000/patients/");

        // Store all patients
        this.allPatients = allPatients.map(
          (patient) => new Patient(patient.id, patient.name)
        );

        // Update total pages based on all patients
        this.totalPatientPages = Math.ceil(this.filteredPatients.length / this.itemsPerPage);

        // Update current page patients
        this.updateCurrentPagePatients();
      } catch (error) {
        console.error("Error fetching patients:", error);
        this.allPatients = [];
        this.patients = [];
        this.totalPatientPages = 1;
      }
    },

    // Add this new method to update current page patients
    updateCurrentPagePatients() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.patients = this.filteredPatients.slice(startIndex, endIndex);
    },

    async changePage(newPage) {
      // Calculate max pages based on filtered results
      const maxPages = Math.ceil(this.filteredPatients.length / this.itemsPerPage) || 1;

      if (newPage >= 1 && newPage <= maxPages) {
        this.currentPage = newPage;
        this.updateCurrentPagePatients();
      }
    },


    async fetchMedicalPersonnel() {
      try {
        // Fetch ALL doctors at once
        const { data: allDoctors } = await axios.get("http://127.0.0.1:8000/doctors/");

        // Store all doctors
        this.allMedicalPersonnel = allDoctors.map(
          (doctor) => new MedicalPersonnel(doctor.id, doctor.name)
        );

        // Update total pages based on all doctors
        this.totalDoctorPages = Math.ceil(this.filteredMedicalPersonnel.length / this.itemsPerDoctorPage);

        // Update current page doctors
        this.updateCurrentPageMedicalPersonnel();
      } catch (error) {
        console.error("Error fetching medical personnel:", error);
        this.allMedicalPersonnel = [];
        this.medicalPersonnel = [];
        this.totalDoctorPages = 1;
      }
    },

    // Add this new method for updating current page medical personnel
    updateCurrentPageMedicalPersonnel() {
      const startIndex = (this.currentDoctorPage - 1) * this.itemsPerDoctorPage;
      const endIndex = startIndex + this.itemsPerDoctorPage;
      this.medicalPersonnel = this.filteredMedicalPersonnel.slice(startIndex, endIndex);
    },

    async changeDoctorPage(newPage) {
      // Calculate max pages based on filtered results
      const maxPages = Math.ceil(this.filteredMedicalPersonnel.length / this.itemsPerDoctorPage) || 1;

      if (newPage >= 1 && newPage <= maxPages) {
        this.currentDoctorPage = newPage;
        this.updateCurrentPageMedicalPersonnel();
      }
    },

    async addPatients() {
      this.router.push("/patient/add_patient");
    },
    async deletePatients() {
      this.router.push("/patient/delete_patient");
    },
    async addMedicalPersonnel() {
      this.router.push("/medical/add_medical");
    },
    async deleteMedicalPersonnel() {
      this.router.push("/medical/delete_medical");
    },
    handleDeleted({ id, type }) {
      if (type === "patient") {
        // Remove from allPatients array
        this.allPatients = this.allPatients.filter((patient) => patient.id !== id);
        // Recalculate totalPatientPages and update current page
        this.totalPatientPages = Math.ceil(this.filteredPatients.length / this.itemsPerPage) || 1;
        this.updateCurrentPagePatients();
      } else {
        // Remove from allMedicalPersonnel array
        this.allMedicalPersonnel = this.allMedicalPersonnel.filter((person) => person.id !== id);
        // Recalculate totalDoctorPages and update current page
        this.totalDoctorPages = Math.ceil(this.filteredMedicalPersonnel.length / this.itemsPerDoctorPage) || 1;
        this.updateCurrentPageMedicalPersonnel();
      }
    },
  },
  watch: {
    search_input() {
      // Reset to first page for patients
      this.currentPage = 1;
      this.totalPatientPages = Math.ceil(this.filteredPatients.length / this.itemsPerPage) || 1;
      this.updateCurrentPagePatients();

      // Reset to first page for medical personnel
      this.currentDoctorPage = 1;
      this.totalDoctorPages = Math.ceil(this.filteredMedicalPersonnel.length / this.itemsPerDoctorPage) || 1;
      this.updateCurrentPageMedicalPersonnel();
    }
  },
  mounted() {
    // Check if we need to refresh
    const needsRefresh = sessionStorage.getItem("needsRefresh");
    if (needsRefresh) {
      sessionStorage.removeItem("needsRefresh");
      window.location.reload();
    }
    this.fetchPatients();
    this.fetchMedicalPersonnel();
  },
};
</script>

<style lang="css">
.search-container
{
  margin: 2%;
  display: flex;
  flex-direction: column;
}

.search-box
{
  justify-content: center;
  flex: 1;
}

.text-Dashboard
{
  margin: 1% 5%;
  font-size: xx-large;
  font-weight: bold;
}

.history-dashboard
{
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
}

.history-dashboard .left,
.history-dashboard .right
{
  flex: 1;
  margin: 10px 2%;
}

.space
{
  padding: 2% 4%;
}

.head-card
{
  margin-top: 3%;
  margin-bottom: 5%;
  font-size: x-large;
  font-weight: bold;
}

.button-add-delete
{
  display: flex;
}

.add-delete-right
{
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.pagination
{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 20px;
}

.pagination-btn
{
  padding: 8px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-btn:disabled
{
  background-color: #93c5fd;
  cursor: not-allowed;
}

.pagination-btn:hover:not(:disabled)
{
  background-color: #1d4ed8;
}

.page-info
{
  font-size: 14px;
  color: #374151;
}
</style>