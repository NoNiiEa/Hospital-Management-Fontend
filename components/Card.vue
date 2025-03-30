<template>
  <div>
    <div @click="viewDetails"
      class="flex justify-between items-center p-4 my-2 bg-white rounded-lg shadow cursor-pointer hover:scale-105 hover:shadow-md active:scale-95 active:shadow-sm transition-all">
      <div class="p-2">
        <div class="font-bold">
          {{ name }}
        </div>
        <!-- Add slot for details that will be used for staff -->
        <slot name="details"></slot>
      </div>
      <button @click.stop="confirmDelete"
        class="px-3 py-1.5 bg-red-600 text-white border-none rounded-md text-sm cursor-pointer hover:bg-red-500 hover:shadow-[0_0_5px_rgba(255,49,49,0.6),0_0_10px_rgba(255,49,49,0.4)] hover:scale-105 active:scale-97 active:shadow-[0_0_3px_rgba(255,49,49,0.4),0_0_6px_rgba(255,49,49,0.3)] transition-all">
        Delete
      </button>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="p-5 bg-white rounded-lg text-center w-80">
        <p>{{ modalMessage }}</p>
        <div class="flex justify-around mt-3">
          <button @click="cancelDelete"
            class="px-4 py-2 bg-gray-400 text-white rounded-md border-none text-sm cursor-pointer hover:bg-gray-500">
            Cancel
          </button>
          <button v-if="deleteWarningCount === 1" @click="confirmDelete"
            class="px-4 py-2 bg-green-600 text-white rounded-md border-none text-sm cursor-pointer hover:bg-green-700">
            OK
          </button>
          <button v-if="deleteWarningCount === 2" @click="handleDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-md border-none text-sm cursor-pointer hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'nuxt/app';
import { ref } from 'vue';

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
    type: String,
    required: true,
    validator: (value) => ["patient", "doctor", "staff"].includes(value),
  }
});

const emit = defineEmits(['deleted']);
const router = useRouter();

// Reactive state
const deleteWarningCount = ref(0);
const showModal = ref(false);
const modalMessage = ref("");
const isDeleting = ref(false); // Flag to track if we're in delete process

// Methods
const viewDetails = async () => {
  // If we're currently in the delete process, don't navigate
  if (isDeleting.value) {
    return;
  }
  try {
    const baseUrl = "http://127.0.0.1:8000";
    let endpoint;
    if (props.type === "patient") {
      endpoint = "patients";
    } else if (props.type === "doctor") {
      endpoint = "doctors";
    } else if (props.type === "staff") {
      endpoint = "staffs";
    }
    const response = await fetch(`${baseUrl}/${endpoint}/get/${props.id}`, {
      headers: {
        accept: "application/json",
      },
    });
    if (response.ok) {
      // Route to different pages based on type
      let route;
      if (props.type === "patient") {
        route = `/patient/${props.id}`;
      } else if (props.type === "doctor") {
        route = `/doctor/${props.id}`;
      } else if (props.type === "staff") {
        route = `/staff/${props.id}`;
      }
      router.push(route);
    }
  } catch (error) {
    console.error("Error fetching details:", error);
  }
};

const confirmDelete = (event) => {
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

const cancelDelete = () => {
  deleteWarningCount.value = 0;
  showModal.value = false;
  isDeleting.value = false; // Reset the deleting flag
};

const handleDelete = async () => {
  try {
    const baseUrl = "http://127.0.0.1:8000";
    let endpoint;
    if (props.type === "patient") {
      endpoint = "patients";
    } else if (props.type === "doctor") {
      endpoint = "doctors";
    } else if (props.type === "staff") {
      endpoint = "staffs";
    }
    const response = await fetch(
      `${baseUrl}/${endpoint}/delete/${props.id}`,
      {
        method: "DELETE",
        headers: {
          accept: "application/json",
        },
      }
    );
    if (response.ok) {
      emit("deleted", { id: props.id, type: props.type });
      // Redirect to admin page for all types (patient, doctor, staff)
      router.push("/admin");
    } else {
      console.error(`Failed to delete ${props.type}`);
    }
  } catch (error) {
    console.error("Error deleting:", error);
  } finally {
    deleteWarningCount.value = 0;
    showModal.value = false;
    isDeleting.value = false; // Reset the deleting flag
  }
};
</script>
