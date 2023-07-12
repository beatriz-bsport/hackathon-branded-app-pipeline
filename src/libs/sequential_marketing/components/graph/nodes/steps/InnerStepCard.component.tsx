import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';

import StepCard from '#components/card/StepCard.component';
import CadenceNodeTitle from '../internals/CadenceNodeTitle.component';
import CadenceNodeContent from '../internals/CadenceNodeContent.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';

import type {
  CadenceStep,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';
import type { Action } from '#components/button/MultipleActionsButton.component';
import type { EmailTemplateSummary } from '#libs/email-editor/types';
import type { Tag } from '#libs/tag/types';

export type InnerStepCardProps = {
  step: CadenceStep;
  isSelected?: boolean;
  disabled?: boolean;
  onDelete: () => void;
  handleChangeInExit: () => void;
  onCardClick: () => void;
  addNextStep: () => void;
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
        name={stepName}
        icon="DeviceHub"
        color={SequentialMarketingColors.INNER_STEP_COLOR}
        actions={actions}
        handleDisableRipple={handleDisableRipple}
        handleEnableRipple={handleEnableRipple}
        squareIcon
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
        marketingActionList={!!marketingActionList && marketingActionList}
        addMarketingAction={addMarketingAction}
        disableAddMarketingAction={
          isMarctingActionFull || disableAddMarketingAction
        }
        getTag={getTag}
        getEmailTemplate={getEmailTemplate}
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
  handleChangeInExit,
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
    addMarketingAction();
  }, [addMarketingAction, handleDisableRipple]);

  const onClickAction = useCallback(
    (onClick: () => void) => () => {
      handleDisableRipple();
      onClick?.();
    },
    [handleDisableRipple],
  );

  const actions = useMemo(
    () =>
      Immutable([
        {
          label: t('cadence.steps.actions.changeInExit'),
          icon: 'Autorenew',
          onClick: onClickAction(handleChangeInExit),
        },
        {
          label: t('cadence.steps.actions.delete'),
          icon: 'Delete',
          onClick: onClickAction(onDelete),
        },
      ]),
    [handleChangeInExit, onClickAction, onDelete, t],
  );

  return (
    <StepCard
      header={
        <InnerStepHeader
          stepName={step?.name}
          actions={actions}
          handleDisableRipple={handleDisableRipple}
          handleEnableRipple={handleEnableRipple}
        />
      }
      content={
        ((!!marketingActionList && marketingActionList.length > 0) ||
          !!addMarketingAction) && (
          <InnerStepContent
            marketingActionList={marketingActionList}
            addMarketingAction={
              !!addMarketingAction && onClickNewMarketingAction
            }
            disableAddMarketingAction={disableAddMarketingAction}
            getTag={getTag}
            getEmailTemplate={getEmailTemplate}
          />
        )
      }
      color={SequentialMarketingColors.INNER_STEP_BORDER_COLOR}
      selectedColor={SequentialMarketingColors.INNER_STEP_COLOR}
      isSelected={isSelected}
      disabled={disabled}
      isDivided={!!marketingActionList || !!addMarketingAction}
      isEmpty={!marketingActionList && !addMarketingAction}
      disableRipple={disableRipple}
      onCardClick={onCardClick}
      addButtonAction={addNextStep}
      addButtonLabel={t('cadence.steps.actions.addNextStep')}
      addButtonColor={SequentialMarketingColors.INNER_STEP_COLOR}
      maxWidth
    />
  );
};

export default React.memo(InnerStepCard);
