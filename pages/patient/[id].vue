<template>
  <div class="detail-page">
    <div v-if="patient" class="detail-container">
      <div class="header-section">
        <h1>Patient Profile</h1>
        <button @click="goBack" class="back-button">
          ← Back to Dashboard
        </button>
      </div>

      <div class="info-grid">
        <div class="info-card basic-info">
          <h2>Basic Information</h2>
          <div class="info-content">
            <p><span>Name:</span> {{ patient.name }}</p>
            <p><span>Age:</span> {{ patient.age }}</p>
            <p><span>Gender:</span> {{ patient.gender }}</p>
          </div>
        </div>

        <div class="info-card contact">
          <h2>Contact Details</h2>
          <div class="info-content">
            <p><span>Phone:</span> {{ patient.contact?.phone }}</p>
            <p><span>Email:</span> {{ patient.contact?.email }}</p>
            <p><span>Address:</span> {{ patient.contact?.address }}</p>
          </div>
        </div>

        <div class="info-card medical-history">
          <h2>Medical History</h2>
          <div v-if="patient.medical_history?.length" class="history-list">
            <div v-for="(history, index) in patient.medical_history" :key="index" class="history-item">
              <h3>{{ history.disease }}</h3>
              <p><span>Diagnosed:</span> {{ formatDate(history.diagnosed_date) }}</p>
              <p><span>Treatment:</span> {{ history.treatment }}</p>
            </div>
          </div>
          <p v-else>No medical history recorded</p>
        </div>
      </div>
    </div>
    <div v-else class="loading">Loading patient data...</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      patient: null,
      // Add fromDoctor to track if we came from doctor's page
      fromDoctor: null
    };
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    goBack() {
      // Check if we have fromDoctor in the route query
      const doctorId = this.$route.query.from;
      this.$router.push(`/admin`);
    },
    async fetchPatientData() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/patients/get/${this.$route.params.id}`, {
          headers: { 'accept': 'application/json' }
        });
        if (response.ok) {
          this.patient = await response.json();
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    }
  },
  mounted() {
    this.fetchPatientData();
  }
};
</script>

<style scoped>
.detail-page
{
  min-height: 100vh;
  background: #f0f4f8;
  padding: 2rem;
}

.detail-container
{
  max-width: 1200px;
  margin: 0 auto;
}

.header-section
{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1
{
  color: #1a365d;
  font-size: 2.5rem;
  font-weight: 700;
}

.back-button
{
  background: #2b6cb0;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.back-button:hover
{
  background: #2c5282;
}

.info-grid
{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.info-card
{
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info-card h2
{
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.info-content p
{
  margin: 1rem 0;
  font-size: 1.1rem;
}

.info-content span
{
  color: #4a5568;
  font-weight: 600;
  margin-right: 0.5rem;
}

.history-list
{
  display: grid;
  gap: 1rem;
}

.history-item
{
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #4299e1;
}

.history-item h3
{
  color: #2b6cb0;
  margin-bottom: 0.5rem;
}

.loading
{
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #4a5568;
}
</style>
