<!-- @format -->

<template>
	<div class="doctor-page">
		<header class="doctor-header">
			<h1 class="header-title">Doctor Dashboard</h1>
		</header>
		<main class="doctor-main">
			<section class="doctor-profile-section">
				<DoctorCard :name="doctor.name" :specialization="doctor.specialization" :contact="doctor.contact" />
			</section>
			<section class="doctor-search-section">
				<input type="text" v-model="searchQuery" placeholder="Search appointments..." class="search-input">
			</section>
			<section class="doctor-appointments-section">
				<!-- Appointment list will go here -->
			</section>
		</main>
	</div>
</template>

<script>
import DoctorCard from '../components/Doctor/DoctorCard.vue';

export default {
	components: {
		DoctorCard,
	},
	data() {
		return {
			doctor: {
				name: 'Dr. Alice Turner',
				specialization: 'Cardiology',
				contact: {
					phone: '123-456-7890',
					email: 'alice.turner@example.com',
					address: '101 Heart Center Blvd, New York, USA',
				},
			},
			searchQuery: '',
		};
	},
};
</script>

<style scoped>
.doctor-page {
	font-family: 'Roboto', sans-serif;
	background-color: #f7f9fc;
	color: #3c4043;
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

.doctor-header {
	background-color: #ffffff;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	padding: 24px;
	text-align: left;
}

.header-title {
	font-size: 24px;
	font-weight: 500;
	color: #202124;
	margin: 0;
}

.doctor-main {
	padding: 24px;
	flex-grow: 1;
}

.doctor-profile-section {
	margin-bottom: 32px;
}

.doctor-search-section {
	margin-bottom: 24px;
}

.search-input {
	width: 100%;
	padding: 12px;
	border: 1px solid #dfe1e5;
	border-radius: 8px;
	font-size: 16px;
	color: #202124;
	background-color: #ffffff;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	outline: none;
}

.search-input:focus {
	border-color: #4285f4;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.doctor-appointments-section {
	/* Add styles for appointment list */
}
</style>
