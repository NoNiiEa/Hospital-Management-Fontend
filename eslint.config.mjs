import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  // Your custom ESLint rules
  files: ['**/*.ts', '**/*.js', '**/*.vue'],
  rules: {
    'no-console': 'warn', // Example rule
  },
});
