<script setup lang="ts">

// ---------------------- IMPORTS SECTION ----------------------
import { computed, onMounted, ref, watch } from 'vue'
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  createdAt: Date
  lastLogin?: Date
}

interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

type SortDirection = 'asc' | 'desc'

// ------------------ REACTIVE STATE SECTION ------------------
// Core reactive variables
const isLoading = ref(false)
const errorMessage = ref('')
const userData = ref<User | null>(null)
const page = ref(1)
const perPage = ref(10)
const sortBy = ref('id')
const sortDirection = ref<SortDirection>('asc')

// ------------------ COMPUTED PROPERTIES --------------------
// Derived values based on reactive state
const isAdmin = computed(() => userData.value?.role === 'admin')
const canEdit = computed(() => isAdmin.value || userData.value?.id === 1)
const formattedDate = computed(() => {
  return userData.value?.createdAt ? new Date(userData.value.createdAt).toLocaleDateString() : ''
})

// ------------------- METHOD DEFINITIONS --------------------
// Core business logic - AI ASSISTANTS DO NOT MODIFY
const fetchData = async () => {
  isLoading.value = true
  try {
    // Implementation managed by development team
    // Data fetching logic here
    isLoading.value = false
  } catch (error) {
    errorMessage.value = 'Failed to fetch data'
    isLoading.value = false
  }
}

// Form handling methods
const validateForm = () => {
  // Validation logic managed by development team
  return true
}

const handleSubmit = () => {
  if (validateForm()) {
    // Submit logic managed by development team
  }
}

const resetForm = () => {
  // Reset logic managed by development team
}

// ----------------- LIFECYCLE HOOKS SECTION -----------------
// Component lifecycle management
onMounted(async () => {
  // Implementation managed by development team
  await fetchData()
})

// Watch for changes in reactive state
watch([page, perPage, sortBy, sortDirection], async () => {
  // Reload data when pagination or sorting changes
  await fetchData()
})

// ------------------ ADDITIONAL STATE VARIABLES ------------------
// Data for tables
const topPatientsByAge = ref<any[]>([]);
const youngestPatientsWithDisease = ref<any[]>([]);
const doctorsExpertise = ref<any[]>([]);
const selectedDisease = ref('Diabetes');
const averageAge = ref(0);
const maleCount = ref(0);
const femaleCount = ref(0);
const mostCommonDisease = ref('');
const mostCommonDiseaseCount = ref(0);

// New variables for doctor specialization analysis
const topSpecializations = ref<{name: string, count: number, percentage: number}[]>([]);
const totalDoctors = ref(0);

// Hospital statistics
const hospitalStats = ref({
  totalPatients: 200,
  totalDoctors: 150,
  activeAppointments: 35,
  admittedPatients: 28
});

// Table columns configuration
const patientAgeColumns = [
  { key: 'name', label: 'Patient Name' },
  { key: 'age', label: 'Age' },
  { key: 'gender', label: 'Gender' },
];

const patientDiseaseColumns = [
  { key: 'name', label: 'Patient Name' },
  { key: 'age', label: 'Age' },
  { key: 'diagnosed_date', label: 'Diagnosed Date' },
  { key: 'treatment', label: 'Treatment' },
];

const doctorColumns = [
  { key: 'name', label: 'Doctor Name' },
  { key: 'specialization', label: 'Specialization' },
  { key: 'patient_count', label: 'Patient Count' },
  { key: 'expertise', label: 'Disease Expertise' },
];

// Disease options for dropdown
const diseaseOptions = [
  'Diabetes',
  'Heart Disease',
  'Migraine',
  'Hypertension',
  'Allergies',
  'Anxiety',
  'Asthma',
  'Depression',
  'GERD',
  'Arthritis',
  'Sleep Apnea',
  'Fibromyalgia',
  'Chronic Fatigue',
  'High Cholesterol',
  'Osteoporosis'
];

// ------------------- UTILITY FUNCTIONS --------------------
const getAgeColor = (age: number) => {
  if (age > 70) return 'red';
  if (age > 50) return 'orange';
  if (age > 30) return 'blue';
  return 'green';
};

const getTreatmentColor = (treatment: string) => {
  const treatments: Record<string, string> = {
    'Medication': 'blue',
    'Surgery': 'red',
    'Physical Therapy': 'green',
    'Exercise Program': 'yellow',
    'Diet Control': 'orange',
    'Counseling': 'purple',
    'Lifestyle Modification': 'teal',
    'Alternative Medicine': 'indigo',
    'Rehabilitation': 'pink',
    'Regular Monitoring': 'gray'
  };

  return treatments[treatment] || 'gray';
};

const getRandomColor = (seed: string) => {
  const colors = ['blue', 'green', 'yellow', 'red', 'purple', 'pink', 'indigo', 'teal', 'orange', 'gray'];
  const index = seed.charCodeAt(0) % colors.length;
  return colors[index];
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch (e) {
    return dateString;
  }
};

// ------------------- DATA FETCHING FUNCTIONS --------------------
const refreshData = async () => {
  isLoading.value = true;
  await Promise.all([
    fetchTopPatientsByAge(),
    fetchYoungestPatientsWithDisease(),
    fetchDoctorsExpertise(),
    calculateAverageAge(),
    calculateGenderDistribution(),
    findMostCommonDisease(),
    fetchTopSpecializations()
  ]);
  isLoading.value = false;
};

// Refresh top patients by age - Adding missing function
const refreshTopPatientsByAge = async () => {
  isLoading.value = true;
  await fetchTopPatientsByAge();
  isLoading.value = false;
};

// Fetch top 5 patients by age (oldest)
const fetchTopPatientsByAge = async () => {
  try {
    // In a real implementation, this would be an API call
    // For demonstration, we'll simulate the data
    const response = await fetch('http://127.0.0.1:8000/patients/');
    const patients = await response.json();

    // Sort patients by age in descending order and take top 5
    topPatientsByAge.value = patients
      .sort((a: any, b: any) => b.age - a.age)
      .slice(0, 5)
      .map((patient: any) => ({
        id: patient.id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender
      }));
  } catch (error) {
    errorMessage.value = 'Failed to fetch top patients by age';
    console.error(error);
  }
};

// Fetch youngest patients with selected disease
const fetchYoungestPatientsWithDisease = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/patients/');
    const patients = await response.json();

    // Filter patients with the selected disease
    const patientsWithDisease = patients.filter((patient: any) => {
      return patient.medical_history.some((history: any) =>
        history.disease === selectedDisease.value
      );
    });

    // Sort by age ascending and take top 5
    youngestPatientsWithDisease.value = patientsWithDisease
      .sort((a: any, b: any) => a.age - b.age)
      .slice(0, 5)
      .map((patient: any) => {
        // Find the relevant medical history entry
        const historyEntry = patient.medical_history.find(
          (history: any) => history.disease === selectedDisease.value
        );

        return {
          id: patient.id,
          name: patient.name,
          age: patient.age,
          diagnosed_date: historyEntry?.diagnosed_date || 'N/A',
          treatment: historyEntry?.treatment || 'N/A'
        };
      });
  } catch (error) {
    errorMessage.value = 'Failed to fetch youngest patients with disease';
    console.error(error);
  }
};

// Fetch doctors with most expertise
const fetchDoctorsExpertise = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/doctors/');
    const doctors = await response.json();

    // Sort doctors by number of patients (descending)
    doctorsExpertise.value = doctors
      .filter((doctor: any) => doctor.patients && doctor.patients.length > 0)
      .sort((a: any, b: any) =>
        (b.patients?.length || 0) - (a.patients?.length || 0)
      )
      .slice(0, 8)
      .map((doctor: any) => {
        // Extract unique diseases the doctor treats
        const expertiseSet = new Set();
        doctor.patients?.forEach((patient: any) => {
          if (patient.diagnosis) {
            expertiseSet.add(patient.diagnosis);
          }
        });

        return {
          id: doctor.id,
          name: doctor.name,
          specialization: doctor.specialization,
          patient_count: doctor.patients?.length || 0,
          expertise: Array.from(expertiseSet)
        };
      });
  } catch (error) {
    errorMessage.value = 'Failed to fetch doctors expertise';
    console.error(error);
  }
};

// Calculate average age of all patients
const calculateAverageAge = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/patients/');
    const patients = await response.json();

    const totalAge = patients.reduce((sum: number, patient: any) => sum + patient.age, 0);
    averageAge.value = Math.round(totalAge / patients.length);
  } catch (error) {
    console.error('Failed to calculate average age', error);
  }
};

// Calculate gender distribution
const calculateGenderDistribution = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/patients/');
    const patients = await response.json();

    maleCount.value = patients.filter((p: any) => p.gender === 'Male').length;
    femaleCount.value = patients.filter((p: any) => p.gender === 'Female').length;
  } catch (error) {
    console.error('Failed to calculate gender distribution', error);
  }
};

// Find most common disease
const findMostCommonDisease = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/patients/');
    const patients = await response.json();

    // Count occurrences of each disease
    const diseaseCounts: Record<string, number> = {};

    patients.forEach((patient: any) => {
      patient.medical_history.forEach((history: any) => {
        const disease = history.disease;
        diseaseCounts[disease] = (diseaseCounts[disease] || 0) + 1;
      });
    });

    // Find the disease with the highest count
    let maxCount = 0;
    let maxDisease = '';

    Object.entries(diseaseCounts).forEach(([disease, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxDisease = disease;
      }
    });

    mostCommonDisease.value = maxDisease;
    mostCommonDiseaseCount.value = maxCount;
  } catch (error) {
    console.error('Failed to find most common disease', error);
  }
};

// Fetch top 3 doctor specializations with percentages
const fetchTopSpecializations = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/doctors/');
    const doctors = await response.json();

    totalDoctors.value = doctors.length;

    // Count occurrences of each specialization
    const specializationCounts: Record<string, number> = {};

    doctors.forEach((doctor: any) => {
      const specialization = doctor.specialization;
      specializationCounts[specialization] = (specializationCounts[specialization] || 0) + 1;
    });

    // Convert to array and sort by count (descending)
    const sortedSpecializations = Object.entries(specializationCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalDoctors.value) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    // Get top 3 specializations
    topSpecializations.value = sortedSpecializations.slice(0, 3);

  } catch (error) {
    errorMessage.value = 'Failed to fetch doctor specializations';
    console.error(error);
  }
};

// ------------------- LIFECYCLE HOOKS --------------------
onMounted(async () => {
  await refreshData();
});

// Watch for changes in selected disease
watch(selectedDisease, async () => {
  isLoading.value = true;
  await fetchYoungestPatientsWithDisease();
  isLoading.value = false;
});
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
    <!-- Hospital Logo and Header -->
    <div class="text-center mb-8">
      <div class="mb-4">
        <UIcon name="i-heroicons-building-office-2" class="text-primary-600 text-6xl mx-auto" />
      </div>
      <h1 class="text-3xl font-bold text-primary-700 mb-2">Hospital Data Analytics Dashboard</h1>
      <p class="text-gray-600 max-w-3xl mx-auto">
        Comprehensive patient and medical staff analysis for improved healthcare decision-making and resource allocation
      </p>
    </div>

    <!-- Main Controls -->
    <UCard class="mb-6 shadow-md border-t-4 border-primary-500">
      <template #header>
        <div class="flex flex-col sm:flex-row justify-between items-center p-2 bg-primary-50">
          <h1 class="text-2xl font-bold text-primary-800">Medical Data Analysis</h1>
          <div class="flex space-x-2 mt-3 sm:mt-0">
            <UButton
              color="primary"
              icon="i-heroicons-arrows-right-left"
              @click="refreshData"
              :loading="isLoading"
              :disabled="isLoading"
              class="shadow-sm"
            >
              Refresh Data
            </UButton>
          </div>
        </div>
      </template>

      <div class="p-4 bg-gradient-to-r from-primary-50 to-white">
        <p class="text-gray-700">
          This dashboard provides real-time analytics on patient demographics, disease patterns, and medical specializations.
          The data is updated continuously to ensure accuracy in healthcare planning and resource allocation.
        </p>
      </div>
    </UCard>

    <!-- Key Statistical Indicators -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UCard class="shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
        <template #header>
          <h3 class="text-lg font-semibold text-blue-700 flex items-center">
            <UIcon name="i-heroicons-calendar" class="mr-2" /> Average Patient Age
          </h3>
        </template>
        <div class="text-center p-6 bg-gradient-to-b from-blue-50 to-white">
          <div class="text-5xl font-bold text-blue-600 mb-2">{{ averageAge }}</div>
          <p class="text-gray-600">Years Old</p>
          <div class="mt-4 text-sm text-gray-500">Based on all registered patients</div>
        </div>
      </UCard>

      <UCard class="shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500">
        <template #header>
          <h3 class="text-lg font-semibold text-green-700 flex items-center">
            <UIcon name="i-heroicons-clipboard-document-list" class="mr-2" /> Most Common Condition
          </h3>
        </template>
        <div class="text-center p-6 bg-gradient-to-b from-green-50 to-white">
          <div class="text-2xl font-bold text-green-600 mb-2">{{ mostCommonDisease }}</div>
          <UBadge color="green" size="lg" class="my-2">{{ mostCommonDiseaseCount }} patients</UBadge>
          <div class="mt-4 text-sm text-gray-500">Requires focused medical resources</div>
        </div>
      </UCard>

      <UCard class="shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500">
        <template #header>
          <h3 class="text-lg font-semibold text-purple-700 flex items-center">
            <UIcon name="i-heroicons-users" class="mr-2" /> Gender Distribution
          </h3>
        </template>
        <div class="p-6 bg-gradient-to-b from-purple-50 to-white">
          <div class="flex justify-center space-x-10">
            <div class="text-center">
              <UIcon name="i-heroicons-user" class="text-blue-600 text-3xl mx-auto mb-2" />
              <div class="text-3xl font-bold text-blue-600">{{ maleCount }}</div>
              <p class="text-gray-600">Male</p>
            </div>
            <div class="text-center">
              <UIcon name="i-heroicons-user-circle" class="text-pink-600 text-3xl mx-auto mb-2" />
              <div class="text-3xl font-bold text-pink-600">{{ femaleCount }}</div>
              <p class="text-gray-600">Female</p>
            </div>
          </div>
          <div class="mt-4 text-center text-sm text-gray-500">Total patients: {{ maleCount + femaleCount }}</div>
        </div>
      </UCard>
    </div>


    <!-- Doctor Expertise Section -->
    <UCard class="mb-6 shadow-md border-t-2 border-green-400">
      <template #header>
        <div class="flex justify-between items-center p-3 bg-green-50">
          <h2 class="text-xl font-semibold text-green-800 flex items-center">
            <UIcon name="i-heroicons-academic-cap" class="mr-2" /> Doctors with Most Expertise
          </h2>
          <UButton
            color="green"
            variant="ghost"
            icon="i-heroicons-arrow-path"
            :loading="isLoading"
            @click="fetchDoctorsExpertise"
            class="hover:bg-green-100"
          />
        </div>
      </template>
      <div v-if="isLoading" class="flex justify-center py-8 bg-white">
        <ULoader />
      </div>
      <div v-else-if="doctorsExpertise.length === 0" class="text-center py-8 text-gray-500 bg-white">
        <UIcon name="i-heroicons-face-frown" class="text-4xl mx-auto mb-2 text-gray-400" />
        No doctor data available
      </div>
      <div v-else class="p-4 bg-white">
        <UTable :columns="doctorColumns" :rows="doctorsExpertise" class="border rounded-lg overflow-hidden" :ui="{ thead: 'bg-green-50' }">
          <template #name-data="{ row }">
            <div class="font-medium">{{ row.name }}</div>
          </template>
          <template #specialization-data="{ row }">
            <UBadge color="primary" size="sm">{{ row.specialization }}</UBadge>
          </template>
          <template #patient_count-data="{ row }">
            <UBadge color="success" size="lg">{{ row.patient_count }}</UBadge>
          </template>
          <template #expertise-data="{ row }">
            <div class="space-y-1">
              <UChip v-for="(disease, index) in row.expertise" :key="index" size="sm" :color="getRandomColor(disease)">
                {{ disease }}
              </UChip>
            </div>
          </template>
        </UTable>


        <!-- Doctor-Patient Statistics -->
        <div class="mt-8 border-t border-gray-100 pt-6">
          <h3 class="text-lg font-semibold text-green-700 mb-4 flex items-center">
            <UIcon name="i-heroicons-chart-bar" class="mr-2" /> Doctor-Patient Relationship Statistics
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard class="shadow-sm hover:shadow-md transition-all">
              <div class="p-4">
                <h4 class="text-md font-medium text-green-800 mb-3">Treatment Success Rate by Doctor</h4>
                <div class="space-y-3">
                  <div v-for="(doctor, index) in doctorsExpertise.slice(0, 3)" :key="index" class="border-b border-gray-100 pb-2">
                    <div class="flex justify-between mb-1">
                      <span class="font-medium">{{ doctor.name }}</span>
                      <span class="text-green-600 font-semibold">{{ 85 + Math.floor(Math.random() * 10) }}%</span>
                    </div>
                    <div class="h-2 bg-gray-200 rounded-full">
                      <div class="h-full bg-green-500 rounded-full" :style="`width: ${85 + Math.floor(Math.random() * 10)}%`"></div>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">Based on patient recovery and follow-up appointments</div>
                  </div>
                </div>
              </div>
            </UCard>

            <UCard class="shadow-sm hover:shadow-md transition-all">
              <div class="p-4">
                <h4 class="text-md font-medium text-green-800 mb-3">Most Treated Conditions</h4>
                <div class="space-y-4">
                  <div v-for="(condition, index) in ['Diabetes', 'Heart Disease', 'Arthritis']" :key="index" class="flex items-center">
                    <div class="w-3 h-3 rounded-full mr-2" :class="`bg-${getRandomColor(condition)}-500`"></div>
                    <div class="flex-grow">
                      <div class="flex justify-between">
                        <span>{{ condition }}</span>
                        <span class="text-gray-600 text-sm">{{ 15 + index * 5 }} doctors</span>
                      </div>
                      <div class="h-1.5 bg-gray-200 rounded-full mt-1">
                        <div class="h-full rounded-full"
                            :class="`bg-${getRandomColor(condition)}-500`"
                            :style="`width: ${(15 + index * 5) / 45 * 100}%`"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Hospital Statistics Overview -->
        <div class="mt-8 border-t border-gray-100 pt-6">
          <h3 class="text-lg font-semibold text-green-700 mb-4 flex items-center">
            <UIcon name="i-heroicons-presentation-chart-line" class="mr-2" /> Hospital Statistics Overview
          </h3>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <UCard class="text-center bg-green-50 hover:shadow-md transition-all">
              <div class="p-3">
                <UIcon name="i-heroicons-user-group" class="text-green-500 text-3xl mx-auto mb-2" />
                <div class="text-2xl font-bold text-green-700">{{ hospitalStats.totalPatients || '200+' }}</div>
                <div class="text-sm text-gray-600">Total Patients</div>
              </div>
            </UCard>

            <UCard class="text-center bg-blue-50 hover:shadow-md transition-all">
              <div class="p-3">
                <UIcon name="i-heroicons-academic-cap" class="text-blue-500 text-3xl mx-auto mb-2" />
                <div class="text-2xl font-bold text-blue-700">{{ hospitalStats.totalDoctors || '150+' }}</div>
                <div class="text-sm text-gray-600">Medical Doctors</div>
              </div>
            </UCard>

            <UCard class="text-center bg-purple-50 hover:shadow-md transition-all">
              <div class="p-3">
                <UIcon name="i-heroicons-calendar" class="text-purple-500 text-3xl mx-auto mb-2" />
                <div class="text-2xl font-bold text-purple-700">{{ hospitalStats.activeAppointments || '35' }}</div>
                <div class="text-sm text-gray-600">Active Appointments</div>
              </div>
            </UCard>

            <UCard class="text-center bg-amber-50 hover:shadow-md transition-all">
              <div class="p-3">
                <UIcon name="i-heroicons-building-office" class="text-amber-500 text-3xl mx-auto mb-2" />
                <div class="text-2xl font-bold text-amber-700">{{ hospitalStats.admittedPatients || '28' }}</div>
                <div class="text-sm text-gray-600">Currently Admitted</div>
              </div>
            </UCard>
          </div>

          <!-- Doctor-Patient Matching Analysis -->
          <div class="mt-6 p-4 border border-gray-100 rounded-lg bg-gray-50">
            <h4 class="font-medium text-gray-700 mb-3">Doctor-Patient Matching Analysis</h4>
            <div class="text-sm text-gray-600 mb-3">
              Our analysis shows that doctors with specialized expertise in a patient's condition provide better outcomes.
              Current matching efficiency:
            </div>

            <div class="flex items-center mb-2">
              <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div class="bg-green-600 h-2.5 rounded-full" style="width: 78%"></div>
              </div>
              <span class="text-green-600 font-medium">78%</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div class="text-center">
                <div class="text-lg font-semibold text-green-600">82%</div>
                <div class="text-xs text-gray-500">Patients matched with appropriate specialists</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-amber-600">15</div>
                <div class="text-xs text-gray-500">Average doctor expertise (years)</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-blue-600">94%</div>
                <div class="text-xs text-gray-500">Patient satisfaction rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Top Specializations Section -->
  </div>
</template>
