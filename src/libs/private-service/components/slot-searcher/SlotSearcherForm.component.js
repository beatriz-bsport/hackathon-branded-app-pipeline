// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {
  MuiPickersUtilsProvider,
  Calendar,
  BasePicker,
} from 'material-ui-pickers';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { RESOURCE_ATTRIBUTION_CONSUMER } from '@bsport/common/lib/master-data/resource-attribution-methods';
import PrivateSlotSelector from '../PrivateSlotSelector.component';
import CoachSelector from '../../../associated-coach/components/CoachSelector.component';
import EstablishmentSelector from '../../../establishment/components/EstablishmentSelector.component';
import type { PrivateService, PrivateSlot } from '../../types';

type Props = {
  private_services: Array<PrivateService>,
  classes: Object,
  t: TFunction,
  searchAvailableSlots: (
    service_selected: number,
    slot_selected: number,
    coaches_selected: number,
    date_selected: string,
  ) => void,

  onPrivateServiceChange: (?PrivateService) => void,
  onPrivateSlotChange: (?PrivateSlot) => void,
  onCoachChange: (Array<Coach>) => void,
  onDateChange: (Object) => void,
};

type State = {
  service_selected: ?PrivateService,
  slot_selected: ?PrivateSlot,
  coaches_selected: ?AssociatedCoach,
  date_selected: ?string,
};

export class PrivateServiceBooker extends React.Component<Props, State> {
  state = {
    slot_selected: null,
    service_selected: null,
    coaches_selected: null,
    establishments_selected: [],
    date_selected: moment().format('YYYY-MM-DD'),
  };

  selectSlotOption = (slotOption: { value: number, label: string }) => {
    if (!slotOption) {
      this.handleCoachChange(null);
      this.handleEstablishmentChange(null);
      this.handleServiceChange(null);
      this.handleSlotChange(null);
      return;
    }
    const { value } = slotOption;
    const service_selected = this.props.private_services.find((ps) =>
      ps.slots.map((s) => s.id).includes(value),
    );
    const slot_selected = service_selected.slots.find((s) => s.id === value);
    if (service_selected && service_selected.coaches.length === 1) {
      this.handleCoachChange(service_selected.coaches);
    } else {
      this.handleCoachChange(null);
    }
    if (service_selected && service_selected.establishments.length === 1) {
      this.handleEstablishmentChange(service_selected.establishments);
    } else {
      this.handleEstablishmentChange(null);
    }
    this.handleServiceChange(service_selected.id);
    this.handleSlotChange(slot_selected);
  };

  handleCoachChange = (coaches_selected: Array<Option>) => {
    if (coaches_selected && coaches_selected.length > 0) {
      this.setState({ coaches_selected: coaches_selected.map((o) => o.value) });
      this.props.onCoachChange(coaches_selected.map((o) => o.value));
    } else {
      this.setState({ coaches_selected: [] });
      this.props.onCoachChange([]);
    }
  };

  handleEstablishmentChange = (establishments_selected: Array<Option>) => {
    if (establishments_selected && establishments_selected.length > 0) {
      this.setState({
        establishments_selected: [
          establishments_selected[establishments_selected.length - 1].value,
        ],
      });
    } else {
      this.setState({ establishments_selected: [] });
    }
  };

  handleDateChange = (date_selected: Object) => {
    this.setState({
      date_selected: date_selected.format('YYYY-MM-DD'),
    });
    this.props.onDateChange(date_selected);
    this.doSearch(date_selected);
  };

  handleServiceChange = (service_selected_id: ?number) => {
    const service_selected = this.props.private_services.find(
      (ps) => ps.id === service_selected_id,
    );
    this.setState({ service_selected });
    this.props.onPrivateServiceChange(service_selected);
  };

  handleSlotChange = (slot_selected: ?PrivateSlot) => {
    this.setState({ slot_selected });
    this.props.onPrivateSlotChange(slot_selected);
  };

  doSearch = (date_selected) => {
    const { service_selected, slot_selected, coaches_selected } = this.state;
    if (service_selected && slot_selected && this.props.searchAvailableSlots) {
      this.props.searchAvailableSlots(
        service_selected.id,
        slot_selected.id,
        coaches_selected,
        date_selected || this.state.date_selected,
      );
    }
  };

  getResourceState = () => {
    return {
      coachResourceState: {
        needChoice: false,
        canSelect:
          this.state.service_selected &&
          this.state.service_selected.coaches.length >= 1 &&
          this.state.service_selected.coach_attribution ===
            RESOURCE_ATTRIBUTION_CONSUMER,

        hasChosen: !!this.state.establishments_selected.length,
      },
      establishmentResourceState: {
        needChoice:
          this.state.service_selected &&
          this.state.service_selected.establishments.length > 1 &&
          this.state.service_selected.establishment_attribution ===
            RESOURCE_ATTRIBUTION_CONSUMER,
        canSelect:
          this.state.service_selected &&
          this.state.service_selected.establishments.length >= 1 &&
          this.state.service_selected.establishment_attribution ===
            RESOURCE_ATTRIBUTION_CONSUMER,

        hasChosen: !!this.state.establishments_selected.length,
      },
    };
  };

  render() {
    const { t, classes } = this.props;
    const {
      coachResourceState,
      establishmentResourceState,
    } = this.getResourceState();
    return (
      <div className={this.props.classes.container}>
        <Typography variant="h6" className={classes.sectionTitle}>
          {t('slotSearcher.title')}
        </Typography>
        <PrivateSlotSelector
          onChange={this.selectSlotOption}
          onServiceChange={this.handleServiceChange}
          placeholder={t('slotSearcher.selectPrivateSlot')}
          privateServices={this.props.private_services}
        />
        {establishmentResourceState.needChoice ||
        establishmentResourceState.canSelect ? (
          <EstablishmentSelector
            disabled={
              this.state.service_selected &&
              this.state.service_selected.establishments.length === 1
            }
            establishments={
              this.state.service_selected
                ? this.state.service_selected.establishments.filter((c) => !!c)
                : []
            }
            helperText={this.props.t('slotSearcher.selectEstablishment')}
            selectedEstablishments={this.state.establishments_selected}
            selectOption={this.handleEstablishmentChange}
          />
        ) : null}
        {coachResourceState.canSelect ? (
          <CoachSelector
            placeholder={t('slotSearcher.selectCoach')}
            selectedCoaches={this.state.coaches_selected || []}
            isDisabled={
              !coachResourceState.canSelect ||
              (this.state.service_selected &&
                this.state.service_selected.coaches.length === 1)
            }
            selectOption={this.handleCoachChange}
            coaches={
              this.state.service_selected
                ? this.state.service_selected.coaches.filter((c) => !!c)
                : []
            }
          />
        ) : null}
        {this.props.onDateChange || this.props.searchAvailableSlots ? (
          <MuiPickersUtilsProvider
            utils={MomentUtils}
            moment={moment}
            locale={moment.locale()}
          >
            <BasePicker
              value={this.state.date_selected}
              onChange={this.handleDateChange}
            >
              {() => (
                <div className="picker">
                  <Paper style={{ overflow: 'hidden' }}>
                    <Calendar
                      disablePast
                      disableFuture={
                        !(
                          this.state.service_selected &&
                          this.state.slot_selected
                        )
                      }
                      date={moment(this.state.date_selected, 'YYYY-MM-DD')}
                      onChange={this.handleDateChange}
                    />
                  </Paper>
                </div>
              )}
            </BasePicker>
          </MuiPickersUtilsProvider>
        ) : null}
        {this.props.searchAvailableSlots ? (
          <div className={classes.buttonContainer}>
            <Button
              variant="outlined"
              disabled={
                !this.state.service_selected ||
                !this.state.slot_selected ||
                !this.state.date_selected ||
                (coachResourceState.needChoice &&
                  !coachResourceState.hasChosen) ||
                (establishmentResourceState.needChoice &&
                  !establishmentResourceState.hasChosen)
              }
              onClick={() => this.doSearch()}
            >
              <SearchIcon className={classes.leftIcon} />
              {t('slotSearcher.search')}
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing.unit * 32,
    maxWidth: 360,
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: theme.spacing.unit * 2,
  },
  sectionTitle: {
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(PrivateServiceBooker);
