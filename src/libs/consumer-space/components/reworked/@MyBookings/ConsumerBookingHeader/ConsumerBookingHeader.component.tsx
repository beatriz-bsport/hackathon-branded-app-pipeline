import React from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerGenericHeader from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader';
import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';

type Props = {
  isMobile: boolean;
  buttonsData: HeaderButton[];
};

export const ConsumerBookingHeader: React.FC<Props> = ({
  isMobile,
  buttonsData,
}) => {
  const { t } = useTranslation('consumerSpace');

  const headerButtons = isMobile ? [] : buttonsData;

  return (
    <ConsumerGenericHeader
      buttons={headerButtons}
      title={t('consumerSpace:reworked.myBookings.title')}
    />
  );
};

export default React.memo(ConsumerBookingHeader);
