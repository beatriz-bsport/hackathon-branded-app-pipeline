window.runtime = window.runtime || { env: {} };
var env = window.runtime.env;

// Upload this file as /studio/env.js when targeting the local monolith backend.
env.VITE_API_BASE_URL = "http://localhost:8000";
