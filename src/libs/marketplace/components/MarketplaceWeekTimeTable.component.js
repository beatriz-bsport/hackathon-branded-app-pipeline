// @flow

import React, { Component, Fragment } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import _ from 'lodash';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Moment } from '../../../i18n';
import MarketplaceCardOffer from './MarketplaceCardOffer.component';

const SPLIT_AFTERNOON = 12;
const SPLIT_EVENNING = 18;
const DAY_PARTS = ['morning', 'afternoon', 'evening'];
type Props = {
  weekOffers: Array<[]>,
  loading: boolean,
  classes: Object,
  onClickOffer: () => void,
  classes: Object,
  onClickBook: (offerId: number) => void,
  onClickBookOption: (offerId: number) => void,
  date: Object,
  t: TFunction,
};

type State = {
  panelsStatus: Array<boolean>,
};

export class MarketplaceWeekTimetable extends Component<Props, State> {
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
    const { weekOffers } = this.props;
    const morning = [];
    const afternoon = [];
    const evening = [];
    // orrange offers by day period
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
            {t(`dayParts.${DAY_PARTS[i]}`)}
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
              {row.map((o) => (
                <div className={classes.rowItem}>
                  {o === undefined ? (
                    ''
                  ) : (
                    <MarketplaceCardOffer
                      offer={o}
                      onClickOffer={this.props.onClickOffer}
                      onClickBook={() => this.props.onClickBook(o.id)}
                      onClickBookOption={() =>
                        this.props.onClickBookOption(o.id)
                      }
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
    const { loading, classes, weekOffers, t, date } = this.props;

    const weekDays = Moment.weekdaysShort(true);

    const offers = this.getOffersByPeriod();

    const start_date = date.clone().startOf('week');

    // if we start from firday we have to reorder the array of days
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
      <div>
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
    marginTop: theme.spacing.unit,
  },
  weekHeader: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'noWrap',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    backgroundColor: 'white',
  },
  rowItem: {
    flexGrow: 1,
    flexBasis: 150,
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
