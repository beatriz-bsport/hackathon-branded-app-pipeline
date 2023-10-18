import React from 'react';
import Immutable from 'seamless-immutable';
import { Connection } from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';

import {
  SequentialMarketingColors,
  TRIGGER_KIND_CHOICES,
  TriggerKind,
} from '#libs/sequential_marketing/constants';
import { triggerIconByKind } from '#libs/sequential_marketing/components/helpers/utils';

export const useConnectToStep = (
  onConnectToStep: (destinationId: number, triggerKind: TriggerKind) => void,
) => {
  const { t } = useTranslation('marketing');

  const [stepDestinationId, setStepDestinationId] = React.useState<
    number | null
  >(null);

  const handleConnectStepWithLink = React.useCallback(
    (params: Connection) => setStepDestinationId(parseInt(params.target)),
    [],
  );

  const handleCreateFakerTriggerBetweenSteps = React.useCallback(
    (triggerKind: TriggerKind) => () => {
      onConnectToStep?.(stepDestinationId, triggerKind);
      setStepDestinationId(null);
    },
    [onConnectToStep, stepDestinationId],
  );

  const triggerChoicesToConnectStepToStep = React.useMemo(
    () =>
      Immutable(
        TRIGGER_KIND_CHOICES.map((triggerKind) => ({
          label: t(`cadence.triggers.kinds.${triggerKind}`),
          icon: triggerIconByKind[triggerKind],
          customColor: SequentialMarketingColors.TRIGGER_COLOR,
          onClick: handleCreateFakerTriggerBetweenSteps(triggerKind),
        })),
      ),
    [handleCreateFakerTriggerBetweenSteps, t],
  );

  return {
    stepDestinationId,
    triggerChoicesToConnectStepToStep,
    handleConnectStepWithLink,
  };
};

export default useConnectToStep;
