// @flow
import React, { PureComponent } from 'react';
import memoize from 'memoize-one';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import {
  Fab,
  Dialog,
  DialogContent,
  withStyles,
  Button,
  Paper,
  Grid,
  Typography,
  withWidth,
} from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import AddIcon from '@material-ui/icons/Add';
import { push as pushRouter, goBack as goBackRouter } from 'react-router-redux';

import withDrawer from '../../hocs/with-drawer.hoc';

import OfferCard from '../../components/offer/OfferCard.component';
import TimeTable from '../../components/offer/TimeTable.component';
import Calendar from '../../components/offer/Calendar.component';

import {
  offer as offerActions,
  activity as activityActions,
} from '../../actions';
import { Moment } from '../../i18n';
import api from '../../api';
import type { Offer, Coach, Establishment } from '../../api/types';

import OfferEditForm from '../../libs/offer/OfferEditForm.component';
import OfferFormWithActivity from '../../libs/offer/OfferFormWithActivity.component';
import DeleteOfferForm from '../../libs/offer/DeleteOfferForm.component';

const styles = (theme) => ({
  calendarContainer: {
    padding: theme.spacing.unit * 2,
  },
  emptyOffer: {
    margin: theme.spacing.unit * 3,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

type Props = {
  t: (x: string) => string,
  classes: Object,
  date: Moment,
  selectedOffer: Offer,

  timetableLoading: boolean,
  coachesLoading: boolean,
  establishmentsLoading: boolean,
  similarOfferLoading: boolean,
  width: string,

  activities: Array<Activity>,
  metaActivities: Array<MetaActivity>,
  offers: Array<Offer>,
  similarOffers: Array<Offer>,
  events: Array<Event>,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,

  fetchAllOffers: () => void,
  fetchAllActivities: () => void,
  goToOfferManagement: () => void,
  goBack: () => void,
  loadDayData: (Object) => void,
  loadOfferData: (Offer) => void,

  deleteOffer: (id: number) => void,
  fetchSimilarOffers: (offerId: number) => void,
};

type State = {
  editModalOpened: boolean,
  deleteModalOpened: boolean,
  editOfferProcessing: boolean,
  deletingOffer: boolean,
  createOfferModalOpened: boolean,
  creatingOffers: boolean,
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
    };
  }

  componentDidMount() {
    console.log('mounting');
    if (this.props.selectedOffer) {
      this.props.loadOfferData(this.props.selectedOffer);
    }
    if (this.props.date) {
      this.props.loadDayData(this.props.date);
    }
  }

  openEditModal = () => {
    this.setState({ editModalOpened: true });
  };

  openDeleteModal = () => {
    this.setState({ deleteModalOpened: true });
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
  };

  closeCreateOffersModal = () => {
    this.setState({ createOfferModalOpened: false });
  };

  onConfirmModal = async ({ offerId, data }) => {
    this.setState({ editOfferProcessing: true });
    try {
      const response = await api.offer.editLiveOffer({ offerId, data });
      if (response.status === 200) {
        this.props.fetchAllOffers();
        this.props.fetchAllActivities();
        this.setState({
          editOfferProcessing: false,
          editModalOpened: false,
        });
        this.props.loadDayData(this.props.date);
        return;
      }
    } catch (err) {
      console.log(err);
    }
    this.setState({ editOfferProcessing: false });
  };

  onCancelOffer = async (data: {
    offerId: number,
    cashback: ?boolean,
    notify: ?boolean,
    deleteAll: ?boolean,
  }) => {
    this.setState({ deletingOffer: true });
    try {
      const { notify, cashback, deleteAll, offerId } = data;
      const response = await api.offer.disableOffer({
        offerId,
        cashback,
        notify,
        deleteAll,
      });
      if (response.status === 200) {
        this.props.fetchAllOffers();
        this.props.loadDayData(this.props.date);
        this.setState({
          deletingOffer: false,
          deleteModalOpened: false,
        });
        this.props.loadDayData(this.props.date);
        return;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
    this.setState({ deletingOffer: false });
  };

  onHardDeleteOffer = async (offerId: number, data) => {
    this.setState({ deletingOffer: true });
    try {
      const response = await api.offer.delete(offerId, data);
      if (response.status === 204) {
        this.props.fetchAllOffers();
        this.props.deleteOffer(offerId);
        this.props.loadDayData(this.props.date);
        this.setState({
          deletingOffer: false,
          deleteModalOpened: false,
        });
        return;
      }
    } catch (err) {
      console.error(err);
    }
    this.setState({ deletingOffer: false });
  };

  renderNoOfferSelected = () => {
    const { t, classes } = this.props;
    return (
      <Typography variant="caption" className={classes.emptyOffer}>
        {t('calendar.pleaseSelectOffer')}
      </Typography>
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
              coaches={coaches}
              establishments={establishments}
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
    const { metaActivities, coaches, establishments } = this.props;
    const { createOfferModalOpened, creatingOffers } = this.state;

    return (
      <Dialog open={createOfferModalOpened}>
        <DialogContent style={{ minWidth: 350 }}>
          <OfferFormWithActivity
            metaActivities={metaActivities}
            coaches={coaches}
            establishments={establishments}
            onSubmit={this.createOffers}
            onCancel={this.closeCreateOffersModal}
            processing={creatingOffers}
          />
        </DialogContent>
      </Dialog>
    );
  };

  createOffers = async (metaActivityId: number, data: Object) => {
    this.setState({ creatingOffers: true });
    try {
      const response = await api.metaActivity.createOffers(
        metaActivityId,
        data,
      );
      if (response.status === 200) {
        this.setState({ creatingOffers: false });
        this.props.fetchAllOffers();
        this.props.fetchAllActivities();
        this.setState({ createOfferModalOpened: false });
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
              onCancelOffer={({ cashback, notify, deleteAll }) =>
                this.onCancelOffer({
                  offerId: selectedOffer.id,
                  cashback,
                  notify,
                  deleteAll,
                })
              }
              onHardDelete={(data) =>
                this.onHardDeleteOffer(selectedOffer.id, data)
              }
              fetchSimilarOffers={() => {
                this.props.fetchSimilarOffers(selectedOffer.id);
              }}
              onCancel={this.onCancelModal}
              processing={deletingOffer}
              similarOffers={this.props.similarOffers}
              similarOfferLoading={this.props.similarOfferLoading}
            />
          </DialogContent>
        </Dialog>
      );
    }
    return null;
  };

  renderAddOffersButton = () => {
    const { classes, t } = this.props;
    return (
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
    );
  };

  renderGoBackButton = () => {
    const { width, classes, selectedOffer, t } = this.props;
    if (isWidthDown('md', width) && selectedOffer) {
      return (
        <Button
          size="small"
          className={classes.button}
          onClick={this.props.goBack}
        >
          <KeyboardArrowLeft />
          {t('offer.backToCalendar')}
        </Button>
      );
    }
    return null;
  };

  getDayOffers = memoize((events) => {
    const events_ = {};
    events.forEach((o) => {
      const midnight = Moment(o.date_start).startOf('day');
      if (!events_[midnight]) {
        events_[midnight] = [];
      }
      events_[midnight].push(o);
    });
    return events_;
  });

  render() {
    const {
      offers,
      events,
      classes,
      activities,
      timetableLoading,
      establishments,
      establishmentsLoading,
      coaches,
      coachesLoading,
      width,
      date,
      selectedOffer,
    } = this.props;

    const events_ = this.getDayOffers(events);
    return (
      <Grid container spacing={24}>
        {isWidthUp('lg', width) || !selectedOffer ? (
          <Grid item xs={12} lg={6}>
            <Grid
              container
              direction="column"
              spacing={32}
              alignItems="stretch"
            >
              <Grid item>
                <Paper>
                  <Grid container direction="column" alignItems="stretch">
                    <Grid item>
                      <div className={classes.calendarContainer}>
                        <Calendar
                          events={events_}
                          onDateClick={this.props.loadDayData}
                          date={this.props.date}
                        />
                      </div>
                    </Grid>
                    <Grid item>
                      <TimeTable
                        date={date}
                        onOfferSelected={this.props.loadOfferData}
                        offers={offers.filter((o) =>
                          Moment(o.date_start).isSame(Moment(date), 'day'),
                        )}
                        activities={activities}
                        loading={
                          timetableLoading && (offers || []).length === 0
                        }
                        selected={selectedOffer ? selectedOffer.id : null}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item>
                <Grid container item alignItems="center" justify="center">
                  {this.renderAddOffersButton()}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Typography />
        )}
        <Grid item xs={12} lg={6}>
          {selectedOffer ? (
            <OfferCard
              offer={selectedOffer}
              establishments={establishments}
              coaches={coaches}
              coachesLoading={coachesLoading}
              establishmentsLoading={establishmentsLoading}
              onEditButtonClick={this.openEditModal}
              onDeleteButtonClick={this.openDeleteModal}
              goToOfferManagement={this.props.goToOfferManagement}
            />
          ) : (
            this.renderNoOfferSelected()
          )}
        </Grid>

        <Grid item xs={12} lg={6}>
          {isWidthDown('md', width) && selectedOffer
            ? this.renderGoBackButton()
            : null}
        </Grid>
        {this.renderEditModal()}
        {this.renderDeleteModal()}
        {this.renderCreateModal()}
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    offers: state.offer.offers,
    events: state.offer.calendar,
    timetableLoading: state.activity.loading || state.offer.byDay.loading,
    activities: state.activity.all,
    coaches: state.coach.companyAssociated,
    coachesLoading: state.coach.loading,
    establishments: state.establishment.all,
    establishmentsLoading: state.establishment.loading,
    metaActivities: state.metaActivity.all,

    similarOfferLoading: state.offer.similarOffers.loading,
    similarOffers: state.offer.similarOffers.items,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goBack() {
      dispatch(goBackRouter());
    },
    goToOfferManagement(offerId) {
      dispatch(pushRouter(`/offer/${offerId}`));
    },
    fetchAllOffers() {
      dispatch(offerActions.fetchAllOffers());
    },
    fetchAllActivities() {
      dispatch(activityActions.fetchActivities());
    },
    deleteOffer(offerId: number) {
      dispatch(offerActions.deleteOffer(offerId));
    },
    fetchSimilarOffers(offerId) {
      dispatch(offerActions.fetchSimilarOffers(offerId));
    },
  };
}

export default compose(
  withNamespaces(),
  withRouter,
  withStyles(styles),
  withWidth(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.planning')),
)(Planning);
