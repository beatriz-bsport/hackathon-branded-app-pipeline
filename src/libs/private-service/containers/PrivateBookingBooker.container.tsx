import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import moment from 'moment-timezone';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import { Theme } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { WithTranslation, withTranslation } from 'react-i18next';
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
  createOrUpdateRecurrenceRulePrivateBooking,
} from '../actions';
import { getAvailablePrivateServices } from '../selectors/private-service';

import { fetchAssociatedEstablishmentBulk } from '../../establishment/actions';
import { fetchAssociatedCoachBulk } from '../../associated-coach/actions';

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
import { resourceAllocationChecker as resourceAllocationCheckerAPI } from '../api';

import MissingResourceForBookingHelper from '../components/MissingResourceForBookingHelper.component';
import PrivatePassCapabilities from '../components/PrivatePassCapabilities.component';
import RecurrenceRulePrivateBookingFields from '../components/booking/RecurrenceRulePrivateBookingFields.component';

import DateTimeForm from '../../../components/input/DateTimeInput.component';

import { getMissingResourceForBooking } from '../utils';
import { RootState } from '../../../reducers';
import { PrivateService } from '../types';
import { MaterialStyleType, WithHandlerType } from '../../../utils/types';
import { Member } from '../../member/types';
import { OptionCallback } from '../../../state/types';

type OwnProps = {
  open: boolean;
  requestedSlot: string;
  onClose: () => void;
};

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type OwnAndConnectedProps = OwnProps & ConnectedProps & StateHandlerType;

type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  member?: Member;
  private_booking_data: any;
  date_start: string;
  nb_of_weeks?: number;
};

export class PrivateBookingBooker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      member: null,
      private_booking_data: {},
      date_start: props.requestedSlot,
      nb_of_weeks: null,
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
      this.state.date_start,
    );

  // TODO(ts) any
  handleConfigurationChange = (private_booking_data: any) => {
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
        onError: () => {
          if (options && options.onError) options.onError();
        },
      },
    );
  };

  handleTimeSettingChange = (time_setting: any) => {
    const { nb_of_weeks } = time_setting;
    this.setState({
      nb_of_weeks,
    });
  };

  createRecurrentRule = (options: OptionCallback) => {
    const date_start = moment(this.state.date_start).tz(this.props.timezone);
    this.props.createRecurrentRule(
      {
        nb_of_weeks: this.state.nb_of_weeks,
        hour: date_start.hour(),
        minute: date_start.minute(),
        day_of_week: date_start.isoWeekday() - 1,
        start_from_date: date_start.format('YYYY-MM-DD'),
        notify_if_booked: this.props.notify_member,
        private_slot: this.state.private_booking_data.private_slot,
        coach: this.state.private_booking_data.coach,
        establishment: this.state.private_booking_data.establishment,
        member: this.state.member.id,
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
      <Dialog open={open} fullScreen={window.innerWidth < 400}>
        <DialogTitle>
          {moment(this.state.date_start).tz(this.props.timezone).format('LLLL')}
        </DialogTitle>
        <div className={this.props.classes.innerDialog}>
          <MemberMinimalListItem member={this.state.member} />
          <DateTimeForm
            timezone={this.props.timezone}
            value={this.state.date_start}
            onChange={(date_start: string) => this.setState({ date_start })}
          />
          <Divider className={this.props.classes.divider} />
          <fieldset className={this.props.classes.fieldset}>
            <legend>{t('bookerModule.step.configuration')}</legend>
            <SlotSearcherParams
              private_services={this.props.private_services}
              onConfigurationChange={this.handleConfigurationChange}
              resourceAllocationChecker={resourceAllocationCheckerAPI}
              coachUnique
              establishmentUnique
              asManager
              dateStart={this.state.date_start}
            />
            <MissingResourceForBookingHelper
              missingResources={missingResources}
              address={this.state.private_booking_data.address}
              updateData={(data: any) =>
                this.setState((prevState) => ({
                  private_booking_data: {
                    ...prevState.private_booking_data,
                    ...data,
                  },
                }))
              }
            />
          </fieldset>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.notify_member}
                  onChange={(ev) =>
                    this.props.setNotifyMember(ev.target.checked)
                  }
                />
              }
              label={t('bookerModule.notifyMember.label')}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.recurrenceRule}
                  onChange={(ev) =>
                    this.props.setRecurrenceRule(ev.target.checked)
                  }
                />
              }
              label={t('bookerModule.recurrenceRule.label')}
            />
          </FormGroup>
          {this.props.recurrenceRule && (
            <fieldset className={this.props.classes.fieldset}>
              <legend>{t('bookerModule.step.rule')}</legend>
              <RecurrenceRulePrivateBookingFields
                privateSlotSet
                onTimeSettingChange={this.handleTimeSettingChange}
              />
            </fieldset>
          )}
          {
            // eslint-disable-next-line
            missingResources.filter((l) => l !== 'address').length === 0 ? (
              this.props.compatiblePassLoading || this.props.processing ? (
                <LinearProgress
                  className={this.props.classes.loadingContainer}
                />
              ) : (
                <fieldset>
                  <legend>{t('bookerModule.step.billing')}</legend>
                  <PrivatePassCapabilities
                    registerPrivateBooking={this.registerPrivateBooking}
                    createRecurrentRule={this.createRecurrentRule}
                    recurrenceRule={this.props.recurrenceRule}
                    billMemberPrivatePass={(ppId: number) =>
                      this.props.billMemberPrivatePass(
                        this.state.member.id,
                        ppId,
                      )
                    }
                    fetchPass={this.fetchPass}
                    compatiblePrivatePass={this.props.compatiblePrivatePass}
                    compatiblePrivateConsumerPass={
                      this.props.compatiblePrivateConsumerPass
                    }
                  />
                </fieldset>
              )
            ) : null
          }
        </div>
        <DialogActions>
          <Button onClick={this.onClose}>{t('bookerModule.cancel')}</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = (theme: Theme) => ({
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
  innerDialog: {
    padding: theme.spacing(2),
  },
});

const mapStateToProps = (state: RootState) => ({
  private_services: getAvailablePrivateServices(state),
  compatiblePassLoading:
    state.privateService.privatePass.loading ||
    state.privateService.privateConsumerPass.loading,
  compatiblePrivatePass: getPrivatePassAvailable(state),
  compatiblePrivateConsumerPass: getPrivateConsumerPassList(state),
  timezone: state.theme.theme.timezone_name,
  processing: state.privateService.privateBooking.createOrUpdate.loading,
  country: state.theme.theme.locale.split('_')[1],
  searchedMembers: getSearchedMembers(state),
});

const mapDispatchToProps = {
  fetchAllPrivateServices: (options: OptionCallback<PrivateService[]>) =>
    fetchAllPrivateServices({ mine: true }, options),
  fetchAllPrivateSlots: () => fetchAllPrivateSlots({ mine: true }),
  fetchEstablishmentBulk: fetchAssociatedEstablishmentBulk,
  fetchCoachBulk: fetchAssociatedCoachBulk,
  fetchMember: fetchMemberAction,

  fetchCompatiblePrivatePass: fetchCompatiblePrivatePassAction,
  fetchCompatiblePrivateConsumerPass: fetchCompatiblePrivateConsumerPassAction,
  registerPrivateBooking: registerPrivateBookingAction,
  createRecurrentRule: createOrUpdateRecurrenceRulePrivateBooking,
  searchMembers,
  createMember: createOrUpdateMember,
};

type StateHandlerInit = {
  notify_member: boolean;
  recurrenceRule: boolean;
};

const withStateHandlersInit: StateHandlerInit = {
  notify_member: true,
  recurrenceRule: false,
};

const withStateHandlersSetter = {
  setNotifyMember: () => (notify_member: boolean) => {
    return { notify_member };
  },
  setRecurrenceRule: () => (recurrenceRule: boolean) => {
    return { recurrenceRule };
  },
};

const mapWithHandlers = {
  billMemberPrivatePass: () => (memberId: number, privatePassId: number) =>
    window.open(
      `/invoice/bill-member/${memberId}?withPrivatePass=${privatePassId}`,
    ),

  registerPrivateBooking: (props: OwnAndConnectedProps) => (
    data: any,
    options: any,
  ) => {
    props.registerPrivateBooking(data, {
      onSuccess: (b: any) => {
        props.fetchMember(b.member);
        if (options && options.onSuccess) {
          options.onSuccess(b);
        }
      },
    });
  },
  createRecurrentRule: (props: OwnAndConnectedProps) => (
    data: any,
    options: OptionCallback,
  ) => {
    props.createRecurrentRule(data, {
      onSuccess: (b) => {
        if (options && options.onSuccess) options.onSuccess(b);
      },
    });
  },
  fetchPass: (props: OwnAndConnectedProps) => (
    privateSlotId: number,
    memberId: number,
    date: string,
  ) => {
    props.fetchCompatiblePrivatePass(privateSlotId);
    props.fetchCompatiblePrivateConsumerPass(privateSlotId, {
      member: memberId,
      date,
    });
  },
  createMember: (props: OwnAndConnectedProps) => (
    values: any,
    options: any,
  ) => {
    if (!values.birthday) {
      // eslint-disable-next-line
      delete values.birthday;
    }
    const formData = mapFormData(values, MemberMap);

    props.createMember(null, formData, {
      onSuccess: () => {
        getLatestMember()
          .then((res) => {
            props.fetchMember(res.data, options);
          })
          .catch((err) => {
            console.error(err);
          });
      },
    });
  },
};

export default compose<any, OwnProps>(
  withTranslation(['privateService']),
  withStyles(styles),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
)(PrivateBookingBooker);
