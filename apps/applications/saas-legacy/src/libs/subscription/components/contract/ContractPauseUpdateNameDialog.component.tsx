import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import CustomMuiDialog from '#src/components/genericDialog/CustomMuiDialog.component';
import { PAUSE_NAME_MAX_LENGTH } from '#src/libs/subscription/constants';

type Props = {
  onCancel: () => void;
  onUpdateName: (nextName: string) => void;
  open: boolean;
  previousName: string;
};

export const ContractPauseUpdateNameDialog = (props: Props) => {
  const { t } = useTranslation('subscription');
  const [name, setName] = useState(props.previousName);
  const onUpdateName = () => {
    props.onUpdateName(name);
  };
  return (
    <CustomMuiDialog
      buttons={[
        {
          onClick: props.onCancel,
          label: t('pauseV2.common.actions.cancel'),
        },
        {
          onClick: onUpdateName,
          label: t('pauseV2.common.actions.save'),
          variant: 'contained',
          color: 'primary',
          disabled: name === props.previousName,
        },
      ]}
      onClose={props.onCancel}
      open={props.open}
      title={t('pauseV2.contractPause.updateNameDialogTitle')}
    >
      <TextField
        fullWidth
        multiline
        inputProps={{ maxLength: PAUSE_NAME_MAX_LENGTH }}
        onChange={(event: React.ChangeEvent) => {
          const target = event.target as HTMLInputElement;
          setName(target.value);
        }}
        placeholder={t('pauseV2.common.form.reasonPlaceholder')}
        value={name}
      />
    </CustomMuiDialog>
  );
};

export default ContractPauseUpdateNameDialog;
