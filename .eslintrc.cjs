module.exports = {
  root: true,
  env: { es2021: true, node: true, jest: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['node_modules/', 'dist/', 'build/', 'venv/'],
  overrides: [
    {
      files: ['apps/mobile/**/*.{ts,tsx,js,jsx}'],
      env: { browser: true, node: false },
      extends: ['expo', 'plugin:@typescript-eslint/recommended', 'prettier'],
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  ],
};
