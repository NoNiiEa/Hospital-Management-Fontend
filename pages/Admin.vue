<!-- @format -->

<template>
	<!-- หน้า admin มีสองฝั่งคือ left และ right -->
	<div class="admin-page">
		<div class="left-side">
			<AdminProfile />
		</div>
		<!-- right -->
		<div class="right-side">
			<AdminDashBoard />
		</div>
	</div>
</template>

<script>
	export default {};
</script>

<style>
	.admin-page {
		display: flex;
		width: 100%;
		height: 100%;
	}

	.left-side {
		margin-top: 5%;
		width: 25%;
		/* background-color: #121c3e;
		color: #121c3e; */
	}

	.right-side {
		flex: 1;
		background-color: #e3edf9;
	}
</style>
