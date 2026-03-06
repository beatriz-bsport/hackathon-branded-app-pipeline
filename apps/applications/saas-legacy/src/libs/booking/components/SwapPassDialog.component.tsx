import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import {
  Theme,
  WithStyles,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import { formatAsDate } from '#src/utils/datetime';
import {
  getCompatibleConsumerPaymentPackName,
  getConsumerPaymentPackPaymentPackId,
  type CompatibleConsumerPaymentPack,
} from '#src/libs/booking/services/swapPass.service';

type Props = {
  isOpen: boolean;
  isLoading?: boolean;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  compatibleConsumerPaymentPacks?: CompatibleConsumerPaymentPack[];
  paymentPacksById?: Record<number, PaymentPack>;
  selectedConsumerPaymentPackId: number | null;
  onSelectConsumerPaymentPack: (consumerPaymentPackId: number) => void;
  onSubmit: () => void;
  onClose: () => void;
} & WithStyles<typeof styles>;

const SwapPassDialog: React.FC<Props> = ({
  isOpen,
  isLoading = false,
  isSubmitting = false,
  errorMessage = null,
  compatibleConsumerPaymentPacks = [],
  paymentPacksById,
  selectedConsumerPaymentPackId,
  onSelectConsumerPaymentPack,
  onSubmit,
  onClose,
  classes,
}) => {
  const { t } = useTranslation(['b2b_booking', 'booking', 'paymentPack']);
  const stopPropagation = (event: React.SyntheticEvent) =>
    event.stopPropagation();

  return (
    <GenericResponsiveDialog maxWidth="sm" onClose={onClose} open={isOpen}>
      <div onClick={stopPropagation}>
        <DialogTitle disableTypography>
          <div className={classes.titleRow}>
            <Typography variant="h6">{t('swapPass.dialog.title')}</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent>
          {(isLoading || isSubmitting) && (
            <div className={classes.loaderContainer}>
              <CircularProgress size={24} />
            </div>
          )}

          {!isLoading && !isSubmitting && !!errorMessage && (
            <Typography color="error">{errorMessage}</Typography>
          )}

          {!isLoading &&
            !isSubmitting &&
            !errorMessage &&
            compatibleConsumerPaymentPacks.length === 0 && (
              <Typography>{t('swapPass.dialog.noCompatiblePasses')}</Typography>
            )}

          {!isLoading &&
            !isSubmitting &&
            compatibleConsumerPaymentPacks.length > 0 && (
              <ul className={classes.list}>
                {compatibleConsumerPaymentPacks.map(
                  (compatibleConsumerPaymentPack, index) => (
                    <li key={compatibleConsumerPaymentPack?.id ?? index}>
                      <Button
                        className={clsx(classes.listButton, {
                          [classes.listButtonSelected]:
                            selectedConsumerPaymentPackId ===
                            compatibleConsumerPaymentPack.id,
                        })}
                        color="primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelectConsumerPaymentPack(
                            compatibleConsumerPaymentPack.id,
                          );
                        }}
                        type="button"
                        variant={
                          selectedConsumerPaymentPackId ===
                          compatibleConsumerPaymentPack.id
                            ? 'contained'
                            : 'text'
                        }
                      >
                        <div className={classes.listButtonContent}>
                          <Typography className={classes.passName}>
                            {getCompatibleConsumerPaymentPackName(
                              compatibleConsumerPaymentPack,
                              index,
                              paymentPacksById,
                            )}
                          </Typography>
                          <Typography
                            className={classes.passDetails}
                            variant="caption"
                          >
                            {[
                              (() => {
                                const paymentPackId =
                                  getConsumerPaymentPackPaymentPackId(
                                    compatibleConsumerPaymentPack,
                                  );
                                const paymentPack =
                                  paymentPackId !== null
                                    ? paymentPacksById?.[paymentPackId]
                                    : null;
                                if (paymentPack?.unlimited) {
                                  return t('booking:unlimited');
                                }

                                return `${
                                  compatibleConsumerPaymentPack.available_credits
                                } ${t('paymentPack:credits', {
                                  count:
                                    compatibleConsumerPaymentPack.available_credits,
                                })}`;
                              })(),
                              compatibleConsumerPaymentPack.starting_date &&
                              compatibleConsumerPaymentPack.ending_date
                                ? `${formatAsDate(
                                    compatibleConsumerPaymentPack.starting_date,
                                  )}→${formatAsDate(
                                    compatibleConsumerPaymentPack.ending_date,
                                  )}`
                                : null,
                            ]
                              .filter(Boolean)
                              .join(' • ')}
                          </Typography>
                        </div>
                      </Button>
                    </li>
                  ),
                )}
              </ul>
            )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            type="button"
          >
            {t('swapPass.dialog.actions.close')}
          </Button>
          <Button
            color="primary"
            disabled={
              isLoading ||
              isSubmitting ||
              selectedConsumerPaymentPackId === null ||
              compatibleConsumerPaymentPacks.length === 0
            }
            onClick={(event) => {
              event.stopPropagation();
              onSubmit();
            }}
            type="button"
            variant="contained"
          >
            {t('swapPass.dialog.actions.confirm')}
          </Button>
        </DialogActions>
      </div>
    </GenericResponsiveDialog>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    loaderContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: 24,
    },
    list: {
      margin: 0,
      paddingLeft: 0,
      '& li': {
        listStyle: 'none',
      },
    },
    listButton: {
      justifyContent: 'flex-start',
      textTransform: 'none',
      width: '100%',
    },
    listButtonContent: {
      alignItems: 'flex-start',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    listButtonSelected: {
      marginBottom: 4,
      marginTop: 4,
      '& $passName': {
        color: theme.palette.primary.contrastText,
      },
      '& $passDetails': {
        color: theme.palette.primary.contrastText,
        opacity: 0.85,
      },
    },
    passDetails: {
      color: theme.palette.text.secondary,
      lineHeight: 1.25,
    },
    passName: {
      fontWeight: 500,
      lineHeight: 1.25,
    },
    titleRow: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
    },
  });

export default withStyles(styles)(SwapPassDialog);
