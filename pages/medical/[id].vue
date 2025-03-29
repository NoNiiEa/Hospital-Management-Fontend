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

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Card from "~/components/Card.vue";

// Define interfaces
interface Contact {
  phone: string;
  email: string;
  address: string;
}

interface PatientItem {
  patient_id: string;
  diagnosis: string;
  last_visit?: string;
  name?: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  contact: Contact;
  patients: PatientItem[];
}

interface PatientData {
  id: string;
  name: string;
  // Other properties can be added as needed
}

const route = useRoute();
const router = useRouter();
const doctor = ref<Doctor | null>(null);
const error = ref<string | null>(null);
const patientsWithDetails = ref<PatientItem[]>([]);

const fetchDoctorData = async (): Promise<void> => {
  try {
    const response = await axios.get<Doctor>(
      `http://127.0.0.1:8000/doctors/get/${route.params.id}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    doctor.value = response.data;
  } catch (err: any) {
    error.value = `Error fetching doctor: ${err.message}`;
    console.error("Error:", err);
  }
};

const fetchPatientsDetails = async (): Promise<void> => {
  if (!doctor.value?.patients) return;

  const patientsWithDetailsArray = await Promise.all(
    doctor.value.patients.map(async (patient) => {
      try {
        const response = await axios.get<PatientData>(
          `http://127.0.0.1:8000/patients/get/${patient.patient_id}`,
          {
            headers: {
              accept: "application/json",
            },
          }
        );
        return {
          ...patient,
          name: response.data.name,
        };
      } catch (err) {
        console.error(
          `Error fetching patient ${patient.patient_id}:`,
          err
        );
        return patient;
      }
    })
  );

  patientsWithDetails.value = patientsWithDetailsArray;
};

const goBack = (): void => {
  router.push("/admin");
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

const handlePatientDeleted = ({ id }: { id: string }): void => {
  if (doctor.value && doctor.value.patients) {
    doctor.value.patients = doctor.value.patients.filter(
      (patient) => patient.patient_id !== id
    );
    patientsWithDetails.value = patientsWithDetails.value.filter(
      (patient) => patient.patient_id !== id
    );
  }
};

onMounted(async () => {
  await fetchDoctorData();
  if (doctor.value?.patients) {
    await fetchPatientsDetails();
  }
});
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
