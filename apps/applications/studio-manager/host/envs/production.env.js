window.runtime = window.runtime || { env: {} };
var env = window.runtime.env;

// Upload this file as /studio/env.js in the production environment.
env.VITE_API_BASE_URL = "https://api.production.bsport.io";
