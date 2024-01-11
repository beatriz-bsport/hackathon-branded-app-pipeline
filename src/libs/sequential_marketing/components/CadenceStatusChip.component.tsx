import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import CustomChip from '#components/chip/CustomChip.component';
import { CadenceStatusColors } from '#libs/sequential_marketing/constants';

type Props = { status: any };

const getChipInfoFromAudienceStatus = (status: any, t: TFunction) => {
  switch (status) {
    case '1':
      return {
        label: t('audience.listItem.labels.active'),
        icon: 'PlayArrow',
        color: CadenceStatusColors.SUCCESS_DEFAULT_COLOR,
      };
    case '2':
      return {
        label: t('audience.listItem.labels.paused'),
        icon: 'PlayArrow',
        color: CadenceStatusColors.INFO_DEFAULT_COLOR,
      };
    case '3':
      return {
        label: t('audience.listItem.labels.notLaunched'),
        icon: 'PlayArrow',
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
