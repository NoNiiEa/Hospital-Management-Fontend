<template lang="html">
  <div>
    <!-- Dashboard header with search -->
    <div class="dashboard-header">
      <h1 class="text-Dashboard">Dashboard</h1>
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
                class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Name" required />
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Recent History -->
    <div class="space">
      <div class="history-dashboard">
        <!-- Recent History left - Patients -->
        <div class="left">
          <div class="button-add-delete">
            <h3 class="head-card">Patients</h3>
            <!-- icon add patient -->
            <div class="add-delete-right">
              <button v-on:click="addPatients" class="add-docter">
                Add
              </button>
              <!-- icon delete paitnet -->
              <button v-on:click="deletePatients" class="delete-docter">
                Delete
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
            <h3 class="head-card">Medical Personnels</h3>
            <!-- icon add medical personnel -->
            <div class="add-delete-right">
              <button v-on:click="addMedicalPersonnel" class="add-docter">
                Add
              </button>
              <!-- icon delete medical personnel -->
              <button v-on:click="deleteMedicalPersonnel" class="delete-docter">
                Delete
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
        <!-- a -->
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

/* Update existing styles */
.text-Dashboard {
  font-family: var(--font-primary);
  font-size: 2.5rem;
  font-weight: 600;
  color: #1a365d;
  letter-spacing: -0.5px;
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

/* Update existing styles */
.head-card {
  font-family: var(--font-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 3%;
  margin-bottom: 5%;
}

.button-add-delete
{
  display: flex;
}

.add-delete-right
{
  margin-left: auto;
  /* display: flex; */
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

/* Update existing styles */
.pagination-btn {
  font-family: var(--font-secondary);
  font-weight: 500;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 16px;
  background-color: #496d96;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); /* Shadow effect */
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.pagination-btn:hover {
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.4); /* Stronger shadow on hover */
    transform: translateY(-2px); /* Slight lift effect */
}

.pagination-btn:active {
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); /* Smaller shadow when clicked */
    transform: translateY(1px); /* Pressed effect */
}

.pagination-btn:disabled
{
  background-color: #d0e3f9;
  cursor: not-allowed;
}

/* Update existing styles */
.page-info {
  font-family: var(--font-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

.add-docter {
    font-family: var(--font-secondary);
    font-weight: 500;
    font-size: 0.875rem;
    letter-spacing: 0.5px;
    background-color: transparent; /* No background */
    color: 	#2E8B57; /* Green text */
    padding: 5px 20px;
    margin: 10px;
    font-size: 16px;
    font-weight: bold;
    border: 2px solid 	#2E8B57; /* Green border */
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

/* Hover Effect */
.add-docter:hover {
    background-color: 	#2E8B57; /* Fill background */
    color: white; /* White text */
}

/* Click (Active) Effect */
.add-docter:active {
    opacity: 0.7; /* Light fade effect */
}

.delete-docter {
    font-family: var(--font-secondary);
    font-weight: 500;
    font-size: 0.875rem;
    letter-spacing: 0.5px;
    background-color: transparent; /* No background */
    color: #D70040; /* Red text */
    padding: 5px 12px;
    font-size: 16px;
    font-weight: bold;
    border: 2px solid #D70040; /* Red border */
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

/* Hover Effect */
.delete-docter:hover {
    background-color: #D70040; /* Fill background */
    color: white; /* White text */
}

/* Click (Active) Effect */
.delete-docter:active {
    opacity: 0.7; /* Light fade effect */
}

/* Add these new styles at the end of your style section */
#default-search {
  font-family: var(--font-secondary);
  font-size: 0.875rem;
  transition: all 0.3s ease-in-out;
  transform-origin: center;
}

#default-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#default-search:focus {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  border-color: #3b82f6;
}

.search-container {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Add animation for the search icon */
.absolute svg {
  transition: all 0.3s ease;
}

#default-search:focus + .absolute svg,
#default-search:hover + .absolute svg {
  transform: scale(1.1);
  color: #3b82f6;
}

/* Add or modify these styles */
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2%;
  margin: 40px;
}

.text-Dashboard {
  margin: 0;  /* Remove existing margins */
  font-size: 40px;
  font-weight: bold;
  color: #1a365d;
}

.search-container {
  margin: 0;  /* Remove existing margins */
  flex: 1;
  max-width: 500px;
  margin-left: 200px;
}

</style>