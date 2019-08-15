// @flow

import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';

import { Moment } from '../../../i18n';

import MarketplaceCardOffer from './MarketplaceCardOffer.component';

type Props = {
  weekOffers: *[],
  loading: boolean,
  classes: Object,
  onClickOffer: () => void,
  classes: Object,
  onClickBook: (offerId: number) => void,
  onClickBookOption: (offerId: number) => void,
  date: Object,
};

export const MarketplaceWeekTimetable = (props: Props) => {
  const { loading, classes, weekOffers } = props;
  const weekDays = Moment.weekdaysShort(true);

  if (loading) {
    return <CircularProgress />;
  }
  return (
    <div className={classes.offersContainer}>
      {weekOffers.map((dayOffers, i) => (
        <div className={classes.offersColumn} key={i}>
          <Typography
            align="center"
            variant="h5"
            color="textSecondary"
            gutterBottom
          >
            {`${weekDays[i]} ${props.date
              .clone()
              .startOf('week')
              .add(i, 'days')
              .format('Do')}`}
          </Typography>
          {dayOffers.map((o) => (
            <div className={classes.offerContainer} key={o.id}>
              <MarketplaceCardOffer
                offer={o}
                onClickOffer={props.onClickOffer}
                onClickBook={() => props.onClickBook(o.id)}
                onClickBookOption={() => props.onClickBookOption(o.id)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const styles = (theme) => ({
  title: {
    margin: theme.spacing.unit * 2,
  },
  emptyContent: {
    margin: theme.spacing.unit * 2,
  },
  offerContainer: {
    width: '100%',
  },
  offersContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'noWrap',
  },
  offersColumn: {
    flex: 1,
    paddingTop: theme.spacing.unit * 2,
  },
  marginBefore: {
    marginTop: theme.spacing.unit * 2,
  },
});

export default withNamespaces()(withStyles(styles)(MarketplaceWeekTimetable));
