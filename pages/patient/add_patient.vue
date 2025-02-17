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
          <div v-for="(history, index) in patient.medical_history" 
               :key="index" 
               class="medical-history-item">
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

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      patient: {
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
      }
    };
  },
  methods: {
    addMedicalHistory() {
      this.patient.medical_history.push({
        disease: '',
        diagnosed_date: '',
        treatment: ''
      });
    },
    removeMedicalHistory(index) {
      this.patient.medical_history.splice(index, 1);
    },
    async savePatient() {
      try {
        // Form validation
        if (!this.validateForm()) {
          return;
        }

        const response = await fetch('http://127.0.0.1:8000/patients/create/', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.patient.name,
            age: parseInt(this.patient.age),
            gender: this.patient.gender,
            contact: {
              phone: this.patient.contact.phone,
              email: this.patient.contact.email,
              address: this.patient.contact.address
            },
            medical_history: this.patient.medical_history.map(history => ({
              disease: history.disease,
              diagnosed_date: history.diagnosed_date,
              treatment: history.treatment
            })),
            appointments: [],
            prescriptions: []
          })
        });

        if (response.ok) {
          // Show success message
          alert('Patient added successfully');
          this.router.push('/admin');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to save patient');
        }
      } catch (error) {
        console.error('Error saving patient:', error);
        alert(error.message || 'Error saving patient data');
      }
    },
    validateForm() {
      // Basic validation
      if (!this.patient.name || !this.patient.age || !this.patient.gender) {
        alert('Please fill in all basic information fields');
        return false;
      }

      if (!this.patient.contact.phone || !this.patient.contact.email || !this.patient.contact.address) {
        alert('Please fill in all contact information fields');
        return false;
      }

      // Validate medical history if any exists
      if (this.patient.medical_history.length > 0) {
        const invalidHistory = this.patient.medical_history.some(
          history => !history.disease || !history.diagnosed_date || !history.treatment
        );
        if (invalidHistory) {
          alert('Please fill in all medical history fields');
          return false;
        }
      }

      return true;
    },
    cancel() {
      this.router.push('/admin');  // Return to dashboard
    }
  }
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
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.8rem;
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

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
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