import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import CoachChip from '#src/libs/associated-coach/components/CoachChip.component';
import { DateTime, Duration, Interval } from 'luxon';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';
import { chunkIntervalsByDuration } from '#src/libs/private-service/interval-utils';
import type { Coach } from '#src/libs/associated-coach/types';
import type { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';

type Props = {
  coach?: Coach | null;
  coachDisplay?: MarketPlaceCoachDisplay;
  duration: Duration;
  onSessionSelect: (
    session: string,
    establishmentId?: number | null,
    coachId?: number | null,
  ) => () => void;
  sessions: Interval[];
};

const SessionListItem: React.FC<Props> = ({
  coach,
  coachDisplay,
  duration,
  onSessionSelect,
  sessions,
}) => {
  const classes = useStyles();

  const { activeEstablishment, selectedPrivateSlot } =
    useContext(SlotSelectorContext);

  if (!sessions || !sessions.length) return null;
  const chunkedSessions = chunkIntervalsByDuration(
    sessions,
    duration,
    selectedPrivateSlot?.booking_interval_minutes,
  );
  if (!chunkedSessions?.length) return null;
  return (
    <div
      className={classNames(classes.container, {
        [classes.containerWithCoach]: !!coach?.id,
      })}
    >
      {!!coach?.id && (
        <div className={classes.coachContainer}>
          <CoachChip
            coach={coach}
            coachDisplay={coachDisplay}
            loading={false}
          />
        </div>
      )}
      <div className={classes.sessionsContainer}>
        {chunkedSessions.map((session) => (
          <div
            key={session.start.toISO()}
            className={classes.sessionItemContainer}
          >
            <ButtonBase
              className={classes.sessionItem}
              onClick={onSessionSelect(
                session.start.toISO(),
                activeEstablishment?.id,
                coach?.id,
              )}
            >
              <div className={classes.sessionItemContent}>
                <Typography variant="subtitle2">
                  {session.start.toLocaleString(DateTime.TIME_SIMPLE)}
                </Typography>
                <Typography variant="subtitle2">
                  {`➔ ${session.end.toLocaleString(DateTime.TIME_SIMPLE)}`}
                </Typography>
              </div>
            </ButtonBase>
          </div>
        ))}
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
    padding: theme.spacing(1, 0.5, 1, 1),
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
  sessionItemContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

export default React.memo(SessionListItem);
