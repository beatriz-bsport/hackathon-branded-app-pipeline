import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
  GenericEvent,
  EventListParams,
  MemberEvent,
} from '#src/libs/event/types';
import EventPanel from '#src/libs/event/components/EventPanel.component';
import { OptionCallback } from '../../../state/types';
import { COMPANY_EVENTS } from '../events.utils';

type Props = {
  eventList: Array<GenericEvent<MemberEvent>>;
  eventListLoading: boolean;
  eventListPage: number;
  fetchEventList: (params: EventListParams, options: OptionCallback) => void;
  memberId: number;
  onEventClick: (event: GenericEvent<MemberEvent>) => void;
};

const MemberEventPanel: React.FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <Paper className={classes.panelContainer}>
      <EventPanel
        eventList={props.eventList}
        eventSpec={COMPANY_EVENTS}
        extraFetchParams={{ object_id: props.memberId }}
        fetchEventList={props.fetchEventList}
        loading={props.eventListLoading}
        onEventClick={props.onEventClick}
        page={props.eventListPage}
      />
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  panelContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default React.memo(MemberEventPanel);
