<!-- @format -->

<template>
	<div>
		<h1>Patient Information Form</h1>
		<form @submit.prevent="submitForm">
			<div>
				<label for="name">Name:</label>
				<input
					type="text"
					id="name"
					v-model="patient.name"
					required />
			</div>
			<div>
				<label for="age">Age:</label>
				<input
					type="number"
					id="age"
					v-model="patient.age"
					required />
			</div>
			<div>
				<label for="gender">Gender:</label>
				<select
					id="gender"
					v-model="patient.gender"
					required>
					<option value="male">Male</option>
					<option value="female">Female</option>
				</select>
			</div>
			<div>
				<label for="address">Address:</label>
				<input
					type="text"
					id="address"
					v-model="patient.address"
					required />
			</div>
			<div>
				<label for="phone">Phone:</label>
				<input
					type="tel"
					id="phone"
					v-model="patient.phone"
					required />
			</div>
			<button type="submit">Submit</button>
		</form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				patient: {
					name: '',
					age: '',
					gender: '',
					address: '',
					phone: '',
				},
			};
		},
		methods: {
			submitForm() {
				console.log('Patient Information:', this.patient);
				// subbmit
			},
		},
	};
</script>

<style scoped>
	form {
		max-width: 600px;
		margin: 0 auto;
		padding: 1em;
		border: 1px solid #ccc;
		border-radius: 1em;
	}
	div {
		margin-bottom: 1em;
	}
	label {
		margin-bottom: 0.5em;
		color: #333333;
		display: block;
	}
	input,
	select {
		border: 1px solid #cccccc;
		padding: 0.5em;
		font-size: 1em;
		width: 100%;
		box-sizing: border-box;
	}
	button {
		padding: 0.7em;
		color: #fff;
		background-color: #007bff;
		border: none;
		border-radius: 0.3em;
		cursor: pointer;
	}
	button:hover {
		background-color: #0056b3;
	}
	h1 {
		text-align: center;
		/* justify-content: center; */
	}
</style>
