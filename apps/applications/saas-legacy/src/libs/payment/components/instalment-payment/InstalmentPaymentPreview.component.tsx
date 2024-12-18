import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HourglassIcon from '@material-ui/icons/HourglassEmpty';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { buildSchedulePlan } from './utils';

type PaymentInstalmentListItemProps = {
  paymentInstalment: {
    future_date: string;
    amount_cts: number;
  };
};

const PaymentInstalmentListItem: React.FC<PaymentInstalmentListItemProps> = ({
  paymentInstalment,
}) => (
  <ListItem divider>
    <ListItemIcon>
      <HourglassIcon />
    </ListItemIcon>
    <ListItemText
      primary={getCurrencyDisplayWithPrice(
        // @ts-expect-error
        parseFloat(paymentInstalment.amount_cts / 100).toFixed(2),
      )}
      secondary={DateTime.fromISO(paymentInstalment.future_date).toLocaleString(
        DateTime.DATE_SHORT,
      )}
    />
  </ListItem>
);

type Props = {
  interval: 'month' | 'day' | 'year' | 'week';
  nb_interval: number;
  totalPriceCts: number;
  anchor_date: string;
  recurrence_basis: number;
};

const InstalPaymentPreview: React.FC<Props> = ({
  interval,
  nb_interval,
  totalPriceCts,
  anchor_date,
  recurrence_basis,
}) => {
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  const schedule = buildSchedulePlan(
    interval,
    nb_interval || 1,
    totalPriceCts,
    anchor_date,
    recurrence_basis,
  );
  return (
    <div className={classes.container}>
      <div className={classes.explainContainer}>
        <InfoIcon className={classes.iconLeft} />
        <Typography variant="caption">
          {t('instalment.form.recurrence.explain', {
            recurrence_basis,
            nb_interval,
            interval: t(`interval.${interval}`, {
              count: recurrence_basis,
            }),
            total_interval_duration: nb_interval * recurrence_basis,
          })}
        </Typography>
      </div>
      {schedule.map((paymentInstalment, idx) => (
        <PaymentInstalmentListItem
          key={idx}
          paymentInstalment={paymentInstalment}
        />
      ))}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {},
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  explainContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    border: '1px solid #DEDEDE',
    borderRadius: 8,
    padding: theme.spacing(1),
  },
}));

export default React.memo(InstalPaymentPreview);
