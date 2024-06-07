import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Edit03 } from '#src/components/untitledui';

import ConsumerHeaderSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerHeaderSkeleton';
import ConsumerGenericHeader from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader';
import { ConsumerProfileContext } from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileContext';

import type { ConsumerHeaderProps } from '../types';
import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';

import './styles.css';

const ConsumerProfileHeader: React.FC<ConsumerHeaderProps> = ({
  isLoading,
}) => {
  const { t } = useTranslation('consumerSpace');
  const { openEditProfilePortal } = useContext(ConsumerProfileContext);
  const buttons: HeaderButton[] = React.useMemo(
    () => [
      {
        label: t('reworked.myProfile.header.buttons.editProfile'),
        onClick: openEditProfilePortal,
        leftIcon: <Edit03 stroke="currentColor" />,
      },
    ],
    [t, openEditProfilePortal],
  );
  if (isLoading) {
    return (
      <ConsumerHeaderSkeleton className="bs-consumer-profile-page__header" />
    );
  }
  return (
    <ConsumerGenericHeader
      buttons={buttons}
      title={t('reworked.myProfile.header.title')}
    />
  );
};

export default React.memo(ConsumerProfileHeader);
