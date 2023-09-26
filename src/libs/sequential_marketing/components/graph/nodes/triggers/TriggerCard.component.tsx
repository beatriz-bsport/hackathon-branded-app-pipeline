import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';

import StepCard from '#components/card/StepCard.component';
import CadenceNodeTitle from '#libs/sequential_marketing/components/graph/nodes/internals/CadenceNodeTitle.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';
import {
  getTriggerIcon,
  getTriggerKind,
} from '#libs/sequential_marketing/components/helpers/utils';

import type {
  CadenceStep,
  ConnectedTrigger,
} from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';
import type { Action } from '#components/button/MultipleActionsButton.component';

export type TriggerCardProps = {
  step: CadenceStep;
  trigger: ConnectedTrigger;
  isSelected?: boolean;
  disabled?: boolean;
  getSmartlist: (id: number) => SmartList;
  onCardClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete?: () => void;
};

type TriggerCardHeaderProps = Pick<
  TriggerCardProps,
  'trigger' | 'getSmartlist'
> & { name: string; actions: Immutable.ImmutableArray<Action> };

const TriggerCardHeader: React.FC<TriggerCardHeaderProps> = React.memo(
  ({ name, trigger, getSmartlist, actions }) => {
    return (
      <CadenceNodeTitle
        actions={actions}
        color={SequentialMarketingColors.TRIGGER_COLOR}
        getSmartlist={getSmartlist}
        icon={getTriggerIcon(trigger)}
        name={name}
        triggerList={[trigger]}
      />
    );
  },
);

const TriggerCard: React.FC<TriggerCardProps> = ({
  trigger,
  isSelected,
  disabled,
  getSmartlist,
  onCardClick,
  onDelete,
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

  const onClickDelete = useCallback(() => {
    setDisableRipple(true);
    onDelete();
    setClickDone(true);
  }, [onDelete]);

  const deleteTriggerAction = useMemo(() => {
    return {
      label: t('cadence.triggers.delete'),
      icon: 'Delete',
      onClick: onClickDelete,
      customColor: SequentialMarketingColors.ACTION_BUTTON_COLOR,
    };
  }, [onClickDelete, t]);

  return (
    <StepCard
      maxWidth
      color={SequentialMarketingColors.TRIGGER_BORDER_COLOR}
      disabled={disabled}
      disableRipple={disableRipple}
      header={
        <TriggerCardHeader
          actions={!!onDelete && Immutable([deleteTriggerAction])}
          getSmartlist={getSmartlist}
          name={t(`cadence.triggers.kinds.${getTriggerKind(trigger)}`)}
          trigger={trigger}
        />
      }
      isSelected={isSelected}
      onCardClick={onCardClick}
      selectedColor={SequentialMarketingColors.TRIGGER_COLOR}
    />
  );
};

export default React.memo(TriggerCard);
