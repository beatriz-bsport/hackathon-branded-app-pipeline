import React from 'react';
import Immutable from 'seamless-immutable';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';
import CadenceBubble from './CadenceBubble.component';
import MultipleConnectedTriggerForm from '#libs/sequential_marketing/components/form/connected_triggers/MultipleConnectedTriggerForm.component';

import type { SmartList } from '#libs/smart-list/types';
import type { ConnectedTrigger } from '#libs/sequential_marketing/types';

type Props = {
  connectedTriggers: ConnectedTrigger[];
  smartlists: Immutable.ImmutableArray<SmartList>;
  isInitial?: boolean;
  onCancel?: (value?: ConnectedTrigger[]) => void;
  onConfirm: (data: ConnectedTrigger[]) => void;
};

const OutputWonTriggerBubble: React.FC<Props> = ({
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

  React.useEffect(() => {
    setConnectedTriggerList(connectedTriggers || []);
  }, [connectedTriggers]);

  const updateConnectedTriggerList = React.useCallback(
    (newConnectedTriggerList: ConnectedTrigger[]) =>
      setConnectedTriggerList(newConnectedTriggerList),
    [setConnectedTriggerList],
  );

  const handleSubmit = React.useCallback(() => {
    onConfirm?.(connectedTriggerList);
  }, [connectedTriggerList, onConfirm]);

  const handleUpdateFormValidation = React.useCallback((isValid: boolean) => {
    setIsFormValid(isValid);
  }, []);

  return (
    <CadenceBubble
      color={SequentialMarketingColors.ENTRY_COLOR}
      icon="CheckCircle"
      isSubmissionForbidden={!isFormValid}
      onCancelClick={onCancel}
      onCancelText={
        isInitial ? t('cadence.bubble.previous') : t('cadence.bubble.cancel')
      }
      onConfirmClick={handleSubmit}
      onConfirmText={
        isInitial ? t('cadence.bubble.next') : t('cadence.bubble.confirm')
      }
      title={t('cadence.bubble.wonTrigger.title')}
    >
      <div className={classes.content}>
        <Alert severity="info">
          {t('cadence.bubble.wonTrigger.helperText')}
        </Alert>
        <MultipleConnectedTriggerForm
          isOutput
          addTriggerLabel={`+ ${t('cadence.bubble.wonTrigger.addTrigger')}`}
          connectedTriggers={connectedTriggerList}
          customColor={SequentialMarketingColors.ENTRY_COLOR}
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

export default React.memo(OutputWonTriggerBubble);
