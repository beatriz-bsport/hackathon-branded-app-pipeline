import React from 'react';
import Immutable from 'seamless-immutable';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import { SequentialMarketingColors } from '#src/libs/sequential_marketing/constants';
import MultipleConnectedTriggerForm from '#src/libs/sequential_marketing/components/form/connected_triggers/MultipleConnectedTriggerForm.component';

import type { SmartList } from '#src/libs/smart-list/types';
import type { ConnectedTrigger } from '#src/libs/sequential_marketing/types';
import CadenceBubble from './CadenceBubble.component';

type Props = {
  connectedTriggers: ConnectedTrigger[];
  smartlists: Immutable.ImmutableArray<SmartList>;
  entrystepId?: number;
  isInitial?: boolean;
  onClose?: () => void;
  onConfirm: (data: ConnectedTrigger[]) => void;
};

const EntryTriggerBubble: React.FC<Props> = ({
  connectedTriggers,
  smartlists,
  entrystepId,
  isInitial,
  onClose,
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

  const handleSubmit = React.useCallback(() => {
    onConfirm?.(connectedTriggerList);
    onClose?.();
  }, [connectedTriggerList, onClose, onConfirm]);

  const handleUpdateFormValidation = React.useCallback((isValid: boolean) => {
    setIsFormValid(isValid);
  }, []);

  React.useEffect(() => {
    setConnectedTriggerList(connectedTriggers || []);
  }, [connectedTriggers]);

  return (
    <CadenceBubble
      color={SequentialMarketingColors.ENTRY_COLOR}
      icon="PlayArrow"
      isSubmissionForbidden={!isFormValid}
      onCancelClick={!isInitial && onClose}
      onCancelText={!isInitial ? t('cadence.bubble.cancel') : ''}
      onConfirmClick={handleSubmit}
      onConfirmText={
        isInitial ? t('cadence.bubble.next') : t('cadence.bubble.confirm')
      }
      title={t('cadence.bubble.entryTrigger.title')}
    >
      <div className={classes.content}>
        <Alert className={classes.alert} severity="info">
          {isInitial
            ? t('cadence.bubble.entryTrigger.creationHelper')
            : t('cadence.bubble.entryTrigger.editionHelper')}
        </Alert>
        <MultipleConnectedTriggerForm
          isEntrystep
          addTriggerLabel={`+ ${t('cadence.bubble.entryTrigger.addTrigger')}`}
          connectedTriggers={connectedTriggerList}
          customColor={SequentialMarketingColors.ENTRY_COLOR}
          destinationId={entrystepId}
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
  alert: {
    alignItems: 'center',
  },
}));

export default React.memo(EntryTriggerBubble);
