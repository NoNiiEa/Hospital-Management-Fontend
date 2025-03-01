<!-- @format -->

<template lang="html">
  <div>
    <div class="box" @click="viewDetails">
      <div class="text">
        <div class="name">
          {{ name }}
        </div>
      </div>
      <button @click.stop="confirmDelete" class="delete-button">Delete</button>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <div class="modal-buttons">
          <button @click="cancelDelete" class="modal-button cancel">
            Cancel
          </button>
          <button
            v-if="deleteWarningCount === 1"
            @click="confirmDelete"
            class="modal-button ok"
          >
            OK
          </button>
          <button
            v-if="deleteWarningCount === 2"
            @click="handleDelete"
            class="modal-button delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
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
      validator: (value) => ["patient", "doctor"].includes(value),
    },
  },
  data() {
    return {
      deleteWarningCount: 0,
      showModal: false,
      modalMessage: "",
    };
  },
  methods: {
    async viewDetails() {
      try {
        const baseUrl = "http://127.0.0.1:8000";
        const endpoint = this.type === "patient" ? "patients" : "doctors";
        const response = await fetch(`${baseUrl}/${endpoint}/get/${this.id}`, {
          headers: {
            accept: "application/json",
          },
        });

        if (response.ok) {
          // Route to different pages based on type
          const route =
            this.type === "patient"
              ? `/patient/${this.id}`
              : `/doctor/${this.id}`;
          this.$router.push(route);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    },
    confirmDelete() {
      this.deleteWarningCount++;

      if (this.deleteWarningCount === 1) {
        this.modalMessage = `Warning: Are you sure you want to delete ${this.type} "${this.name}"? Click OK to confirm.`;
      } else if (this.deleteWarningCount === 2) {
        this.modalMessage = `Final warning: This will permanently delete ${this.type} "${this.name}". Are you sure?`;
      }
      this.showModal = true;
      // ลบ timeout ออก เพื่อให้ modal แสดงจนกว่าจะกดปุ่ม
    },

    cancelDelete() {
      this.deleteWarningCount = 0;
      this.showModal = false;
    },

    async handleDelete() {
      try {
        const baseUrl = "http://127.0.0.1:8000";
        const endpoint = this.type === "patient" ? "patients" : "doctors";
        const response = await fetch(
          `${baseUrl}/${endpoint}/delete/${this.id}`,
          {
            method: "DELETE",
            headers: {
              accept: "application/json",
            },
          }
        );

        if (response.ok) {
          this.$emit("deleted", { id: this.id, type: this.type });
        } else {
          console.error("Failed to delete");
        }
      } catch (error) {
        console.error("Error deleting:", error);
      } finally {
        this.deleteWarningCount = 0;
        this.showModal = false;
      }
    },
  },
};
</script>
<style lang="css">
.name {
  font-weight: bold;
}

.box {
  background-color: #ffffff;
  border-radius: 15px;
  margin: 2% 0%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2%;
  cursor: pointer;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1), 
                -1px -1px 1px rgba(0, 0, 0, 0.1),
                1px -1px 1px rgba(0, 0, 0, 0.1),
                -1px 1px 1px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, 
              transform 0.3s ease, 
              box-shadow 0.3s ease; /* Smooth transition */
}

.box:hover {
    background-color: #ffffff;
    transform: scale(1.1); /* Slightly increase size */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.box:active {
    transform: scale(0.95); /* Slightly shrink */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}


.text {
  padding: 2%;
}

.delete-button {
    background-color: #D70040; /* Red background */
    color: white;
    border: none;
    padding: 5px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, 
                box-shadow 0.3s ease, 
                transform 0.3s ease; /* Smooth transition */
}

/* Hover Effect with Neon Glow */
.delete-button:hover {
    background-color: #FF3131; /* Lighter red */
    box-shadow: 0 0 5px rgba(255, 49, 49, 0.6), 
                0 0 10px rgba(255, 49, 49, 0.4); /* Softer neon effect */
    transform: scale(1.05); /* Slightly enlarge */
}

/* Click (Active) Effect */
.delete-button:active {
    transform: scale(0.97); /* Slightly shrink */
    box-shadow: 0 0 3px rgba(255, 49, 49, 0.4), 
                0 0 6px rgba(255, 49, 49, 0.3); /* Even softer glow */
}


.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  width: 300px;
}

.modal-buttons {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
}

.modal-button {
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  border-radius: 5px;
  cursor: pointer;
}

.modal-button.cancel {
  background-color: #a9a9a9;
}

.modal-button.cancel:hover {
  background-color: #808080;
}

.modal-button.ok {
  background-color: #4caf50;
}

.modal-button.ok:hover {
  background-color: #367c39;
}

.modal-button.delete {
  background-color: #f44336;
}

.modal-button.delete:hover {
  background-color: #da190b;
}
</style>
