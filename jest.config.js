module.exports = {
  roots: ['<rootDir>/src'],

  snapshotSerializers: ['enzyme-to-json/serializer'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/?(*.)(spec|test).{ts,tsx}',
  ],
  testEnvironment: 'node',
  testURL: 'http://localhost',
  transform: {
    // '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$',
  ],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
  },
  moduleFileExtensions: [
    'web.js',
    'js',
    'json',
    'web.jsx',
    'jsx',
    'node',
    'mjs',
    'ts',
    'tsx',
  ],
  // setupFilesAfterEnv: ['@testing-library/react/cleanup-after-each'],
  globals: {
    'ts-jest': {
      //   // will not check types deep but only inside test.ts file
      isolatedModules: true,
      babelConfig: true,
    },
    window: {
      localStorage: {
        setItem: (key, value) => null,
        getItem: (key) => null,
      },
      storage: {
        setItem: () => null,
        getItem: () => null,
      },
      runtime: {
        env: {
          REACT_APP_SENTRY_DSN: '',
          REACT_APP_STRIPE_PK_KEY: 'pk_test_lFB5CxcyTCaQcS00MiE1ebEO',
          REACT_APP_STRIPE_PK_KEY_US:
            'pk_test_f40unREf611uut2oTtz4Qqfl00UCO6tZr5',
          REACT_APP_GOOGLE_MAPS_API_KEY: 'aaaa',
          REACT_APP_BASE_URI: 'http://localhost:8000',
          REACT_APP_API_URI: 'http://localhost:8000/api-v0',
          REACT_APP_ZOOM_CLIENT_ID: 'ayAjSMV0SiOR383VkR3I4Q',
          REACT_APP_SENTRY_ENVIRONMENT: 'local',
          PUBLIC_URL: 'http://localhost:3000',
          REACT_APP_RECAPTCHA_V3: '6LeC6rIZAAAAAJSN0DVqzOF3cYXwQcXgp8rKX9cf',
          REACT_APP_RECAPTCHA_V2: '6Lds67IZAAAAAFaPGpfl_ALgtV2t6Re63MBtCshi',
          REACT_APP_CDN_DOMAIN: 'localhost:9000',
          I18N_TRANSLATION_DOMAIN: '',
        },
      },
    },
  },
};
