<!-- @format -->

<template lang="html">
	<div class="page">
		<div class="login-text"> Login</div>
		<div class="hight"> <p> Login to your account. </p> </div>
		<!-- from -->
		<div class="from">
			<div class="text-from">
				<p>E-mail Address</p>
				<input
					v-model="email"
					type="email" />
			</div>
			<div class="text-from">
				<p>Password</p>
				<input
					v-model="password"
					type="password" />
			</div>
		</div>
		<!-- subbmit button -->
		<button
			type="button"
			class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
			@click="login"
			>login</button
		>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				email: '',
				password: '',
			};
		},
		methods: {
			login() {
				document.cookie = `session=${this.email}; path=/; max-age=3600; secure; samesite=strict`;
				alert(`Email : ${this.email} \nPassword: ${this.password}`);
			},
		},
	};
</script>
<style lang="css">
	.hight {
		margin: 0.5%;
	}
	.page {
		/* align-content: center; */
		background-color: #253d90;
		background-color: #ffffff;
		height: 100vh;
		width: 100vw;
		text-align: center;
		align-items: center;
		align-content: center;
	}
	.login-text {
		font-weight: bold;
		font-size: 20px;
	}
	input {
		border: 1px solid #ccc;
		border-radius: 6px;
	}
	.from {
		/* text-align: left; */
		justify-content: left;
		justify-items: center;
		margin-bottom: 1%;
	}
	.text-from {
		text-align: left;
	}
</style>
