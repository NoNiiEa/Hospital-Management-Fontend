<!-- @format -->

<template lang="html">
	<div class="doctor">
		<!-- doctor name card-->
		<div class="docktor-head">
			<p>Dashboard</p>
		</div>
		<div class="profile-card">
			<DoctorCard />
		</div>
		<div class="doctor-search">
			<input type="text">
		</div>
		<!-- appoint ment -->
		 <div>
			
		 </div>
	</div>
</template>
<script>
	import DoctorCard from '../components/Doctor/DoctorCard.vue';

	export default {
		components: {
			DoctorCard,
		},
	};
</script>
<style lang="css">
	.doctor {
		margin-top: 3%;
	}
	.docktor-head {
		margin-left: 14%;
		font-size: x-large;
		font-weight: bold;
	}
	.profile-card {
		margin: 1% 10%;
	}
	.doctor-search {
		display: flex;
		justify-content: center;
		margin: 2% 0%;
	}
</style>
