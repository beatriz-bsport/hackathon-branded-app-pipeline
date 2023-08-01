import React, { useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItem,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import Alert from '@material-ui/lab/Alert/Alert';
import { getCurrencyDisplay } from '#libs/theme/selectors';
import StripeBalanceChip from './StripeBalanceChip';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

interface Props {
  stripeBalanceLoading: boolean;
  stripeBalanceAvailable: number;
  stripeBalancePending: number;
}

export const StripeBalance = ({
  stripeBalanceAvailable,
  stripeBalancePending,
  stripeBalanceLoading,
}: Props) => {
  const [isInfoModalOpened, setIsInfoModalOpened] = useState<boolean>(false);
  const { t } = useTranslation('payment');
  const classes = useStyles();

  const isAvailableBalancePositive = stripeBalanceAvailable >= 0;
  const isPendingBalanceNonNull = stripeBalancePending !== 0;

  const handleCloseModal = useCallback(() => {
    setIsInfoModalOpened(false);
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsInfoModalOpened(true);
  }, []);

  const balanceAvailableText = useMemo(
    () => `${stripeBalanceAvailable.toFixed(2)}\u00a0${getCurrencyDisplay()}`,
    [stripeBalanceAvailable],
  );

  const balancePendingText = useMemo(() => {
    if (isPendingBalanceNonNull) {
      return `${stripeBalancePending.toFixed(2)}\u00a0${getCurrencyDisplay()}`;
    }

    return t('stripeBalance.nullPendingBalanceText');
  }, [isPendingBalanceNonNull, stripeBalancePending, t]);

  return (
    <>
      <div className={classes.balanceTitle}>
        <Typography variant="h5">
          {t('stripeBalance.title')}
          <IconButton className={classes.infoButton} onClick={handleOpenModal}>
            <InfoIcon />
          </IconButton>
        </Typography>
      </div>
      <Divider className={classes.divider} />
      {stripeBalanceLoading ? (
        <div className={classes.centeredButton}>
          <CircularProgress />
        </div>
      ) : (
        <Paper>
          <ListItem classes={{ root: classes.balancesContainer }}>
            <div className={classes.balanceContainer}>
              <Typography className={classes.balanceText} variant="subtitle1">
                {t('stripeBalance.availableBalance')}
              </Typography>
              <div className={classes.line} />
              <StripeBalanceChip
                isAvailableBalanceChip
                balanceAvailableText={balanceAvailableText}
                isAvailableBalancePositive={isAvailableBalancePositive}
              />
            </div>
            <div className={classes.balanceContainer}>
              <Typography className={classes.balanceText} variant="subtitle1">
                {t('stripeBalance.pendingBalance')}
              </Typography>
              <div className={classes.line} />
              <StripeBalanceChip
                balancePendingText={balancePendingText}
                isPendingBalanceNonNull={isPendingBalanceNonNull}
              />
            </div>
          </ListItem>
        </Paper>
      )}
      <GenericResponsiveDialog
        maxWidth="sm"
        onClose={handleCloseModal}
        open={isInfoModalOpened}
      >
        <DialogTitle id="form-dialog-title">
          {t('stripeBalance.title')}
        </DialogTitle>

        <DialogContent className={classes.helperText}>
          <Typography>{t('stripeBalance.dialog.firstPart')}</Typography>
          <Typography className={classes.balanceText} variant="subtitle1">
            {t('stripeBalance.availableBalance')}
          </Typography>
          {stripeBalanceLoading ? (
            <div className={classes.centeredButton}>
              <CircularProgress />
            </div>
          ) : (
            <StripeBalanceChip
              isAvailableBalanceChip
              balanceAvailableText={balanceAvailableText}
              isAvailableBalancePositive={isAvailableBalancePositive}
            />
          )}
          <Typography>{t('stripeBalance.dialog.secondPart')}</Typography>
          <Typography className={classes.balanceText} variant="subtitle1">
            {t('stripeBalance.pendingBalance')}
          </Typography>
          {stripeBalanceLoading ? (
            <div className={classes.centeredButton}>
              <CircularProgress />
            </div>
          ) : (
            <StripeBalanceChip
              balancePendingText={balancePendingText}
              isPendingBalanceNonNull={isPendingBalanceNonNull}
            />
          )}
          <Typography>{t('stripeBalance.dialog.thirdPart')}</Typography>
          <Alert severity="info">{t('stripeBalance.dialog.alert')}</Alert>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleCloseModal}>
            {t('stripeBalance.dialog.close')}
          </Button>
        </DialogActions>
      </GenericResponsiveDialog>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  balanceTitle: { display: 'grid', marginBottom: theme.spacing(1) },
  balancesContainer: {
    alignItems: 'stretch',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
  },
  balanceContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoButton: {
    padding: '0px',
    paddingLeft: '12px',
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  centeredButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(2),
  },
  helperText: {
    display: 'flex',
    flexDirection: 'column',
    whiteSpace: 'pre-line',
    gap: '16px',
    alignItems: 'flex-start',
  },
  line: {
    flexGrow: 1,
    borderBottom: '1px dashed gray',
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
  },
  balanceText: {
    fontWeight: 500,
  },
}));

export default StripeBalance;
