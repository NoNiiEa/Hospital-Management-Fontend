<!-- @format -->

<template>
	<!-- หน้า admin มีสองฝั่งคือ left และ right -->
	<div class="admin-page">
		<div class="left-side">
			<!-- Removed AdminProfile -->
		</div>
		<!-- right -->
		<div class="right-side">
			<!-- Stats Overview Section -->
			<div class="stats-overview">
				<PatientStatistics title="Hospital Overview" />
			</div>
			<AdminDashBoard />
		</div>
	</div>
</template>

<script setup>
import PatientStatistics from '../components/Statistics/PatientStatistics.vue';
</script>

<style>
.admin-page {
	display: flex;
	width: 100%;
	height: 100%;
}

.left-side {
	margin-top: 5%;
	width: 0%;
	/* Adjusted width for balance */
	/* background-color: #121c3e;
		color: #121c3e; */
}

.right-side {
	flex: 1;
	background-color: #f0f4f8;
	padding: 1rem;
}

.stats-overview {
	margin-bottom: 1.5rem;
}
</style>
