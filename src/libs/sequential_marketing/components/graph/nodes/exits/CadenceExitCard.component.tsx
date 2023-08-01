import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';

import StepCard from '#components/card/StepCard.component';
import CadenceNodeTitle from '#libs/sequential_marketing/components/graph/nodes/internals/CadenceNodeTitle.component';
import {
  DestinationStatus,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';

import type { StoredStep } from '#libs/sequential_marketing/components/graph/hooks/types';

export type CadenceExitCardProps = {
  status: DestinationStatus;
  step: StoredStep;
  onDelete: () => void;
  handleChangeInStep: () => void;
  isSelected?: boolean;
};

type CadenceExitHeaderProps = {
  handleDisableRipple: () => void;
  handleEnableRipple: () => void;
} & Omit<CadenceExitCardProps, 'step' | 'isSelected'>;

const CadenceExitHeader: React.FC<CadenceExitHeaderProps> = React.memo(
  ({
    status,
    onDelete,
    handleChangeInStep,
    handleDisableRipple,
    handleEnableRipple,
  }) => {
    const { t } = useTranslation('marketing');

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
            label: t('cadence.steps.actions.changeInStep'),
            icon: 'Autorenew',
            onClick: onClickAction(handleChangeInStep),
          },
          {
            label: t('cadence.steps.actions.delete'),
            icon: 'Delete',
            onClick: onClickAction(onDelete),
          },
        ]),
      [handleChangeInStep, onClickAction, onDelete, t],
    );

    return (
      <CadenceNodeTitle
        actions={actions}
        color={
          status === DestinationStatus.WIN
            ? SequentialMarketingColors.ENTRY_COLOR
            : SequentialMarketingColors.LOSE_COLOR
        }
        handleDisableRipple={handleDisableRipple}
        handleEnableRipple={handleEnableRipple}
        icon={status === DestinationStatus.WIN ? 'CheckCircle' : 'Cancel'}
        name={
          status === DestinationStatus.WIN
            ? t('cadence.cadenceCard.win')
            : t('cadence.cadenceCard.lost')
        }
      />
    );
  },
);

const CadenceExitCard: React.FC<CadenceExitCardProps> = ({
  status,
  onDelete,
  handleChangeInStep,
  isSelected,
}) => {
  const [disableRipple, setDisableRipple] = useState(false);

  const handleDisableRipple = useCallback(() => {
    setDisableRipple(true);
  }, []);

  const handleEnableRipple = useCallback(() => {
    setDisableRipple(false);
  }, []);

  return (
    <StepCard
      maxWidth
      minHeight
      color={
        status === DestinationStatus.WIN
          ? SequentialMarketingColors.ENTRY_BORDER_COLOR
          : SequentialMarketingColors.LOSE_BORDER_COLOR
      }
      disableRipple={disableRipple}
      header={
        <CadenceExitHeader
          handleChangeInStep={handleChangeInStep}
          handleDisableRipple={handleDisableRipple}
          handleEnableRipple={handleEnableRipple}
          onDelete={onDelete}
          status={status}
        />
      }
      isSelected={isSelected}
      selectedColor={
        status === DestinationStatus.WIN
          ? SequentialMarketingColors.ENTRY_COLOR
          : SequentialMarketingColors.LOSE_COLOR
      }
    />
  );
};

export default React.memo(CadenceExitCard);
