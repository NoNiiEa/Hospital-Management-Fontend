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
		<div class="space">
			<div class="history-dashboard">
				<!-- Recent History left -->
				<div class="left">
					<h3 class="head-card">Recent History</h3>
						<Card v-for="(item, index) in recentHistoryLeft" :key="index" :name="item.name" :role="item.role" />
				</div>
				<!-- Recent history right  -->
				<div class="right">
					<h3 class="head-card">Recent Jobs</h3>
						<Card v-for="(item, index) in recentHistoryRight" :key="index" :name="item.name" :role="item.role" />
				</div>
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
				// this is mock data
				recentHistoryLeft: [
					{ name: 'Aman', role: 'Patient' },
					{ name: 'Gellia', role: 'Doctor' },
					{ name: 'Biruk', role: 'Nurse' },
					{ name: 'Vere', role: 'Dominised' },
				],
				recentHistoryRight: [
					{ name: 'John', role: 'Engineer' },
					{ name: 'Doe', role: 'Designer' },
					{ name: 'Smith', role: 'Manager' },
					{ name: 'Jane', role: 'Developer' },
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
		/* margin-top: 1% 3%; */
		background-color: #ffffff;
		display: flex;
		justify-content: space-between;
	}
	.history-dashboard .left,
	.history-dashboard .right {
		flex: 1;
		margin: 10px 2%;
	}
	.space {
		/* margin-top: ; */
		padding: 2% 4%;
	}
	.head-card {
		margin-top: 3%;
		margin-bottom: 3%;
		font-size: x-large;
		font-weight: bold;
	}
</style>
