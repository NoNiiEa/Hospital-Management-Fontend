<template>
    <div class="p-4 bg-gray-100 rounded-lg mt-4 text-sm">
        <h3 class="font-bold mb-2">API Debugging</h3>

        <div class="mb-4">
            <p class="font-semibold">Current Doctor:</p>
            <pre class="bg-white p-2 rounded overflow-auto max-h-40">{{ doctorInfo }}</pre>
        </div>

        <div class="mb-4">
            <p class="font-semibold">Test Adding Patient:</p>
            <div class="flex gap-2 mb-2">
                <input type="text" v-model="testPatientId" placeholder="Enter Patient ID" class="p-1 border rounded" />
                <button @click="testAddPatient" class="px-2 py-1 bg-blue-500 text-white rounded">
                    Test Add
                </button>
            </div>
            <pre v-if="lastTestResult" class="bg-white p-2 rounded overflow-auto max-h-40">{{ lastTestResult }}</pre>
        </div>

        <div>
            <p class="font-semibold">API Response:</p>
            <pre v-if="apiResponse" class="bg-white p-2 rounded overflow-auto max-h-40">{{ apiResponse }}</pre>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { computed, ref } from 'vue';

const props = defineProps({
    doctor: Object
});

const testPatientId = ref('');
const lastTestResult = ref('');
const apiResponse = ref('');

const doctorInfo = computed(() => {
    if (!props.doctor) return 'No doctor data';
    return JSON.stringify({
        id: props.doctor.id,
        name: props.doctor.name,
        patients: (props.doctor.patients || []).length
    }, null, 2);
});

const testAddPatient = async () => {
    if (!props.doctor?.id || !testPatientId.value) {
        lastTestResult.value = 'Error: Missing doctor ID or patient ID';
        return;
    }

    try {
        lastTestResult.value = `Sending request to add patient ${testPatientId.value} to doctor ${props.doctor.id}...`;

        const patientData = {
            diagnosis: "Test diagnosis",
            last_visit: new Date().toISOString().split('T')[0]
        };

        const response = await axios.put(
            `http://127.0.0.1:8000/doctors/${props.doctor.id}/add_patient/${testPatientId.value}`,
            patientData
        );

        apiResponse.value = JSON.stringify(response.data, null, 2);
        lastTestResult.value = `Success: ${response.status} ${response.statusText}`;
    } catch (error) {
        console.error('Test add patient error:', error);
        lastTestResult.value = `Error: ${error.message}`;
        if (error.response) {
            apiResponse.value = JSON.stringify({
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            }, null, 2);
        }
    }
};
</script>
