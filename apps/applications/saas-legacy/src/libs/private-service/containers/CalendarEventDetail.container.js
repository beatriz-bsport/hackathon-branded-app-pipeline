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
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code.js';
import isEqual from 'lodash/isEqual';

import Fade from '@material-ui/core/Fade';
import { withTranslation, TFunction } from 'react-i18next';
import { Link } from 'react-router-dom';
import Popover from '@material-ui/core/Popover';
import { push } from 'connected-react-router';
import DeleteIcon from '@material-ui/icons/Delete';
import { PAYMENT_INTENT_TYPE_INVOICE } from '@bsport/common/lib/master-data/payment-group.js';
import uniq from 'lodash/uniq';
import {
  retrieveOfferAsManager as retrieveOfferAsManagerAction,
  fetchSimilarOffers as fetchSimilarOffersAction,
  editOffers as editOffersActions,
} from '#src/libs/offer/actions';
import { fetchCompanyUserRoles } from '#src/libs/role/actions';
import zoomAppSelectors from '#src/libs/zoom-app/selectors';
import { fetchZoomApp as fetchZoomAppAction } from '#src/libs/zoom-app/actions';
import {
  getActiveCoaches,
  getCoachesSelectedInRole,
} from '#src/libs/associated-coach/selectors';
import { Coach } from '#src/libs/associated-coach/types';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { withInvoiceItem, getInvoiceList } from '#src/libs/invoice/selectors';
import {
  fetchInvoiceList as fetchInvoiceListAction,
  applyGiftcardOnInvoice as applyGiftcardOnInvoiceAction,
} from '#src/libs/invoice/actions';
import { snackbarSuccess } from '#src/libs/snackbar/actions';
import { fetchPaymentMethodList } from '#src/libs/payment/actions';
import type { Theme as CompanyTheme } from '#src/libs/theme/types';
import type { Invoice } from '#src/libs/invoice/types';
import type { PaymentMethod } from '#src/libs/payment/types';
import { getDeletePermission, getEditPermission } from '#src/libs/offer/utils';
import { requestClientSecret as requestClientSecretAPI } from '#src/libs/invoice/api';
import { getProgramList } from '#src/libs/performance-tracking/selector';
import {
  updateMemberMetricValue as updateMemberMetricValueAction,
  createMemberProgram as createMemberProgramAction,
  fetchMetric as fetchMetricAction,
  fetchProgram as fetchProgramAction,
  fetchMemberProgram as fetchMemberProgramAction,
} from '#src/libs/performance-tracking/actions';
import {
  getConsumerGiftcardReceivedList,
  withGiftcard,
  withSender,
  withReceiver,
  onlyUsable,
} from '#src/libs/giftcard/selectors';
import {
  fetchGiftcardBulk as fetchGiftcardBulkAction,
  fetchConsumerGiftcardReceivedList as fetchConsumerGiftcardReceivedListAction,
} from '#src/libs/giftcard/actions';
import {
  fetchLevelList as fetchLevelListAction,
  updateLevel as updateLevelAction,
  createLevel as createLevelAction,
  deleteLevel as deleteLevelAction,
} from '#src/libs/level/actions';
import {
  getActiveCustomLevels,
  getAllCustomLevels,
  withCustomLevel,
} from '#src/libs/level/selectors';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import type { Tag, TagGroup } from '#src/libs/tag/types';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
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
import PrivateBookingSetUnpaidConfirmDialog from '../components/booking/PrivateBookingSetUnpaidConfirmDialog.component';
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
  updatePrivateBooking as updatePrivateBookingAction,
  setPrivateBookingUnpaid as setPrivateBookingUnpaidAction,
} from '../actions';
import {
  fetchMetaActivityBulk as fetchMetaActivityBulkAction,
  fetchActivitiesCompany,
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
  fetchMemberBulkById as fetchMemberBulkByIdAction,
  fetchMember,
} from '../../member/actions';

import {
  getAvailableEstablishmentList,
  getAllEstablishments,
} from '../../establishment/selectors';

import PrivateBookingCard from '../components/booking/PrivateBookingCard.component';

import OfferMinimalSummary from '../../../components/offer/OfferMinimalSummary.component';

import {
  getOfferById,
  withMetaActivity,
  withCoach,
  getSimilars as getSimilarsOffers,
  withEstablishment,
  withTags,
  getOfferHasPendingReplacementRequest,
} from '../../offer/selectors';
import { withAssociatedCoach, getCustomEvent } from '../selectors/custom-event';

import {
  disableOffer as disableOfferAPI,
  deleteOffer as deleteOfferAPI,
} from '../../offer/api';
import { fetchAllCoachPaymentRules } from '../../coach-payment-rules/actions';
import { CoachPaymentRuleByKindSelector } from '../../coach-payment-rules/selectors';
import type { CoachPaymentRule } from '../../coach-payment-rules/types';
import type { OptionCallback } from '../../../state/types';

import { ZoomApp } from '../../zoom-app/types';

type Props = {
  offerId: number,
  privateBookingId?: number,
  fetchOfferById: (id: number) => void,
  fetchPrivateBookingById: (number) => void,
  openOfferEditModal?: Offer,
  t: TFunction,
  classes: Object,
  privateBooking?: PrivateBooking,
  offer: Offer,
  selectedPrivateBooking?: PrivateBooking,
  isUpdateCoachFormOpen: boolean,
  setIsUpdateCoachFormOpen: (boolean) => void,
  fetchRoomBlueprints: () => void,

  fetchSimilarOffers: (offerId: number) => void,
  similarOfferLoading: boolean,
  similarOffers: Array<Offer>,

  coaches: Array<Coach>,
  coachesSelectedInRole: Array<Coach>,
  availableEstablishments: Array<Establishment>,
  allEstablishments: Array<Establishment>,

  openDisablePrivateBookingModal: () => void,
  openOfferDeleteModal: boolean,

  refreshOffers: () => void,
  closeOfferEditModal: () => void,
  closeOfferDeleteModal: () => void,
  onClose: () => void,
  offerDeleteModalOpen: boolean,
  popoverAnchor?: HTMLElement,
  privateBookingDeleteModalOpen: boolean,

  editOffers: (id: number, data: Offer, option: OptionCallback) => void,
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

  theme?: CompanyTheme,
  goToMember: (id: number) => void,
  privateBookingLoading: boolean,

  openDisablePrivateBookingModal: () => void,
  updatePrivateBookingDatetime: (date: string, options: OptionCallback) => void,
  updatePrivateBookingCoachHandler: (updatedCoachId: number) => void,
  goToCoachCalendar: () => void,
  fetchActivitiesCompany: (company: number) => void,
  fetchCompanyUserRoles: () => void,
  metaActivities: Array<MetaActivity>,

  customEvent?: CustomEvent,
  deleteCustomEvent: (number) => void,
  roomBlueprints: RoomBlueprint[],
  allRoomBlueprints: RoomBlueprint[],
  fetchRoomBlueprints: () => void,
  fetchAllCoachPaymentRules: () => void,
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> },
  fetchMember: (memberId: number) => void,
  fetchInvoiceListUnpaid: (memberId: number) => void,
  unpaidInvoiceList: Array<Invoice>,
  goToInvoice: (uuid: string) => void,
  payment_method_available_manager: Array<PaymentMethod>,
  snackbarSuccess: (msg: string) => void,
  companyId: number,
  fetchMemberPaymentMethod: (memberId: number) => void,
  invoiceToBill: Invoice,
  setInvoiceToBill: (invoice?: Invoice) => void,
  updateMemberMetricValue: (data: any, options: OptionCallback) => void,
  createMemberProgram: (data: any, options?: any) => void,
  programList: Array<PerformanceTrackingProgram>,
  fetchPerformanceTrackingData: (member: number) => void,
  fetchProgram: (params: any) => void,
  programDataLoading: boolean,
  consumerGiftcardList: Array<ConsumerGiftcard<Giftcard>>,
  applyGiftcardOnInvoice: (
    invoiceUuid: string,
    consumergiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) => void,
  fetchConsumerGiftcardReceivedList: (memberId: number) => void,
  isCoach: boolean,
  allTagsWithTagGroup: Array<Tag<TagGroup>>,

  allCustomLevels: Level[],
  activeCustomLevels: Level[],
  fetchLevelList: (
    params: LevelFilterSet,
    options?: OptionPaginatedCallback<Level>,
  ) => void,
  updateLevel: (id: number, data: Level, options: OptionCallback) => void,
  createLevel: (data: Level, options?: OptionCallback<Level>) => void,
  deleteLevel: (id: number, options?: OptionCallback) => void,
  getHasPendingReplacementRequest: (offerId: number) => boolean,
  fetchZoomApp: (companyId: number) => void,
  zoomAppDetail: ZoomApp,
  editInternalNote: (
    data: { internalNote: string },
    options: OptionCallback,
  ) => void,
  memberBulkLoading?: boolean,
  fetchMemberBulkById: (
    ids: number,
    options?: OptionCallback<Member[]>,
  ) => void,
  setPrivateBookingUnpaidLoading: boolean,
  setPrivateBookingUnpaid: (id: number, options?: OptionCallback) => void,
  closeSetUnpaidModal: () => void,
  openSetUnpaidModal: () => void,
  setUnpaidModalOpen: boolean,
};

type State = {
  clientSecretLoading: boolean,
  clientSecret?: string,
  paymentGroupId?: number,
  paymentGroupPriceCts?: number,
};

export class CalendarEventDetail extends React.Component<Props, State> {
  state = {
    clientSecretLoading: false,
    clientSecret: null,
    paymentGroupId: null,
    paymentGroupPriceCts: null,
  };

  componentDidMount() {
    this.props.fetchActivitiesCompany(this.props.theme.company);
    this.props.fetchZoomApp(this.props.theme.company);
    this.props.fetchCompanyUserRoles();
    this.props.fetchRoomBlueprints();
    this.props.fetchAllCoachPaymentRules();
    this.handleFetchLevel();
    if (!this.props.isCoach) {
      this.props.fetchProgram({ is_disabled: false }); // WILL BECOME USELESS
    }
  }

  handleFetchLevel = () => {
    this.props.fetchLevelList({
      company: this.props.companyId,
    });
  };

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
    if (
      this.props.privateBooking &&
      !isEqual(
        this.props.privateBooking?.member,
        prevProps.privateBooking?.member,
      ) &&
      typeof this.props.privateBooking?.member === 'number'
    ) {
      this.props.fetchMemberBulkById([this.props.privateBooking?.member]);
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

  applyGiftcardOnInvoice = (
    invoice_uuid: string,
    consumerGiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) => {
    this.props.applyGiftcardOnInvoice(
      invoice_uuid,
      consumerGiftCardId,
      amount,
      {
        onSuccess: () => {
          if (options && options.onSuccess) options.onSuccess();
          // this.props.fetchConsumerGiftcardReceivedList();
        },
        onError: () => {
          if (options && options.onError) options.onError();
          // this.props.fetchConsumerGiftcardReceivedList();
        },
      },
    );
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
    const filteredCoaches =
      this.props.coachesSelectedInRole?.length > 0
        ? this.props.coachesSelectedInRole
        : this.props.coaches;
    if (privateBooking) {
      return this.props.isUpdateCoachFormOpen ? (
        <PrivateBookingUpdateCoachDialog
          coaches={filteredCoaches}
          privateBooking={privateBooking}
          setIsUpdateCoachFormOpen={this.props.setIsUpdateCoachFormOpen}
          updatePrivateBookingCoach={
            this.props.updatePrivateBookingCoachHandler
          }
        />
      ) : (
        <PrivateBookingCard
          applyGiftcardOnInvoice={this.applyGiftcardOnInvoice}
          availablePaymentMethodList={
            this.props.payment_method_available_manager
          }
          cardBillingDetailsMandatory={
            this.props.theme.force_billing_details_on_cards
          }
          clientSecret={this.state.clientSecret}
          clientSecretLoading={this.state.clientSecretLoading}
          companyId={this.props.companyId}
          consumerGiftcardList={this.props.consumerGiftcardList}
          createMemberProgram={
            this.props.isCoach ? null : this.props.createMemberProgram
          }
          editInternalNote={this.props.editInternalNote}
          fetchConsumerGiftcardReceivedList={
            this.props.fetchConsumerGiftcardReceivedList
          }
          fetchInvoiceListUnpaid={this.fetchInvoiceListUnpaid}
          fetchMemberPaymentMethod={this.props.fetchMemberPaymentMethod}
          fetchPerformanceTrackingData={this.props.fetchPerformanceTrackingData}
          goToCoachCalendar={this.props.goToCoachCalendar}
          goToInvoice={this.props.goToInvoice}
          goToMember={this.props.isCoach ? null : goToMember}
          invoiceToBill={this.props.invoiceToBill}
          isCoach={this.props.isCoach}
          loading={this.props.privateBookingLoading}
          memberBulkLoading={this.props.memberBulkLoading}
          onClose={this.props.onClose}
          onDelete={
            this.props.isCoach
              ? null
              : this.props.openDisablePrivateBookingModal
          }
          onlinePaymentEnabled={this.props.theme?.online_payment_enabled}
          onRestore={
            this.props.isCoach
              ? null
              : () => this.props.restorePrivateBooking(privateBooking.id)
          }
          onSetUnpaid={
            this.props.isCoach ? null : this.props.openSetUnpaidModal
          }
          paymentGroupId={this.state.paymentGroupId}
          paymentGroupPriceCts={this.state.paymentGroupPriceCts}
          private_booking={privateBooking}
          programDataLoading={this.props.programDataLoading}
          programList={this.props.programList}
          requestClientSecret={this.requestClientSecret}
          setInvoiceToBill={this.props.setInvoiceToBill}
          setIsUpdateCoachFormOpen={this.props.setIsUpdateCoachFormOpen}
          setPrivateBookingUnpaidLoading={
            this.props.setPrivateBookingUnpaidLoading
          }
          snackbarSuccess={this.props.snackbarSuccess}
          stripePaymentElementConfig={{
            isDefaultForRegion: this.props.theme.is_default_for_region,
            stripeId: this.props.theme.stripe_id,
          }}
          unpaidInvoiceList={this.props.unpaidInvoiceList}
          updateMemberMetricValue={
            this.props.isCoach ? null : this.props.updateMemberMetricValue
          }
          updateTime={
            this.props.isCoach ? null : this.props.updatePrivateBookingDatetime
          }
        />
      );
    }
    if (customEvent) {
      return (
        <CustomEventCard
          customEvent={customEvent}
          isCoach={this.props.isCoach}
          onDelete={
            this.props.isCoach
              ? null
              : () => this.props.deleteCustomEvent(customEvent.id)
          }
        />
      );
    }
    if (offer) {
      return (
        <ObjectLevelPermissionProvider
          requiredPermission={[
            'session.activity.allowed_actions.edit',
            'session.activity.allowed_actions.delete',
            'session.workshop.allowed_actions.edit',
            'session.workshop.allowed_actions.delete',
          ]}
        >
          {([
            hasEditActivityPermission,
            hasDeleteActivityPermission,
            hasEditWorkshopPermission,
            hasDeleteWorkshopPermission,
          ]: boolean[]) => (
            <div>
              <OfferMinimalSummary
                coachDisplay={
                  this.props.isCoach && this.props.theme?.coach_display
                }
                getHasPendingReplacementRequest={
                  this.props.getHasPendingReplacementRequest
                }
                isCoach={this.props.isCoach}
                offer={offer}
              />
              {offer.available && !this.props.isCoach ? (
                <div className={classes.buttonRow}>
                  {getEditPermission(
                    offer,
                    hasEditActivityPermission,
                    hasEditWorkshopPermission,
                  ) && (
                    <Button
                      color="primary"
                      onClick={this.props.openOfferEditModal}
                    >
                      <EditIcon className={classes.iconLeft} />
                      <Hidden xsDown>{t('calendar.modifyOffer')}</Hidden>
                    </Button>
                  )}
                  {getDeletePermission(
                    offer,
                    hasDeleteActivityPermission,
                    hasDeleteWorkshopPermission,
                  ) && (
                    <RedButton onClick={this.props.openOfferDeleteModal}>
                      <DeleteIcon className={classes.iconLeft} />
                      <Hidden xsDown>{t('calendar.deleteOffer')}</Hidden>
                    </RedButton>
                  )}
                </div>
              ) : null}
              {!this.props.isCoach && (
                <Link
                  style={{ textDecoration: 'none' }}
                  to={`/offer/${offer.id}`}
                >
                  <Button
                    className={classes.manageButton}
                    color="primary"
                    variant="contained"
                  >
                    {t('manageOffer')}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </ObjectLevelPermissionProvider>
      );
    }
    return null;
  };

  updateOffer = async (data) => {
    this.props.setOfferProcessing(true);

    this.props.editOffers(data.offerId, data.data, {
      onSuccess: () => {
        this.props.closeOfferEditModal();
        this.props.onClose();
      },
      onBackgroundSuccess: () => {
        this.props.refreshOffers();
        this.props.setOfferProcessing(false);
      },
      onError: () => {
        this.props.setOfferProcessing(false);
        this.props.closeOfferEditModal();
        this.props.onClose();
      },
    });
  };

  onCancelOffer = async (data) => {
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
    const filteredCoaches =
      this.props.coachesSelectedInRole?.length > 0
        ? this.props.coachesSelectedInRole
        : this.props.coaches;
    return (
      <div>
        <Popover
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          className={this.props.classes.popover}
          onClose={this.props.onClose}
          open={!!this.props.popoverAnchor}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          TransitionComponent={Fade}
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
                fetchSimilarOffers={() =>
                  this.props.fetchSimilarOffers(this.props.offer.id)
                }
                offer={offer}
                offerWasCancelled={!offer.available}
                onCancel={this.props.closeOfferDeleteModal}
                onCancelOffer={({
                  notify,
                  deleteAll,
                  custom_selection,
                  custom_selection_ids,
                  cancel_linked_hybrid_offer,
                }) =>
                  this.onCancelOffer({
                    offerId: offer.id,
                    notify,
                    deleteAll,
                    custom_selection,
                    custom_selection_ids,
                    cancel_linked_hybrid_offer,
                  })
                }
                onHardDelete={this.onHardDeleteOffer}
                processing={this.props.offerProcessing}
                similarOfferLoading={this.props.similarOfferLoading}
                similarOffers={this.props.similarOffers}
              />
            </DialogContent>
          </Dialog>
        ) : null}
        {this.props.privateBooking &&
        this.props.privateBookingDeleteModalOpen ? (
          <PrivateBookingDisableDialog
            onClose={this.props.closeDisablePrivateBookingModal}
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
            open={this.props.privateBookingDeleteModalOpen}
            private_booking={this.props.privateBooking}
          />
        ) : null}

        {this.props.privateBooking && this.props.setUnpaidModalOpen ? (
          <PrivateBookingSetUnpaidConfirmDialog
            loading={this.props.setPrivateBookingUnpaidLoading}
            onClose={this.props.closeSetUnpaidModal}
            onConfirm={() =>
              this.props.setPrivateBookingUnpaid(this.props.privateBooking.id)
            }
            open={this.props.setUnpaidModalOpen}
          />
        ) : null}

        <GenericResponsiveDrawer
          withoutHeaderContainer
          withoutPadding
          onClose={this.props.closeOfferEditModal}
          open={this.props.offerEditModalOpen}
          subtitle={this.props.t('translation:common.offerEdition')}
          title={this.props.t('translation:common.offers')}
        >
          <OfferEditForm
            editableCoachPaymentRule
            activeCustomLevels={this.props.activeCustomLevels}
            allCustomLevels={this.props.allCustomLevels}
            allEstablishments={this.props.allEstablishments}
            allowGuestMaster={
              this.props.theme.allow_guest_activatable &&
              this.props.theme.allow_guest
            }
            allRoomBlueprints={this.props.allRoomBlueprints}
            availableEstablishments={this.props.availableEstablishments}
            coaches={filteredCoaches}
            coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
            companyId={this.props.companyId}
            createLevel={this.props.createLevel}
            deleteLevel={this.props.deleteLevel}
            fetchLevelList={this.handleFetchLevel}
            fetchSimilarOffers={this.props.fetchSimilarOffers}
            isLoading={
              this.props.offerEditLoading ||
              this.props.similarOfferLoading ||
              !offer
            }
            isOfferInGroup={!!offer?.group}
            isWherebyIntegrationEnabled={
              this.props.theme &&
              this.props.theme.is_whereby_integration_enabled &&
              this.props.theme.is_whereby_integration_allowed
            }
            metaActivities={this.props.metaActivities}
            metaActivity={offer?.meta_activity}
            offer={offer}
            onCancel={this.props.closeOfferEditModal}
            onSubmit={this.updateOffer}
            processing={this.props.offerProcessing}
            roomBlueprints={this.props.roomBlueprints}
            similarOffers={this.props.similarOffers}
            tagList={this.props.allTagsWithTagGroup}
            updateLevel={this.props.updateLevel}
            zoomAppDetail={this.props.zoomAppDetail}
          />
        </GenericResponsiveDrawer>
      </div>
    );
  }
}

const styles = (theme) => ({
  popover: {
    maxHeight: '80dvh',
  },
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
      similarOfferLoading: state.offer.similarOffers.loading,
      offerEditLoading:
        state.establishment.loading ||
        state.coach.loading ||
        state.metaActivity.loading,
      memberBulkLoading: state.member.bulk.loading,
      similarOffers: getSimilarsOffers(state),
      coaches: getActiveCoaches(state),
      coachesSelectedInRole: getCoachesSelectedInRole(state),
      availableEstablishments: getAvailableEstablishmentList(state),
      allEstablishments: getAllEstablishments(state),
      metaActivities: getEnabledMetaActivities(state),
      roomBlueprints: getRoomBlueprints(state),
      coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
      allTagsWithTagGroup: getAllTagsWithTagGroup(state),
      activeCustomLevels: getActiveCustomLevels(state),
      allCustomLevels: getAllCustomLevels(state),
      zoomAppDetail: zoomAppSelectors.getZoomApp(state),
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
      fetchLevelList: fetchLevelListAction,
      updateLevel: updateLevelAction,
      createLevel: createLevelAction,
      deleteLevel: deleteLevelAction,
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
    updatePrivateBooking: updatePrivateBookingAction,
    setPrivateBookingUnpaid: setPrivateBookingUnpaidAction,
  }),
  withStateHandlers(
    {
      privateBookingDeleteModalOpen: false,
      privateBookingProcessing: false,
      setUnpaidModalOpen: false,
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
      openSetUnpaidModal: () => () => ({
        setUnpaidModalOpen: true,
      }),
      closeSetUnpaidModal: () => () => ({
        setUnpaidModalOpen: false,
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
    editInternalNote:
      ({ updatePrivateBooking, privateBookingId }) =>
      (data: { internalNote: string }, options?: OptionCallback) => {
        updatePrivateBooking(
          privateBookingId,
          { internal_note: data?.internalNote },
          options,
        );
      },
    setPrivateBookingUnpaid:
      ({ setPrivateBookingUnpaid, closeSetUnpaidModal, onClose }) =>
      (privateBookingId) => {
        setPrivateBookingUnpaid(privateBookingId, {
          onSuccess: () => {
            closeSetUnpaidModal();
            onClose();
          },
          onError: () => {
            closeSetUnpaidModal();
          },
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
      setPrivateBookingUnpaidLoading:
        state.privateService.privateBooking.setUnpaid.loading,
      theme: state.theme.theme,
      offer: withTags(
        withCustomLevel(
          withMetaActivity(withCoach(withEstablishment(getOfferById))),
        ),
      )(state, offerId),
      getHasPendingReplacementRequest:
        getOfferHasPendingReplacementRequest(state),
      customEvent: withAssociatedCoach(getCustomEvent)(state, customEventId),
      unpaidInvoiceList: withInvoiceItem(getInvoiceList)(state),
      payment_method_available_manager:
        state.theme.theme.payment_method_available_manager,
      companyId: state.theme.theme.company,
      programList: getProgramList(state),
      programDataLoading:
        state.performanceTracking.memberProgram.loading ||
        state.performanceTracking.metricList.loading ||
        state.performanceTracking.program.loading,
      consumerGiftcardList: withSender(
        withReceiver(onlyUsable(withGiftcard(getConsumerGiftcardReceivedList))),
      )(state),
    }),
    {
      retrieveOfferAsManager: retrieveOfferAsManagerAction,
      fetchPrivateBooking: fetchPrivateBookingAction,
      fetchCoachBulk: fetchCoachBulkAction,
      fetchActivitiesCompany,
      fetchCompanyUserRoles,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      fetchPrivateService: fetchPrivateServiceAction,
      fetchRoomBlueprints,
      fetchPrivateSlot: fetchPrivateSlotAction,
      fetchMemberBulkById: fetchMemberBulkByIdAction,
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
      applyGiftcardOnInvoice: applyGiftcardOnInvoiceAction,
      snackbarSuccess,
      fetchPaymentMethodListAction: fetchPaymentMethodList,
      fetchMetric: fetchMetricAction,
      updateMemberMetricValue: updateMemberMetricValueAction,
      createMemberProgram: createMemberProgramAction,
      fetchMemberProgram: fetchMemberProgramAction,
      fetchProgram: fetchProgramAction,
      fetchConsumerGiftcardReceivedList:
        fetchConsumerGiftcardReceivedListAction,
      fetchGiftcardBulk: fetchGiftcardBulkAction,
      editOffers: editOffersActions,
      fetchZoomApp: fetchZoomAppAction,
    },
  ),
  withHandlers({
    createMemberProgram:
      ({ programList, createMemberProgram, fetchMetric }) =>
      (data) => {
        createMemberProgram(data, {
          onSuccess: (memberProgram) => {
            const program = programList?.find(
              (p) => p.id === memberProgram.program,
            );
            fetchMetric({ id__in: program?.metric_list });
          },
        });
      },
    fetchPerformanceTrackingData:
      ({ fetchMemberProgram, fetchProgram, fetchMetric }) =>
      (member) => {
        fetchMemberProgram(
          {
            member,
          },
          {
            onSuccess: (data) => {
              const programsToFetch = uniq(
                data.results.map((memberProgram) => memberProgram?.program),
              );
              fetchProgram(
                { is_disabled: false, id__in: programsToFetch },
                {
                  onSuccess: (programData) => {
                    const metricToFetch = programData.reduce(
                      (acc, program) => acc.concat(program?.metric_list),
                      [],
                    );

                    if (metricToFetch?.length) {
                      fetchMetric({ id__in: metricToFetch });
                    }
                  },
                },
              );
            },
          },
        );
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
        fetchMemberBulkById,
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
            fetchMemberBulkById([booking.member]);
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
  withHandlers({
    fetchConsumerGiftcardReceivedList:
      ({
        fetchConsumerGiftcardReceivedList,
        fetchGiftcardBulk,
        fetchMemberBulkById,
      }) =>
      (memberId: number, options?: OptionCallback) => {
        fetchConsumerGiftcardReceivedList(
          memberId,
          { page: 1, page_size: 100, active: true, reverted: false },
          {
            onSuccess: (consumerGiftcardList: Array<ConsumerGiftcard>) => {
              fetchGiftcardBulk(consumerGiftcardList.map((cg) => cg.giftcard));
              fetchMemberBulkById([
                ...consumerGiftcardList.map((cg) => cg.src_member),
                ...consumerGiftcardList.map((cg) => cg.dst_member),
              ]);
              if (options && options.onSuccess) options.onSuccess();
            },
            onError: () => {
              if (options && options.onError) options.onError();
            },
          },
        );
      },
    applyGiftcardOnInvoice:
      ({ applyGiftcardOnInvoice }) =>
      (
        invoice_uuid: string,
        consumerGiftCardId: number,
        amount: number,
        options?: OptionCallback,
      ) => {
        applyGiftcardOnInvoice(invoice_uuid, consumerGiftCardId, amount, {
          onSuccess: () => {
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        });
      },
  }),
  OfferEditorContainer,
  PrivateBookingCancellatorContainer,
)(CalendarEventDetail);
