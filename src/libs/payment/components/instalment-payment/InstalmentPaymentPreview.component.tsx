import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import moment from 'moment-timezone';
import HourglassIcon from '@material-ui/icons/HourglassEmpty';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import { buildSchedulePlan } from './utils';
import { getCurrencyDisplayWithPrice } from '../../../theme/selectors';

const PaymentInstalmentListItem = ({ paymentInstalment }) => (
  <ListItem divider>
    <ListItemIcon>
      <HourglassIcon />
    </ListItemIcon>
    <ListItemText
      primary={getCurrencyDisplayWithPrice(
        parseFloat(paymentInstalment.amount_cts / 100).toFixed(2),
      )}
      secondary={moment(paymentInstalment.future_date).format('L')}
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

const InstalPaymentPreview = (props: Props) => {
  const { t } = useTranslation(['payment']);
  const {
    interval,
    nb_interval,
    totalPriceCts,
    anchor_date,
    recurrence_basis,
  } = props;
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

const useStyles = makeStyles((theme: Theme) => ({
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

export default InstalPaymentPreview;
