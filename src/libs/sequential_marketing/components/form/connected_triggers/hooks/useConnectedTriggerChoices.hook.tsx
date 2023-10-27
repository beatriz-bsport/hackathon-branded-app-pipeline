import React from 'react';
import Immutable from 'seamless-immutable';
import { useTranslation } from 'react-i18next';
import {
  SequentialMarketingColors,
  TRIGGER_KIND_CHOICES,
  TriggerKind,
} from '#libs/sequential_marketing/constants';
import { triggerIconByKind } from '#libs/sequential_marketing/components/helpers/utils';
import type { Action } from '#components/menu/icon';

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

  const connectedTriggerList: Action[] =
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
