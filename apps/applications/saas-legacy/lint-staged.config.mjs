import config from '../../../lint-staged.config.mjs';

/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  // This file ensures that lint-staged is run
  // with the correct working directory (i.e. correct `prettier` version).
  ...config,

  // Feel free to add any overrides here if necessary.
};
