import React, { useMemo } from 'react';

import ConsumerGenericHeader from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader';

import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';

type Props = {
  isMobile?: boolean;
  buttonsData: HeaderButton[];
  title: string;
};

export const PageHeaderTitle: React.FC<Props> = ({
  isMobile,
  buttonsData,
  title,
}) => {
  const buttons = useMemo(
    () => (isMobile ? [] : buttonsData),
    [isMobile, buttonsData],
  );

  return <ConsumerGenericHeader buttons={buttons} title={title} />;
};

export default React.memo(PageHeaderTitle);
