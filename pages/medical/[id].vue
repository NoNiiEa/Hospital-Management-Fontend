<template>
  <div class="medical-details">
    <h2>Medical Personnel Details</h2>
    <div v-if="doctor" class="details-container">
      <div class="detail-section">
        <h3>Basic Information</h3>
        <p><strong>Name:</strong> {{ doctor.name }}</p>
        <p><strong>Specialization:</strong> {{ doctor.specialization }}</p>
      </div>

      <div class="detail-section">
        <h3>Contact Information</h3>
        <p><strong>Phone:</strong> {{ doctor.contact?.phone }}</p>
        <p><strong>Email:</strong> {{ doctor.contact?.email }}</p>
        <p><strong>Address:</strong> {{ doctor.contact?.address }}</p>
      </div>

      <div class="detail-section">
        <h3>Patients</h3>
        <div v-if="doctor.patients?.length" class="patients-list">
          <Card v-for="patient in patientsWithDetails" :key="patient.patient_id" :id="patient.patient_id"
            :name="`${patient.name || 'Loading...'} - ${patient.diagnosis}`"
            :to="`/patient/${patient.patient_id}?from=${$route.params.id}`" type="patient"
            @deleted="handlePatientDeleted" />
        </div>
        <div v-else>No patients assigned</div>
      </div>
    </div>
    <div v-else>Loading...</div>

    <button @click="goBack" class="back-btn">Back to Dashboard</button>
  </div>
</template>

<script>
import Card from "~/components/Card.vue";

export default {
  components: {
    Card,
  },
  data() {
    return {
      doctor: null,
      error: null,
      patientsWithDetails: [],
    };
  },
  async mounted() {
    await this.fetchDoctorData();
    if (this.doctor?.patients) {
      await this.fetchPatientsDetails();
    }
  },
  methods: {
    async fetchDoctorData() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/doctors/get/${this.$route.params.id}`,
          {
            headers: {
              accept: "application/json",
            },
          }
        );

        if (response.ok) {
          this.doctor = await response.json();
        } else {
          this.error = `Failed to fetch doctor details (Status: ${response.status})`;
          console.error(this.error);
        }
      } catch (error) {
        this.error = `Error fetching doctor: ${error.message}`;
        console.error("Error:", error);
      }
    },
    async fetchPatientsDetails() {
      this.patientsWithDetails = await Promise.all(
        this.doctor.patients.map(async (patient) => {
          try {
            const response = await fetch(
              `http://127.0.0.1:8000/patients/get/${patient.patient_id}`,
              {
                headers: {
                  accept: "application/json",
                },
              }
            );
            if (response.ok) {
              const patientData = await response.json();
              return {
                ...patient,
                name: patientData.name,
              };
            }
            return patient;
          } catch (error) {
            console.error(
              `Error fetching patient ${patient.patient_id}:`,
              error
            );
            return patient;
          }
        })
      );
    },
    goBack() {
      this.$router.push("/admin");
    },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString();
    },
    handlePatientDeleted({ id }) {
      if (this.doctor && this.doctor.patients) {
        this.doctor.patients = this.doctor.patients.filter(
          (patient) => patient.patient_id !== id
        );
        this.patientsWithDetails = this.patientsWithDetails.filter(
          (patient) => patient.patient_id !== id
        );
      }
    },
  },
};
</script>

<style scoped>
.medical-details
{
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.detail-section
{
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
}

h2
{
  color: #2563eb;
  margin-bottom: 2rem;
}

h3
{
  color: #374151;
  margin-bottom: 1rem;
}

.patients-list
{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.patient-item
{
  padding: 1rem;
  background: #f8fafc;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.patient-item p
{
  margin: 0.5rem 0;
}

.back-btn
{
  margin-top: 2rem;
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.back-btn:hover
{
  background: #1d4ed8;
}

.error-message
{
  color: #dc2626;
  padding: 1rem;
  margin: 1rem 0;
  background: #fee2e2;
  border-radius: 4px;
}
</style>
