module.exports = {
  extends: [
    'next/core-web-vitals',
  ],
  rules: {
    // 禁用 any 类型的警告
    '@typescript-eslint/no-explicit-any': 'off',
    // 禁用未使用变量的警告
    '@typescript-eslint/no-unused-vars': 'off',
    // 禁用 no-img-element 的警告
    '@next/next/no-img-element': 'off',
    // 禁用 no-assign-module-variable 的警告
    '@next/next/no-assign-module-variable': 'off',
  },
}; 