import './index.scss';
import './index';
import './material-dashboard-react.css';
import './sentry';
import './elastic-apm';

if (module.hot && process.env.NODE_ENV !== 'production') {
  // When a file change, only reload a module instead of reloading the whole page
  module.hot.accept();
}
