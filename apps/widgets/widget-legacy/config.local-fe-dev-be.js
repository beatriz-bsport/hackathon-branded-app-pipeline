/**
 * Configuration to run widgets with
 * - local saas-legacy frontend, running on localhost:3000
 * - dev backend, running on api.dev.bsport.io
 * Use this config when running saas-legacy with "pnpm start-dev"
 */

if (!window.runtime) window.runtime = {};
if (!window.runtime.env) window.runtime.env = {};

window.runtime.env.ENVIRONMENT_LABEL = 'dev';
window.runtime.env.REACT_APP_BASE_URI = 'https://api.dev.bsport.io';
window.runtime.env.REACT_APP_API_URI = 'https://api.dev.bsport.io/api-v0';
window.runtime.env.REACT_APP_STRIPE_PK_KEY = 'pk_test_lFB5CxcyTCaQcS00MiE1ebEO';
window.runtime.env.REACT_APP_GOOGLE_MAPS_API_KEY = 'NA';
window.runtime.env.REACT_APP_SENTRY_DSN = '';
window.runtime.env.I18N_TRANSLATION_DOMAIN = 'http://localhost:3000';
window.runtime.env.PUBLIC_URL = 'http://localhost:3000';

if (!window.runtimeBsport) window.runtimeBsport = {};
if (!window.runtimeBsport.env) window.runtimeBsport.env = {};

window.runtimeBsport.env.REACT_APP_BASE_URI = 'https://api.dev.bsport.io';
window.runtimeBsport.env.REACT_APP_API_URI = 'https://api.dev.bsport.io/api-v0';
window.runtimeBsport.env.REACT_APP_STRIPE_PK_KEY =
  'pk_test_lFB5CxcyTCaQcS00MiE1ebEO';
window.runtimeBsport.env.REACT_APP_GOOGLE_MAPS_API_KEY = 'NA';
window.runtimeBsport.env.REACT_APP_SENTRY_DSN = '';
window.runtimeBsport.env.I18N_TRANSLATION_DOMAIN = 'http://localhost:3000';
window.runtimeBsport.env.PUBLIC_URL = 'http://localhost:3000';

window.runtime.env.REACT_APP_BASE_URI_BUSINESS_INSIGHTS_V0 =
  'https://api.dev.bsport.io/business-insights/v0';
window.runtime.env.REACT_APP_BASE_URI_BUSINESS_INSIGHTS_V1 =
  'https://api.dev.bsport.io/business-insights/v1';
window.runtime.env.REACT_APP_BASE_URI_BOOK_V0 =
  'https://api.dev.bsport.io/book/v0';
window.runtime.env.REACT_APP_BASE_URI_BOOK_V1 =
  'https://api.dev.bsport.io/book/v1';
window.runtime.env.REACT_APP_BASE_URI_BUYABLE_V0 =
  'https://api.dev.bsport.io/buyable/v0';
window.runtime.env.REACT_APP_BASE_URI_BUYABLE_V1 =
  'https://api.dev.bsport.io/buyable/v1';
window.runtime.env.REACT_APP_BASE_URI_COMMUNICATE_V0 =
  'https://api.dev.bsport.io/communicate/v0';
window.runtime.env.REACT_APP_BASE_URI_COMMUNICATE_V1 =
  'https://api.dev.bsport.io/communicate/v1';
window.runtime.env.REACT_APP_BASE_URI_CORE_V0 =
  'https://api.dev.bsport.io/core-data/v0';
window.runtime.env.REACT_APP_BASE_URI_CORE_V1 =
  'https://api.dev.bsport.io/core-data/v1';
window.runtime.env.REACT_APP_BASE_URI_FINANCIAL_SERVICES_V0 =
  'https://api.dev.bsport.io/financial-services/v0';
window.runtime.env.REACT_APP_BASE_URI_FINANCIAL_SERVICES_V1 =
  'https://api.dev.bsport.io/financial-services/v1';
window.runtime.env.REACT_APP_BASE_URI_CDP_V0 =
  'https://api.dev.bsport.io/customer-data-platform/v0';
window.runtime.env.REACT_APP_BASE_URI_CDP_V1 =
  'https://api.dev.bsport.io/customer-data-platform/v1';
window.runtime.env.REACT_APP_BASE_URI_MEMBER_EXPERIENCE_V0 =
  'https://api.dev.bsport.io/member-experience/v0';
window.runtime.env.REACT_APP_BASE_URI_MEMBER_EXPERIENCE_V1 =
  'https://api.dev.bsport.io/member-experience/v1';
window.runtime.env.REACT_APP_BASE_URI_PLATFORM_V0 =
  'https://api.dev.bsport.io/platform/v0';
window.runtime.env.REACT_APP_BASE_URI_PLATFORM_V1 =
  'https://api.dev.bsport.io/platform/v1';
window.runtime.env.REACT_APP_BASE_URI_STAFF_MANAGEMENT_V0 =
  'https://api.dev.bsport.io/staff-management/v0';
window.runtime.env.REACT_APP_BASE_URI_STAFF_MANAGEMENT_V1 =
  'https://api.dev.bsport.io/staff-management/v1';
