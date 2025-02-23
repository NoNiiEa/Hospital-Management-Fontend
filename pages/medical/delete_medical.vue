<template>
  <div class="delete-medical-container">
    <h2>Delete Medical Personnel</h2>
    <div class="delete-medical-form">
      <div class="form-group">
        <label>Medical Personnel ID:</label>
        <input type="text" v-model="medicalId" required />
      </div>
      <div class="confirmation-message">
        <p>Are you sure you want to delete this medical personnel?</p>
        <p>This action cannot be undone.</p>
      </div>
      <div class="button-group">
        <button @click="deleteMedical" class="delete-btn">Delete</button>
        <button @click="goBack" class="cancel-btn">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      medicalId: ''
    }
  },
  methods: {
    async deleteMedical() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/doctors/delete/${this.medicalId}`, {
          method: 'DELETE',
          headers: {
            'accept': 'application/json'
          }
        });

        if (response.ok) {
          alert('Medical personnel deleted successfully!')
          this.$router.push('/admin')
          // Add refresh after navigation
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          alert('Failed to delete medical personnel')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error deleting medical personnel')
      }
    },
    goBack() {
      this.$router.push('/admin')
    }
  }
}
</script>

<style scoped>
.delete-medical-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #dc2626;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
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
  font-size: 1rem;
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

.cancel-btn {
  background: #9ca3af;
  color: white;
}

.delete-btn:hover {
  background: #b91c1c;
}

.cancel-btn:hover {
  background: #6b7280;
}
</style>