import React from 'react';

import Blanket, { BlanketStorybook } from './Blanket.component';
import {
  FABRIQUE_BLANKET_CONFIGURATION,
  FABRIQUE_BLANKET_PREVIEW,
} from './custom_css_variant';

export { FABRIQUE_BLANKET_CONFIGURATION, FABRIQUE_BLANKET_PREVIEW };
export type Props = React.ComponentProps<typeof Blanket>;
export { BlanketStorybook };
export default Blanket;
