import React from 'react';
import Immutable from 'seamless-immutable';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import CadenceBubble from './CadenceBubble.component';
import MultipleConnectedTriggerForm from '#libs/sequential_marketing/components/form/connected_triggers/MultipleConnectedTriggerForm.component';

import {
  LOST_OUTPUT_TIMEOUT_TRIGGER_ID,
  SequentialMarketingColors,
  TriggerKind,
} from '#libs/sequential_marketing/constants';
import { getConnectedTriggerDefaultValues } from '#libs/sequential_marketing/components/graph/hooks/utils';

import type { SmartList } from '#libs/smart-list/types';
import type { ConnectedTrigger } from '#libs/sequential_marketing/types';

type Props = {
  connectedTriggers: ConnectedTrigger[];
  smartlists: Immutable.ImmutableArray<SmartList>;
  isInitial?: boolean;
  onCancel?: (value?: ConnectedTrigger[]) => void;
  onConfirm: (data: ConnectedTrigger[]) => void;
};

const OutputLostTriggerBubble: React.FC<Props> = ({
  connectedTriggers,
  smartlists,
  isInitial,
  onCancel,
  onConfirm,
}) => {
  const { t } = useTranslation('marketing');

  const classes = useStyles({ color: SequentialMarketingColors.ENTRY_COLOR });

  const [isFormValid, setIsFormValid] = React.useState(false);

  const [connectedTriggerList, setConnectedTriggerList] = React.useState<
    ConnectedTrigger[]
  >([]);

  const updateConnectedTriggerList = React.useCallback(
    (newConnectedTriggerList: ConnectedTrigger[]) =>
      setConnectedTriggerList(newConnectedTriggerList),
    [setConnectedTriggerList],
  );

  const handleConfirm = React.useCallback(() => {
    onConfirm?.(connectedTriggerList);
  }, [connectedTriggerList, onConfirm]);

  const handleCancel = React.useCallback(() => {
    onCancel?.(connectedTriggerList);
  }, [connectedTriggerList, onCancel]);

  const handleUpdateFormValidation = React.useCallback((isValid: boolean) => {
    setIsFormValid(isValid);
  }, []);

  React.useEffect(() => {
    setConnectedTriggerList(
      connectedTriggers || [
        getConnectedTriggerDefaultValues({
          triggerKind: TriggerKind.ONLY_TIMEOUT,
          triggerUuid: LOST_OUTPUT_TIMEOUT_TRIGGER_ID,
        }),
      ],
    );
  }, [connectedTriggers]);

  return (
    <CadenceBubble
      color={SequentialMarketingColors.LOSE_COLOR}
      icon="Cancel"
      isSubmissionForbidden={!isFormValid}
      onCancelClick={handleCancel}
      onCancelText={
        isInitial ? t('cadence.bubble.previous') : t('cadence.bubble.cancel')
      }
      onConfirmClick={handleConfirm}
      onConfirmText={
        isInitial ? t('cadence.bubble.next') : t('cadence.bubble.confirm')
      }
      title={t('cadence.bubble.lostTrigger.title')}
    >
      <div className={classes.content}>
        <Alert severity="info">
          {t('cadence.bubble.lostTrigger.helperText')}
        </Alert>
        <MultipleConnectedTriggerForm
          isOutput
          addTriggerLabel={`+ ${t('cadence.bubble.lostTrigger.addTrigger')}`}
          connectedTriggers={connectedTriggerList}
          customColor={SequentialMarketingColors.LOSE_COLOR}
          smartlists={smartlists}
          updateConnectedTriggerList={updateConnectedTriggerList}
          updateFormValidation={handleUpdateFormValidation}
        />
      </div>
    </CadenceBubble>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
}));

export default React.memo(OutputLostTriggerBubble);
