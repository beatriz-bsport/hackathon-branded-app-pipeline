'use strict';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const rejection_tracking = require('promise/lib/rejection-tracking');
const raf = require('raf');
const es6_promise_extensions = require('promise/lib/es6-extensions.js');
require('whatwg-fetch');

if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.

  rejection_tracking.enable();
  window.Promise = es6_promise_extensions;
}

// fetch() polyfill for making API calls.

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('object-assign');

// In tests, polyfill requestAnimationFrame since jsdom doesn't provide it yet.
// We don't polyfill it in the browser--this is user's responsibility.
if (process.env.NODE_ENV === 'test') {
  raf.polyfill(global);
  // eslint-enable global-require
}
