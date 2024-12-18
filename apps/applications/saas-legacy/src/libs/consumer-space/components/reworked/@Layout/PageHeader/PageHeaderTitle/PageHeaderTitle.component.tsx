import React from 'react';

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
  return (
    <ConsumerGenericHeader
      buttons={buttonsData}
      isMobile={isMobile}
      title={title}
    />
  );
};

export default React.memo(PageHeaderTitle);
