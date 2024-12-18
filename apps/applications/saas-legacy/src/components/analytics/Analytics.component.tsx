import React, { useEffect } from 'react';

import TagManager from 'react-gtm-module';

import type { CompanyTheme } from '#src/libs/theme/types';

type Props = {
  theme: CompanyTheme;
  isInternal?: boolean;
};

const Analytics: React.FC<Props> = ({ theme, isInternal }) => {
  const init = React.useCallback(() => {
    if (!theme) {
      return;
    }

    const gtmId = isInternal ? 'GTM-W4G3NQ6' : theme.gtmId;
    const facebookPixelId = isInternal
      ? '515094402731005'
      : theme.facebookPixelId;

    if (facebookPixelId) {
      setTimeout(() => {
        window.fbq('init', facebookPixelId);
        window.fbq('track', 'PageView');
      }, 500);
    }
    if (gtmId) {
      try {
        TagManager.initialize({
          gtmId,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [theme, isInternal]);

  useEffect(() => {
    init();
  }, [init]);

  return null;
};

export default React.memo(Analytics);
