import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import CustomChip from '#src/components/chip/CustomChip.component';
import {
  CadenceStatusColors,
  CadenceStatus,
} from '#src/libs/sequential_marketing/constants';

type Props = { status: CadenceStatus };

const getChipInfoFromAudienceStatus = (status: any, t: TFunction) => {
  switch (status) {
    case CadenceStatus.ACTIVE:
      return {
        label: t('audience.listItem.labels.active'),
        icon: 'PlayArrow',
        color: CadenceStatusColors.SUCCESS_DEFAULT_COLOR,
      };
    case CadenceStatus.PAUSED:
      return {
        label: t('audience.listItem.labels.paused'),
        icon: 'Pause',
        color: CadenceStatusColors.INFO_DEFAULT_COLOR,
      };
    case CadenceStatus.NOT_LAUNCHED:
      return {
        label: t('audience.listItem.labels.notLaunched'),
        icon: 'Stop',
        color: CadenceStatusColors.WARNING_DEFAULT_COLOR,
      };
    default:
      return {
        label: '',
        icon: '',
        color: '',
      };
  }
};

const CadenceStatusChip: React.FC<Props> = ({ status }) => {
  const { t } = useTranslation('marketing');
  const { label, color, icon } = getChipInfoFromAudienceStatus(status, t);

  return <CustomChip displayedValue={label} icon={icon} mainColor={color} />;
};

export default React.memo(CadenceStatusChip);
