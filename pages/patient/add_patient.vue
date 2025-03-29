<template lang="html">
  <div class="page-container">
    <div class="content-wrapper">
      <h2 class="page-title">Add New Patient</h2>
      <form @submit.prevent="savePatient" class="patient-form">
        <div class="form-section">
          <h3>Basic Information</h3>
          <div class="form-group">
            <label>Name:</label>
            <input type="text" v-model="patient.name" required />
          </div>
          <div class="form-group">
            <label>Age:</label>
            <input type="number" v-model="patient.age" required />
          </div>
          <div class="form-group">
            <label>Gender:</label>
            <select v-model="patient.gender" required>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div class="form-section">
          <h3>Contact Information</h3>
          <div class="form-group">
            <label>Phone:</label>
            <input type="tel" v-model="patient.contact.phone" required />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="patient.contact.email" required />
          </div>
          <div class="form-group">
            <label>Address:</label>
            <textarea v-model="patient.contact.address" required></textarea>
          </div>
        </div>

        <div class="form-section">
          <h3>Medical History</h3>
          <div v-for="(history, index) in patient.medical_history" :key="index" class="medical-history-item">
            <div class="form-group">
              <label>Disease:</label>
              <input type="text" v-model="history.disease" required />
            </div>
            <div class="form-group">
              <label>Diagnosed Date:</label>
              <input type="date" v-model="history.diagnosed_date" required />
            </div>
            <div class="form-group">
              <label>Treatment:</label>
              <input type="text" v-model="history.treatment" required />
            </div>
            <button type="button" @click="removeMedicalHistory(index)" class="remove-btn">
              Remove
            </button>
          </div>
          <button type="button" @click="addMedicalHistory" class="add-btn">
            Add Medical History
          </button>
        </div>

        <div class="form-actions">
          <button type="submit" class="save-btn">Save Patient</button>
          <button type="button" @click="cancel" class="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

// Type definitions
interface Contact {
  phone: string;
  email: string;
  address: string;
}

interface MedicalHistory {
  disease: string;
  diagnosed_date: string;
  treatment: string;
}

interface Patient {
  name: string;
  age: number;
  gender: string;
  contact: Contact;
  medical_history: MedicalHistory[];
  appointments: any[];
  prescriptions: any[];
}

const router = useRouter();

// Initialize patient data using reactive
const patient = reactive<Patient>({
  name: '',
  age: 0,
  gender: '',
  contact: {
    phone: '',
    email: '',
    address: ''
  },
  medical_history: [],
  appointments: [],
  prescriptions: []
});

const addMedicalHistory = (): void => {
  patient.medical_history.push({
    disease: '',
    diagnosed_date: '',
    treatment: ''
  });
};

const removeMedicalHistory = (index: number): void => {
  patient.medical_history.splice(index, 1);
};

const validateForm = (): boolean => {
  // Basic validation
  if (!patient.name || !patient.age || !patient.gender) {
    alert('Please fill in all basic information fields');
    return false;
  }

  if (!patient.contact.phone || !patient.contact.email || !patient.contact.address) {
    alert('Please fill in all contact information fields');
    return false;
  }

  // Validate medical history if any exists
  if (patient.medical_history.length > 0) {
    const invalidHistory = patient.medical_history.some(
      history => !history.disease || !history.diagnosed_date || !history.treatment
    );

    if (invalidHistory) {
      alert('Please fill in all medical history fields');
      return false;
    }
  }

  return true;
};

const savePatient = async (): Promise<void> => {
  try {
    // Form validation
    if (!validateForm()) {
      return;
    }

    // Convert patient data for API
    const patientData = {
      name: patient.name,
      age: parseInt(patient.age.toString()),
      gender: patient.gender,
      contact: {
        phone: patient.contact.phone,
        email: patient.contact.email,
        address: patient.contact.address
      },
      medical_history: patient.medical_history.map(history => ({
        disease: history.disease,
        diagnosed_date: history.diagnosed_date,
        treatment: history.treatment
      })),
      appointments: [],
      prescriptions: []
    };

    // Convert fetch to axios
    const response = await axios.post('http://127.0.0.1:8000/patients/create/', patientData, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // Show success message
    alert('Patient added successfully');
    sessionStorage.setItem('needsRefresh', 'true');
    router.push('/admin');
  } catch (error: any) {
    console.error('Error saving patient:', error);
    const errorMessage = error.response?.data?.detail || 'Error saving patient data';
    alert(errorMessage);
  }
};

const cancel = (): void => {
  router.push('/admin');  // Return to dashboard
};
</script>

<style lang="css">
.page-container {
  padding: 2rem;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.content-wrapper {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-family: var(--font-primary);
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
  letter-spacing: -0.5px;
}

.patient-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 4px;
}

.form-section h3 {
  font-family: var(--font-primary);
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-family: var(--font-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
}

.form-group input,
.form-group select,
.form-group textarea {
  font-family: var(--font-secondary);
  font-size: 0.875rem;
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.medical-history-item {
  border: 1px solid #eee;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.save-btn,
.cancel-btn,
.add-btn,
.remove-btn {
  font-family: var(--font-secondary);
  font-weight: 500;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.add-btn {
  background-color: #2196F3;
  color: white;
  width: 100%;
}

.remove-btn {
  background-color: #f44336;
  color: white;
}

/* Remove these styles as they're modal-specific */
.modal-container,
.modal-content {
  display: none;
}
</style>
