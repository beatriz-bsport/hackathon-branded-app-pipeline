import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import i18next from 'eslint-plugin-i18next';
import cypress from 'eslint-plugin-cypress';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import bsport from 'eslint-plugin-bsport';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';

export default [
  // Base JavaScript rules
  js.configs.recommended,

  // React rules
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      react: fixupPluginRules(react),
      'react-hooks': reactHooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/no-unused-prop-types': 'warn',
      'react/jsx-key': 'warn',
      'react/display-name': 0,
      'react/jsx-sort-props': [
        'error',
        {
          ignoreCase: true,
          shorthandFirst: true,
          reservedFirst: true,
        },
      ],
    },
  },

  // TypeScript rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: 'tsconfig.json',
      },
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': true,
          'ts-expect-error': false,
          'ts-nocheck': true,
        },
      ],
    },
  },

  // Cypress rules
  {
    files: ['**/*.cy.js', '**/*.cy.ts'],
    plugins: {
      cypress,
    },
    rules: {
      ...cypress.configs.recommended.rules,
    },
  },

  // i18next rules
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      i18next,
    },
    rules: {
      ...i18next.configs.recommended.rules,
      'i18next/no-literal-string': 0,
    },
  },

  // bsport custom rules
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      bsport,
    },
    rules: {
      'bsport/no-redux-in-component': 2,
      'bsport/no-moment-without-timezone': 2,
    },
  },

  // General rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
      'arrow-parens': ['error', 'always'],
      'array-callback-return': [
        'warn',
        {
          checkForEach: false,
        },
      ],
      'max-classes-per-file': ['error', 1],
      'max-depth': [
        'warn',
        {
          max: 4,
        },
      ],
      'no-empty': 1,
      'no-sequences': 1,
      'object-curly-newline': 0,
      'space-before-function-paren': 0,
    },
  },
];
