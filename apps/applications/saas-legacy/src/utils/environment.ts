import Config from '#src/config';

/**
 * Backend environment types
 */
export const enum CoreBackendEnvironment {
  LOCAL = 'local',
  DEV = 'dev',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

/**
 * Union type of all environment types
 */
export type BackendEnvironment = CoreBackendEnvironment;

/**
 * Get backend environment from our API config
 */
export const getBackendEnvironment = (): BackendEnvironment | null => {
  const apiUrl = Config.REACT_APP_API_URI || '';

  if (apiUrl.includes('localhost')) {
    return CoreBackendEnvironment.LOCAL;
  }

  if (apiUrl.includes('api.dev.bsport.io')) {
    return CoreBackendEnvironment.DEV;
  }

  if (apiUrl.includes('api.staging.bsport.io')) {
    return CoreBackendEnvironment.STAGING;
  }

  if (apiUrl.includes('api.production.bsport.io')) {
    return CoreBackendEnvironment.PRODUCTION;
  }

  return null;
};
