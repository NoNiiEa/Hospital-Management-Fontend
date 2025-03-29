<template>
    <div>
        <div class="flex justify-center text-center mt-40">
            <p>ขอไอดีหมอหน่อยครับหรือจะไปหน้า admin</p>
        </div>
        <div class="mt-4">
            <form class="max-w-md mx-auto">
                <label for="default-search"
                    class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input v-model="doctorId" type="search" id="default-search"
                        class="block w-full p-4 ps-10 text-sm text-black-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 white:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-green dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="ขอไอดีหมอหน่อยครับ" required />
                </div>
            </form>
        </div>
        <div class="flex justify-center space-x-10 mt-4">
            <button @click="goToAdmin" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Admin
            </button>
            <button @click="goToDoctor"
                class="p-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Doctor
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCookie, useRouter } from '#app';
import { ref } from 'vue';
import { useApi } from '~/composables/useApi';

// Type definitions
interface CachedDoctor {
    id: string;
    timestamp: number;
}

interface Doctor {
    id: string;
    name: string;
    // Add other fields as needed
}

// Composables
const router = useRouter();
const api = useApi();

// State
const doctorId = ref<string>("");

// Cache management
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds
const recentDoctors = useCookie<CachedDoctor[]>('recent-doctors', {
    default: () => [],
    maxAge: CACHE_EXPIRY / 1000 // Convert to seconds for cookie
});

// Methods
const goToAdmin = (): void => {
    router.push('/Admin');
};

const goToDoctor = async (): Promise<void> => {
    if (!doctorId.value) return;

    try {
        // Validate doctor existence using our api composable
        await api.get<Doctor>(`/doctors/get/${doctorId.value}`);

        // Add to cache only if it doesn't exist already
        const currentDoctors = recentDoctors.value || [];
        const existingIndex = currentDoctors.findIndex(doc => doc.id === doctorId.value);

        if (existingIndex !== -1) {
            // Update timestamp if doctor already in cache
            currentDoctors[existingIndex].timestamp = Date.now();
        } else {
            // Add new entry
            currentDoctors.push({
                id: doctorId.value,
                timestamp: Date.now()
            });
        }

        // Limit to most recent 5 doctors and update cookie
        recentDoctors.value = currentDoctors
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 5);

        // Navigate to doctor's page
        router.push(`/doctor/${doctorId.value}`);
    } catch (error) {
        console.error('Error validating doctor ID:', error);
        alert('ไม่พบข้อมูลหมอตาม ID ที่ระบุ กรุณาตรวจสอบอีกครั้ง');
    }
};
</script>
