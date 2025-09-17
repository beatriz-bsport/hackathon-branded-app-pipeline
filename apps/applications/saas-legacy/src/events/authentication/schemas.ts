import { z } from 'zod';

export const signupViewedEventSchema = z
  .object({
    eventType: z.string().default('signup_viewed'),
  })
  .describe('When the signup form is displayed to the user');

export const signUpEventSchema = z
  .object({
    eventType: z.string().default('signup'),
  })
  .describe('When the user signs up');

export const loginEventSchema = z
  .object({
    eventType: z.string().default('login'),
  })
  .describe('When the user logs in');

export const loginViewedEventSchema = z
  .object({
    eventType: z.string().default('login_viewed'),
  })
  .describe('When the login form is displayed to the user');

export const resetPasswordViewedEventSchema = z
  .object({
    eventType: z.string().default('reset_password_viewed'),
  })
  .describe('When the user lands on the reset password page');
