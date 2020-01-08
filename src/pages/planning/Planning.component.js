// @flow
import React, { PureComponent } from 'react';
import memoize from 'memoize-one';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import withMobileDialog from '@material-ui/core/withMobileDialog';
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
import { push as pushRouter, goBack as goBackRouter } from 'react-router-redux';

import moment from 'moment';

import withTitle from '../../hocs/with-title.hoc';

import { getSimilars as getSimilarsOffers } from '../../libs/offer/selectors';
import OfferCard from '../../components/offer/OfferCard.component';
import TimeTable from '../../components/offer/TimeTable.component';
import Calendar from '../../components/offer/Calendar.component';
import { getPermissions } from '../../libs/role/selectors';
import { getEnabledMetaActivities } from '../../libs/meta-activity/selectors';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import { fetchAllActivities } from '../../libs/meta-activity/actions/meta-activity.actions';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { getAllEstablishments } from '../../libs/establishment/selectors';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import type { Establishment } from '../../libs/establishment/types';

import { offer as offerActions } from '../../actions';
import type { Offer, Coach } from '../../api/types';
import api from '../../api';
import type { OfferFilter } from '../../libs/offer/types';

import { snackbarSuccess } from '../../actions/snackbar.actions';
import OfferEditForm from '../../libs/offer/OfferEditForm.component';
import OfferFormWithActivity from '../../libs/offer/OfferFormWithActivity.component';
import DeleteOfferForm from '../../libs/offer/DeleteOfferForm.component';
import { createOffers as createOffersAPI } from '../../libs/meta-activity/api/meta-activity';
import type { Permission } from '../../libs/role/types';
import { DATE_FORMAT } from '../../datetime';

import CoachSelector from '../../libs/associated-coach/components/CoachSelector.component';
import EstablishmentSelector from '../../libs/establishment/components/EstablishmentSelector.component';
import MetaActivitySelector from '../../libs/meta-activity/components/MetaActivitySelector.component';
import LevelSelector from '../../libs/category/components/LevelSelector.component';

const styles = (theme) => ({
  panel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  selector: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },

  emptyOffer: {
    margin: theme.spacing.unit * 3,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

type Props = {
  t: TFunction,
  classes: Object,
  date: string,
  selectedOffer: Offer,

  timetableLoading: boolean,
  fullScreen: boolean,
  coachesLoading: boolean,
  establishmentsLoading: boolean,
  similarOfferLoading: boolean,
  activitiesLoading: boolean,
  width: string,

  fetchAssociatedCoachesList: () => void,
  fetchAllActivities: () => void,
  permission: Permission,
  metaActivities: Array<MetaActivity>,
  offers: Array<Offer>,
  similarOffers: Array<Offer>,
  events: Array<Event>,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  companyId: number,

  fetchAllOffers: () => void,
  goToOfferManagement: () => void,
  goBack: () => void,
  replaceRouter: (path: string) => void,
  loadOfferData: (Object) => void,
  fetchOffersByDay: ({ year: number, month: number, day: number }) => void,
  fetchEstablishments: () => void,

  deleteOffer: (id: number) => void,
  fetchSimilarOffers: (offerId: number) => void,

  snackbarSuccess: (string) => void,

  offerFilterOpen: boolean,
  offerFilters: OfferFilter,
  setFilters: (OfferFilter) => null,
  toogleFilter: () => void,
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

  fetchRelevantOffers = () => {
    this.props.fetchAllOffers({
      min_date: moment(this.props.date)
        .startOf('month')
        .startOf('week')
        .format('YYYY-MM-DD'),
      max_date: moment(this.props.date)
        .endOf('month')
        .endOf('week')
        .format('YYYY-MM-DD'),
    });
  };

  componentDidMount() {
    this.fetchRelevantOffers();
    if (this.props.selectedOffer) {
      this.props.loadOfferData(this.props.selectedOffer);
    }
    if (this.props.date) {
      this.loadDayData(this.props.date);
    }
    if (this.props.offerFilterOpen) {
      this.props.fetchAssociatedCoachesList();
      this.props.fetchEstablishments();
      this.props.fetchAllActivities();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.date !== this.props.date &&
      !moment(prevProps.date).isSame(moment(this.props.date), 'month')
    ) {
      this.fetchRelevantOffers();
    }
    if (this.props.offerFilterOpen && !prevProps.offerFilterOpen) {
      this.props.fetchAssociatedCoachesList();
      this.props.fetchEstablishments();
      this.props.fetchAllActivities();
    }
  }

  loadDayData = (dateClicked: Object) => {
    const date = moment(dateClicked, DATE_FORMAT);
    this.props.replaceRouter(
      `/calendar/${date.year()}/${date.month() + 1}/${date.date()}`,
    );
    this.props.fetchOffersByDay({
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
    });
  };

  openEditModal = () => {
    this.setState({ editModalOpened: true });
    this.props.fetchEstablishments();
    this.props.fetchAssociatedCoachesList();
    this.props.fetchAllActivities();
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
    this.props.fetchEstablishments();
    this.props.fetchAssociatedCoachesList();
    this.props.fetchAllActivities();
  };

  closeCreateOffersModal = () => {
    this.setState({ createOfferModalOpened: false });
  };

  onConfirmModal = async ({ offerId, data }) => {
    this.setState({ editOfferProcessing: true });
    try {
      const response = await api.offer.editLiveOffer({ offerId, data });
      if (response.status === 200) {
        this.fetchRelevantOffers();
        this.setState({
          editOfferProcessing: false,
          editModalOpened: false,
        });
        this.loadDayData(this.props.date);
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
        this.fetchRelevantOffers();
        this.loadDayData(this.props.date);
        this.setState({
          deletingOffer: false,
          deleteModalOpened: false,
        });
        this.loadDayData(this.props.date);
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
        this.fetchRelevantOffers();
        this.props.deleteOffer(offerId);
        this.loadDayData(this.props.date);
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
    const { metaActivities, coaches, fullScreen, establishments } = this.props;
    const { createOfferModalOpened, creatingOffers } = this.state;

    return (
      <Dialog open={createOfferModalOpened} fullScreen={fullScreen}>
        <DialogContent>
          <OfferFormWithActivity
            selectedDate={moment(this.props.date, DATE_FORMAT)}
            metaActivities={metaActivities}
            activitiesLoading={this.props.activitiesLoading}
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
      const response = await createOffersAPI(metaActivityId, data);
      if (response.status === 200) {
        this.setState({ creatingOffers: false });
        this.fetchRelevantOffers();
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
                this.props.fetchEstablishments();
                this.props.fetchAssociatedCoachesList();
                this.props.fetchAllActivities();
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
      <Grid container>
        <Grid item xs={12} md={6} className={this.props.classes.selector}>
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
        <Grid item xs={12} md={6} className={this.props.classes.selector}>
          <LevelSelector
            selectedLevels={this.props.offerFilters.levels}
            selectOption={(ev) =>
              this.props.setFilters({
                ...this.props.offerFilters,
                levels: ev.map((e) => e.value),
              })
            }
          />
        </Grid>
        <Grid item xs={12} md={6} className={this.props.classes.selector}>
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
        <Grid item xs={12} md={6} className={this.props.classes.selector}>
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
      width,
      selectedOffer,
    } = this.props;

    const events_ = this.getDayOffers(events);
    return (
      <Grid container spacing={24}>
        {isWidthUp('lg', width) || !selectedOffer ? (
          <Grid item xs={12} lg={6}>
            <div className={classes.panel}>
              <Paper style={{ width: '100%' }}>
                <Calendar
                  showDownloader
                  events={events_}
                  onDateClick={this.loadDayData}
                  date={this.props.date}
                  searchBar={this.searchBar()}
                  searchBarOpen={this.props.offerFilterOpen}
                  toogleSearchBar={this.props.toogleFilter}
                  filters={this.props.offerFilters}
                />
                <TimeTable
                  onOfferSelected={this.selectOffer}
                  offers={offers}
                  loading={timetableLoading && (offers || []).length === 0}
                  selected={selectedOffer ? selectedOffer.id : null}
                />
              </Paper>
              {this.props.permission.offer.create
                ? this.renderAddOffersButton()
                : null}
            </div>
          </Grid>
        ) : (
          <Typography />
        )}
        <Grid item xs={12} lg={6}>
          {selectedOffer ? (
            <OfferCard
              snackbarSuccess={this.props.snackbarSuccess}
              offer={selectedOffer}
              companyId={this.props.companyId}
              onEditButtonClick={this.openEditModal}
              onDeleteButtonClick={this.openDeleteModal}
              goToOfferManagement={this.props.goToOfferManagement}
              permission={this.props.permission}
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

export default compose(
  withNamespaces(),
  withRouter,
  withStyles(styles),
  withWidth(),
  withMobileDialog(),
  connect(
    (state) => ({
      events: state.offer.calendar,
      timetableLoading: state.offer.byDay.loading,

      coaches: getActiveCoaches(state),
      coachesLoading: state.coach.loading,

      establishments: getAllEstablishments(state),
      companyId: state.theme.theme.company,
      metaActivities: getEnabledMetaActivities(state),
      activitiesLoading: state.metaActivity.loading,

      similarOfferLoading:
        state.offer.similarOffers.loading ||
        state.metaActivity.loading ||
        state.establishment.loading,
      similarOffers: getSimilarsOffers(state),
      permission: getPermissions(state),
      offerFilterOpen: state.offer.managerFilter.open,
      offerFilters: state.offer.managerFilter.filters,
    }),
    {
      goBack: goBackRouter,
      snackbarSuccess,
      goToOfferManagement: (offerId) => pushRouter(`/offer/${offerId}`),
      fetchAllOffers: offerActions.fetchAllOffers,
      deleteOffer: offerActions.deleteOffer,
      fetchSimilarOffers: offerActions.fetchSimilarOffers,
      fetchEstablishments,
      fetchAssociatedCoachesList,
      fetchAllActivities,
      setFilters: offerActions.setFilters,
      toogleFilter: offerActions.toogleFilter,
    },
  ),
  withTitle(({ t }: { t: TFunction }) => t('titles:planning')),
)(Planning);
