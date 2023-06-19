import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';

import StepCard from '#components/card/StepCard.component';
import CadenceNodeTitle from '../internals/CadenceNodeTitle.component';
import CadenceNodeContent from '../internals/CadenceNodeContent.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';
import type { GlobalCadenceChip } from '#libs/sequential_marketing/types';
import type { Action } from '#components/button/MultipleActionsButton.component';

export type InnerStepCardProps = {
  stepName: string;
  marketingActionChipList?: GlobalCadenceChip[];
  addMarketingAction?: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  disableAddMarketingAction?: boolean;
  onDelete: () => void;
  handleChangeInExit: () => void;
};

type InnerStepHeaderProps = Pick<InnerStepCardProps, 'stepName'> & {
  actions: Immutable.ImmutableArray<Action>;
  handleDisableRipple: () => void;
};

type InnerStepContentProps = Pick<
  InnerStepCardProps,
  'marketingActionChipList' | 'addMarketingAction' | 'disableAddMarketingAction'
>;

const InnerStepHeader: React.FC<InnerStepHeaderProps> = React.memo(
  ({ stepName, actions, handleDisableRipple }) => {
    return (
      <CadenceNodeTitle
        name={stepName}
        icon="DeviceHub"
        color={SequentialMarketingColors.INNER_STEP_COLOR}
        actions={actions}
        disableRippleOnClick={handleDisableRipple}
        squareIcon
      />
    );
  },
);

const InnerStepContent: React.FC<InnerStepContentProps> = React.memo(
  ({
    marketingActionChipList,
    addMarketingAction,
    disableAddMarketingAction,
  }) => {
    const isMarctingActionFull =
      !!marketingActionChipList && marketingActionChipList.length >= 5;

    return (
      <CadenceNodeContent
        marketingActionChipList={
          !!marketingActionChipList && marketingActionChipList
        }
        addMarketingAction={addMarketingAction}
        disableAddMarketingAction={
          isMarctingActionFull || disableAddMarketingAction
        }
      />
    );
  },
);

const InnerStepCard: React.FC<InnerStepCardProps> = ({
  stepName,
  marketingActionChipList,
  addMarketingAction,
  isSelected,
  disabled,
  disableAddMarketingAction,
  onDelete,
  handleChangeInExit,
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

  const handleDisableRipple = useCallback(() => {
    setDisableRipple(true);
    setClickDone(true);
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
          stepName={stepName}
          actions={actions}
          handleDisableRipple={handleDisableRipple}
        />
      }
      content={
        (!!marketingActionChipList || !!addMarketingAction) && (
          <InnerStepContent
            marketingActionChipList={marketingActionChipList}
            addMarketingAction={
              !!addMarketingAction && onClickNewMarketingAction
            }
            disableAddMarketingAction={disableAddMarketingAction}
          />
        )
      }
      color={SequentialMarketingColors.INNER_STEP_BORDER_COLOR}
      selectedColor={SequentialMarketingColors.INNER_STEP_COLOR}
      isSelected={isSelected}
      disabled={disabled}
      isDivided={!!marketingActionChipList || !!addMarketingAction}
      isEmpty={!marketingActionChipList && !addMarketingAction}
      disableRipple={disableRipple}
      maxWidth
    />
  );
};

export default React.memo(InnerStepCard);
