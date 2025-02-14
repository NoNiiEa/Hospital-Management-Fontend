<template lang="html">
	<div>
		<!-- Search box -->
		<div class="search-container">
			<div></div>
			<div class="search-box">
				<input
					type="text"
					v-model="input"
					placeholder="Search..." />
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
					<h3 class="head-card">Patient History</h3>
					<ul>
						<li v-for="patient in recentHistoryLeft" :key="patient.id">
							<Card :name="patient.name"/>
						</li>
					</ul>
				</div>

				<!-- Recent History right -->
				<div class="right">
					<h3 class="head-card">Recent Jobs</h3>
					<!-- Add content for Recent Jobs here -->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Card from '../Card.vue';

export default {
    components: {
        Card,
    },
    data() {
        return {
            recentHistoryLeft: [],
            input: '',
        };
    },
    methods: {
        async fetchPatients() {
            try {
                const response = await fetch('http://127.0.0.1:8000/patients/', {
                    headers: {
                        accept: 'application/json',
                    },
                });

                const text = await response.text(); 
                console.log('Response Text:', text);

                const data = JSON.parse(text);
                this.recentHistoryLeft = data.map(patient => ({
                    id: patient.id,
                    name: patient.name,
                }));
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        },
    },
    mounted() {
        this.fetchPatients();
    }
};
</script>

<style lang="css">
	.search-container {
		margin: 2%;
		display: flex;
		flex-direction: column;
	}

	.search-box {
		display: flex;
		justify-content: center;
		flex: 1;
	}

	.text-Dashboard {
		margin: 1% 5%;
		font-size: xx-large;
		font-weight: bold;
	}

	.history-dashboard {
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
		padding: 2% 4%;
	}

	.head-card {
		margin-top: 3%;
		margin-bottom: 3%;
		font-size: x-large;
		font-weight: bold;
	}
</style>
