import type { Coach } from '#src/libs/associated-coach/types';
import type { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';
import type { Duration } from 'luxon';

export type SessionSelectorProps = {
  coaches: Coach[];
  coachDisplay: MarketPlaceCoachDisplay;
  duration: Duration;
  onSessionSelect: (
    session: string,
    establishmentId: number | null,
    coachId: number | null,
  ) => () => void;
};
