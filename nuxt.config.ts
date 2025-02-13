/** @format */

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	css: ['bootstrap/dist/css/bootstrap.css', '@/assets/css/tailwind.css'],
	build: {
		transpile: ['bootstrap'],
	},
	postcss: {
		plugins: {
			'@tailwindcss/postcss7-compat': {},
			autoprefixer: {},
		},
	},
});
