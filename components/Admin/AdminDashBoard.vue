<!-- @format -->

<template lang="html">
	<div>
		<!-- seach box -->
		<div class="search-container">
			<div> </div>
			<div class="search-box">
				<input
					type="text"
					v-model="input"
					placeholder="search..." />
			</div>
		</div>
		<!-- Dashboard -->
		<div>
			<h2 class="text-Dashboard">Dashboard</h2>
		</div>
		<!-- Recent History -->
		<div class="history-dashboard">
			<!-- Recent History left -->
			<div class="left">
				<h3>Recent History</h3>
				<p>left</p>
			</div>
			<!-- Recent history right  -->
			<div class="right">
				<h3>Recent Jobs</h3>
				<p>right</p>
			</div>
		</div>
	</div>
</template>
<script>
	import { ref } from 'vue';
	import Card from '../Card.vue';

	export default {
		components: {
			Card,
		},
		data() {
			return {
				recentHistory: [
					{ name: 'Aman', role: 'Patient' },
					{ name: 'gellia', role: 'Doctor' },
					{ name: 'Biruk', role: 'Nurse' },
					{ name: 'Vere', role: 'Dominised' },
					{ name: 'Vere', role: 'Dominised' },
					{ name: 'Vere', role: 'Dominised' },
				],
				recentJobs: [
					{ title: 'Sales Executive', company: 'Access Bank' },
					{ title: 'User Experience Designer', company: 'Payback' },
					{ title: 'Product Manager', company: 'TPay' },
					{ title: 'Smins ago', company: '' },
				],
			};
		},
	};
</script>
<style lang="css">
	.search-container {
		margin: 2%;
		flex-direction: column;
	}
	.search-box {
		justify-content: center;
		display: flex;
		flex: 1;
		/* resize search box */
	}
	.text-Dashboard {
		margin: 2% 5%;
		font-weight: bold;
	}
	.history-dashboard {
		margin-top: 1% 3%;
		background-color: red;
		display: flex;
		justify-content: space-between;
	}
	.history-dashboard .left,
	.history-dashboard .right {
		flex: 1;
		margin: 20px;
	}
</style>
