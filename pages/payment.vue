<template>
    <div>
        <div class="p-8">
            <h1 class="text-2xl font-bold mb-4">Payment Page</h1>
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

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useApi } from '~/composables/useApi';

// Define interfaces for type safety
interface Patient {
    id: string;
    name: string;
    age: number;
    contact?: {
        phone?: string;
        email?: string;
        address?: string;
    };
}

interface Billing {
    patient_id: string;
    appointment_id: string;
    total_amount: number;
    status: string;
    payment_method: string;
}

// State variables
const searchQuery = ref<string>('');
const patients = ref<Patient[]>([]);
const selectedPatient = ref<Patient | null>(null);
const billing = ref<Billing | null>(null);

// Get the API composable
const api = useApi();

// Watch the searchQuery; fetch patients when value changes
watch(searchQuery, async (newVal) => {
    if (!newVal.trim()) {
        patients.value = [];
        return;
    }

    try {
        // Use the API composable with caching
        const data = await api.get<Patient[]>(`/patients/search?name=${newVal}`);
        patients.value = data;
    } catch (error) {
        console.error("Error fetching patients:", error);
        patients.value = [];
    }
});

// On selecting a patient, fetch billing details
async function selectPatient(patient: Patient) {
    selectedPatient.value = patient;

    try {
        // Use the API composable with caching
        const data = await api.get<Billing>(`/billing/by-patient/${patient.id}`);
        billing.value = data;
    } catch (error) {
        console.error("Error fetching billing info:", error);
        billing.value = null;
    }
}
</script>
