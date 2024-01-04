import React from 'react';
import { useTranslation } from 'react-i18next';

import WidgetUtils from '#libs/widget/WidgetUtils';
import { ChevronRight } from '#components/untitledui';
import ConsumerGenericHeader from '#libs/consumer-space/components/reworked/common/ConsumerGenericHeader';

type Props = {
  onBookSessionClick: () => void;
};

export const ConsumerBookingHeader: React.FC<Props> = ({
  onBookSessionClick,
}) => {
  const { t } = useTranslation('consumerSpace');
  const isWidget = WidgetUtils.isWidget();

  const headerButtons = isWidget
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
