import * as Sentry from '@sentry/browser';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './material-dashboard-react.css';

Sentry.init({
  dsn: '', //'https://88b735c4d80f4f83b12e79ed072f8f4e@sentry.io/1331952',
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
