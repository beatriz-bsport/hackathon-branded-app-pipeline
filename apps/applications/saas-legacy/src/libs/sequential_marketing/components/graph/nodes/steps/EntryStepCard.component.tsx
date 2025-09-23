import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';

import CadenceNodeContent from '#src/libs/sequential_marketing/components/graph/nodes/internals/CadenceNodeContent.component';
import CadenceNodeTitle from '#src/libs/sequential_marketing/components/graph/nodes/internals/CadenceNodeTitle.component';
import StepCard from '#src/components/card/StepCard.component';
import { triggerIconByKind } from '#src/libs/sequential_marketing/components/helpers/utils';
import {
  MarketingActions,
  SequentialMarketingColors,
  TRIGGER_KIND_CHOICES,
  TriggerKind,
} from '#src/libs/sequential_marketing/constants';

import type {
  CadenceStep,
  ConnectedTrigger,
  StepMarketingActions,
} from '#src/libs/sequential_marketing/types';
import type { SmartList } from '#src/libs/smart-list/types';
import type { Tag } from '#src/libs/tag/types';
import type { EmailTemplateSummary } from '#src/libs/email-editor/types';

type EntryStepHeaderProps = {
  triggerList?: ConnectedTrigger[];
  getSmartlist?: (id: number) => SmartList;
};

type EntryStepContentProps = {
  marketingActionList?: StepMarketingActions[];
  stepMemberCount?: number;
  getEmailTemplate?: (id: string) => EmailTemplateSummary;
  getTag?: (id: string) => Tag;
  // eslint-disable-next-line react/no-unused-prop-types
  onClickNewMarketingAction?: (type: MarketingActions) => void;
  editMarketingAction?: (action: StepMarketingActions) => void;
};

export type EntryStepCardProps = {
  disabled?: boolean;
  isFirstConfigurationMode?: boolean;
  isSelected?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  step: CadenceStep;
  // eslint-disable-next-line react/no-unused-prop-types
  cadenceEditMode?: boolean;
  stepMemberCount?: number;
  addMarketingAction?: (type: MarketingActions) => void;
  addNextStep: (triggerKind: TriggerKind) => void;
  onCardClick: () => void;
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
    editMarketingAction,
    getEmailTemplate,
    getTag,
    onClickNewMarketingAction,
  }) => {
    return (
      <CadenceNodeContent
        addMarketingAction={
          !!onClickNewMarketingAction && onClickNewMarketingAction
        }
        editMarketingAction={editMarketingAction}
        getEmailTemplate={getEmailTemplate}
        getTag={getTag}
        marketingActionList={!!marketingActionList && marketingActionList}
      />
    );
  },
);

const EntryStepCard: React.FC<EntryStepCardProps> = ({
  disabled,
  isFirstConfigurationMode,
  isSelected,
  marketingActionList,
  triggerList,
  stepMemberCount,
  addMarketingAction,
  addNextStep,
  editMarketingAction,
  getEmailTemplate,
  getSmartlist,
  getTag,
  onCardClick,
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

  const onClickNewMarketingAction = useCallback(
    (type: MarketingActions) => {
      setDisableRipple(true);
      addMarketingAction?.(type);
      setClickDone(true);
    },
    [addMarketingAction],
  );

  const triggerActions = React.useMemo(
    () =>
      Immutable(
        TRIGGER_KIND_CHOICES.map((triggerKind) => ({
          label: t(`cadence.triggers.kinds.${triggerKind}`),
          icon: triggerIconByKind[triggerKind],
          customColor: SequentialMarketingColors.TRIGGER_COLOR,
          onClick: () => addNextStep(triggerKind),
        })),
      ),
    [addNextStep, t],
  );

  const displayedStepMemberCount = React.useMemo(() => {
    if (isFirstConfigurationMode) {
      // Hide the displayed member count for Cadences not yet configured.
      return null;
    }
    return stepMemberCount;
  }, [isFirstConfigurationMode, stepMemberCount]);

  return (
    <StepCard
      maxWidth
      actionListColor={SequentialMarketingColors.TRIGGER_BACKGROUND_COLOR}
      actionListLabel={t('cadence.steps.actions.nextStepTrigger')}
      addButtonActionList={!isFirstConfigurationMode && triggerActions}
      addButtonColor={SequentialMarketingColors.INNER_STEP_COLOR}
      addButtonLabel={t('cadence.steps.actions.addNextStep')}
      color={SequentialMarketingColors.ENTRY_BORDER_COLOR}
      content={
        (marketingActionList?.length > 0 ||
          (!isFirstConfigurationMode && !!addMarketingAction)) && (
          <EntryStepContent
            editMarketingAction={editMarketingAction}
            getEmailTemplate={getEmailTemplate}
            getTag={getTag}
            marketingActionList={marketingActionList}
            onClickNewMarketingAction={
              !isFirstConfigurationMode &&
              !!addMarketingAction &&
              onClickNewMarketingAction
            }
          />
        )
      }
      disabled={disabled}
      disableRipple={disableRipple}
      forceSelection={isFirstConfigurationMode}
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
      stepMemberCount={displayedStepMemberCount}
    />
  );
};

export default React.memo(EntryStepCard);
