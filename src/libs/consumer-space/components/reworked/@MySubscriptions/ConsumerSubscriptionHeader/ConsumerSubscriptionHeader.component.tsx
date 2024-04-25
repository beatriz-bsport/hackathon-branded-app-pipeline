import React from 'react';
import { useTranslation } from 'react-i18next';

import { mobileDetailsDisplay } from '#libs/consumer-space/components/reworked/@MySubscriptions/utils';
import WidgetUtils from '#libs/widget/WidgetUtils';

import { Calendar, ChevronLeft, ChevronRight } from '#components/untitledui';
import ConsumerGenericHeader from '#libs/consumer-space/components/reworked/common/ConsumerGenericHeader';
import Button from '#Fabrique/ButtonV2';

import type { ButtonColor, ButtonVariant } from '#Fabrique/ButtonV2/types';
import type { SubscriptionREST } from '#libs/subscription/types';

import './styles.css';

type Props = {
  isMobile: boolean;
  handleGoBack: () => void;
  onBookSessionClick: () => void;
  onGetASubscriptionClick: () => void;
  selectedSubscription: SubscriptionREST;
};

export const ConsumerSubscriptionHeader: React.FC<Props> = ({
  isMobile,
  handleGoBack,
  onBookSessionClick,
  onGetASubscriptionClick,
  selectedSubscription,
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
              variant: 'contained' as ButtonVariant,
              color: 'primary' as ButtonColor,
            },
          ],
    [isWidget, onGetASubscriptionClick, onBookSessionClick, t, isMobile],
  );

  return mobileDetailsDisplay(
    isMobile,
    selectedSubscription,
    <Button
      className="bs-consumer__subscription-header__button--mobile"
      color="grey"
      leftIcon={<ChevronLeft />}
      onClick={handleGoBack}
      variant="text"
    >
      {t('reworked.mySubscriptions.headerButtonsLabel.backToSubscriptions')}
    </Button>,
    <ConsumerGenericHeader
      buttons={headerButtons}
      title={t('reworked.mySubscriptions.title')}
    />,
  );
};

export default React.memo(ConsumerSubscriptionHeader);
