import React from 'react';
import Immutable from 'seamless-immutable';
import { useTranslation } from 'react-i18next';
import {
  SequentialMarketingColors,
  TRIGGER_KIND_CHOICES,
  TriggerKind,
} from '#src/libs/sequential_marketing/constants';
import { triggerIconByKind } from '#src/libs/sequential_marketing/components/helpers/utils';
import type { MenuAction } from '#src/components/menu/types';

type Props = {
  addConnectedTrigger: (kind: TriggerKind) => void;
  connectedTriggersToExclude?: TriggerKind[];
  customColor?: string;
};

export const useConnectedTriggerChoices = ({
  addConnectedTrigger,
  connectedTriggersToExclude,
  customColor,
}: Props) => {
  const { t } = useTranslation('marketing');

  const handleAddConnectedTrigger = React.useCallback(
    (kind: TriggerKind) => () => addConnectedTrigger?.(kind),
    [addConnectedTrigger],
  );

  const connectedTriggerList: MenuAction[] =
    TRIGGER_KIND_CHOICES.filter(
      (triggerKind) => !connectedTriggersToExclude.includes(triggerKind),
    )?.map((triggerKind) => ({
      label: t(`cadence.triggers.kinds.${triggerKind}`),
      icon: triggerIconByKind[triggerKind],
      onClick: handleAddConnectedTrigger(triggerKind),
      customColor: customColor || SequentialMarketingColors.TRIGGER_COLOR,
    })) ?? [];

  return Immutable(connectedTriggerList);
};

export default useConnectedTriggerChoices;
