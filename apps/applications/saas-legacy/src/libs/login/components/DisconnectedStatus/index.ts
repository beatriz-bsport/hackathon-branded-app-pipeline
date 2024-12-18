import React from 'react';

import DisconnectedStatus from './DisconnectedStatus.component';

export {
  AUTHENTICATION_DISCONNECTED_STATUS_CONFIGURATION,
  AUTHENTICATION_DISCONNECTED_STATUS_PREVIEW,
} from './custom_css_variant';
export { DisconnectedStatus };

export type Props = React.ComponentProps<typeof DisconnectedStatus>;
export default DisconnectedStatus;
