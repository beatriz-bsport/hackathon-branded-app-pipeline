import React from 'react';
import { ButtonBase, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

import moment from 'moment-timezone';

// @ts-ignore
import CoachChip from '../../../../../libs/associated-coach/components/CoachChip.component';
import { Establishment } from '../../../../../libs/establishment/types';
import { Coach } from '../../../../../libs/associated-coach/types';

type Props = {
  coach: Coach | null;
  establishment: Establishment;
  timezoneName: string;
  durationMinutes: number;
  onSessionSelect: (
    session: string,
    establishmentId?: number | null,
    coachId?: number | null,
  ) => void;
  sessions: string[];
};

const SessionForCoachSelector: React.FC<Props> = (props) => {
  const classes = useStyles();

  if (!props.sessions.length) {
    return null;
  }

  return (
    <div
      className={`${classes.container} ${
        props.coach?.id ? classes.containerWithCoach : ''
      }`}
    >
      {!!props.coach?.id && (
        <div className={classes.coachContainer}>
          <CoachChip coach={props.coach} />
        </div>
      )}

      <div className={classes.sessionsContainer}>
        {props.sessions.map((session) => {
          const start = moment(session).tz(props.timezoneName).format('HH:mm');

          const end = `${moment(session)
            .tz(props.timezoneName)
            .add(props.durationMinutes, 'minutes')
            .format('HH:mm')}`;

          return (
            <div className={classes.sessionItemContainer} key={session}>
              <ButtonBase
                className={classes.sessionItem}
                onClick={() =>
                  props.onSessionSelect(
                    session,
                    props.establishment?.id,
                    props.coach?.id,
                  )
                }
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography variant="subtitle2">{start}</Typography>
                  <Typography variant="subtitle2">{`➔ ${end}`}</Typography>
                </div>
              </ButtonBase>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  containerWithCoach: {
    marginLeft: theme.spacing(1),
    borderStyle: 'solid',
    borderWidth: 0,
    borderLeftWidth: 5,
    borderColor: theme.palette.primary.main,
  },
  coachContainer: {
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  sessionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    paddingBottom: theme.spacing(1),
  },
  sessionItemContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(0.5),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  sessionItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    padding: theme.spacing(1),
    borderColor: 'lightgrey',
    borderRadius: 5,
  },
  timeIcon: {
    marginLeft: theme.spacing(1),
  },
}));

export default SessionForCoachSelector;
