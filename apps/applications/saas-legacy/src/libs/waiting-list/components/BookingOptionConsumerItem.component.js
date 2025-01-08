// @flow
import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTheme } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';

import { compose } from 'recompose';
import { MarketPlaceCoachDisplay } from '@bsport/common/master-data/personalization.js';
import { CustomChip } from '#src/components/chip/CustomChip.component';
import ActivityMinimalSummary from '../../../components/activity/ActivityMinimalSummary.component';
import RedButton from '../../../components/button/RedButton.component';
import { getUserZone, formatAsDatetimeAdapted } from '../../../utils/datetime';
import type { BookingOption } from '../../../api/types';

type OwnProps = {
  confirmBookingOption: () => void,
  cancelBookingOption: () => void,
  bookingOption: BookingOption,
  loading: boolean,
  classes: Object,
  displayPositionInWaitingList: boolean,
  waitingListPosition: { member_position: number, waiting_list_size: number },
  t: (x: string) => string,
  coachDisplay?: MarketPlaceCoachDisplay,
  metaActivity: MetaActivity,
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

export class BookingOptionConsumerItem extends Component<Props> {
  renderButtons = () => {
    if (this.props.loading) {
      return (
        <Grid
          container
          alignItems="center"
          direction="row"
          justify="center"
          spacing={2}
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid
        container
        alignItems="center"
        direction="row"
        justify="space-around"
      >
        <Grid item>
          <Grid container item alignItems="center" justify="center">
            {this.props.displayPositionInWaitingList &&
            this.props.waitingListPosition &&
            !this.props.bookingOption.is_convertible ? (
              <Grid container item alignItems="center" direction="row">
                <Grid item>
                  <div>
                    {this.props.t('consumer.booking.waintingListPositionLabel')}
                  </div>
                </Grid>
                <Grid item>
                  <div className={this.props.classes.chipContainer}>
                    <CustomChip
                      displayedValue={`${this.props.waitingListPosition.member_position}/${this.props.waitingListPosition.waiting_list_size}`}
                      mainColor={this.props.theme.palette.primary.main}
                    />
                  </div>
                </Grid>
              </Grid>
            ) : (
              <Button
                color="primary"
                disabled={!this.props.bookingOption.is_convertible}
                onClick={this.props.confirmBookingOption}
              >
                {this.props.bookingOption.is_convertible
                  ? this.props.t('consumer.booking.confirmBooking')
                  : this.props.t('consumer.booking.waitingSlot')}
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid item>
          <Grid container item alignItems="center" justify="center">
            <RedButton onClick={this.props.cancelBookingOption}>
              {this.props.t('consumer.booking.cancelOption')}
            </RedButton>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { bookingOption, classes, metaActivity } = this.props;
    const { offer, is_convertible } = bookingOption;
    const { activity } = offer;

    const tzName = metaActivity?.is_broadcast
      ? getUserZone()
      : (activity.establishment || activity.etablissement)?.tzname ??
        'Europe/Paris';

    return (
      <Paper>
        <Grid
          container
          alignItems="stretch"
          className={is_convertible ? null : classes.disabled}
          direction="column"
        >
          <Grid item xs={12}>
            {activity ? (
              <ActivityMinimalSummary
                noDivider
                activity={activity}
                coachDisplay={this.props.coachDisplay}
                date={formatAsDatetimeAdapted(
                  offer.date_start,
                  'D - t',
                  tzName,
                )}
                offer={offer}
              />
            ) : (
              <CircularProgress />
            )}
          </Grid>
          <Divider />
          <Grid item xs={12}>
            {this.renderButtons()}
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

const styles = (theme) => ({
  disabled: {
    backgroundColor: '#F5F5F5',
  },
  chipContainer: {
    marginLeft: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation('translation'),
  withTheme,
)(BookingOptionConsumerItem);
