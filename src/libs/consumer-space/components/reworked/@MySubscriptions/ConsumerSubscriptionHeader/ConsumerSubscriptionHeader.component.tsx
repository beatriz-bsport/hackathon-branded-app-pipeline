import React from 'react';
import { useTranslation } from 'react-i18next';

import { mobileDetailsDisplay } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/utils';

import { ChevronLeft } from '#src/components/untitledui';
import ConsumerGenericHeader from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader';
import Button from '#Fabrique/ButtonV2';

import type { SubscriptionREST } from '#src/libs/subscription/types';
import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';

import './styles.css';

type Props = {
  buttonsData: HeaderButton[];
  isMobile: boolean;
  handleGoBack: () => void;
  selectedSubscription: SubscriptionREST;
};

export const ConsumerSubscriptionHeader: React.FC<Props> = ({
  buttonsData,
  isMobile,
  handleGoBack,
  selectedSubscription,
}) => {
  const { t } = useTranslation('consumerSpace');

  const buttons = isMobile ? [] : buttonsData;

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
      buttons={buttons}
      title={t('reworked.mySubscriptions.title')}
    />,
  );
};

export default React.memo(ConsumerSubscriptionHeader);
