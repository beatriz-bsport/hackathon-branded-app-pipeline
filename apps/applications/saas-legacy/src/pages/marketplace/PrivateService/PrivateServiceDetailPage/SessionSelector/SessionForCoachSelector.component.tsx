import React from 'react';
import { DateTime } from 'luxon';
import { ButtonBase, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization.js';
import CoachChip from '#src/libs/associated-coach/components/CoachChip.component';
import { Establishment } from '#src/libs/establishment/types';
import { Coach } from '#src/libs/associated-coach/types';

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
  coachDisplay?: MarketPlaceCoachDisplay;
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
          <CoachChip
            coach={props.coach}
            coachDisplay={props.coachDisplay}
            loading={false}
          />
        </div>
      )}

      <div className={classes.sessionsContainer}>
        {props.sessions.map((session) => {
          const start = DateTime.fromISO(session)
            .setZone(props.timezoneName)
            .toLocaleString(DateTime.TIME_SIMPLE);

          const datetimeEnd = DateTime.fromISO(session)
            .setZone(props.timezoneName)
            .plus({ minutes: props.durationMinutes });

          const end = datetimeEnd.toLocaleString(DateTime.TIME_SIMPLE);

          return (
            <div key={session} className={classes.sessionItemContainer}>
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

export default React.memo(SessionForCoachSelector);
