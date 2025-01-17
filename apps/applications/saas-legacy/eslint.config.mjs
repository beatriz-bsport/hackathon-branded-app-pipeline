import babelParser from '@babel/eslint-parser';
import typescriptParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import i18nextPlugin from 'eslint-plugin-i18next';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import bsport from 'eslint-plugin-bsport';

export default tseslint.config(
  tseslint.configs.base,
  {
    ignores: [
      // Replace .eslintignore
      'node_modules/',
      'dist/',
      'build/',
      '**/FormField.component.js',
      '**/registerServiceWorker.js',
      '**/Marketing*js',
      '**/*stories*',
      '**/*story*',
      '**/RuleCard.component.js',
      '**/AvatarUploader.component.js',
      '**./jitsi_external_api.js',
      '**/env.js',
      '**/actions/utils.js',
      '**/boilerplate/**',
      '**/*.test.ts',
      'src/**/__test__/**',
      'coverage/',
      '*.min.js',
      '*.bundle.js',
    ],
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        'eslint-import-resolver-custom-alias': {
          alias: {
            '#src': './src',
            '#Fabrique': './src/components/css-only/Fabrique',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    plugins: {
      react: reactPlugin,
      i18next: i18nextPlugin,
      'react-hooks': reactHooksPlugin,
      bsport,
    },
    languageOptions: {
      parser: babelParser,
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        // Testing globals
        jasmine: 'readonly',
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        cy: 'readonly',
        Cypress: 'readonly',
        // Custom globals
        snapshot: 'readonly',
        snapshotComponent: 'readonly',
        snapshotReducer: 'readonly',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...i18nextPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': true,
          'ts-expect-error': false,
          'ts-nocheck': true,
        },
      ],
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
      'react/no-unused-prop-types': 'warn',
      'react/default-props-match-prop-types': 0,
      'i18next/no-literal-string': 0,
      'react/jsx-key': 'warn',
      'react/display-name': 0,
      'arrow-parens': ['error', 'always'],
      'object-curly-newline': [0],
      'space-before-function-paren': [0],
      'react/prefer-stateless-function': 0,
      'react/jsx-one-expression-per-line': 0,
      'react/jsx-filename-extension': [
        'warn',
        {
          extensions: ['.js', '.jsx', 'tsx'],
        },
      ],
      radix: 0,
      'constructor-super': 1,
      'array-callback-return': [
        'warn',
        {
          checkForEach: false,
        },
      ],
      'no-await-in-loop': 1,
      'no-dupe-else-if': 1,
      'no-duplicate-case': 1,
      'no-duplicate-imports': 1,
      'no-irregular-whitespace': 1,
      'max-classes-per-file': ['error', 1],
      'max-depth': [
        'warn',
        {
          max: 4,
        },
      ],
      'no-empty': 1,
      'no-sequences': 1,
      'bsport/no-redux-in-component': 2,
      'bsport/no-moment-without-timezone': 2,
      'react/jsx-sort-props': [
        'error',
        {
          ignoreCase: true,
          shorthandFirst: true,
          reservedFirst: true,
        },
      ],
    },
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    // Rules for JavaScript files
    files: ['**/*.js'],
    ignores: ['**/*.translation*.js'],
    rules: {
      quotes: [2, 'single'],
    },
  },
  {
    // Rules for JavaScript and JSX files
    files: ['**/*.{js,jsx}'],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    // Rules for TypeScript files
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.test.ts', 'src/**/__test__/**'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: 'tsconfig-eslint.json',
        sourceType: 'module',
      },
      globals: {
        ts: 'readonly', // Add specific globals if needed for TypeScript
      },
    },
    rules: {
      'no-await-in-loop': 0,
      'no-unused-vars': 0, // Disabled to enforce typescript-eslint rule
      'import/no-named-as-default-member': 0,
      'max-len': 0,
      'react/prop-types': 0,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'prefer-destructuring': 0,
      'no-shadow': 0,
      '@typescript-eslint/no-shadow': 'error',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
    },
  },
);
