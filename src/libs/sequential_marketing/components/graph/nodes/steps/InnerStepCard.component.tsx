import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';

import {
  SequentialMarketingColors,
  TRIGGER_KIND_CHOICES,
  TriggerKind,
} from '#libs/sequential_marketing/constants';
import { triggerIconByKind } from '#libs/sequential_marketing/components/helpers/utils';
import CadenceNodeContent from '#libs/sequential_marketing/components/graph/nodes/internals/CadenceNodeContent.component';
import CadenceNodeTitle from '#libs/sequential_marketing/components/graph/nodes/internals/CadenceNodeTitle.component';
import StepCard from '#components/card/StepCard.component';

import type {
  CadenceStep,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';
import type { Action } from '#components/menu/icon';
import type { EmailTemplateSummary } from '#libs/email-editor/types';
import type { Tag } from '#libs/tag/types';

export type InnerStepCardProps = {
  step: CadenceStep;
  isSelected?: boolean;
  disabled?: boolean;
  onDelete: () => void;
  handleConvertIntoExit: () => void;
  onCardClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  addNextStep: (triggerKind: TriggerKind) => void;
} & InnerStepContentProps;

type InnerStepHeaderProps = {
  stepName: string;
  actions: Immutable.ImmutableArray<Action>;
  handleDisableRipple: () => void;
  handleEnableRipple: () => void;
};

type InnerStepContentProps = {
  marketingActionList?: StepMarketingActions[];
  disableAddMarketingAction?: boolean;
  addMarketingAction?: () => void;
  getTag?: (id: string) => Tag;
  getEmailTemplate?: (id: string) => EmailTemplateSummary;
};

const InnerStepHeader: React.FC<InnerStepHeaderProps> = React.memo(
  ({ stepName, actions, handleDisableRipple, handleEnableRipple }) => {
    return (
      <CadenceNodeTitle
        squareIcon
        actions={actions}
        color={SequentialMarketingColors.INNER_STEP_COLOR}
        handleDisableRipple={handleDisableRipple}
        handleEnableRipple={handleEnableRipple}
        icon="DeviceHub"
        name={stepName}
      />
    );
  },
);

const InnerStepContent: React.FC<InnerStepContentProps> = React.memo(
  ({
    marketingActionList,
    disableAddMarketingAction,
    addMarketingAction,
    getTag,
    getEmailTemplate,
  }) => {
    const isMarctingActionFull =
      !!marketingActionList && marketingActionList.length >= 5;

    return (
      <CadenceNodeContent
        addMarketingAction={addMarketingAction}
        disableAddMarketingAction={
          isMarctingActionFull || disableAddMarketingAction
        }
        getEmailTemplate={getEmailTemplate}
        getTag={getTag}
        marketingActionList={!!marketingActionList && marketingActionList}
      />
    );
  },
);

const InnerStepCard: React.FC<InnerStepCardProps> = ({
  step,
  marketingActionList,
  isSelected,
  disabled,
  disableAddMarketingAction,
  addMarketingAction,
  getTag,
  getEmailTemplate,
  onDelete,
  handleConvertIntoExit,
  onCardClick,
  addNextStep,
}) => {
  const { t } = useTranslation('marketing');

  const [disableRipple, setDisableRipple] = useState(false);

  const handleDisableRipple = useCallback(() => {
    setDisableRipple(true);
  }, []);

  const handleEnableRipple = useCallback(() => {
    setDisableRipple(false);
  }, []);

  const onClickNewMarketingAction = useCallback(() => {
    handleDisableRipple();
    addMarketingAction?.();
  }, [addMarketingAction, handleDisableRipple]);

  const onClickAction = useCallback(
    (onClick: (anchor?: HTMLElement) => void) => (anchor?: HTMLElement) => {
      handleDisableRipple();
      onClick?.(anchor);
    },
    [handleDisableRipple],
  );

  const actions = useMemo(
    () =>
      Immutable([
        {
          label: t('cadence.steps.actions.convertIntoExit'),
          icon: 'Autorenew',
          onClick: onClickAction(handleConvertIntoExit),
        },
        {
          label: t('cadence.steps.actions.delete'),
          icon: 'Delete',
          onClick: onClickAction(onDelete),
        },
      ]),
    [handleConvertIntoExit, onClickAction, onDelete, t],
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

  return (
    <StepCard
      maxWidth
      actionListColor={SequentialMarketingColors.TRIGGER_BACKGROUND_COLOR}
      actionListLabel={t('cadence.steps.actions.nextStepTrigger')}
      addButtonActionList={triggerActions}
      addButtonColor={SequentialMarketingColors.INNER_STEP_COLOR}
      addButtonLabel={t('cadence.steps.actions.addNextStep')}
      color={SequentialMarketingColors.INNER_STEP_BORDER_COLOR}
      content={
        ((!!marketingActionList && marketingActionList.length > 0) ||
          !!addMarketingAction) && (
          <InnerStepContent
            addMarketingAction={
              !!addMarketingAction && onClickNewMarketingAction
            }
            disableAddMarketingAction={disableAddMarketingAction}
            getEmailTemplate={getEmailTemplate}
            getTag={getTag}
            marketingActionList={marketingActionList}
          />
        )
      }
      disabled={disabled}
      disableRipple={disableRipple}
      header={
        <InnerStepHeader
          actions={actions}
          handleDisableRipple={handleDisableRipple}
          handleEnableRipple={handleEnableRipple}
          stepName={step?.name}
        />
      }
      isDivided={!!marketingActionList || !!addMarketingAction}
      isEmpty={!marketingActionList && !addMarketingAction}
      isSelected={isSelected}
      onCardClick={onCardClick}
      selectedColor={SequentialMarketingColors.INNER_STEP_COLOR}
    />
  );
};

export default React.memo(InnerStepCard);
