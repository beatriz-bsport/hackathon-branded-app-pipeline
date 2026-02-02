import React from 'react';
import { useTranslation } from 'react-i18next';

import StepCard from '#src/components/card/StepCard.component';
import CadenceNodeTitle from '#src/libs/sequential_marketing/components/graph/nodes/internals/CadenceNodeTitle.component';
import {
  DestinationStatus,
  SequentialMarketingColors,
} from '#src/libs/sequential_marketing/constants';

import type { ConnectedTrigger } from '#src/libs/sequential_marketing/types';
import type { SmartList } from '#src/libs/smart-list/types';

export type CadenceOutputProps = {
  status: DestinationStatus;
  triggerList: ConnectedTrigger[];
  disabled?: boolean;
  buttonDisabled?: boolean;
  forceSelection?: boolean;
  isSelected?: boolean;
  getSmartlist: (id: number) => SmartList;
  onCardClick?: () => void;
};

type CadenceOutputHeaderProps = Omit<
  CadenceOutputProps,
  'isSelected' | 'onCardClick'
>;

const CadenceOutputHeader: React.FC<CadenceOutputHeaderProps> = React.memo(
  ({ status, triggerList, disabled, getSmartlist }) => {
    const { t } = useTranslation('marketing');
    return (
      <CadenceNodeTitle
        color={
          status === DestinationStatus.WIN
            ? SequentialMarketingColors.ENTRY_COLOR
            : SequentialMarketingColors.LOSE_COLOR
        }
        disabled={disabled}
        getSmartlist={getSmartlist}
        icon={status === DestinationStatus.WIN ? 'CheckCircle' : 'Cancel'}
        name={
          status === DestinationStatus.WIN
            ? t('cadence.cadenceCard.win')
            : t('cadence.cadenceCard.lost')
        }
        triggerList={!!triggerList && triggerList}
      />
    );
  },
);

const CadenceOutput: React.FC<CadenceOutputProps> = ({
  status,
  triggerList,
  disabled,
  buttonDisabled,
  forceSelection,
  isSelected,
  getSmartlist,
  onCardClick,
}) => {
  return (
    <StepCard
      color={
        status === DestinationStatus.WIN
          ? SequentialMarketingColors.ENTRY_BORDER_COLOR
          : SequentialMarketingColors.LOSE_BORDER_COLOR
      }
      disabled={disabled || buttonDisabled}
      forceSelection={forceSelection}
      header={
        <CadenceOutputHeader
          disabled={disabled}
          getSmartlist={getSmartlist}
          status={status}
          triggerList={triggerList}
        />
      }
      isEmpty={!triggerList}
      isSelected={isSelected}
      onCardClick={onCardClick}
      selectedColor={
        status === DestinationStatus.WIN
          ? SequentialMarketingColors.ENTRY_COLOR
          : SequentialMarketingColors.LOSE_COLOR
      }
    />
  );
};

export default React.memo(CadenceOutput);
