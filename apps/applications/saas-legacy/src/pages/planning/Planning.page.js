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
import {
  push as pushRouter,
  goBack as goBackRouter,
} from 'connected-react-router';

import { DateTime } from 'luxon';
import {
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_CONSUMER,
  BOOKING_STATUS_CANCELLED_BY_OFFER,
} from '@bsport/common/lib/master-data/booking_status_code.js';
import type { LuxonDateTime } from '#src/types';

import { hasUpsell } from '#src/libs/platform-billing/utils';
import {
  UPSELL_IDENTIFIER_SUBTEACHER_TOOL,
  UPSELL_IDENTIFIER_WELLHUB,
} from '#src/libs/platform-billing/upsell-identifiers';

import withTitle from '#src/hocs/with-title.hoc';

import {
  getMassDisabledOfferInGroup,
  getNumberOfMassDisabledOffer,
  getSimilars as getSimilarsOffers,
  withCoach,
  withEstablishment,
} from '#src/libs/offer/selectors';
import OfferCard from '#src/components/offer/OfferCard.component';
import TimeTable from '#src/components/offer/TimeTable.component';
import Calendar from '#src/components/offer/Calendar.component';
import { getEnabledMetaActivities } from '#src/libs/meta-activity/selectors';
import {
  getActiveCoaches,
  getCoachesSelectedInRole,
} from '#src/libs/associated-coach/selectors';
import { fetchActivitiesCompany } from '#src/libs/meta-activity/actions';
import {
  fetchEstablishments,
  fetchAllEstablishmentGroup,
} from '#src/libs/establishment/actions';
import {
  getAvailableEstablishmentList,
  getAllPageEstablishments,
  getAssociatedEstablishmentGroup,
  withEstablishment as groupWithEstablishment,
} from '#src/libs/establishment/selectors';
import { fetchAssociatedCoachesList } from '#src/libs/associated-coach/actions';
import {
  Establishment,
  EstablishmentGroup,
} from '#src/libs/establishment/types';
import BookingStatisticsCard from '#src/libs/booking/components/BookingStatisticsCard.component';

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
} from '#src/libs/offer/actions';
import {
  fetchLevelList as fetchLevelListAction,
  updateLevel as updateLevelAction,
  createLevel as createLevelAction,
  deleteLevel as deleteLevelAction,
} from '#src/libs/level/actions';
import {
  getActiveCustomLevels,
  getAllCustomLevels,
} from '#src/libs/level/selectors';
import { fetchReportOfferManagement as fetchReportOfferManagementActions } from '#src/libs/reporting/v1/actions';
import {
  setCalendarFilter as setCalendarFilterAction,
  setReplacementRequestManagerFilter as setReplacementRequestManagerFilterAction,
} from '#src/libs/user-preference/actions';

import { fetchFilteredMembers as fetchFilteredMembersAction } from '#src/libs/member/actions';
import { getAllMembers, withTags } from '#src/libs/member/selectors';

import {
  fetchBookingsByOffer as fetchBookingsByOfferAction,
  confirmAttendanceAndRollCallById as confirmBookingAttendanceAction,
  discardAttendanceAndRollCallById as discardBookingAttendanceAction,
} from '#src/libs/booking/actions';
import {
  getOfferBookingList,
  getOfferBookingListWithConsumerPack,
} from '#src/libs/booking/selectors';

import {
  fetchBookingStatistics as fetchBookingStatisticsAction,
  fetchOffersWaitingListStatistics as fetchOffersWaitingListStatisticsAction,
} from '#src/libs/statistics/actions';
import { fetchOffersMissingWellhubProduct as fetchOffersMissingWellhubProductAction } from '#src/libs/wellhub/actions';
import {
  getOffersMissingWellhubProductLoading,
  getOffersMissingWellhubProductPaginatedData,
} from '#src/libs/wellhub/selectors';

import type {
  OfferFilter,
  OfferTypeFilter,
  OfferREST,
  DeleteOfferPayload,
} from '#src/libs/offer/types';

import { snackbarSuccess } from '#src/libs/snackbar/actions';
import MassDisablerDialog from '#src/libs/offer/components/MassDisablerDialog.component';
import OfferSearchBar, {
  FILTER_COACH,
  FILTER_ESTABLISHMENT,
  FILTER_ESTABLISHMENT_GROUP,
  FILTER_ACTIVITY,
  FILTER_ROLLCALL,
  FILTER_SUB_REQUEST_TEACHER,
} from '#src/libs/offer/components/OfferSearchBar.component';
import OfferFormWithActivity from '#src/libs/offer/OfferFormWithActivity.component';
import DeleteOfferForm from '#src/libs/offer/DeleteOfferForm.component';

import CheckPermission from '#src/libs/role/components/CheckPermission.component';
import {
  getAvailableRoomBlueprints,
  getRoomBlueprints,
} from '#src/libs/spot-scheduling/selector';
import { fetchRoomBlueprints } from '#src/libs/spot-scheduling/actions';
import { RoomBlueprint } from '#src/libs/spot-scheduling/types';
import { fetchAllCoachPaymentRules } from '#src/libs/coach-payment-rules/actions';
import { CoachPaymentRuleByKindSelector } from '#src/libs/coach-payment-rules/selectors';
import type { CoachPaymentRule } from '#src/libs/coach-payment-rules/types';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import type { Tag, TagGroup } from '#src/libs/tag/types';
import { fetchZoomApp as fetchZoomAppAction } from '#src/libs/zoom-app/actions';
import zoomAppSelectors from '#src/libs/zoom-app/selectors';
import { ZoomApp } from '#src/libs/zoom-app/types';
import { TUTORIAL_WELCOME_DIALOG_OPEN_QUERY_PARAMS } from '#src/libs/platform-tutorial/constant';
import { platformTutorialActivated } from '#src/libs/platform-tutorial/utils';

import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '#src/libs/consumer-payment-pack/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#src/libs/payment-packs/actions';

import RollCallDrawer from '#src/libs/offer/components/RollCallDrawer.component';
import ConfirmationRollCallDialog from '#src/libs/offer/components/ConfirmationRollCallDialog.component';
import OfferEditForm from '#src/libs/offer/OfferEditForm.component';

import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { redirectIfAllowed as redirectIfAllowedAction } from '../../libs/role/actions';
import type { ReplacementRequestFilter } from '../../libs/replacement-request/types';
import GenericResponsiveDialog from '../../components/genericDialog/GenericResponsiveDialog';
import type {
  OptionCallback,
  ReworkedPaginationResponse,
} from '../../state/types';
import type { Offer, Coach } from '#src/api/types';
import {
  getBookingRelatedStatisticLoading,
  getStats,
} from '../../state/stats/selectors';
import WellhubProductAlert from '../../libs/wellhub/components/WellhubProductAlert';
import WellhubProductSelectionDrawer from '../../libs/wellhub/components/WellhubProductSelectionDrawer';
import type { PaginationFilterParams } from '../../libs/types';

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

export const omit_list = (offerFilters: OfferFilter, available: boolean) => {
  const list = available ? ['available'] : [];
  for (const filter in offerFilters) {
    if (!offerFilters[filter] || offerFilters[filter].length === 0) {
      list.push(filter);
    }
  }
  return list;
};

export const getDayOffers = memoize((events, showCancelledOffers = false) => {
  const events_ = {};
  events?.forEach((o) => {
    const midnight = DateTime.fromISO(o.date_start).startOf('day');
    if (!events_[midnight]) {
      events_[midnight] = [];
    }
    if (showCancelledOffers || o.available) {
      events_[midnight].push(o);
    }
  });
  return events_;
});

type Props = {
  t: TFunction,
  location: Location,
  classes: Object,
  date: string,
  selectedOffer: Offer,
  hybridOfferLinkedToSelectedOffer: Offer | null,
  offerId: number,

  theme?: CompanyTheme,

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
  metaActivities: Array<MetaActivity>,
  offers: Array<Offer>,
  similarOffers: Array<OfferREST>,
  similarOffersWithCoachAndEstablishment: Array<Offer<Coach, Establishment>>,
  events: Array<Event>,
  coaches: Array<Coach>,
  establishmentGroupList: EstablishmentGroup[],
  availableEstablishments: Array<Establishment>,
  allEstablishments: Array<Establishment>,
  bookingStatistics: Immutable.Immutable<{
    createdBookings: Immutable.ImmutableArray<
      Immutable.Immutable<StatisticPoint>,
    >,
    cancelledBookings: Immutable.ImmutableArray<
      Immutable.Immutable<StatisticPoint>,
    >,
    offers: Immutable.ImmutableArray<Immutable.Immutable<StatisticPoint>>,
  }>,
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

  offerFilters: OfferFilter,
  setCalendarFilter: (OfferFilter) => null,
  filterVerification: boolean,
  setFilterVerification: (boolean) => false,

  pushToSchedule: () => void,

  members: Array<Member<Tag<TagGroup>>>,
  membersLoading: boolean,
  bookings: Array<Booking>,
  bookingsLoading: boolean,

  massDisablerStartDate?: string,
  disableMassOffers: (
    params: any,
    filters: OfferFilter & OfferTypeFilter,
    options: OptionCallback,
  ) => void,
  setMassDisablerStartDate: (date?: string) => void,
  setShowCancelledOffers: (boolean) => void,
  setOpenDeleteDialog: () => void,
  openDeleteDialog: boolean,

  restoreOffer: (offerId: number, options: any) => void,
  fetchRoomBlueprints: () => void,
  roomBlueprints: Array<RoomBlueprint>,
  allRoomBlueprints: Array<RoomBlueprint>,
  fetchAllCoachPaymentRules: () => void,
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> },
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

  editOffers: ({ offerId: number, data: Offer }) => void,

  activeCustomLevels: Level[],
  allCustomLevels: Level[],
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
    data: DeleteOfferPayload,
    options: OptionCallback,
  ) => void,

  disableOffer: (
    data: {
      offerId: number,
      notify: boolean,
      deleteAll: boolean,
      custom_selection: boolean,
      custom_selection_ids: Array<number>,
    },
    options: OptionCallback,
  ) => void,
  deletingOffer: boolean,
  coachesSelectedInRole: Coach[],
  zoomAppDetail: ZoomApp,
  fetchZoomApp: (companyId: number) => void,
  getHasPendingReplacementRequest: (offerId: number) => boolean,
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
  featureList: FeatureList,
  fetchOffersMissingWellhubProduct: (params: PaginationFilterParams) => void,
  offersMissingWellhubProductLoading: boolean,
  offersMissingWellhubProductPaginatedData: ReworkedPaginationResponse<OfferREST>,
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
  isWellhubProductSelectionDrawerOpen: boolean,
};

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
      isWellhubProductSelectionDrawerOpen: false,
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
    hasUpsell(this.props.featureList, UPSELL_IDENTIFIER_WELLHUB) &&
      this.props.fetchOffersMissingWellhubProduct({});
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
      !DateTime.fromISO(prevProps.date).hasSame(
        DateTime.fromISO(this.props.date),
        'month',
      )
    ) {
      this.fetchData();
    }
    if (!isEqual(prevProps.offerFilters, this.props.offerFilters)) {
      this.fetchData();
      this.props.fetchBookingStatsOfTheWeek();
    }
    if (
      this.props.selectedOffer &&
      !isEqual(prevProps.selectedOffer, this.props.selectedOffer)
    ) {
      this.props.fetchFilteredMembers({
        offer: this.props.selectedOffer.id,
        withNotes: true,
      });
      this.props.fetchBookingsByOffer(this.props.selectedOffer.id);
    }
    if (prevProps.selectedOffer && !this.props.selectedOffer) {
      this.props.fetchBookingStatsOfTheWeek();
    }
    if (
      !DateTime.fromISO(prevProps.date).hasSame(
        DateTime.fromISO(this.props.date),
        'week',
      )
    ) {
      this.props.fetchBookingStatsOfTheWeek();
    }
  }

  handleFetchLevel = () => {
    this.props.fetchLevelList({
      company: this.props.companyId,
    });
  };

  loadDayData = (day?: string) => {
    const datetime = DateTime.fromISO(day || this.props.date);
    const base = `/calendar/${datetime.year}/${datetime.month}/${
      datetime.day
    }/${this.props.offerId ?? ''}`;

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
    this.fetchOffersOfDate(datetime);
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
    this.props.fetchEstablishments({
      page_size: 1000,
      disabled: false,
      company: this.props.companyId,
    });
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
    this.props.fetchEstablishments({
      page_size: 1000,
      disabled: false,
      company: this.props.companyId,
    });
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
        hasUpsell(this.props.featureList, UPSELL_IDENTIFIER_WELLHUB) &&
          this.props.fetchOffersMissingWellhubProduct({});
        this.loadDayData();
      },
    });
  };

  onCancelOffer = (data: {
    offerId: number,
    notify: boolean,
    deleteAll: boolean,
    custom_selection: boolean,
    custom_selection_ids: Array<number>,
    cancel_linked_hybrid_offer?: boolean,
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

  onHardDeleteOffer = (offerId: number, data: DeleteOfferPayload) => {
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

  getShowSubTeacherFilter = () =>
    hasUpsell(this.props.featureList, UPSELL_IDENTIFIER_SUBTEACHER_TOOL);

  getMetaActivitiesForPermissions = (
    canCreateActivitySessions: boolean,
    canCreateWorkshopSessions: boolean,
  ) =>
    (this.props.metaActivities ?? []).filter((metaActivity) => {
      let canSeeActivity = true;
      if (!canCreateActivitySessions) {
        canSeeActivity = metaActivity.is_workshop;
      }
      if (!canCreateWorkshopSessions) {
        canSeeActivity = !metaActivity.is_workshop;
      }
      return canSeeActivity;
    });

  renderEditModal = (
    canCreateActivitySessions: boolean,
    canCreateWorkshopSessions: boolean,
  ) => {
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
    const metaActivitiesForPermissions = this.getMetaActivitiesForPermissions(
      canCreateActivitySessions,
      canCreateWorkshopSessions,
    );
    if (selectedOffer) {
      return (
        <GenericResponsiveDrawer
          withoutHeaderContainer
          withoutPadding
          onClose={this.onCancelModal}
          open={editModalOpened}
          subtitle={this.props.t('translation:common.offerEdition')}
          title={this.props.t('translation:common.offers')}
        >
          <OfferEditForm
            editableCoachPaymentRule
            activeCustomLevels={this.props.activeCustomLevels}
            allCustomLevels={this.props.allCustomLevels}
            allEstablishments={allEstablishments}
            allowGuestMaster={this.getAllowGuestMaster()}
            allRoomBlueprints={allRoomBlueprints}
            availableEstablishments={availableEstablishments}
            coaches={coaches}
            coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
            createLevel={this.props.createLevel}
            deleteLevel={this.props.deleteLevel}
            fetchLevelList={this.handleFetchLevel}
            fetchSimilarOffers={fetchSimilarOffers}
            isLoading={this.getEditFormLoading()}
            isOfferInGroup={!!selectedOffer?.group}
            isWherebyIntegrationEnabled={this.getIsWherebyIntegrationEnabled()}
            metaActivities={metaActivitiesForPermissions}
            metaActivity={selectedOffer.meta_activity}
            offer={selectedOffer}
            onCancel={this.onCancelModal}
            onSubmit={this.onConfirmModal}
            processing={this.props.editOfferProcessing}
            roomBlueprints={roomBlueprints}
            showPartnership={this.props.showPartnership}
            similarOffers={similarOffers}
            similarOffersLoading={similarOfferLoading}
            tagList={allTagsWithTagGroup}
            updateLevel={this.props.updateLevel}
            zoomAppDetail={this.props.zoomAppDetail}
          />
        </GenericResponsiveDrawer>
      );
    }
    return null;
  };

  renderCreateModal = (
    canCreateActivitySessions: boolean,
    canCreateWorkshopSessions: boolean,
  ) => {
    const { coaches, availableEstablishments, allTagsWithTagGroup, classes } =
      this.props;
    const { createOfferModalOpened } = this.state;
    const metaActivitiesForPermissions = this.getMetaActivitiesForPermissions(
      canCreateActivitySessions,
      canCreateWorkshopSessions,
    );
    return (
      <GenericResponsiveDrawer
        withoutHeaderContainer
        withoutPadding
        onClose={this.closeCreateOffersModal}
        open={createOfferModalOpened}
        subtitle={this.props.t('translation:common.offerCreation')}
        title={this.props.t('translation:common.offers')}
      >
        <div className={classes.spaceTop}>
          <OfferFormWithActivity
            activeCustomLevels={this.props.activeCustomLevels}
            activitiesLoading={this.props.activitiesLoading}
            allCustomLevels={this.props.allCustomLevels}
            allowGuestMaster={this.getAllowGuestMaster()}
            availableEstablishments={availableEstablishments}
            coaches={coaches}
            coachesLoading={this.props.coachesLoading}
            coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
            createLevel={this.props.createLevel}
            deleteLevel={this.props.deleteLevel}
            establishmentsLoading={this.props.establishmentsLoading}
            fetchLevelList={this.handleFetchLevel}
            is_whereby_integration_enabled={this.getIsWherebyIntegrationEnabled()}
            metaActivities={metaActivitiesForPermissions}
            onCancel={this.closeCreateOffersModal}
            onSubmit={this.createOffers}
            processing={this.props.creatingOffers}
            roomBlueprints={this.props.roomBlueprints}
            selectedDate={DateTime.fromISO(this.props.date)}
            showPartnership={this.props.showPartnership}
            tagList={allTagsWithTagGroup}
            timezone={this.props.theme.timezone_name}
            updateLevel={this.props.updateLevel}
            zoomAppDetail={this.props.zoomAppDetail}
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
          hasUpsell(this.props.featureList, UPSELL_IDENTIFIER_WELLHUB) &&
            this.props.fetchOffersMissingWellhubProduct({});
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
          padding
          maxWidth="sm"
          onClose={this.onCancelModal}
          open={deleteModalOpened}
        >
          <DeleteOfferForm
            fetchSimilarOffers={() => {
              this.props.fetchEstablishments();
              this.props.fetchAssociatedCoachesList();
              this.props.fetchSimilarOffers(selectedOffer.id);
            }}
            hasPendingReplacementRequest={hasPendingReplacementRequest}
            offer={selectedOffer}
            offerWasCancelled={!selectedOffer.available}
            onCancel={this.onCancelModal}
            onCancelOffer={({
              notify,
              deleteAll,
              custom_selection,
              custom_selection_ids,
              cancel_linked_hybrid_offer,
            }) =>
              this.onCancelOffer({
                offerId: selectedOffer.id,
                notify,
                deleteAll,
                custom_selection,
                custom_selection_ids,
                cancel_linked_hybrid_offer,
              })
            }
            onHardDelete={(data) =>
              this.onHardDeleteOffer(selectedOffer.id, data)
            }
            openReplacementRequestPageOnCancel={
              this.state.openReplacementRequestPage
            }
            processing={deletingOffer}
            setOpenDeleteDialog={this.props.setOpenDeleteDialog}
            setOpenReplacementRequestOnCancel={(open: boolean) =>
              this.setState({ openReplacementRequestPage: open })
            }
            similarOfferLoading={similarOfferLoading}
            similarOffers={similarOffers}
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
          aria-label="Add"
          className={classes.button}
          color="primary"
          onClick={this.openCreateOfferModal}
          variant="extended"
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
            className={classes.button}
            onClick={this.props.goBack}
            size="small"
          >
            <KeyboardArrowLeft />
            {t('offer.backToCalendar')}
          </Button>
        </div>
      );
    }
    return null;
  };

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
      case FILTER_ESTABLISHMENT_GROUP:
        this.props.setCalendarFilter({
          ...this.props.offerFilters,
          establishment_group__in: newValues.map((e) => e.value),
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
      case FILTER_SUB_REQUEST_TEACHER:
        this.props.setCalendarFilter({
          ...this.props.offerFilters,
          has_active_sub_teacher_request: newValues?.value,
        });
        break;
      default:
        break;
    }
  };

  selectRollCallFilter = (ev) => this.setCalendarFilter(ev, FILTER_ROLLCALL);

  selectSubTeacherRequestFilter = (
    value: ValueType<{
      value: string,
      label: string,
    }>,
  ) => this.setCalendarFilter(value, FILTER_SUB_REQUEST_TEACHER);

  fetchOffersOfDate = (datetime: LuxonDateTime) => {
    this.props.fetchOffersByDay({
      year: datetime.year,
      month: datetime.month,
      day: datetime.day,
      ...omit(
        this.props.offerFilters || {},
        omit_list(this.props.offerFilters, false),
      ),
    });
  };

  fetchOffersOfSelectedDate = () => {
    const datetime = DateTime.fromISO(this.props.date);
    this.fetchOffersOfDate(datetime);
  };

  renderRollCallDrawer = () => {
    return (
      <RollCallDrawer
        bookings={this.props.bookingsWithConsumerPack}
        bookingTableLoading={this.props.bookingsLoading}
        confirmBookingAttendance={this.props.confirmBookingAttendance}
        discardBookingAttendance={this.props.discardBookingAttendance}
        fetchBookings={this.props.fetchBookingsByOffer}
        fetchOffer={this.props.retrieveOfferAsManager}
        isRollCallMandatory={this.props.theme.is_roll_call_mandatory}
        members={this.props.members}
        offer={this.props.offers[this.state.indexOfferInDrawer]}
        onClose={this.closeRollCallDrawer}
        open={this.state.isRollCallDrawerOpen}
        postRollCall={this.props.postRollCall}
        rollCallLoading={this.props.rollCallLoading}
      />
    );
  };

  renderConfirmationRollCallDialog = () => {
    return (
      <ConfirmationRollCallDialog
        isLoading={this.props.rollCallLoading}
        nbRollCallsLeftToValidate={this.props.offers.length}
        onCancel={this.closeConfirmationRollCallDialog}
        onConfirm={this.postRollCallBulk}
        open={this.state.isConfirmationRollCallDialogOpen}
      />
    );
  };

  renderWellhubProductSelectionDrawer = () => {
    if (!hasUpsell(this.props.featureList, UPSELL_IDENTIFIER_WELLHUB))
      return null;

    return (
      <WellhubProductSelectionDrawer
        availableEstablishments={this.props.availableEstablishments}
        coaches={this.props.coaches}
        fetchMissingProductOffersSpecificPage={
          this.fetchMissingProductOffersSpecificPage
        }
        fetchSimilarOffers={this.props.fetchSimilarOffers}
        isLoading={this.props.offersMissingWellhubProductLoading}
        isOpen={this.state.isWellhubProductSelectionDrawerOpen}
        offersData={this.props.offersMissingWellhubProductPaginatedData}
        onClose={this.closeWellhubProductSelectionDrawer}
        onConfirm={this.onConfirmModal}
        similarOffers={this.props.similarOffersWithCoachAndEstablishment}
        similarOffersLoading={this.props.similarOfferLoading}
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

  openWellhubProductSelectionDrawer = () => {
    this.setState({ isWellhubProductSelectionDrawerOpen: true });
  };

  closeWellhubProductSelectionDrawer = () => {
    this.setState({ isWellhubProductSelectionDrawerOpen: false });
  };

  fetchMissingProductOffersSpecificPage = (page: number) => {
    this.props.fetchOffersMissingWellhubProduct({ page });
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
      offerByDayLoading,
      width,
      selectedOffer,
      hybridOfferLinkedToSelectedOffer,
    } = this.props;

    const showCancelledOffers =
      this.props.offerFilters.available === undefined
        ? this.props.theme.show_cancelled_offers_manager
        : !this.props.offerFilters.available;

    const events_ = getDayOffers(events, showCancelledOffers);

    return (
      <ObjectLevelPermissionProvider
        requiredPermission={[
          'session.activity.allowed_actions.delete',
          'session.workshop.allowed_actions.delete',
          'session.activity.allowed_actions.create',
          'session.workshop.allowed_actions.create',
          'planning.calendar.allowed_actions.readWeeklyOverview',
        ]}
      >
        {([
          hasDeleteActivityPermission,
          hasDeleteWorkshopPermission,
          hasCreateActivityPermission,
          hasCreateWorkshopPermission,
          hasReadWeeklyOverviewPermission,
        ]: boolean[]) => {
          const massDisableOptions = {};
          if (hasCreateActivityPermission && !hasCreateWorkshopPermission) {
            massDisableOptions.is_workshop = false;
          }
          if (hasCreateWorkshopPermission && !hasCreateActivityPermission) {
            massDisableOptions.is_workshop = true;
          }

          return (
            <div className={classes.container}>
              <OfferSearchBar
                activitiesLoading={this.props.activitiesLoading}
                allEstablishments={this.props.allEstablishments}
                coaches={this.props.coaches}
                coachesLoading={this.props.coachesLoading}
                coachesSelectedInRole={this.props.coachesSelectedInRole}
                establishmentGroupList={this.props.establishmentGroupList}
                establishmentsLoading={this.props.establishmentsLoading}
                filterVerification={this.props.filterVerification}
                metaActivities={this.props.metaActivities}
                offerFilters={this.props.offerFilters}
                selectRollCallFilter={this.selectRollCallFilter}
                selectSubTeacherRequestFilter={
                  this.selectSubTeacherRequestFilter
                }
                setCalendarFilter={this.setCalendarFilter}
                showSubTeacherFilter={this.getShowSubTeacherFilter()}
                theme={this.props.theme}
              />
              {hasUpsell(this.props.featureList, UPSELL_IDENTIFIER_WELLHUB) && (
                <WellhubProductAlert
                  onActionClick={this.openWellhubProductSelectionDrawer}
                  total={
                    this.props.offersMissingWellhubProductPaginatedData
                      .total_count
                  }
                />
              )}
              <Grid container className={classes.innerContainer} spacing={3}>
                {isWidthDown('md', width) && selectedOffer
                  ? this.renderGoBackButton()
                  : null}
                {isWidthUp('lg', width) || !selectedOffer ? (
                  <Grid item className={classes.panel} lg={6} xs={12}>
                    <CheckPermission requiredPermissions="navigation,calendar">
                      <Button
                        color="primary"
                        onClick={this.props.pushToSchedule}
                        style={{ width: '100%', margin: 8 }}
                        variant="contained"
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
                      <Calendar
                        showDayName
                        date={this.props.date}
                        events={events_}
                        filters={this.props.offerFilters}
                        onDateChange={this.loadDayData}
                        onDownload={this.onDownload}
                        onRequestMassDisable={
                          (hasDeleteActivityPermission ||
                            hasDeleteWorkshopPermission) &&
                          this.props.setMassDisablerStartDate
                        }
                        setShowCancelledOffers={
                          this.props.setShowCancelledOffers
                        }
                        showCancelledOffers={showCancelledOffers}
                      />

                      <TimeTable
                        displayCoachInfoOnHover
                        showTags
                        virtualized
                        className={classes.offerList}
                        companyTheme={this.props.theme}
                        getHasPendingReplacementRequest={
                          this.props.getHasPendingReplacementRequest
                        }
                        isRollCallMandatory={
                          this.props.theme.is_roll_call_mandatory
                        }
                        loading={offerByDayLoading}
                        offers={offers}
                        onModifyTags={this.onModifyTags}
                        onOfferSelected={this.selectOffer}
                        openConfirmationRollCallDialog={
                          this.openConfirmationRollCallDialog
                        }
                        openRollCallDrawer={this.openRollCallDrawer}
                        selected={selectedOffer ? selectedOffer.id : null}
                      />
                    </Paper>
                    {(hasCreateActivityPermission ||
                      hasCreateWorkshopPermission) &&
                      this.renderAddOffersButton()}
                  </Grid>
                ) : (
                  <Typography />
                )}
                {selectedOffer ? (
                  <Grid item lg={6} xs={12}>
                    <div>
                      <OfferCard
                        bookings={this.props.bookings}
                        bookingsLoading={
                          this.props.bookingsLoading || !this.props.bookings
                        }
                        companyId={this.props.companyId}
                        companyTheme={this.props.theme}
                        goToOfferManagement={this.props.goToOfferManagement}
                        linkedHybridSession={hybridOfferLinkedToSelectedOffer}
                        members={this.props.members}
                        membersLoading={
                          this.props.membersLoading || !this.props.members
                        }
                        offer={selectedOffer}
                        onDeleteButtonClick={this.openDeleteModal}
                        onEditButtonClick={this.openEditModal}
                        onModifyTags={this.onModifyTags}
                        onRefreshOffers={this.fetchOffersOfSelectedDate}
                        onRestoreButtonClick={this.openRestoreModal}
                        showOfferGender={
                          this.props.theme &&
                          this.props.theme.show_booked_gender_offer
                        }
                        snackbarSuccess={this.props.snackbarSuccess}
                      />
                    </div>
                  </Grid>
                ) : (
                  hasReadWeeklyOverviewPermission && (
                    <Grid item lg={6} xs={12}>
                      <BookingStatisticsCard
                        bookingStatistics={this.props.bookingStatistics}
                        loading={
                          this.props.createdBookingStatsLoading ||
                          this.props.cancelledBookingStatsLoading ||
                          offerByDayLoading
                        }
                      />
                    </Grid>
                  )
                )}
                <Dialog
                  aria-describedby="alert-dialog-description"
                  aria-labelledby="alert-dialog-title"
                  onClose={() => this.props.setOpenDeleteDialog(false)}
                  open={this.props.openDeleteDialog}
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
                      color="primary"
                      onClick={() => this.props.setOpenDeleteDialog(false)}
                    >
                      {this.props.t('offer:close')}
                    </Button>
                  </DialogActions>
                </Dialog>
                {this.renderEditModal(
                  hasCreateActivityPermission,
                  hasCreateWorkshopPermission,
                )}
                {this.renderDeleteModal()}
                {this.renderCreateModal(
                  hasCreateActivityPermission,
                  hasCreateWorkshopPermission,
                )}
                {this.renderRestoreModal()}
                {this.renderRollCallDrawer()}
                {this.renderConfirmationRollCallDialog()}
                {this.renderWellhubProductSelectionDrawer()}
                {!!this.props.massDisablerStartDate && (
                  <MassDisablerDialog
                    isWorkshop={massDisableOptions.is_workshop}
                    massDisabledOfferInGroup={
                      this.props.massDisabledOfferInGroup
                    }
                    numberOfMassDisabledOffer={
                      this.props.numberOfMassDisabledOffer
                    }
                    numberOfMassDisabledOfferLoading={
                      this.props.numberOfMassDisabledOfferLoading
                    }
                    onClose={() => this.props.setMassDisablerStartDate(null)}
                    onSubmit={(params) =>
                      this.props.disableMassOffers(
                        params,
                        {
                          ...this.props.offerFilters,
                          ...massDisableOptions,
                        },
                        {
                          onSuccess: () => {
                            this.fetchData();
                          },
                        },
                      )
                    }
                    retrieveNumberOfDeletedOffer={({ start, end }) => {
                      this.props.retrieveNumberOfMassDisabledOffer({
                        start,
                        end,
                        options: {
                          ...massDisableOptions,
                          // Since the grouped cancelation takes the calendar filters into account, we also pass them here.
                          ...omit(
                            this.props.offerFilters || {},
                            omit_list(this.props.offerFilters, true),
                          ),
                        },
                      });
                      this.props.retrieveNumberOfMassDisabledOfferInGroup({
                        start,
                        end,
                        options: {
                          ...massDisableOptions,
                          // Since the grouped cancelation takes the calendar filters into account, we also pass them here.
                          ...omit(
                            this.props.offerFilters || {},
                            omit_list(this.props.offerFilters, true),
                          ),
                        },
                      });
                    }}
                    startDate={this.props.massDisablerStartDate}
                  />
                )}
              </Grid>
            </div>
          );
        }}
      </ObjectLevelPermissionProvider>
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
      similarOffersWithCoachAndEstablishment: withEstablishment(
        withCoach(getSimilarsOffers),
      )(state),
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
        DateTime.fromISO(date)
          .startOf('week', { useLocaleWeeks: true })
          .toISO(),
        DateTime.fromISO(date).endOf('week', { useLocaleWeeks: true }).toISO(),
      ),
      roomBlueprints: getAvailableRoomBlueprints(state),
      allRoomBlueprints: getRoomBlueprints(state),
      coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
      showPartnership: state.theme.theme.has_partnership,
      allTagsWithTagGroup: getAllTagsWithTagGroup(state),
      activeCustomLevels: getActiveCustomLevels(state),
      allCustomLevels: getAllCustomLevels(state),
      deletingOffer: state.offer.delete.loading || state.offer.disable.loa,
      zoomAppDetail: zoomAppSelectors.getZoomApp(state),
      replacementRequestManagerFilter:
        state.userPreference.replacementRequestManagerFilter,
      rollCallLoading: state.offer.rollCall.loading,
      featureList: state.company.feature.data,

      offersMissingWellhubProductLoading:
        getOffersMissingWellhubProductLoading(state),
      offersMissingWellhubProductPaginatedData:
        getOffersMissingWellhubProductPaginatedData(state),
    }),
    {
      goBack: goBackRouter,
      pushToSchedule: () => pushRouter('/schedule'),
      snackbarSuccess,
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
      fetchOffersWaitingListStatistics: fetchOffersWaitingListStatisticsAction,
      fetchOffersMissingWellhubProduct: fetchOffersMissingWellhubProductAction,
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
          min_date: DateTime.fromISO(date)
            .startOf('month')
            .startOf('week', { useLocaleWeeks: true })
            .toISODate(),
          max_date: DateTime.fromISO(date)
            .endOf('month')
            .endOf('week', { useLocaleWeeks: true })
            .toISODate(),
          ...omit(offerFilters || {}, omit_list(offerFilters, true)),
        });
        if (theme && theme.show_booked_gender_offer) {
          fetchBookedGender({
            min_date: DateTime.fromISO(date)
              .startOf('month')
              .startOf('week', { useLocaleWeeks: true })
              .toISODate(),
            max_date: DateTime.fromISO(date)
              .endOf('month')
              .endOf('week', { useLocaleWeeks: true })
              .toISODate(),
            ...omit(offerFilters || {}, omit_list(offerFilters, true)),
          });
        }
      },
    fetchBookingStatsOfTheWeek:
      ({
        date,
        fetchBookingStatistics,
        offerFilters,
        fetchOffersWaitingListStatistics,
      }) =>
      () => {
        fetchBookingStatistics('createdBookings', {
          min_date: DateTime.fromISO(date)
            .startOf('week', { useLocaleWeeks: true })
            .toISODate(),
          max_date: DateTime.fromISO(date)
            .endOf('week', { useLocaleWeeks: true })
            .toISODate(),
          ...omit(offerFilters || {}, omit_list(offerFilters, true)),
          date_field: 'offer__date_start',
          kind: 'count',
        });
        fetchBookingStatistics('cancelledBookings', {
          min_date: DateTime.fromISO(date)
            .startOf('week', { useLocaleWeeks: true })
            .toISODate(),
          max_date: DateTime.fromISO(date)
            .endOf('week', { useLocaleWeeks: true })
            .toISODate(),
          booking_status_code__in: [
            BOOKING_STATUS_CANCELLED_BY_CONSUMER.id,
            BOOKING_STATUS_CANCELLED_BY_MANAGER.id,
            BOOKING_STATUS_CANCELLED_BY_OFFER.id,
          ],
          ...omit(offerFilters || {}, omit_list(offerFilters, true)),
          date_field: 'offer__date_start',
          kind: 'count',
        });
        fetchOffersWaitingListStatistics('waitingLists', {
          min_date: DateTime.fromISO(date)
            .startOf('week', { useLocaleWeeks: true })
            .toISODate(),
          max_date: DateTime.fromISO(date)
            .endOf('week', { useLocaleWeeks: true })
            .toISODate(),
          date_field: 'offer__date_start',
          kind: 'count',
          ...omit(offerFilters || {}, omit_list(offerFilters, true)),
          active: true,
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
