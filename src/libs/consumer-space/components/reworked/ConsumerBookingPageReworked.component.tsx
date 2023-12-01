import React from 'react';

import type { ConsumerBookingReworked } from '#libs/consumer-space/types';
import type { Membership } from '#libs/membership/types';

type Props = {
  pastBookingsState: ConsumerBookingReworked;
  futureBookingsState: ConsumerBookingReworked;
  // TODO
  membership: Membership;
};

export const ConsumerBookingPageReworkedComponent: React.FC<Props> = () => {
  return null;
};

export default React.memo(ConsumerBookingPageReworkedComponent);
