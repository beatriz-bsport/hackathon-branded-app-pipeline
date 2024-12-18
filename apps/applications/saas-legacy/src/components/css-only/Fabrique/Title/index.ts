import React from 'react';

import Title, { TitleStorybook } from './Title.component';

import {
  FABRIQUE_TITLE_CONFIGURATION,
  FABRIQUE_TITLE_PREVIEW,
} from './custom_css_variant';

export { FABRIQUE_TITLE_CONFIGURATION, FABRIQUE_TITLE_PREVIEW };
export { TitleStorybook };

export type Props = React.ComponentProps<typeof Title>;
export default Title;
