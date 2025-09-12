import { generateEvent } from '@bsport/analytics';

import { memberProfileViewedEventSchema } from './schemas';

export const trackMemberProfileViewedEvent = generateEvent(
  memberProfileViewedEventSchema,
);
