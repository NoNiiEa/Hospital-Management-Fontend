<template>
    <div>
        <div class="p-8">
            <h1 class=" text-2xl font-bold mb-4">Payment Page</h1>
            <!-- Search Bar -->
            <input v-model="searchQuery" type="text" placeholder="Search patient by name..."
                class="border p-2 w-full mb-4" />
            <!-- Patient List -->
            <ul v-if="patients.length">
                <li v-for="patient in patients" :key="patient.id" @click="selectPatient(patient)"
                    class="p-2 border-b cursor-pointer hover:bg-gray-200">
                    {{ patient.name }} - Age: {{ patient.age }} - {{ patient.contact?.phone }}
                </li>
            </ul>

            <!-- Billing Details -->
            <div v-if="billing">
                <h2 class="text-xl font-bold mt-6">Billing Details for {{ selectedPatient.name }}</h2>
                <p><strong>Patient ID:</strong> {{ billing.patient_id }}</p>
                <p><strong>Appointment ID:</strong> {{ billing.appointment_id }}</p>
                <p><strong>Total Amount:</strong> ${{ billing.total_amount }}</p>
                <p><strong>Status:</strong> {{ billing.status }}</p>
                <p><strong>Payment Method:</strong> {{ billing.payment_method }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const searchQuery = ref('');
const patients = ref([]);
const selectedPatient = ref(null);
const billing = ref(null);

// Watch the searchQuery; fetch patients when value changes
watch(searchQuery, async (newVal) => {
    if (!newVal.trim()) {
        patients.value = [];
        return;
    }
    try {
        // Adjust the endpoint as needed
        const { data } = await axios.get(`http://127.0.0.1:8000/patients/search?name=${newVal}`);
        patients.value = data;
    } catch (error) {
        console.error("Error fetching patients:", error);
        patients.value = [];
    }
});

// On selecting a patient, fetch billing details
async function selectPatient(patient) {
    selectedPatient.value = patient;
    try {
        // Adjust the endpoint as needed
        const { data } = await axios.get(`http://127.0.0.1:8000/billing/by-patient/${patient.id}`);
        billing.value = data;
    } catch (error) {
        console.error("Error fetching billing info:", error);
        billing.value = null;
    }
}
</script>

<style scoped>
/* ...existing styles or custom styles... */
</style>
