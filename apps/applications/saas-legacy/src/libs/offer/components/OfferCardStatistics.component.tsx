import React, { memo } from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import { useTranslation } from 'react-i18next';

type Props = {
  effectif: number;
  numberOfBookings: number;
  waitingListMaxSize: number;
  nbOptions: number;
  male: number;
  female: number;
  other: number;
  showOfferGender?: boolean;
};

const InboxPanelOfferStatistics: React.FC<Props> = ({
  effectif,
  numberOfBookings,
  waitingListMaxSize,
  nbOptions,
  male,
  female,
  other,
  showOfferGender,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('offer');

  const occupancyRate =
    effectif > 0 ? Math.round((numberOfBookings / effectif) * 100) : 0;

  const numberOfBookingOptions = nbOptions || 0;

  return (
    <div className={classes.statisticsContainer}>
      <div className={classes.statisticItem}>
        <Typography align="center" color="primary" variant="h5">
          {numberOfBookings}
          {`/${effectif}`}
        </Typography>
        {showOfferGender ? (
          <Typography align="center" variant="caption">
            {t('booking.confirmed')} (&#9792;{female}
            {`/${male}`}&#9794;+
            {other})
          </Typography>
        ) : (
          <Typography align="center" variant="caption">
            {t('booking.confirmed')}
          </Typography>
        )}
      </div>

      <div className={classes.statisticItem}>
        <Typography align="center" color="textPrimary" variant="h5">
          {occupancyRate} %
        </Typography>
        <Typography align="center" variant="caption">
          {t('booking.fillRate')}
        </Typography>
      </div>

      <div className={classes.statisticItem}>
        <Typography
          align="center"
          color={numberOfBookingOptions ? 'error' : 'secondary'}
          variant="h5"
        >
          {numberOfBookingOptions}
          {`/${waitingListMaxSize}`}
        </Typography>
        <Typography align="center" variant="caption">
          {t('booking.waiting')}
        </Typography>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  statisticsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  statisticItem: {
    flex: '1 0 0',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.grey[100],
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

export default memo(InboxPanelOfferStatistics);
