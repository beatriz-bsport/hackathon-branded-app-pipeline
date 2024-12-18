import React from 'react';

import Pagination from './Pagination.component';
import {
  FABRIQUE_PAGINATION_CONFIGURATION,
  FABRIQUE_PAGINATION_PREVIEW,
} from './custom_css_variant';

export { FABRIQUE_PAGINATION_CONFIGURATION, FABRIQUE_PAGINATION_PREVIEW };
export type Props = React.ComponentProps<typeof Pagination>;
export default Pagination;
