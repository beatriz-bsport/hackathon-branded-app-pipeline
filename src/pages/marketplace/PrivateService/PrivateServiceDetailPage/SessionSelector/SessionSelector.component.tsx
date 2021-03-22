import React, { useCallback, useEffect, useState } from 'react';
import { Fade, Typography, Tab, Tabs, Paper } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import flatten from 'lodash/flatten';
import intersection from 'lodash/intersection';
import { useTranslation } from 'react-i18next';

import SessionForCoachSelector from './SessionForCoachSelector.component';
import {
  groupSessionsByDayMoment,
  splitIntervalList,
  // @ts-ignore
} from '../../../../../libs/private-service/utils';
import { ArrayElement } from '../../../../../utils/types';
import { Establishment } from '../../../../../libs/establishment/types';
import { Coach } from '../../../../../libs/associated-coach/types';

type SessionMoment = ArrayElement<ReturnType<typeof groupSessionsByDayMoment>>;

type Props = {
  sessionMoment: SessionMoment;
  coaches: Coach[];
  establishments: Establishment[];
  showCoach: boolean;
  showEstablishment: boolean;
  duration: number;
  timezoneName: string;
  durationMinutes: number;
  bookingIntervalMinutes: number;
  onSessionSelect: (
    session: string,
    establishment: number | null,
    coach: number | null,
  ) => void;
  availabilitySlot: {
    resource_identifier: string;
    slots: Array<Array<string>>;
  }[];
};

const SessionSelector: React.FC<Props> = (props) => {
  const getSessionsForCoachAndEstablishment = useCallback(
    (coach: Coach, establishment: Establishment) => {
      /**
       * Hold a list of ressources idenfitiers
       */
      const resourceIdentifierListSelected: string[] = [];

      if (props.showCoach && coach) {
        resourceIdentifierListSelected.push(
          `associated_coach:${coach.associated_coach_id}`,
        );
      }

      if (props.showEstablishment && establishment) {
        resourceIdentifierListSelected.push(
          `associated_establishment:${establishment.associatedestablishment_set[0]}`,
        );
      }

      /**
       * An Array of array of sessions for each resource identifier
       */
      const sessionsListByIdentifier = resourceIdentifierListSelected.map(
        (resourceName) => {
          const slotsByIdentifier = flatten(
            props.availabilitySlot
              .filter((a) => a.resource_identifier === resourceName)
              .map((a) => a.slots),
          );

          return splitIntervalList(
            slotsByIdentifier,
            props.durationMinutes,
            props.bookingIntervalMinutes,
          );
        },
      );

      const sessions = (sessionsListByIdentifier || []).reduce(
        (acc, slotGroup) => intersection(slotGroup, acc),
        props.sessionMoment.list,
      );

      return sessions;
    },
    [
      props.showCoach,
      props.showEstablishment,
      props.durationMinutes,
      props.bookingIntervalMinutes,
      props.sessionMoment,
    ],
  );

  const getEstablishmentWithSession = () => {
    let coaches: Array<Coach | null> = [null];

    if (props.showCoach) {
      /* eslint-disable */
      coaches = props.coaches;
      /* eslint-enable */
    }

    if (!props.establishments) {
      return [];
    }

    const establishments = props.establishments.filter((establishment) => {
      let sessions: string[] = [];
      coaches.forEach((c) => {
        sessions = [
          ...sessions,
          ...getSessionsForCoachAndEstablishment(c, establishment),
        ];
      });

      return sessions.length > 0;
    });

    return establishments;
  };

  const [establishmentWithSession, setEstablishmentWithSession] = useState(
    getEstablishmentWithSession(),
  );

  const [
    selectedEstablishment,
    setSelectedEstablishment,
  ] = useState<Establishment>(establishmentWithSession[0]);

  useEffect(() => {
    const _establishmentWithSession = getEstablishmentWithSession();
    setEstablishmentWithSession(_establishmentWithSession);
    setSelectedEstablishment(_establishmentWithSession[0]);
  }, [props.establishments, props.coaches, props.sessionMoment]);

  let coaches: Array<Coach | null> = [null];

  if (props.showCoach || props.choseCoach) {
    /* eslint-disable */
    coaches = props.coaches;
    /* eslint-enable */
  }

  const classes = useStyles();
  const { t } = useTranslation('privateService');

  return (
    <Fade in timeout={500}>
      <div className={classes.container}>
        <Typography variant="h5">{t('slotSearcher.selectSession')}</Typography>
        <Paper className={classes.container2}>
          {props.showEstablishment && (
            <Tabs
              key={establishmentWithSession.reduce(
                (prev, now) => prev + now.id,
                '',
              )}
              value={selectedEstablishment?.id ? selectedEstablishment.id : ''}
              onChange={(a, id) =>
                setSelectedEstablishment(
                  establishmentWithSession.find((e) => e.id === id),
                )
              }
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              {establishmentWithSession.map((establishment) => (
                <Tab
                  key={establishment.id}
                  value={establishment.id}
                  label={establishment.title}
                />
              ))}
            </Tabs>
          )}

          <div className={classes.sessionsContainer}>
            {coaches.map((coach: Coach | null, i) => {
              const sessions = getSessionsForCoachAndEstablishment(
                coach,
                selectedEstablishment,
              );

              if (!sessions.length) {
                return null;
              }

              return (
                <div
                  key={coach ? coach.id : i}
                  className={classes.sessionItemContainer}
                >
                  <SessionForCoachSelector
                    coach={coach}
                    establishment={selectedEstablishment}
                    sessions={sessions}
                    timezoneName={props.timezoneName}
                    durationMinutes={props.durationMinutes}
                    onSessionSelect={props.onSessionSelect}
                  />
                </div>
              );
            })}
          </div>
        </Paper>
      </div>
    </Fade>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  container2: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  establishmentItemSelected: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  sessionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginTop: theme.spacing(2),
  },
  sessionItemContainer: {
    minHeight: '100%',
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      flexBasis: '33%',
      maxWidth: '33%',
      minWidth: '33%',
    },
    [theme.breakpoints.down('sm')]: {
      flexBasis: '50%',
      maxWidth: '50%',
      minWidth: '50%',
    },
    [theme.breakpoints.down('xs')]: {
      flexBasis: '100%',
      maxWidth: '100%',
      minWidth: '100%',
    },
  },
}));

export default SessionSelector;
