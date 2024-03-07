import React from 'react';
import { useTranslation } from 'react-i18next';

import { ChevronRight } from '#components/untitledui';
import ConsumerGenericHeader from '#libs/consumer-space/components/reworked/common/ConsumerGenericHeader';
import WidgetUtils from '#libs/widget/WidgetUtils';

import type { HeaderButton } from '#libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';

type Props = {
  isMobile?: boolean;
  onBookSessionClick: () => void;
};

export const ConsumerInvoiceTitleWithAction: React.FC<Props> = ({
  isMobile,
  onBookSessionClick,
}) => {
  const { t } = useTranslation('consumerSpace');
  const isWidget = WidgetUtils.isWidget();

  const buttons: HeaderButton[] = React.useMemo(
    () =>
      isWidget || isMobile
        ? []
        : [
            {
              label: t('reworked.myInvoices.header.buttons.bookSession'),
              onClick: onBookSessionClick,
              rightIcon: <ChevronRight stroke="currentColor" />,
            },
          ],
    [onBookSessionClick, t, isMobile, isWidget],
  );

  return (
    <ConsumerGenericHeader
      buttons={buttons}
      title={t('reworked.myInvoices.header.title')}
    />
  );
};

export default React.memo(ConsumerInvoiceTitleWithAction);
