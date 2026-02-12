import { useEffect } from 'react';

// @ts-expect-error
import withSentryErrorReporting from '#src/hocs/error-boundary-hidden.hoc';
import { Theme } from '#src/libs/theme/types';
import { initIntercomWidget } from '@bsport/intercom';

type Props = {
  userId: number;
  environment: string;
  role: string;
  theme?: Theme;
  email: string;
  userName: string;
};

export const FORCE_DISPLAY_FOR_TESTING = false;

export const IntercomComponent = (props: Props): null => {
  const shouldHideENV = !['production', 'staging'].includes(props.environment);
  const shouldHideTHEME = props.theme?.hide_intercom;
  const hideIntercom =
    (shouldHideENV || shouldHideTHEME) && !FORCE_DISPLAY_FOR_TESTING;
  const { email, theme, role, environment, userName, userId } = props;

  useEffect(() => {
    if (hideIntercom) {
      return;
    }
    if (email && theme?.company && role && userName && userId) {
      const companyId = theme?.company ?? 0;
      const companyName = theme.company_name;
      const userRole = role ?? '';
      const companyLocale = theme.locale;
      const colorOverride = theme.primary_color;

      initIntercomWidget({
        companyId: companyId,
        companyName: companyName,
        name: userName,
        companyLocale,
        email,
        role: userRole,
        environment: environment,
        actionColor: colorOverride,
      });
    }
  }, [hideIntercom, theme?.company, role, email, userName, userId]);

  return null;
};

export default withSentryErrorReporting(IntercomComponent);
