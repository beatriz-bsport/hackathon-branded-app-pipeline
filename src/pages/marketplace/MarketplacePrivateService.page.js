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
import { fetchCompanyActivities } from '../../libs/meta-activity/actions';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import { fetchEstablishments } from '../../libs/establishment/actions';

type Props = {
  companyId: number,
  searchLoading: boolean,
  bookable_slots: Array<string>,
  searchAvailableSlots: (any) => void,
  authenticated: boolean,
  requestLogin: () => void,

  private_services: Array<PrivateService>,
  fetchPrivateServiceWithSlotList: (company: number, params: any) => void,
  privateServiceLoading: boolean,
  setPrivateService: (?number) => void,
  setPrivateSlot: (?number) => void,
  setCoaches: (Array<number>) => void,
  privateSlot: ?number,
  privateService: ?number,
  coaches: Array<number>,

  fetchCompanyActivities: (companyId: number) => void,
  fetchAssociatedCoachesList: (params: any) => void,
  fetchEstablishments: (params: any) => void,

  goToPrivateBookingPage: (
    privateServiceId: number,
    privateSlotId: number,
    associatedCoachId: number,
    date: string,
    membership: number,
  ) => void,
  classes: Object,

  t: TFunction,
};

export class MarketplacePrivateService extends React.Component<Props> {
  componentWillMount() {
    this.props.fetchCompanyActivities(this.props.companyId);
    this.props.fetchAssociatedCoachesList({ company: this.props.companyId });
    this.props.fetchEstablishments({ company: this.props.companyId });
    this.props.fetchPrivateServiceWithSlotList(this.props.companyId, {
      available: true,
    });
  }

  searchAvailableSlots = (...params) => {
    if (!this.props.authenticated) {
      this.props.requestLogin();
    }
    this.props.searchAvailableSlots(...params);
  };

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
                searchAvailableSlots={this.searchAvailableSlots}
                onClickBook={(...args) =>
                  this.props.goToPrivateBookingPage(
                    ...args,
                    this.props.companyId,
                  )
                }
                searchLoading={this.props.searchLoading}
                onPrivateServiceChange={this.props.setPrivateService}
                onPrivateSlotChange={this.props.setPrivateSlot}
                onCoachChange={this.props.setCoaches}
                onDateChange={() => {}}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Hidden smDown>
                <SlotSearcherHelper
                  privateService={this.props.privateService}
                  privateSlot={this.props.privateSlot}
                  coaches={this.props.coaches}
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
      fetchCompanyActivities,
      fetchEstablishments,
      fetchAssociatedCoachesList,
      fetchPrivateServiceWithSlotList,
      searchAvailableSlots,
      goToPrivateBookingPage: (
        privateServiceId: number,
        privateSlotId: number,
        associatedCoachId: number,
        date: string,
        membership: number,
      ) =>
        push(
          `/customer/payment/private-service/${privateServiceId}/private-slot/${privateSlotId}/associated-coach/${associatedCoachId}/date/${date}/?membership=${membership}`,
        ),
    },
  ),
  withState('privateService', 'setPrivateService', null),
  withState('privateSlot', 'setPrivateSlot', null),
  withState('coaches', 'setCoaches', []),
)(MarketplacePrivateService);
