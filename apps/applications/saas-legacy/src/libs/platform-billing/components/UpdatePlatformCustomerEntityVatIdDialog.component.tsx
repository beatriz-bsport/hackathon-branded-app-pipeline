import React, { useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { useTranslation } from 'react-i18next';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';

import type { OptionCallback } from '#src/state/types';
import { isValidEuVatId } from '#src/libs/platform-billing/utils';
import { UpdatePlatformCustomerEntityVatInformationParams } from '#src/libs/platform-billing/type';

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: (
    params: UpdatePlatformCustomerEntityVatInformationParams,
    options: OptionCallback,
  ) => void;
  hasAttributedVatId: boolean;
  vatId?: string;
  isValidVatIdMissing: boolean;
};

const UpdatePlatformCustomerEntityVatIdDialog: React.FC<Props> = ({
  open,
  onCancel,
  onConfirm,
  hasAttributedVatId,
  vatId,
  isValidVatIdMissing,
}: Props) => {
  const { t } = useTranslation(['platformBilling']);
  const classes = useStyles();

  const [hasVatIdAttributed, setHasAttributedVatId] =
    React.useState<boolean>(hasAttributedVatId);
  // Will be true while the vatId information is being processed
  const [processing, setProcessing] = React.useState<boolean>(false);

  // Will be true if either the eu vat id regex validation fails, either the backend validation fails
  const [isMissingValidVatId, setIsValidVatIdMissing] =
    React.useState<boolean>(isValidVatIdMissing);

  // Will be true if the vat id format regex validation fails
  const [isVatIdFormatInvalid, setIsVatIdFormatInvalid] =
    React.useState<boolean>(false);

  const [vatIdInput, setVatId] = React.useState<string>(vatId || '');

  const onVatIdValueChange = (vatIdValue: string) => {
    setVatId(vatIdValue);
    setHasAttributedVatId(true);

    const isEuVatIdValidated = isValidEuVatId(vatIdValue);

    setIsValidVatIdMissing(!isEuVatIdValidated);
    setIsVatIdFormatInvalid(!isEuVatIdValidated);
  };

  const onHasAttributedVatIdChange = (value: boolean) => {
    if (value) {
      setVatId('');
      setIsValidVatIdMissing(false);
    }
    setHasAttributedVatId(!value);
  };

  const onClickConfirm = useCallback(() => {
    setProcessing(true);
    onConfirm(
      {
        hasAttributedVatId: hasVatIdAttributed,
        ...(vatIdInput !== '' && { vatId: vatIdInput }),
      },
      {
        onError: () => {
          setProcessing(false);
          setIsValidVatIdMissing(true);
        },
      },
    );
  }, [hasVatIdAttributed, vatIdInput, onConfirm]);

  if (!open) return null;

  return (
    <Dialog open={open}>
      <DialogTitle>
        {t('platformCustomerEntity.vatId.dialog.title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('platformCustomerEntity.vatId.dialog.content')}
        </DialogContentText>

        <div className={classes.row}>
          {hasVatIdAttributed && (
            <TextField
              error={isMissingValidVatId}
              helperText={
                isVatIdFormatInvalid
                  ? t('platformCustomerEntity.vatId.dialog.invalidFormat')
                  : ''
              }
              id="vatId"
              label={t('platformCustomerEntity.vatId.dialog.vatIdLabel')}
              onChange={(e) => onVatIdValueChange(e.target.value)}
              required={true}
              value={vatIdInput}
            />
          )}
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!hasVatIdAttributed}
                  onChange={(e) => onHasAttributedVatIdChange(e.target.checked)}
                />
              }
              label={t(
                'platformCustomerEntity.vatId.dialog.hasAttributedVatIdLabel',
              )}
            />
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          className={classes.textSecondary}
          disabled={processing}
          onClick={onCancel}
        >
          {t('platformCustomerEntity.vatId.dialog.actions.cancel')}
        </Button>
        {processing ? (
          <CircularProgress />
        ) : (
          <Button
            color="primary"
            disabled={isMissingValidVatId}
            onClick={onClickConfirm}
          >
            {t('platformCustomerEntity.vatId.dialog.actions.save')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  row: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  textSecondary: {
    color: theme.palette.text.secondary,
  },
}));

export default UpdatePlatformCustomerEntityVatIdDialog;
