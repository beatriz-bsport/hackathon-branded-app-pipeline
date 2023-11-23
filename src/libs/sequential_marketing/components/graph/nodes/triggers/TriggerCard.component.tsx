import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';

import StepCard from '#components/card/StepCard.component';
import CadenceNodeTitle from '#libs/sequential_marketing/components/graph/nodes/internals/CadenceNodeTitle.component';
import {
  SequentialMarketingColors,
  TRIGGER_KIND_CHOICES,
  TriggerKind,
} from '#libs/sequential_marketing/constants';
import {
  getTriggerIcon,
  getTriggerKind,
  triggerIconByKind,
} from '#libs/sequential_marketing/components/helpers/utils';

import type {
  CadenceStep,
  ConnectedTrigger,
} from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';
import type { MenuAction, NestedMenuAction } from '#components/menu/types';

export type TriggerCardProps = {
  step: CadenceStep;
  trigger: ConnectedTrigger;
  isSelected?: boolean;
  disabled?: boolean;
  changeConnectedTriggerKind: (triggerKind: TriggerKind) => void;
  getSmartlist: (id: number) => SmartList;
  onCardClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete?: () => void;
};

type TriggerCardHeaderProps = {
  actions: Immutable.ImmutableArray<NestedMenuAction>;
  name: string;
} & Pick<TriggerCardProps, 'trigger' | 'getSmartlist'>;

const TriggerCardHeader: React.FC<TriggerCardHeaderProps> = React.memo(
  ({ actions, name, trigger, getSmartlist }) => {
    return (
      <CadenceNodeTitle
        hasNestedActions
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
  changeConnectedTriggerKind,
  getSmartlist,
  onCardClick,
  onDelete,
}) => {
  const { t } = useTranslation('marketing');
  const [disableRipple, setDisableRipple] = useState(false);
  const [clickDone, setClickDone] = useState(false);

  const onClickDelete = useCallback(() => {
    setDisableRipple(true);
    onDelete();
    setClickDone(true);
  }, [onDelete]);

  const kind = useMemo(() => getTriggerKind(trigger), [trigger]);

  const changeConnectedTriggerKindActions: Immutable.ImmutableArray<MenuAction> =
    useMemo(
      () =>
        Immutable(
          TRIGGER_KIND_CHOICES.filter(
            (triggerKind) => triggerKind !== kind,
          ).map((triggerKind) => ({
            label: t(`cadence.triggers.kinds.${triggerKind}`),
            icon: triggerIconByKind[triggerKind],
            customColor: SequentialMarketingColors.TRIGGER_COLOR,
            onClick: () => changeConnectedTriggerKind(triggerKind),
          })),
        ),
      [changeConnectedTriggerKind, kind, t],
    );

  const triggerActions: Immutable.ImmutableArray<NestedMenuAction> =
    useMemo(() => {
      return Immutable([
        {
          label: t('cadence.triggers.changeKind'),
          icon: 'Autorenew',
          onClick: null,
          customColor: SequentialMarketingColors.ACTION_BUTTON_COLOR,
          actionList: changeConnectedTriggerKindActions,
        },
        {
          label: t('cadence.triggers.delete'),
          icon: 'Delete',
          onClick: onClickDelete,
          customColor: SequentialMarketingColors.ACTION_BUTTON_COLOR,
          actionList: null,
        },
      ]);
    }, [changeConnectedTriggerKindActions, onClickDelete, t]);

  useEffect(() => {
    if (clickDone) {
      setDisableRipple(false);
      setClickDone(false);
    }
  }, [clickDone]);

  return (
    <StepCard
      maxWidth
      color={SequentialMarketingColors.TRIGGER_BORDER_COLOR}
      disabled={disabled}
      disableRipple={disableRipple}
      header={
        <TriggerCardHeader
          actions={triggerActions}
          getSmartlist={getSmartlist}
          name={t(`cadence.triggers.kinds.${kind}`)}
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
