import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';

import StepCard from '#components/card/StepCard.component';
import CadenceNodeTitle from '#libs/sequential_marketing/components/graph/nodes/internals/CadenceNodeTitle.component';
import {
  DestinationStatus,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';

export type CadenceExitCardProps = {
  status: DestinationStatus;
  onDelete: () => void;
  onEdit: () => void;
  handleConvertIntoStep: () => void;
  isSelected?: boolean;
};

type CadenceExitHeaderProps = {
  handleDisableRipple: () => void;
} & Omit<CadenceExitCardProps, 'isSelected'>;

const CadenceExitHeader: React.FC<CadenceExitHeaderProps> = React.memo(
  ({
    status,
    onDelete,
    onEdit,
    handleConvertIntoStep,
    handleDisableRipple,
  }) => {
    const { t } = useTranslation('marketing');

    const onClickAction = useCallback(
      (onClick: () => void) => () => {
        handleDisableRipple?.();
        onClick?.();
      },
      [handleDisableRipple],
    );

    const actions = useMemo(
      () =>
        Immutable([
          {
            label: t('cadence.steps.actions.edit'),
            icon: 'Create',
            onClick: onClickAction(onEdit),
          },
          {
            label: t('cadence.steps.actions.convertIntoStep'),
            icon: 'Autorenew',
            onClick: onClickAction(handleConvertIntoStep),
          },
          {
            label: t('cadence.steps.actions.delete'),
            icon: 'Delete',
            onClick: onClickAction(onDelete),
          },
        ]),
      [handleConvertIntoStep, onClickAction, onDelete, onEdit, t],
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
  onEdit,
  handleConvertIntoStep,
  isSelected,
}) => {
  const [disableRipple, setDisableRipple] = useState(false);

  const handleDisableRipple = useCallback(() => {
    setDisableRipple(true);
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
          handleConvertIntoStep={handleConvertIntoStep}
          handleDisableRipple={handleDisableRipple}
          onDelete={onDelete}
          onEdit={onEdit}
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
