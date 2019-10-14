// @flow
import React from 'react';

import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Popover from '@material-ui/core/Popover';
import CancelIcon from '@material-ui/icons/Cancel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckIcon from '@material-ui/icons/Check';

// import type { TFunction } from 'react-i18next';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick

import './main.scss';
import i18n from '../../i18n';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { getCoachAvailabilitySlots } from '../../libs/private-service/selectors/availability-slot';
import {
  fetchAvailabilitySlots,
  disableCoachAvailabilitySlot,
  enableCoachAvailabilitySlot,
} from '../../libs/private-service/actions';

type Props = {
  classes: Object,
  fetchAvailabilitySlots: (data: { coach: number }) => void,
  availabilitySlots: Array<AvailabilitySlot>,
  coachId: ?number,
  disableCoachAvailabilitySlot: (
    coachId: number,
    {
      date_start: string,
      date_end: string,
    },
    {
      onSuccess?: () => void,
      onError?: () => void,
    },
  ) => void,
  enableCoachAvailabilitySlot: (
    coachId: number,
    {
      date_start: string,
      date_end: string,
    },
    {
      onSuccess?: () => void,
      onError?: () => void,
    },
  ) => void,
};

const styles = (theme) => ({
  container: {},
  leftIcon: { marginRight: theme.spacing.unit },
});

const AvailabilitySlotForm = withNamespaces(['privateService'])(
  withStyles(styles)((props: { selectInfo: Object }) => {
    return (
      <List>
        <ListItem button onClick={props.onEnableAvailability}>
          <ListItemIcon color="primary">
            <CheckIcon className={props.classes.leftIcon} />
          </ListItemIcon>
          <ListItemText
            primary={props.t('privateService.enableAvailability')}
          />
        </ListItem>
        <ListItem button onClick={props.onDisableAvailability}>
          <ListItemIcon>
            <CancelIcon className={props.classes.leftIcon} />
          </ListItemIcon>
          <ListItemText
            primary={props.t('privateService.disableAvailability')}
          />
        </ListItem>
      </List>
    );
  }),
);

export class CoachPrivateCalendar extends React.Component<Props> {
  state = {
    selectInfo: null,
  };

  select = (eventSlotSelected) => {
    this.setState({
      eventSlotSelected,
    });
  };

  getAvailableSlotAsEvents = () => {
    return this.props.availabilitySlots.map((slot) => ({
      start: slot.date_start,
      end: slot.date_end,
      description: slot.id,
      name: slot.id,
    }));
  };

  componentDidMount() {
    this.props.fetchAvailabilitySlots({ coach: this.props.coachId });
  }

  onDisableAvailability = () => {
    const { startStr, endStr } = this.state.eventSlotSelected;
    this.props.disableCoachAvailabilitySlot(
      this.props.coachId,
      {
        date_start: startStr,
        date_end: endStr,
      },
      {
        onSuccess: () => {
          this.props.fetchAvailabilitySlots({ coach: this.props.coachId });
          this.setState({ eventSlotSelected: null });
        },
      },
    );
  };

  onEnableAvailability = () => {
    const { startStr, endStr } = this.state.eventSlotSelected;
    this.props.enableCoachAvailabilitySlot(
      this.props.coachId,
      {
        date_start: startStr,
        date_end: endStr,
      },
      {
        onSuccess: () => {
          this.props.fetchAvailabilitySlots({ coach: this.props.coachId });
          this.setState({ eventSlotSelected: null });
        },
      },
    );
  };

  calendarRef = React.createRef();

  render() {
    const { classes } = this.props;
    const events = [...this.getAvailableSlotAsEvents()];
    return (
      <div className={classes.container}>
        <FullCalendar
          defaultView="timeGridWeek"
          plugins={[interactionPlugin, timeGridPlugin]}
          editable
          selectable
          ref={this.calendarRef}
          select={this.select}
          events={events}
          locale={i18n.lng}
          minTime="06:00:00"
          maxTime="23:00:00"
          allDaySlot={false}
        />
        <Popover
          open={!!this.state.eventSlotSelected}
          anchorEl={
            this.state.eventSlotSelected
              ? this.state.eventSlotSelected.jsEvent.target
              : null
          }
          onClose={() => this.setState({ eventSlotSelected: null })}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <AvailabilitySlotForm
            selectInfo={this.state.selectInfo}
            onDisableAvailability={this.onDisableAvailability}
            onEnableAvailability={this.onEnableAvailability}
          />
        </Popover>
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ coachId: 'coachId:number' }),
  withStyles(styles),
  withNamespaces(['privateService']),
  connect(
    (state, { coachId }) => ({
      availabilitySlots: getCoachAvailabilitySlots(state, coachId),
    }),
    {
      fetchAvailabilitySlots,
      disableCoachAvailabilitySlot,
      enableCoachAvailabilitySlot,
    },
  ),
)(CoachPrivateCalendar);
