import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';
import { PlannedPaymentEvent } from '../types';

type Props = {
  plannedPaymentError: PlannedPaymentEvent;
};

export const PlannedPaymentEventErrorListItem = ({
  plannedPaymentError,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('invoice');

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <CancelIcon color="secondary" />
        <div className={classes.leftText}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Typography>
              {t(
                `paymentMethod.label.${plannedPaymentError.payment_method_identifier}`,
              )}
            </Typography>
          </div>

          <Typography color="textSecondary" variant="caption">
            {t(`plannedPaymentEvent.unrecoverableError`)}
          </Typography>
          <Typography color="textSecondary" variant="caption">
            {formatAsDatetimeAdapted(plannedPaymentError.future_date, 'LL')}
          </Typography>
        </div>
      </div>
      <div className={classes.line} />
      {parseInt(plannedPaymentError.amount_cts)
        ? `${getCurrencyDisplayWithPrice(
            parseInt(plannedPaymentError.amount_cts) / 100,
          )} `
        : ''}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  line: {
    flexGrow: 1,
    borderBottom: '1px dashed gray',
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: theme.spacing(1),
  },
}));

export default PlannedPaymentEventErrorListItem;
