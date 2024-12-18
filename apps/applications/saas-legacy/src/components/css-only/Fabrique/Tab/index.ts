import React from 'react';

import Tab, { TabStorybook } from './Tab.component';
import {
  FABRIQUE_TAB_CONFIGURATION,
  FABRIQUE_TAB_PREVIEW,
} from './custom_css_variant';

export { FABRIQUE_TAB_CONFIGURATION, FABRIQUE_TAB_PREVIEW };
export type Props = React.ComponentProps<typeof Tab>;
export { TabStorybook };
export default Tab;
