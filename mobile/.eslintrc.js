// https://docs.expo.dev/guides/using-eslint/
// module.exports = {
//   extends: 'expo',
// };

// const { defineConfig } = require('eslint/config');
// const expoConfig = require('eslint-config-expo/flat');
// const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

// module.exports = defineConfig([
//   expoConfig,
//   eslintPluginPrettierRecommended,
//   {
//     ignores: ['dist/*'],
//   },
// ]);

module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error'
  }
};
