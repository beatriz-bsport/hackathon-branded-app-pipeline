// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState, withHandlers } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import moment from 'moment-timezone';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { getPrivatePassAvailable } from '../selectors/private-pass';
import { getPrivateConsumerPassList } from '../selectors/private-consumer-pass';
import { MemberMap } from '../../member/utils';
import { mapFormData } from '../../../pages/form.utils';
import {
  fetchAllPrivateServices,
  fetchAllPrivateSlots,
  fetchCompatiblePrivatePass as fetchCompatiblePrivatePassAction,
  fetchCompatiblePrivateConsumerPass as fetchCompatiblePrivateConsumerPassAction,
  registerPrivateBooking as registerPrivateBookingAction,
} from '../actions.ts';
import { getAvailablePrivateServices } from '../selectors/private-service.ts';

import { fetchAssociatedEstablishmentBulk } from '../../establishment/actions.ts';
import { fetchAssociatedCoachBulk } from '../../associated-coach/actions.ts';

import SlotSearcherParams from '../components/slot-searcher/SlotSearcherParams.component';
import MemberSearchModal from '../../member/components/MemberSearchModal.component';
import { getSearchedMembers } from '../../member/selectors';
import MemberMinimalListItem from '../../member/components/MemberMinimalListItem.component';
import {
  search as searchMembers,
  createOrUpdateMember,
  fetchMember as fetchMemberAction,
} from '../../member/actions';
import { getLatest as getLatestMember } from '../../member/api';

import MissingResourceForBookingHelper from '../components/MissingResourceForBookingHelper.component';
import PrivatePassCapabilities from '../components/PrivatePassCapabilities.component';

import DateTimeForm from '../../../components/input/DateTimeInput.component';

import { getMissingResourceForBooking } from '../utils.ts';

type Props = {
  t: TFunction,
  classes: Object,
  requestedSlot: ?string,
  fetchAllPrivateServices: (OptionCallback) => void,
  fetchEstablishmentBulk: (Array<number>) => void,
  fetchCoachBulk: (Array<number>) => void,
  fetchAllPrivateSlots: () => void,
  fetchPass: (slotId: number, memberId: number) => void,
  searchedMembers: Array<Member>,
  private_services: Array<PrivateService>,
  registerPrivateBooking: (data: any, options: OptionCallback) => void,
  onClose: () => void,
  open: boolean,
  searchMembers: (string) => void,
  id: number,
  compatiblePassLoading: boolean,
  processing: boolean,
  billMemberPrivatePass: (memberId: number, passId: number) => void,
  compatiblePrivatePass: Array<PrivatePass>,
  compatiblePrivateConsumerPass: Array<ConsumerPrivatePass>,
  notify_member: boolean,
  setNotifyMember: (boolean) => void,

  createMember: (data: any, options: OptionCallback) => void,
  timezone: string,
  country: string,
};

type State = {
  member: ?Member,
  private_booking_data: any,
  date_start: string,
};

export class PrivateBookingBooker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      member: null,
      private_booking_data: {},
      date_start: props.requestedSlot,
    };
  }

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

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevProps.requestedSlot !== this.props.requestedSlot &&
      this.props.requestedSlot
    ) {
      this.setState({ date_start: this.props.requestedSlot });
    }
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
        date_start: this.state.date_start,
        notify_member: this.props.notify_member,
      },

      {
        onSuccess: () => {
          if (options && options.onSuccess) options.onSuccess();
          this.onClose();
        },
      },
    );
  };

  onClose = () => {
    this.setState({
      private_booking_data: {},
      member: null,
    });
    this.props.onClose();
  };

  render() {
    const { open, t } = this.props;
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
          createMember={this.props.createMember}
          onClose={this.onClose}
          handlMemberSelected={(id: number, member: Member) =>
            this.setState({ member })
          }
          country={this.props.country}
        />
      );
    }

    const missingResources = this.missingResourceConf();
    return (
      <Dialog open={open}>
        <DialogTitle>
          {moment(this.state.date_start)
            .tz(this.props.timezone)
            .format('LLLL')}
        </DialogTitle>
        <DialogContent>
          <MemberMinimalListItem member={this.state.member} />
          <DateTimeForm
            timezone={this.props.timezone}
            value={this.state.date_start}
            onChange={(date_start) => this.setState({ date_start })}
          />
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
          <FormControlLabel
            control={
              <Checkbox
                checked={this.props.notify_member}
                onChange={(ev) => this.props.setNotifyMember(ev.target.checked)}
              />
            }
            label={t('bookerModule.notifyMember.label')}
          />
          {// eslint-disable-next-line
          missingResources.filter((l) => l !== 'address').length === 0 ? (
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
          <Button onClick={this.onClose}>{t('bookerModule.cancel')}</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  container: {},
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  loadingContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  fieldset: {
    marginBottom: theme.spacing(3),
  },
});

const MemberSearchContainer = compose(
  connect(
    (state) => ({
      searchedMembers: getSearchedMembers(state),
    }),
    {
      searchMembers,
      createMember: createOrUpdateMember,
    },
  ),
  withHandlers({
    createMember: ({ createMember, fetchMember }) => (values, options) => {
      if (!values.birthday) {
        // eslint-disable-next-line
        delete values.birthday;
      }
      const formData = mapFormData(values, MemberMap);

      createMember(null, formData, {
        onSuccess: () => {
          getLatestMember()
            .then((res) => {
              fetchMember(res.data, options);
            })
            .catch((err) => {
              console.error(err);
            });
        },
      });
    },
  }),
);

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
  withState('notify_member', 'setNotifyMember', true),
  connect(
    (state) => ({
      private_services: getAvailablePrivateServices(state),
      compatiblePassLoading:
        state.privateService.privatePass.loading ||
        state.privateService.privateConsumerPass.loading,
      compatiblePrivatePass: getPrivatePassAvailable(state),
      compatiblePrivateConsumerPass: getPrivateConsumerPassList(state),
      timezone: state.theme.theme.timezone_name,
      bookingProcessing:
        state.privateService.privateBooking.createOrUpdate.loading,
      country: state.theme.theme.locale.split('_')[1],
    }),
    {
      fetchAllPrivateServices: (options) =>
        fetchAllPrivateServices({ mine: true }, options),
      fetchAllPrivateSlots: () => fetchAllPrivateSlots({ mine: true }),
      fetchEstablishmentBulk: fetchAssociatedEstablishmentBulk,
      fetchCoachBulk: fetchAssociatedCoachBulk,
      fetchMember: fetchMemberAction,

      fetchCompatiblePrivatePass: fetchCompatiblePrivatePassAction,
      fetchCompatiblePrivateConsumerPass: fetchCompatiblePrivateConsumerPassAction,
      registerPrivateBooking: registerPrivateBookingAction,
    },
  ),
  MemberSearchContainer,
  withHandlers({
    billMemberPrivatePass: () => (memberId: number, privatePassId) =>
      window.open(
        `/invoice/add/member/${memberId}?withPrivatePass=${privatePassId}`,
      ),

    registerPrivateBooking: ({ registerPrivateBooking, fetchMember }) => (
      data,
      options,
    ) => {
      registerPrivateBooking(data, {
        onSuccess: (b) => {
          fetchMember(b.member);
          if (options && options.onSuccess) {
            options.onSuccess(b);
          }
        },
      });
    },
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
