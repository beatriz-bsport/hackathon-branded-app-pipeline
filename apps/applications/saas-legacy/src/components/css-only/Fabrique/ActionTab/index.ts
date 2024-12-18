import React from 'react';

import ActionTab, { ActionTabStorybook } from './ActionTab.component';

import {
  FABRIQUE_ACTION_TAB_CONFIGURATION,
  FABRIQUE_ACTION_TAB_PREVIEW,
} from './custom_css_variant';

export { FABRIQUE_ACTION_TAB_CONFIGURATION, FABRIQUE_ACTION_TAB_PREVIEW };
export type Props = React.ComponentProps<typeof ActionTab>;
export { ActionTabStorybook };
export default ActionTab;
