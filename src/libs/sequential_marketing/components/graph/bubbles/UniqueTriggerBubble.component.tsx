import React from 'react';
import Immutable from 'seamless-immutable';
import { useTranslation } from 'react-i18next';

import type { ConnectedTrigger } from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';

import {
  getTriggerKind,
  triggerIconByKind,
} from '#libs/sequential_marketing/components/helpers/utils';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';
import ConnectedTriggerForm from '#libs/sequential_marketing/components/form/connected_triggers/ConnectedTriggerForm.component';
import CadenceBubble from './CadenceBubble.component';

type Props = {
  trigger: ConnectedTrigger;
  smartlists: Immutable.ImmutableArray<SmartList>;
  onCancel?: () => void;
  onConfirm: (data: ConnectedTrigger) => void;
};

const UniqueTriggerBubble: React.FC<Props> = ({
  trigger,
  smartlists,
  onCancel,
  onConfirm,
}) => {
  const { t } = useTranslation('marketing');
  const [triggerUpdated, setTriggerUpdated] =
    React.useState<ConnectedTrigger>(trigger);
  const [isFormValid, setIsFormValid] = React.useState(false);

  const updateTrigger = React.useCallback(
    (newTrigger: ConnectedTrigger) => setTriggerUpdated(newTrigger),
    [setTriggerUpdated],
  );

  const handleSubmit = React.useCallback(() => {
    onConfirm?.(triggerUpdated);
  }, [triggerUpdated, onConfirm]);

  const handleUpdateFormValidation = React.useCallback((isValid: boolean) => {
    setIsFormValid(isValid);
  }, []);

  const kind = React.useMemo(
    () => getTriggerKind(triggerUpdated),
    [triggerUpdated],
  );

  return (
    <CadenceBubble
      smallTitle
      color={SequentialMarketingColors.TRIGGER_COLOR}
      icon={triggerIconByKind[kind]}
      isSubmissionForbidden={!isFormValid}
      onCancelClick={onCancel}
      onConfirmClick={handleSubmit}
      title={t(`cadence.triggers.kinds.${kind}`)}
    >
      <ConnectedTriggerForm
        smartlists={smartlists}
        trigger={triggerUpdated}
        updateFormValidation={handleUpdateFormValidation}
        updateTrigger={updateTrigger}
      />
    </CadenceBubble>
  );
};

export default React.memo(UniqueTriggerBubble);
