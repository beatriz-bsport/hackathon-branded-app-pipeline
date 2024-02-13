import React from 'react';
import { useTranslation } from 'react-i18next';

import WidgetUtils from '#libs/widget/WidgetUtils';
import { Calendar, ChevronRight } from '#components/untitledui';
import ConsumerGenericHeader from '#libs/consumer-space/components/reworked/common/ConsumerGenericHeader';
import type { ButtonColor, ButtonVariant } from '#Fabrique/ButtonV2/types';

type Props = {
  isMobile: boolean;
  onBookSessionClick: () => void;
  onGetASubscriptionClick: () => void;
};

export const ConsumerSubscriptionHeader: React.FC<Props> = ({
  isMobile,
  onBookSessionClick,
  onGetASubscriptionClick,
}) => {
  const { t } = useTranslation('consumerSpace');
  const isWidget = WidgetUtils.isWidget();

  const headerButtons = React.useMemo(
    () =>
      isWidget || isMobile
        ? []
        : [
            {
              label: t(
                'reworked.mySubscriptions.headerButtonsLabel.bookASession',
              ),
              onClick: onBookSessionClick,
              leftIcon: <Calendar stroke="currentColor" />,
              variant: 'outlined' as ButtonVariant,
              color: 'grey' as ButtonColor,
            },

            {
              label: t(
                'reworked.mySubscriptions.headerButtonsLabel.getSubscription',
              ),
              onClick: onGetASubscriptionClick,
              rightIcon: <ChevronRight stroke="currentColor" />,
              variant: 'outlined' as ButtonVariant,
              color: 'primary' as ButtonColor,
            },
          ],
    [isWidget, onGetASubscriptionClick, onBookSessionClick, t, isMobile],
  );

  return (
    <ConsumerGenericHeader
      buttons={headerButtons}
      title={t('reworked.mySubscriptions.title')}
    />
  );
};

export default React.memo(ConsumerSubscriptionHeader);
