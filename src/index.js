import * as React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.scss';
import './material-dashboard-react.css';
import './sentry';

if (module.hot && process.env.NODE_ENV !== 'production') {
  // When a file change, only reload a module instead of reloading the whole page
  module.hot.accept();
}

ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
