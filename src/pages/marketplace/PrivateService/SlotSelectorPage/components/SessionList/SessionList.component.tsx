import React, { useContext, useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import SessionListItem from '#src/pages/marketplace/PrivateService/SlotSelectorPage/components/SessionListItem';
import useAvailabilityByEstablishmentAndCoach from '#src/pages/marketplace/PrivateService/SlotSelectorPage/hooks/availabilityByEstablishmentIdAndCoachId.hook';
import useAvailableIntervalsByResource from '#src/pages/marketplace/PrivateService/SlotSelectorPage/hooks/availableIntervalsByResourceId.hook';
import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';
import type { SessionSelectorProps } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/components/types';

const SessionList: React.FC<SessionSelectorProps> = ({
  duration,
  onSessionSelect,
  coaches,
  coachDisplay,
}) => {
  const classes = useStyles();

  const { activeEstablishment } = useContext(SlotSelectorContext);

  const { availableIntervalByCoachId } = useAvailableIntervalsByResource();

  const availabilityByEstablishmentAndCoach =
    useAvailabilityByEstablishmentAndCoach();

  const coachAvailabilitiesByEstablishment = useMemo(
    () =>
      availabilityByEstablishmentAndCoach[activeEstablishment?.id]
        ?.coachAvailabilities,
    [availabilityByEstablishmentAndCoach, activeEstablishment?.id],
  );

  const establishmentAvailabilities =
    availabilityByEstablishmentAndCoach[activeEstablishment?.id]
      ?.establishmentAvailabilities;

  if (coaches?.length) {
    return (
      <div className={classes.sessionsContainer}>
        {coaches.map((coach) => {
          const coachSessions =
            coachAvailabilitiesByEstablishment?.[coach.id] ??
            availableIntervalByCoachId?.[coach.id] ??
            [];
          return (
            <SessionListItem
              key={coach.id}
              coach={coach}
              coachDisplay={coachDisplay}
              duration={duration}
              onSessionSelect={onSessionSelect}
              sessions={coachSessions}
            />
          );
        })}
      </div>
    );
  }
  return (
    <div className={classes.sessionsContainer}>
      <SessionListItem
        duration={duration}
        onSessionSelect={onSessionSelect}
        sessions={establishmentAvailabilities}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  sessionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginTop: theme.spacing(2),
  },
}));

export default React.memo(SessionList);
