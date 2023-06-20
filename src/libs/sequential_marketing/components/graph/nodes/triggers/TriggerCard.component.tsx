import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';

import StepCard from '#components/card/StepCard.component';
import CadenceNodeTitle from '../internals/CadenceNodeTitle.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';
import {
  getTriggerIcon,
  getTriggerKind,
} from '#libs/sequential_marketing/components/icons/utils';
import type { SmartList } from '#libs/smart-list/types';
import type { ConnectedTrigger } from '#libs/sequential_marketing/types';
import type { Action } from '#components/button/MultipleActionsButton.component';

export type TriggerCardProps = {
  trigger: ConnectedTrigger;
  isSelected?: boolean;
  disabled?: boolean;
  getSmartlist: (id: number) => SmartList;
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
        name={name}
        icon={getTriggerIcon(trigger)}
        color={SequentialMarketingColors.TRIGGER_COLOR}
        triggerList={[trigger]}
        getSmartlist={getSmartlist}
        actions={actions}
      />
    );
  },
);

const TriggerCard: React.FC<TriggerCardProps> = ({
  trigger,
  isSelected,
  disabled,
  getSmartlist,
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
      header={
        <TriggerCardHeader
          name={t(`cadence.triggers.kinds.${getTriggerKind(trigger)}`)}
          actions={!!onDelete && Immutable([deleteTriggerAction])}
          trigger={trigger}
          getSmartlist={getSmartlist}
        />
      }
      color={SequentialMarketingColors.TRIGGER_BORDER_COLOR}
      selectedColor={SequentialMarketingColors.TRIGGER_COLOR}
      isSelected={isSelected}
      disabled={disabled}
      disableRipple={disableRipple}
      maxWidth
    />
  );
};

export default React.memo(TriggerCard);
