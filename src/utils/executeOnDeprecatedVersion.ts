import axios from 'axios';

import RELEASE_VERSION from '../release';

// Check every 10 minutes
const TIMING = 60 * 1000 * 10;

// Check the version and update if the sha differ
const executeOnDeprecatedVersion = (onDeprecation: () => void) => {
  setTimeout(() => {
    axios
      .get('/version.json', {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      })
      .then((res) => {
        if (res.data !== RELEASE_VERSION) {
          onDeprecation && onDeprecation();
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        executeOnDeprecatedVersion(onDeprecation);
      });
  }, TIMING);
};

export default executeOnDeprecatedVersion;
