import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';

type Props = {
  handleRevertReason: (value: string) => void;
  required?: boolean;
  revertReason: string;
};

export const InvoiceRevertReasonField = ({
  handleRevertReason,
  required,
  revertReason,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  return (
    <TextField
      fullWidth
      className={classes.fieldContainer}
      helperText={`${revertReason.length}/100`}
      inputProps={{
        minLength: 1,
        maxLength: 100,
      }}
      label={t('revert.content.revertReason')}
      onChange={(ev) => handleRevertReason(ev.target.value)}
      required={required}
      value={revertReason}
      variant="outlined"
    />
  );
};

const useStyles = makeStyles(() => ({
  fieldContainer: {
    minWidth: 500,
    maxWidth: '90%',
  },
}));

export default InvoiceRevertReasonField;
