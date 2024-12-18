import React from 'react';
import IconButton, { IconButtonStorybook } from './IconButton.component';
import {
  FABRIQUE_ICON_BUTTON_CONFIGURATION,
  FABRIQUE_ICON_BUTTON_PREVIEW,
} from './custom_css_variant';

export { FABRIQUE_ICON_BUTTON_CONFIGURATION, FABRIQUE_ICON_BUTTON_PREVIEW };
export { IconButtonStorybook };
export type Props = React.ComponentProps<typeof IconButton>;
export default IconButton;
