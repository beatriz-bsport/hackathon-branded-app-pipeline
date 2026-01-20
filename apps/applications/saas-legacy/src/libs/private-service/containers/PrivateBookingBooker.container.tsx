import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { DateTime } from 'luxon';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import { Theme } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { push } from 'connected-react-router';
import { WithTranslation, withTranslation } from 'react-i18next';

import { getCoachesSelectedInRole } from '#src/libs/associated-coach/selectors';
import { Coach } from '#src/libs/associated-coach/types';
import { Establishment } from '#src/libs/establishment/types';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import { getPrivatePassAvailableForPrivateBooking } from '../selectors/private-pass';
import {
  getPrivateConsumerPassList,
  getUnPaidBookingAvailabilityForPrivateslot,
  getConsumerPassIncompatibilitiesReasons,
  getPrivateConsumerPassNonCompatibleList,
  getPrivateConsumerPassNonCompatibleIsLoading,
} from '../selectors/private-consumer-pass';
import { MemberMap } from '../../member/utils';
// @ts-expect-error
import { mapFormData } from '../../../pages/form.utils';
import {
  fetchAllPrivateServices,
  fetchAllPrivateSlots,
  fetchCompatiblePrivatePass as fetchCompatiblePrivatePassAction,
  fetchCompatiblePrivateConsumerPass as fetchCompatiblePrivateConsumerPassAction,
  fetchNonCompatiblePrivateConsumerPass as fetchNonCompatiblePrivateConsumerPassAction,
  registerPrivateBooking as registerPrivateBookingAction,
  createOrUpdateRecurrenceRulePrivateBooking,
  checkPrivateSlotUnpaidBookingEligibility,
  fetchIncompatibilitiesReasonsBySlotByConsumerPass as fetchIncompatibilitiesReasonsBySlotByConsumerPassAction,
  resetIncompatibilitiesReasonsBySlotByConsumerPass as resetIncompatibilitiesReasonsBySlotByConsumerPassAction,
  checkPrivateServiceTagEligibility,
} from '../actions';
import { getAvailablePrivateServices } from '../selectors/private-service';
import { fetchAssociatedEstablishmentBulk } from '../../establishment/actions';
import { fetchAssociatedCoachBulk } from '../../associated-coach/actions';

// @ts-expect-error
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

// @ts-expect-error
import MissingResourceForBookingHelper from '../components/MissingResourceForBookingHelper.component';
import PrivatePassCapabilities from '../components/PrivatePassCapabilities.component';
// @ts-expect-error
import RecurrenceRulePrivateBookingFields from '../components/booking/RecurrenceRulePrivateBookingFields.component';

import DateTimeForm from '../../../components/input/DateTimeInput.component';

import { getMissingResourceForBooking } from '../utils';
import { getLocaleCountry } from '#src/utils/language';
import { RootState } from '../../../reducers';
import { PrivateService } from '../types';
import { MaterialStyleType, WithHandlerType } from '../../../utils/types';
import { Member } from '../../member/types';
import { OptionCallback } from '../../../state/types';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';
import { openNewBackOfficeWindow } from '#src/utils/windows';
import PrivateBookingWarningTagDialog from './PrivateBookingWarningTagDialog';
import {
  type FeatureFlagProps,
  withFeatureFlags,
} from '#src/utils/feature-flag/withFeatureFlags';

type OwnProps = {
  open: boolean;
  requestedSlot: string;
  onClose: () => void;
  coachesSelectedInRole: Array<Coach>;
  /** On some pages we might not want to trigger the fetch of bulk associated coach since another request could override the state */
  preventFetchCoachBulk?: boolean;
};

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type OwnAndConnectedProps = OwnProps &
  ConnectedProps &
  StateHandlerType &
  FeatureFlagProps;

type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  member?: Member;
  private_booking_data: any;
  date_start: string;
  nb_of_weeks?: number;
  incompatibleTagsDialogOpen: boolean;
};

export class PrivateBookingBooker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      member: null,
      private_booking_data: {},
      date_start: props.requestedSlot,
      nb_of_weeks: null,
      incompatibleTagsDialogOpen: false,
    };
  }

  componentDidMount() {
    this.props.fetchAllPrivateServices({
      onSuccess: (serviceList) => {
        this.props.fetchEstablishmentBulk(
          serviceList.reduce((acc, s) => [...acc, ...s.establishments], []),
        );
        !this.props.preventFetchCoachBulk &&
          this.props.fetchCoachBulk(
            serviceList.reduce((acc, s) => [...acc, ...s.coaches], []),
          );
      },
    });
    this.props.resetIncompatibilitiesReasonsBySlotByConsumerPass();
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
    const member = this.state.member && this.state.member.id;
    const service = this.state.private_booking_data.private_service;
    const member_has_changed = member !== prevState.member?.id;
    const private_service_has_changed =
      this.state.private_booking_data.private_service !==
      prevState.private_booking_data.private_service;
    if (
      member &&
      service &&
      (member_has_changed || private_service_has_changed)
    )
      this.props.checkPrivateServiceTagEligibility(
        this.state.private_booking_data.private_service,
        this.state.member.id,
        {
          onSuccess: (eligible) =>
            this.props.setIncompatibleTagsDialogOpen(!eligible),
        },
      );
  }

  fetchPass = () =>
    this.props.fetchPass(
      this.state.private_booking_data.private_slot,
      this.state.member.id,
      this.state.date_start,
    );

  fetchNonCompatiblePrivateConsumerPass = (options?: OptionCallback) =>
    this.props.fetchNonCompatiblePrivateConsumerPass(
      this.state.private_booking_data.private_slot,
      { member: this.state.member.id, date: this.state.date_start },
      options,
    );

  fetchIncompatibilitiesReasonsBySlotByConsumerPass = (
    private_consumer_pass_id: number,
    privateSlotId: number,
    options: OptionCallback,
  ) =>
    this.props.fetchIncompatibilitiesReasonsBySlotByConsumerPass(
      private_consumer_pass_id,
      privateSlotId,
      this.state.date_start,
      options,
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

  registerPrivateBooking = (
    private_consumer_pass_id: number | null,
    options: OptionCallback,
  ) => {
    this.props.registerPrivateBooking(
      {
        ...this.state.private_booking_data,
        private_consumer_pass: private_consumer_pass_id,
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
    const date_start = DateTime.fromISO(this.state.date_start).setZone(
      this.props.timezone,
    );
    this.props.createRecurrentRule(
      {
        nb_of_weeks: this.state.nb_of_weeks,
        hour: date_start.hour,
        minute: date_start.minute,
        day_of_week: date_start.weekday - 1,
        start_from_date: date_start.toISODate(),
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
          open
          country={this.props.country}
          createMember={this.props.createMember}
          // @ts-expect-error
          generalTermsAndConditions={this.props.generalTermsAndConditions}
          handlMemberSelected={(id: number, member: Member) =>
            this.setState({
              // @ts-expect-error
              member: { ...member, consumer: member.consumer?.consumer },
            })
          }
          onClose={this.onClose}
          searchedMembers={this.props.searchedMembers.filter(
            // @ts-expect-error
            (m) => m.id !== this.props.id,
          )}
          searchMembers={this.props.searchMembers}
          // @ts-expect-error
          waiver={this.props.waiver}
        />
      );
    }

    const missingResources = this.missingResourceConf();
    const coachIdToFilterList = this.props.coachesSelectedInRole?.map(
      (coach: Coach) => coach.id,
    );
    const privateServiceList =
      coachIdToFilterList?.length > 0
        ? this.props.private_services.filter(
            (ps: any) =>
              ps.coaches &&
              ps.coaches.length > 0 &&
              ps.coaches.some(
                (coach: Coach) =>
                  coach && coach.id && coachIdToFilterList.includes(coach.id),
              ),
          )
        : this.props.private_services;
    return (
      <GenericResponsiveDrawer
        onClose={this.onClose}
        open={open}
        title={`${formatAsDatetimeAdapted(
          this.state.date_start,
          'DDDD t',
          this.props.timezone,
        )}`}
      >
        <div className={this.props.classes.innerDialog}>
          <MemberMinimalListItem
            bottomCredit
            // @ts-expect-error
            member={this.state.member}
          />
          <DateTimeForm
            onChange={(date_start: DateTime) =>
              this.setState({ date_start: date_start.toISO() })
            }
            timezone={this.props.timezone}
            value={DateTime.fromISO(this.state.date_start)}
          />
          <Divider className={this.props.classes.divider} />
          <fieldset className={this.props.classes.fieldset}>
            <legend>{t('bookerModule.step.configuration')}</legend>
            <SlotSearcherParams
              asManager
              coachUnique
              establishmentUnique
              coachesSelectedInRole={this.props.coachesSelectedInRole}
              dateStart={this.state.date_start}
              onConfigurationChange={this.handleConfigurationChange}
              private_services={privateServiceList}
              resourceAllocationChecker={resourceAllocationCheckerAPI}
            />
            <MissingResourceForBookingHelper
              address={this.state.private_booking_data.address}
              missingResources={missingResources}
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
              {/* TODO: Check why validation is not performed */}
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
                  billMemberPrivatePass={(ppId: number) =>
                    this.props.billMemberPrivatePass(this.state.member.id, ppId)
                  }
                  compatiblePrivateConsumerPass={
                    this.props.compatiblePrivateConsumerPass
                  }
                  compatiblePrivatePass={this.props.compatiblePrivatePass}
                  compatibleWithUnpaidBooking={
                    this.props.compatibleWithUnpaidBooking
                  }
                  // @ts-expect-error
                  createRecurrentRule={this.createRecurrentRule}
                  fetchIncompatibilitiesReasonsBySlotByConsumerPass={
                    this.fetchIncompatibilitiesReasonsBySlotByConsumerPass
                  }
                  fetchNonCompatiblePrivateConsumerPass={
                    this.fetchNonCompatiblePrivateConsumerPass
                  }
                  fetchPass={this.fetchPass}
                  goToPrivatePass={this.props.goToPrivatePass}
                  incompatibilitiesReasons={this.props.incompatibilitiesReasons}
                  nonCompatiblePrivateConsumerPass={
                    this.props.nonCompatiblePrivateConsumerPass
                  }
                  nonCompatiblePrivateConsumerPassIsLoading={
                    this.props.nonCompatiblePrivateConsumerPassIsLoading
                  }
                  privateSlot={this.state.private_booking_data.private_slot}
                  privateSlotCredit={
                    this.state.private_booking_data.privateSlotCredit
                  }
                  recurrenceRule={this.props.recurrenceRule}
                  registerPrivateBooking={this.registerPrivateBooking}
                  registerUnPaidPrivateBooking={
                    this.registerUnPaidPrivateBooking
                  }
                />
              </fieldset>
            )}
        </div>
        <DialogActions>
          <Button onClick={this.onClose}>{t('bookerModule.cancel')}</Button>
        </DialogActions>
        <PrivateBookingWarningTagDialog
          onCancel={this.onClose}
          onConfirm={this.props.setIncompatibleTagsDialogClose}
          open={this.props.incompatibleTagsDialogOpen}
        />
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
  coachesSelectedInRole: getCoachesSelectedInRole(state),
  private_services: getAvailablePrivateServices(state),
  compatiblePassLoading:
    state.privateService.privatePass.loading ||
    state.privateService.privateConsumerPass.loading,
  compatiblePrivatePass: getPrivatePassAvailableForPrivateBooking(state),
  compatiblePrivateConsumerPass: getPrivateConsumerPassList(state),
  nonCompatiblePrivateConsumerPass:
    getPrivateConsumerPassNonCompatibleList(state),
  nonCompatiblePrivateConsumerPassIsLoading:
    getPrivateConsumerPassNonCompatibleIsLoading(state),
  timezone: state.theme.theme.timezone_name,
  processing: state.privateService.privateBooking.createOrUpdate.loading,
  country: getLocaleCountry(state.theme.theme.locale),
  searchedMembers: getSearchedMembers(state),
  compatibleWithUnpaidBooking: getUnPaidBookingAvailabilityForPrivateslot(
    state,
    requestedPrivateSlot,
  ),
  incompatibilitiesReasons: getConsumerPassIncompatibilitiesReasons(state),
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
  fetchNonCompatiblePrivateConsumerPass:
    fetchNonCompatiblePrivateConsumerPassAction,
  fetchIncompatibilitiesReasonsBySlotByConsumerPass:
    fetchIncompatibilitiesReasonsBySlotByConsumerPassAction,
  resetIncompatibilitiesReasonsBySlotByConsumerPass:
    resetIncompatibilitiesReasonsBySlotByConsumerPassAction,
  pushRouter: push,
  checkPrivateServiceTagEligibility,
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
  incompatibleTagsDialogOpen: boolean;
};

const withStateHandlersInit: StateHandlerInit = {
  notify_member: true,
  recurrenceRule: false,
  requestedPrivateSlot: null,
  is_overriding_availabilities: false,
  allow_unpaid: false,
  incompatibleTagsDialogOpen: false,
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
  setIncompatibleTagsDialogOpen:
    () => (incompatibleTagsDialogOpen: boolean) => {
      return { incompatibleTagsDialogOpen };
    },
  setIncompatibleTagsDialogClose: () => () => {
    return { incompatibleTagsDialogOpen: false };
  },
};

const mapWithHandlers = {
  billMemberPrivatePass: () => (memberId: number, privatePassId: number) =>
    openNewBackOfficeWindow(
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
      props.fetchCompatiblePrivatePass(privateSlotId, {
        ...(props.shouldDisplayNewSubscriptionContracts && {
          from_subscription: false,
        }),
      });
      props.fetchCompatiblePrivateConsumerPass(privateSlotId, {
        member: memberId,
        date,
      });
    },
  createMember:
    (props: OwnAndConnectedProps) => (values: any, options: any) => {
      if (!values.birthday) {
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

  goToPrivatePass:
    ({ pushRouter }: { pushRouter: (url: string) => void }) =>
    (privatePassId: number) => {
      pushRouter(`/private-service/pass/${privatePassId}`);
    },
};

export default compose<any, OwnProps>(
  withTranslation(['privateService']),
  withStyles(styles),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withFeatureFlags,
  withHandlers(mapWithHandlers),
)(PrivateBookingBooker);
