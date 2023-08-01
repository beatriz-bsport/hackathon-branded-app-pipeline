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
        color={SequentialMarketingColors.ENTRY_COLOR}
        getSmartlist={getSmartlist}
        icon="PlayArrow"
        name={t('cadence.triggers.start')}
        triggerList={!!triggerList && triggerList}
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
        addMarketingAction={
          !!onClickNewMarketingAction && onClickNewMarketingAction
        }
        getEmailTemplate={getEmailTemplate}
        getTag={getTag}
        marketingActionList={!!marketingActionList && marketingActionList}
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
      maxWidth
      addButtonAction={addNextStep}
      addButtonColor={SequentialMarketingColors.INNER_STEP_COLOR}
      addButtonLabel={t('cadence.steps.actions.addNextStep')}
      color={SequentialMarketingColors.ENTRY_BORDER_COLOR}
      content={
        (!!marketingActionList || !!addMarketingAction) && (
          <EntryStepContent
            getEmailTemplate={getEmailTemplate}
            getTag={getTag}
            marketingActionList={marketingActionList}
            onClickNewMarketingAction={
              !!addMarketingAction && onClickNewMarketingAction
            }
          />
        )
      }
      disabled={disabled}
      disableRipple={disableRipple}
      header={
        <EntryStepHeader
          getSmartlist={getSmartlist}
          triggerList={triggerList}
        />
      }
      isDivided={!!marketingActionList || !!addMarketingAction}
      isEmpty={!triggerList && !marketingActionList && !addMarketingAction}
      isSelected={isSelected}
      onCardClick={onCardClick}
      selectedColor={SequentialMarketingColors.ENTRY_COLOR}
    />
  );
};

export default React.memo(EntryStepCard);
