// @flow
import React from 'react';

import { connect } from 'react-redux';
import { compose, withStateHandlers, withHandlers, withState } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';

import Fade from '@material-ui/core/Fade';
import { withTranslation, TFunction } from 'react-i18next';
import { Link } from 'react-router-dom';
import Popover from '@material-ui/core/Popover';
import { push } from 'connected-react-router';
import DeleteIcon from '@material-ui/icons/Delete';
import { PAYMENT_INTENT_TYPE_INVOICE } from '@bsport/common/lib/master-data/payment-group';
import DeleteOfferForm from '../../offer/DeleteOfferForm.component';
import {
  getAvailableRoomBlueprints,
  getRoomBlueprints,
} from '../../spot-scheduling/selector';
import { getEnabledMetaActivities } from '../../meta-activity/selectors';
import OfferEditForm from '../../offer/OfferEditForm.component';
import RedButton from '../../../components/button/RedButton.component';
import { fetchRoomBlueprints } from '../../spot-scheduling/actions';
import type { RoomBlueprint } from '../../spot-scheduling/types';
import PrivateBookingDisableDialog from '../components/booking/PrivateBookingDisableDialog.component';
import PrivateBookingUpdateCoachDialog from '../components/booking/PrivateBookingUpdateCoachDialog.component';
import CustomEventCard from '../components/custom-event/CustomEventCard.component';
import {
  getPrivateBooking,
  withRelatedFields,
  composeBookingsWithMemberProgram,
} from '../selectors/private-booking';
import {
  fetchPrivateBooking as fetchPrivateBookingAction,
  fetchPrivateSlot as fetchPrivateSlotAction,
  fetchPrivateService as fetchPrivateServiceAction,
  disablePrivateBooking as disablePrivateBookingAction,
  deletePrivateBooking as deletePrivateBookingAction,
  restorePrivateBooking as restorePrivateBookingAction,
  updatePrivateBookingDatetime as updatePrivateBookingDatetimeAction,
  updatePrivateBookingCoach as updatePrivateBookingCoachAction,
  deleteCustomEvent as deleteCustomEventAction,
} from '../actions';
import {
  fetchMetaActivityBulk as fetchMetaActivityBulkAction,
  fetchAllActivities,
} from '../../meta-activity/actions';
import {
  fetchCoachBulk as fetchCoachBulkAction,
  fetchAssociatedCoachesList as fetchAssociatedCoachesListAction,
} from '../../associated-coach/actions';
import {
  fetchEstablishments as fetchEstablishmentsAction,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '../../establishment/actions';
import {
  fetchMemberBulk as fetchMemberBulkAction,
  fetchMember,
} from '../../member/actions';

import { getActiveCoaches } from '../../associated-coach/selectors';
import { getAllEstablishments } from '../../establishment/selectors';

import PrivateBookingCard from '../components/booking/PrivateBookingCard.component';
import {
  retrieveOfferAsManager as retrieveOfferAsManagerAction,
  fetchSimilarOffers as fetchSimilarOffersAction,
} from '../../offer/actions';

import OfferMinimalSummary from '../../../components/offer/OfferMinimalSummary.component';

import {
  getOfferById,
  withMetaActivity,
  withCoach,
  getSimilars as getSimilarsOffers,
  withEstablishment,
} from '../../offer/selectors';
import { withAssociatedCoach, getCustomEvent } from '../selectors/custom-event';

import {
  editLiveOffer as editLiveOfferAPI,
  disableOffer as disableOfferAPI,
  deleteOffer as deleteOfferAPI,
} from '../../offer/api';
import CheckPermission from '../../role/components/CheckPermission.component';
import { fetchAllCoachPaymentRules } from '../../coach-payment-rules/actions';
import { CoachPaymentRuleByKindSelector } from '../../coach-payment-rules/selectors';
import type { CoachPaymentRule } from '../../coach-payment-rules/types';
import { showVaccinationStatus } from '../../custom-form/selectors';
import { withInvoiceItem, getInvoiceList } from '#libs/invoice/selectors';
import { fetchInvoiceList as fetchInvoiceListAction } from '#libs/invoice/actions';
import { snackbarSuccess } from '#libs/snackbar/actions';
import { fetchPaymentMethodList } from '#libs/payment/actions';
import type { Theme as CompanyTheme } from '#libs/theme/types';
import type { OptionCallback } from '../../../state/types';
import type { Invoice } from '#libs/invoice/types';
import type { PaymentMethod } from '#libs/payment/types';
import { requestClientSecret as requestClientSecretAPI } from '#libs/invoice/api';
import { getProgramList } from '#libs/performance-tracking/selector';
import {
  updateMemberMetricValue as updateMemberMetricValueAction,
  createMemberProgram as createMemberProgramAction,
  fetchMetric as fetchMetricAction,
} from '#libs/performance-tracking/actions';

type Props = {
  offerId: number,
  privateBookingId: ?number,
  fetchOfferById: (id: number) => void,
  fetchPrivateBookingById: (number) => void,
  openOfferEditModal: ?Offer,
  t: TFunction,
  classes: Object,
  privateBooking: ?PrivateBooking,
  offer: Offer,
  selectedPrivateBooking: ?PrivateBooking,
  isUpdateCoachFormOpen: boolean,
  setIsUpdateCoachFormOpen: (boolean) => void,
  fetchRoomBlueprints: () => void,

  fetchSimilarOffers: (offerId: number) => void,
  similarOfferLoading: boolean,
  similarOffers: Array<Offer>,

  coaches: Array<Coach>,
  establishments: Array<Establishment>,

  openDisablePrivateBookingModal: () => void,
  openOfferDeleteModal: boolean,

  refreshOffers: () => void,
  closeOfferEditModal: () => void,
  closeOfferDeleteModal: () => void,
  onClose: () => void,
  offerDeleteModalOpen: boolean,
  popoverAnchor: ?HTMLElement,
  privateBookingDeleteModalOpen: boolean,

  setOfferProcessing: (boolean) => void,
  offerProcessing: boolean,
  offerEditModalOpen: boolean,
  offerEditLoading: boolean,

  disableOrDeletePrivateBooking: (
    privateBookingId: number,
    force_refund: boolean,
    send_mail: boolean,
    options: OptionCallback,
  ) => void,
  refreshPrivateBookings: () => void,
  restorePrivateBooking: (id: number) => void,
  closeDisablePrivateBookingModal: () => void,

  theme: ?CompanyTheme,
  goToMember: (id: number) => void,
  privateBookingLoading: boolean,

  openDisablePrivateBookingModal: () => void,
  updatePrivateBookingDatetime: (date: string, options: OptionCallback) => void,
  updatePrivateBookingCoachHandler: (updatedCoachId: number) => void,
  goToCoachCalendar: () => void,
  fetchAllActivities: () => void,
  metaActivities: Array<MetaActivity>,

  customEvent: ?CustomEvent,
  deleteCustomEvent: (number) => void,
  roomBlueprints: RoomBlueprint[],
  allRoomBlueprints: RoomBlueprint[],
  fetchRoomBlueprints: () => void,
  fetchAllCoachPaymentRules: () => void,
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> },
  showVaccinationStatus: boolean,
  fetchMember: (memberId: number) => void,
  fetchInvoiceListUnpaid: (memberId: number) => void,
  unpaidInvoiceList: Array<Invoice>,
  goToInvoice: (uuid: string) => void,
  payment_method_available_manager: Array<PaymentMethod>,
  snackbarSuccess: (msg: string) => void,
  companyId: number,
  fetchMemberPaymentMethod: (memberId: number) => void,
  invoiceToBill: Invoice,
  setInvoiceToBill: (invoice: ?Invoice) => void,
  updateMemberMetricValue: (data: any, options: OptionCallback) => void,
  createMemberProgram: (data: any, options?: any) => void,
  programList: Array<PerformanceTrackingProgram>,
};
type State = {
  clientSecretLoading: boolean,
  clientSecret: ?string,
  paymentGroupId: ?number,
  paymentGroupPriceCts: ?number,
};

export class CalendarEventDetail extends React.Component<Props, State> {
  state = {
    clientSecretLoading: false,
    clientSecret: null,
    paymentGroupId: null,
    paymentGroupPriceCts: null,
  };

  componentDidMount() {
    this.props.fetchAllActivities();
    this.props.fetchRoomBlueprints();
    this.props.fetchAllCoachPaymentRules();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.offerId && this.props.offerId !== prevProps.offerId) {
      this.props.fetchOfferById(this.props.offerId);
    }
    if (
      this.props.privateBookingId &&
      this.props.privateBookingId !== prevProps.privateBookingId
    ) {
      this.props.fetchPrivateBookingById(this.props.privateBookingId);
    }
    if (prevProps.privateBooking && !this.props.privateBooking) {
      this.props.setIsUpdateCoachFormOpen(false);
      // close update form dialog when clicked outside
    }
  }

  fetchInvoiceListUnpaid = (id: number) => {
    this.props.fetchInvoiceListUnpaid(id);
    this.props.fetchMember(id);
  };

  requestClientSecret = (paymentEngine) => {
    this.setState({ clientSecretLoading: true });
    requestClientSecretAPI(paymentEngine, PAYMENT_INTENT_TYPE_INVOICE, {
      invoice: this.props.invoiceToBill.uuid,
    })
      .then((r) => {
        this.setState({
          clientSecret: r.data.client_secret,
          clientSecretLoading: false,
          paymentGroupId: r.data.payment_group,
          paymentGroupPriceCts: r.data.price_cts,
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ clientSecretLoading: false });
      });
  };

  renderContent = () => {
    const { t, classes, goToMember, offer, privateBooking, customEvent } =
      this.props;
    if (
      (this.props.selectedPrivateBooking && !this.props.privateBooking) ||
      (this.props.offerId && !offer)
    ) {
      return (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      );
    }
    if (privateBooking) {
      return this.props.isUpdateCoachFormOpen ? (
        <PrivateBookingUpdateCoachDialog
          privateBooking={privateBooking}
          coaches={this.props.coaches}
          updatePrivateBookingCoach={
            this.props.updatePrivateBookingCoachHandler
          }
          setIsUpdateCoachFormOpen={this.props.setIsUpdateCoachFormOpen}
        />
      ) : (
        <PrivateBookingCard
          updateMemberMetricValue={this.props.updateMemberMetricValue}
          createMemberProgram={this.props.createMemberProgram}
          programList={this.props.programList}
          onRestore={() => this.props.restorePrivateBooking(privateBooking.id)}
          onDelete={this.props.openDisablePrivateBookingModal}
          private_booking={privateBooking}
          goToMember={goToMember}
          loading={this.props.privateBookingLoading}
          updateTime={this.props.updatePrivateBookingDatetime}
          goToCoachCalendar={this.props.goToCoachCalendar}
          setIsUpdateCoachFormOpen={this.props.setIsUpdateCoachFormOpen}
          showVaccinationStatus={this.props.showVaccinationStatus}
          unpaidInvoiceList={this.props.unpaidInvoiceList}
          goToInvoice={this.props.goToInvoice}
          fetchInvoiceListUnpaid={this.fetchInvoiceListUnpaid}
          availablePaymentMethodList={
            this.props.payment_method_available_manager
          }
          snackbarSuccess={this.props.snackbarSuccess}
          companyId={this.props.companyId}
          fetchMemberPaymentMethod={this.props.fetchMemberPaymentMethod}
          fetchMember={this.props.fetchMember}
          invoiceToBill={this.props.invoiceToBill}
          setInvoiceToBill={this.props.setInvoiceToBill}
          clientSecretLoading={this.state.clientSecretLoading}
          clientSecret={this.state.clientSecret}
          paymentGroupId={this.state.paymentGroupId}
          paymentGroupPriceCts={this.state.paymentGroupPriceCts}
          requestClientSecret={this.requestClientSecret}
        />
      );
    }
    if (customEvent) {
      return (
        <CustomEventCard
          customEvent={customEvent}
          onDelete={() => this.props.deleteCustomEvent(customEvent.id)}
        />
      );
    }
    if (offer) {
      return (
        <div>
          <OfferMinimalSummary offer={offer} />
          {offer.available ? (
            <div className={classes.buttonRow}>
              <CheckPermission requiredPermissions="offer.edit">
                <Button color="primary" onClick={this.props.openOfferEditModal}>
                  <EditIcon className={classes.iconLeft} />
                  <Hidden xsDown>{t('calendar.modifyOffer')}</Hidden>
                </Button>
              </CheckPermission>
              <CheckPermission requiredPermissions="offer.delete">
                <RedButton onClick={this.props.openOfferDeleteModal}>
                  <DeleteIcon className={classes.iconLeft} />
                  <Hidden xsDown>{t('calendar.deleteOffer')}</Hidden>
                </RedButton>
              </CheckPermission>
            </div>
          ) : null}
          <Link style={{ textDecoration: 'none' }} to={`/offer/${offer.id}`}>
            <Button
              color="primary"
              variant="contained"
              className={classes.manageButton}
            >
              {t('manageOffer')}
            </Button>
          </Link>
          {/* {offer.available ? null : (
            <RedButton
              onClick={this.props.openOfferDeleteModal}
              variant="contained"
              className={classes.manageButton}
            >
              {t('forms.delete.buttonHardDelete')}
            </RedButton>
          )} */}
        </div>
      );
    }
    return null;
  };

  updateOffer = async (data) => {
    this.props.setOfferProcessing(true);
    try {
      await editLiveOfferAPI(data);
      this.props.refreshOffers();
      this.props.closeOfferEditModal();
      this.props.onClose();
    } catch (err) {
      console.error(err);
    }
    this.props.setOfferProcessing(false);
  };

  onCancelOffer = async (data: {
    offerId: number,
    cashback: ?boolean,
    notify: ?boolean,
    deleteAll: ?boolean,
  }) => {
    this.props.setOfferProcessing(true);
    try {
      await disableOfferAPI(data);
      this.props.refreshOffers();
      this.props.closeOfferDeleteModal();
      this.props.onClose();
    } catch (err) {
      console.error(err);
      throw err;
    }
    this.props.setOfferProcessing(false);
  };

  onHardDeleteOffer = async (data: any) => {
    this.props.setOfferProcessing(true);
    try {
      await deleteOfferAPI(this.props.offer.id, data);
      this.props.closeOfferDeleteModal();
      this.props.refreshOffers();
      this.props.closeOfferDeleteModal();
      this.props.onClose();
    } catch (err) {
      console.error(err);
    }
    this.props.setOfferProcessing(false);
  };

  render() {
    const { offer } = this.props;
    return (
      <div>
        <Popover
          open={!!this.props.popoverAnchor}
          TransitionComponent={Fade}
          onClose={this.props.onClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
        >
          {this.renderContent()}
        </Popover>
        {offer ? (
          <Dialog
            onClose={this.props.closeOfferDeleteModal}
            open={this.props.offerDeleteModalOpen}
          >
            <DialogContent>
              <DeleteOfferForm
                offer={offer}
                offerWasCancelled={!offer.available}
                onCancelOffer={({ cashback, notify, deleteAll }) =>
                  this.onCancelOffer({
                    offerId: offer.id,
                    cashback,
                    notify,
                    deleteAll,
                  })
                }
                onHardDelete={this.onHardDeleteOffer}
                onCancel={this.props.closeOfferDeleteModal}
                processing={this.props.offerProcessing}
                fetchSimilarOffers={() =>
                  this.props.fetchSimilarOffers(this.props.offer.id)
                }
                similarOffers={this.props.similarOffers}
                similarOfferLoading={this.props.similarOfferLoading}
              />
            </DialogContent>
          </Dialog>
        ) : null}
        {this.props.privateBooking &&
        this.props.privateBookingDeleteModalOpen ? (
          <PrivateBookingDisableDialog
            open={this.props.privateBookingDeleteModalOpen}
            private_booking={this.props.privateBooking}
            onSubmit={(force_refund, send_mail) =>
              this.props.disableOrDeletePrivateBooking(
                this.props.privateBooking,
                force_refund,
                send_mail,
                {
                  onSuccess: () => {
                    this.props.onClose();
                    this.props.refreshPrivateBookings();
                  },
                },
              )
            }
            onClose={this.props.closeDisablePrivateBookingModal}
          />
        ) : null}
        {offer && offer.establishment && offer.coach ? (
          <Dialog open={this.props.offerEditModalOpen}>
            <DialogContent>
              {this.props.offerEditLoading ? (
                <CircularProgress />
              ) : (
                <OfferEditForm
                  offer={offer}
                  coaches={this.props.coaches}
                  establishments={this.props.establishments}
                  roomBlueprints={this.props.roomBlueprints}
                  allRoomBlueprints={this.props.allRoomBlueprints}
                  metaActivities={this.props.metaActivities}
                  is_whereby_integration_enabled={
                    this.props.theme &&
                    this.props.theme.is_whereby_integration_enabled &&
                    this.props.theme.is_whereby_integration_allowed
                  }
                  onConfirm={this.updateOffer}
                  onCancel={this.props.closeOfferEditModal}
                  processing={this.props.offerProcessing}
                  fetchSimilarOffers={() =>
                    this.props.fetchSimilarOffers(this.props.offer.id)
                  }
                  similarOffers={this.props.similarOffers}
                  similarOfferLoading={this.props.similarOfferLoading}
                  coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
                />
              )}
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  loadingContainer: {
    minWidth: 400,
    padding: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  manageButton: {
    width: '100%',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  link: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
  linkTypo: {
    marginLeft: theme.spacing(2),
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
});

const OfferEditorContainer = compose(
  connect(
    (state) => ({
      similarOfferLoading:
        state.offer.similarOffers.loading ||
        state.metaActivity.loading ||
        state.establishment.loading,
      offerEditLoading: state.establishment.loading || state.coach.loading,
      similarOffers: getSimilarsOffers(state),
      coaches: getActiveCoaches(state),
      establishments: getAllEstablishments(state),
      metaActivities: getEnabledMetaActivities(state),
      roomBlueprints: getRoomBlueprints(state),
      coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
      showVaccinationStatus: showVaccinationStatus(state),
    }),
    {
      fetchSimilarOffers: fetchSimilarOffersAction,
      fetchEstablishments: fetchEstablishmentsAction,
      fetchAssociatedCoachesList: fetchAssociatedCoachesListAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      fetchCoachBulk: fetchCoachBulkAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      fetchRoomBlueprints,
      fetchAllCoachPaymentRules,
    },
  ),
  withHandlers({
    fetchSimilarOffers:
      ({
        fetchEstablishmentBulk,
        fetchMetaActivityBulk,
        fetchCoachBulk,
        fetchSimilarOffers,
      }) =>
      (id) => {
        fetchSimilarOffers(
          id,
          {},
          {
            onSuccess: (oList) => {
              fetchCoachBulk(oList.map((o) => o.coach));
              fetchEstablishmentBulk(oList.map((o) => o.establishment));
              fetchMetaActivityBulk(oList.map((o) => o.meta_activity));
            },
          },
        );
      },
  }),

  withStateHandlers(
    {
      offerDeleteModalOpen: false,
      offerEditModalOpen: false,
      offerProcessing: false,
    },
    {
      openOfferEditModal:
        (_, { fetchEstablishments, fetchAssociatedCoachesList }) =>
        () => {
          fetchEstablishments();
          fetchAssociatedCoachesList();
          return {
            offerEditModalOpen: true,
          };
        },
      closeOfferEditModal: () => () => {
        return { offerEditModalOpen: false };
      },
      openOfferDeleteModal: () => () => ({
        offerDeleteModalOpen: true,
      }),
      closeOfferDeleteModal: () => () => ({
        offerDeleteModalOpen: false,
      }),
      setOfferProcessing: () => (offerProcessing) => ({
        offerProcessing,
      }),
    },
  ),
);

const PrivateBookingCancellatorContainer = compose(
  connect(null, {
    disablePrivateBooking: disablePrivateBookingAction,
    deletePrivateBooking: deletePrivateBookingAction,
    restorePrivateBooking: restorePrivateBookingAction,
  }),
  withStateHandlers(
    {
      privateBookingDeleteModalOpen: false,
      privateBookingProcessing: false,
    },
    {
      openDisablePrivateBookingModal: () => () => ({
        privateBookingDeleteModalOpen: true,
      }),
      closeDisablePrivateBookingModal: () => () => ({
        privateBookingDeleteModalOpen: false,
      }),
      setPrivateBookingProcessing: () => (privateBookingProcessing) => ({
        privateBookingProcessing,
      }),
    },
  ),
  withHandlers({
    disableOrDeletePrivateBooking:
      ({
        disablePrivateBooking,
        deletePrivateBooking,
        closeDisablePrivateBookingModal,
        setPrivateBookingProcessing,
      }) =>
      (private_booking, force_refund, send_mail, options) => {
        setPrivateBookingProcessing(true);
        const isDisabled =
          private_booking.booking_status_code !== BOOKING_STATUS_OK.id;
        let action = disablePrivateBooking;
        if (isDisabled) {
          action = deletePrivateBooking;
        }
        action(
          private_booking.id,
          { force_refund, send_mail },
          {
            onSuccess: (...args) => {
              closeDisablePrivateBookingModal();
              setPrivateBookingProcessing(false);
              if (options && options.onSuccess) options.onSuccess(...args);
            },
            onError: (...args) => {
              setPrivateBookingProcessing(false);
              if (options && options.onError) options.onError(...args);
            },
          },
        );
      },
    restorePrivateBooking:
      ({ restorePrivateBooking, onClose }) =>
      (privateBookingId) => {
        restorePrivateBooking(privateBookingId, {
          onSuccess: () => onClose(),
        });
      },
  }),
);

export default compose(
  withStyles(styles),
  withTranslation(['offer']),
  withState('isUpdateCoachFormOpen', 'setIsUpdateCoachFormOpen', false),
  withState('invoiceToBill', 'setInvoiceToBill', null),
  connect(
    (state, { privateBookingId, offerId, customEventId }) => ({
      roomBlueprints: getAvailableRoomBlueprints(state),
      allRoomBlueprints: getRoomBlueprints(state),
      privateBooking: composeBookingsWithMemberProgram(
        withRelatedFields(getPrivateBooking),
      )(state, privateBookingId),
      privateBookingLoading:
        state.privateService.privateBooking.createOrUpdate.loading,
      theme: state.theme.theme,
      offer: withMetaActivity(withCoach(withEstablishment(getOfferById)))(
        state,
        offerId,
      ),
      customEvent: withAssociatedCoach(getCustomEvent)(state, customEventId),
      showVaccinationStatus: showVaccinationStatus(state),
      unpaidInvoiceList: withInvoiceItem(getInvoiceList)(state),
      payment_method_available_manager:
        state.theme.theme.payment_method_available_manager,
      companyId: state.theme.theme.company,
      programList: getProgramList(state),
    }),
    {
      retrieveOfferAsManager: retrieveOfferAsManagerAction,
      fetchPrivateBooking: fetchPrivateBookingAction,
      fetchCoachBulk: fetchCoachBulkAction,
      fetchAllActivities,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      fetchPrivateService: fetchPrivateServiceAction,
      fetchRoomBlueprints,
      fetchPrivateSlot: fetchPrivateSlotAction,
      fetchMemberBulk: fetchMemberBulkAction,
      onOfferClick: (id) => push(`/offer/${id}`),
      goToMember: (memberId) => push(`/member/${memberId}/info`),
      updatePrivateBookingDatetime: updatePrivateBookingDatetimeAction,
      updatePrivateBookingCoach: updatePrivateBookingCoachAction,
      deleteCustomEvent: deleteCustomEventAction,
      goToCoachCalendar: (coachId) =>
        push(`/coach/${coachId}/private-calendar`),
      // Invoices Stuff
      goToInvoice: (uuid: number) => push(`/invoice/${uuid}/`),
      fetchMember,
      fetchInvoiceList: fetchInvoiceListAction,
      snackbarSuccess,
      fetchPaymentMethodListAction: fetchPaymentMethodList,
      fetchMetric: fetchMetricAction,
      updateMemberMetricValue: updateMemberMetricValueAction,
      createMemberProgram: createMemberProgramAction,
    },
  ),
  withHandlers({
    createMemberProgram:
      ({ programList, createMemberProgram, fetchMetric }) =>
      (data) => {
        createMemberProgram(data, {
          onSuccess: (memberProgram) => {
            const program = programList.find(
              (p) => p.id === memberProgram.program,
            );
            fetchMetric({ id__in: program.metric_list });
          },
        });
      },
    updatePrivateBookingDatetime:
      ({
        updatePrivateBookingDatetime,
        privateBookingId,
        fetchAvailabilitySlots,
        onClose,
      }) =>
      (date, options) => {
        updatePrivateBookingDatetime(privateBookingId, date, {
          onSuccess: (b) => {
            if (options && options.onSuccess) {
              options.onSuccess(b);
            }
            if (fetchAvailabilitySlots) {
              fetchAvailabilitySlots();
            }
            onClose();
          },
          onError: options && options.onError,
        });
      },
    updatePrivateBookingCoachHandler:
      ({
        updatePrivateBookingCoach,
        privateBookingId,
        setIsUpdateCoachFormOpen,
        fetchAvailabilitySlots,
      }) =>
      (updatedCoachId, options) => {
        updatePrivateBookingCoach(privateBookingId, updatedCoachId, {
          onError: options && options.onError,
          onSuccess: () => {
            if (fetchAvailabilitySlots) {
              fetchAvailabilitySlots();
            }
            if (options && options.onSuccess) options.onSuccess();
          },
        });
        setIsUpdateCoachFormOpen(false);
      },
    deleteCustomEvent:
      ({ deleteCustomEvent, fetchAvailabilitySlots, onClose }) =>
      (id) => {
        deleteCustomEvent(id, {
          onSuccess: () => {
            if (fetchAvailabilitySlots) {
              fetchAvailabilitySlots();
            }
            onClose();
          },
        });
      },
    fetchPrivateBookingById:
      ({
        fetchCoachBulk,
        fetchEstablishmentBulk,
        fetchPrivateService,
        fetchPrivateSlot,
        fetchPrivateBooking,
        fetchMemberBulk,
      }) =>
      (id) => {
        fetchPrivateBooking(id, {
          onSuccess: ([booking]) => {
            if (booking.coach) fetchCoachBulk([booking.coach]);
            if (booking.establishment) {
              fetchEstablishmentBulk([booking.establishment]);
            }
            fetchPrivateSlot(booking.private_service, booking.private_slot);
            fetchPrivateService(booking.private_service);
            fetchMemberBulk({ id__in: [booking.member] });
          },
        });
      },
    fetchOfferById:
      ({ fetchCoachBulk, fetchEstablishmentBulk, retrieveOfferAsManager }) =>
      (id) => {
        retrieveOfferAsManager(id, {
          onSuccess: (offer) => {
            fetchCoachBulk([offer.coach]);
            fetchEstablishmentBulk([offer.establishment]);
          },
        });
      },
    fetchInvoiceListUnpaid:
      ({ fetchInvoiceList }) =>
      (id) => {
        fetchInvoiceList({
          is_v2: true,
          is_draft: false,
          unpaid: true,
          member: id,
        });
      },
    fetchMemberPaymentMethod:
      ({ fetchPaymentMethodListAction }) =>
      (id) => {
        fetchPaymentMethodListAction({ member: id });
      },
  }),
  OfferEditorContainer,
  PrivateBookingCancellatorContainer,
)(CalendarEventDetail);
