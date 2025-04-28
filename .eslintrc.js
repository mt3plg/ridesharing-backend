module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        indent: ['error', 2],
        'linebreak-style': ['error', 'unix'],
        'prettier/prettier': ['error', { endOfLine: 'lf' }],
    },
    ignorePatterns: ['.eslintrc.js'],
};