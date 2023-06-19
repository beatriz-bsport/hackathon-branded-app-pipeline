import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';

import StepCard from '#components/card/StepCard.component';
import CadenceNodeTitle from '../internals/CadenceNodeTitle.component';
import {
  DestinationStatus,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';

export type CadenceExitProps = {
  status: DestinationStatus;
  onDelete: () => void;
  handleChangeInStep: () => void;
  isSelected?: boolean;
};

type CadenceExitHeaderProps = {
  handleDisableRipple: () => void;
} & Omit<CadenceExitProps, 'isSelected'>;

const CadenceExitHeader: React.FC<CadenceExitHeaderProps> = React.memo(
  ({ status, onDelete, handleChangeInStep, handleDisableRipple }) => {
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
        name={
          status === DestinationStatus.WIN
            ? t('cadence.cadenceCard.win')
            : t('cadence.cadenceCard.lost')
        }
        icon={status === DestinationStatus.WIN ? 'CheckCircle' : 'Cancel'}
        color={
          status === DestinationStatus.WIN
            ? SequentialMarketingColors.ENTRY_COLOR
            : SequentialMarketingColors.LOSE_COLOR
        }
        actions={actions}
        disableRippleOnClick={handleDisableRipple}
      />
    );
  },
);

const CadenceExit: React.FC<CadenceExitProps> = ({
  status,
  onDelete,
  handleChangeInStep,
  isSelected,
}) => {
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

  return (
    <StepCard
      header={
        <CadenceExitHeader
          status={status}
          onDelete={onDelete}
          handleChangeInStep={handleChangeInStep}
          handleDisableRipple={handleDisableRipple}
        />
      }
      color={
        status === DestinationStatus.WIN
          ? SequentialMarketingColors.ENTRY_BORDER_COLOR
          : SequentialMarketingColors.LOSE_BORDER_COLOR
      }
      selectedColor={
        status === DestinationStatus.WIN
          ? SequentialMarketingColors.ENTRY_COLOR
          : SequentialMarketingColors.LOSE_COLOR
      }
      isSelected={isSelected}
      disableRipple={disableRipple}
      maxWidth
      minHeight
    />
  );
};

export default React.memo(CadenceExit);
