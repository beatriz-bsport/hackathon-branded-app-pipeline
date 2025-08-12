import Config from '../config';
import type { IConfig } from 'unleash-proxy-client';

export default function initUnleash(): IConfig {
  const environment =
    process.env.NODE_ENV === 'production' || Config.NODE_ENV === 'production'
      ? 'production'
      : 'development';

  return {
    url: Config.REACT_APP_UNLEASH_PROXY_URL,
    clientKey: Config.REACT_APP_UNLEASH_CLIENT_KEY,
    appName: 'saas-legacy',
    environment,
    refreshInterval: 0,
    metricsInterval: 120,
  } as IConfig;
}
