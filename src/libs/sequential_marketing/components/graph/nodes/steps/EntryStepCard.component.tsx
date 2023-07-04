import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import StepCard from '#components/card/StepCard.component';
import CadenceNodeTitle from '../internals/CadenceNodeTitle.component';
import CadenceNodeContent from '../internals/CadenceNodeContent.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';

import type {
  CadenceStep,
  ConnectedTrigger,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';
import type { Tag } from '#libs/tag/types';
import type { EmailTemplateSummary } from '#libs/email-editor/types';

type EntryStepHeaderProps = {
  triggerList?: ConnectedTrigger[];
  getSmartlist?: (id: number) => SmartList;
};

type EntryStepContentProps = {
  marketingActionList?: StepMarketingActions[];
  onClickNewMarketingAction?: () => void;
  getTag?: (id: string) => Tag;
  getEmailTemplate?: (id: string) => EmailTemplateSummary;
};

export type EntryStepCardProps = {
  step: CadenceStep;
  onCardClick: () => void;
  addNextStep: () => void;
  addMarketingAction?: () => void;
  isSelected?: boolean;
  disabled?: boolean;
} & Omit<EntryStepHeaderProps, 'onClickNewMarketingAction'> &
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
    marketingActionList,
    onClickNewMarketingAction,
    getTag,
    getEmailTemplate,
  }) => {
    return (
      <CadenceNodeContent
        marketingActionList={!!marketingActionList && marketingActionList}
        addMarketingAction={
          !!onClickNewMarketingAction && onClickNewMarketingAction
        }
        getTag={getTag}
        getEmailTemplate={getEmailTemplate}
      />
    );
  },
);

const EntryStepCard: React.FC<EntryStepCardProps> = ({
  triggerList,
  marketingActionList,
  isSelected,
  disabled,
  getTag,
  getEmailTemplate,
  addMarketingAction,
  getSmartlist,
  onCardClick,
  addNextStep,
}) => {
  const { t } = useTranslation('marketing');

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
    addMarketingAction?.();
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
        (!!marketingActionList || !!addMarketingAction) && (
          <EntryStepContent
            marketingActionList={marketingActionList}
            onClickNewMarketingAction={
              !!addMarketingAction && onClickNewMarketingAction
            }
            getTag={getTag}
            getEmailTemplate={getEmailTemplate}
          />
        )
      }
      color={SequentialMarketingColors.ENTRY_BORDER_COLOR}
      selectedColor={SequentialMarketingColors.ENTRY_COLOR}
      isSelected={isSelected}
      disabled={disabled}
      isDivided={!!marketingActionList || !!addMarketingAction}
      isEmpty={!triggerList && !marketingActionList && !addMarketingAction}
      disableRipple={disableRipple}
      onCardClick={onCardClick}
      addButtonAction={addNextStep}
      addButtonLabel={t('cadence.steps.actions.addNextStep')}
      addButtonColor={SequentialMarketingColors.INNER_STEP_COLOR}
      maxWidth
    />
  );
};

export default React.memo(EntryStepCard);
