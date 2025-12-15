import Config from '#src/config';

/**
 * Backend environment types
 */
export const enum CoreBackendEnvironment {
  LOCAL = 'local',
  DEV = 'dev',
  STAGING = 'staging',
  PRODUCTION = 'production',
  FEATURE_BRANCH = 'feature_branch',
}

/**
 * Feature branch environments
 * Note: This list is not exhaustive and can be expanded as needed
 * All identifiers are defined in: tools/toolkit-cli/src/commands/set-api-environment.ts (FEATURE_BRANCH_API_IDENTIFIERS)
 */
export const enum FeatureBranchIdentifier {
  PIKACHU = 'pikachu',
}
const FEATURE_BRANCH_IDENTIFIERS = [FeatureBranchIdentifier.PIKACHU];

/**
 * Union type of all environment types
 */
export type BackendEnvironment =
  | CoreBackendEnvironment
  | FeatureBranchIdentifier;

/**
 * Get specific feature branch from API config
 * Returns the feature branch name if environment is FEATURE_BRANCH, null otherwise
 */
const getFeatureBranch = (): FeatureBranchIdentifier | null => {
  const apiUrl = Config.REACT_APP_API_URI || '';

  if (!apiUrl.includes('chaos.bsport.io')) {
    return null;
  }

  // Extract subdomain from chaos.bsport.io URL
  // Expected format: https://api-{branch}.chaos.bsport.io
  const match = apiUrl.match(/https?:\/\/api-([^.]+)\.chaos\.bsport\.io/);

  if (!match || !match[1]) {
    return null;
  }

  const branchName = match[1].toLowerCase() as FeatureBranchIdentifier;
  const featureBranches = new Set(FEATURE_BRANCH_IDENTIFIERS);

  // Check if it matches a listed feature branch
  if (featureBranches.has(branchName)) {
    return branchName;
  }

  return null;
};

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

  if (apiUrl.includes('chaos.bsport.io')) {
    return getFeatureBranch() || CoreBackendEnvironment.FEATURE_BRANCH;
  }

  return null;
};
