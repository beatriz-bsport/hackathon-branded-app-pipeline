import React from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerGenericHeader from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader';

import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';

type Props = {
  buttonsData: HeaderButton[];
  isMobile: boolean;
};

export const ConsumerInvoiceTitleWithAction: React.FC<Props> = ({
  buttonsData,
  isMobile,
}) => {
  const { t } = useTranslation('consumerSpace');

  const buttons = isMobile ? [] : buttonsData;

  return (
    <ConsumerGenericHeader
      buttons={buttons}
      title={t('reworked.myInvoices.header.title')}
    />
  );
};

export default React.memo(ConsumerInvoiceTitleWithAction);
