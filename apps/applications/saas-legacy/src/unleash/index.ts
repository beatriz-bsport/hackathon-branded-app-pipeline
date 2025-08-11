import Config from '../config';
import type { IConfig } from 'unleash-proxy-client';

// Minimal Unleash proxy client configuration builder.
// environment: 'production' only when actually in production, else 'development'.
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
  } as IConfig;
}
