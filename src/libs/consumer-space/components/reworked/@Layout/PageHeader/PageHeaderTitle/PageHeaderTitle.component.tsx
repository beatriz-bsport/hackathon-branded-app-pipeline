import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerGenericHeader from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader';

import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';

type Props = {
  isMobile?: boolean;
  buttonsData: HeaderButton[];
};

export const PageHeaderTitle: React.FC<Props> = ({ isMobile, buttonsData }) => {
  const { t } = useTranslation('consumerSpace');

  const buttons = useMemo(
    () => (isMobile ? [] : buttonsData),
    [isMobile, buttonsData],
  );

  return (
    <ConsumerGenericHeader
      buttons={buttons}
      title={t('reworked.myPasses.title')}
    />
  );
};

export default React.memo(PageHeaderTitle);
