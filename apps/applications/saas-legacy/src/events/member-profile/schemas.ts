import { z } from 'zod';
import { memberProfilePageTypeValues } from '../constants';

export const memberProfileViewedEventSchema = z
  .object({
    eventType: z.string().default('member_profile_viewed'),
    page_type: z
      .enum(memberProfilePageTypeValues)
      .describe('The type of member profile page being viewed'),
  })
  .describe('When the user views their member profile page');
