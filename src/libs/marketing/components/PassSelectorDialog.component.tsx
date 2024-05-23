import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import MaterialUISelectorPasses from '../../../components/passes/MaterialUISelectorPasses.component';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { PrivatePass } from '#src/libs/private-service/types';

type DialogProps = {
  identifier: 'private_pass' | 'payment_pack';
  open: boolean;
  onClose: () => void;
  onSubmit: (selectedPasses: number[], isAll: boolean) => void;
  passes: PaymentPack[] | PrivatePass[];
};

export const PassSelectorDialog = ({
  identifier,
  open,
  onClose,
  onSubmit,
  passes,
}: DialogProps) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();
  const [selectedPasses, setSelectedPasses] = useState<number[]>([]);
  const [isAll, setIsAll] = useState(false);
  const onChange = useCallback((selection: number[]) => {
    setSelectedPasses(selection);
  }, []);
  const onSwitchIsAll = useCallback(() => {
    setIsAll(!isAll);
  }, [isAll]);
  const submit = useCallback(() => {
    onSubmit(selectedPasses, isAll);
  }, [onSubmit, selectedPasses, isAll]);
  return (
    <Dialog fullWidth onClose={onClose} open={open}>
      <DialogTitle>{t('notifications.dialogTitle')}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <FormControlLabel
          control={
            <Switch checked={isAll} color="primary" onChange={onSwitchIsAll} />
          }
          label={t(`notifications.selectAllPassesToggle.${identifier}`)}
        />
        <Grid container className={classes.selector} direction="column">
          <Typography variant="body2">
            {t(`notifications.selectIdentifierLabel.${identifier}`)}
          </Typography>
          <MaterialUISelectorPasses
            disabled={isAll}
            onChange={onChange}
            passes={passes}
            placeHolder={t(
              `notifications.passSelectionPlaceholder.${identifier}`,
            )}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('notifications.cancel')}</Button>
        <Button color="primary" onClick={submit}>
          {t('notifications.next')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  selector: {
    gap: theme.spacing(2),
  },
}));
