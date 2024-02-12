import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerGenericHeader from '#libs/consumer-space/components/reworked/common/ConsumerGenericHeader';
import { Calendar, ChevronRight } from '#components/untitledui';

import type { HeaderButton } from '#libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';

type Props = {
  isMobile?: boolean;
  isWidget?: boolean;
  onBookSessionClick: () => void;
  handleBuyNewPass: () => void;
};

export const ConsumerPassTitleAndButtons: React.FC<Props> = ({
  isMobile,
  isWidget,
  onBookSessionClick,
  handleBuyNewPass,
}) => {
  const { t } = useTranslation('consumerSpace');

  const buttons: HeaderButton[] = useMemo(
    () =>
      isWidget || isMobile
        ? []
        : [
            {
              label: t('reworked.myPasses.bookASession'),
              onClick: onBookSessionClick,
              variant: 'outlined',
              color: 'grey',
              leftIcon: <Calendar stroke="currentColor" />,
            },
            {
              label: t('reworked.myPasses.buyANewPass'),
              onClick: handleBuyNewPass,
              rightIcon: <ChevronRight stroke="currentColor" />,
            },
          ],
    [onBookSessionClick, handleBuyNewPass, t, isMobile, isWidget],
  );

  return (
    <ConsumerGenericHeader
      buttons={buttons}
      title={t('reworked.myPasses.title')}
    />
  );
};

export default React.memo(ConsumerPassTitleAndButtons);
