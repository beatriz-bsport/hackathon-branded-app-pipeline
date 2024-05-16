// @flow

import React, { PureComponent } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import flattenDeep from 'lodash/flattenDeep';
import { DateTime } from 'luxon';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { getLocaleWeekdays } from '../../../utils/datetime';
import MarketplaceCardOffer from './MarketplaceCardOffer.component';

const SPLIT_AFTERNOON = 12;
const SPLIT_EVENNING = 17;
const DAY_PARTS = ['morning', 'afternoon', 'evening'];
type Props = {
  loading: boolean,
  classes: Object,
  onClickOffer: () => void,
  classes: Object,
  onClickBook: (offer: Offer) => void,
  onClickBookOption: (offer: Offer) => void,
  date: Object,
  t: TFunction,
  showOfferFilling: boolean,
  hideCoach: boolean,
  activityLoading: boolean,
  coachLoading: boolean,
  establishmentLoading: boolean,
  offers: Array<Offer>,
  showOfferGender?: boolean,
  bookedOffers?: number[],
  locale: string,
};

type State = {
  panelsStatus: Array<boolean>,
};

const impairColor = '#FFFFFF50';
const pairColor = '#EEEEEE50';

const getWeekOffers = (selectedDate, offers) => {
  const date_start = DateTime.fromISO(selectedDate).startOf('week', {
    useLocaleWeeks: true,
  });
  const weekdays = getLocaleWeekdays('long');
  // split offers par week days
  return weekdays.map((day, i) => {
    const currentDate = date_start.plus({ days: i });
    return offers.filter(
      (o) =>
        currentDate.weekday - 1 === i &&
        DateTime.fromISO(o.date_start).hasSame(currentDate, 'day'),
    );
  });
};

export class MarketplaceWeekTimetable extends PureComponent<Props, State> {
  state = {
    panelsStatus: [true, true, true],
    changeStatus: false,
  };

  handlePanelCollapse = (i: number) => () => {
    const { panelsStatus } = this.state;
    panelsStatus[i] = !panelsStatus[i];
    this.setState((prevState) => ({
      panelsStatus,
      changeStatus: !prevState.changeStatus,
    }));
  };

  handleBook = (offer) => () => {
    this.props.onClickBook(offer);
  };

  handleBookOption = (offer) => () => {
    this.props.onClickBookOption(offer);
  };

  /**
   * function that split offers into day periods [morning, afternoon, evening]
   */

  getOffersByPeriod = () => {
    const morning = [];
    const afternoon = [];
    const evening = [];
    const weekOffers = getWeekOffers(this.props.date, this.props.offers);
    (weekOffers || []).map((dayOffers, i) => {
      morning[i] = dayOffers.filter(
        (offer) => DateTime.fromISO(offer.date_start).hour < SPLIT_AFTERNOON,
      );

      afternoon[i] = dayOffers.filter((offer) => {
        const offerStarHour = DateTime.fromISO(offer.date_start).hour;
        return (
          offerStarHour >= SPLIT_AFTERNOON && offerStarHour < SPLIT_EVENNING
        );
      });
      evening[i] = dayOffers.filter(
        (offer) => DateTime.fromISO(offer.date_start).hour >= SPLIT_EVENNING,
      );
      return true;
    });
    return [morning, afternoon, evening];
  };

  /**
   * function that split each period offers by row
   */
  periodByRow = (period: any) => {
    const rows = [];
    const maxLength = Math.max(...period.map((os) => os.length));
    for (let i = 0; i < maxLength; i += 1) {
      // eslint-disable-next-line no-loop-func
      rows[i] = period.map((os) => os[i]);
    }
    return rows;
  };

  /**
   * function that render offers by period
   */
  renderPeriodOffers = (period: Array<*>, i: number) => {
    const { classes, t, bookedOffers } = this.props;
    const { panelsStatus } = this.state;
    const offersRows = this.periodByRow(period);

    return flattenDeep(period).length ? (
      <div key={DAY_PARTS[i]}>
        <div className={classes.periodTitle}>
          <Typography align="center" component="h3" variant="h6">
            <p>{t(`dayParts.${DAY_PARTS[i]}`)}</p>
          </Typography>
          <IconButton
            className={classes.collapseButton}
            onClick={this.handlePanelCollapse(i)}
          >
            {panelsStatus[i] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </div>
        <Collapse
          unmountOnExit
          className={classes.sessionsGroup}
          in={panelsStatus[i]}
          timeout="auto"
        >
          {offersRows.map((row, idx) => (
            <div key={idx} className={classes.offerRow}>
              {row.map((o, index) => {
                if (o === undefined) {
                  return (
                    <div key={`${idx}-${index}`} className={classes.rowItem} />
                  );
                }
                return (
                  <div key={`${idx}-${index}`} className={classes.rowItem}>
                    <MarketplaceCardOffer
                      activityLoading={this.props.activityLoading}
                      coachLoading={this.props.coachLoading}
                      establishmentLoading={this.props.establishmentLoading}
                      hideCoach={this.props.hideCoach}
                      index={index}
                      isRegistered={bookedOffers?.includes(o?.id)}
                      offer={o}
                      onClickBook={this.handleBook(o)}
                      onClickBookOption={this.handleBookOption(o)}
                      onClickOffer={this.props.onClickOffer}
                      showOfferFilling={this.props.showOfferFilling}
                      showOfferGender={this.props.showOfferGender}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </Collapse>
      </div>
    ) : (
      ''
    );
  };

  render() {
    const { loading, classes, date } = this.props;

    const weekDays = getLocaleWeekdays('long');

    const offers = this.getOffersByPeriod();

    const start_date = DateTime.fromISO(date).startOf('week', {
      useLocaleWeeks: true,
    });
    const size = 100 / 7;

    if (loading) {
      return <CircularProgress />;
    }

    return (
      <div
        style={{
          background: `linear-gradient(90deg, ${pairColor} ${size}%, ${impairColor} ${size}% ${
            2 * size
          }%, ${pairColor} ${2 * size}% ${3 * size}%,  ${impairColor} ${
            3 * size
          }% ${4 * size}%, ${pairColor} ${4 * size}% ${
            5 * size
          }%,  ${impairColor} ${5 * size}% ${6 * size}%, ${pairColor} ${
            6 * size
          }% `,
        }}
      >
        <div className={classes.weekHeader}>
          {weekDays.map((day, i) => {
            const currentDate = start_date.plus({ days: i });
            const isToday = currentDate.hasSame(DateTime.now(), 'day');
            return (
              <div
                key={currentDate.format('YYYY-MM-DD')}
                className={classes.rowItem}
              >
                <Typography
                  align="center"
                  color={isToday ? 'primary' : 'textSecondary'}
                  variant="h5"
                >
                  {`${day} ${currentDate.format(
                    this.props.locale === 'nl' ? 'D' : 'Do',
                  )}`}
                </Typography>
              </div>
            );
          })}
        </div>
        {offers.map((period, i) => this.renderPeriodOffers(period, i))}
      </div>
    );
  }
}

const styles = (theme) => ({
  emptyContent: {
    margin: theme.spacing(2),
  },
  sessionsGroup: {
    marginBottom: theme.spacing(2),
  },
  offerRow: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flexWrap: 'noWrap',
  },
  weekHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'noWrap',
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    width: '100%',
  },
  rowItem: {
    flexGrow: 1,
    flexBasis: 150,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  periodTitle: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  collapse: {
    width: '100%',
  },
  collapseButton: {
    marginLeft: theme.spacing(1),
  },
});

export default withTranslation()(withStyles(styles)(MarketplaceWeekTimetable));
