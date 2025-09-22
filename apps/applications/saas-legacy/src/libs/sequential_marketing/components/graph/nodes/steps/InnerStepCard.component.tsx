import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';

import {
  MarketingActions,
  SequentialMarketingColors,
  TRIGGER_KIND_CHOICES,
  TriggerKind,
} from '#src/libs/sequential_marketing/constants';
import { triggerIconByKind } from '#src/libs/sequential_marketing/components/helpers/utils';
import CadenceNodeContent from '#src/libs/sequential_marketing/components/graph/nodes/internals/CadenceNodeContent.component';
import CadenceNodeTitle from '#src/libs/sequential_marketing/components/graph/nodes/internals/CadenceNodeTitle.component';
import StepCard from '#src/components/card/StepCard.component';

import type { EmailTemplateSummary } from '#src/libs/email-editor/types';
import type { MenuAction } from '#src/components/menu/types';
import type { StepMarketingActions } from '#src/libs/sequential_marketing/types';
import type { StoredStep } from '#src/libs/sequential_marketing/components/graph/hooks/types';
import type { Tag } from '#src/libs/tag/types';

export type InnerStepCardProps = {
  step: StoredStep;
  isSelected?: boolean;
  disabled?: boolean;
  stepMemberCount?: number;
  onDelete: () => void;
  handleConvertIntoExit: () => void;
  onCardClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  addNextStep: (triggerKind: TriggerKind) => void;
} & InnerStepContentProps;

type InnerStepHeaderProps = {
  stepName: string;
  actions: Immutable.ImmutableArray<MenuAction>;
  handleDisableRipple: () => void;
};

type InnerStepContentProps = {
  marketingActionList?: StepMarketingActions[];
  disableAddMarketingAction?: boolean;
  addMarketingAction?: (type: MarketingActions) => void;
  editMarketingAction?: (action: StepMarketingActions) => void;
  getEmailTemplate?: (id: string) => EmailTemplateSummary;
  getTag?: (id: string) => Tag;
};

const InnerStepHeader: React.FC<InnerStepHeaderProps> = React.memo(
  ({ stepName, actions, handleDisableRipple }) => {
    return (
      <CadenceNodeTitle
        squareIcon
        actions={actions}
        color={SequentialMarketingColors.INNER_STEP_COLOR}
        handleDisableRipple={handleDisableRipple}
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
    editMarketingAction,
    getEmailTemplate,
    getTag,
  }) => {
    const isMarctingActionFull = marketingActionList?.length >= 5;

    return (
      <CadenceNodeContent
        addMarketingAction={addMarketingAction}
        disableAddMarketingAction={
          isMarctingActionFull || disableAddMarketingAction
        }
        editMarketingAction={editMarketingAction}
        getEmailTemplate={getEmailTemplate}
        getTag={getTag}
        marketingActionList={marketingActionList}
      />
    );
  },
);

const InnerStepCard: React.FC<InnerStepCardProps> = ({
  step,
  disableAddMarketingAction,
  disabled,
  isSelected,
  marketingActionList,
  stepMemberCount,
  addMarketingAction,
  addNextStep,
  editMarketingAction,
  getEmailTemplate,
  getTag,
  handleConvertIntoExit,
  onCardClick,
  onDelete,
}) => {
  const { t } = useTranslation('marketing');

  const [disableRipple, setDisableRipple] = useState(false);

  const handleDisableRipple = useCallback(() => {
    setDisableRipple(true);
  }, []);

  const onClickNewMarketingAction = useCallback(
    (type: MarketingActions) => {
      handleDisableRipple();
      addMarketingAction?.(type);
    },
    [addMarketingAction, handleDisableRipple],
  );

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
            editMarketingAction={editMarketingAction}
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
          stepName={step?.name}
        />
      }
      isDivided={!!marketingActionList || !!addMarketingAction}
      isEmpty={!marketingActionList && !addMarketingAction}
      isSelected={isSelected}
      onCardClick={onCardClick}
      selectedColor={SequentialMarketingColors.INNER_STEP_COLOR}
      stepMemberCount={stepMemberCount}
    />
  );
};

export default React.memo(InnerStepCard);
