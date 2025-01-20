import React from 'react';
import type { CompanyTheme } from '#src/libs/theme/types';
// @ts-expect-error
import i18n from '#src/i18n/index';
import Config from '#src/config';

import { getCurrentLanguageIsoCode } from '#src/utils/language';

type Props = {
  companyTheme?: CompanyTheme;
  userAuthState: any;
};

const FeatureBaseComponent: React.FC<Props> = ({
  companyTheme,
  userAuthState,
}) => {
  const [isFeatureBaseAuthenticated, setIsFeatureBaseAuthenticated] =
    React.useState(false);

  React.useEffect(() => {
    const win = window as any;
    const { language } = i18n;
    const isoLanguage = getCurrentLanguageIsoCode(language);

    if (userAuthState && companyTheme) {
      win.Featurebase(
        'identify',
        {
          // Each 'identify' call should include an "organization" property,
          // which is your Featurebase board's name before the ".featurebase.app".
          organization: 'bsport',
          email: userAuthState.username,
          name: userAuthState.name,
          id: '123456',
          profilePicture: companyTheme?.cover,
          companies: [
            {
              id: `${companyTheme?.company}`, // required
              name: companyTheme?.company_name, // required
              customFields: {
                language: isoLanguage,
                currency: companyTheme.currency,
                franchisor: `${companyTheme.franchisor}`,
                isPremium: `${companyTheme.is_premium}`,
                locale: companyTheme.locale,
                timezone: companyTheme?.timezone_name,
              },
            },
          ],
        },
        (err: any) => {
          !err && setIsFeatureBaseAuthenticated(true);
          err && console.error(err);
        },
      );
    }
  }, [companyTheme, userAuthState]);

  React.useEffect(() => {
    if (isFeatureBaseAuthenticated) {
      const win = window as any;

      win?.Featurebase('embed', {
        organization: 'bsport',
        /* Optional */
        basePath: null, // Sync urls between your website & our embed. Example: '/feedback'. Refer to the url synchronizing section below to learn more
        // Aesthetic or Display
        theme: 'light', // options: light [default], dark. Remove for auto.
        initialPage: 'Board', // options: Board [default], Changelog, Roadmap
        hideMenu: true, // Hides the top navigation bar
        hideLogo: true, // Hides the logo in the top navigation bar & leaves the Sign In button visible.
        filters: null, // Default filters to apply to the board view. Copy the filters from the URL when you have the filters you want selected. Example: 'b=63f827df2d62cb301468aac4&sortBy=upvotes:desc'
        jwtToken: null, // Automatically sign in a user with a JWT token. See the JWT section below.
        metadata: {
          environement: Config.REACT_APP_SENTRY_ENVIRONMENT,
        },
      });
    }
  });

  return (
    <>{isFeatureBaseAuthenticated && <div data-featurebase-embed></div>}</>
  );
};

export default React.memo(FeatureBaseComponent);
