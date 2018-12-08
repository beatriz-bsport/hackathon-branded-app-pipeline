import * as Sentry from '@sentry/browser';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './material-dashboard-react.css';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
