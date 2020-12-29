// @flow
import React, { PureComponent } from 'react';
import memoize from 'memoize-one';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withState, withHandlers } from 'recompose';
import omit from 'lodash/omit';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import AddIcon from '@material-ui/icons/Add';
import Immutable from 'seamless-immutable';
import {
  push as pushRouter,
  goBack as goBackRouter,
} from 'connected-react-router';

import moment from 'moment-timezone';

import {
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_CONSUMER,
  BOOKING_STATUS_CANCELLED_BY_OFFER,
} from '@bsport/common/lib/master-data/booking_status_code';

import withTitle from '../../hocs/with-title.hoc';

import { getSimilars as getSimilarsOffers } from '../../libs/offer/selectors';
import OfferCard from '../../components/offer/OfferCard.component';
import TimeTable from '../../components/offer/TimeTable.component';
import Calendar from '../../components/offer/Calendar.component';
import { getPermissions } from '../../libs/role/selectors';
import { getEnabledMetaActivities } from '../../libs/meta-activity/selectors';
import { getActiveCoaches } from '../../libs/associated-coach/selectors.ts';
import { fetchAllActivities } from '../../libs/meta-activity/actions';
import { fetchEstablishments } from '../../libs/establishment/actions.ts';
import { getAvailableEstablishmentList } from '../../libs/establishment/selectors.ts';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions.ts';
import { Establishment } from '../../libs/establishment/types.ts';
import BookingStatisticsCard from '../../libs/booking/components/BookingStatisticsCard.component';

import {
  fetchAllOffers as fetchAllOffersAction,
  deleteOffer as deleteOfferAction,
  fetchSimilarOffers as fetchSimilarOffersAction,
  setFilters as setFiltersAction,
  disableMassOffers,
  restoreOffer,
} from '../../libs/offer/actions';
import {
  editLiveOffer as editLiveOfferAPI,
  disableOffer as disableOfferAPI,
  deleteOffer as deleteOfferAPI,
} from '../../libs/offer/api';

import { fetchFilteredMembers as fetchFilteredMembersAction } from '../../libs/member/actions';
import { getAllMembers } from '../../libs/member/selectors';

import { fetchBookingsByOffer as fetchBookingsByOfferAction } from '../../libs/booking/actions';
import { getOfferBookingList } from '../../libs/booking/selectors';

import { fetchBookingStatistics as fetchBookingStatisticsAction } from '../../actions/stats.actions';

import {
  getBookingRelatedStatisticLoading,
  getStats,
} from '../../state/stats/selectors';

import type { Offer, Coach } from '../../api/types';
import type { OfferFilter } from '../../libs/offer/types';

import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';
import OfferEditForm from '../../libs/offer/OfferEditForm.component';
import MassDisablerDialog from '../../libs/offer/components/MassDisablerDialog.component.tsx';
import OfferFormWithActivity from '../../libs/offer/OfferFormWithActivity.component';
import DeleteOfferForm from '../../libs/offer/DeleteOfferForm.component';
import { createOffers as createOffersAPI } from '../../libs/meta-activity/api/meta-activity';
import type { Permission } from '../../libs/role/types';
import { DATE_FORMAT } from '../../datetime';

import CoachSelector from '../../libs/associated-coach/components/CoachSelector.component';
import EstablishmentSelector from '../../libs/establishment/components/EstablishmentSelector.component';
import MetaActivitySelector from '../../libs/meta-activity/components/MetaActivitySelector.component';

import { monitorBackgroundTask } from '../../libs/background-task/actions';

const styles = (theme) => ({
  container: {
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  selector: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },

  emptyOffer: {
    padding: theme.spacing(3),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  paper: {
    marginTop: theme.spacing(5),
  },
  noOfferMessage: {
    marginTop: theme.spacing(5),
    textAlign: 'center',
  },
  goBackButton: {
    paddingLeft: theme.spacing(2),
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
  },
});

type Props = {
  t: TFunction,
  classes: Object,
  date: string,
  selectedOffer: Offer,

  theme: ?CompanyTheme,

  timetableLoading: boolean,
  fullScreen: boolean,
  coachesLoading: boolean,
  establishmentsLoading: boolean,
  similarOfferLoading: boolean,
  activitiesLoading: boolean,
  width: string,
  offerByDayLoading: boolean,
  createdBookingStatsLoading: boolean,
  cancelledBookingStatsLoading: boolean,

  fetchAssociatedCoachesList: () => void,
  fetchAllActivities: () => void,
  fetchFilteredMembers: (params: any) => void,
  fetchBookingsByOffer: (params: any) => void,
  fetchBookingStatsOfTheWeek: () => void,
  fetchBookingInOfferStats: () => void,
  permission: Permission,
  metaActivities: Array<MetaActivity>,
  offers: Array<Offer>,
  similarOffers: Array<Offer>,
  events: Array<Event>,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  bookingStatistics: {
    createdBookings: Array<any>,
    cancelledBookings: Array<any>,
    start: Moment,
    end: Moment,
  },
  companyId: number,

  goToOfferManagement: () => void,
  fetchRelevantOffers: () => void,
  goBack: () => void,
  replaceRouter: (path: string) => void,
  loadOfferData: (Object) => void,
  fetchOffersByDay: (params: any) => void,
  fetchEstablishments: () => void,

  fetchSimilarOffers: (offerId: number) => void,

  snackbarSuccess: (string) => void,
  snackbarError: (string) => void,

  offerFilters: OfferFilter,
  setFilters: (OfferFilter) => null,

  pushToSchedule: () => void,

  members: Array<Member>,
  membersLoading: boolean,
  bookings: Array<Booking>,
  bookingsLoading: boolean,

  massDisablerStartDate: ?string,
  disableMassOffers: (
    params: any,
    filters: any,
    options: OptionCallback,
  ) => void,
  setMassDisablerStartDate: (?string) => void,
  setShowCancelledOffers: (boolean) => void,
  setOpenDeleteDialog: () => void,
  openDeleteDialog: boolean,

  monitorBackgroundTask: (uuid: string, options?: OptionCallback) => void,
  restoreOffer: (offerId: number, options: any) => void,
};

type State = {
  editModalOpened: boolean,
  deleteModalOpened: boolean,
  editOfferProcessing: boolean,
  deletingOffer: boolean,
  createOfferModalOpened: boolean,
  creatingOffers: boolean,
  restoreModalOpen: boolean,
};

export class Planning extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      editModalOpened: false,
      deleteModalOpened: false,
      editOfferProcessing: false,
      deletingOffer: false,
      createOfferModalOpened: false,
      creatingOffers: false,
      restoreModalOpen: false,
    };
  }

  fetchData = () => {
    this.props.fetchRelevantOffers();
    if (this.props.selectedOffer) {
      this.props.loadOfferData(this.props.selectedOffer);
    }
    if (this.props.date) {
      this.loadDayData();
    }
  };

  componentDidMount() {
    this.fetchData();
    this.props.fetchBookingStatsOfTheWeek();
    this.props.fetchAssociatedCoachesList();
    this.props.fetchEstablishments();
    this.props.fetchAllActivities({ customer_enabled: true });
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.date !== this.props.date &&
      !moment(prevProps.date).isSame(moment(this.props.date), 'month')
    ) {
      this.fetchData();
    }
    if (prevProps.offerFilters !== this.props.offerFilters) {
      this.fetchData();
      this.props.fetchBookingStatsOfTheWeek();
    }
    if (
      this.props.selectedOffer &&
      this.props.selectedOffer !== prevProps.selectedOffer
    ) {
      this.props.fetchFilteredMembers({
        offer: this.props.selectedOffer.id,
        withNotes: true,
      });
      this.props.fetchBookingsByOffer(this.props.selectedOffer.id);
      this.props.fetchBookingInOfferStats();
    }
    if (prevProps.selectedOffer && !this.props.selectedOffer) {
      this.props.fetchBookingStatsOfTheWeek();
    }
    if (!moment(prevProps.date).isSame(moment(this.props.date), 'week')) {
      this.props.fetchBookingStatsOfTheWeek();
    }
  }

  loadDayData = (day: ?string) => {
    const date = moment(day || this.props.date, DATE_FORMAT);
    this.props.replaceRouter(
      `/calendar/${date.year()}/${date.month() + 1}/${date.date()}`,
    );
    this.props.fetchOffersByDay({
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
      ...(this.props.offerFilters || {}),
    });
  };

  openEditModal = () => {
    this.setState({ editModalOpened: true });
    this.props.fetchEstablishments();
    this.props.fetchAssociatedCoachesList();
  };

  openDeleteModal = () => {
    this.setState({ deleteModalOpened: true });
  };

  openRestoreModal = () => {
    this.setState({ restoreModalOpen: true });
  };

  onCancelModal = () => {
    this.setState({
      editOfferProcessing: false,
      editModalOpened: false,
      deleteModalOpened: false,
    });
  };

  openCreateOfferModal = () => {
    this.setState({ createOfferModalOpened: true });
    this.props.fetchEstablishments();
    this.props.fetchAssociatedCoachesList();
  };

  closeCreateOffersModal = () => {
    this.setState({ createOfferModalOpened: false });
  };

  onConfirmModal = async ({ offerId, data }) => {
    this.setState({ editOfferProcessing: true });
    try {
      const response = await editLiveOfferAPI({ offerId, data });
      if (response.status === 200) {
        const backgroundTaskUuid = response.headers['x-background-task-uuid'];
        this.setState({ editOfferProcessing: false, editModalOpened: false });
        this.props.monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            this.props.fetchRelevantOffers();
            this.loadDayData();
          },
        });
        return;
      }
    } catch (err) {
      console.error(err);
    }
    this.setState({ editOfferProcessing: false });
  };

  onCancelOffer = async (data: {
    offerId: number,
    cashback: ?boolean,
    notify: ?boolean,
    deleteAll: ?boolean,
    custom_selection: ?boolean,
    custom_selection_ids: ?Array<number>,
  }) => {
    this.setState({ deletingOffer: true });
    try {
      const {
        notify,
        cashback,
        deleteAll,
        offerId,
        custom_selection,
        custom_selection_ids,
      } = data;
      const response = await disableOfferAPI({
        offerId,
        cashback,
        notify,
        deleteAll,
        custom_selection,
        custom_selection_ids,
      });
      if (response.status === 200) {
        const backgroundTaskUuid = response.headers['x-background-task-uuid'];
        this.setState({ deletingOffer: false, deleteModalOpened: false });
        this.props.monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            this.loadDayData();
          },
        });
        return;
      }
    } catch (err) {
      this.setState({ deletingOffer: false, deleteModalOpened: false });
      this.props.snackbarError('background.cannotFetch');
      console.error(err);
      throw err;
    }
    this.setState({ deletingOffer: false });
  };

  onHardDeleteOffer = async (offerId: number, data: any) => {
    this.setState({ deletingOffer: true });
    try {
      const response = await deleteOfferAPI(offerId, data);
      if (response.status === 204) {
        const backgroundTaskUuid = response.headers['x-background-task-uuid'];
        this.setState({ deletingOffer: false, deleteModalOpened: false });
        this.props.monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            this.props.fetchRelevantOffers();
            this.loadDayData();
          },
        });
        return;
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert(this.props.t('calendar.canDeleteWithBooking'));
      } else {
        this.props.snackbarError('background.cannotFetch');
      }
      console.error(err);
    }
    this.setState({ deletingOffer: false });
  };

  renderNoOfferSelected = () => {
    const { t, classes } = this.props;
    return (
      <div className={classes.emptyOffer}>
        <Typography align="center" variant="caption">
          {t('calendar.pleaseSelectOffer')}
        </Typography>
      </div>
    );
  };

  renderEditModal = () => {
    const {
      coaches,
      coachesLoading,
      establishments,
      establishmentsLoading,
      fetchSimilarOffers,
      similarOfferLoading,
      similarOffers,
    } = this.props;
    const { editModalOpened, editOfferProcessing } = this.state;
    const { selectedOffer } = this.props;

    if (selectedOffer) {
      return (
        <Dialog open={editModalOpened}>
          <DialogContent>
            <OfferEditForm
              offer={selectedOffer}
              metaActivities={this.props.metaActivities.filter(
                (ma) => ma.customer_enabled && !ma.is_workshop,
              )}
              coaches={coaches}
              establishments={establishments}
              is_whereby_integration_enabled={
                this.props.theme &&
                this.props.theme.is_whereby_integration_enabled &&
                this.props.theme.is_whereby_integration_allowed
              }
              loading={coachesLoading || establishmentsLoading}
              onConfirm={this.onConfirmModal}
              onCancel={this.onCancelModal}
              processing={editOfferProcessing}
              fetchSimilarOffers={fetchSimilarOffers}
              similarOffers={similarOffers}
              similarOfferLoading={similarOfferLoading}
            />
          </DialogContent>
        </Dialog>
      );
    }
    return null;
  };

  renderCreateModal = () => {
    const { metaActivities, coaches, fullScreen, establishments } = this.props;
    const { createOfferModalOpened, creatingOffers } = this.state;

    return (
      <Dialog open={createOfferModalOpened} fullScreen={fullScreen}>
        <DialogContent>
          <OfferFormWithActivity
            selectedDate={moment(this.props.date, DATE_FORMAT)}
            timezone={this.props.theme.timezone_name}
            metaActivities={metaActivities}
            activitiesLoading={this.props.activitiesLoading}
            coaches={coaches}
            establishments={establishments}
            onSubmit={this.createOffers}
            onCancel={this.closeCreateOffersModal}
            processing={creatingOffers}
            is_whereby_integration_enabled={
              this.props.theme &&
              this.props.theme.is_whereby_integration_enabled &&
              this.props.theme.is_whereby_integration_allowed
            }
          />
        </DialogContent>
      </Dialog>
    );
  };

  createOffers = async (metaActivityId: number, data: Object) => {
    this.setState({ creatingOffers: true });
    try {
      const response = await createOffersAPI(metaActivityId, data);
      if (response.status === 200) {
        const backgroundTaskUuid = response.headers['x-background-task-uuid'];
        this.setState({ creatingOffers: false, createOfferModalOpened: false });
        this.props.monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            this.props.fetchRelevantOffers();
            this.loadDayData(this.props.date);
          },
        });
        return;
      }
      this.setState({ creatingOffers: false });
    } catch (err) {
      this.setState({ creatingOffers: false });
    }
  };

  renderDeleteModal = () => {
    const { deleteModalOpened, deletingOffer } = this.state;
    const { selectedOffer } = this.props;

    if (selectedOffer) {
      return (
        <Dialog onClose={this.onCancelModal} open={deleteModalOpened}>
          <DialogContent>
            <DeleteOfferForm
              offer={selectedOffer}
              offerWasCancelled={!selectedOffer.available}
              onCancelOffer={({
                cashback,
                notify,
                deleteAll,
                custom_selection,
                custom_selection_ids,
              }) =>
                this.onCancelOffer({
                  offerId: selectedOffer.id,
                  cashback,
                  notify,
                  deleteAll,
                  custom_selection,
                  custom_selection_ids,
                })
              }
              onHardDelete={(data) =>
                this.onHardDeleteOffer(selectedOffer.id, data)
              }
              fetchSimilarOffers={() => {
                this.props.fetchEstablishments();
                this.props.fetchAssociatedCoachesList();
                this.props.fetchSimilarOffers(selectedOffer.id);
              }}
              onCancel={this.onCancelModal}
              processing={deletingOffer}
              setOpenDeleteDialog={this.props.setOpenDeleteDialog}
              similarOffers={this.props.similarOffers}
              similarOfferLoading={this.props.similarOfferLoading}
            />
          </DialogContent>
        </Dialog>
      );
    }
    return null;
  };

  renderRestoreModal = () => {
    const { restoreModalOpen } = this.state;
    const { selectedOffer, t } = this.props;

    if (selectedOffer) {
      return (
        <Dialog open={restoreModalOpen}>
          <DialogTitle>
            <Typography variant="h6">
              {t('offer.restoreModal.title')}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography>{t('offer.restoreModal.explain')}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ restoreModalOpen: false })}>
              {t('common.cancel')}
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.props.restoreOffer(selectedOffer.id, {
                  onSuccess: () => this.loadDayData(),
                });
                this.setState({ restoreModalOpen: false });
              }}
            >
              {t('common.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
    return null;
  };

  renderAddOffersButton = () => {
    const { classes, t } = this.props;
    return (
      <div>
        <Fab
          variant="extended"
          aria-label="Add"
          className={classes.button}
          color="primary"
          onClick={this.openCreateOfferModal}
        >
          <AddIcon className={classes.leftIcon} />
          {t('activity.addOffers')}
        </Fab>
      </div>
    );
  };

  renderGoBackButton = () => {
    const { width, classes, selectedOffer, t } = this.props;
    if (isWidthDown('md', width) && selectedOffer) {
      return (
        <div className={this.props.classes.goBackButton}>
          <Button
            size="small"
            className={classes.button}
            onClick={this.props.goBack}
          >
            <KeyboardArrowLeft />
            {t('offer.backToCalendar')}
          </Button>
        </div>
      );
    }
    return null;
  };

  getDayOffers = memoize((events) => {
    const events_ = {};
    events.forEach((o) => {
      const midnight = moment(o.date_start).startOf('day');
      if (!events_[midnight]) {
        events_[midnight] = [];
      }
      events_[midnight].push(o);
    });
    return events_;
  });

  selectOffer = (offer) => {
    if (this.props.selectedOffer && offer.id === this.props.selectedOffer.id) {
      this.props.goToOfferManagement(offer.id);
    } else {
      this.props.loadOfferData(offer);
    }
  };

  searchBar = () => {
    const coachList = this.props.coaches.map((e) => ({
      ...e,
      user: { name: e.name },
    }));
    const establishmentList = this.props.establishments;
    return (
      <Grid container style={{ overflow: 'scroll' }}>
        <Grid item xs={6} md={4} className={this.props.classes.selector}>
          <CoachSelector
            coaches={Immutable(coachList)}
            selectedCoaches={this.props.offerFilters.coaches}
            selectOption={(ev) =>
              this.props.setFilters({
                ...this.props.offerFilters,
                coaches: ev.map((e) => e.value),
              })
            }
          />
        </Grid>
        <Grid item xs={6} md={4} className={this.props.classes.selector}>
          <EstablishmentSelector
            establishments={Immutable(establishmentList)}
            selectedEstablishments={this.props.offerFilters.establishments}
            selectOption={(ev) => {
              this.props.setFilters({
                ...this.props.offerFilters,
                establishments: ev.map((e) => e.value),
              });
            }}
          />
        </Grid>
        <Grid item xs={12} md={4} className={this.props.classes.selector}>
          <MetaActivitySelector
            metaActivities={this.props.metaActivities.filter(
              (ma) => ma.customer_enabled && !ma.is_workshop,
            )}
            selectedMetaActivities={this.props.offerFilters.metaActivities}
            selectOption={(ev) =>
              this.props.setFilters({
                ...this.props.offerFilters,
                metaActivities: ev.map((e) => e.value),
              })
            }
          />
        </Grid>
      </Grid>
    );
  };

  render() {
    const {
      offers,
      events,
      classes,
      timetableLoading,
      offerByDayLoading,
      width,
      selectedOffer,
    } = this.props;
    const events_ = this.getDayOffers(events);
    return (
      <div className={classes.container}>
        {this.searchBar()}
        <Grid container spacing={3}>
          {isWidthDown('md', width) && selectedOffer
            ? this.renderGoBackButton()
            : null}
          {isWidthUp('lg', width) || !selectedOffer ? (
            <Grid item xs={12} lg={6}>
              <div className={classes.panel}>
                {!this.props.permission.navigation &&
                  !!this.props.permission.calendar && (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ width: '100%', margin: 8 }}
                      onClick={this.props.pushToSchedule}
                    >
                      {this.props.t('openSchedule')}
                      <ArrowForwardIcon style={{ marginLeft: 8 }} />
                    </Button>
                  )}
                <Paper style={{ width: '100%' }}>
                  <Calendar
                    showDownloader
                    onRequestMassDisable={
                      !!this.props.permission.offer.delete &&
                      this.props.setMassDisablerStartDate
                    }
                    events={events_}
                    onDateClick={this.loadDayData}
                    date={this.props.date}
                    filters={this.props.offerFilters}
                    showCancelledOffers={
                      this.props.offerFilters.available === undefined
                        ? this.props.theme.show_cancelled_offers_manager
                        : !this.props.offerFilters.available
                    }
                    setShowCancelledOffers={this.props.setShowCancelledOffers}
                  />
                  <TimeTable
                    onOfferSelected={this.selectOffer}
                    offers={offers}
                    loading={
                      offerByDayLoading ||
                      (timetableLoading && (offers || []).length === 0)
                    }
                    selected={selectedOffer ? selectedOffer.id : null}
                  />
                </Paper>
                {this.props.permission.offer.create
                  ? this.renderAddOffersButton()
                  : null}
              </div>
              {!this.props.selectedOffer ? (
                <div className={this.props.classes.noOfferMessage}>
                  {this.renderNoOfferSelected()}
                </div>
              ) : (
                <div className={this.props.classes.paper}>
                  <BookingStatisticsCard
                    offerId={selectedOffer.id}
                    title={moment(selectedOffer.date_start)
                      .tz(selectedOffer.timezone_name)
                      .format('LLLL')}
                    bookingStatistics={this.props.bookingStatistics}
                    loading={
                      this.props.createdBookingStatsLoading ||
                      this.props.cancelledBookingStatsLoading
                    }
                    filters={this.props.offerFilters}
                  />
                </div>
              )}
            </Grid>
          ) : (
            <Typography />
          )}
          <Grid item xs={12} lg={6}>
            {selectedOffer ? (
              <div>
                <OfferCard
                  snackbarSuccess={this.props.snackbarSuccess}
                  offer={selectedOffer}
                  companyId={this.props.companyId}
                  onEditButtonClick={this.openEditModal}
                  onDeleteButtonClick={this.openDeleteModal}
                  onRestoreButtonClick={this.openRestoreModal}
                  goToOfferManagement={this.props.goToOfferManagement}
                  permission={this.props.permission}
                  members={this.props.members}
                  membersLoading={
                    this.props.membersLoading || !this.props.members
                  }
                  bookings={this.props.bookings}
                  bookingsLoading={
                    this.props.bookingsLoading || !this.props.bookings
                  }
                />
              </div>
            ) : (
              <BookingStatisticsCard
                bookingStatistics={this.props.bookingStatistics}
                loading={
                  this.props.createdBookingStatsLoading ||
                  this.props.cancelledBookingStatsLoading
                }
              />
            )}
          </Grid>
          <Dialog
            open={this.props.openDeleteDialog}
            onClose={() => this.props.setOpenDeleteDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {this.props.t('offer:deleteImpossibleTitle')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {this.props.t('offer:deleteImpossibleText')}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.props.setOpenDeleteDialog(false)}
                color="primary"
              >
                {this.props.t('offer:close')}
              </Button>
            </DialogActions>
          </Dialog>
          {this.renderEditModal()}
          {this.renderDeleteModal()}
          {this.renderCreateModal()}
          {this.renderRestoreModal()}
          {!!this.props.massDisablerStartDate && (
            <MassDisablerDialog
              startDate={this.props.massDisablerStartDate}
              onSubmit={(params) =>
                this.props.disableMassOffers(params, this.props.offerFilters, {
                  onSuccess: () => {
                    this.fetchData();
                  },
                })
              }
              onClose={() => this.props.setMassDisablerStartDate(null)}
            />
          )}
        </Grid>
      </div>
    );
  }
}

export default compose(
  withTranslation(),
  withRouter,
  withStyles(styles),
  withWidth(),
  withMobileDialog(),
  connect(
    (state, { selectedOffer, date }) => ({
      events: state.offer.calendar,
      timetableLoading: state.offer.byDay.loading,

      coaches: getActiveCoaches(state),
      coachesLoading: state.coach.loading,

      establishments: getAvailableEstablishmentList(state),
      companyId: state.theme.theme.company,
      theme: state.theme.theme,
      metaActivities: getEnabledMetaActivities(state),
      activitiesLoading: state.metaActivity.loading,

      similarOfferLoading:
        state.offer.similarOffers.loading ||
        state.metaActivity.loading ||
        state.establishment.loading,
      similarOffers: getSimilarsOffers(state),
      permission: getPermissions(state),
      offerFilters: state.offer.managerFilter.filters,
      offerByDayLoading: state.offer.byDay.loading,

      members: getAllMembers(state),
      membersLoading: state.member.loading,

      bookings: getOfferBookingList(state),
      bookingsLoading: state.booking.byOffer.loading,

      createdBookingStatsLoading: getBookingRelatedStatisticLoading(
        state,
        'createdBookings',
      ),
      cancelledBookingStatsLoading: getBookingRelatedStatisticLoading(
        state,
        'cancelledBookings',
      ),
      bookingStatistics: selectedOffer
        ? getStats(state)
        : getStats(state, {
            start: moment(date).startOf('week'),
            end: moment(date).endOf('week'),
          }),
    }),
    {
      goBack: goBackRouter,
      pushToSchedule: () => pushRouter('/schedule'),
      snackbarSuccess,
      snackbarError,
      goToOfferManagement: (offerId) => pushRouter(`/offer/${offerId}`),
      fetchAllOffers: fetchAllOffersAction,
      deleteOffer: deleteOfferAction,
      fetchSimilarOffers: fetchSimilarOffersAction,
      setFilters: setFiltersAction,
      fetchFilteredMembers: fetchFilteredMembersAction,
      fetchBookingsByOffer: fetchBookingsByOfferAction,
      fetchEstablishments,
      fetchAssociatedCoachesList,
      fetchAllActivities,
      disableMassOffers,
      fetchBookingStatistics: fetchBookingStatisticsAction,
      monitorBackgroundTask,
      restoreOffer,
    },
  ),
  withHandlers({
    setShowCancelledOffers: ({ offerFilters, setFilters }) => (
      showCancelled,
    ) => {
      let filters = { ...offerFilters };
      filters = { ...filters, available: !showCancelled };
      setFilters(filters);
    },
    fetchRelevantOffers: ({ fetchAllOffers, offerFilters, date }) => () => {
      fetchAllOffers({
        min_date: moment(date)
          .startOf('month')
          .startOf('week')
          .format('YYYY-MM-DD'),
        max_date: moment(date)
          .endOf('month')
          .endOf('week')
          .format('YYYY-MM-DD'),
        ...omit(offerFilters || {}, 'available'),
      });
    },
    fetchBookingInOfferStats: ({
      selectedOffer,
      fetchBookingStatistics,
    }) => () => {
      fetchBookingStatistics('createdBookings', {
        offer: selectedOffer.id,
        date_field: 'date_created',
        kind: 'count',
      });
      fetchBookingStatistics('cancelledBookings', {
        offer: selectedOffer.id,
        booking_status_code__in: [
          BOOKING_STATUS_CANCELLED_BY_MANAGER.id,
          BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
          BOOKING_STATUS_CANCELLED_BY_OFFER.id,
        ],
        date_field: 'date_updated',
        // date_field: 'date_canceled',
        kind: 'count',
      });
    },
    fetchBookingStatsOfTheWeek: ({
      date,
      fetchBookingStatistics,
      offerFilters,
    }) => () => {
      fetchBookingStatistics('createdBookings', {
        min_date: moment(date)
          .startOf('week')
          .format('YYYY-MM-DD'),
        max_date: moment(date)
          .endOf('week')
          .format('YYYY-MM-DD'),
        ...omit(offerFilters || {}, 'available'),
        date_field: 'offer__date_start',
        kind: 'count',
      });
      fetchBookingStatistics('cancelledBookings', {
        min_date: moment(date)
          .startOf('week')
          .format('YYYY-MM-DD'),
        max_date: moment(date)
          .endOf('week')
          .format('YYYY-MM-DD'),
        booking_status_code__in: [
          BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
          BOOKING_STATUS_CANCELLED_BY_MANAGER.id,
          BOOKING_STATUS_CANCELLED_BY_OFFER.id,
        ],
        ...omit(offerFilters || {}, 'available'),
        date_field: 'offer__date_start',
        kind: 'count',
      });
    },
  }),
  withState('openDeleteDialog', 'setOpenDeleteDialog', false),
  withState('massDisablerStartDate', 'setMassDisablerStartDate', null),
  withTitle(({ t }: { t: TFunction }) => t('titles:planning')),
)(Planning);
