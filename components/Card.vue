<template>
  <div>
    <div @click="viewDetails"
      class="bg-white rounded-xl my-2 flex justify-between items-center p-2 cursor-pointer shadow transition-all duration-300 hover:scale-110 hover:shadow-md active:scale-95 active:shadow-sm">
      <div class="p-2">
        <div class="font-bold">
          {{ name }}
        </div>
        <!-- Add slot for details that will be used for staff -->
        <slot name="details"></slot>
      </div>
      <button @click.stop="confirmDelete"
        class="bg-red-600 text-white border-none py-1 px-3 text-center text-xs rounded hover:bg-red-500 hover:shadow-md hover:shadow-red-200 hover:scale-105 active:scale-97 transition-all duration-300">
        Delete
      </button>
    </div>
    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-5 rounded-lg text-center w-80">
        <p>{{ modalMessage }}</p>
        <div class="mt-4 flex justify-around">
          <button @click="cancelDelete"
            class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm transition-colors duration-200">
            Cancel
          </button>
          <button v-if="deleteWarningCount === 1" @click="confirmDelete"
            class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm transition-colors duration-200">
            OK
          </button>
          <button v-if="deleteWarningCount === 2" @click="handleDelete"
            class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm transition-colors duration-200">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '~/composables/useApi';

// Type definitions
type CardType = 'patient' | 'doctor' | 'staff';

interface DeletedEvent {
  id: number;
  type: CardType;
}

// Props
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  type: {
    type: String as () => CardType,
    required: true,
    validator: (value: string): boolean => ["patient", "doctor", "staff"].includes(value),
  },
});

// Emits
const emit = defineEmits<{
  (e: 'deleted', payload: DeletedEvent): void
}>();

// Router
const router = useRouter();

// API service with caching
const api = useApi();

// State
const deleteWarningCount = ref<number>(0);
const showModal = ref<boolean>(false);
const modalMessage = ref<string>("");
const isDeleting = ref<boolean>(false);

// Methods
const viewDetails = async (): Promise<void> => {
  // If we're currently in the delete process, don't navigate
  if (isDeleting.value) {
    return;
  }

  try {
    let endpoint: string;
    if (props.type === "patient") {
      endpoint = "patients";
    } else if (props.type === "doctor") {
      endpoint = "doctors";
    } else if (props.type === "staff") {
      endpoint = "staffs";
    } else {
      // This should never happen due to the validator, but TS requires us to handle all cases
      console.error("Invalid type:", props.type);
      return;
    }

    // Using API composable with caching
    await api.get(`/${endpoint}/get/${props.id}`);

    // Route to different pages based on type
    let route: string;
    if (props.type === "patient") {
      route = `/patient/${props.id}`;
    } else if (props.type === "doctor") {
      route = `/doctor/${props.id}`;
    } else if (props.type === "staff") {
      route = `/staff/${props.id}`;
    } else {
      return;
    }
    router.push(route);
  } catch (error) {
    console.error("Error fetching details:", error);
  }
};

const confirmDelete = (event?: Event): void => {
  // Prevent event bubbling to avoid triggering viewDetails
  if (event) {
    event.stopPropagation();
  }
  // Set the deleting flag
  isDeleting.value = true;
  deleteWarningCount.value++;
  if (deleteWarningCount.value === 1) {
    modalMessage.value = `Warning: Are you sure you want to delete ${props.type} "${props.name}"? Click OK to confirm.`;
  } else if (deleteWarningCount.value === 2) {
    modalMessage.value = `Final warning: This will permanently delete ${props.type} "${props.name}". Are you sure?`;
  }
  showModal.value = true;
};

const cancelDelete = (): void => {
  deleteWarningCount.value = 0;
  showModal.value = false;
  isDeleting.value = false; // Reset the deleting flag
};

const handleDelete = async (): Promise<void> => {
  try {
    let endpoint: string;
    if (props.type === "patient") {
      endpoint = "patients";
    } else if (props.type === "doctor") {
      endpoint = "doctors";
    } else if (props.type === "staff") {
      endpoint = "staffs";
    } else {
      console.error("Invalid type:", props.type);
      return;
    }

    // Using API composable
    await api.del(`/${endpoint}/delete/${props.id}`);

    // Emit the deleted event to update parent components
    emit("deleted", { id: props.id, type: props.type });

    // Clear any cached data related to this item
    api.clearCache(`/${endpoint}`);

    // Redirect to admin page for all types (patient, doctor, staff)
    router.push("/admin");
  } catch (error) {
    console.error("Error deleting:", error);
  } finally {
    deleteWarningCount.value = 0;
    showModal.value = false;
    isDeleting.value = false; // Reset the deleting flag
  }
};
</script>
