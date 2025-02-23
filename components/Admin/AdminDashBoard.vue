<template lang="html">
  <div>
    <!-- Search box -->
    <div class="search-container">
      <div></div>
      <div class="search-box">
        <input type="text" v-model="input" placeholder="Search..." />
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
                <img
                  src="@/assets/Images/add.png"
                  :height="imagesize"
                  :width="imagesize"
                />
              </button>
              <!-- icon delete paitnet -->
              <button v-on:click="deletePatients">
                <img
                  src="@/assets/Images/minus.png"
                  :height="imagesize"
                  :width="imagesize"
                />
              </button>
            </div>
          </div>
          <ul>
            <li v-for="patient in patients" :key="patient.id">
              <Card
                :name="patient.name"
                :id="patient.id"
                type="patient"
                @deleted="handleDeleted"
              />
            </li>
          </ul>
          <!-- Add pagination controls -->
          <div class="pagination">
            <button
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
              class="pagination-btn"
            >
              Previous
            </button>
            <span class="page-info">
              Page {{ currentPage }} of {{ totalPatientPages }}
            </span>
            <button
              :disabled="currentPage === totalPatientPages"
              @click="changePage(currentPage + 1)"
              class="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>

        <!-- Recent History right - Medical Personnel -->
        <div class="right">
          <div class="button-add-delete">
            <h3 class="head-card">Medical Personnel</h3>
            <!-- icon add medical personnel -->
            <div class="add-delete-right">
              <button v-on:click="addMedicalPersonnel">
                <img
                  src="@/assets/Images/add.png"
                  :height="imagesize"
                  :width="imagesize"
                />
              </button>
              <!-- icon delete medical personnel -->
              <button v-on:click="deleteMedicalPersonnel">
                <img
                  src="@/assets/Images/minus.png"
                  :height="imagesize"
                  :width="imagesize"
                />
              </button>
            </div>
          </div>
          <ul>
            <li v-for="person in medicalPersonnel" :key="person.id">
              <Card
                :name="person.name"
                :id="person.id"
                type="doctor"
                @deleted="handleDeleted"
              />
            </li>
          </ul>
          <!-- New pagination controls for Medical Personnel -->
          <div class="pagination">
            <button
              :disabled="currentDoctorPage === 1"
              @click="changeDoctorPage(currentDoctorPage - 1)"
              class="pagination-btn"
            >
              Previous
            </button>
            <span class="page-info">
              Page {{ currentDoctorPage }} of {{ totalDoctorPages }}
            </span>
            <button
              :disabled="currentDoctorPage === totalDoctorPages"
              @click="changeDoctorPage(currentDoctorPage + 1)"
              class="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
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
    };
  },
  methods: {
    async fetchPatients() {
      try {
        // Fetch patients for current page
        const response = await fetch(
          `http://127.0.0.1:8000/patients/limit/${this.currentPage}/${this.itemsPerPage}`,
          {
            headers: {
              accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const patients = await response.json();
        this.patients = patients.map(
          (patient) => new Patient(patient.id, patient.name)
        );

        // Fetch total count of patients
        const totalResponse = await fetch("http://127.0.0.1:8000/patients/", {
          headers: {
            accept: "application/json",
          },
        });

        if (!totalResponse.ok) {
          throw new Error(`HTTP error! status: ${totalResponse.status}`);
        }

        const totalPatients = await totalResponse.json();
        this.totalPatientPages = Math.ceil(
          totalPatients.length / this.itemsPerPage
        );
      } catch (error) {
        console.error("Error fetching patients:", error);
        this.totalPatientPages = 1; // Reset to 1 if there's an error
      }
    },

    async changePage(newPage) {
      // Changed from totalPages to totalPatientPages
      if (newPage >= 1 && newPage <= this.totalPatientPages) {
        this.currentPage = newPage;
        await this.fetchPatients();
      }
    },

    async fetchMedicalPersonnel() {
      try {
        // Fetch doctors for current doctor page
        const response = await fetch(
          `http://127.0.0.1:8000/doctors/limit/${this.currentDoctorPage}/${this.itemsPerDoctorPage}`,
          {
            headers: {
              accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const doctors = await response.json();
        this.medicalPersonnel = doctors.map(
          (person) => new MedicalPersonnel(person.id, person.name)
        );

        // Fetch total count of doctors
        const totalDoctors = await fetch("http://127.0.0.1:8000/doctors/", {
          headers: {
            accept: "application/json",
          },
        });

        if (!totalDoctors.ok) {
          throw new Error(`HTTP error! status: ${totalDoctors.status}`);
        }

        const doctors_list = await totalDoctors.json();
        this.totalDoctorPages = Math.ceil(
          doctors_list.length / this.itemsPerDoctorPage
        );
      } catch (error) {
        console.error("Error fetching medical personnel:", error);
        this.totalDoctorPages = 1; // Reset to 1 if there's an error
      }
    },

    async changeDoctorPage(newPage) {
      if (newPage >= 1 && newPage <= this.totalDoctorPages) {
        this.currentDoctorPage = newPage;
        await this.fetchMedicalPersonnel();
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
        this.patients = this.patients.filter((patient) => patient.id !== id);
      } else {
        this.medicalPersonnel = this.medicalPersonnel.filter(
          (person) => person.id !== id
        );
      }
    },
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
.search-container {
  margin: 2%;
  display: flex;
  flex-direction: column;
}

.search-box {
  display: flex;
  justify-content: center;
  flex: 1;
}

.text-Dashboard {
  margin: 1% 5%;
  font-size: xx-large;
  font-weight: bold;
}

.history-dashboard {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
}

.history-dashboard .left,
.history-dashboard .right {
  flex: 1;
  margin: 10px 2%;
}

.space {
  padding: 2% 4%;
}

.head-card {
  margin-top: 3%;
  margin-bottom: 5%;
  font-size: x-large;
  font-weight: bold;
}

.button-add-delete {
  display: flex;
}

.add-delete-right {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 20px;
}

.pagination-btn {
  padding: 8px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.page-info {
  font-size: 14px;
  color: #374151;
}
</style>
