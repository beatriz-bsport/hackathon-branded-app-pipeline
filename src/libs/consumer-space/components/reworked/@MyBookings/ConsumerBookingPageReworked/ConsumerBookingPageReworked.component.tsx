import React from 'react';

import MarketplacePageContent from '#components/css-only/MarketplacePageContent';

import type { ConsumerBookingReworked } from '#libs/consumer-space/types';

import './styles.css';

type Props = {
  pastBookingsState: ConsumerBookingReworked;
  futureBookingsState: ConsumerBookingReworked;
};

export const ConsumerBookingPageReworkedComponent: React.FC<Props> = () => {
  return (
    <MarketplacePageContent>
      <div className="bs-consumer-page-root" />
    </MarketplacePageContent>
  );
};

export default React.memo(ConsumerBookingPageReworkedComponent);
