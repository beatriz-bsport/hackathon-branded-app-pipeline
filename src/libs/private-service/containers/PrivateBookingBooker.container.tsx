import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import moment from 'moment-timezone';
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
import {
  getPrivateConsumerPassList,
  getUnPaidBookingAvailabilityForPrivateslot,
} from '../selectors/private-consumer-pass';
import { MemberMap } from '../../member/utils';
import { mapFormData } from '../../../pages/form.utils';
import {
  fetchAllPrivateServices,
  fetchAllPrivateSlots,
  fetchCompatiblePrivatePass as fetchCompatiblePrivatePassAction,
  fetchCompatiblePrivateConsumerPass as fetchCompatiblePrivateConsumerPassAction,
  registerPrivateBooking as registerPrivateBookingAction,
  createOrUpdateRecurrenceRulePrivateBooking,
  checkPrivateSlotUnpaidBookingEligibility,
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
import { showVaccinationStatus } from '../../custom-form/selectors';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

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
      this.props.setRequestedPrivateSlot(
        this.state.private_booking_data.private_slot,
      );
      this.props.checkPrivateSlotUnpaidBookingEligibility({
        privateSlotId: this.state.private_booking_data.private_slot,
        consumer: this.state.member?.consumer,
      });
    }
  }

  fetchPass = () =>
    this.props.fetchPass(
      this.state.private_booking_data.private_slot,
      this.state.member.id,
      this.state.date_start,
    );

  handleConfigurationChange = (private_booking_data: {
    private_service: number;
    private_slot: number;
    establishment: Establishment;
    coach: Coach;
    privateSlotCredit: number;
  }) => {
    const {
      coach,
      establishment,
      private_service,
      private_slot,
      privateSlotCredit,
    } = private_booking_data;
    this.setState({
      private_booking_data: {
        coach,
        establishment,
        private_service,
        private_slot,
        privateSlotCredit,
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

  registerPrivateBooking = (pcpId: number | null, options: OptionCallback) => {
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

  registerUnPaidPrivateBooking = (options: OptionCallback) => {
    this.props.registerPrivateBooking(
      {
        ...this.state.private_booking_data,
        private_consumer_pass: null,
        date_start: this.state.date_start,
        notify_member: this.props.notify_member,
        unpaid: true,
        consumer: this.state.member?.consumer,
        member: this.state.member?.id,
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

  createRecurrentRule = (options: OptionCallback, asUnpaid: boolean) => {
    const date_start = moment(this.state.date_start).tz(this.props.timezone);
    this.props.createRecurrentRule(
      {
        nb_of_weeks: this.state.nb_of_weeks,
        hour: date_start.hour(),
        minute: date_start.minute(),
        day_of_week: date_start.isoWeekday() - 1,
        start_from_date: date_start.format('YYYY-MM-DD'),
        notify_if_booked: this.props.notify_member,
        is_overriding_availabilities: this.props.is_overriding_availabilities,
        private_slot: this.state.private_booking_data.private_slot,
        coach: this.state.private_booking_data.coach,
        establishment: this.state.private_booking_data.establishment,
        member: this.state.member.id,
        allow_unpaid: this.props.allow_unpaid || !!asUnpaid,
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
          asManager
          searchMembers={this.props.searchMembers}
          searchedMembers={this.props.searchedMembers.filter(
            (m) => m.id !== this.props.id,
          )}
          open
          createMember={this.props.createMember}
          onClose={this.onClose}
          handlMemberSelected={(id: number, member: Member) =>
            this.setState({
              member: { ...member, consumer: member.consumer?.consumer },
            })
          }
          country={this.props.country}
          waiver={this.props.waiver}
          generalTermsAndConditions={this.props.generalTermsAndConditions}
        />
      );
    }

    const missingResources = this.missingResourceConf();
    return (
      <GenericResponsiveDrawer
        title={`${moment(this.state.date_start)
          .tz(this.props.timezone)
          .format('LLLL')}`}
        open={open}
        onClose={this.onClose}
      >
        <div className={this.props.classes.innerDialog}>
          <MemberMinimalListItem
            member={this.state.member}
            showVaccinationStatus={this.props.showVaccinationStatus}
          />
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.is_overriding_availabilities}
                    onChange={(ev) =>
                      this.props.setIsOverRidingAvailabilities(
                        ev.target.checked,
                      )
                    }
                  />
                }
                label={t('recurrenceRule.form.override_availabilities')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.allow_unpaid}
                    onChange={(ev) =>
                      this.props.setAllowUnpaid(ev.target.checked)
                    }
                  />
                }
                label={t('recurrenceRule.form.allow_unpaid')}
              />
            </fieldset>
          )}
          {[...missingResources].filter((l) => l !== 'address').length === 0 &&
            (this.props.compatiblePassLoading || this.props.processing) && (
              <LinearProgress className={this.props.classes.loadingContainer} />
            )}
          {[...missingResources].filter((l) => l !== 'address').length === 0 &&
            !this.props.compatiblePassLoading &&
            !this.props.processing && (
              <fieldset>
                <legend>{t('bookerModule.step.billing')}</legend>
                <PrivatePassCapabilities
                  registerPrivateBooking={this.registerPrivateBooking}
                  registerUnPaidPrivateBooking={
                    this.registerUnPaidPrivateBooking
                  }
                  createRecurrentRule={this.createRecurrentRule}
                  recurrenceRule={this.props.recurrenceRule}
                  billMemberPrivatePass={(ppId: number) =>
                    this.props.billMemberPrivatePass(this.state.member.id, ppId)
                  }
                  fetchPass={this.fetchPass}
                  compatiblePrivatePass={this.props.compatiblePrivatePass}
                  compatiblePrivateConsumerPass={
                    this.props.compatiblePrivateConsumerPass
                  }
                  compatibleWithUnpaidBooking={
                    this.props.compatibleWithUnpaidBooking
                  }
                  privateSlotCredit={
                    this.state.private_booking_data.privateSlotCredit
                  }
                />
              </fieldset>
            )}
        </div>
        <DialogActions>
          <Button onClick={this.onClose}>{t('bookerModule.cancel')}</Button>
        </DialogActions>
      </GenericResponsiveDrawer>
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

const mapStateToProps = (
  state: RootState,
  { requestedPrivateSlot }: { requestedPrivateSlot: number },
) => ({
  theme: state.theme.theme,
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
  showVaccinationStatus: showVaccinationStatus(state),
  compatibleWithUnpaidBooking: getUnPaidBookingAvailabilityForPrivateslot(
    state,
    requestedPrivateSlot,
  ),
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
  searchMembers: (text: string) => searchMembers(text, { hide_archived: true }),
  createMember: createOrUpdateMember,
  checkPrivateSlotUnpaidBookingEligibility,
};

type StateHandlerInit = {
  notify_member: boolean;
  recurrenceRule: boolean;
  requestedPrivateSlot: number | null;
  is_overriding_availabilities: boolean;
  allow_unpaid: boolean;
};

const withStateHandlersInit: StateHandlerInit = {
  notify_member: true,
  recurrenceRule: false,
  requestedPrivateSlot: null,
  is_overriding_availabilities: false,
  allow_unpaid: false,
};

const withStateHandlersSetter = {
  setNotifyMember: () => (notify_member: boolean) => {
    return { notify_member };
  },
  setIsOverRidingAvailabilities:
    () => (is_overriding_availabilities: boolean) => {
      return { is_overriding_availabilities };
    },
  setAllowUnpaid: () => (allow_unpaid: boolean) => {
    return { allow_unpaid };
  },
  setRecurrenceRule: () => (recurrenceRule: boolean) => {
    return { recurrenceRule };
  },
  setRequestedPrivateSlot: () => (requestedPrivateSlot: number | null) => {
    return { requestedPrivateSlot };
  },
};

const mapWithHandlers = {
  billMemberPrivatePass: () => (memberId: number, privatePassId: number) =>
    window.open(
      `/invoice/bill-member/${memberId}?withPrivatePass=${privatePassId}`,
    ),

  registerPrivateBooking:
    (props: OwnAndConnectedProps) => (data: any, options: any) => {
      props.registerPrivateBooking(data, {
        onSuccess: (b: any) => {
          props.fetchMember(b.member);
          if (options && options.onSuccess) {
            options.onSuccess(b);
          }
        },
      });
    },
  createRecurrentRule:
    (props: OwnAndConnectedProps) => (data: any, options: OptionCallback) => {
      props.createRecurrentRule(data, {
        onSuccess: (b) => {
          if (options && options.onSuccess) options.onSuccess(b);
        },
      });
    },
  fetchPass:
    (props: OwnAndConnectedProps) =>
    (privateSlotId: number, memberId: number, date: string) => {
      props.fetchCompatiblePrivatePass(privateSlotId);
      props.fetchCompatiblePrivateConsumerPass(privateSlotId, {
        member: memberId,
        date,
      });
    },
  createMember:
    (props: OwnAndConnectedProps) => (values: any, options: any) => {
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
