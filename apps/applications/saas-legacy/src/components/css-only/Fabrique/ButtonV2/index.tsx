import React from 'react';
import Button, { ButtonStorybook } from './Button.component';
import {
  FABRIQUE_BUTTON_CONFIGURATION,
  FABRIQUE_BUTTON_PREVIEW,
} from './custom_css_variant';

export { FABRIQUE_BUTTON_CONFIGURATION, FABRIQUE_BUTTON_PREVIEW };
export { ButtonStorybook };
export type Props = React.ComponentProps<typeof Button>;
export default Button;
