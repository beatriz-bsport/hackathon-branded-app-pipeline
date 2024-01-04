import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerGenericHeader from '#libs/consumer-space/components/reworked/common/ConsumerGenericHeader';
import { Calendar, ChevronRight } from '#components/untitledui';

import type { HeaderButton } from '#libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';

type Props = {
  onBookSessionClick: () => void;
  onByANewPassClick: () => void;
};

export const ConsumerPassTitleAndButtons: React.FC<Props> = ({
  onBookSessionClick,
  onByANewPassClick,
}) => {
  const { t } = useTranslation('consumerSpace');

  const buttons: HeaderButton[] = useMemo(
    () => [
      {
        label: t('reworked.myPasses.bookASession'),
        onClick: onBookSessionClick,
        variant: 'outlined',
        color: 'grey',
        leftIcon: <Calendar stroke="currentColor" />,
      },
      {
        label: t('reworked.myPasses.buyANewPass'),
        onClick: onByANewPassClick,
        rightIcon: <ChevronRight stroke="currentColor" />,
      },
    ],
    [onBookSessionClick, onByANewPassClick, t],
  );

  return (
    <ConsumerGenericHeader
      buttons={buttons}
      title={t('reworked.myPasses.title')}
    />
  );
};

export default React.memo(ConsumerPassTitleAndButtons);
