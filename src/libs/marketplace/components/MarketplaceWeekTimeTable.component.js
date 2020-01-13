// @flow

import React, { PureComponent, Fragment } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import _ from 'lodash';
import moment from 'moment';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { DATE_FORMAT } from '../../../datetime';
import { Moment } from '../../../i18n';
import MarketplaceCardOffer from './MarketplaceCardOffer.component';

const SPLIT_AFTERNOON = 12;
const SPLIT_EVENNING = 17;
const DAY_PARTS = ['morning', 'afternoon', 'evening'];
type Props = {
  loading: boolean,
  classes: Object,
  onClickOffer: () => void,
  classes: Object,
  onClickBook: (offerId: number) => void,
  onClickBookOption: (offerId: number) => void,
  date: Object,
  t: TFunction,
  showOfferFilling: boolean,
  activityLoading: boolean,
  coachLoading: boolean,
  establishmentLoading: boolean,
  offers: Array<Offer>,
};

type State = {
  panelsStatus: Array<boolean>,
};

const impairColor = '#FFFFFF50';
const pairColor = '#EEEEEE50';

const getWeekOffers = (selectedDate, offers) => {
  const date_start = Moment(selectedDate, DATE_FORMAT)
    .clone()
    .startOf('week');
  const weekdays = Moment.weekdays(true);
  // split offers par week days
  return weekdays.map((day, i) => {
    const currentDate = Moment(date_start).add(i, 'days');
    return offers.filter(
      (o) =>
        currentDate.weekday() === i &&
        Moment(o.date_start).isSame(currentDate, 'day'),
    );
  });
};

export class MarketplaceWeekTimetable extends PureComponent<Props, State> {
  state = {
    panelsStatus: [true, true, true],
  };

  handlePanelCollapse = (i: number) => {
    const { panelsStatus } = this.state;
    panelsStatus[i] = !panelsStatus[i];
    this.setState({ panelsStatus });
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
        (offer) => Moment(offer.date_start).format('HH') < SPLIT_AFTERNOON,
      );

      afternoon[i] = dayOffers.filter((offer) => {
        const offerStarHour = Moment(offer.date_start).format('HH');
        return (
          offerStarHour >= SPLIT_AFTERNOON && offerStarHour < SPLIT_EVENNING
        );
      });
      evening[i] = dayOffers.filter(
        (offer) => Moment(offer.date_start).format('HH') >= SPLIT_EVENNING,
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
    const { classes, t } = this.props;
    const { panelsStatus } = this.state;

    const offersRows = this.periodByRow(period);

    return _.flattenDeep(period).length ? (
      <Fragment>
        <div className={classes.periodTitle}>
          <Typography component="h3" variant="h6" align="center">
            <p>{t(`dayParts.${DAY_PARTS[i]}`)}</p>
          </Typography>
          <IconButton
            onClick={() => this.handlePanelCollapse(i)}
            className={classes.collapseButton}
          >
            {panelsStatus[i] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </div>
        <Collapse
          in={panelsStatus[i]}
          timeout="auto"
          unmountOnExit
          className={classes.sessionsGroup}
        >
          {offersRows.map((row) => (
            <div className={classes.offerRow}>
              {row.map((o, index) => (
                <div className={classes.rowItem}>
                  {o === undefined ? (
                    ''
                  ) : (
                    <MarketplaceCardOffer
                      showOfferFilling={this.props.showOfferFilling}
                      offer={o}
                      onClickOffer={this.props.onClickOffer}
                      onClickBook={() => this.props.onClickBook(o.id)}
                      onClickBookOption={() =>
                        this.props.onClickBookOption(o.id)
                      }
                      index={index}
                      coachLoading={this.props.coachLoading}
                      establishmentLoading={this.props.establishmentLoading}
                      activityLoading={this.props.activityLoading}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </Collapse>
      </Fragment>
    ) : (
      ''
    );
  };

  render() {
    const { loading, classes, t, date } = this.props;

    const weekDays = Moment.weekdaysShort(true);

    const offers = this.getOffersByPeriod();

    const start_date = moment(date, DATE_FORMAT)
      .clone()
      .startOf('week');
    const size = 100 / 7;
    // if we start from firday we have to reorder the array of days
    const weekOffers = getWeekOffers(this.props.date, this.props.offers);
    if (!_.flattenDeep(weekOffers).length) {
      return (
        <Typography variant="caption" className={classes.emptyContent}>
          {t('marketplace.noSessionToday')}
        </Typography>
      );
    }

    if (loading) {
      return <CircularProgress />;
    }
    return (
      <div
        style={{
          background: `linear-gradient(90deg, ${pairColor} ${size}%, ${impairColor} ${size}% ${2 *
            size}%, ${pairColor} ${2 * size}% ${3 *
            size}%,  ${impairColor} ${3 * size}% ${4 *
            size}%, ${pairColor} ${4 * size}% ${5 *
            size}%,  ${impairColor} ${5 * size}% ${6 *
            size}%, ${pairColor} ${6 * size}% `,
        }}
      >
        <div className={classes.weekHeader}>
          {weekDays.map((day, i) => {
            const currentDate = start_date.clone().add(i, 'days');
            const isToday = currentDate.isSame(Moment(), 'day');
            return (
              <div className={classes.rowItem} key={i}>
                <Typography
                  align="center"
                  variant="h5"
                  color={isToday ? 'primary' : 'textSecondary'}
                >
                  {`${day} ${currentDate.format('Do')}`}
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
    margin: theme.spacing.unit * 2,
  },
  sessionsGroup: {
    marginBottom: theme.spacing.unit * 2,
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
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
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
    marginLeft: theme.spacing.unit,
  },
});

export default withNamespaces()(withStyles(styles)(MarketplaceWeekTimetable));
