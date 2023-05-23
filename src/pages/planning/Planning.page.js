// @flow
import React, { PureComponent } from 'react';
import memoize from 'memoize-one';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { withTranslation, TFunction } from 'react-i18next';
import { compose, withState, withHandlers } from 'recompose';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
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

import withTitle from '#hocs/with-title.hoc';

import {
  getNumberOfMassDisabledOffer,
  getMassDisabledOfferInGroup,
  getSimilars as getSimilarsOffers,
  getSimilarsPage as getSimilarsOffersPage,
  getSimilarsCount as getSimilarsOffersCount,
} from '#libs/offer/selectors';
import OfferCard from '#components/offer/OfferCard.component';
import TimeTable from '#components/offer/TimeTable.component';
import Calendar from '#components/offer/Calendar.component';
import { getEnabledMetaActivities } from '#libs/meta-activity/selectors';
import {
  getActiveCoaches,
  getCoachesSelectedInRole,
} from '#libs/associated-coach/selectors';
import { fetchActivitiesCompany } from '#libs/meta-activity/actions';
import {
  fetchEstablishments,
  fetchAllEstablishmentGroup,
} from '#libs/establishment/actions';
import {
  getAvailableEstablishmentList,
  getAllPageEstablishments,
  getAssociatedEstablishmentGroup,
  withEstablishment as groupWithEstablishment,
} from '#libs/establishment/selectors';
import { fetchAssociatedCoachesList } from '#libs/associated-coach/actions';
import { Establishment, EstablishmentGroup } from '#libs/establishment/types';
import BookingStatisticsCard from '#libs/booking/components/BookingStatisticsCard.component';

import {
  fetchAllOffers as fetchAllOffersAction,
  deleteOffer as deleteOfferAction,
  fetchSimilarOffers as fetchSimilarOffersAction,
  disableMassOffers,
  retrieveNumberOfMassDisabledOfferAction,
  retrieveNumberOfMassDisabledOfferInGroup as retrieveNumberOfMassDisabledOfferInGroupAction,
  restoreOffer,
  fetchBookedGender as fetchBookedGenderAction,
  createOffers as createOffersActions,
  editOffers as editOffersActions,
  disableOffer as disableOfferAction,
  hardDeleteOffers as hardDeleteOffersAction,
  postRollCall as postRollCallAction,
  postRollCallBulk as postRollCallBulkAction,
  retrieveOfferAsManager as retrieveOfferAsManagerAction,
} from '#libs/offer/actions';
import {
  fetchLevelList as fetchLevelListAction,
  updateLevel as updateLevelAction,
  createLevel as createLevelAction,
  deleteLevel as deleteLevelAction,
} from '#libs/level/actions';
import {
  getActiveCustomLevels,
  getAllCustomLevels,
} from '#libs/level/selectors';
import { fetchReportOfferManagement as fetchReportOfferManagementActions } from '#libs/reporting/actions';
import {
  setCalendarFilter as setCalendarFilterAction,
  setReplacementRequestManagerFilter as setReplacementRequestManagerFilterAction,
} from '#libs/user-preference/actions';

import { fetchFilteredMembers as fetchFilteredMembersAction } from '#libs/member/actions';
import { getAllMembers, withTags } from '#libs/member/selectors';

import {
  fetchBookingsByOffer as fetchBookingsByOfferAction,
  confirmAttendanceAndRollCallById as confirmBookingAttendanceAction,
  discardAttendanceAndRollCallById as discardBookingAttendanceAction,
} from '#libs/booking/actions';
import {
  getOfferBookingList,
  getOfferBookingListWithConsumerPack,
} from '#libs/booking/selectors';

import { fetchBookingStatistics as fetchBookingStatisticsAction } from '#libs/statistics/actions';

import {
  getBookingRelatedStatisticLoading,
  getStats,
} from '../../state/stats/selectors';

import type { Offer, Coach } from '#api/types';
import type { OfferFilter } from '#libs/offer/types';

import { snackbarSuccess, snackbarError } from '#libs/snackbar/actions';
import MassDisablerDialog from '#libs/offer/components/MassDisablerDialog.component';
import OfferFormWithActivity from '#libs/offer/OfferFormWithActivity.component';
import DeleteOfferForm from '#libs/offer/DeleteOfferForm.component';
import { DATE_FORMAT } from '../../utils/datetime';

import CoachSelector from '#libs/associated-coach/components/coach-selector/CoachSelector.component';
import EstablishmentSelector from '#libs/establishment/components/EstablishmentSelector.component';
import MetaActivitySelector from '#libs/meta-activity/components/MetaActivitySelector.component';
import EstablishmentGroupSelector from '#libs/establishment/components/EstablishmentGroupSelector.component';
import RollCallSelector from '#libs/offer/components/RollCallSelector.component';

import { monitorBackgroundTask } from '#libs/background-task/actions';
import CheckPermission from '#libs/role/components/CheckPermission.component';
import { PermissionContext } from '../../context';
import {
  getAvailableRoomBlueprints,
  getRoomBlueprints,
} from '#libs/spot-scheduling/selector';
import { fetchRoomBlueprints } from '#libs/spot-scheduling/actions';
import { RoomBlueprint } from '#libs/spot-scheduling/types';
import { fetchAllCoachPaymentRules } from '#libs/coach-payment-rules/actions';
import { CoachPaymentRuleByKindSelector } from '#libs/coach-payment-rules/selectors';
import type { CoachPaymentRule } from '#libs/coach-payment-rules/types';
import { OptionCallback } from '../../state/types';
import { showVaccinationStatus } from '#libs/custom-form/selectors';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { getAllTagsWithTagGroup } from '#libs/tag/selectors';
import type { Tag, TagGroup } from '#libs/tag/types';
import { fetchZoomApp as fetchZoomAppAction } from '#libs/zoom-app/actions';
import zoomAppSelectors from '#libs/zoom-app/selectors';
import { ZoomApp } from '#libs/zoom-app/types';
import { TUTORIAL_WELCOME_DIALOG_OPEN_QUERY_PARAMS } from '#libs/platform-tutorial/constant';
import { platformTutorialActivated } from '#libs/platform-tutorial/utils';
import GenericResponsiveDialog from '../../components/genericDialog/GenericResponsiveDialog';
import type { ReplacementRequestFilter } from '../../libs/replacement-request/types';

import { redirectIfAllowed as redirectIfAllowedAction } from '../../libs/role/actions';

import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '#libs/consumer-payment-pack/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#libs/payment-packs/actions';

import RollCallDrawer from '#libs/offer/components/RollCallDrawer.component';
import ConfirmationRollCallDialog from '#libs/offer/components/ConfirmationRollCallDialog.component';
import OfferEditForm from '#libs/offer/OfferEditForm.component';

const styles = (theme) => ({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  },
  innerContainer: {
    flex: 1,
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
  spaceTop: {
    height: '100%',
  },
});

const omit_list = (offerFilters: OfferFilters, available: boolean) => {
  const list = available ? ['available'] : [];
  for (const filter in offerFilters) {
    if (!offerFilters[filter] || offerFilters[filter].length === 0) {
      list.push(filter);
    }
  }
  return list;
};

type Props = {
  t: TFunction,
  location: Location,
  classes: Object,
  date: string,
  selectedOffer: Offer,
  hybridOfferLinkedToSelectedOffer: Offer | null,
  theme: ?CompanyTheme,

  timetableLoading: boolean,
  coachesLoading: boolean,
  establishmentsLoading: boolean,
  similarOfferLoading: boolean,
  activitiesLoading: boolean,
  width: string,
  offerByDayLoading: boolean,
  createdBookingStatsLoading: boolean,
  cancelledBookingStatsLoading: boolean,
  numberOfMassDisabledOfferLoading: boolean,
  fetchAssociatedCoachesList: () => void,
  fetchActivitiesCompany: (companyId: number, params?: any) => void,
  fetchFilteredMembers: (params: any, OptionCallback) => void,
  fetchBookingsByOffer: (params: any, options?: OptionCallback) => void,
  fetchBookingStatsOfTheWeek: () => void,
  fetchBookingInOfferStats: () => void,
  metaActivities: Array<MetaActivity>,
  offers: Array<Offer>,
  similarOffers: Array<Offer>,
  events: Array<Event>,
  coaches: Array<Coach>,
  establishmentGroupList: EstablishmentGroup[],
  availableEstablishments: Array<Establishment>,
  allEstablishments: Array<Establishment>,
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
  fetchAllEstablishmentGroup: (companyId: number) => void,

  fetchSimilarOffers: (offerId: number) => void,

  snackbarSuccess: (string) => void,
  snackbarError: (string) => void,

  offerFilters: OfferFilter,
  setCalendarFilter: (OfferFilter) => null,
  filterVerification: boolean,
  setFilterVerification: (boolean) => false,

  pushToSchedule: () => void,

  members: Array<Member<Tag<TagGroup>>>,
  membersLoading: boolean,
  bookings: Array<Booking>,
  bookingsLoading: boolean,

  massDisablerStartDate: ?string,
  disableMassOffers: (
    params: any,
    filters: any,
    options: OptionCallback,
  ) => void,
  setMassDisablerStartDate: (date: ?string) => void,
  setShowCancelledOffers: (boolean) => void,
  setOpenDeleteDialog: () => void,
  openDeleteDialog: boolean,

  monitorBackgroundTask: (uuid: string, options?: OptionCallback) => void,
  restoreOffer: (offerId: number, options: any) => void,
  fetchRoomBlueprints: () => void,
  roomBlueprints: Array<RoomBlueprint>,
  allRoomBlueprints: Array<RoomBlueprint>,
  fetchAllCoachPaymentRules: () => void,
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> },
  showVaccinationStatus: boolean,
  showPartnership: boolean,
  numberOfMassDisabledOffer: number,
  retrieveNumberOfMassDisabledOffer: (
    params?: { start: string, end: string },
    options?: OptionCallback<{ number_of_mass_disabled_offer: number }>,
  ) => void,
  retrieveNumberOfMassDisabledOfferInGroup: (
    params?: { start: string, end: string },
    options?: OptionCallback<{ number_of_mass_disabled_offer: number }>,
  ) => void,
  massDisabledOfferInGroup: Offer[],
  allTagsWithTagGroup: Array<Tag<TagGroup>>,

  createOffers: (data: Offer, options: OptionCallback) => void,
  fetchLevelList: (
    params: LevelFilterSet,
    options?: OptionPaginatedCallback<Level>,
  ) => void,
  updateLevel: (id: number, data: Level, options: OptionCallback) => void,
  createLevel: (data: Level, options?: OptionCallback<Level>) => void,
  deleteLevel: (id: number, options?: OptionCallback) => void,

  creatingOffers: boolean,
  editOfferProcessing: boolean,

  editOffers: ({
    offerId: number,
    data: Offer,
  }) => void,

  activeCustomLevels: Level[],
  allCustomLevels: Level[],
  isDownloadingReport: boolean,
  fetchReportOfferManagement: (
    params: {
      coach_in?: number[],
      establishment_in?: number[],
      level_in?: number[],
      activity_in?: number[],
      date: string,
    },
    options?: OptionCallback,
  ) => void,

  hardDeleteOffers: (
    offerId: number,
    data: any,
    options: OptionCallback,
  ) => void,

  disableOffer: (
    data: {
      offerId: number,
      cashback?: boolean,
      notify?: boolean,
      deleteAll?: boolean,
      custom_selection?: boolean,
      custom_selection_ids?: Array<number>,
      force: boolean,
    },
    options: OptionCallback,
  ) => void,
  deletingOffer: boolean,
  coachesSelectedInRole: Coach[],
  zoomAppDetail: ZoomApp,
  fetchZoomApp: (companyId: number) => void,
  getHasPendingReplacementRequest: (offerId: number) => boolean,
  similarOffersPage: number,
  similarOffersCount: number,
  goToReplacementRequestManagementPage: () => void,
  setReplacementRequestManagerFilter: (
    filters: ReplacementRequestFilter,
  ) => void,
  replacementRequestManagerFilter: ReplacementRequestFilter,
  confirmBookingAttendance: () => void,
  discardBookingAttendance: () => void,
  retrieveConsumerPackBulk: (
    consumerPaymentPackList: Array<ConsumerPaymentPack>,
    options?: OptionCallback,
  ) => void,
  fetchPaymentPackBulk: (paymentPackList: Array<PaymentPack>) => void,
  postRollCall: (offerId: number) => void,
  postRollCallBulk: (
    data: { offer_id_list: Array<number> },
    options?: OptionCallback,
  ) => void,
  retrieveOfferAsManager: (offerId: number) => void,
  bookingsWithConsumerPack: Array<Booking>,
  rollCallLoading: boolean,
};

type State = {
  editModalOpened: boolean,
  deleteModalOpened: boolean,
  createOfferModalOpened: boolean,
  restoreModalOpen: boolean,
  openReplacementRequestPage: boolean,
  isRollCallDrawerOpen: boolean,
  indexOfferInDrawer: number | null,
  isConfirmationRollCallDialogOpen: boolean,
};

const FILTER_COACH = 0;
const FILTER_ESTABLISHMENT = 1;
const FILTER_ACTIVITY = 2;
const FILTER_ROLLCALL = 3;

export class Planning extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      editModalOpened: false,
      deleteModalOpened: false,
      createOfferModalOpened: false,
      restoreModalOpen: false,
      openReplacementRequestPage: false,
      isRollCallDrawerOpen: false,
      indexOfferInDrawer: null,
      isConfirmationRollCallDialogOpen: false,
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
    this.props.fetchRoomBlueprints();
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchZoomApp(this.props.companyId);
    const promiseCoaches = this.props.fetchAssociatedCoachesList();
    const promiseEstablishments = this.props.fetchEstablishments();
    const promiseActivities = this.props.fetchActivitiesCompany(
      this.props.companyId,
      {
        customer_enabled: true,
      },
    );
    const promiseEstablishmentGroups = this.props.fetchAllEstablishmentGroup(
      this.props.companyId,
    );

    this.handleFetchLevel();
    Promise.all([
      promiseCoaches,
      promiseEstablishments,
      promiseActivities,
      promiseEstablishmentGroups,
    ]).then(() => {
      const filterEstablishments = this.props.allEstablishments?.filter((e) =>
        this.props.offerFilters?.establishments?.includes(e.id),
      );
      let coachListBase: number[] = this.props.offerFilters?.coaches || [];
      if (this.props.coachesSelectedInRole?.length > 0) {
        const coachIdListToFilter = this.props.coachesSelectedInRole.map(
          (coach: Coach) => coach.id,
        );
        coachListBase =
          coachListBase.length === 0
            ? coachIdListToFilter
            : coachListBase.filter((coachId: number) =>
                coachIdListToFilter.includes(coachId),
              );
      }
      const filterCoaches = this.props.coaches?.filter((c) =>
        coachListBase?.includes(c.id),
      );
      const filterActivities = this.props.metaActivities?.filter((a) =>
        this.props.offerFilters?.activity__in?.includes(a.id),
      );
      const filterEstablishmentGroups =
        this.props.establishmentGroupList?.filter((eg) =>
          this.props.offerFilters?.establishment_group__in?.includes(eg.id),
        );
      this.props.setCalendarFilter({
        ...this.props.offerFilters,
        establishments: filterEstablishments.map((e) => e.id),
        coaches: filterCoaches.map((c) => c.id),
        activity__in: filterActivities.map((a) => a.id),
        establishment_group__in: filterEstablishmentGroups.map((eg) => eg.id),
      });
      this.props.setFilterVerification(true);
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.date !== this.props.date &&
      !moment(prevProps.date).isSame(moment(this.props.date), 'month')
    ) {
      this.fetchData();
    }
    if (!isEqual(prevProps.offerFilters, this.props.offerFilters)) {
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

  handleFetchLevel = () => {
    this.props.fetchLevelList({
      company: this.props.companyId,
    });
  };

  loadDayData = (day: ?string) => {
    const date = moment(day || this.props.date, DATE_FORMAT);
    const base = `/calendar/${date.year()}/${date.month() + 1}/${date.date()}`;

    if (!platformTutorialActivated()) {
      this.props.replaceRouter(base);
    } else if (
      this.props.location.search.includes(
        `?${TUTORIAL_WELCOME_DIALOG_OPEN_QUERY_PARAMS}`,
      )
    ) {
      this.props.replaceRouter(
        `${base}/?${TUTORIAL_WELCOME_DIALOG_OPEN_QUERY_PARAMS}`,
      );
    } else {
      this.props.replaceRouter(base);
    }
    this.fetchOffersOfDate(date);
  };

  onModifyTags = (offer) => {
    if (!this.props.selectedOffer || offer.id !== this.props.selectedOffer.id) {
      this.props.loadOfferData(offer);
    }
    this.setState({ editModalOpened: true });
    this.props.fetchEstablishments();
    this.props.fetchAssociatedCoachesList();
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

  onConfirmModal = ({ offerId, data }) => {
    this.props.editOffers(offerId, data, {
      onSuccess: () => {
        this.setState({ editModalOpened: false });
      },
      onBackgroundSuccess: () => {
        this.props.fetchRelevantOffers();
        this.loadDayData();
      },
    });
  };

  onCancelOffer = (data: {
    offerId: number,
    cashback: ?boolean,
    notify: ?boolean,
    deleteAll: ?boolean,
    custom_selection: ?boolean,
    custom_selection_ids: ?Array<number>,
    cancelLinkedHybridSession: ?boolean,
    force: boolean,
  }) => {
    this.props.disableOffer(data, {
      onSuccess: () => {
        this.setState({ deleteModalOpened: false });
        if (this.state.openReplacementRequestPage) {
          this.goToReplacementRequestManagementPage();
        }
      },
      onBackgroundSuccess: () => {
        this.loadDayData();
      },
      onError: () => {
        this.setState({ deleteModalOpened: false });
      },
    });
  };

  onHardDeleteOffer = (offerId: number, data: any) => {
    this.props.hardDeleteOffers(offerId, data, {
      onSuccess: () => {
        this.setState({ deleteModalOpened: false });
      },
      onBackgroundSuccess: () => {
        this.props.fetchRelevantOffers();
        this.loadDayData();
      },
      onError: () => {
        this.setState({ deleteModalOpened: false });
      },
    });
  };

  onDownload = () => {
    const { offerFilters } = this.props;
    this.props.fetchReportOfferManagement(
      {
        ...(offerFilters || {}),
        date: this.props.date,
      },
      {
        onSuccess: (url) => {
          window.open(url, '_blank');
        },
      },
    );
  };

  getIsWherebyIntegrationEnabled = () => {
    return (
      this.props.theme &&
      this.props.theme.is_whereby_integration_enabled &&
      this.props.theme.is_whereby_integration_allowed
    );
  };

  getAllowGuestMaster = () => {
    return (
      this.props.theme.allow_guest_activatable && this.props.theme.allow_guest
    );
  };

  getEditFormLoading = () => {
    return (
      this.props.coachesLoading ||
      this.props.establishmentsLoading ||
      this.props.activitiesLoading ||
      this.props.similarOfferLoading
    );
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

  getIsWherebyIntegrationEnabled = () => {
    return (
      this.props.theme &&
      this.props.theme.is_whereby_integration_enabled &&
      this.props.theme.is_whereby_integration_allowed
    );
  };

  getAllowGuestMaster = () => {
    return (
      this.props.theme.allow_guest_activatable && this.props.theme.allow_guest
    );
  };

  renderEditModal = () => {
    const {
      coaches,
      availableEstablishments,
      allEstablishments,
      fetchSimilarOffers,
      similarOfferLoading,
      similarOffers,
      roomBlueprints,
      allRoomBlueprints,
      allTagsWithTagGroup,
    } = this.props;
    const { editModalOpened } = this.state;
    const { selectedOffer } = this.props;
    if (selectedOffer) {
      return (
        <GenericResponsiveDrawer
          open={editModalOpened}
          onClose={this.onCancelModal}
          title={this.props.t('translation:common.offers')}
          subtitle={this.props.t('translation:common.offerEdition')}
          withoutPadding
          withoutHeaderContainer
        >
          <OfferEditForm
            offer={selectedOffer}
            metaActivities={this.props.metaActivities}
            metaActivity={selectedOffer.meta_activity}
            coaches={coaches}
            availableEstablishments={availableEstablishments}
            allEstablishments={allEstablishments}
            roomBlueprints={roomBlueprints}
            allRoomBlueprints={allRoomBlueprints}
            isWherebyIntegrationEnabled={this.getIsWherebyIntegrationEnabled()}
            isLoading={this.getEditFormLoading()}
            onSubmit={this.onConfirmModal}
            onCancel={this.onCancelModal}
            processing={this.props.editOfferProcessing}
            fetchSimilarOffers={fetchSimilarOffers}
            similarOffers={similarOffers}
            similarOfferLoading={similarOfferLoading}
            coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
            showPartnership={this.props.showPartnership}
            tagList={allTagsWithTagGroup}
            activeCustomLevels={this.props.activeCustomLevels}
            allCustomLevels={this.props.allCustomLevels}
            fetchLevelList={this.handleFetchLevel}
            updateLevel={this.props.updateLevel}
            createLevel={this.props.createLevel}
            deleteLevel={this.props.deleteLevel}
            allowGuestMaster={this.getAllowGuestMaster()}
            zoomAppDetail={this.props.zoomAppDetail}
            editableCoachPaymentRule
          />
        </GenericResponsiveDrawer>
      );
    }
    return null;
  };

  renderCreateModal = () => {
    const {
      metaActivities,
      coaches,
      availableEstablishments,
      allTagsWithTagGroup,
      classes,
    } = this.props;
    const { createOfferModalOpened } = this.state;
    return (
      <GenericResponsiveDrawer
        open={createOfferModalOpened}
        onClose={this.closeCreateOffersModal}
        title={this.props.t('translation:common.offers')}
        subtitle={this.props.t('translation:common.offerCreation')}
        withoutPadding
        withoutHeaderContainer
      >
        <div className={classes.spaceTop}>
          <OfferFormWithActivity
            selectedDate={moment(this.props.date, DATE_FORMAT)}
            timezone={this.props.theme.timezone_name}
            metaActivities={metaActivities}
            activitiesLoading={this.props.activitiesLoading}
            coaches={coaches}
            availableEstablishments={availableEstablishments}
            roomBlueprints={this.props.roomBlueprints}
            onSubmit={this.createOffers}
            onCancel={this.closeCreateOffersModal}
            processing={this.props.creatingOffers}
            is_whereby_integration_enabled={this.getIsWherebyIntegrationEnabled()}
            coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
            showPartnership={this.props.showPartnership}
            tagList={allTagsWithTagGroup}
            activeCustomLevels={this.props.activeCustomLevels}
            allCustomLevels={this.props.allCustomLevels}
            fetchLevelList={this.handleFetchLevel}
            updateLevel={this.props.updateLevel}
            createLevel={this.props.createLevel}
            deleteLevel={this.props.deleteLevel}
            allowGuestMaster={this.getAllowGuestMaster()}
            zoomAppDetail={this.props.zoomAppDetail}
            coachesLoading={this.props.coachesLoading}
            establishmentsLoading={this.props.establishmentsLoading}
          />
        </div>
      </GenericResponsiveDrawer>
    );
  };

  createOffers = (metaActivityId: number, data: Object) => {
    this.props.createOffers(
      {
        ...data,
        meta_activity: metaActivityId,
      },
      {
        onSuccess: () => {
          this.setState({ createOfferModalOpened: false });
        },
        onBackgroundSuccess: () => {
          this.props.fetchRelevantOffers();
          this.loadDayData(this.props.date);
        },
      },
    );
  };

  goToReplacementRequestManagementPage = async () => {
    await this.props.setReplacementRequestManagerFilter({
      ...this.props.replacementRequestManagerFilter,
      offer_available: false,
    });
    this.props.goToReplacementRequestManagementPage();
  };

  renderDeleteModal = () => {
    const { deleteModalOpened } = this.state;
    const {
      selectedOffer,
      deletingOffer,
      similarOfferLoading,
      similarOffers,
      getHasPendingReplacementRequest,
    } = this.props;

    if (selectedOffer) {
      const hasPendingReplacementRequest = getHasPendingReplacementRequest
        ? getHasPendingReplacementRequest(selectedOffer?.id)
        : false;
      return (
        <GenericResponsiveDialog
          onClose={this.onCancelModal}
          open={deleteModalOpened}
          maxWidth="sm"
          padding
        >
          <DeleteOfferForm
            offer={selectedOffer}
            offerWasCancelled={!selectedOffer.available}
            onCancelOffer={({
              cashback,
              notify,
              deleteAll,
              custom_selection,
              custom_selection_ids,
              force,
              cancelLinkedHybridSession,
            }) =>
              this.onCancelOffer({
                offerId: selectedOffer.id,
                cashback,
                notify,
                deleteAll,
                custom_selection,
                custom_selection_ids,
                force,
                cancelLinkedHybridSession,
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
            similarOffers={similarOffers}
            similarOfferLoading={similarOfferLoading}
            hasPendingReplacementRequest={hasPendingReplacementRequest}
            setOpenReplacementRequestOnCancel={(open: boolean) =>
              this.setState({ openReplacementRequestPage: open })
            }
            openReplacementRequestPageOnCancel={
              this.state.openReplacementRequestPage
            }
          />
        </GenericResponsiveDialog>
      );
    }
    return null;
  };

  renderRestoreModal = () => {
    const { restoreModalOpen } = this.state;
    const { selectedOffer, t } = this.props;

    if (selectedOffer) {
      return (
        <GenericResponsiveDialog maxWidth="sm" open={restoreModalOpen}>
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
        </GenericResponsiveDialog>
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
    events?.forEach((o) => {
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

  setCalendarFilter = (
    newValues: Array<{ label: string, value: number | string }>,
    identifier: number,
  ) => {
    switch (identifier) {
      case FILTER_COACH:
        this.props.setCalendarFilter({
          ...this.props.offerFilters,
          coaches:
            newValues?.length === 0 &&
            this.props.coachesSelectedInRole?.length > 0
              ? this.props.coachesSelectedInRole.map((coach: Coach) => coach.id)
              : newValues.map((e) => e.value),
        });
        break;
      case FILTER_ESTABLISHMENT:
        this.props.setCalendarFilter({
          ...this.props.offerFilters,
          establishments: newValues.map((e) => e.value),
        });
        break;
      case FILTER_ACTIVITY:
        this.props.setCalendarFilter({
          ...this.props.offerFilters,
          activity__in: newValues.map((e) => e.value),
        });
        break;
      case FILTER_ROLLCALL:
        this.props.setCalendarFilter({
          ...this.props.offerFilters,
          roll_call_needs_validation: newValues?.value,
        });
        break;
      default:
        break;
    }
  };

  selectRollCallFilter = (ev) => this.setCalendarFilter(ev, FILTER_ROLLCALL);

  searchBar = () => {
    const {
      theme,
      establishmentGroupList,
      allEstablishments,
      establishmentsLoading,
      offerFilters,
      classes,
      coachesLoading,
      metaActivities,
      activitiesLoading,
      coachesSelectedInRole,
    } = this.props;

    const coachBaselist =
      coachesSelectedInRole?.length > 0
        ? coachesSelectedInRole
        : this.props.coaches;
    const coachList = coachBaselist.map((e) => ({
      ...e,
      user: { name: e.name },
    }));
    const hasMultiLocation =
      theme?.enable_multi_localization &&
      establishmentGroupList &&
      establishmentGroupList.length !== 0;
    let mediumSize = 4;
    if (hasMultiLocation || this.props.theme.is_roll_call_mandatory) {
      mediumSize = 3;
    }
    if (hasMultiLocation && this.props.theme.is_roll_call_mandatory) {
      mediumSize = 2;
    }

    let filteredEstablishments: Array<Establishment> = [...allEstablishments];

    if (offerFilters?.establishment_group__in?.length) {
      const filteredEstablishmentIds: Array<number> = establishmentGroupList
        .filter((eg: EstablishmentGroup) =>
          offerFilters.establishment_group__in.includes(eg.id),
        )
        .flatMap((eg: EstablishmentGroup) => eg.establishment)
        .map((e: Establishment) => e.id);

      const uniqueEstIds = offerFilters.establishments?.length
        ? [
            ...new Set(
              filteredEstablishmentIds.concat(offerFilters.establishments),
            ),
          ]
        : filteredEstablishmentIds;

      filteredEstablishments = [...allEstablishments].filter(
        (e: Establishment) => uniqueEstIds.includes(e.id),
      );
    }

    return (
      <Grid container style={{ overflow: 'auto' }}>
        <Grid item xs={6} md={mediumSize} className={classes.selector}>
          <CoachSelector
            coaches={Immutable(coachList)}
            selectedCoaches={
              this.props.filterVerification && offerFilters.coaches
            }
            selectOption={(ev) => this.setCalendarFilter(ev, FILTER_COACH)}
            isLoading={coachesLoading}
          />
        </Grid>
        {hasMultiLocation && (
          <Grid item xs={6} md={mediumSize} className={classes.selector}>
            <EstablishmentGroupSelector
              isMulti
              establishmentGroups={establishmentGroupList.filter(
                (group) => group.establishment.length !== 0,
              )}
              selectOption={(ev: SelectOptions) => {
                const { establishments: _establishments, ...rest } =
                  offerFilters;
                this.props.setCalendarFilter({
                  ...rest,
                  establishment_group__in: ev.map((e) => e.value),
                });
              }}
              closeMenuOnSelect
              selectedEstablishmentGroups={
                this.props.filterVerification &&
                offerFilters.establishment_group__in
              }
            />
          </Grid>
        )}
        <Grid item xs={6} md={mediumSize} className={classes.selector}>
          <EstablishmentSelector
            establishments={Immutable(filteredEstablishments)}
            selectedEstablishments={
              this.props.filterVerification && offerFilters.establishments
            }
            selectOption={(ev) =>
              this.setCalendarFilter(ev, FILTER_ESTABLISHMENT)
            }
            isLoading={establishmentsLoading}
          />
        </Grid>
        <Grid item xs={6} md={mediumSize} className={classes.selector}>
          <MetaActivitySelector
            metaActivities={metaActivities.filter(
              (ma) => ma.customer_enabled && !ma.is_workshop,
            )}
            selectedMetaActivities={
              this.props.filterVerification && offerFilters.activity__in
            }
            selectOption={(ev) => this.setCalendarFilter(ev, FILTER_ACTIVITY)}
            isLoading={activitiesLoading}
          />
        </Grid>
        {this.props.theme.is_roll_call_mandatory && (
          <Grid item xs={6} md={mediumSize} className={classes.selector}>
            <RollCallSelector
              selectedRollCallStatus={
                this.props.filterVerification &&
                offerFilters.roll_call_needs_validation
              }
              selectOption={this.selectRollCallFilter}
            />
          </Grid>
        )}
      </Grid>
    );
  };

  fetchOffersOfDate = (date) => {
    this.props.fetchOffersByDay({
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
      ...omit(
        this.props.offerFilters || {},
        omit_list(this.props.offerFilters, false),
      ),
    });
  };

  fetchOffersOfSelectedDate = () => {
    const date = moment(this.props.date, DATE_FORMAT);
    this.fetchOffersOfDate(date);
  };

  renderRollCallDrawer = () => {
    return (
      <RollCallDrawer
        open={this.state.isRollCallDrawerOpen}
        onClose={this.closeRollCallDrawer}
        offer={this.props.offers[this.state.indexOfferInDrawer]}
        members={this.props.members}
        bookings={this.props.bookingsWithConsumerPack}
        fetchBookings={this.props.fetchBookingsByOffer}
        confirmBookingAttendance={this.props.confirmBookingAttendance}
        discardBookingAttendance={this.props.discardBookingAttendance}
        postRollCall={this.props.postRollCall}
        fetchOffer={this.props.retrieveOfferAsManager}
        bookingTableLoading={this.props.bookingsLoading}
        rollCallLoading={this.props.rollCallLoading}
        isRollCallMandatory={this.props.theme.is_roll_call_mandatory}
      />
    );
  };

  renderConfirmationRollCallDialog = () => {
    return (
      <ConfirmationRollCallDialog
        open={this.state.isConfirmationRollCallDialogOpen}
        nbRollCallsLeftToValidate={this.props.offers.length}
        onConfirm={this.postRollCallBulk}
        onCancel={this.closeConfirmationRollCallDialog}
        isLoading={this.props.rollCallLoading}
      />
    );
  };

  openRollCallDrawer = (index: number, offer: Offer) => {
    this.props.fetchBookingsByOffer(offer.id, {
      onSuccess: (bookings) => {
        this.props.retrieveConsumerPackBulk(
          bookings.map((b) => b.consumer_payment_pack),
          {
            onSuccess: (cppList) => {
              this.props.fetchPaymentPackBulk(
                cppList.map((cpp) => cpp.payment_pack),
              );
            },
          },
        );
      },
    });
    this.props.fetchFilteredMembers({
      offer: offer.id,
      withNotes: true,
    });
    this.setState({
      isRollCallDrawerOpen: true,
      indexOfferInDrawer: index,
    });
  };

  closeRollCallDrawer = () => {
    this.setState({ isRollCallDrawerOpen: false, indexOfferInDrawer: null });
  };

  openConfirmationRollCallDialog = () => {
    this.setState({ isConfirmationRollCallDialogOpen: true });
  };

  closeConfirmationRollCallDialog = () => {
    this.setState({ isConfirmationRollCallDialogOpen: false });
  };

  postRollCallBulk = (options?: OptionCallback) => {
    this.props.postRollCallBulk(
      {
        offer_id_list: Array.from(
          new Set(this.props.offers.map((offer) => offer.id)),
        ),
      },
      {
        onSuccess: () => {
          this.fetchOffersOfSelectedDate();
          options?.onSuccess();
        },
      },
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
      hybridOfferLinkedToSelectedOffer,
    } = this.props;
    const events_ = this.getDayOffers(events);

    return (
      <div className={classes.container}>
        {this.searchBar()}
        <Grid className={classes.innerContainer} container spacing={3}>
          {isWidthDown('md', width) && selectedOffer
            ? this.renderGoBackButton()
            : null}
          {isWidthUp('lg', width) || !selectedOffer ? (
            <Grid className={classes.panel} item xs={12} lg={6}>
              <CheckPermission requiredPermissions="navigation,calendar">
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: '100%', margin: 8 }}
                  onClick={this.props.pushToSchedule}
                >
                  {this.props.t('openSchedule')}
                  <ArrowForwardIcon style={{ marginLeft: 8 }} />
                </Button>
              </CheckPermission>
              <Paper
                style={{
                  width: '100%',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <PermissionContext.Consumer>
                  {(permission) => (
                    <Calendar
                      onDownload={this.onDownload}
                      onRequestMassDisable={
                        permission.offer.delete &&
                        this.props.setMassDisablerStartDate
                      }
                      events={events_}
                      onDateChange={this.loadDayData}
                      date={this.props.date}
                      filters={this.props.offerFilters}
                      showCancelledOffers={
                        this.props.offerFilters.available === undefined
                          ? this.props.theme.show_cancelled_offers_manager
                          : !this.props.offerFilters.available
                      }
                      setShowCancelledOffers={this.props.setShowCancelledOffers}
                      showDayName
                    />
                  )}
                </PermissionContext.Consumer>
                <TimeTable
                  onOfferSelected={this.selectOffer}
                  offers={offers}
                  loading={
                    offerByDayLoading ||
                    (timetableLoading && (offers || []).length === 0)
                  }
                  selected={selectedOffer ? selectedOffer.id : null}
                  getHasPendingReplacementRequest={
                    this.props.getHasPendingReplacementRequest
                  }
                  onModifyTags={this.onModifyTags}
                  showTags
                  className={classes.offerList}
                  virtualized
                  isRollCallMandatory={this.props.theme.is_roll_call_mandatory}
                  openRollCallDrawer={this.openRollCallDrawer}
                  openConfirmationRollCallDialog={
                    this.openConfirmationRollCallDialog
                  }
                  displayCoachInfoOnHover
                />
              </Paper>
              <CheckPermission requiredPermissions="offer.create">
                {this.renderAddOffersButton()}
              </CheckPermission>
              {/* Removed Bloating the ui  */}
              {/* {!this.props.selectedOffer ? (
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
              )} */}
            </Grid>
          ) : (
            <Typography />
          )}
          {selectedOffer ? (
            <Grid item xs={12} lg={6}>
              <div>
                <OfferCard
                  snackbarSuccess={this.props.snackbarSuccess}
                  offer={selectedOffer}
                  linkedHybridSession={hybridOfferLinkedToSelectedOffer}
                  companyId={this.props.companyId}
                  onEditButtonClick={this.openEditModal}
                  onDeleteButtonClick={this.openDeleteModal}
                  onRestoreButtonClick={this.openRestoreModal}
                  goToOfferManagement={this.props.goToOfferManagement}
                  members={this.props.members}
                  membersLoading={
                    this.props.membersLoading || !this.props.members
                  }
                  bookings={this.props.bookings}
                  bookingsLoading={
                    this.props.bookingsLoading || !this.props.bookings
                  }
                  showOfferGender={
                    this.props.theme &&
                    this.props.theme.show_booked_gender_offer
                  }
                  showVaccinationStatus={this.props.showVaccinationStatus}
                  onModifyTags={this.onModifyTags}
                />
              </div>
            </Grid>
          ) : (
            <Grid item xs={12} lg={6}>
              <BookingStatisticsCard
                bookingStatistics={this.props.bookingStatistics}
                loading={
                  this.props.createdBookingStatsLoading ||
                  this.props.cancelledBookingStatsLoading
                }
              />
            </Grid>
          )}
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
          {this.renderRollCallDrawer()}
          {this.renderConfirmationRollCallDialog()}
          {!!this.props.massDisablerStartDate && (
            <MassDisablerDialog
              startDate={this.props.massDisablerStartDate}
              retrieveNumberOfDeletedOffer={({ start, end }) => {
                this.props.retrieveNumberOfMassDisabledOffer({ start, end });
                this.props.retrieveNumberOfMassDisabledOfferInGroup({
                  start,
                  end,
                });
              }}
              numberOfMassDisabledOfferLoading={
                this.props.numberOfMassDisabledOfferLoading
              }
              numberOfMassDisabledOffer={this.props.numberOfMassDisabledOffer}
              massDisabledOfferInGroup={this.props.massDisabledOfferInGroup}
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
    (state, { date }) => ({
      creatingOffers: state.offer.create.loading,
      editOfferProcessing: state.offer.edit.loading,
      events: state.offer.calendar,
      timetableLoading: state.offer.byDay.loading,

      coaches: getActiveCoaches(state),
      coachesLoading: state.coach.loading,
      coachesSelectedInRole: getCoachesSelectedInRole(state),
      numberOfMassDisabledOfferLoading:
        state.offer.numberOfMassDisabledOffer.loading ||
        state.offer.numberOfMassDisabledOfferInGroup.loading,
      numberOfMassDisabledOffer: getNumberOfMassDisabledOffer(state),
      // massDisabledOfferInGroup: withCustomLevel(
      //   withEstablishment(withCoach(getMassDisabledOfferInGroup)),
      // )(state),
      massDisabledOfferInGroup: getMassDisabledOfferInGroup(state),
      availableEstablishments: getAvailableEstablishmentList(state),
      allEstablishments: getAllPageEstablishments(state),
      establishmentsLoading: state.establishment.loading,
      establishmentGroupList: groupWithEstablishment(
        getAssociatedEstablishmentGroup,
      )(state),
      companyId: state.theme.theme.company,
      theme: state.theme.theme,
      metaActivities: getEnabledMetaActivities(state),
      activitiesLoading: state.metaActivity.loading,

      similarOfferLoading:
        state.offer.similarOffers.loading ||
        state.metaActivity.loading ||
        state.establishment.loading,

      similarOffers: getSimilarsOffers(state),
      similarOffersPage: getSimilarsOffersPage(state),
      similarOffersCount: getSimilarsOffersCount(state),
      offerFilters: state.userPreference.calendarFilter,
      offerByDayLoading: state.offer.byDay.loading,

      members: withTags(getAllMembers)(state),
      membersLoading: state.member.loading,

      bookings: getOfferBookingList(state),
      bookingsWithConsumerPack: getOfferBookingListWithConsumerPack(state),
      bookingsLoading: state.booking.byOffer.loading,

      createdBookingStatsLoading: getBookingRelatedStatisticLoading(
        state,
        'createdBookings',
      ),
      cancelledBookingStatsLoading: getBookingRelatedStatisticLoading(
        state,
        'cancelledBookings',
      ),
      bookingStatistics: getStats(
        state,
        moment(date).startOf('week').format(),
        moment(date).endOf('week').format(),
      ),
      roomBlueprints: getAvailableRoomBlueprints(state),
      allRoomBlueprints: getRoomBlueprints(state),
      coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
      showPartnership: state.theme.theme.has_partnership,
      showVaccinationStatus: showVaccinationStatus(state),
      allTagsWithTagGroup: getAllTagsWithTagGroup(state),
      activeCustomLevels: getActiveCustomLevels(state),
      allCustomLevels: getAllCustomLevels(state),
      isDownloadingReport: state.reports.offerManagement.loading,
      deletingOffer: state.offer.delete.loading || state.offer.disable.loa,
      zoomAppDetail: zoomAppSelectors.getZoomApp(state),
      replacementRequestManagerFilter:
        state.userPreference.replacementRequestManagerFilter,
      rollCallLoading: state.offer.rollCall.loading,
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
      setCalendarFilter: setCalendarFilterAction,
      fetchFilteredMembers: fetchFilteredMembersAction,
      fetchBookingsByOffer: fetchBookingsByOfferAction,
      fetchEstablishments,
      fetchAssociatedCoachesList,
      fetchActivitiesCompany,
      retrieveNumberOfMassDisabledOffer:
        retrieveNumberOfMassDisabledOfferAction,
      retrieveNumberOfMassDisabledOfferInGroup:
        retrieveNumberOfMassDisabledOfferInGroupAction,

      disableMassOffers,
      fetchBookingStatistics: fetchBookingStatisticsAction,
      monitorBackgroundTask,
      restoreOffer,
      fetchBookedGender: fetchBookedGenderAction,
      fetchRoomBlueprints,
      fetchAllCoachPaymentRules,
      fetchAllEstablishmentGroup,
      createOffers: createOffersActions,
      editOffers: editOffersActions,
      disableOffer: disableOfferAction,
      hardDeleteOffers: hardDeleteOffersAction,
      fetchLevelList: fetchLevelListAction,
      updateLevel: updateLevelAction,
      createLevel: createLevelAction,
      deleteLevel: deleteLevelAction,
      fetchReportOfferManagement: fetchReportOfferManagementActions,
      fetchZoomApp: fetchZoomAppAction,
      setReplacementRequestManagerFilter:
        setReplacementRequestManagerFilterAction,
      redirectIfAllowed: redirectIfAllowedAction,
      confirmBookingAttendance: confirmBookingAttendanceAction,
      discardBookingAttendance: discardBookingAttendanceAction,
      retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      postRollCall: postRollCallAction,
      postRollCallBulk: postRollCallBulkAction,
      retrieveOfferAsManager: retrieveOfferAsManagerAction,
    },
  ),
  withHandlers({
    setShowCancelledOffers:
      ({ offerFilters, setCalendarFilter }) =>
      (showCancelled) => {
        let filters = { ...offerFilters };
        filters = { ...filters, available: !showCancelled };
        setCalendarFilter(filters);
      },
    fetchRelevantOffers:
      ({ fetchAllOffers, theme, fetchBookedGender, offerFilters, date }) =>
      () => {
        fetchAllOffers({
          min_date: moment(date)
            .startOf('month')
            .startOf('week')
            .format('YYYY-MM-DD'),
          max_date: moment(date)
            .endOf('month')
            .endOf('week')
            .format('YYYY-MM-DD'),
          ...omit(offerFilters || {}, omit_list(offerFilters, true)),
        });
        if (theme && theme.show_booked_gender_offer) {
          fetchBookedGender({
            min_date: moment(date)
              .startOf('month')
              .startOf('week')
              .format('YYYY-MM-DD'),
            max_date: moment(date)
              .endOf('month')
              .endOf('week')
              .format('YYYY-MM-DD'),
            ...omit(offerFilters || {}, omit_list(offerFilters, true)),
          });
        }
      },
    fetchBookingInOfferStats:
      ({ selectedOffer, fetchBookingStatistics }) =>
      () => {
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
    fetchBookingStatsOfTheWeek:
      ({ date, fetchBookingStatistics, offerFilters }) =>
      () => {
        fetchBookingStatistics('createdBookings', {
          min_date: moment(date).startOf('week').format('YYYY-MM-DD'),
          max_date: moment(date).endOf('week').format('YYYY-MM-DD'),
          ...omit(offerFilters || {}, omit_list(offerFilters, true)),
          date_field: 'offer__date_start',
          kind: 'count',
        });
        fetchBookingStatistics('cancelledBookings', {
          min_date: moment(date).startOf('week').format('YYYY-MM-DD'),
          max_date: moment(date).endOf('week').format('YYYY-MM-DD'),
          booking_status_code__in: [
            BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
            BOOKING_STATUS_CANCELLED_BY_MANAGER.id,
            BOOKING_STATUS_CANCELLED_BY_OFFER.id,
          ],
          ...omit(offerFilters || {}, omit_list(offerFilters, true)),
          date_field: 'offer__date_start',
          kind: 'count',
        });
      },
    goToReplacementRequestManagementPage:
      ({ redirectIfAllowed }) =>
      () => {
        redirectIfAllowed('/replacement/management', {
          newWindow: true,
          deniedAccessDialog: {
            display: true,
          },
        });
      },
  }),
  withState('openDeleteDialog', 'setOpenDeleteDialog', false),
  withState('massDisablerStartDate', 'setMassDisablerStartDate', null),
  withState('filterVerification', 'setFilterVerification', false),
  withTitle(({ t }: { t: TFunction }) => t('titles:planning')),
)(Planning);
