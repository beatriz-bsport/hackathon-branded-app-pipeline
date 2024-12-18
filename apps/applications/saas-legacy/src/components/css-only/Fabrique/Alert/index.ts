import React from 'react';

import Alert, { AlertStorybook } from './Alert.component';

import {
  FABRIQUE_ALERT_CONFIGURATION,
  FABRIQUE_ALERT_PREVIEW,
} from './custom_css_variant';

export { FABRIQUE_ALERT_CONFIGURATION, FABRIQUE_ALERT_PREVIEW };
export { AlertStorybook };

export type Props = React.ComponentProps<typeof Alert>;
export default Alert;
