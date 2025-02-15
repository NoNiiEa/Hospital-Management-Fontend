<!-- @format -->

<template>
	<div>
		<!-- <Login/> -->
		 <Admin/>
	</div>
</template>

<script>
	import Doctor from '@/src/Doctor.vue';
	import Admin from '@/src/Admin.vue';
	import Login from '@/src/Login.vue'; 

	export default {
		components: {
			Doctor,
			Admin,
			Login, 
		},
	};
</script>

<style lang=""></style>
