// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import moment from 'moment';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';

import { connect } from 'react-redux';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { getPrivatePassAvailable } from '../selectors/private-pass';
import { getPrivateConsumerPassList } from '../selectors/private-consumer-pass';
import {
  fetchAllPrivateServices,
  fetchAllPrivateSlots,
  fetchCompatiblePrivatePass as fetchCompatiblePrivatePassAction,
  fetchCompatiblePrivateConsumerPass as fetchCompatiblePrivateConsumerPassAction,
  registerPrivateBooking,
} from '../actions';
import { getPrivateServices } from '../selectors/private-service';

import { fetchAssociatedEstablishmentBulk } from '../../establishment/actions';
import { fetchAssociatedCoachBulk } from '../../associated-coach/actions';

import SlotSearcherParams from '../components/slot-searcher/SlotSearcherParams.component';
import MemberSearchModal from '../../member/components/MemberSearchModal.component';
import memberSelectors from '../../member/selectors';
import MemberMinimalListItem from '../../member/components/MemberMinimalListItem.component';
import { search as searchMembers } from '../../member/actions';

import MissingResourceForBookingHelper from '../components/MissingResourceForBookingHelper.component';
import PrivatePassCapabilities from '../components/PrivatePassCapabilities.component';

import { getMissingResourceForBooking } from '../utils';

type Props = {
  t: TFunction,
};

export class PrivateBookingBooker extends React.Component<Props> {
  state = {
    member: null,
    private_booking_data: {},
  };

  componentDidMount() {
    this.props.fetchAllPrivateServices({
      onSuccess: (serviceList) => {
        this.props.fetchEstablishmentBulk(
          serviceList.reduce((acc, s) => [...acc, ...s.establishments], []),
        );
        this.props.fetchCoachBulk(
          serviceList.reduce((acc, s) => [...acc, ...s.coaches], []),
        );
      },
    });
    this.props.fetchAllPrivateSlots();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.private_booking_data.private_slot !==
        prevState.private_booking_data.private_slot &&
      this.state.private_booking_data.private_slot
    ) {
      this.fetchPass();
    }
  }

  fetchPass = () =>
    this.props.fetchPass(
      this.state.private_booking_data.private_slot,
      this.state.member.id,
    );

  handleConfigurationChange = (private_booking_data) => {
    const {
      coach,
      establishment,
      private_service,
      private_slot,
    } = private_booking_data;
    this.setState({
      private_booking_data: {
        coach,
        establishment,
        private_service,
        private_slot,
      },
    });
  };

  missingResourceConf = () => {
    const private_service = this.props.private_services.find(
      (p) => p.id === this.state.private_booking_data.private_service,
    );
    return getMissingResourceForBooking(
      private_service,
      this.state.private_booking_data,
      true,
    );
  };

  registerPrivateBooking = (pcpId: number, options: OptionCallback) => {
    this.props.registerPrivateBooking(
      {
        ...this.state.private_booking_data,
        private_consumer_pass: pcpId,
        date_start: this.props.requestedSlot,
      },

      {
        onSuccess: () => {
          this.props.onClose();
        },
      },
    );
  };

  render() {
    const { open, requestedSlot, onClose, onSubmit, t } = this.props;
    console.log(this.props.private_services);
    if (!open) {
      return null;
    }
    if (!this.state.member) {
      return (
        <MemberSearchModal
          searchMembers={this.props.searchMembers}
          searchedMembers={this.props.searchedMembers.filter(
            (m) => m.id !== this.props.id,
          )}
          open
          onClose={onClose}
          handlMemberSelected={(id: number, member: Member) =>
            this.setState({ member })
          }
        />
      );
    }

    const missingResources = this.missingResourceConf();
    return (
      <Dialog open={open}>
        <DialogTitle>{moment(requestedSlot).format('LLLL')}</DialogTitle>
        <DialogContent>
          <MemberMinimalListItem member={this.state.member} />
          <Divider className={this.props.classes.divider} />
          <fieldset className={this.props.classes.fieldset}>
            <legend>{t('bookerModule.step.configuration')}</legend>
            <SlotSearcherParams
              private_services={this.props.private_services}
              onConfigurationChange={this.handleConfigurationChange}
              coachUnique
              establishmentUnique
              asManager
            />
            <MissingResourceForBookingHelper
              missingResources={missingResources}
              address={this.state.private_booking_data.address}
              updateData={(data) =>
                this.setState((prevState) => ({
                  private_booking_data: {
                    ...prevState.private_booking_data,
                    ...data,
                  },
                }))
              }
            />
          </fieldset>
          {missingResources.filter((l) => l !== 'address').length === 0 ? (
            this.props.compatiblePassLoading || this.props.processing ? (
              <LinearProgress className={this.props.classes.loadingContainer} />
            ) : (
              <fieldset>
                <legend>{t('bookerModule.step.billing')}</legend>
                <PrivatePassCapabilities
                  registerPrivateBooking={this.registerPrivateBooking}
                  billMemberPrivatePass={(ppId) =>
                    this.props.billMemberPrivatePass(this.state.member.id, ppId)
                  }
                  fetchPass={this.fetchPass}
                  compatiblePrivatePass={this.props.compatiblePrivatePass}
                  compatiblePrivateConsumerPass={
                    this.props.compatiblePrivateConsumerPass
                  }
                />
              </fieldset>
            )
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('bookerModule.cancel')}</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  container: {},
  divider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  loadingContainer: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  fieldset: {
    marginBottom: theme.spacing.unit * 3,
  },
});

const MemberSearchContainer = connect(
  (state) => ({
    searchedMembers: memberSelectors.getSearched(state),
  }),
  {
    searchMembers,
  },
);

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
  connect(
    (state) => ({
      private_services: getPrivateServices(state),
      compatiblePassLoading:
        state.privateService.privatePass.loading ||
        state.privateService.privateConsumerPass.loading,
      compatiblePrivatePass: getPrivatePassAvailable(state),
      compatiblePrivateConsumerPass: getPrivateConsumerPassList(state),
      bookingProcessing:
        state.privateService.privateBooking.createOrUpdate.loading,
    }),
    {
      fetchAllPrivateServices,
      fetchAllPrivateSlots,
      fetchEstablishmentBulk: fetchAssociatedEstablishmentBulk,
      fetchCoachBulk: fetchAssociatedCoachBulk,

      fetchCompatiblePrivatePass: fetchCompatiblePrivatePassAction,
      fetchCompatiblePrivateConsumerPass: fetchCompatiblePrivateConsumerPassAction,
      registerPrivateBooking,
    },
  ),
  MemberSearchContainer,
  withHandlers({
    billMemberPrivatePass: () => (memberId: number, privatePassId) =>
      window.open(
        `/invoice/add/member/${memberId}?withPrivatePass=${privatePassId}`,
      ),

    fetchPass: ({
      fetchCompatiblePrivatePass,
      fetchCompatiblePrivateConsumerPass,
    }) => (privateSlotId, memberId) => {
      fetchCompatiblePrivatePass(privateSlotId);
      fetchCompatiblePrivateConsumerPass(privateSlotId, {
        member: memberId,
      });
    },
  }),
)(PrivateBookingBooker);
