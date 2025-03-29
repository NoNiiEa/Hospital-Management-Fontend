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
              <div class="status-row">
                <p :class="appointment.status === 'Pending' ? 'status-pending' : 'status-confirmed'">
                  {{ appointment.status }}
                </p>
                <button @click="toggleAppointmentStatus(appointment)" class="status-toggle-button">
                  {{ appointment.status === 'Pending' ? 'Confirm' : 'Set Pending' }}
                </button>
              </div>
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
          <label>Doctor ID:</label>
          <input type="text" v-model="newAppointment.doctor_id" placeholder="{{doctor_id}} || 'Enter doctor ID'" />
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
          <button @click="showMedicalHistoryForm = true" class="add-button">+ Add</button>
        </div>
        <div class="history-list">
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

      <!-- Admissions Card -->
      <div class="info-card">
        <div class="title-row">
          <h2>🏥 Admissions</h2>
          <button @click="showAdmissionForm = true" class="add-button">+ Add</button>
        </div>
        <div class="admission-list">
          <div v-if="admissions.length">
            <div v-for="(admission, index) in admissions" :key="index" class="history-item">
              <br>
              <h3>🛏️ {{ admission.admission_reason || 'No reason specified' }}</h3>
              <p><span>📅 Admitted:</span> {{ formatDateSafe(admission.admission_date) }}</p>
              <p><span>📆 Expected Discharge:</span> {{ formatDateSafe(admission.expected_discharge_date) }}</p>
              <p v-if="admission.actual_discharge_date">
                <span>🗓️ Actual Discharge:</span> {{ formatDateSafe(admission.actual_discharge_date) }}
              </p>
              <p><span>👨‍⚕️ Doctor ID:</span> {{ admission.doctor_id || 'Not assigned' }}</p>
              <p><span>🏬 Department:</span> {{ admission.department || 'Not specified' }}</p>
              <p><span>🏠 Ward:</span> {{ admission.ward || 'N/A' }} - Bed: {{ admission.bed_number || 'N/A' }}</p>
              <p><span>📊 Status:</span> {{ admission.status || 'Unknown' }}</p>

              <div v-if="admission.treatment_plan && admission.treatment_plan.length">
                <h4>Treatment Plan:</h4>
                <div v-for="(treatment, tIndex) in admission.treatment_plan" :key="tIndex" class="treatment-item">
                  <p>{{ treatment.procedure || 'Unnamed procedure' }} - {{ treatment.status || 'No status' }}
                    ({{ formatDateSafe(treatment.scheduled_date) }})</p>
                </div>
              </div>
              <br>
              <hr>
            </div>
          </div>
          <p v-else class="no-data">No admissions available</p>
        </div>
      </div>

      <!-- Billing Card -->
      <div class="info-card">
        <div class="title-row">
          <h2>💰 Billing</h2>
          <div class="button-group">
            <button @click="showBillingForm = true" class="add-button">+ Add</button>
            <button @click="goToBillingPage" class="view-button">View All</button>
          </div>
        </div>
        <div class="billing-list">
          <div v-if="billings.length">
            <div v-for="(billing, index) in billings" :key="index" class="billing-item">
              <div class="billing-header">
                <h3>🧾 Bill #{{ billing.id.slice(-5) }}</h3>
                <span :class="getBillingStatusClass(billing.status)">{{ billing.status }}</span>
              </div>
              <p><strong>Amount:</strong> ${{ billing.total_amount }}</p>
              <p><strong>Payment Method:</strong> {{ billing.payment_method || 'Not specified' }}</p>
              <p><strong>Appointment ID:</strong> {{ billing.appointment_id }}</p>
            </div>
          </div>
          <p v-else class="no-data">No billing records found</p>
        </div>
      </div>
    </div>

    <!-- Medical History Form Modal -->
    <div v-if="showMedicalHistoryForm" class="modal">
      <div class="modal-content">
        <h2>Add Medical History</h2>
        <label>Disease:</label>
        <input type="text" v-model="newMedicalHistory.disease" placeholder="Enter disease/condition" />
        <label>Diagnosed Date:</label>
        <input type="date" v-model="newMedicalHistory.diagnosed_date" />
        <label>Treatment:</label>
        <textarea v-model="newMedicalHistory.treatment" placeholder="Enter treatment details"></textarea>
        <div class="modal-buttons">
          <button @click="addMedicalHistory" class="save-button">Save</button>
          <button @click="showMedicalHistoryForm = false" class="cancel-button">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Admission Form Modal -->
    <div v-if="showAdmissionForm" class="modal">
      <div class="modal-content">
        <h2>Add Admission</h2>
        <label>Admission Date:</label>
        <input type="date" v-model="newAdmission.admission_date" />
        <label>Expected Discharge Date:</label>
        <input type="date" v-model="newAdmission.expected_discharge_date" />
        <label>Doctor ID:</label>
        <input type="text" v-model="newAdmission.doctor_id" readonly class="readonly-field" />
        <label>Department:</label>
        <input type="text" v-model="newAdmission.department" />
        <label>Admission Reason:</label>
        <textarea v-model="newAdmission.admission_reason"></textarea>
        <label>Ward:</label>
        <input type="text" v-model="newAdmission.ward" />
        <label>Bed Number:</label>
        <input type="text" v-model="newAdmission.bed_number" />
        <div class="modal-buttons">
          <button @click="addAdmission" class="save-button">Save</button>
          <button @click="showAdmissionForm = false" class="cancel-button">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Billing Form Modal -->
    <div v-if="showBillingForm" class="modal">
      <div class="modal-content">
        <h2>Add Billing</h2>
        <label>Appointment ID (optional):</label>
        <input type="text" v-model="newBilling.appointment_id" placeholder="Enter appointment ID" />
        <label>Total Amount ($):</label>
        <input type="number" v-model.number="newBilling.total_amount" min="0" step="0.01" />
        <label>Status:</label>
        <select v-model="newBilling.status">
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refunded">Refunded</option>
        </select>
        <label>Payment Method:</label>
        <select v-model="newBilling.payment_method">
          <option value="Credit Card">Credit Card</option>
          <option value="Cash">Cash</option>
          <option value="Insurance">Insurance</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Other">Other</option>
        </select>
        <div class="modal-buttons">
          <button @click="addBilling" class="save-button">Save</button>
          <button @click="showBillingForm = false" class="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Access route and router instances
const route = useRoute();
const router = useRouter();

// Reactive state
const patient = ref(null);
const doctor_id = ref(route.query.from);
const fromDoctor = ref(null);
const appointments = ref([]);
const prescriptions = ref([]);
const medicationHistory = ref([]);
const showAppointmentForm = ref(false);
const showPrescriptionForm = ref(false);
const showMedicalHistory = ref(false);
const showMedicalHistoryForm = ref(false);
const showAdmissionForm = ref(false);
const admissions = ref([]);
const billings = ref([]);
const showBillingForm = ref(false);

// More complex state with reactive()
const newMedicalHistory = reactive({
  disease: '',
  diagnosed_date: '',
  treatment: ''
});

// Helper function to find the most relevant doctor for a patient
const findPatientDoctor = () => {
  // Case 1: doctor_id from route query (came from doctor's page)
  if (route.query.from) {
    return route.query.from;
  }

  // Case 2: Check patient's appointments for most recent doctor
  if (patient.value && patient.value.appointments && appointments.value.length > 0) {
    // Sort appointments by date descending
    const sortedAppointments = [...appointments.value].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );

    // Use the doctor from the most recent appointment
    if (sortedAppointments[0] && sortedAppointments[0].doctor_id) {
      return sortedAppointments[0].doctor_id;
    }
  }

  // Case 3: Check prescriptions for a doctor reference
  if (prescriptions.value && prescriptions.value.length > 0) {
    const sortedPrescriptions = [...prescriptions.value].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );

    if (sortedPrescriptions[0] && sortedPrescriptions[0].doctor_id) {
      return sortedPrescriptions[0].doctor_id;
    }
  }

  // Default: return the route query doctor or empty string
  return route.query.from || '';
};

const newAdmission = reactive({
  patient_id: route.params.id,
  admission_date: '',
  expected_discharge_date: '',
  actual_discharge_date: null,
  doctor_id: '', // Will be set when the form is opened
  department: '',
  admission_reason: '',
  ward: '',
  bed_number: '',
  status: 'Admitted',
  treatment_plan: [],
  medications: []
});

// Methods (converted to regular functions)
const formatDateSafe = (dateStr) => {
  if (!dateStr) return 'No date specified';

  // Try parsing the date
  const date = new Date(dateStr);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    // If the format is YYYY-MM-DD, manually parse it
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      // Note: month is 0-based in JavaScript Date
      return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Invalid date';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDate = (date) => {
  if (!date) return 'No date specified';

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const goBack = () => {
  // Check if we have fromDoctor in the route query
  const doctorId = route.query.from;

  if (doctor_id.value) {
    router.push(`/doctor/${doctor_id.value}`);
  } else {
    // Fallback to admin page if no doctor_id
    router.push('/admin');
  }
};

const fetchPatientData = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/patients/get/${route.params.id}`);
    if (response.ok) {
      patient.value = await response.json();
    }
  } catch (error) {
    console.error("Error fetching patient data:", error);
  }
};

const fetchAppointments = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/appointments/");
    const allAppointments = await response.json();
    appointments.value = allAppointments.filter(appointment => appointment.patient_id === route.params.id);
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }
};

const fetchPrescriptions = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/prescriptions/");
    prescriptions.value = await response.json();
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
  }
};

const fetchMedicationHistory = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/medication-history/");
    medicationHistory.value = await response.json();
  } catch (error) {
    console.error("Error fetching medication history:", error);
  }
};

const fetchAdmissions = async () => {
  try {
    console.log("Fetching admissions for patient:", route.params.id);
    const response = await axios.get("http://127.0.0.1:8000/admissions/");
    console.log("Raw admissions data:", response.data);

    // Filter admissions for current patient
    admissions.value = response.data.filter(admission =>
      admission.patient_id === route.params.id
    );

    console.log("Filtered admissions:", admissions.value);
  } catch (error) {
    console.error("Error fetching admissions:", error);
  }
};

const addAppointment = async () => {
  try {
    const appointmentData = { ...newAppointment, patient_id: route.params.id };
    console.log("Adding appointment:", appointmentData);

    const response = await fetch("http://127.0.0.1:8000/appointments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointmentData)
    });

    if (response.ok) {
      const addedAppointment = await response.json();
      appointments.value.push(addedAppointment);
      showAppointmentForm.value = false;

      // Reset form fields
      newAppointment.date = '';
      newAppointment.time = '';
      newAppointment.status = 'Pending';
      newAppointment.remarks = '';

      alert("Appointment added successfully!");
    } else {
      const errorData = await response.json();
      alert(`Failed to add appointment: ${errorData.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error adding appointment:", error);
    alert("Error adding appointment");
  }
};

const openPrescriptionForm = () => {
  showPrescriptionForm.value = true;
  newPrescription.date = '';
  newPrescription.medications = [{ name: '', dosage: '', frequency: '', duration: '' }];
};

const addMedication = () => {
  newPrescription.medications.push({ name: '', dosage: '', frequency: '', duration: '' });
};

const removeMedication = (index) => {
  if (newPrescription.medications.length > 1) {
    newPrescription.medications.splice(index, 1);
  }
};

const submitPrescription = async () => {
  try {
    const prescriptionData = {
      patient_id: route.params.id,
      doctor_id: "67b3035e4aa1f361628ad2a3",
      date: newPrescription.date,
      medications: newPrescription.medications
    };

    console.log("Submitting prescription:", JSON.stringify(prescriptionData, null, 2));

    const response = await fetch("http://127.0.0.1:8000/prescriptions/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prescriptionData)
    });

    if (!response.ok) throw new Error("Failed to save prescription");

    const newPrescriptionData = await response.json();
    prescriptions.value.push(newPrescriptionData);
    showPrescriptionForm.value = false;
  } catch (error) {
    console.error("Error adding prescription:", error);
  }
};

const toggleMedicalHistory = () => {
  showMedicalHistory.value = !showMedicalHistory.value;
};

const addMedicalHistory = async () => {
  try {
    if (!newMedicalHistory.disease || !newMedicalHistory.diagnosed_date) {
      alert("Please fill in all required fields");
      return;
    }

    const historyItem = { ...newMedicalHistory };
    const patientId = route.params.id;

    // Using axios to update patient's medical history
    const response = await axios.put(
      `http://127.0.0.1:8000/patients/medicalhistory/${patientId}/`,
      historyItem
    );

    if (response.status === 200) {
      // Update local data structure
      if (!patient.value.medical_history) {
        patient.value.medical_history = [];
      }
      patient.value.medical_history.push(historyItem);

      // Reset form and close modal
      newMedicalHistory.disease = '';
      newMedicalHistory.diagnosed_date = '';
      newMedicalHistory.treatment = '';

      showMedicalHistoryForm.value = false;

      // Show success message
      alert("Medical history added successfully");

      // Refresh patient data
      await fetchPatientData();
    }
  } catch (error) {
    console.error("Error adding medical history:", error);
    alert("Failed to add medical history");
  }
};

const addAdmission = async () => {
  try {
    if (!newAdmission.admission_date || !newAdmission.admission_reason) {
      alert("Please fill in all required fields");
      return;
    }

    // Set patient ID from route
    newAdmission.patient_id = route.params.id;

    // Initialize empty arrays for treatment plan and medications if needed
    if (!newAdmission.treatment_plan) {
      newAdmission.treatment_plan = [];
    }
    if (!newAdmission.medications) {
      newAdmission.medications = [];
    }

    // Send the request to create a new admission
    const response = await axios.post(
      "http://127.0.0.1:8000/admissions/create",
      newAdmission
    );

    if (response.status === 201 || response.status === 200) {
      // Add the new admission to local array
      admissions.value.push(response.data);

      // Reset form and close modal
      Object.assign(newAdmission, {
        patient_id: route.params.id,
        admission_date: '',
        expected_discharge_date: '',
        actual_discharge_date: null,
        doctor_id: findPatientDoctor(), // Reset with the found doctor ID
        department: '',
        admission_reason: '',
        ward: '',
        bed_number: '',
        status: 'Admitted',
        treatment_plan: [],
        medications: []
      });

      showAdmissionForm.value = false;

      // Show success message
      alert("Admission added successfully");
    }
  } catch (error) {
    console.error("Error adding admission:", error);
    alert("Failed to add admission");
  }
};

const toggleAppointmentStatus = async (appointment) => {
  try {
    if (!appointment.id) {
      throw new Error('Appointment ID is missing');
    }

    const newStatus = appointment.status === 'Pending' ? 'Confirmed' : 'Pending';

    const response = await fetch(`http://127.0.0.1:8000/appointments/${appointment.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (response.ok) {
      // Update the local appointment status
      appointment.status = newStatus;
      // Show success message
      alert(`Appointment status updated to ${newStatus}`);
      // Refresh appointments list
      await fetchAppointments();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update status');
    }
  } catch (error) {
    console.error('Error updating appointment status:', error);
    alert('Failed to update appointment status: ' + error.message);
  }
};

const fetchBillings = async () => {
  try {
    console.log("Fetching billings for patient:", route.params.id);
    const response = await axios.get("http://127.0.0.1:8000/billings/");
    console.log("Raw billing data:", response.data);

    // Filter billings for current patient
    billings.value = response.data.filter(billing =>
      billing.patient_id === route.params.id
    );

    console.log("Filtered billings:", billings.value);
  } catch (error) {
    console.error("Error fetching billings:", error);
  }
};

const addBilling = async () => {
  try {
    if (!newBilling.total_amount) {
      alert("Please enter a valid amount");
      return;
    }

    // Set patient ID from route
    newBilling.patient_id = route.params.id;

    // If appointment ID is empty, set to N/A
    if (!newBilling.appointment_id.trim()) {
      newBilling.appointment_id = "N/A";
    }

    console.log("Adding billing:", newBilling);

    // Send the request to create a new billing
    const response = await axios.post(
      "http://127.0.0.1:8000/billings/create",
      newBilling
    );

    if (response.status === 201 || response.status === 200) {
      // Add the new billing to local array
      billings.value.push(response.data);

      // Reset form and close modal
      Object.assign(newBilling, {
        patient_id: '',
        appointment_id: '',
        total_amount: 0,
        status: 'Paid',
        payment_method: 'Credit Card'
      });

      showBillingForm.value = false;

      // Show success message
      alert("Billing added successfully");
    }
  } catch (error) {
    console.error("Error adding billing:", error);
    alert("Failed to add billing: " + (error.response?.data?.detail || "Unknown error"));
  }
};

const getBillingStatusClass = (status) => {
  switch (status) {
    case 'Paid': return 'status-confirmed';
    case 'Pending': return 'status-pending';
    case 'Overdue': return 'status-overdue';
    default: return '';
  }
};

const goToBillingPage = () => {
  router.push(`/billing/${route.params.id}`);
};

// Lifecycle hooks - mounted equivalent
onMounted(() => {
  fetchPatientData();
  fetchAppointments();
  fetchPrescriptions();
  fetchMedicationHistory();
  fetchAdmissions();
  fetchBillings();

  // Watch for showAdmissionForm changes to set the doctor_id when opened
  watch(showAdmissionForm, (newValue) => {
    if (newValue === true) {
      // When form is opened, populate the doctor_id
      newAdmission.doctor_id = findPatientDoctor();
    }
  });
});
</script>

<style scoped>
/* Page Background */
.detail-page
{
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  padding: 2rem;
  font-family: Arial, sans-serif;
}


/* Container */
.detail-container
{
  max-width: 1100px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
}


/* Header */
.header-section
{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-section h1
{
  font-size: 2.5rem;
  color: #1a365d;
}

.back-button
{
  background: #2b6cb0;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.back-button:hover
{
  background: #2c5282;
  transform: scale(1.05);
}


/* Grid Layout */
.info-grid
{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}


/* Resizable Cards */
.info-card
{
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

.info-card:hover
{
  transform: translateY(-5px);
}

.info-card h2
{
  margin-bottom: 1rem;

  font-size: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
  color: #2d3748;
}

/* Scrollable Content Inside Cards */
.info-content,
.list,
.history-list
{
  flex-grow: 1;
  /* Ensures it expands within the parent */
  overflow-y: auto;
  /* Enables scrolling */
  padding-right: 10px;
  /* Prevents text cutoff */
}

/* Title Row for Cards with Add Button */
.title-row
{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Add Button */
.add-button
{
  background: #38a169;
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.add-button:hover
{
  background: #2f855a;
}

/* List Items */
.list-item
{
  background: #ffffff;

  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #4299e1;
  margin-bottom: 0.8rem;
}


.history-item h3
{
  color: #2b6cb0;
  margin-bottom: 0.5rem;
}


.list-item p
{
  margin: 0.3rem 0;
}

/* No Data Message */
.no-data
{
  text-align: center;
  color: #a0aec0;
  font-style: italic;
  margin-top: 1rem;
}

/* Modal Styling */
.modal
{
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

.modal-content
{
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.modal-content h2
{
  margin-bottom: 1.5rem;
  color: #2d3748;
}

.modal-content label
{
  display: block;
  margin: 0.5rem 0 0.2rem;
  font-weight: bold;
  color: #4a5568;
}

.modal-content input,
.modal-content select,
.modal-content textarea
{
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.modal-buttons
{
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.save-button
{
  background: #3182ce;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-button
{
  background: #e53e3e;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
}

.save-button:hover
{
  background: #2b6cb0;
}

.cancel-button:hover
{
  background: #c53030;
}

.status-pending
{
  color: orange;
}

.status-confirmed
{
  color: green;
}

.status-row
{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem 0;
}

.status-toggle-button
{
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  border: none;
  background: #4a5568;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.status-toggle-button:hover
{
  background: #2d3748;
}

/* Additional styles for admission items */
.treatment-item
{
  margin-left: 1rem;
  padding: 0.5rem;
  border-left: 2px solid #4299e1;
}

/* Billing specific styles */
.billing-item
{
  background: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #805ad5;
  margin-bottom: 0.8rem;
}

.billing-header
{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.billing-header h3
{
  margin: 0;
  color: #4a5568;
}

.status-overdue
{
  color: red;
  font-weight: bold;
}

.button-group
{
  display: flex;
  gap: 0.5rem;
}

.view-button
{
  background: #4299e1;
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.view-button:hover
{
  background: #3182ce;
}

.readonly-field {
  background-color: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.8;
  border: 1px solid #cbd5e0;
}

/* Ensure axios is imported */
</style>
