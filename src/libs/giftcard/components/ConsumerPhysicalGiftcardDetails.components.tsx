import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import classNames from 'classnames';

import {
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { formatAsDate } from '#src/utils/datetime';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

import type { ConsumerGiftcard } from '#src/libs/giftcard/types';

type Props = {
  isOpen: boolean;
  consumerGiftcard: ConsumerGiftcard;
  onClose: () => void;
};

const ConsumerPhysicalGiftcardDetails: React.FC<Props> = ({
  isOpen,
  consumerGiftcard,
  onClose,
}) => {
  const { t } = useTranslation(['giftcard', 'common']);
  const classes = useStyles();

  const handleDownloadPDF = useCallback(() => {
    window?.open(consumerGiftcard.pdf_link);
  }, [consumerGiftcard.pdf_link]);

  const giftcardActivationDateFrom = useMemo(
    () => formatAsDate(consumerGiftcard.activation_datetime),
    [consumerGiftcard.activation_datetime],
  );

  const giftcardActivationDateTo = useMemo(
    () =>
      formatAsDate(
        DateTime.fromFormat(
          consumerGiftcard.expiration_date ?? '',
          'yyyy-MM-dd',
        ).toISO(),
      ),
    [consumerGiftcard.expiration_date],
  );

  return (
    <GenericResponsiveDialog maxWidth="sm" onClose={onClose} open={isOpen}>
      <DialogTitle>
        {t('giftcard:consumerGiftcard.physicalDetails.title')}
      </DialogTitle>
      <DialogContent className={classes.modalContent}>
        <Alert severity="info">
          <AlertTitle>
            {t('giftcard:consumerGiftcard.physicalDetails.helperAlert.title')}
          </AlertTitle>
          {t('giftcard:consumerGiftcard.physicalDetails.helperAlert.message')}
        </Alert>

        <div className={classes.giftcardContainer}>
          <div className={classNames(classes.flexColumn, classes.flexGrow)}>
            <div className={classes.infoContainer}>
              <Typography color="textSecondary" variant="caption">
                {t('giftcard:consumerGiftcard.physicalDetails.to')}
              </Typography>
              <Typography className={classes.infoData} variant="body2">
                {consumerGiftcard.message_is_for ?? 'John doe'}
              </Typography>
            </div>
            <div className={classes.infoContainer}>
              <Typography color="textSecondary" variant="caption">
                {t('giftcard:consumerGiftcard.physicalDetails.code')}
              </Typography>
              <Typography
                className={classNames(classes.infoData, classes.code)}
                variant="body2"
              >
                {consumerGiftcard.printable_code ?? ''}
              </Typography>
            </div>
            {!!consumerGiftcard.expiration_date && (
              <div className={classes.infoContainer}>
                <Typography color="textSecondary" variant="caption">
                  {t('giftcard:consumerGiftcard.physicalDetails.validFrom', {
                    from: giftcardActivationDateFrom,
                    to: giftcardActivationDateTo,
                  })}
                </Typography>
              </div>
            )}
          </div>
          <div className={classes.amountContainer}>
            <Typography color="primary" variant="h6">
              {getCurrencyDisplayWithPrice(
                parseFloat(consumerGiftcard.price_bought) -
                  parseFloat(consumerGiftcard.consumed_amount_gifted),
              )}
            </Typography>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common:close')}</Button>
        <Button color="primary" onClick={handleDownloadPDF}>
          {t('giftcard:downloadPDF')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: `0 ${theme.spacing(2)}px ${theme.spacing(2)}px`,
  },
  giftcardContainer: {
    display: 'flex',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, .25)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    gap: theme.spacing(4),
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexGrow: {
    flex: 1,
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: theme.spacing(1),
  },
  infoData: {
    fontSize: 14,
  },
  code: {
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  amountContainer: {
    display: 'flex',
    alignItems: 'flex-end',
  },
}));

export default React.memo(ConsumerPhysicalGiftcardDetails);
