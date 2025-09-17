import { generateEvent } from '@bsport/analytics';
import {
  loginEventSchema,
  loginViewedEventSchema,
  resetPasswordViewedEventSchema,
  signUpEventSchema,
  signupViewedEventSchema,
} from './schemas';

export const trackSignupViewedEvent = generateEvent(signupViewedEventSchema);

export const trackSignUpEvent = generateEvent(signUpEventSchema);

export const trackLoginEvent = generateEvent(loginEventSchema);

export const trackLoginViewedEvent = generateEvent(loginViewedEventSchema);

export const trackResetPasswordViewedEvent = generateEvent(
  resetPasswordViewedEventSchema,
);
