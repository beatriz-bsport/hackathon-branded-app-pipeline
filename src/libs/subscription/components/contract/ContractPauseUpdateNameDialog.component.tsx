// @ts-nocheck
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import CustomMuiDialog from '#components/genericDialog/CustomMuiDialog.component';
import { PAUSE_NAME_MAX_LENGTH } from '#libs/subscription/constants';

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
      open={props.open}
      onClose={props.onCancel}
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
      title={t('pauseV2.contractPause.updateNameDialogTitle')}
    >
      <TextField
        placeholder={t('pauseV2.common.form.reasonPlaceholder')}
        value={name}
        onChange={(event: React.ChangeEvent) => {
          const target = event.target as HTMLInputElement;
          setName(target.value);
        }}
        fullWidth
        multiline
        inputProps={{ maxLength: PAUSE_NAME_MAX_LENGTH }}
      />
    </CustomMuiDialog>
  );
};

export default ContractPauseUpdateNameDialog;
