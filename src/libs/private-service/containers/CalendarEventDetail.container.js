import React from 'react';

import { connect } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';

import Fade from '@material-ui/core/Fade';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import Popover from '@material-ui/core/Popover';
import { push } from 'react-router-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteOfferForm from '../../offer/DeleteOfferForm.component';
import OfferEditForm from '../../offer/OfferEditForm.component';
import RedButton from '../../../components/button/RedButton.component';
import PrivateBookingDisableDialog from '../components/PrivateBookingDisableDialog.component';
import {
  getPrivateBooking,
  withRelatedFields,
} from '../selectors/private-booking';
import { getPermissions } from '../../role/selectors';
import {
  fetchPrivateBooking,
  fetchPrivateSlot,
  fetchPrivateService,
  disablePrivateBooking,
  deletePrivateBooking,
} from '../actions';
import { fetchMetaActivityBulk } from '../../meta-activity/actions';
import {
  fetchCoachBulk,
  fetchAssociatedCoachesList,
} from '../../associated-coach/actions';
import { refreshFilteredMembers } from '../../member/actions';
import {
  fetchEstablishments,
  fetchEstablishmentBulk,
} from '../../establishment/actions';

import { getActiveCoaches } from '../../associated-coach/selectors';
import { getAllEstablishments } from '../../establishment/selectors';

import PrivateBookingCard from '../components/PrivateBookingCard.component';
import {
  retrieveOfferAsManager,
  fetchSimilarOffers,
} from '../../offer/actions';

import OfferMinimalSummary from '../../../components/offer/OfferMinimalSummary.component';

import {
  getOfferById,
  withMetaActivity,
  withCoach,
  getSimilars as getSimilarsOffers,
  withEstablishment,
} from '../../offer/selectors';

import {
  editLiveOffer as editLiveOfferAPI,
  disableOffer as disableOfferAPI,
  deleteOffer as deleteOfferAPI,
} from '../../offer/api';

export class CalendarEventDetail extends React.Component<Props> {
  componentDidUpdate(prevProps) {
    if (this.props.offerId && this.props.offerId !== prevProps.offerId) {
      this.props.fetchOfferById(this.props.offerId);
    }
    if (
      this.props.privateBookingId &&
      this.props.privateBookingId !== prevProps.privateBookingId
    ) {
      this.props.fetchPrivateBookingById(this.props.privateBookingId);
    }
  }

  renderContent = () => {
    const { t, classes, permission, offer, privateBooking } = this.props;
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
      return (
        <PrivateBookingCard
          onDelete={this.props.openDisablePrivateBookingModal}
          private_booking={privateBooking}
        />
      );
    }
    if (offer) {
      return (
        <div>
          <OfferMinimalSummary offer={offer} />
          {offer.available ? (
            <div className={classes.buttonRow}>
              {permission && permission.offer.edit ? (
                <Button color="primary" onClick={this.props.openOfferEditModal}>
                  <EditIcon className={classes.iconLeft} />
                  <Hidden xsDown>{t('offer:calendar.modifyOffer')}</Hidden>
                </Button>
              ) : null}
              {permission && permission.offer.delete ? (
                <RedButton onClick={this.props.openOfferDeleteModal}>
                  <DeleteIcon className={classes.iconLeft} />
                  <Hidden xsDown>{t('offer:calendar.deleteOffer')}</Hidden>
                </RedButton>
              ) : null}
            </div>
          ) : null}
          <Link style={{ textDecoration: 'none' }} to={`/offer/${offer.id}`}>
            <Button
              color="primary"
              variant="contained"
              className={classes.manageButton}
            >
              {t('offer:manageOffer')}
            </Button>
          </Link>
          {offer.available ? null : (
            <RedButton
              onClick={this.props.openOfferDeleteModal}
              variant="contained"
              className={classes.manageButton}
            >
              {t('offer:forms.delete.buttonHardDelete')}
            </RedButton>
          )}
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
    const {
      coachesLoading,
      establishmentsLoading,
      similarOfferLoading,
      offer,
    } = this.props;
    return (
      <div>
        <Popover
          open={!!this.props.popoverAnchor}
          anchorEl={this.props.popoverAnchor}
          TransitionComponent={Fade}
          onClose={this.props.onClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
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
            onSubmit={(force_refund) =>
              this.props.disableOrDeletePrivateBooking(
                this.props.privateBooking,
                force_refund,
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
    padding: theme.spacing.unit * 4,
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
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  link: {
    marginLeft: theme.spacing.unit,
    padding: theme.spacing.unit,
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
  linkTypo: {
    marginLeft: theme.spacing.unit * 2,
  },
  iconLeft: {
    marginRight: theme.spacing.unit,
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
    }),
    {
      fetchSimilarOffers,
      fetchEstablishments,
      fetchAssociatedCoachesList,
      fetchMetaActivityBulk,
      fetchCoachBulk,
      fetchEstablishmentBulk,
    },
  ),
  withHandlers({
    fetchSimilarOffers: ({
      fetchEstablishmentBulk,
      fetchMetaActivityBulk,
      fetchCoachBulk,
      fetchSimilarOffers,
    }) => (id) => {
      fetchSimilarOffers(id, {
        onSuccess: (oList) => {
          fetchCoachBulk(oList.map((o) => o.coach));
          fetchEstablishmentBulk(oList.map((o) => o.establishment));
          fetchMetaActivityBulk(oList.map((o) => o.meta_activity));
        },
      });
    },
  }),

  withStateHandlers(
    {
      offerDeleteModalOpen: false,
      offerEditModalOpen: false,
      offerProcessing: false,
    },
    {
      openOfferEditModal: (
        _,
        { fetchEstablishments, fetchAssociatedCoachesList },
      ) => () => {
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
  connect(
    null,
    {
      disablePrivateBooking,
      deletePrivateBooking,
    },
  ),
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
    disableOrDeletePrivateBooking: ({
      disablePrivateBooking,
      deletePrivateBooking,
      closeDisablePrivateBookingModal,
      setPrivateBookingProcessing,
    }) => (private_booking, force_refund, options) => {
      setPrivateBookingProcessing(true);
      const isDisabled =
        private_booking.booking_status_code !== BOOKING_STATUS_OK.id;
      let action = disablePrivateBooking;
      if (isDisabled) {
        action = deletePrivateBooking;
      }
      action(
        private_booking.id,
        { force_refund },
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
  }),
);

export default compose(
  withStyles(styles),
  withNamespaces(),
  connect(
    (state, { privateBookingId, offerId }) => ({
      privateBooking: withRelatedFields(getPrivateBooking)(
        state,
        privateBookingId,
      ),
      permission: getPermissions(state),
      theme: state.theme.theme,
      offer: withMetaActivity(withCoach(withEstablishment(getOfferById)))(
        state,
        offerId,
      ),
    }),
    {
      retrieveOfferAsManager,
      fetchPrivateBooking,
      fetchCoachBulk,
      fetchEstablishmentBulk,
      fetchPrivateService,
      fetchPrivateSlot,
      refreshFilteredMembers,
      onOfferClick: (id) => push(`/offer/${id}`),
    },
  ),
  withHandlers({
    fetchPrivateBookingById: ({
      fetchCoachBulk,
      fetchEstablishmentBulk,
      fetchPrivateService,
      fetchPrivateSlot,
      refreshFilteredMembers,
      fetchPrivateBooking,
    }) => (id) => {
      fetchPrivateBooking(id, {
        onSuccess: ([booking]) => {
          if (booking.coach) fetchCoachBulk([booking.coach]);
          if (booking.establishment) {
            fetchEstablishmentBulk([booking.establishment]);
          }
          fetchPrivateSlot(booking.private_service, booking.private_slot);
          fetchPrivateService(booking.private_service);
          refreshFilteredMembers({ id__in: [booking.member] });
        },
      });
    },
    fetchOfferById: ({
      fetchCoachBulk,
      fetchEstablishmentBulk,
      retrieveOfferAsManager,
    }) => (id) => {
      retrieveOfferAsManager(id, {
        onSuccess: (offer) => {
          fetchCoachBulk([offer.coach]);
          fetchEstablishmentBulk([offer.establishment]);
        },
      });
    },
  }),
  OfferEditorContainer,
  PrivateBookingCancellatorContainer,
)(CalendarEventDetail);
