<template>
  <div class="add-medical-container">
    <h2>Add New Medical Personnel</h2>
    <form @submit.prevent="submitForm" class="add-medical-form">
      <!-- Name -->
      <div class="form-group">
        <label>Name:</label>
        <input type="text" v-model="formData.name" required />
      </div>

      <!-- Specialization -->
      <div class="form-group">
        <label>Specialization:</label>
        <input type="text" v-model="formData.specialization" required />
      </div>

      <!-- Contact Information -->
      <div class="contact-section">
        <h3>Contact Information</h3>
        <div class="form-group">
          <label>Phone:</label>
          <input type="tel" v-model="formData.contact.phone" required />
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input type="email" v-model="formData.contact.email" required />
        </div>
        <div class="form-group">
          <label>Address:</label>
          <textarea v-model="formData.contact.address" required></textarea>
        </div>
      </div>

      <div class="button-group">
        <button type="submit" class="submit-btn">Add Medical Personnel</button>
        <button type="button" @click="goBack" class="cancel-btn">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        specialization: '',
        contact: {
          phone: '',
          email: '',
          address: ''
        },
        schedule: [],
        patients: []
      }
    }
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch('http://127.0.0.1:8000/doctors/create', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });

        if (response.ok) {
          alert('Medical personnel added successfully!')
          this.$router.push('/admin')
        } else {
          alert('Failed to add medical personnel')
        }
      } catch (error) {
        console.error('Error adding medical personnel:', error)
        alert('Error adding medical personnel')
      }
    },
    goBack() {
      this.$router.push('/admin')
    }
  }
}
</script>

<style scoped>
.add-medical-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  color: #2563eb;
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.contact-section {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-btn, .cancel-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.submit-btn {
  background: #2563eb;
  color: white;
  flex: 1;
}

.cancel-btn {
  background: #dc2626;
  color: white;
  flex: 1;
}

.submit-btn:hover {
  background: #1d4ed8;
}

.cancel-btn:hover {
  background: #b91c1c;
}
</style>