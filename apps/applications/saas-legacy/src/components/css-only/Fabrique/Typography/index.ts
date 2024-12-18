import React from 'react';

import Typography, { TypographyStorybook } from './Typography.component';

import {
  FABRIQUE_TYPOGRAPHY_CONFIGURATION,
  FABRIQUE_TYPOGRAPHY_PREVIEW,
} from './custom_css_variant';

export { FABRIQUE_TYPOGRAPHY_CONFIGURATION, FABRIQUE_TYPOGRAPHY_PREVIEW };
export { TypographyStorybook };

export type Props = React.ComponentProps<typeof Typography>;
export default Typography;
