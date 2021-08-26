import { init as initApm } from '@elastic/apm-rum';

import Config from './config';

if (Config.NODE_ENV === 'production') {
  initApm({
    // Set service version (required for sourcemap feature)
    serviceVersion: '',
    breakdownMetrics: true,
    transactionSampleRate: 0.01,
    environment: Config.REACT_APP_SENTRY_ENVIRONMENT,
    serviceName: 'bsport-saas',
    serverUrl: 'https://apm.infra.bsport.io',
  });
}
