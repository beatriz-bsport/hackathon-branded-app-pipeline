// @flow
import moment from 'moment-timezone';
import React from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';

import { fetchAssociatedEstablishmentBulk } from '../../establishment/actions';
import { fetchAssociatedCoachBulk } from '../../associated-coach/actions';
import SlotSearcherParams from '../components/slot-searcher/SlotSearcherParams.component';
import RecurrenceRulePrivateBookingFields from '../components/booking/RecurrenceRulePrivateBookingFields.component';
import type { PrivateService, RecurrenceRulePrivateBooking } from '../types';
import { getAvailablePrivateServices } from '../selectors/private-service';
import {
  createOrUpdateRecurrenceRulePrivateBooking,
  fetchAllPrivateServices as fetchAllPrivateServicesAction,
  fetchAllPrivateSlots as fetchAllPrivateSlotsAction,
} from '../actions';
import MissingResourceForBookingHelper from '../components/MissingResourceForBookingHelper.component';
import { getMissingResourceForBooking } from '../utils';
import { RecurrenceRulePrivateBookingUpdateDialog } from '../components/booking/RecurrenceRulePrivateBookingConfirmDialog.component';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

type Props = {
  open: boolean,
  setOpen: (boolean) => void,
  memberId: number,
  onChange: () => void,
  initial?: RecurrenceRulePrivateBooking,

  t: TFunction,
  createOrUpdateRecurrentRule: (data: any, options: OptionCallback) => void,
  private_services: Array<PrivateService>,
  privateServicesLoading: boolean,
  fetchAllPrivateServices: (OptionCallback) => void,
  fetchEstablishmentBulk: (establishments: Array<number>) => void,
  fetchCoachBulk: (coaches: Array<number>) => void,
  fetchAllPrivateSlots: () => void,
  updateDialogOpen: boolean,
  setUpdateDialogOpen: (boolean) => void,
};

type State = {
  configuration: {
    private_service: number,
    private_slot: number,
    coach: number,
    establishment: number,
  },
  time_setting: {
    nb_of_weeks: number,
    day_of_week: number,
    hour: number,
    minute: number,
  },
  notify_if_booked: boolean,
};

export class RecurrenceRulePrivateBooker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.initial) {
      this.state = {
        configuration: {
          private_service: props.initial.private_slot.private_service,
          private_slot: props.initial.private_slot.id,
          coach: props.initial.associated_coach
            ? props.initial.associated_coach.id
            : null,
          establishment: props.initial.associated_establishment
            ? props.initial.associated_establishment.id
            : null,
        },
        time_setting: {
          nb_of_weeks: props.initial.nb_of_weeks,
          day_of_week: props.initial.day_of_week,
          hour: props.initial.hour,
          minute: props.initial.minute,
          start_from_date: props.initial.start_from_date,
        },
        notify_if_booked: props.initial.notify_if_booked,
      };
    } else {
      this.state = {
        configuration: {
          private_service: null,
          private_slot: null,
          coach: null,
          establishment: null,
        },
        time_setting: {
          nb_of_weeks: 4,
          day_of_week: 0,
          hour: 11,
          minute: 0,
          start_from_date: moment().format('YYYY-MM-DD'),
        },
        notify_if_booked: false,
      };
    }
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

  handleConfigurationChange = (configuration: any) => {
    const { coach, establishment, private_slot, private_service } =
      configuration;
    this.setState({
      configuration: {
        coach,
        establishment,
        private_slot,
        private_service,
      },
    });
  };

  handleTimeSettingChange = (time_setting: any) => {
    const { nb_of_weeks, day_of_week, hour, minute, start_from_date } =
      time_setting;
    this.setState({
      time_setting: {
        nb_of_weeks,
        day_of_week,
        hour,
        minute,
        start_from_date,
      },
    });
  };

  handleNotifyBooked = (notify_if_booked: boolean) => {
    this.setState({
      notify_if_booked,
    });
  };

  missingResourceConf = () => {
    const private_service = this.props.private_services.find(
      (p) => p.id === this.state.configuration.private_service,
    );
    return getMissingResourceForBooking(
      private_service,
      this.state.configuration,
      true,
    );
  };

  handleSubmit = (options: OptionCallback) => {
    this.props.createOrUpdateRecurrentRule(
      {
        ...this.state.time_setting,
        private_slot: this.state.configuration.private_slot,
        coach: this.state.configuration.coach,
        establishment: this.state.configuration.establishment,
        member: this.props.memberId,
        notify_if_booked: this.state.notify_if_booked,
      },
      {
        onSuccess: () => {
          if (options && options.onSuccess) options.onSuccess();
          this.props.onChange();
        },
      },
    );
    this.props.setOpen(false);
  };

  render() {
    const { t } = this.props;
    if (!this.props.memberId) {
      return null;
    }
    const missingResources = this.missingResourceConf();
    return (
      <div>
        <Dialog open={this.props.open}>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              if (this.props.initial) this.props.setUpdateDialogOpen(true);
              else this.handleSubmit();
            }}
          >
            <DialogTitle>{t('recurrenceRule.form.title')}</DialogTitle>
            <DialogContent>
              <fieldset>
                <legend>{t('recurrenceRule.form.configuration')}</legend>
                {this.props.privateServicesLoading ? (
                  <LinearProgress />
                ) : (
                  <SlotSearcherParams
                    private_services={this.props.private_services}
                    private_service={this.state.configuration.private_service}
                    private_slot={this.state.configuration.private_slot}
                    coach={this.state.configuration.coach}
                    establishment={this.state.configuration.establishment}
                    onConfigurationChange={this.handleConfigurationChange}
                    coachUnique
                    establishmentUnique
                    asManager
                  />
                )}
                {!this.props.initial && (
                  <MissingResourceForBookingHelper
                    missingResources={missingResources}
                    address={this.state.configuration.address}
                    updateData={(data) =>
                      this.setState((prevState) => ({
                        configuration: {
                          ...prevState.configuration,
                          ...data,
                        },
                      }))
                    }
                  />
                )}
              </fieldset>
              <fieldset style={{ marginTop: 24, marginBottom: 24 }}>
                <legend>{t('recurrenceRule.form.timeGroup')}</legend>
                <RecurrenceRulePrivateBookingFields
                  privateSlotSet={false}
                  onTimeSettingChange={this.handleTimeSettingChange}
                  selectedSetting={this.state.time_setting}
                />
              </fieldset>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.notify_if_booked}
                    onChange={(ev) =>
                      this.handleNotifyBooked(ev.target.checked)
                    }
                  />
                }
                label={t('recurrenceRule.form.notify_member')}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.props.setOpen(false)}
                color="secondary"
              >
                {t('recurrenceRule.actions.close')}
              </Button>
              <Button
                disabled={!this.state.configuration.private_slot}
                color="primary"
                type="submit"
              >
                {t('recurrenceRule.actions.save')}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <RecurrenceRulePrivateBookingUpdateDialog
          recurrentRuleId={
            this.props.updateDialogOpen ? this.props.initial.id : null
          }
          onClose={() => this.props.setUpdateDialogOpen(false)}
          onChange={() => {
            this.handleSubmit();
            this.props.setUpdateDialogOpen(false);
          }}
        />
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ initial: 'initial:RecurrenceRulePrivateBooking' }),
  withTranslation(['privateService']),
  withState('updateDialogOpen', 'setUpdateDialogOpen', false),
  connect(
    (state) => ({
      privateServicesLoading: state.privateService.privateService.loading,
      private_services: getAvailablePrivateServices(state),
    }),
    {
      fetchAllPrivateServices: (options) =>
        fetchAllPrivateServicesAction({ mine: true }, options),
      fetchAllPrivateSlots: () => fetchAllPrivateSlotsAction({ mine: true }),
      fetchEstablishmentBulk: fetchAssociatedEstablishmentBulk,
      fetchCoachBulk: fetchAssociatedCoachBulk,
      createOrUpdateRecurrentRule: createOrUpdateRecurrenceRulePrivateBooking,
    },
  ),
  withHandlers({
    createOrUpdateRecurrentRule:
      ({ initial, createOrUpdateRecurrentRule }) =>
      (data, options) => {
        if (initial) {
          createOrUpdateRecurrentRule(
            { ...data, id: initial.id },
            {
              onSuccess: (b) => {
                if (options && options.onSuccess) options.onSuccess(b);
              },
            },
          );
        } else {
          createOrUpdateRecurrentRule(data, {
            onSuccess: (b) => {
              if (options && options.onSuccess) options.onSuccess(b);
            },
          });
        }
      },
  }),
)(RecurrenceRulePrivateBooker);
