import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';

import CadenceNodeContent from '#libs/sequential_marketing/components/graph/nodes/internals/CadenceNodeContent.component';
import CadenceNodeTitle from '#libs/sequential_marketing/components/graph/nodes/internals/CadenceNodeTitle.component';
import StepCard from '#components/card/StepCard.component';
import { triggerIconByKind } from '#libs/sequential_marketing/components/helpers/utils';
import {
  SequentialMarketingColors,
  TRIGGER_KIND_CHOICES,
  TriggerKind,
} from '#libs/sequential_marketing/constants';

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
  stepMemberCount?: number;
  getEmailTemplate?: (id: string) => EmailTemplateSummary;
  getTag?: (id: string) => Tag;
  onClickNewMarketingAction?: () => void;
  isPushNotificationUpsellActive?: boolean;
};

export type EntryStepCardProps = {
  disabled?: boolean;
  isFirstConfigurationMode?: boolean;
  isEntryFirstConfiguration?: boolean;
  isSelected?: boolean;
  step: CadenceStep;
  cadenceEditMode?: boolean;
  stepMemberCount?: number;
  addMarketingAction?: () => void;
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
    isPushNotificationUpsellActive,
    getEmailTemplate,
    getTag,
    onClickNewMarketingAction,
  }) => {
    return (
      <CadenceNodeContent
        addMarketingAction={
          !!onClickNewMarketingAction && onClickNewMarketingAction
        }
        getEmailTemplate={getEmailTemplate}
        getTag={getTag}
        isPushNotificationUpsellActive={isPushNotificationUpsellActive}
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
  isPushNotificationUpsellActive,
  cadenceEditMode,
  stepMemberCount,
  addMarketingAction,
  addNextStep,
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

  const onClickNewMarketingAction = useCallback(() => {
    setDisableRipple(true);
    addMarketingAction?.();
    setClickDone(true);
  }, [addMarketingAction]);

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

  return (
    <StepCard
      maxWidth
      actionListColor={SequentialMarketingColors.TRIGGER_BACKGROUND_COLOR}
      actionListLabel={t('cadence.steps.actions.nextStepTrigger')}
      addButtonActionList={!isFirstConfigurationMode && triggerActions}
      addButtonColor={SequentialMarketingColors.INNER_STEP_COLOR}
      addButtonLabel={t('cadence.steps.actions.addNextStep')}
      cadenceEditMode={cadenceEditMode}
      color={SequentialMarketingColors.ENTRY_BORDER_COLOR}
      content={
        (marketingActionList?.length > 0 ||
          (!isFirstConfigurationMode && !!addMarketingAction)) && (
          <EntryStepContent
            getEmailTemplate={getEmailTemplate}
            getTag={getTag}
            isPushNotificationUpsellActive={isPushNotificationUpsellActive}
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
      stepMemberCount={stepMemberCount}
    />
  );
};

export default React.memo(EntryStepCard);
