<template lang="html">
  <div class="delete-patient-container">
    <h2>Delete Patient</h2>
    <div class="delete-patient-form">
      <div class="form-group">
        <label>Patient ID:</label>
        <input type="text" v-model="patientId" required />
      </div>
      <div class="confirmation-message">
        <p>Are you sure you want to delete this patient?</p>
        <p>This action cannot be undone.</p>
      </div>
      <div class="button-group">
        <button @click="deletePatient" class="delete-btn">Delete Patient</button>
        <button @click="$router.push('/admin')" class="cancel-btn">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      patientId: ''
    }
  },
  methods: {
    async deletePatient() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/patients/delete/${this.patientId}`, {
          method: 'DELETE',
          headers: {
            'accept': 'application/json'
          }
        });

        if (response.ok) {
          alert('Patient deleted successfully!')
          this.$router.push('/admin')
          // Add refresh after navigation
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          alert('Failed to delete patient')
        }
      } catch (error) {
        console.error('Error deleting patient:', error)
        alert('Error deleting patient')
      }
    }
  }
}
</script>
<style scoped>
.delete-patient-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #dc2626;
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.confirmation-message {
  text-align: center;
  color: #dc2626;
  background: #fee2e2;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.delete-btn,
.cancel-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.delete-btn {
  background: #dc2626;
  color: white;
}

.delete-btn:hover {
  background: #b91c1c;
}

.cancel-btn {
  background: #9ca3af;
  color: white;
}

.cancel-btn:hover {
  background: #6b7280;
}
</style>
