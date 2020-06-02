// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import {
  MuiPickersUtilsProvider,
  Calendar,
  BasePicker,
} from 'material-ui-pickers';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import {
  fetchPrivateServiceWithSlotList,
  searchAvailableSlots,
  fetchMarketplacePrivateServices,
  fetchMarketplacePrivateSlots,
} from '../../libs/private-service/actions';
import { getPrivateServicesForMarketplace } from '../../libs/private-service/selectors/private-service';
import SlotSearcherResult from '../../libs/private-service/components/slot-searcher/SlotSearcherResult.component';
import SlotSearcherParams from '../../libs/private-service/components/slot-searcher/SlotSearcherParams.component';
import SlotSearcherHelper from '../../libs/private-service/components/slot-searcher/SlotSearcherHelper.component';
import type { PrivateService } from '../../libs/private-service/types';
import { getMissingResourceForBooking } from '../../libs/private-service/utils';

import MissingResourceForBookingHelper from '../../libs/private-service/components/MissingResourceForBookingHelper.component';

import { fetchAssociatedEstablishmentBulk } from '../../libs/establishment/actions';
import { fetchAssociatedCoachBulk } from '../../libs/associated-coach/actions';

type Props = {
  companyId: number,
  searchLoading: boolean,
  bookable_slots: Array<string>,
  searchAvailableSlots: (any) => void,

  private_services: Array<PrivateService>,
  privateServiceLoading: boolean,

  goToPrivateBookingPage: (
    privateServiceId: number,
    privateSlotId: number,
    associatedCoachId: number,
    date: string,
    membership: number,
  ) => void,
  classes: Object,

  fetchCoachBulk: (Array<number>) => void,
  fetchEstablishmentBulk: (Array<number>) => void,

  fetchMarketplacePrivateServices: (
    companyId: number,
    options: OptionCallback,
  ) => void,
  fetchMarketplacePrivateSlots: (companyId: number) => void,

  t: TFunction,
};

type State = {
  private_service: ?number,
  private_slot: ?number,
  establishment: ?number,
  coaches: Array<number>,
  date_selected: ?string,
};

export class MarketplacePrivateService extends React.Component<Props, State> {
  state = {
    date_selected: moment().format('YYYY-MM-DD'),
    private_service: null,
    private_slot: null,
    establishment: null,
    coaches: null,
  };

  resultsRef = React.createRef();

  componentDidMount() {
    this.props.fetchMarketplacePrivateServices(this.props.companyId, {
      onSuccess: (serviceList) => {
        this.props.fetchEstablishmentBulk(
          serviceList.reduce((acc, s) => [...acc, ...s.establishments], []),
        );
        this.props.fetchCoachBulk(
          serviceList.reduce((acc, s) => [...acc, ...s.coaches], []),
        );
      },
    });
    this.props.fetchMarketplacePrivateSlots(this.props.companyId);
  }

  searchAvailableSlots = () => {
    this.props.searchAvailableSlots(
      this.state.private_service,
      this.state.private_slot,
      this.state.coaches,
      this.state.date_selected,
      [this.state.establishment],
      {
        onSuccess: () => {
          this.resultsRef.current.scrollIntoView({ behavior: 'smooth' });
        },
      },
    );
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.private_service !== this.state.private_service ||
      prevState.private_slot !== this.state.private_slot ||
      prevState.establishment !== this.state.establishment ||
      prevState.coaches !== this.state.coaches ||
      prevState.date_selected !== this.state.date_selected
    ) {
      if (!this.missingResourceConf().length) {
        this.searchAvailableSlots();
      }
    }
  }

  getSelectedService = () => {
    return this.props.private_services.find(
      (p) => p.id === this.state.private_service,
    );
  };

  getSelectedSlot = () => {
    const service = this.getSelectedService();
    if (service) {
      return service.slots.find((s) => s.id === this.state.private_slot);
    }
    return null;
  };

  missingResourceConf = () => {
    return getMissingResourceForBooking(
      this.getSelectedService(),
      this.state,
      false,
    );
  };

  handleConfigurationChange = (private_booking_data) => {
    this.setState({
      coaches: private_booking_data.coaches,
      establishment: private_booking_data.establishment,
      private_service: private_booking_data.private_service,
      private_slot: private_booking_data.private_slot,
    });
  };

  handleDateChange = (date_selected) => {
    this.setState({ date_selected });
  };

  render() {
    const missingResources = this.missingResourceConf();

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
              <Typography variant="h5" className={this.props.classes.title}>
                {this.props.t('bookerModule.title')}
              </Typography>
              <Paper>
                <div className={this.props.classes.selectorsContainer}>
                  <SlotSearcherParams
                    private_services={this.props.private_services}
                    onConfigurationChange={this.handleConfigurationChange}
                  />
                </div>
                <Divider />
                <MuiPickersUtilsProvider
                  utils={MomentUtils}
                  moment={moment}
                  locale={moment.locale()}
                >
                  <BasePicker value={this.state.date_selected}>
                    {() => (
                      <div className="picker">
                        <div style={{ overflow: 'hidden' }}>
                          <Calendar
                            disablePast
                            date={moment(
                              this.state.date_selected,
                              'YYYY-MM-DD',
                            )}
                            onChange={this.handleDateChange}
                          />
                        </div>
                      </div>
                    )}
                  </BasePicker>
                </MuiPickersUtilsProvider>
                {missingResources.length ? (
                  <MissingResourceForBookingHelper
                    missingResources={missingResources}
                  />
                ) : null}
              </Paper>
              <div ref={this.resultsRef}>
                {missingResources.length ? null : (
                  <SlotSearcherResult
                    bookable_slots={this.props.bookable_slots}
                    date={this.state.date_selected}
                    loading={this.props.searchLoading}
                    private_service={this.getSelectedService()}
                    private_slot={this.getSelectedSlot()}
                    onDateClick={(date, additionalParams) =>
                      this.props.goToPrivateBookingPage(
                        this.state.private_service,
                        this.state.private_slot,
                        this.props.companyId,
                        {
                          date,
                          establishment: this.state.establishment,
                          ...(additionalParams || {}),
                        },
                      )
                    }
                  />
                )}
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Hidden smDown>
                <SlotSearcherHelper
                  privateService={this.getSelectedService()}
                  privateSlot={this.getSelectedSlot()}
                  coaches={
                    this.getSelectedService()
                      ? this.getSelectedService().coaches
                      : []
                  }
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
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: '20vh',
  },
  selectorsContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  slotSearcherContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    maxWidth: 360,
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  emptyTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(4),
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
  connect(
    (state) => ({
      private_services: getPrivateServicesForMarketplace(state),
      bookable_slots: state.privateService.availabilitySlot.searched.items,
      searchLoading: state.privateService.availabilitySlot.searched.loading,
      privateServiceLoading: state.privateService.privateService.loading,
    }),
    {
      fetchMarketplacePrivateServices,
      fetchMarketplacePrivateSlots,
      fetchEstablishmentBulk: fetchAssociatedEstablishmentBulk,
      fetchCoachBulk: fetchAssociatedCoachBulk,
      fetchPrivateServiceWithSlotList,
      searchAvailableSlots,
      goToPrivateBookingPage: (
        privateServiceId: number,
        privateSlotId: number,
        membership: number,
        data: any,
      ) =>
        push(
          `/customer/payment/private-service/${privateServiceId}/private-slot/${privateSlotId}/?membership=${membership}&data=${encodeURIComponent(
            JSON.stringify(data),
          )}`,
        ),
    },
  ),
)(MarketplacePrivateService);
