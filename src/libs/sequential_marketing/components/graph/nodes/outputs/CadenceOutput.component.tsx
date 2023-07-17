import React from 'react';
import { useTranslation } from 'react-i18next';

import StepCard from '#components/card/StepCard.component';
import CadenceNodeTitle from '#libs/sequential_marketing/components/graph/nodes/internals/CadenceNodeTitle.component';
import {
  DestinationStatus,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';

import type { ConnectedTrigger } from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';

export type CadenceOutputProps = {
  status: DestinationStatus;
  triggerList: ConnectedTrigger[];
  isSelected?: boolean;
  disabled?: boolean;
  getSmartlist: (id: number) => SmartList;
};

type CadenceOutputHeaderProps = Omit<CadenceOutputProps, 'isSelected'>;

const CadenceOutputHeader: React.FC<CadenceOutputHeaderProps> = React.memo(
  ({ status, triggerList, disabled, getSmartlist }) => {
    const { t } = useTranslation('marketing');
    return (
      <CadenceNodeTitle
        name={
          status === DestinationStatus.WIN
            ? t('cadence.cadenceCard.win')
            : t('cadence.cadenceCard.lost')
        }
        icon={status === DestinationStatus.WIN ? 'CheckCircle' : 'Cancel'}
        color={
          status === DestinationStatus.WIN
            ? SequentialMarketingColors.ENTRY_COLOR
            : SequentialMarketingColors.LOSE_COLOR
        }
        triggerList={!!triggerList && triggerList}
        disabled={disabled}
        getSmartlist={getSmartlist}
      />
    );
  },
);

const CadenceOutput: React.FC<CadenceOutputProps> = ({
  status,
  triggerList,
  isSelected,
  disabled,
  getSmartlist,
}) => {
  return (
    <StepCard
      header={
        <CadenceOutputHeader
          status={status}
          triggerList={triggerList}
          disabled={disabled}
          getSmartlist={getSmartlist}
        />
      }
      color={
        status === DestinationStatus.WIN
          ? SequentialMarketingColors.ENTRY_BORDER_COLOR
          : SequentialMarketingColors.LOSE_BORDER_COLOR
      }
      selectedColor={
        status === DestinationStatus.WIN
          ? SequentialMarketingColors.ENTRY_COLOR
          : SequentialMarketingColors.LOSE_COLOR
      }
      isSelected={isSelected}
      disabled={disabled}
      isEmpty={!triggerList}
    />
  );
};

export default React.memo(CadenceOutput);
