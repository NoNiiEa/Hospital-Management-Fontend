<template>
  <div class="detail-page">
    <div v-if="patient" class="detail-container">
      <div class="header-section">
        <h1>👤 Patient Profile</h1>
        <button @click="goBack" class="back-button">← Back to Dashboard</button>
      </div>

      <div class="info-grid">
        <!-- Basic & Contact Info -->
        <div class="info-card">
          <h2>📌 Basic & Contact Info</h2>
          <div class="info-content">
            <p><span>Name:</span> {{ patient.name }}</p>
            <p><span>Age:</span> {{ patient.age }}</p>
            <p><span>Gender:</span> {{ patient.gender }}</p>
            <hr />
            <p><span>Phone:</span> {{ patient.contact?.phone }}</p>
            <p><span>Email:</span> {{ patient.contact?.email }}</p>
            <p><span>Address:</span> {{ patient.contact?.address }}</p>
          </div>
        </div>

        <!-- Appointments -->
        <div class="info-card">
          <div class="title-row">
            <h2>📅 Appointments</h2>
            <button @click="showAppointmentForm = true" class="add-button">+ Add</button>
          </div>
          <div v-if="appointments.length" class="list">
            <div v-for="(appointment, index) in appointments" :key="index" class="list-item">
              <p><span>Date:</span> {{ formatDate(appointment.date) }}</p>
              <p><span>Time:</span> {{ appointment.time }}</p>
              <p :class="appointment.status === 'Pending' ? 'status-pending' : 'status-confirmed'">
                {{ appointment.status }}
              </p>
              <p><span>Remarks:</span> {{ appointment.remarks }}</p>
            </div>
          </div>
          <p v-else class="no-data">No appointments found</p>
        </div>

        <!-- Prescriptions -->
        <div class="info-card">
          <div class="title-row">
            <h2>💊 Prescriptions</h2>
            <button @click="openPrescriptionForm" class="add-button">+ Add</button>
          </div>
          <div v-if="prescriptions.length" class="list">
            <div v-for="(prescription, index) in prescriptions" :key="index" class="list-item">
              <p><strong>Date:</strong> {{ formatDate(prescription.date) }}</p>
              <div v-for="(med, medIndex) in prescription.medications" :key="medIndex" class="medication">
                <p><strong>Medication:</strong> {{ med.name }}</p>
                <p><strong>Dosage:</strong> {{ med.dosage }}</p>
                <p><strong>Frequency:</strong> {{ med.frequency }}</p>
                <p><strong>Duration:</strong> {{ med.duration }}</p>
              </div>
            </div>
          </div>
          <p v-else class="no-data">No prescriptions found</p>
        </div>
      </div>

      <!-- Appointment Form Modal -->
      <div v-if="showAppointmentForm" class="modal">
        <div class="modal-content">
          <h2>Add Appointment</h2>
          <!-- Doctor Name Input -->

          <label>Doctor ID:</label>
          <input type="text" v-model="newAppointment.doctor_id" placeholder="67b3035e4aa1f361628ad2a3" />
          <label>Date:</label>
          <input type="date" v-model="newAppointment.date" />
          <label>Time:</label>
          <input type="time" v-model="newAppointment.time" />
          <label>Status:</label>
          <select v-model="newAppointment.status">
            <option>Pending</option>
            <option>Confirmed</option>
          </select>
          <label>Remarks:</label>
          <textarea v-model="newAppointment.remarks"></textarea>
          <div class="modal-buttons">
            <button @click="addAppointment" class="save-button">Save</button>
            <button @click="showAppointmentForm = false" class="cancel-button">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Prescription Form Modal -->
      <div v-if="showPrescriptionForm" class="modal">
        <div class="modal-content">
          <h2>Add Prescription</h2>
          <label>Date:</label>
          <input type="date" v-model="newPrescription.date" />
          <div v-for="(med, index) in newPrescription.medications" :key="index">
            <label>Medication:</label>
            <input type="text" v-model="med.name" />
            <label>Dosage:</label>
            <input type="text" v-model="med.dosage" />
            <button @click="removeMedication(index)">Remove</button>
          </div>
          <button @click="addMedication">+ Add Medication</button>
          <div class="modal-buttons">
            <button @click="submitPrescription">Save</button>
            <button @click="showPrescriptionForm = false">Cancel</button>
          </div>
        </div>
      </div>
      <br>



      <!-- Medical History -->

      <div class="info-card">

        <div class="title-row">

          <h2>📜 Medical History</h2>

        </div>

        <!-- {{ patient }} -->

        <div class="history-list">

          <!-- <h1>hello</h1> -->

          <div v-if="patient.medical_history?.length">

            <div v-for="(history, index) in patient.medical_history" :key="index" class="history-item">

              <br>

              <h3>🩺 {{ history.disease }}</h3>

              <p><span>📅 Diagnosed:</span> {{ formatDate(history.diagnosed_date) }}</p>

              <p><span>💊 Treatment:</span> {{ history.treatment }}</p>

              <br>

              <hr>

            </div>

          </div>

          <p v-else class="no-data">No medical history available</p>

        </div>

      </div>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      patient: null,
      appointments: [],
      prescriptions: [],
      medicationHistory: [],
      showAppointmentForm: false,
      showPrescriptionForm: false,
      showMedicalHistory: false,
      newAppointment: { patient_id: this.$route.params.id, doctor_id: "67b3035e4aa1f361628ad2a3", date: '', time: '', status: 'Pending', remarkes: '' },
      newPrescription: {
        date: "",
        medications: [{ name: "", dosage: "", frequency: "", duration: "" }]
      }
    };
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    },
    goBack() {
      this.$router.push("/admin");
    },
    async fetchPatientData() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/patients/get/${this.$route.params.id}`);
        if (response.ok) {
          this.patient = await response.json();
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    },
    async fetchAppointments() {
      try {
        const response = await fetch("http://127.0.0.1:8000/appointments/");
        this.appointments = await response.json();
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    },
    async fetchPrescriptions() {
      try {
        const response = await fetch("http://127.0.0.1:8000/prescriptions/");
        this.prescriptions = await response.json();
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    },
    async fetchMedicationHistory() {
      try {
        const response = await fetch("http://127.0.0.1:8000/medication-history/");
        this.medicationHistory = await response.json();
      } catch (error) {
        console.error("Error fetching medication history:", error);
      }
    },
    async addAppointment() {
      try {
        const appointmentData = { ...this.newAppointment, patient_id: this.$route.params.id };
        console.log("Adding appointment:", appointmentData);

        const response = await fetch("http://127.0.0.1:8000/appointments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appointmentData)
        });

        if (response.ok) {
          const addedAppointment = await response.json();
          this.appointments.push(addedAppointment);
          this.showAppointmentForm = false;
          this.newAppointment = { date: "", time: "", status: "Pending", remarks: "" };
          alert("Appointment added successfully!");
        } else {
          const errorData = await response.json();
          alert(`Failed to add appointment: ${errorData.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error adding appointment:", error);
        alert("Error adding appointment");
      }
    },
    openPrescriptionForm() {
      this.showPrescriptionForm = true;
      this.newPrescription = {
        date: "",
        medications: [{ name: "", dosage: "", frequency: "", duration: "" }]
      };
    },
    addMedication() {
      this.newPrescription.medications.push({ name: "", dosage: "", frequency: "", duration: "" });
    },
    removeMedication(index) {
      if (this.newPrescription.medications.length > 1) {
        this.newPrescription.medications.splice(index, 1);
      }
    },
    async submitPrescription() {
      try {
        const prescriptionData = {
          patient_id: this.$route.params.id,
          doctor_id: "67b3035e4aa1f361628ad2a3",
          date: this.newPrescription.date,
          medications: this.newPrescription.medications
        };

        console.log("Submitting prescription:", JSON.stringify(prescriptionData, null, 2));

        const response = await fetch("http://127.0.0.1:8000/prescriptions/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prescriptionData)
        });

        if (!response.ok) throw new Error("Failed to save prescription");

        const newPrescription = await response.json();
        this.prescriptions.push(newPrescription);
        this.showPrescriptionForm = false;
      } catch (error) {
        console.error("Error adding prescription:", error);
      }
    },
    toggleMedicalHistory() {
      this.showMedicalHistory = !this.showMedicalHistory;
    }
  },
  mounted() {
    this.fetchPatientData();
    this.fetchAppointments();
    this.fetchPrescriptions();
    this.fetchMedicationHistory();
  }
};
</script>



<style scoped>
/* Page Background */
.detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  padding: 2rem;
  font-family: Arial, sans-serif;
}

/* Container */
.detail-container {
  max-width: 1100px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-section h1 {
  font-size: 2.5rem;
  color: #1a365d;
}

.back-button {
  background: #2b6cb0;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.back-button:hover {
  background: #2c5282;
  transform: scale(1.05);
}

/* Grid Layout */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

/* Resizable Cards */
.info-card {
  min-height: 250px;
  /* Minimum height */
  max-height: 600px;
  /* Prevents excessive growth */
  overflow: hidden;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
  resize: vertical;
  /* Allows vertical resizing */
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-card h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
  color: #2d3748;
}

/* Scrollable Content Inside Cards */
.info-content,
.list,
.history-list {
  flex-grow: 1;
  /* Ensures it expands within the parent */
  overflow-y: auto;
  /* Enables scrolling */
  padding-right: 10px;
  /* Prevents text cutoff */
}

/* Title Row for Cards with Add Button */
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Add Button */
.add-button {
  background: #38a169;
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.add-button:hover {
  background: #2f855a;
}

/* List Items */
.list-item {
  background: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #4299e1;
  margin-bottom: 0.8rem;
}

.list-item p {
  margin: 0.3rem 0;
}

/* No Data Message */
.no-data {
  text-align: center;
  color: #a0aec0;
  font-style: italic;
  margin-top: 1rem;
}

/* Modal Styling */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  color: #2d3748;
}

.modal-content label {
  display: block;
  margin: 0.5rem 0 0.2rem;
  font-weight: bold;
  color: #4a5568;
}

.modal-content input,
.modal-content select,
.modal-content textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.save-button {
  background: #3182ce;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-button {
  background: #e53e3e;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
}

.save-button:hover {
  background: #2b6cb0;
}

.cancel-button:hover {
  background: #c53030;
}

.status-pending {
  color: orange;
}

.status-confirmed {
  color: green;
}
</style>
