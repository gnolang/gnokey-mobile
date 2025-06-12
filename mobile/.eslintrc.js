// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-expressions': 'off',
    'import/no-unresolved': [
      'error',
      { ignore: ['@/redux', '^@/modules/.+', '@/components', '@/views', '@/providers', '@/assets'] }
    ]
  }
}
