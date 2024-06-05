import React from 'react';
import { useTranslation } from 'react-i18next';

import { ChevronRight } from '#src/components/untitledui';
import ConsumerGenericHeader from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';

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
