import js from '@eslint/js';
import globals from 'globals';

// Root config covers packages/** only. Apps keep the configs they arrived
// with (apps/cli lints itself via its own eslint.config.js through
// `pnpm -r run lint`). Rule block mirrors apps/cli so packages and apps
// share one style.
export default [
    {
        ignores: ['apps/**', '**/node_modules/**', '**/dist/**', '**/coverage/**']
    },
    js.configs.recommended,
    {
        files: ['scripts/**/*.{js,mjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.es2022
            }
        }
    },
    {
        files: ['packages/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.es2022
            }
        },
        rules: {
            'no-console': 'off',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'prefer-const': 'warn',
            'no-var': 'error',
            semi: ['error', 'always'],
            quotes: ['warn', 'single', { allowTemplateLiterals: true }],
            indent: ['warn', 4, { SwitchCase: 1 }],
            'no-trailing-spaces': 'warn',
            'eol-last': 'warn'
        }
    }
];
