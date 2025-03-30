<template>
    <div class="patient-personal-stats">
        <div class="personal-stats-container">
            <!-- Title Section -->
            <div class="stats-header">
                <h2 class="stats-title">{{ title }}</h2>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid">
                <!-- Appointments Count -->
                <div class="stat-card">
                    <div class="stat-icon appointment-icon">📅</div>
                    <div class="stat-data">
                        <span class="stat-value">{{ appointmentsCount }}</span>
                        <span class="stat-label">Total Appointments</span>
                    </div>
                </div>

                <!-- Upcoming Appointments -->
                <div class="stat-card">
                    <div class="stat-icon upcoming-icon">⏰</div>
                    <div class="stat-data">
                        <span class="stat-value">{{ upcomingAppointments }}</span>
                        <span class="stat-label">Upcoming Appointments</span>
                    </div>
                </div>

                <!-- Medical Conditions -->
                <div class="stat-card">
                    <div class="stat-icon condition-icon">🩺</div>
                    <div class="stat-data">
                        <span class="stat-value">{{ medicalConditionsCount }}</span>
                        <span class="stat-label">Medical Conditions</span>
                    </div>
                </div>

                <!-- Last Visit -->
                <div class="stat-card">
                    <div class="stat-icon visit-icon">🏥</div>
                    <div class="stat-data">
                        <span class="stat-value">{{ lastVisitFormatted }}</span>
                        <span class="stat-label">Last Visit</span>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div v-if="showActivity" class="recent-activity">
                <h3 class="section-title">Recent Activity</h3>
                <div class="activity-list">
                    <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
                        <div class="activity-icon">{{ activityIcons[activity.type] || '📝' }}</div>
                        <div class="activity-content">
                            <div class="activity-date">{{ formatDate(activity.date) }}</div>
                            <div class="activity-text">{{ activity.description }}</div>
                        </div>
                    </div>
                    <div v-if="recentActivities.length === 0" class="no-activity">
                        No recent activity found
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, onMounted, ref } from 'vue';

// Component props
const props = defineProps({
    title: {
        type: String,
        default: 'Patient Overview'
    },
    patientId: {
        type: String,
        required: true
    },
    showActivity: {
        type: Boolean,
        default: true
    }
});

// Reactive state
const patientData = ref(null);
const appointmentsCount = ref(0);
const upcomingAppointments = ref(0);
const medicalConditionsCount = ref(0);
const lastVisit = ref(null);
const recentActivities = ref([]);
const isLoading = ref(false);

// Activity icons mapping
const activityIcons = {
    appointment: '📅',
    prescription: '💊',
    diagnosis: '🩺',
    admission: '🏥',
    billing: '💰',
    discharge: '🚶‍♂️'
};

// Computed properties
const lastVisitFormatted = computed(() => {
    if (!lastVisit.value) return 'Not available';
    return formatDate(lastVisit.value);
});

// Format date helper
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
};

// Fetch patient data
const fetchPatientData = async () => {
    if (!props.patientId) return;

    isLoading.value = true;

    try {
        const response = await fetch(`http://127.0.0.1:8000/patients/get/${props.patientId}`);
        if (response.ok) {
            patientData.value = await response.json();
            calculateStats();
            generateActivityTimeline();
        } else {
            console.error('Failed to fetch patient data');
        }
    } catch (error) {
        console.error('Error fetching patient data:', error);
    } finally {
        isLoading.value = false;
    }
};

// Calculate statistics from patient data
const calculateStats = () => {
    if (!patientData.value) return;

    // Count appointments
    const appointments = patientData.value.appointments || [];
    appointmentsCount.value = appointments.length;

    // Count upcoming appointments (future dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    upcomingAppointments.value = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= today;
    }).length;

    // Count medical conditions
    medicalConditionsCount.value = (patientData.value.medical_history || []).length;

    // Find last visit date
    if (appointments.length > 0) {
        // Sort appointments by date (descending)
        const sortedAppointments = [...appointments].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        // Get the most recent appointment that has passed
        const pastAppointments = sortedAppointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate < today;
        });

        if (pastAppointments.length > 0) {
            lastVisit.value = pastAppointments[0].date;
        }
    }
};

// Generate activity timeline from patient data
const generateActivityTimeline = () => {
    if (!patientData.value) return;

    const activities = [];

    // Add appointments to activities
    (patientData.value.appointments || []).forEach(appointment => {
        activities.push({
            type: 'appointment',
            date: appointment.date,
            description: `Appointment scheduled (${appointment.status})`
        });
    });

    // Add prescriptions to activities
    (patientData.value.prescriptions || []).forEach(prescription => {
        activities.push({
            type: 'prescription',
            date: prescription.date,
            description: `Prescription issued with ${prescription.medications?.length || 0} medications`
        });
    });

    // Add medical history entries to activities
    (patientData.value.medical_history || []).forEach(history => {
        activities.push({
            type: 'diagnosis',
            date: history.diagnosed_date,
            description: `Diagnosed with ${history.disease}`
        });
    });

    // Add admissions to activities
    (patientData.value.admissions || []).forEach(admission => {
        activities.push({
            type: 'admission',
            date: admission.admission_date,
            description: `Hospital admission: ${admission.admission_reason || 'No reason specified'}`
        });

        if (admission.actual_discharge_date) {
            activities.push({
                type: 'discharge',
                date: admission.actual_discharge_date,
                description: 'Discharged from hospital'
            });
        }
    });

    // Add billing to activities
    (patientData.value.billings || []).forEach(billing => {
        activities.push({
            type: 'billing',
            date: billing.date,
            description: `Billing: $${billing.total_amount} (${billing.status})`
        });
    });

    // Sort activities by date (newest first)
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Get only the 5 most recent activities
    recentActivities.value = activities.slice(0, 5);
};

// Component lifecycle
onMounted(() => {
    fetchPatientData();
});
</script>

<style scoped>
.patient-personal-stats {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.personal-stats-container {
    background-color: #ffffff;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

.stats-header {
    margin-bottom: 1.5rem;
}

.stats-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.stat-card {
    display: flex;
    align-items: center;
    padding: 1.25rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    border-left: 4px solid #3b82f6;
    transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.stat-card:nth-child(1) {
    border-left-color: #3b82f6;
    /* blue */
}

.stat-card:nth-child(2) {
    border-left-color: #10b981;
    /* green */
}

.stat-card:nth-child(3) {
    border-left-color: #8b5cf6;
    /* purple */
}

.stat-card:nth-child(4) {
    border-left-color: #f59e0b;
    /* amber */
}

.stat-icon {
    font-size: 2rem;
    margin-right: 1rem;
    opacity: 0.8;
}

.stat-data {
    flex: 1;
}

.stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    line-height: 1.2;
}

.stat-label {
    display: block;
    font-size: 0.875rem;
    color: #6b7280;
    white-space: nowrap;
}

.recent-activity {
    background-color: #f9fafb;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1.5rem;
}

.section-title {
    font-size: 1rem;
    font-weight: 600;
    color: #4b5563;
    margin-top: 0;
    margin-bottom: 1rem;
}

.activity-list {
    max-height: 320px;
    overflow-y: auto;
}

.activity-item {
    display: flex;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e5e7eb;
}

.activity-item:last-child {
    border-bottom: none;
}

.activity-icon {
    font-size: 1.5rem;
    margin-right: 0.75rem;
    opacity: 0.8;
}

.activity-content {
    flex: 1;
}

.activity-date {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
}

.activity-text {
    font-size: 0.875rem;
    color: #1f2937;
}

.no-activity {
    text-align: center;
    color: #6b7280;
    font-style: italic;
    padding: 1rem 0;
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>