import React from 'react';
import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';

import { makeStyles, type Theme } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import CadenceBubble from './CadenceBubble.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';
import MultipleConnectedTriggerForm from '#libs/sequential_marketing/components/form/connected_triggers/MultipleConnectedTriggerForm.component';

import type { SmartList } from '#libs/smart-list/types';
import type { ConnectedTrigger } from '#libs/sequential_marketing/types';
import type { OptionCallback } from '../../../../../state/types';

type Props = {
  connectedTriggers: ConnectedTrigger[];
  smartlists: Immutable.ImmutableArray<SmartList>;
  entrystepId: number;
  isInitial?: boolean;
  onClose?: () => void;
  onConfirm: (data: ConnectedTrigger[], options?: OptionCallback) => void;
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
    onClose?.();
  }, [connectedTriggerList, onClose, onConfirm]);

  const handleUpdateFormValidation = React.useCallback((isValid: boolean) => {
    setIsFormValid(isValid);
  }, []);

  return (
    <CadenceBubble
      color={SequentialMarketingColors.ENTRY_COLOR}
      icon="PlayArrow"
      isSubmissionForbidden={!isFormValid}
      onCancelClick={!isInitial && onClose}
      onCancelText={!isInitial && t('cadence.form.cancel')}
      onConfirmClick={handleSubmit}
      onConfirmText={
        isInitial ? t('cadence.form.next') : t('cadence.form.save')
      }
      title={t('cadence.bubble.entryTrigger.title')}
    >
      <div className={classes.content}>
        <Alert className={classes.alert} severity="info">
          {t('cadence.bubble.entryTrigger.helperText')}
        </Alert>
        <MultipleConnectedTriggerForm
          isEntrystep
          connectedTriggers={connectedTriggerList}
          customColor={SequentialMarketingColors.ENTRY_COLOR}
          smartlists={smartlists}
          sourceId={entrystepId}
          updateConnectedTriggerList={updateConnectedTriggerList}
          updateFormValidation={handleUpdateFormValidation}
        />
      </div>
    </CadenceBubble>
  );
};

type StylesProps = { color: string };

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  content: {
    width: '100%',
  },
  alert: {
    marginBottom: theme.spacing(4),
  },
}));

export default React.memo(EntryTriggerBubble);
