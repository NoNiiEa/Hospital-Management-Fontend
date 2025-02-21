<template>
    <div>
      <h1>Thiangern</h1>
      <div class="doctor">
        <h1>Hello, this is the Doctor page</h1>
      </div>
      <div class="doctors">
        <h2>Doctor List</h2>
        <ul>
          <li v-for="(doctor, index) in doctors" :key="index">
            {{ doctor.name }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  
  export default {
    setup() {
      const doctors = ref([]);
  
      const fetchDoctors = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/doctors/");
          const data = await response.json();
          doctors.value = data;
        } catch (error) {
          console.error("Error fetching doctors:", error);
        }
      };
  
      onMounted(fetchDoctors);
  
      return { doctors };
    },
  };
  </script>
  
  <style scoped>
  h1 {
    color: blue;
  }
  .doctor {
    margin-top: 20px;
    padding: 10px;
    background-color: #f0f0f0;
  }
  .doctors {
    margin-top: 20px;
  }
  </style>
  