import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import StepCard from '#components/card/StepCard.component';
import CadenceNodeTitle from '../internals/CadenceNodeTitle.component';
import CadenceNodeContent from '../internals/CadenceNodeContent.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';
import {
  type ConnectedTrigger,
  type GlobalCadenceChip,
} from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';

type EntryStepHeaderProps = {
  triggerList?: ConnectedTrigger[];
  getSmartlist?: (id: number) => SmartList;
};

type EntryStepContentProps = {
  marketingActionChipList?: GlobalCadenceChip[];
  addMarketingAction?: () => void;
  onClickNewMarketingAction: () => void;
};

export type EntryStepCardProps = {
  isSelected?: boolean;
  disabled?: boolean;
} & EntryStepHeaderProps &
  EntryStepContentProps;

const EntryStepHeader: React.FC<EntryStepHeaderProps> = React.memo(
  ({ triggerList, getSmartlist }) => {
    const { t } = useTranslation('marketing');

    return (
      <CadenceNodeTitle
        name={t('cadence.triggers.start')}
        icon="PlayArrow"
        color={SequentialMarketingColors.ENTRY_COLOR}
        triggerList={!!triggerList && triggerList}
        getSmartlist={getSmartlist}
      />
    );
  },
);

const EntryStepContent: React.FC<EntryStepContentProps> = React.memo(
  ({
    marketingActionChipList,
    addMarketingAction,
    onClickNewMarketingAction,
  }) => {
    return (
      <CadenceNodeContent
        marketingActionChipList={
          !!marketingActionChipList && marketingActionChipList
        }
        addMarketingAction={!!addMarketingAction && onClickNewMarketingAction}
      />
    );
  },
);

const EntryStepCard: React.FC<EntryStepCardProps> = ({
  triggerList,
  marketingActionChipList,
  isSelected,
  disabled,
  addMarketingAction,
  getSmartlist,
}) => {
  const [disableRipple, setDisableRipple] = useState(false);
  const [clickDone, setClickDone] = useState(false);

  useEffect(() => {
    if (clickDone) {
      setDisableRipple(false);
      setClickDone(false);
    }
  }, [clickDone]);

  const onClickNewMarketingAction = useCallback(() => {
    setDisableRipple(true);
    addMarketingAction();
    setClickDone(true);
  }, [addMarketingAction]);

  return (
    <StepCard
      header={
        <EntryStepHeader
          triggerList={triggerList}
          getSmartlist={getSmartlist}
        />
      }
      content={
        (!!marketingActionChipList || !!addMarketingAction) && (
          <EntryStepContent
            marketingActionChipList={marketingActionChipList}
            addMarketingAction={addMarketingAction}
            onClickNewMarketingAction={onClickNewMarketingAction}
          />
        )
      }
      color={SequentialMarketingColors.ENTRY_BORDER_COLOR}
      selectedColor={SequentialMarketingColors.ENTRY_COLOR}
      isSelected={isSelected}
      disabled={disabled}
      isDivided={!!marketingActionChipList || !!addMarketingAction}
      isEmpty={!triggerList && !marketingActionChipList && !addMarketingAction}
      disableRipple={disableRipple}
      maxWidth
    />
  );
};

export default React.memo(EntryStepCard);
