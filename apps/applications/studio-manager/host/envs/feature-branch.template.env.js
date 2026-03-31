window.runtime = window.runtime || { env: {} };
var env = window.runtime.env;

// Replace __FEATURE_BRANCH_IDENTIFIER__ before uploading as /studio/env.js.
// Example final URL: https://api-theta.chaos.bsport.io
env.VITE_API_BASE_URL =
  "https://api-__FEATURE_BRANCH_IDENTIFIER__.chaos.bsport.io";
