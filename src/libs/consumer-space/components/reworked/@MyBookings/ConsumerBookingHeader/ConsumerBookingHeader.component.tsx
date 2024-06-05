import React from 'react';
import { useTranslation } from 'react-i18next';

import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { ChevronRight } from '#src/components/untitledui';
import ConsumerGenericHeader from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader';

type Props = {
  isMobile: boolean;
  onBookSessionClick: () => void;
};

export const ConsumerBookingHeader: React.FC<Props> = ({
  isMobile,
  onBookSessionClick,
}) => {
  const { t } = useTranslation('consumerSpace');
  const isWidget = WidgetUtils.isWidget();

  const headerButtons =
    isWidget || isMobile
      ? []
      : [
          {
            label: t('consumerSpace:reworked.myBookings.bookASession'),
            onClick: onBookSessionClick,
            rightIcon: <ChevronRight stroke="currentColor" />,
          },
        ];

  return (
    <ConsumerGenericHeader
      buttons={headerButtons}
      title={t('consumerSpace:reworked.myBookings.title')}
    />
  );
};

export default React.memo(ConsumerBookingHeader);
