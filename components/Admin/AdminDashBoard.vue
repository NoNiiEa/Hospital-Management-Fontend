<template lang="html">
	<div>
		<!-- Search box -->
		<div class="search-container">
			<div></div>
			<div class="search-box">
				<input type="text" v-model="input" placeholder="Search..." />
			</div>
		</div>


		<!-- Dashboard -->
		<div>
			<h2 class="text-Dashboard">Dashboard</h2>
		</div>

		<!-- Recent History -->
		<div class="space">
			<div class="history-dashboard">
				<!-- Recent History left - Patients -->
				<div class="left">
					<div class="button-add-delete">
						<h3 class="head-card">Patient</h3>
						<!-- icon add patient -->
						<div class="add-delete-right">
							<button v-on:click="addPatients">
								<img src="@/assets/Images/add.png" :height="imagesize" :width="imagesize" />
							</button>
							<!-- icon delete paitnet -->
							<button v-on:click="deletePatients">
								<img src="@/assets/Images/minus.png" :height="imagesize" :width="imagesize" />
							</button>
						</div>
					</div>
					<ul>
						<li v-for="patient in patients" :key="patient.id">
							<Card :name="patient.name" :id="patient.id" type="patient" @deleted="handleDeleted" />
						</li>
					</ul>
				</div>

				<!-- Recent History right - Medical Personnel -->
				<div class="right">
					<div class="button-add-delete">
						<h3 class="head-card">Medical Personnel</h3>
						<!-- icon add medical personnel -->
						<div class="add-delete-right">
							<button v-on:click="addMedicalPersonnel">
								<img src="@/assets/Images/add.png" :height="imagesize" :width="imagesize" />
							</button>
							<!-- icon delete medical personnel -->
							<button v-on:click="deleteMedicalPersonnel">
								<img src="@/assets/Images/minus.png" :height="imagesize" :width="imagesize" />
							</button>
						</div>
					</div>
					<ul>
						<li v-for="person in medicalPersonnel" :key="person.id">
							<Card :name="person.name" :id="person.id" type="doctor" @deleted="handleDeleted" />
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Card from '../Card.vue';
import { useRouter } from 'vue-router';

class Patient {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}
}

class MedicalPersonnel {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}
}

const imagesize = '40px';
export default {
	components: {
		Card,
	},
	setup() {
		const router = useRouter();
		return { router };
	},
	data() {
		return {
			patients: [],
			medicalPersonnel: [],
			input: '',
			imagesize,
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
				console.log('Patients Response:', text);

				const data = JSON.parse(text);
				this.patients = data.map(
					(patient) => new Patient(patient.id, patient.name),
				);
			} catch (error) {
				console.error('Error fetching patients:', error);
			}
		},
		async fetchMedicalPersonnel() {
			try {
				const response = await fetch('http://127.0.0.1:8000/doctors/', {
					headers: {
						accept: 'application/json',
					},
				});

				const text = await response.text();
				console.log('Medical Personnel Response:', text);

				const data = JSON.parse(text);
				this.medicalPersonnel = data.map(
					(person) => new MedicalPersonnel(person.id, person.name),
				);
			} catch (error) {
				console.error('Error fetching medical personnel:', error);
			}
		},
		async addPatients() {
			this.router.push('/patient/add_patient');
		},
		async deletePatients() {
			this.router.push('/patient/delete_patient');
		},
		async addMedicalPersonnel() {
			this.router.push('/medical/add_medical');
		},
		async deleteMedicalPersonnel() {
			this.router.push('/medical/delete_medical');
		},
		handleDeleted({ id, type }) {
			if (type === 'patient') {
				this.patients = this.patients.filter(patient => patient.id !== id);
			} else {
				this.medicalPersonnel = this.medicalPersonnel.filter(person => person.id !== id);
			}
		},
	},
	mounted() {
		// Check if we need to refresh
		const needsRefresh = sessionStorage.getItem('needsRefresh');
		if (needsRefresh) {
			sessionStorage.removeItem('needsRefresh');
			window.location.reload();
		}
		this.fetchPatients();
		this.fetchMedicalPersonnel();
	},
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
	border-radius: 10px;
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
	margin-bottom: 5%;
	font-size: x-large;
	font-weight: bold;
}

.button-add-delete {
	display: flex;
}

.add-delete-right {
	margin-left: auto;
	display: flex;
	gap: 10px;
}
</style>
