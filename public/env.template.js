window.runtime = window.runtime || { env: {} };
var env = window.runtime.env;

// ENV
env.REACT_APP_SENTRY_DSN = '${SENTRY_DSN}';
env.REACT_APP_STRIPE_PK_KEY = '${STRIPE_PK_KEY}';
env.REACT_APP_GOOGLE_MAPS_API_KEY = '${GOOGLE_MAPS_API_KEY}';
env.REACT_APP_BASE_URI = '${BASE_URI}';
