// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import {
  fetchPrivateServiceWithSlotList,
  searchAvailableSlots,
} from '../../libs/private-service/actions';
import { getPrivateServicesForMarketplace } from '../../libs/private-service/selectors/private-service';
import SlotSearcher from '../../libs/private-service/components/booking-module/SlotSearcher.component';
import SlotSearcherHelper from '../../libs/private-service/components/booking-module/SlotSearcherHelper.component';
import type { PrivateService } from '../../libs/private-service/types';

type Props = {
  companyId: number,
  searchLoading: boolean,
  bookable_slots: Array<string>,
  searchAvailableSlots: (any) => void,

  private_services: Array<PrivateService>,
  fetchPrivateServiceWithSlotList: (company: number, params: any) => void,
  privateServiceLoading: boolean,
  setPrivateService: (?number) => void,
  setPrivateSlot: (?number) => void,
  setCoach: (?number) => void,
  privateSlot: ?number,
  privateService: ?number,
  coach: ?number,

  goToPrivateBookingPage: (
    privateServiceId: number,
    privateSlotId: number,
    associatedCoachId: number,
    date: string,
  ) => void,
  classes: Object,

  t: TFunction,
};

export class MarketplacePrivateService extends React.Component<Props> {
  componentWillMount() {
    this.props.fetchPrivateServiceWithSlotList(this.props.companyId, {
      available: true,
    });
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        {this.props.privateServiceLoading ? <LinearProgress /> : null}
        {!this.props.privateServiceLoading &&
        this.props.private_services.length === 0 ? (
          <div className={this.props.classes.emptyTextContainer}>
            <Typography color="textSecondary">
              {this.props.t('bookerModule.noPrivateServiceAvailable')}
            </Typography>
          </div>
        ) : null}
        {this.props.private_services.length === 0 ? null : (
          <Grid
            container
            justify="space-around"
            alignItems="flex-start"
            direction="row"
          >
            <Grid
              item
              xs={12}
              md={6}
              className={this.props.classes.slotSearcherContainer}
            >
              <SlotSearcher
                bookable_slots={this.props.bookable_slots}
                private_services={this.props.private_services}
                searchAvailableSlots={this.props.searchAvailableSlots}
                onClickBook={this.props.goToPrivateBookingPage}
                searchLoading={this.props.searchLoading}
                onPrivateServiceChange={this.props.setPrivateService}
                onPrivateSlotChange={this.props.setPrivateSlot}
                onCoachChange={this.props.setCoach}
                onDateChange={() => {}}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Hidden smDown>
                <SlotSearcherHelper
                  privateService={this.props.privateService}
                  privateSlot={this.props.privateSlot}
                  coach={this.props.coach}
                />
              </Hidden>
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  slotSearcherContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  emptyTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: theme.spacing.unit * 4,
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
  connect(
    (state) => ({
      private_services: getPrivateServicesForMarketplace(state),
      bookable_slots: state.privateService.availabilitySlot.searched.items,
      searchLoading: state.privateService.availabilitySlot.searched.loading,
      privateServiceLoading: state.privateService.privateService.loading,
    }),
    {
      fetchPrivateServiceWithSlotList,
      searchAvailableSlots,
      goToPrivateBookingPage: (
        privateServiceId: number,
        privateSlotId: number,
        associatedCoachId: number,
        date: string,
      ) =>
        push(
          `/customer/payment/private-service/${privateServiceId}/private-slot/${privateSlotId}/associated-coach/${associatedCoachId}/date/${date}/`,
        ),
    },
  ),
  withState('privateService', 'setPrivateService', null),
  withState('privateSlot', 'setPrivateSlot', null),
  withState('coach', 'setCoach', null),
)(MarketplacePrivateService);
