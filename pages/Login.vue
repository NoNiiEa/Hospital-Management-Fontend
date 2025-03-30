<!-- @format -->

<template>
	<div class="h-screen w-screen bg-white text-center flex flex-col items-center justify-center">
		<div class="text-xl font-bold mb-1">Login</div>
		<div class="mb-2">
			<p>Login to your account.</p>
		</div>
		<!-- form -->
		<div class="w-full max-w-sm mb-4">
			<div class="text-left mb-3">
				<p class="mb-1">E-mail Address</p>
				<input v-model="email" type="email"
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
			</div>
			<div class="text-left mb-3">
				<p class="mb-1">Password</p>
				<input v-model="password" type="password"
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
			</div>
		</div>
		<!-- submit button -->
		<button type="button"
			class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-300"
			@click="login">
			Login
		</button>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const login = () => {
	document.cookie = `session=${email.value}; path=/; max-age=3600; secure; samesite=strict`;
	alert(`Email: ${email.value}\nPassword: ${password.value}`);
};
</script>
